import React from 'react';

const OPERATOR = {
  name: 'Dennie Gulbinski',
  street: 'Zeitstraße 108',
  city: '53721 Siegburg',
  email: 'denniegulbinski@gmail.com'
};

const LAST_UPDATED = '06.04.2026';
const listClassName = 'list-disc list-inside ml-2 space-y-1';

export function LegalImprintContent({
  containerClassName = 'space-y-6',
  headingClassName = 'font-bold',
  textClassName = 'text-sm',
  noteClassName = 'text-xs text-gray-500'
}) {
  return (
    <div className={containerClassName}>
      <section>
        <h3 className={headingClassName}>Angaben gemäß § 5 DDG</h3>
        <p className={textClassName}>
          {OPERATOR.name}
          <br />
          {OPERATOR.street}
          <br />
          {OPERATOR.city}
        </p>
      </section>

      <section>
        <h3 className={headingClassName}>Kontakt</h3>
        <p className={textClassName}>E-Mail: {OPERATOR.email}</p>
      </section>

      <section>
        <h3 className={headingClassName}>Verantwortlich für journalistisch-redaktionelle Inhalte</h3>
        <p className={textClassName}>
          gemäß § 18 Abs. 2 MStV, soweit anwendbar:
          <br />
          {OPERATOR.name}
          <br />
          {OPERATOR.street}
          <br />
          {OPERATOR.city}
        </p>
      </section>

      <section>
        <p className={noteClassName}>
          Stand: {LAST_UPDATED}. Für vertragliche, datenschutzrechtliche oder betriebliche Anfragen
          gelten ergänzend die jeweils im Vertrag oder im Betreiberkontext benannten Ansprechpartner.
        </p>
      </section>
    </div>
  );
}

export function LegalPrivacyContent({
  introClassName = 'text-xs text-gray-500',
  containerClassName = 'space-y-6',
  headingClassName = 'font-bold',
  textClassName = 'text-sm',
  dividerClassName = 'pt-4 border-t border-gray-200',
  noteClassName = 'text-xs text-gray-500'
}) {
  return (
    <>
      <p className={introClassName}>
        Stand: {LAST_UPDATED} | Diese Datenschutzhinweise gelten für die Nutzung von Bäder Azubi
        in der jeweils betriebenen Instanz.
      </p>

      <div className={containerClassName}>
        <section>
          <h3 className={headingClassName}>1. Verantwortlicher</h3>
          <p className={textClassName}>
            Verantwortlicher für diese Instanz ist aktuell:
            <br />
            {OPERATOR.name}
            <br />
            {OPERATOR.street}
            <br />
            {OPERATOR.city}
            <br />
            E-Mail: {OPERATOR.email}
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>2. Zwecke der Verarbeitung</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Bereitstellung von Benutzerkonten, Rollen, Organisationen und App-Funktionen</li>
            <li>Unterstützung von Lern-, Ausbildungs- und Organisationsprozessen</li>
            <li>Kommunikation, Benachrichtigungen, Support und Fehleranalyse</li>
            <li>Sicherer Betrieb, Missbrauchserkennung und Nachvollziehbarkeit sicherheitsrelevanter Aktionen</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>3. Verarbeitete Datenarten</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Kontodaten: Anzeigename, E-Mail-Adresse, Rolle, Status, Avatar, optional Geburtsdatum</li>
            <li>Organisationsdaten: Betrieb, Zuordnung, Einladungscode-Bezug</li>
            <li>Lern- und Ausbildungsdaten: Fortschritte, Quiz-, Duel-, Prüfungs-, Berichtsheft- und Schwimmdaten</li>
            <li>Kommunikationsdaten: Chatnachrichten, Forenbeiträge, Benachrichtigungen</li>
            <li>Technische und Sicherheitsdaten: Login-Zeitpunkte, IP-Adresse, User-Agent, Audit-Logs</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>4. Rechtsgrundlagen</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Art. 6 Abs. 1 lit. b DSGVO für Vertrags- und Ausbildungsbezug</li>
            <li>Art. 6 Abs. 1 lit. c DSGVO, soweit gesetzliche Pflichten bestehen</li>
            <li>Art. 6 Abs. 1 lit. f DSGVO für sicheren Betrieb, Missbrauchsschutz und Administration</li>
            <li>Art. 6 Abs. 1 lit. a DSGVO, soweit für einzelne Funktionen eine Einwilligung erforderlich ist</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>5. Hosting und Dienstleister</h3>
          <p className={textClassName}>
            Die App wird ausschließlich auf einem Server in Deutschland (Frankfurt am Main) betrieben.
            Es werden keine personenbezogenen Daten an Server außerhalb der EU übermittelt.
          </p>
          <ul className={`${listClassName} ${textClassName} mt-2`}>
            <li>Hosting-Infrastruktur: Hostinger International Ltd., Zypern (EU) — Server-Standort Frankfurt, Deutschland</li>
            <li>E-Mail- und Push-Benachrichtigungsdienste, soweit für den Betrieb erforderlich</li>
            <li>Auftragsverarbeiter werden vertraglich gebunden und nur zweckgebunden eingesetzt</li>
            <li>Es erfolgt keine Weitergabe personenbezogener Daten zu Werbezwecken</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>6. Speicherdauer und Löschung</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Daten werden nur so lange gespeichert, wie sie für Betrieb, Vertrag, Support, Sicherheit oder Nachweispflichten erforderlich sind</li>
            <li>Konkrete Aufbewahrungs- und Löschfristen werden je Betreiber-, Mandanten- und Vertragskontext festgelegt</li>
            <li>Lokal im Browser gespeicherte Einstellungen, Entwürfe und Lernstände bleiben auf dem Gerät, bis sie gelöscht, überschrieben oder vom Browser entfernt werden</li>
            <li>Datenbankbackups werden automatisch nach 7 Tagen überschrieben</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>7. Betroffenenrechte</h3>
          <p className={textClassName}>
            Betroffene haben insbesondere Rechte auf Auskunft, Berichtigung, Löschung,
            Einschränkung, Datenübertragbarkeit und Widerspruch nach Maßgabe der DSGVO.
            Die Löschung des eigenen Kontos ist direkt in der App unter Profil möglich.
          </p>
          <p className={textClassName}>Anfragen bitte an: {OPERATOR.email}</p>
        </section>

        <section>
          <h3 className={headingClassName}>8. Cookies und lokale Speicherung</h3>
          <p className={textClassName}>
            Die App verwendet ausschließlich technisch notwendige Cookies und Speichermechanismen.
            Es werden keine Analyse-, Werbe- oder Tracking-Cookies eingesetzt.
          </p>
          <ul className={`${listClassName} ${textClassName} mt-2`}>
            <li>
              <strong>Session-Cookie (HttpOnly):</strong> Speichert ein verschlüsseltes Refresh-Token zur sicheren Sitzungsfortführung. Notwendig für die Anmeldung. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
            </li>
            <li>
              <strong>LocalStorage:</strong> Speichert Einstellungen (z.B. Dark Mode), Lernstände, Entwürfe und technische Sitzungsinformationen lokal auf dem Gerät. Kein Zugriff durch den Server.
            </li>
            <li>
              <strong>Push-Benachrichtigungen:</strong> Nur nach ausdrücklicher Zustimmung des Nutzers. Jederzeit in den Browsereinstellungen widerrufbar.
            </li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>9. Sicherheit der Verarbeitung</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Verschlüsselte Übertragung (TLS/HTTPS), Rollen- und Berechtigungskonzept, serverseitige Zugriffskontrollen</li>
            <li>Passwörter werden ausschließlich in gehashter Form (Argon2) gespeichert</li>
            <li>Protokollierung sicherheitsrelevanter und administrativer Vorgänge</li>
            <li>Automatisierte Backups und regelmäßige technische Aktualisierungen</li>
            <li>Brute-Force-Schutz durch Rate-Limiting und persistenten Lockout auf Authentifizierungsendpunkten</li>
            <li>Zwei-Faktor-Authentifizierung (TOTP) für Administrator-Konten</li>
          </ul>
        </section>

        <section className={dividerClassName}>
          <p className={noteClassName}>
            Diese Hinweise werden aktualisiert, wenn sich Architektur, Dienstleister oder Datenflüsse
            wesentlich ändern. Letzte Aktualisierung: {LAST_UPDATED} (Hostinger-Sitz korrigiert auf Zypern,
            Backup-Aufbewahrung auf 7 Tage aktualisiert, 2FA für Admins ergänzt).
          </p>
        </section>
      </div>
    </>
  );
}

export function LegalTermsContent({
  introClassName = 'text-xs text-gray-500',
  containerClassName = 'space-y-6',
  headingClassName = 'font-bold',
  textClassName = 'text-sm',
  dividerClassName = 'pt-4 border-t border-gray-200',
  noteClassName = 'text-xs text-gray-500'
}) {
  return (
    <>
      <p className={introClassName}>
        Stand: {LAST_UPDATED} | Diese Nutzungsbedingungen gelten für die Nutzung der Bäder-Azubi App.
      </p>

      <div className={containerClassName}>
        <section>
          <h3 className={headingClassName}>1. Anbieter und Vertragsgegenstand</h3>
          <p className={textClassName}>
            Anbieter der Bäder-Azubi App ist {OPERATOR.name}, {OPERATOR.street}, {OPERATOR.city}
            (nachfolgend „Anbieter"). Die App ist eine digitale Lernplattform für Auszubildende
            im Bereich Bäderbetriebe und richtet sich ausschließlich an Ausbildungsbetriebe,
            Trainer und Auszubildende in diesem Bereich.
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>2. Nutzungsberechtigung und Registrierung</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Die Nutzung der App ist nur mit gültigem, freigeschaltetem Benutzerkonto möglich</li>
            <li>Zugänge werden ausschließlich über Einladungscodes durch autorisierte Administratoren vergeben</li>
            <li>Jeder Nutzer ist für die Vertraulichkeit seiner Zugangsdaten selbst verantwortlich</li>
            <li>Die Weitergabe von Zugangsdaten an Dritte ist untersagt</li>
            <li>Pro Person ist nur ein Benutzerkonto zulässig</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>3. Pflichten der Nutzer</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Nutzung ausschließlich zu Ausbildungs- und Lernzwecken im Kontext des Bäderbetriebs</li>
            <li>Keine Verbreitung von beleidigenden, diskriminierenden oder rechtswidrigen Inhalten</li>
            <li>Kein Versuch, unbefugten Zugriff auf das System oder fremde Daten zu erlangen</li>
            <li>Keine automatisierten Abfragen oder Bots ohne ausdrückliche Genehmigung</li>
            <li>Meldung von Sicherheitsproblemen oder Missbrauch an den Anbieter</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>4. Leistungsumfang und Verfügbarkeit</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Der Anbieter stellt die App nach bestem Bemühen bereit, übernimmt aber keine Garantie für ununterbrochene Verfügbarkeit</li>
            <li>Wartungsarbeiten können zu vorübergehenden Unterbrechungen führen</li>
            <li>Der Funktionsumfang kann jederzeit erweitert, geändert oder eingeschränkt werden</li>
            <li>Die App ist als Progressive Web App (PWA) nutzbar; die Installation auf dem Gerät ist optional</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>5. Inhalte und geistiges Eigentum</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Alle von Nutzern erstellten Inhalte (Berichtshefte, Forenbeiträge, Chatnachrichten) verbleiben im Eigentum der jeweiligen Urheber</li>
            <li>Mit dem Einstellen von Inhalten räumen Nutzer dem Anbieter das Recht ein, diese zum Betrieb der Plattform zu speichern und darzustellen</li>
            <li>Lernmaterialien, Fragen und sonstige vom Anbieter bereitgestellte Inhalte dürfen nicht ohne Genehmigung vervielfältigt oder weitergegeben werden</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>6. Haftungsausschluss</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Der Anbieter haftet nicht für den Inhalt von Nutzerbeiträgen</li>
            <li>Für Schäden durch höhere Gewalt, technische Störungen oder Angriffe Dritter wird keine Haftung übernommen</li>
            <li>Die App ersetzt keine offizielle Prüfungsvorbereitung oder Beratung durch zuständige Stellen</li>
            <li>Haftungsbeschränkungen gelten nicht bei grober Fahrlässigkeit oder Vorsatz des Anbieters</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>7. Kündigung und Sperrung</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Nutzer können ihr Konto jederzeit selbst im Profil löschen</li>
            <li>Der Anbieter kann Konten bei Verstößen gegen diese Nutzungsbedingungen sperren oder löschen</li>
            <li>Nach Ende des Ausbildungsverhältnisses kann das Konto auf Wunsch des Betriebs deaktiviert werden</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>8. Änderungen der Nutzungsbedingungen</h3>
          <p className={textClassName}>
            Der Anbieter behält sich vor, diese Nutzungsbedingungen mit angemessener Vorankündigung
            zu ändern. Wesentliche Änderungen werden in der App bekannt gegeben. Die fortgesetzte
            Nutzung nach Inkrafttreten der Änderungen gilt als Zustimmung.
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>9. Anwendbares Recht und Gerichtsstand</h3>
          <p className={textClassName}>
            Es gilt deutsches Recht. Gerichtsstand ist, soweit gesetzlich zulässig, Siegburg.
          </p>
        </section>

        <section className={dividerClassName}>
          <p className={noteClassName}>
            Hinweis: Diese Nutzungsbedingungen wurden nach bestem Wissen erstellt, ersetzen jedoch
            keine individuelle Rechtsberatung. Bei Fragen: {OPERATOR.email}
          </p>
          <p className={`${noteClassName} mt-1`}>Stand: {LAST_UPDATED}</p>
        </section>
      </div>
    </>
  );
}
