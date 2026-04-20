const pad2 = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');

export const parseFormTimeToMinutes = (timeInput) => {
  const raw = String(timeInput || '').trim();
  if (!raw) return NaN;
  if (raw.includes(':')) {
    const [minToken, rest = ''] = raw.split(':');
    const [secToken = '0', csToken = '0'] = rest.split(',');
    const minutes = Number(String(minToken).replace(',', '.'));
    const seconds = Number(secToken);
    const hundredths = Number(csToken);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || !Number.isFinite(hundredths)) return NaN;
    return minutes + seconds / 60 + hundredths / 6000;
  }
  const numeric = Number(raw.replace(',', '.'));
  return Number.isFinite(numeric) ? numeric : NaN;
};

export const parseFormTimeToSeconds = (timeInput) => {
  const minutes = parseFormTimeToMinutes(timeInput);
  return Number.isFinite(minutes) ? minutes * 60 : NaN;
};

export const formatMinutesAsMMSSCC = (totalMinutes) => {
  const minutes = Number(totalMinutes);
  if (!Number.isFinite(minutes) || minutes < 0) return '00:00,00';
  const totalHundredths = Math.round(minutes * 6000);
  const mm = Math.floor(totalHundredths / 6000);
  const remainder = totalHundredths - mm * 6000;
  const ss = Math.floor(remainder / 100);
  const cc = remainder - ss * 100;
  return `${pad2(mm)}:${pad2(ss)},${pad2(cc)}`;
};

export const formatSecondsAsMMSSCC = (totalSeconds) => {
  const seconds = Number(totalSeconds);
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00,00';
  return formatMinutesAsMMSSCC(seconds / 60);
};
