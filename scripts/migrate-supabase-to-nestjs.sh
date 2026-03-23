#!/bin/bash
# =============================================================================
# Supabase → NestJS Data Migration Script
# Run on VPS: bash /opt/azubi-app/scripts/migrate-supabase-to-nestjs.sh
# =============================================================================

set -euo pipefail

SUPA="docker exec supabase-db-1 psql -U supabase_admin -d postgres -t -A"
# Get NestJS DB credentials from the running container
DB_URL=$(docker exec azubi-app-server-1 printenv DATABASE_URL)
# Parse: postgresql://user:pass@host:port/db?schema=public
DB_USER=$(echo "$DB_URL" | sed -n 's|postgresql://\([^:]*\):.*|\1|p')
DB_PASS=$(echo "$DB_URL" | sed -n 's|postgresql://[^:]*:\([^@]*\)@.*|\1|p')
DB_HOST=$(echo "$DB_URL" | sed -n 's|.*@\([^:]*\):.*|\1|p')
DB_PORT=$(echo "$DB_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
DB_NAME=$(echo "$DB_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')

NEST="docker exec -i azubi-app-postgres-1 psql -U $DB_USER -d $DB_NAME"

echo "=== Supabase → NestJS Data Migration ==="
echo "Supabase DB: supabase-db-1"
echo "NestJS DB:   azubi-app-postgres-1 ($DB_NAME)"
echo ""

# Helper: run SQL on NestJS DB
nest_sql() {
  echo "$1" | $NEST -q 2>&1
}

# Helper: export from Supabase as CSV, import to NestJS
# Usage: migrate_table "SELECT ..." "COPY target FROM STDIN CSV HEADER"

# =============================================================================
# Step 1: Migrate Organization
# =============================================================================
echo "--- Step 1: Migrating Organization ---"

ORG_DATA=$($SUPA -c "SELECT row_to_json(o) FROM (
  SELECT id, name, slug,
    contact_name AS \"contactName\",
    contact_email AS \"contactEmail\",
    is_active AS \"isActive\",
    created_at AS \"createdAt\",
    updated_at AS \"updatedAt\"
  FROM organizations LIMIT 1
) o;")

if [ -n "$ORG_DATA" ]; then
  ORG_ID=$(echo "$ORG_DATA" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
  ORG_NAME=$(echo "$ORG_DATA" | python3 -c "import sys,json; print(json.load(sys.stdin)['name'])")
  ORG_SLUG=$(echo "$ORG_DATA" | python3 -c "import sys,json; print(json.load(sys.stdin)['slug'])")
  ORG_CONTACT_NAME=$(echo "$ORG_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('contactName') or '')")
  ORG_CONTACT_EMAIL=$(echo "$ORG_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('contactEmail') or '')")
  ORG_ACTIVE=$(echo "$ORG_DATA" | python3 -c "import sys,json; print(str(json.load(sys.stdin)['isActive']).lower())")
  ORG_CREATED=$(echo "$ORG_DATA" | python3 -c "import sys,json; print(json.load(sys.stdin)['createdAt'])")
  ORG_UPDATED=$(echo "$ORG_DATA" | python3 -c "import sys,json; print(json.load(sys.stdin)['updatedAt'])")

  nest_sql "INSERT INTO \"Organization\" (id, name, slug, \"contactName\", \"contactEmail\", \"isActive\", \"createdAt\", \"updatedAt\")
    VALUES ('$ORG_ID', '$ORG_NAME', '$ORG_SLUG', NULLIF('$ORG_CONTACT_NAME',''), NULLIF('$ORG_CONTACT_EMAIL',''), $ORG_ACTIVE, '$ORG_CREATED', '$ORG_UPDATED')
    ON CONFLICT (id) DO NOTHING;"
  echo "  Organization '$ORG_NAME' migrated (ID: $ORG_ID)"
else
  echo "  ERROR: No organization found in Supabase!"
  exit 1
fi

# =============================================================================
# Step 2: Migrate Users (profiles + auth.users passwords)
# =============================================================================
echo "--- Step 2: Migrating Users ---"

USER_COUNT=0
while IFS='|' read -r uid email name role approved training_end created_at last_login avatar company birth_date can_view_school_cards berichtsheft_profile can_sign_reports is_owner can_view_exam_grades org_id; do
  # Skip empty lines
  [ -z "$uid" ] && continue

  # Get bcrypt password from auth.users
  PW_HASH=$($SUPA -c "SELECT encrypted_password FROM auth.users WHERE id='$uid';" | tr -d '[:space:]')

  # Map role: admin→ADMIN, trainer→AUSBILDER, azubi→AZUBI
  case "$role" in
    admin) NEST_ROLE="ADMIN" ;;
    trainer) NEST_ROLE="AUSBILDER" ;;
    azubi) NEST_ROLE="AZUBI" ;;
    *) NEST_ROLE="AZUBI" ;;
  esac

  # Map approved to status
  if [ "$approved" = "t" ]; then
    NEST_STATUS="APPROVED"
  else
    NEST_STATUS="PENDING"
  fi

  # Escape single quotes in names
  SAFE_NAME=$(echo "$name" | sed "s/'/''/g")
  SAFE_AVATAR=$(echo "$avatar" | sed "s/'/''/g")
  SAFE_COMPANY=$(echo "$company" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"User\" (
    id, email, \"displayName\", \"passwordHash\", role, status,
    \"canSignReports\", \"canViewSchoolCards\", \"canViewExamGrades\",
    \"reportBookProfile\", \"organizationId\", \"trainingEnd\",
    \"lastLoginAt\", avatar, company, \"birthDate\",
    \"isDeleted\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$uid', '$email', '$SAFE_NAME', '$PW_HASH', '$NEST_ROLE', '$NEST_STATUS',
    $can_sign_reports, $can_view_school_cards, $can_view_exam_grades,
    $([ "$berichtsheft_profile" = "" ] && echo "NULL" || echo "'$berichtsheft_profile'"),
    $([ "$org_id" = "" ] && echo "NULL" || echo "'$org_id'"),
    $([ "$training_end" = "" ] && echo "NULL" || echo "'$training_end'"),
    $([ "$last_login" = "" ] && echo "NULL" || echo "'$last_login'"),
    $([ "$avatar" = "" ] && echo "NULL" || echo "'$SAFE_AVATAR'"),
    $([ "$company" = "" ] && echo "NULL" || echo "'$SAFE_COMPANY'"),
    $([ "$birth_date" = "" ] && echo "NULL" || echo "'$birth_date'"),
    false, '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"

  USER_COUNT=$((USER_COUNT + 1))
  echo "  User '$name' ($email) → $NEST_ROLE/$NEST_STATUS"
done < <($SUPA -F'|' -c "SELECT id, email, name, role, approved, training_end, created_at, last_login, avatar, company, birth_date, can_view_school_cards, berichtsheft_profile, can_sign_reports, is_owner, can_view_exam_grades, organization_id FROM profiles ORDER BY created_at;")

echo "  Total: $USER_COUNT users migrated"

# =============================================================================
# Step 3: Migrate user_stats → UserStats
# =============================================================================
echo "--- Step 3: Migrating UserStats ---"

STATS_COUNT=0
while IFS='|' read -r user_id wins losses draws category_stats opponents win_streak best_win_streak created_at updated_at; do
  [ -z "$user_id" ] && continue
  SAFE_CAT_STATS=$(echo "$category_stats" | sed "s/'/''/g")
  SAFE_OPPONENTS=$(echo "$opponents" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"UserStats\" (
    \"userId\", wins, losses, draws, \"categoryStats\", opponents,
    \"winStreak\", \"bestWinStreak\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$user_id', ${wins:-0}, ${losses:-0}, ${draws:-0},
    $([ "$category_stats" = "" ] && echo "NULL" || echo "'$SAFE_CAT_STATS'"),
    $([ "$opponents" = "" ] && echo "NULL" || echo "'$SAFE_OPPONENTS'"),
    ${win_streak:-0}, ${best_win_streak:-0},
    '${created_at:-now()}', '${updated_at:-now()}'
  ) ON CONFLICT (\"userId\") DO NOTHING;"
  STATS_COUNT=$((STATS_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT user_id, wins, losses, draws, category_stats, opponents, win_streak, best_win_streak, created_at, updated_at FROM user_stats;")
echo "  Total: $STATS_COUNT stats migrated"

# =============================================================================
# Step 4: Migrate user_badges → UserXpEvent (or custom badges table)
# Note: NestJS schema doesn't have a badges table — badges might be stored
# differently. For now we skip or store as XP events.
# =============================================================================
echo "--- Step 4: Migrating Badges (as metadata) ---"
echo "  Skipped — badges are computed client-side from stats"

# =============================================================================
# Step 5: Migrate notifications → AppNotification
# =============================================================================
echo "--- Step 5: Migrating Notifications ---"

NOTIF_COUNT=0
while IFS='|' read -r id user_id title message type is_read read_at metadata created_at; do
  [ -z "$id" ] && continue
  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_MSG=$(echo "$message" | sed "s/'/''/g")

  # Map type to NotificationType enum
  NOTIF_TYPE="INFO"
  case "$type" in
    success) NOTIF_TYPE="SUCCESS" ;;
    warning) NOTIF_TYPE="WARNING" ;;
    error) NOTIF_TYPE="ERROR" ;;
    *) NOTIF_TYPE="INFO" ;;
  esac

  nest_sql "INSERT INTO \"AppNotification\" (
    id, \"userId\", title, message, type, \"isRead\", \"readAt\", metadata, \"createdAt\"
  ) VALUES (
    '$id', '$user_id', '$SAFE_TITLE', '$SAFE_MSG', '$NOTIF_TYPE',
    $is_read,
    $([ "$read_at" = "" ] && echo "NULL" || echo "'$read_at'"),
    $([ "$metadata" = "" ] && echo "NULL" || echo "'$metadata'"),
    '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  NOTIF_COUNT=$((NOTIF_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, title, message, type, is_read, read_at, metadata, created_at FROM notifications;")
echo "  Total: $NOTIF_COUNT notifications migrated"

# =============================================================================
# Step 6: Migrate swim_sessions → SwimSession
# =============================================================================
echo "--- Step 6: Migrating SwimSessions ---"

SWIM_COUNT=0
while IFS='|' read -r id user_id date distance_meters time_minutes style_id notes challenge_id status reviewed_by reviewed_at created_at; do
  [ -z "$id" ] && continue
  SAFE_NOTES=$(echo "$notes" | sed "s/'/''/g")

  # Get org_id from user's profile
  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')

  # Map status
  SWIM_STATUS="PENDING"
  case "$status" in
    confirmed) SWIM_STATUS="CONFIRMED" ;;
    rejected) SWIM_STATUS="REJECTED" ;;
    *) SWIM_STATUS="PENDING" ;;
  esac

  nest_sql "INSERT INTO \"SwimSession\" (
    id, \"organizationId\", \"userId\", date, \"distanceMeters\", \"timeMinutes\",
    \"styleId\", notes, \"challengeId\", status, \"reviewedById\", \"reviewedAt\",
    \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$date', ${distance_meters:-0}, ${time_minutes:-0},
    '${style_id:-freestyle}',
    $([ "$notes" = "" ] && echo "NULL" || echo "'$SAFE_NOTES'"),
    $([ "$challenge_id" = "" ] && echo "NULL" || echo "'$challenge_id'"),
    '$SWIM_STATUS',
    $([ "$reviewed_by" = "" ] && echo "NULL" || echo "'$reviewed_by'"),
    $([ "$reviewed_at" = "" ] && echo "NULL" || echo "'$reviewed_at'"),
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  SWIM_COUNT=$((SWIM_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, date, distance_meters, time_minutes, style_id, notes, challenge_id, status, reviewed_by, reviewed_at, created_at FROM swim_sessions;")
echo "  Total: $SWIM_COUNT swim sessions migrated"

# =============================================================================
# Step 7: Migrate messages → ChatMessage
# =============================================================================
echo "--- Step 7: Migrating ChatMessages ---"

MSG_COUNT=0
while IFS='|' read -r id sender_id recipient_id content scope created_at; do
  [ -z "$id" ] && continue
  SAFE_CONTENT=$(echo "$content" | sed "s/'/''/g")

  SENDER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$sender_id';" | tr -d '[:space:]')

  # Map scope
  CHAT_SCOPE="AZUBI_ROOM"
  case "$scope" in
    staff_room) CHAT_SCOPE="STAFF_ROOM" ;;
    direct_staff) CHAT_SCOPE="DIRECT_STAFF" ;;
    *) CHAT_SCOPE="AZUBI_ROOM" ;;
  esac

  nest_sql "INSERT INTO \"ChatMessage\" (
    id, \"organizationId\", scope, \"senderId\", \"recipientId\", content, \"createdAt\"
  ) VALUES (
    '$id', '$SENDER_ORG', '$CHAT_SCOPE', '$sender_id',
    $([ "$recipient_id" = "" ] && echo "NULL" || echo "'$recipient_id'"),
    '$SAFE_CONTENT', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  MSG_COUNT=$((MSG_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, sender_id, recipient_id, content, scope, created_at FROM messages;")
echo "  Total: $MSG_COUNT messages migrated"

# =============================================================================
# Step 8: Migrate resources → Resource
# =============================================================================
echo "--- Step 8: Migrating Resources ---"

RES_COUNT=0
while IFS='|' read -r id user_id title description url category created_at; do
  [ -z "$id" ] && continue
  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_DESC=$(echo "$description" | sed "s/'/''/g")

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')

  nest_sql "INSERT INTO \"Resource\" (
    id, \"organizationId\", \"createdById\", title, description, url, category,
    \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$SAFE_TITLE',
    $([ "$description" = "" ] && echo "NULL" || echo "'$SAFE_DESC'"),
    '$url', '${category:-general}', '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  RES_COUNT=$((RES_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, title, description, url, category, created_at FROM resources;")
echo "  Total: $RES_COUNT resources migrated"

# =============================================================================
# Step 9: Migrate flashcards → Flashcard
# =============================================================================
echo "--- Step 9: Migrating Flashcards ---"

FC_COUNT=0
while IFS='|' read -r id user_id category question answer approved approved_by approved_at created_at; do
  [ -z "$id" ] && continue
  SAFE_Q=$(echo "$question" | sed "s/'/''/g")
  SAFE_A=$(echo "$answer" | sed "s/'/''/g")

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')

  nest_sql "INSERT INTO \"Flashcard\" (
    id, \"organizationId\", \"userId\", \"approvedById\", category, question, answer,
    approved, \"approvedAt\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id',
    $([ "$approved_by" = "" ] && echo "NULL" || echo "'$approved_by'"),
    '$category', '$SAFE_Q', '$SAFE_A',
    $approved,
    $([ "$approved_at" = "" ] && echo "NULL" || echo "'$approved_at'"),
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  FC_COUNT=$((FC_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, category, question, answer, approved, approved_by, approved_at, created_at FROM flashcards;")
echo "  Total: $FC_COUNT flashcards migrated"

# =============================================================================
# Step 10: Migrate push_subscriptions → PushSubscription
# =============================================================================
echo "--- Step 10: Migrating PushSubscriptions ---"

PUSH_COUNT=0
while IFS='|' read -r id user_id endpoint p256dh auth created_at; do
  [ -z "$id" ] && continue

  nest_sql "INSERT INTO \"PushSubscription\" (
    id, \"userId\", endpoint, p256dh, auth, \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$user_id', '$endpoint', '$p256dh', '$auth', '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  PUSH_COUNT=$((PUSH_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, endpoint, p256dh, auth, created_at FROM push_subscriptions;")
echo "  Total: $PUSH_COUNT push subscriptions migrated"

# =============================================================================
# Step 11: Migrate berichtsheft → ReportBookEntry
# =============================================================================
echo "--- Step 11: Migrating ReportBookEntries ---"

BH_COUNT=0
while IFS='|' read -r id user_id user_name week_start week_end ausbildungsjahr nachweis_nr entries bemerkung_azubi bemerkung_ausbilder signatur_azubi signatur_ausbilder datum_azubi datum_ausbilder total_hours status assigned_trainer_id assigned_trainer_name assigned_by_id assigned_at created_at; do
  [ -z "$id" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  SAFE_ENTRIES=$(echo "$entries" | sed "s/'/''/g")
  SAFE_BEM_A=$(echo "$bemerkung_azubi" | sed "s/'/''/g")
  SAFE_BEM_AU=$(echo "$bemerkung_ausbilder" | sed "s/'/''/g")

  BH_STATUS="DRAFT"
  case "$status" in
    submitted) BH_STATUS="SUBMITTED" ;;
    *) BH_STATUS="DRAFT" ;;
  esac

  nest_sql "INSERT INTO \"ReportBookEntry\" (
    id, \"organizationId\", \"userId\", \"assignedTrainerId\", \"assignedById\",
    \"weekStart\", \"weekEnd\", \"trainingYear\", \"evidenceNumber\",
    entries, \"apprenticeNote\", \"trainerNote\",
    \"apprenticeSignature\", \"trainerSignature\",
    \"apprenticeSignedAt\", \"trainerSignedAt\",
    \"totalHours\", status, \"assignedAt\",
    \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id',
    $([ "$assigned_trainer_id" = "" ] && echo "NULL" || echo "'$assigned_trainer_id'"),
    $([ "$assigned_by_id" = "" ] && echo "NULL" || echo "'$assigned_by_id'"),
    '$week_start', '$week_end', ${ausbildungsjahr:-1}, ${nachweis_nr:-1},
    '$SAFE_ENTRIES',
    $([ "$bemerkung_azubi" = "" ] && echo "NULL" || echo "'$SAFE_BEM_A'"),
    $([ "$bemerkung_ausbilder" = "" ] && echo "NULL" || echo "'$SAFE_BEM_AU'"),
    $([ "$signatur_azubi" = "" ] && echo "NULL" || echo "'$signatur_azubi'"),
    $([ "$signatur_ausbilder" = "" ] && echo "NULL" || echo "'$signatur_ausbilder'"),
    $([ "$datum_azubi" = "" ] && echo "NULL" || echo "'$datum_azubi'"),
    $([ "$datum_ausbilder" = "" ] && echo "NULL" || echo "'$datum_ausbilder'"),
    ${total_hours:-0}, '$BH_STATUS',
    $([ "$assigned_at" = "" ] && echo "NULL" || echo "'$assigned_at'"),
    '${created_at:-now()}', '${created_at:-now()}'
  ) ON CONFLICT (id) DO NOTHING;"
  BH_COUNT=$((BH_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, user_name, week_start, week_end, ausbildungsjahr, nachweis_nr, entries, bemerkung_azubi, bemerkung_ausbilder, signatur_azubi, signatur_ausbilder, datum_azubi, datum_ausbilder, total_hours, status, assigned_trainer_id, assigned_trainer_name, assigned_by_id, assigned_at, created_at FROM berichtsheft;")
echo "  Total: $BH_COUNT report book entries migrated"

# =============================================================================
# Step 12: Migrate remaining tables with data
# =============================================================================

echo "--- Step 12: Migrating remaining tables ---"

# games → Duel (16 rows)
echo "  Games/Duels: Skipped — active duels expire, historical duels are stats only"

# swim_monthly_results (2 rows) — no direct NestJS table, skip
echo "  Swim Monthly Results: Skipped — computed from swim_sessions"

# theory_exam_attempts (2 rows)
echo "  Theory Exam Attempts: Skipped — small dataset, users can re-take"

# practical_exam_attempts (2 rows)
PRAC_COUNT=0
while IFS='|' read -r id user_id created_by exam_type average_grade graded_count passed missing_tables result_rows created_at; do
  [ -z "$id" ] && continue
  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  SAFE_ROWS=$(echo "$result_rows" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"PracticalExamAttempt\" (
    id, \"organizationId\", \"userId\", \"createdById\", \"examType\",
    \"averageGrade\", \"gradedCount\", passed, \"missingTables\",
    \"resultRows\", \"createdAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '${created_by:-$user_id}', '${exam_type:-practical}',
    $([ "$average_grade" = "" ] && echo "NULL" || echo "$average_grade"),
    ${graded_count:-0},
    $([ "$passed" = "" ] && echo "NULL" || echo "$passed"),
    ${missing_tables:-0},
    '$SAFE_ROWS', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  PRAC_COUNT=$((PRAC_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, created_by, exam_type, average_grade, graded_count, passed, missing_tables, result_rows, created_at FROM practical_exam_attempts;")
echo "  Practical Exam Attempts: $PRAC_COUNT migrated"

# forum_posts (2 rows)
FP_COUNT=0
while IFS='|' read -r id user_id category title content pinned locked last_reply_at created_at; do
  [ -z "$id" ] && continue
  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_CONTENT=$(echo "$content" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"ForumPost\" (
    id, \"organizationId\", \"userId\", category, title, content,
    pinned, locked, \"lastReplyAt\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$category', '$SAFE_TITLE', '$SAFE_CONTENT',
    ${pinned:-false}, ${locked:-false},
    $([ "$last_reply_at" = "" ] && echo "NULL" || echo "'$last_reply_at'"),
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  FP_COUNT=$((FP_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, category, title, content, pinned, locked, last_reply_at, created_at FROM forum_posts;")
echo "  Forum Posts: $FP_COUNT migrated"

# news (1 row)
NEWS_COUNT=0
while IFS='|' read -r id user_id title content created_at; do
  [ -z "$id" ] && continue
  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_CONTENT=$(echo "$content" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"NewsPost\" (
    id, \"organizationId\", \"createdById\", title, content, \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$SAFE_TITLE', '$SAFE_CONTENT',
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  NEWS_COUNT=$((NEWS_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, title, content, created_at FROM news;")
echo "  News: $NEWS_COUNT migrated"

# school_attendance (1 row)
SA_COUNT=0
while IFS='|' read -r id user_id user_name date start_time end_time teacher_signature trainer_signature created_at; do
  [ -z "$id" ] && continue
  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')

  nest_sql "INSERT INTO \"SchoolAttendanceEntry\" (
    id, \"organizationId\", \"userId\", date, \"startTime\", \"endTime\",
    \"teacherSignature\", \"trainerSignature\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$date', '${start_time:-08:00}', '${end_time:-13:00}',
    $([ "$teacher_signature" = "" ] && echo "NULL" || echo "'$teacher_signature'"),
    $([ "$trainer_signature" = "" ] && echo "NULL" || echo "'$trainer_signature'"),
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  SA_COUNT=$((SA_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, user_name, date, start_time, end_time, teacher_signature, trainer_signature, created_at FROM school_attendance;")
echo "  School Attendance: $SA_COUNT migrated"

# app_config (1 row)
AC_COUNT=0
while IFS='|' read -r id organization_id menu_items theme_colors updated_by created_at updated_at; do
  [ -z "$id" ] && continue
  SAFE_MENU=$(echo "$menu_items" | sed "s/'/''/g")
  SAFE_THEME=$(echo "$theme_colors" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"AppConfig\" (
    id, \"organizationId\", \"menuItems\", \"themeColors\", \"updatedById\",
    \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$organization_id', '$SAFE_MENU', '$SAFE_THEME',
    $([ "$updated_by" = "" ] && echo "NULL" || echo "'$updated_by'"),
    '$created_at', '${updated_at:-$created_at}'
  ) ON CONFLICT (id) DO NOTHING;"
  AC_COUNT=$((AC_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, organization_id, menu_items, theme_colors, updated_by, created_at, updated_at FROM app_config;")
echo "  App Config: $AC_COUNT migrated"

# exams (1 row)
EX_COUNT=0
while IFS='|' read -r id user_id title description exam_date location created_at; do
  [ -z "$id" ] && continue
  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_DESC=$(echo "$description" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"ScheduledExam\" (
    id, \"organizationId\", \"createdById\", title, description, \"examDate\", location,
    \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$SAFE_TITLE',
    $([ "$description" = "" ] && echo "NULL" || echo "'$SAFE_DESC'"),
    $([ "$exam_date" = "" ] && echo "NULL" || echo "'$exam_date'"),
    $([ "$location" = "" ] && echo "NULL" || echo "'$location'"),
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  EX_COUNT=$((EX_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, title, description, exam_date, location, created_at FROM exams;")
echo "  Scheduled Exams: $EX_COUNT migrated"

echo ""
echo "=== Migration Complete ==="
echo "Users: $USER_COUNT | Stats: $STATS_COUNT | Notifications: $NOTIF_COUNT"
echo "Swim: $SWIM_COUNT | Messages: $MSG_COUNT | Resources: $RES_COUNT"
echo "Flashcards: $FC_COUNT | Push: $PUSH_COUNT | Reports: $BH_COUNT"
echo ""
echo "IMPORTANT: Users' passwords are bcrypt-hashed from Supabase."
echo "The NestJS auth service has bcrypt fallback — on first login,"
echo "passwords will be automatically re-hashed to Argon2."
