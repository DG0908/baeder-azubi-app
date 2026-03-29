import React from 'react';

const OPERATOR = {
  name: 'Dennie Gulbinski',
  street: 'Zeitstraße 108',
  city: '53721 Siegburg',
  email: 'denniegulbinski@gmail.com'
};

const LAST_UPDATED = '29.03.2026';
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
          <h3 className={headingClassName}>5. Empfänger und Dienstleister</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Hosting-, Infrastruktur-, Mail-, Push-, Backup- und Support-Dienstleister, soweit erforderlich</li>
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
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>7. Betroffenenrechte</h3>
          <p className={textClassName}>
            Betroffene haben insbesondere Rechte auf Auskunft, Berichtigung, Löschung,
            Einschränkung, Datenübertragbarkeit und Widerspruch nach Maßgabe der DSGVO.
          </p>
          <p className={textClassName}>Anfragen bitte an: {OPERATOR.email}</p>
        </section>

        <section>
          <h3 className={headingClassName}>8. Cookies und lokale Speicherung</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Die App verwendet technisch erforderliche Cookies oder vergleichbare Speichermechanismen für Anmeldung, Sitzungsfortführung, Sicherheit und Einstellungen</li>
            <li>Zusätzlich können lokal auf dem Gerät technische Daten wie Einstellungen, Entwürfe, Lernstände und temporäre Sitzungsinformationen gespeichert werden</li>
            <li>Aktuell ist kein Werbe-Tracking oder Marketing-Profiling vorgesehen</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>9. Sicherheit der Verarbeitung</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Verschlüsselte Übertragung, Rollen- und Berechtigungskonzept, serverseitige Zugriffskontrollen</li>
            <li>Protokollierung sicherheitsrelevanter und administrativer Vorgänge</li>
            <li>Backups, Wiederherstellungsprozesse und regelmäßige technische Aktualisierungen</li>
          </ul>
        </section>

        <section className={dividerClassName}>
          <p className={noteClassName}>
            Diese Hinweise werden aktualisiert, wenn sich Architektur, Dienstleister oder Datenflüsse
            wesentlich ändern.
          </p>
        </section>
      </div>
    </>
  );
}
