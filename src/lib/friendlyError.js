/**
 * Wandelt einen API- oder Netzwerkfehler in eine verständliche deutsche Meldung um.
 * @param {unknown} err
 * @returns {string}
 */
export function friendlyError(err) {
  if (!err) return 'Ein unbekannter Fehler ist aufgetreten.';

  const status = err?.status ?? err?.statusCode ?? null;
  const message = typeof err?.message === 'string' ? err.message.toLowerCase() : '';

  // Netzwerk / kein Server
  if (
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('network request failed') ||
    message.includes('load failed')
  ) {
    return 'Keine Verbindung zum Server. Bitte Internetverbindung prüfen.';
  }

  // HTTP-Statuscodes
  if (status === 401) {
    if (message.includes('invalid credentials')) return 'E-Mail oder Passwort falsch.';
    if (message.includes('locked')) return 'Konto vorübergehend gesperrt. Bitte später erneut versuchen.';
    if (message.includes('invalid') || message.includes('invitation')) return err.message;
    return 'Sitzung abgelaufen. Bitte erneut anmelden.';
  }
  if (status === 403) return 'Keine Berechtigung für diese Aktion.';
  if (status === 404) return 'Der angeforderte Inhalt wurde nicht gefunden.';
  if (status === 409) return 'Konflikt: Diese Aktion ist in der aktuellen Situation nicht möglich.';
  if (status === 429) return 'Zu viele Anfragen. Bitte kurz warten und erneut versuchen.';
  if (status >= 500) return 'Serverfehler. Bitte später erneut versuchen.';

  // Fallback: Original-Nachricht wenn vorhanden, sonst generisch
  if (err?.message && err.message.length < 120) return err.message;
  return 'Ein Fehler ist aufgetreten. Bitte Seite neu laden.';
}
