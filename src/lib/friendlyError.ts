interface ErrorLike {
  status?: number;
  statusCode?: number;
  message?: string;
}

/**
 * Wandelt einen API- oder Netzwerkfehler in eine verständliche deutsche Meldung um.
 */
export function friendlyError(err: unknown): string {
  if (!err) return 'Ein unbekannter Fehler ist aufgetreten.';

  const errorObj = err as ErrorLike;
  const status = errorObj?.status ?? errorObj?.statusCode ?? null;
  const message = typeof errorObj?.message === 'string' ? errorObj.message.toLowerCase() : '';

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
    if (message.includes('invalid') || message.includes('invitation')) return errorObj.message!;
    return 'Sitzung abgelaufen. Bitte erneut anmelden.';
  }
  if (status === 403) return 'Keine Berechtigung für diese Aktion.';
  if (status === 404) return 'Der angeforderte Inhalt wurde nicht gefunden.';
  if (status === 409) return 'Konflikt: Diese Aktion ist in der aktuellen Situation nicht möglich.';
  if (status === 429) return 'Zu viele Anfragen. Bitte kurz warten und erneut versuchen.';
  if (status !== null && status >= 500) return 'Serverfehler. Bitte später erneut versuchen.';

  // Fallback: Original-Nachricht wenn vorhanden, sonst generisch
  if (errorObj?.message && errorObj.message.length < 120) return errorObj.message;
  return 'Ein Fehler ist aufgetreten. Bitte Seite neu laden.';
}
