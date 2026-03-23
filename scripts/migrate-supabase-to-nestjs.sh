#!/bin/bash
# =============================================================================
# Supabase → NestJS Data Migration Script (v2 — corrected column names)
# Run on VPS: bash /opt/azubi-app/scripts/migrate-supabase-to-nestjs.sh
# =============================================================================

set -euo pipefail

SUPA="docker exec supabase-db-1 psql -U supabase_admin -d postgres -t -A"
DB_URL=$(docker exec azubi-app-server-1 printenv DATABASE_URL)
DB_USER=$(echo "$DB_URL" | sed -n 's|postgresql://\([^:]*\):.*|\1|p')
DB_NAME=$(echo "$DB_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
NEST="docker exec -i azubi-app-postgres-1 psql -U $DB_USER -d $DB_NAME"

nest_sql() {
  echo "$1" | $NEST -q 2>&1
}

# Convert postgres boolean t/f to true/false
bool() {
  case "$1" in
    t) echo "true" ;;
    f) echo "false" ;;
    true) echo "true" ;;
    false) echo "false" ;;
    *) echo "false" ;;
  esac
}

echo "=== Supabase → NestJS Data Migration v3 ==="
echo ""

# =============================================================================
# Step 0: Ensure NestJS DB has latest schema (add missing columns)
# =============================================================================
echo "--- Step 0: Ensuring schema is up-to-date ---"
nest_sql 'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "canViewSchoolCards" BOOLEAN NOT NULL DEFAULT false;'
nest_sql 'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "canViewExamGrades" BOOLEAN NOT NULL DEFAULT false;'
echo "  Schema updated"

# =============================================================================
# Step 1: Migrate Organization
# =============================================================================
echo "--- Step 1: Migrating Organization ---"

$SUPA -F'|' -c "SELECT id, name, slug, contact_name, contact_email, is_active, created_at, updated_at FROM organizations;" | while IFS='|' read -r id name slug cname cemail active cat uat; do
  [ -z "$id" ] && continue
  SAFE_NAME=$(echo "$name" | sed "s/'/''/g")
  nest_sql "INSERT INTO \"Organization\" (id, name, slug, \"contactName\", \"contactEmail\", \"isActive\", \"createdAt\", \"updatedAt\")
    VALUES ('$id', '$SAFE_NAME', '$slug', NULLIF('$cname',''), NULLIF('$cemail',''), $(bool "$active"), '$cat', '$uat')
    ON CONFLICT (id) DO NOTHING;"
  echo "  Organization '$name' migrated"
done

# =============================================================================
# Step 2: Migrate Users (profiles + auth.users passwords)
# =============================================================================
echo "--- Step 2: Migrating Users ---"

USER_COUNT=0
while IFS='|' read -r uid email name role approved training_end created_at last_login avatar company birth_date can_view_school_cards berichtsheft_profile can_sign_reports is_owner can_view_exam_grades org_id; do
  [ -z "$uid" ] && continue

  PW_HASH=$($SUPA -c "SELECT encrypted_password FROM auth.users WHERE id='$uid';" | tr -d '[:space:]')
  [ -z "$PW_HASH" ] && PW_HASH='no-password-migrated'

  case "$role" in
    admin) NEST_ROLE="ADMIN" ;;
    trainer) NEST_ROLE="AUSBILDER" ;;
    *) NEST_ROLE="AZUBI" ;;
  esac

  [ "$approved" = "t" ] && NEST_STATUS="APPROVED" || NEST_STATUS="PENDING"

  SAFE_NAME=$(echo "$name" | sed "s/'/''/g")
  SAFE_AVATAR=$(echo "$avatar" | sed "s/'/''/g")
  SAFE_COMPANY=$(echo "$company" | sed "s/'/''/g")
  SAFE_BH_PROFILE=$(echo "$berichtsheft_profile" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"User\" (
    id, email, \"displayName\", \"passwordHash\", role, status,
    \"canSignReports\", \"canViewSchoolCards\", \"canViewExamGrades\",
    \"reportBookProfile\", \"organizationId\", \"trainingEnd\",
    \"lastLoginAt\", avatar, company, \"birthDate\",
    \"isDeleted\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$uid', '$email', '$SAFE_NAME', '$PW_HASH', '$NEST_ROLE', '$NEST_STATUS',
    $(bool "${can_sign_reports:-f}"), $(bool "${can_view_school_cards:-f}"), $(bool "${can_view_exam_grades:-f}"),
    $([ -z "$berichtsheft_profile" ] && echo "NULL" || echo "'$SAFE_BH_PROFILE'"),
    $([ -z "$org_id" ] && echo "NULL" || echo "'$org_id'"),
    $([ -z "$training_end" ] && echo "NULL" || echo "'$training_end'"),
    $([ -z "$last_login" ] && echo "NULL" || echo "'$last_login'"),
    $([ -z "$avatar" ] && echo "NULL" || echo "'$SAFE_AVATAR'"),
    $([ -z "$company" ] && echo "NULL" || echo "'$SAFE_COMPANY'"),
    $([ -z "$birth_date" ] && echo "NULL" || echo "'$birth_date'"),
    false, '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"

  USER_COUNT=$((USER_COUNT + 1))
  echo "  [$USER_COUNT] $name ($email) → $NEST_ROLE/$NEST_STATUS"
done < <($SUPA -F'|' -c "SELECT id, email, name, role, approved, training_end, created_at, last_login, avatar, company, birth_date, can_view_school_cards, berichtsheft_profile, can_sign_reports, is_owner, can_view_exam_grades, organization_id FROM profiles ORDER BY created_at;")
echo "  Total: $USER_COUNT users"

# =============================================================================
# Step 3: Migrate user_stats → UserStats
# Supabase cols: id, user_id, wins, losses, draws, category_stats, opponents
# =============================================================================
echo "--- Step 3: Migrating UserStats ---"

STATS_COUNT=0
while IFS='|' read -r id user_id wins losses draws category_stats opponents; do
  [ -z "$user_id" ] && continue
  SAFE_CS=$(echo "$category_stats" | sed "s/'/''/g")
  SAFE_OP=$(echo "$opponents" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"UserStats\" (
    \"userId\", wins, losses, draws, \"categoryStats\", opponents,
    \"winStreak\", \"bestWinStreak\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$user_id', ${wins:-0}, ${losses:-0}, ${draws:-0},
    $([ -z "$category_stats" ] && echo "NULL" || echo "'$SAFE_CS'"),
    $([ -z "$opponents" ] && echo "NULL" || echo "'$SAFE_OP'"),
    0, 0, now(), now()
  ) ON CONFLICT (\"userId\") DO NOTHING;"
  STATS_COUNT=$((STATS_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, wins, losses, draws, category_stats, opponents FROM user_stats;")
echo "  Total: $STATS_COUNT stats"

# =============================================================================
# Step 4: Migrate notifications → AppNotification
# Supabase cols: id, user_name, title, message, type, read, created_at
# Need to resolve user_name → user_id
# =============================================================================
echo "--- Step 4: Migrating Notifications ---"

NOTIF_COUNT=0
while IFS='|' read -r id user_name title message type is_read created_at; do
  [ -z "$id" ] && continue

  # Resolve user_name to user_id
  RESOLVED_UID=$($SUPA -c "SELECT id FROM profiles WHERE name='$(echo "$user_name" | sed "s/'/''/g")' LIMIT 1;" | tr -d '[:space:]')
  [ -z "$RESOLVED_UID" ] && continue

  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_MSG=$(echo "$message" | sed "s/'/''/g")

  NOTIF_TYPE="INFO"
  case "$type" in
    success) NOTIF_TYPE="SUCCESS" ;;
    warning) NOTIF_TYPE="WARNING" ;;
    error) NOTIF_TYPE="ERROR" ;;
  esac

  nest_sql "INSERT INTO \"AppNotification\" (
    id, \"userId\", title, message, type, \"isRead\", \"createdAt\"
  ) VALUES (
    '$id', '$RESOLVED_UID', '$SAFE_TITLE', '$SAFE_MSG', '$NOTIF_TYPE',
    $(bool "$is_read"), '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  NOTIF_COUNT=$((NOTIF_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_name, title, message, type, read, created_at FROM notifications;")
echo "  Total: $NOTIF_COUNT notifications"

# =============================================================================
# Step 5: Migrate swim_sessions → SwimSession
# Supabase cols: id, user_id, user_name, user_role, date, distance,
#   time_minutes, style, notes, challenge_id, confirmed, confirmed_by,
#   confirmed_at, created_at
# =============================================================================
echo "--- Step 5: Migrating SwimSessions ---"

SWIM_COUNT=0
while IFS='|' read -r id user_id user_name user_role date distance time_minutes style notes challenge_id confirmed confirmed_by confirmed_at created_at; do
  [ -z "$id" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  [ -z "$USER_ORG" ] && continue

  SAFE_NOTES=$(echo "$notes" | sed "s/'/''/g")

  # Map confirmed boolean to status enum
  if [ "$confirmed" = "t" ]; then
    SWIM_STATUS="CONFIRMED"
  else
    SWIM_STATUS="PENDING"
  fi

  # Resolve confirmed_by (name) to user_id
  REVIEWER_ID=""
  if [ -n "$confirmed_by" ]; then
    REVIEWER_ID=$($SUPA -c "SELECT id FROM profiles WHERE name='$(echo "$confirmed_by" | sed "s/'/''/g")' LIMIT 1;" | tr -d '[:space:]')
  fi

  nest_sql "INSERT INTO \"SwimSession\" (
    id, \"organizationId\", \"userId\", date, \"distanceMeters\", \"timeMinutes\",
    \"styleId\", notes, \"challengeId\", status, \"reviewedById\", \"reviewedAt\",
    \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$date', ${distance:-0}, ${time_minutes:-0},
    '${style:-freestyle}',
    $([ -z "$notes" ] && echo "NULL" || echo "'$SAFE_NOTES'"),
    $([ -z "$challenge_id" ] && echo "NULL" || echo "'$challenge_id'"),
    '$SWIM_STATUS',
    $([ -z "$REVIEWER_ID" ] && echo "NULL" || echo "'$REVIEWER_ID'"),
    $([ -z "$confirmed_at" ] && echo "NULL" || echo "'$confirmed_at'"),
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  SWIM_COUNT=$((SWIM_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, user_name, user_role, date, distance, time_minutes, style, notes, challenge_id, confirmed, confirmed_by, confirmed_at, created_at FROM swim_sessions;")
echo "  Total: $SWIM_COUNT swim sessions"

# =============================================================================
# Step 6: Migrate messages → ChatMessage
# Supabase cols: id, user_name, content, created_at, user_avatar,
#   sender_id, user_role, organization_id, chat_scope, recipient_id
# =============================================================================
echo "--- Step 6: Migrating ChatMessages ---"

MSG_COUNT=0
while IFS='|' read -r id user_name content created_at user_avatar sender_id user_role org_id chat_scope recipient_id; do
  [ -z "$id" ] && continue
  [ -z "$sender_id" ] && continue
  [ -z "$org_id" ] && continue

  SAFE_CONTENT=$(echo "$content" | sed "s/'/''/g")

  CHAT_SCOPE="AZUBI_ROOM"
  case "$chat_scope" in
    staff_room) CHAT_SCOPE="STAFF_ROOM" ;;
    direct_staff) CHAT_SCOPE="DIRECT_STAFF" ;;
  esac

  nest_sql "INSERT INTO \"ChatMessage\" (
    id, \"organizationId\", scope, \"senderId\", \"recipientId\", content, \"createdAt\"
  ) VALUES (
    '$id', '$org_id', '$CHAT_SCOPE', '$sender_id',
    $([ -z "$recipient_id" ] && echo "NULL" || echo "'$recipient_id'"),
    '$SAFE_CONTENT', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  MSG_COUNT=$((MSG_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_name, content, created_at, user_avatar, sender_id, user_role, organization_id, chat_scope, recipient_id FROM messages;")
echo "  Total: $MSG_COUNT messages"

# =============================================================================
# Step 7: Migrate resources → Resource
# Supabase cols: id, title, description, url, category, created_by (text!), created_at
# created_by is a name, not UUID — need to resolve
# =============================================================================
echo "--- Step 7: Migrating Resources ---"

RES_COUNT=0
while IFS='|' read -r id title description url category created_by created_at; do
  [ -z "$id" ] && continue

  CREATOR_ID=$($SUPA -c "SELECT id FROM profiles WHERE name='$(echo "$created_by" | sed "s/'/''/g")' LIMIT 1;" | tr -d '[:space:]')
  [ -z "$CREATOR_ID" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$CREATOR_ID';" | tr -d '[:space:]')
  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_DESC=$(echo "$description" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"Resource\" (
    id, \"organizationId\", \"createdById\", title, description, url, category,
    \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$CREATOR_ID', '$SAFE_TITLE',
    $([ -z "$description" ] && echo "NULL" || echo "'$SAFE_DESC'"),
    '$url', '${category:-general}', '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  RES_COUNT=$((RES_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, title, description, url, category, created_by, created_at FROM resources;")
echo "  Total: $RES_COUNT resources"

# =============================================================================
# Step 8: Migrate flashcards → Flashcard
# Supabase cols: id, user_id, category, question, answer, approved, created_at
# =============================================================================
echo "--- Step 8: Migrating Flashcards ---"

FC_COUNT=0
while IFS='|' read -r id user_id category question answer approved created_at; do
  [ -z "$id" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  [ -z "$USER_ORG" ] && continue

  SAFE_Q=$(echo "$question" | sed "s/'/''/g")
  SAFE_A=$(echo "$answer" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"Flashcard\" (
    id, \"organizationId\", \"userId\", category, question, answer,
    approved, \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$category', '$SAFE_Q', '$SAFE_A',
    $(bool "$approved"), '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  FC_COUNT=$((FC_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, category, question, answer, approved, created_at FROM flashcards;")
echo "  Total: $FC_COUNT flashcards"

# =============================================================================
# Step 9: Migrate push_subscriptions → PushSubscription
# =============================================================================
echo "--- Step 9: Migrating PushSubscriptions ---"

PUSH_COUNT=0
PUSH_SKIP=0
while IFS='|' read -r id user_id endpoint p256dh auth user_agent created_at updated_at; do
  [ -z "$id" ] && continue

  # Check if user exists in NestJS DB
  USER_EXISTS=$(nest_sql "SELECT count(*) FROM \"User\" WHERE id='$user_id';" | tr -d '[:space:]')
  if [ "$USER_EXISTS" = "0" ]; then
    PUSH_SKIP=$((PUSH_SKIP + 1))
    continue
  fi

  nest_sql "INSERT INTO \"PushSubscription\" (
    id, \"userId\", endpoint, p256dh, auth, \"userAgent\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$user_id', '$endpoint', '$p256dh', '$auth',
    $([ -z "$user_agent" ] && echo "NULL" || echo "'$user_agent'"),
    '$created_at', '${updated_at:-$created_at}'
  ) ON CONFLICT (id) DO NOTHING;"
  PUSH_COUNT=$((PUSH_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, endpoint, p256dh, auth, user_agent, created_at, updated_at FROM push_subscriptions;")
echo "  Total: $PUSH_COUNT push subs ($PUSH_SKIP skipped — user not found)"

# =============================================================================
# Step 10: Migrate berichtsheft → ReportBookEntry
# =============================================================================
echo "--- Step 10: Migrating ReportBookEntries ---"

BH_COUNT=0
while IFS='|' read -r id user_id week_start week_end ausbildungsjahr nachweis_nr entries bemerkung_azubi bemerkung_ausbilder signatur_azubi signatur_ausbilder datum_azubi datum_ausbilder total_hours assigned_trainer_id assigned_by_id assigned_at created_at status; do
  [ -z "$id" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  [ -z "$USER_ORG" ] && continue

  # Check user exists
  USER_EXISTS=$(nest_sql "SELECT count(*) FROM \"User\" WHERE id='$user_id';" | tr -d '[:space:]')
  [ "$USER_EXISTS" = "0" ] && continue

  SAFE_ENTRIES=$(echo "$entries" | sed "s/'/''/g")
  SAFE_BEM_A=$(echo "$bemerkung_azubi" | sed "s/'/''/g")
  SAFE_BEM_AU=$(echo "$bemerkung_ausbilder" | sed "s/'/''/g")

  BH_STATUS="DRAFT"
  [ "$status" = "submitted" ] && BH_STATUS="SUBMITTED"

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
    $([ -z "$assigned_trainer_id" ] && echo "NULL" || echo "'$assigned_trainer_id'"),
    $([ -z "$assigned_by_id" ] && echo "NULL" || echo "'$assigned_by_id'"),
    '$week_start', '$week_end', ${ausbildungsjahr:-1}, ${nachweis_nr:-1},
    '$SAFE_ENTRIES',
    $([ -z "$bemerkung_azubi" ] && echo "NULL" || echo "'$SAFE_BEM_A'"),
    $([ -z "$bemerkung_ausbilder" ] && echo "NULL" || echo "'$SAFE_BEM_AU'"),
    $([ -z "$signatur_azubi" ] && echo "NULL" || echo "'$signatur_azubi'"),
    $([ -z "$signatur_ausbilder" ] && echo "NULL" || echo "'$signatur_ausbilder'"),
    $([ -z "$datum_azubi" ] && echo "NULL" || echo "'$datum_azubi'"),
    $([ -z "$datum_ausbilder" ] && echo "NULL" || echo "'$datum_ausbilder'"),
    ${total_hours:-0}, '$BH_STATUS',
    $([ -z "$assigned_at" ] && echo "NULL" || echo "'$assigned_at'"),
    '${created_at:-now()}', '${created_at:-now()}'
  ) ON CONFLICT (id) DO NOTHING;"
  BH_COUNT=$((BH_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, week_start, week_end, ausbildungsjahr, nachweis_nr, entries, bemerkung_azubi, bemerkung_ausbilder, signatur_azubi, signatur_ausbilder, datum_azubi, datum_ausbilder, total_hours, assigned_trainer_id, assigned_by_id, assigned_at, created_at, status FROM berichtsheft;")
echo "  Total: $BH_COUNT report books"

# =============================================================================
# Step 11: Migrate school_attendance → SchoolAttendanceEntry
# =============================================================================
echo "--- Step 11: Migrating SchoolAttendance ---"

SA_COUNT=0
while IFS='|' read -r id user_name date start_time end_time teacher_sig trainer_sig created_at user_id; do
  [ -z "$id" ] && continue
  [ -z "$user_id" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  [ -z "$USER_ORG" ] && continue

  nest_sql "INSERT INTO \"SchoolAttendanceEntry\" (
    id, \"organizationId\", \"userId\", date, \"startTime\", \"endTime\",
    \"teacherSignature\", \"trainerSignature\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$date', '$start_time', '$end_time',
    $([ -z "$teacher_sig" ] && echo "NULL" || echo "'$teacher_sig'"),
    $([ -z "$trainer_sig" ] && echo "NULL" || echo "'$trainer_sig'"),
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  SA_COUNT=$((SA_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_name, date, start_time, end_time, teacher_signature, trainer_signature, created_at, user_id FROM school_attendance;")
echo "  Total: $SA_COUNT school attendance"

# =============================================================================
# Step 12: Migrate practical_exam_attempts → PracticalExamAttempt
# Supabase: id (bigint!), user_id, exam_type, average_grade, graded_count,
#   passed, result_rows, created_by, created_at
# =============================================================================
echo "--- Step 12: Migrating PracticalExamAttempts ---"

PRAC_COUNT=0
while IFS='|' read -r id user_id exam_type average_grade graded_count passed result_rows created_by created_at; do
  [ -z "$id" ] && continue
  [ -z "$user_id" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  [ -z "$USER_ORG" ] && continue

  SAFE_ROWS=$(echo "$result_rows" | sed "s/'/''/g")
  # Generate a CUID-like ID since Supabase uses bigint
  NEW_ID="prac_$(echo "$id" | md5sum | head -c 20)"

  nest_sql "INSERT INTO \"PracticalExamAttempt\" (
    id, \"organizationId\", \"userId\", \"createdById\", \"examType\",
    \"averageGrade\", \"gradedCount\", passed, \"missingTables\",
    \"resultRows\", \"createdAt\"
  ) VALUES (
    '$NEW_ID', '$USER_ORG', '$user_id', '${created_by:-$user_id}', '${exam_type:-practical}',
    $([ -z "$average_grade" ] && echo "NULL" || echo "$average_grade"),
    ${graded_count:-0},
    $([ -z "$passed" ] && echo "NULL" || echo "$(bool "$passed")"),
    0, '$SAFE_ROWS', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  PRAC_COUNT=$((PRAC_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, exam_type, average_grade, graded_count, passed, result_rows, created_by, created_at FROM practical_exam_attempts;")
echo "  Total: $PRAC_COUNT practical exams"

# =============================================================================
# Step 13: Migrate forum_posts → ForumPost
# =============================================================================
echo "--- Step 13: Migrating ForumPosts ---"

FP_COUNT=0
while IFS='|' read -r id user_id category title content pinned locked last_reply_at created_at; do
  [ -z "$id" ] && continue
  [ -z "$user_id" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  [ -z "$USER_ORG" ] && continue

  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_CONTENT=$(echo "$content" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"ForumPost\" (
    id, \"organizationId\", \"userId\", category, title, content,
    pinned, locked, \"lastReplyAt\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$category', '$SAFE_TITLE', '$SAFE_CONTENT',
    $(bool "${pinned:-f}"), $(bool "${locked:-f}"),
    $([ -z "$last_reply_at" ] && echo "NULL" || echo "'$last_reply_at'"),
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  FP_COUNT=$((FP_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, category, title, content, pinned, locked, last_reply_at, created_at FROM forum_posts;")
echo "  Total: $FP_COUNT forum posts"

# =============================================================================
# Step 14: Migrate news → NewsPost
# Supabase cols: id, title, content, author (text!), created_at
# =============================================================================
echo "--- Step 14: Migrating News ---"

NEWS_COUNT=0
while IFS='|' read -r id title content author created_at; do
  [ -z "$id" ] && continue

  CREATOR_ID=$($SUPA -c "SELECT id FROM profiles WHERE name='$(echo "$author" | sed "s/'/''/g")' LIMIT 1;" | tr -d '[:space:]')
  [ -z "$CREATOR_ID" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$CREATOR_ID';" | tr -d '[:space:]')
  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_CONTENT=$(echo "$content" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"NewsPost\" (
    id, \"organizationId\", \"createdById\", title, content, \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$CREATOR_ID', '$SAFE_TITLE', '$SAFE_CONTENT',
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  NEWS_COUNT=$((NEWS_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, title, content, author, created_at FROM news;")
echo "  Total: $NEWS_COUNT news"

# =============================================================================
# Step 15: Migrate exams → ScheduledExam
# Supabase cols: id, title, description, exam_date, location, created_by (text!), created_at
# =============================================================================
echo "--- Step 15: Migrating ScheduledExams ---"

EX_COUNT=0
while IFS='|' read -r id title description exam_date location created_by created_at; do
  [ -z "$id" ] && continue

  CREATOR_ID=$($SUPA -c "SELECT id FROM profiles WHERE name='$(echo "$created_by" | sed "s/'/''/g")' LIMIT 1;" | tr -d '[:space:]')
  [ -z "$CREATOR_ID" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$CREATOR_ID';" | tr -d '[:space:]')
  SAFE_TITLE=$(echo "$title" | sed "s/'/''/g")
  SAFE_DESC=$(echo "$description" | sed "s/'/''/g")

  nest_sql "INSERT INTO \"ScheduledExam\" (
    id, \"organizationId\", \"createdById\", title, description, \"examDate\", location,
    \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$CREATOR_ID', '$SAFE_TITLE',
    $([ -z "$description" ] && echo "NULL" || echo "'$SAFE_DESC'"),
    $([ -z "$exam_date" ] && echo "NULL" || echo "'$exam_date'"),
    $([ -z "$location" ] && echo "NULL" || echo "'$location'"),
    '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  EX_COUNT=$((EX_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, title, description, exam_date, location, created_by, created_at FROM exams;")
echo "  Total: $EX_COUNT scheduled exams"

# =============================================================================
# Step 16: Migrate app_config → AppConfig
# Supabase cols: id (text!), menu_items, theme_colors, updated_at, updated_by
# No organization_id or created_at in Supabase — use org from Step 1
# =============================================================================
echo "--- Step 16: Migrating AppConfig ---"

AC_COUNT=0
while IFS='|' read -r id menu_items theme_colors updated_at updated_by; do
  [ -z "$id" ] && continue
  SAFE_MENU=$(echo "$menu_items" | sed "s/'/''/g")
  SAFE_THEME=$(echo "$theme_colors" | sed "s/'/''/g")

  # Get first org_id
  FIRST_ORG=$($SUPA -c "SELECT id FROM organizations LIMIT 1;" | tr -d '[:space:]')

  nest_sql "INSERT INTO \"AppConfig\" (
    id, \"organizationId\", \"menuItems\", \"themeColors\", \"updatedById\",
    \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$id', '$FIRST_ORG', '$SAFE_MENU', '$SAFE_THEME',
    $([ -z "$updated_by" ] && echo "NULL" || echo "'$updated_by'"),
    '${updated_at:-now()}', '${updated_at:-now()}'
  ) ON CONFLICT (id) DO NOTHING;"
  AC_COUNT=$((AC_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, menu_items, theme_colors, updated_at, updated_by FROM app_config;")
echo "  Total: $AC_COUNT app configs"

# =============================================================================
# Step 17: Migrate theory_exam_attempts → TheoryExamAttempt
# Supabase cols: id, user_id, correct, total, percentage, passed, time_ms,
#   keyword_mode, created_at
# NestJS needs a TheoryExamSession first, then TheoryExamAttempt
# =============================================================================
echo "--- Step 17: Migrating TheoryExamAttempts ---"

TEA_COUNT=0
while IFS='|' read -r id user_id correct total percentage passed time_ms keyword_mode created_at; do
  [ -z "$id" ] && continue
  [ -z "$user_id" ] && continue

  USER_ORG=$($SUPA -c "SELECT organization_id FROM profiles WHERE id='$user_id';" | tr -d '[:space:]')
  [ -z "$USER_ORG" ] && continue

  # Create a session first
  SESSION_ID="ses_$(echo "$id" | md5sum | head -c 20)"

  nest_sql "INSERT INTO \"TheoryExamSession\" (
    id, \"organizationId\", \"userId\", \"keywordMode\", questions, \"totalQuestions\",
    \"startedAt\", \"expiresAt\", \"completedAt\", \"createdAt\", \"updatedAt\"
  ) VALUES (
    '$SESSION_ID', '$USER_ORG', '$user_id', $(bool "${keyword_mode:-f}"), '[]'::jsonb, ${total:-0},
    '$created_at', '$created_at', '$created_at', '$created_at', '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"

  nest_sql "INSERT INTO \"TheoryExamAttempt\" (
    id, \"organizationId\", \"userId\", \"sessionId\", correct, total,
    percentage, passed, \"timeMs\", \"keywordMode\", \"createdAt\"
  ) VALUES (
    '$id', '$USER_ORG', '$user_id', '$SESSION_ID', ${correct:-0}, ${total:-0},
    ${percentage:-0}, $(bool "$passed"), ${time_ms:-0}, $(bool "${keyword_mode:-f}"), '$created_at'
  ) ON CONFLICT (id) DO NOTHING;"
  TEA_COUNT=$((TEA_COUNT + 1))
done < <($SUPA -F'|' -c "SELECT id, user_id, correct, total, percentage, passed, time_ms, keyword_mode, created_at FROM theory_exam_attempts;")
echo "  Total: $TEA_COUNT theory exam attempts"

# =============================================================================
echo ""
echo "=== Migration Complete ==="
echo ""
echo "IMPORTANT: Users can log in with their existing Supabase passwords."
echo "On first login, passwords are auto-rehashed from bcrypt to Argon2."
echo ""
echo "Tables with 0 rows in Supabase were skipped:"
echo "  materials, forum_replies, custom_questions, swim_training_plans_custom,"
echo "  invitation_codes, exam_grades, question_reports"
