import React from 'react';

const OPERATOR = {
  name: 'Dennie Gulbinski',
  street: 'Zeitstraße 108',
  city: '53721 Siegburg',
  email: 'kontakt@smartbaden.de',
  taxNumber: '[folgt nach Gewerbeanmeldung]'
};

const LAST_UPDATED = '03.05.2026 (rev. 2)';
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
        <h3 className={headingClassName}>Umsatzsteuer</h3>
        <p className={textClassName}>
          Kleinunternehmer gemäß § 19 UStG, es wird keine Umsatzsteuer ausgewiesen.
        </p>
      </section>

      <section>
        <h3 className={headingClassName}>Steuernummer</h3>
        <p className={textClassName}>{OPERATOR.taxNumber}</p>
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
        <h3 className={headingClassName}>Streitbeilegung</h3>
        <p className={textClassName}>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            https://ec.europa.eu/consumers/odr
          </a>
          . Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          sind wir nicht verpflichtet und nicht bereit.
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
          <h3 className={headingClassName}>1. Verantwortlicher und Nutzungsszenarien</h3>
          <p className={textClassName}>
            Diese Datenschutzhinweise unterscheiden zwei Nutzungsszenarien, in denen die App
            betrieben wird:
          </p>

          <p className={`${textClassName} mt-3`}>
            <strong>Szenario A — Direktnutzung:</strong> Bei eigenständiger Anmeldung und Nutzung
            ohne Zuordnung zu einem Ausbildungsbetrieb ist Verantwortlicher im Sinne von Art. 4
            Nr. 7 DSGVO:
          </p>
          <p className={textClassName}>
            {OPERATOR.name}
            <br />
            {OPERATOR.street}
            <br />
            {OPERATOR.city}
            <br />
            E-Mail: {OPERATOR.email}
          </p>

          <p className={`${textClassName} mt-3`}>
            <strong>Szenario B — Nutzung über einen Ausbildungsbetrieb:</strong> Wenn die App von
            einem Ausbildungsbetrieb (z.B. Stadtwerk, kommunales Bad, Zweckverband) für die eigenen
            Auszubildenden und Ausbilder eingesetzt wird, ist <strong>der jeweilige Betrieb
            Verantwortlicher</strong> für sämtliche Konto-, Lern-, Ausbildungs- und
            Kommunikationsdaten der zugeordneten Personen. Der App-Betreiber verarbeitet diese
            Daten in diesem Fall ausschließlich auf dokumentierte Weisung des Betriebs als
            <strong> Auftragsverarbeiter</strong> nach Art. 28 DSGVO; Grundlage ist ein
            Auftragsverarbeitungsvertrag (AVV) zwischen Betrieb und Betreiber.
          </p>
          <p className={`${textClassName} mt-2`}>
            In Szenario B sind die <strong>primären Informationen nach Art. 13 DSGVO</strong> vom
            jeweiligen Ausbildungsbetrieb bereitzustellen. Diese Datenschutzerklärung dient in
            diesem Fall als ergänzende Transparenzinformation des Betreibers. Anfragen zur
            Verarbeitung im Ausbildungskontext richten Sie bitte zunächst an Ihren
            Ausbildungsbetrieb; der Betreiber unterstützt auf Anforderung des Betriebs.
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>2. Datenschutzkontakt</h3>
          <p className={textClassName}>
            Für Fragen zum Datenschutz erreichen Sie den Verantwortlichen unter:
          </p>
          <p className={`${textClassName} mt-2`}>
            <strong>{OPERATOR.name}</strong>
            <br />
            E-Mail: {OPERATOR.email} (Betreff: &bdquo;Datenschutz&ldquo;)
          </p>
          <p className={`${textClassName} mt-2`}>
            Der Verantwortliche verfügt über eine <strong>Weiterbildung zum Datenschutzbeauftragten</strong>{' '}
            und bearbeitet Datenschutzanfragen intern fachkundig (Zertifikat auf Anfrage einsehbar).
            Ein Datenschutzbeauftragter im Sinne von Art. 37 DSGVO ist derzeit <strong>nicht
            benannt</strong>, da nach aktueller Prüfung keine gesetzliche Benennungspflicht nach
            § 38 BDSG besteht. Die Erforderlichkeit einer Benennung wird regelmäßig überprüft —
            insbesondere bei wesentlichen Änderungen der App, der Datenverarbeitung, der Kundenzahl
            oder der Unternehmensstruktur. Bei Eintritt einer Benennungspflicht oder entsprechender
            Anforderung von Auftraggebern wird ein externer Datenschutzbeauftragter eingebunden.
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>3. Zwecke der Verarbeitung</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Bereitstellung von Benutzerkonten, Rollen, Organisationen und App-Funktionen</li>
            <li>Unterstützung von Lern-, Ausbildungs- und Organisationsprozessen (Berichtsheft, Klausuren, Quiz, Schwimm-Challenge u.a.)</li>
            <li>Kommunikation zwischen Azubis, Ausbildern und Administration (Chat, Forum, Benachrichtigungen)</li>
            <li>Sicherer Betrieb, Missbrauchserkennung und Nachvollziehbarkeit sicherheitsrelevanter Aktionen</li>
            <li>Erfüllung gesetzlicher und vertraglicher Pflichten gegenüber Ausbildungsbetrieben</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>4. Verarbeitete Datenarten</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li><strong>Kontodaten:</strong> Anzeigename, E-Mail-Adresse, Rolle, Status, Avatar; bei Bedarf Bestätigung der Volljährigkeit (16. Lebensjahr)</li>
            <li><strong>Organisationsdaten:</strong> Zugeordneter Ausbildungsbetrieb, Einladungscode-Bezug, Berechtigungen</li>
            <li><strong>Lern- und Ausbildungsdaten:</strong> Lernfortschritte, Quiz- und Duell-Ergebnisse, Prüfungssimulator-Sitzungen, Klausurnoten, Berichtsheft-Einträge, Schwimm-Daten, Karteikarten</li>
            <li><strong>Kommunikationsdaten:</strong> Chatnachrichten, Forenbeiträge, Benachrichtigungen, Push-Subscriptions</li>
            <li><strong>Technische und Sicherheitsdaten:</strong> Login-Zeitpunkte, IP-Adresse, User-Agent, Audit-Logs sicherheitsrelevanter Aktionen, Geräte-Trust-Status</li>
          </ul>
          <p className={`${textClassName} mt-2`}>
            <strong>Hinweis zu besonderen Kategorien (Art. 9 DSGVO):</strong> Die App ist nicht
            darauf ausgelegt, besondere Kategorien personenbezogener Daten (z.B. Gesundheitsdaten,
            Religionszugehörigkeit, Gewerkschaftszugehörigkeit) zu erheben. Nutzer werden gebeten,
            keine derartigen Angaben in Freitextfelder, Chats, Foren oder Berichtshefte
            einzutragen. Sollte dies im Einzelfall dennoch geschehen, erfolgt keine gezielte
            Auswertung dieser Angaben durch den Betreiber.
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>5. Rechtsgrundlagen je Verarbeitung</h3>
          <p className={textClassName}>
            Die nachfolgende Übersicht ordnet die wesentlichen Verarbeitungstätigkeiten den
            jeweiligen Rechtsgrundlagen zu. Bei Nutzung über einen Ausbildungsbetrieb (Szenario B)
            ist der Betrieb für die rechtliche Grundlage zuständig; die Spalte „Rechtsgrundlage"
            verweist auf die übliche Konstellation.
          </p>
          <div className="overflow-x-auto mt-3">
            <table className={`w-full ${textClassName} border border-gray-300 rounded-lg`}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Verarbeitung</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Rechtsgrundlage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Konto, Login, Rollen, Organisationszuordnung</td>
                  <td className="border border-gray-300 px-3 py-2">Art. 6 Abs. 1 lit. b DSGVO; bei B2B Weisung des Betriebs</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Lernstände, Klausurnoten, Berichtsheft, Prüfungssimulator</td>
                  <td className="border border-gray-300 px-3 py-2">Bei B2B verantwortet vom Ausbildungsbetrieb, üblicherweise Art. 6 Abs. 1 lit. b/c DSGVO bzw. § 26 BDSG</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Chat, Forum, In-App-Benachrichtigungen</td>
                  <td className="border border-gray-300 px-3 py-2">Art. 6 Abs. 1 lit. b DSGVO oder berechtigtes Interesse an Kommunikation, Art. 6 Abs. 1 lit. f DSGVO</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Sicherheitslogs, Rate-Limits, Missbrauchsschutz</td>
                  <td className="border border-gray-300 px-3 py-2">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: IT-Sicherheit, Nachvollziehbarkeit)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Push-Benachrichtigungen</td>
                  <td className="border border-gray-300 px-3 py-2">Einwilligung, Art. 6 Abs. 1 lit. a DSGVO i.V.m. § 25 TDDDG</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Altersbestätigung (16+)</td>
                  <td className="border border-gray-300 px-3 py-2">Art. 8 DSGVO i.V.m. nationalem Recht, soweit Direktnutzung; bei B2B im Rahmen des Ausbildungsverhältnisses</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Auftragsverarbeitung gegenüber Betrieben</td>
                  <td className="border border-gray-300 px-3 py-2">Art. 28 DSGVO i.V.m. AVV</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={`${textClassName} mt-2`}>
            Auszubildende sind nach § 26 Abs. 8 BDSG ausdrücklich vom Beschäftigtendatenschutz
            erfasst. Bei B2B-Nutzung prüft der Ausbildungsbetrieb als Verantwortlicher, ob § 26
            BDSG bzw. ausbildungs- oder arbeitsrechtliche Grundlagen einschlägig sind.
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>6. Empfänger und Zugriffsrollen</h3>
          <p className={textClassName}>
            Innerhalb der App können je nach Rolle und Funktion folgende Personen und Stellen
            personenbezogene Daten einsehen:
          </p>
          <ul className={`${listClassName} ${textClassName} mt-2`}>
            <li><strong>Der jeweilige Nutzer selbst</strong> hat Zugriff auf alle eigenen Daten (Profil, Lernstände, Berichtsheft, Klausuren, eigene Beiträge).</li>
            <li><strong>Ausbilder und Trainer</strong> der zugeordneten Organisation sehen Lernfortschritte, Klausurnoten, Berichtshefte, Monatsberichte und Statistiken ihrer Azubis. Sie können Berichte freigeben, Aufgaben zuweisen und Wissen prüfen.</li>
            <li><strong>Administratoren</strong> haben technischen und organisatorischen Zugriff für Benutzerverwaltung, Freigaben, Support und Sicherheitsereignisse innerhalb ihrer Organisation. Sie sehen u.a. Geburtsdatum (sofern angegeben) zur Altersprüfung sowie den Status der elterlichen Einwilligung.</li>
            <li><strong>Andere Nutzer derselben Organisation</strong> sehen im Forum, Chat und in Bestenlisten Anzeigenamen, Avatar und ggf. Beiträge. Lernstände, Noten und Profildetails sind dort nicht sichtbar.</li>
            <li><strong>Quizduell-Gegner</strong> sehen Anzeigenamen, Avatar, Punktestand und Antwortverhalten innerhalb des Duells.</li>
            <li><strong>Auftragsverarbeiter</strong> (siehe Abschnitt 7) erhalten Zugriff im technisch erforderlichen Umfang und sind vertraglich gebunden.</li>
            <li>Eine Weitergabe an unbeteiligte Dritte oder zu Werbezwecken erfolgt <strong>nicht</strong>.</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>7. Hosting, Mail und Auftragsverarbeiter</h3>
          <p className={textClassName}>
            Die App wird in der Europäischen Union betrieben. Mit allen genannten
            Auftragsverarbeitern bestehen oder werden vor Inbetriebnahme Auftragsverarbeitungsverträge
            gemäß Art. 28 DSGVO geschlossen.
          </p>
          <ul className={`${listClassName} ${textClassName} mt-2`}>
            <li>
              <strong>Hosting (Server, Datenbank):</strong> Hostinger International Ltd., Vilnius/Litauen
              und Zypern. Server-Standort: Frankfurt am Main, Deutschland. Backups innerhalb der EU.
            </li>
            <li>
              <strong>E-Mail-Versand (Anmeldung, Benachrichtigungen, Passwort-Reset):</strong>{' '}
              Hostinger Mail-Service über die Server <code>smtp.hostinger.com</code> /
              <code> imap.hostinger.com</code>. Mailspeicherung in Hostinger-Rechenzentren innerhalb der EU.
            </li>
            <li>
              <strong>Push-Infrastruktur:</strong> Siehe Abschnitt 8.
            </li>
            <li>
              Es findet <strong>keine Übermittlung in Drittländer</strong> außerhalb der EU statt,
              außer im technisch unvermeidbaren Umfang bei Web-Push-Benachrichtigungen (siehe
              Abschnitt 8).
            </li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>8. Push-Benachrichtigungen</h3>
          <p className={textClassName}>
            Push-Benachrichtigungen sind ein <strong>optionaler Dienst</strong> und nur nach
            ausdrücklicher Einwilligung im Browser oder Betriebssystem aktiv. Rechtsgrundlage:
            Art. 6 Abs. 1 lit. a DSGVO i.V.m. § 25 TDDDG (Speichern auf Endgeräten). Die
            Einwilligung kann jederzeit in den Browser- oder Geräte-Einstellungen sowie im Profil
            der App widerrufen werden.
          </p>
          <p className={`${textClassName} mt-2`}>
            Technisch bedingt erfolgt die Zustellung über die Push-Dienste der jeweiligen Browser-
            bzw. Betriebssystem-Hersteller:
          </p>
          <ul className={`${listClassName} ${textClassName} mt-1`}>
            <li><strong>Google Firebase Cloud Messaging (FCM)</strong> — für Chrome, Edge und Android (Anbieter: Google LLC, USA)</li>
            <li><strong>Apple Push Notification service (APNs)</strong> — für Safari, iOS und macOS (Anbieter: Apple Inc., USA)</li>
            <li><strong>Mozilla Push Service</strong> — für Firefox (Anbieter: Mozilla Foundation, USA)</li>
          </ul>
          <p className={`${textClassName} mt-2`}>
            <strong>Verschlüsselung:</strong> Web-Push-Nachrichten werden nach dem Web-Push-Standard
            verschlüsselt übertragen (RFC 8291). Das VAPID-Verfahren (RFC 8292) dient zusätzlich der
            Identifikation des App-Servers gegenüber dem jeweiligen Push-Dienst. Push-Dienste
            verarbeiten technisch erforderliche Metadaten (Push-Endpunkt, Zeitstempel, Größe,
            Zustellinformationen).
          </p>
          <p className={`${textClassName} mt-2`}>
            <strong>Drittlandtransfer USA:</strong> Die genannten Push-Dienste können
            personenbezogene Metadaten in den USA verarbeiten. Geeignete Garantien nach Kapitel V
            DSGVO bestehen je nach Anbieter über das EU-U.S. Data Privacy Framework (DPF) sowie
            EU-Standardvertragsklauseln (SCC) gemäß Art. 46 Abs. 2 lit. c DSGVO. Die Übermittlung
            erfolgt zusätzlich auf Grundlage Ihrer ausdrücklichen Einwilligung (Art. 6 Abs. 1
            lit. a DSGVO).
          </p>
          <p className={`${textClassName} mt-2`}>
            <strong>Datenminimierung im Push-Inhalt:</strong> Der Betreiber hält Push-Inhalte
            möglichst neutral (z.B. „Sie haben eine neue Benachrichtigung"). Konkrete Inhalte wie
            Klausurnoten, Lernstände oder Chatnachrichten werden nicht in der Push-Nachricht selbst
            übertragen, sondern erst nach Login in der App angezeigt.
          </p>
          <p className={`${textClassName} mt-2`}>
            Wer keine Übermittlung an diese Dienste wünscht, aktiviert Push schlicht nicht — alle
            App-Funktionen bleiben auch ohne Push voll nutzbar.
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>9. Speicherdauer, Deaktivierung und Löschung</h3>
          <p className={textClassName}>
            Die App unterscheidet zwischen drei Stufen: <strong>Deaktivierung</strong> (Konto-Login
            wird gesperrt, Daten bleiben), <strong>Anonymisierung</strong> (personenbezogene
            Identifikatoren werden entfernt, aggregierte Datensätze bleiben) und{' '}
            <strong>Hard-Deletion</strong> (vollständige physische Löschung aller Daten).
          </p>
          <ul className={`${listClassName} ${textClassName} mt-2`}>
            <li>
              <strong>Aktive Konten:</strong> Daten werden gespeichert, solange das Konto besteht
              und die Ausbildungs- bzw. Vertragsbeziehung andauert.
            </li>
            <li>
              <strong>Inaktivitätsroutine:</strong> Nach <strong>22 Monaten ohne Login</strong>{' '}
              erhält der Nutzer eine Erinnerungs-E-Mail. Bleibt das Konto weitere 2 Monate inaktiv,
              wird es automatisch nach <strong>insgesamt 24 Monaten Inaktivität deaktiviert</strong>.
            </li>
            <li>
              <strong>Konto-Deaktivierung durch den Nutzer:</strong> Im Profil unter
              &bdquo;Konto deaktivieren und Anonymisierung anfordern&ldquo; kann der Nutzer
              jederzeit selbst die Deaktivierung auslösen.
            </li>
            <li>
              <strong>Was bei Deaktivierung passiert:</strong> Login wird gesperrt, Sitzungs-Token
              entfernt, Anzeigename und Avatar in Forum- und Quizduell-Ansichten anonymisiert
              („deaktivierter Nutzer"). E-Mail und Geburtsstatus bleiben in den Konto-Stammdaten,
              um doppelte Anmeldungen und ausbildungsrechtliche Nachweispflichten zu unterstützen.
            </li>
            <li>
              <strong>Hard-Deletion (vollständige physische Löschung):</strong> Erfolgt nach Ablauf
              der jeweiligen Aufbewahrungs- und Verjährungsfristen — oder vorzeitig auf
              ausdrückliche Anforderung des Betroffenen nach Art. 17 DSGVO, soweit keine
              entgegenstehende gesetzliche Aufbewahrungspflicht besteht. Die Hard-Deletion umfasst
              Konto-Stammdaten, Lernstände, Klausurnoten, Berichtshefte, Schwimm-Daten und alle
              eindeutig zuordenbaren Inhalte.
            </li>
            <li>
              <strong>Audit-Logs</strong> sicherheitsrelevanter Aktionen werden{' '}
              <strong>bis zu 3 Jahre</strong> aufbewahrt (berechtigtes Interesse: IT-Sicherheit,
              Nachweispflichten, Verjährungsfrist nach § 195 BGB). Sie werden in pseudonymisierter
              Form geführt (technische User-ID statt Klarname).
            </li>
            <li>
              <strong>Forum- und Chat-Beiträge:</strong> Bleiben für die Integrität der
              Diskussionsfäden erhalten, der Anzeigename des deaktivierten Nutzers wird jedoch
              durch &bdquo;deaktivierter Nutzer&ldquo; ersetzt. Auf Anforderung können einzelne
              Beiträge nach Art. 17 DSGVO gelöscht werden.
            </li>
            <li>
              <strong>Datenbank-Backups</strong> werden täglich erstellt und nach 14 Tagen
              automatisch überschrieben. Eine bereits erfolgte Hard-Deletion wirkt auch in den
              Backups innerhalb dieser Frist.
            </li>
            <li>
              <strong>LocalStorage und IndexedDB</strong> auf dem Gerät bleiben bis zur Löschung
              durch den Nutzer oder den Browser bestehen.
            </li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>10. Cookies und lokale Speicherung</h3>
          <p className={textClassName}>
            Die App verwendet ausschließlich technisch notwendige Cookies und Speichermechanismen
            gemäß § 25 Abs. 2 Nr. 2 TDDDG. Es werden <strong>keine Analyse-, Werbe- oder
            Tracking-Cookies</strong> eingesetzt. Es findet kein Tracking durch Dritte statt.
          </p>
          <ul className={`${listClassName} ${textClassName} mt-2`}>
            <li>
              <strong>Refresh-Token-Cookie</strong> (HttpOnly, Secure, SameSite=None): Verschlüsselter
              Token zur sicheren Sitzungsfortführung nach Anmeldung. SameSite=None ist erforderlich,
              weil Frontend (azubi.smartbaden.de) und Backend (api.smartbaden.de) auf unterschiedlichen
              Subdomains laufen und der Token bei Cross-Site-Requests mitgesendet werden muss.{' '}
              <em>Speicherdauer ca. 7 Tage.</em> Notwendig für die Anmeldung.
            </li>
            <li>
              <strong><code>trusted_device</code>-Cookie</strong> (HttpOnly, Secure, SameSite=None):
              Wird nur gesetzt, wenn der Nutzer beim Login &bdquo;Gerät vertrauen&ldquo; auswählt.
              Erlaubt das Überspringen der Zwei-Faktor-Authentifizierung auf diesem Gerät.{' '}
              <em>Speicherdauer 30 Tage.</em> Wird bei Logout, Passwortänderung, Geräte-Verwaltung
              im Profil oder nach Ablauf automatisch entfernt.
            </li>
            <li>
              <strong>LocalStorage</strong> auf dem Gerät: Anzeigeeinstellungen (z.B. Dark Mode),
              lokale Berichtsheft-Entwürfe, Lernstände einzelner Module, Hinweis-Status (z.B.
              ausgeblendete Hinweise). Der Server hat keinen unmittelbaren Zugriff auf diesen
              Speicherbereich; die App selbst kann gespeicherte Werte jedoch verarbeiten und an den
              Server senden, soweit dies für die jeweilige Funktion erforderlich ist.
            </li>
            <li>
              <strong>IndexedDB / Service-Worker-Cache</strong>: Offline-Verfügbarkeit der App
              (Progressive Web App). Lehrinhalte, statische Assets und temporäre API-Antworten zur
              Beschleunigung. Gleicher Zugriffsstatus wie LocalStorage.
            </li>
            <li>
              <strong>Push-Subscription-Daten</strong>: Werden nur nach Einwilligung gesetzt und
              auf dem Server gespeichert (siehe Abschnitt 8).
            </li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>11. Sicherheit der Verarbeitung</h3>
          <ul className={`${listClassName} ${textClassName}`}>
            <li>Verschlüsselte Übertragung über TLS/HTTPS auf allen Endpunkten</li>
            <li>Passwörter ausschließlich in gehashter Form (Argon2id) gespeichert</li>
            <li>Rollen- und Berechtigungskonzept (RBAC) mit serverseitiger Default-Deny-Logik auf allen Endpunkten</li>
            <li>CSRF-Schutz (X-Requested-With-Header) auf allen state-changing Endpunkten</li>
            <li>Brute-Force-Schutz durch Rate-Limiting und persistenten Lockout auf Authentifizierungs-Endpunkten</li>
            <li>Zwei-Faktor-Authentifizierung (TOTP) für Administratoren-Konten verpflichtend</li>
            <li>Server-seitige Eingabevalidierung und Sanitization von Chat- und Forenbeiträgen</li>
            <li>SSRF-Schutz bei externen URL-Verarbeitungen</li>
            <li>Audit-Log für alle administrativen und sicherheitsrelevanten Aktionen</li>
            <li>Tägliche Datenbank-Backups mit dokumentiertem Restore-Verfahren</li>
            <li>Regelmäßige Aktualisierung der eingesetzten Bibliotheken (Dependabot)</li>
            <li>Datensparsamkeit: keine Erhebung von Daten, die nicht für die Funktion erforderlich sind</li>
          </ul>
        </section>

        <section>
          <h3 className={headingClassName}>12. Minderjährige (Art. 8 DSGVO)</h3>
          <p className={textClassName}>
            Die App richtet sich an Auszubildende und kann auch von Personen unter 16 Jahren genutzt
            werden. Im Datenschutzkonzept der App wird zwischen den beiden Nutzungsszenarien
            unterschieden:
          </p>
          <p className={`${textClassName} mt-2`}>
            <strong>Direktnutzung (Szenario A):</strong> Bei der Registrierung wird abgefragt, ob
            die nutzende Person das 16. Lebensjahr vollendet hat. Es wird <strong>kein konkretes
            Geburtsdatum gespeichert</strong>; die Angabe beschränkt sich auf die Bestätigung der
            Volljährigkeit im Sinne von Art. 8 DSGVO. Wird die Frage verneint, ist die Nutzung nur
            zulässig, wenn die Einwilligung der Sorgeberechtigten dem Betreiber gegenüber
            schriftlich oder elektronisch nachgewiesen wird (Art. 8 Abs. 1 Satz 1 DSGVO).
          </p>
          <p className={`${textClassName} mt-2`}>
            <strong>Nutzung über einen Ausbildungsbetrieb (Szenario B):</strong> Im
            Ausbildungskontext erfolgt die Verarbeitung personenbezogener Daten der Auszubildenden
            primär auf Grundlage von § 26 BDSG (Beschäftigtendatenschutz, der ausdrücklich auch
            Auszubildende erfasst) bzw. ausbildungs- oder arbeitsrechtlicher Vorschriften — und
            damit unabhängig von Art. 8 DSGVO. Eine Einwilligung der Sorgeberechtigten ist in
            diesem Fall regelmäßig nicht die maßgebliche Rechtsgrundlage; der Ausbildungsbetrieb
            prüft die einschlägige Rechtsgrundlage als Verantwortlicher.
          </p>
          <p className={`${textClassName} mt-2`}>
            <strong>Bestätigungs-Status</strong> (Volljährigkeitsbestätigung erforderlich, erteilt
            oder noch nicht erteilt) wird im Konto dokumentiert. Sorgeberechtigte können eine
            erteilte Einwilligung jederzeit widerrufen; das Konto wird dann deaktiviert.
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>13. Keine automatisierte Entscheidungsfindung</h3>
          <p className={textClassName}>
            Es findet <strong>keine automatisierte Entscheidungsfindung im Sinne von Art. 22
            DSGVO</strong> statt. Lernfortschritte, Quizduell-Ergebnisse, Klausurnoten und ähnliche
            Daten werden ausschließlich zur Information und Selbsteinschätzung der Nutzer sowie zur
            pädagogischen Begleitung durch Ausbilder verwendet. Es werden weder Profile mit
            Rechtswirkung gegenüber Betroffenen erstellt, noch automatische Entscheidungen über
            Ausbildungsverhältnisse, Prüfungszulassungen oder ähnliches getroffen.
          </p>
        </section>

        <section>
          <h3 className={headingClassName}>14. Betroffenenrechte und Beschwerderecht</h3>
          <p className={textClassName}>
            Betroffene haben nach der DSGVO insbesondere folgende Rechte:
          </p>
          <ul className={`${listClassName} ${textClassName} mt-2`}>
            <li><strong>Auskunft</strong> über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)</li>
            <li><strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)</li>
            <li><strong>Löschung</strong> der Daten, soweit keine Aufbewahrungspflicht entgegensteht (Art. 17 DSGVO)</li>
            <li><strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)</li>
            <li><strong>Datenübertragbarkeit</strong> in einem strukturierten, maschinenlesbaren Format (Art. 20 DSGVO) — direkt im Profil als Export verfügbar</li>
            <li><strong>Widerspruch</strong> gegen Verarbeitungen auf Basis berechtigter Interessen (Art. 21 DSGVO)</li>
            <li><strong>Widerruf</strong> erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p className={`${textClassName} mt-2`}>
            Anfragen richten Sie bitte an {OPERATOR.email}. Bei Nutzung der App durch einen
            Ausbildungsbetrieb wenden Sie sich vorrangig an den eigenen Betrieb (siehe Abschnitt 1).
          </p>
          <p className={`${textClassName} mt-2`}>
            <strong>Beschwerderecht bei einer Aufsichtsbehörde:</strong> Unbeschadet eines
            anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht Ihnen das
            Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde zu (Art. 77 DSGVO). Für den
            Sitz des Verantwortlichen zuständig ist:
          </p>
          <p className={`${textClassName} mt-2`}>
            Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)
            <br />
            Kavalleriestraße 2-4
            <br />
            40213 Düsseldorf
            <br />
            Telefon: 0211 / 38424-0
            <br />
            E-Mail:{' '}
            <a href="mailto:poststelle@ldi.nrw.de" className="underline">
              poststelle@ldi.nrw.de
            </a>
            <br />
            Web:{' '}
            <a
              href="https://www.ldi.nrw.de"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              www.ldi.nrw.de
            </a>
          </p>
        </section>

        <section className={dividerClassName}>
          <p className={noteClassName}>
            Diese Hinweise werden aktualisiert, wenn sich Architektur, Dienstleister oder Datenflüsse
            wesentlich ändern. Letzte Aktualisierung: {LAST_UPDATED} (B2B-Rollenmodell mit zwei
            Szenarien getrennt; Datenschutzkontakt mit Weiterbildung statt formeller DSB-Benennung,
            um Interessenkonflikt nach Art. 38 Abs. 6 DSGVO zu vermeiden; Rechtsgrundlagen je
            Verarbeitung als Matrix; Push-Verschlüsselung nach RFC 8291/8292 korrekt beschrieben,
            Drittlandtransfer auf EU-U.S. DPF und SCC gestützt; Art. 9-Hinweis als Disclaimer für
            Freitextfelder; Soft-Deletion klar von Anonymisierung und Hard-Deletion abgegrenzt;
            LocalStorage-Aussage präzisiert; Minderjährige-Regelung mit § 26 BDSG verzahnt).
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
