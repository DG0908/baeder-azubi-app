// View layout constants and mission helpers for WaterCycleView.

export const CONTROL_LABELS = {
  pumpEnabled: 'Pumpe', ventValveOpen: 'Entlueftung V3',
  backwashMode: 'Rueckspuelmodus', backwashValveOpen: 'Rueckspuelventil V4',
  disinfectPumpEnabled: 'Dosierpumpe', rawValveOpen: 'Saugleitung V1',
  returnValveOpen: 'Ruecklaufventil V2'
};
export const METRIC_LABELS = {
  flowRate: 'Volumenstrom', freeChlorine: 'Freies Chlor',
  backwashProgress: 'Rueckspuel-Fortschritt', differentialPressure: 'Differenzdruck'
};

export const STATION_FOCUS_VERTICAL = {
  becken:       { x: 112,  y: 285, r: 110 },
  'überlauf':   { x: 315,  y: 125, r: 80  },
  schwall:      { x: 500,  y: 195, r: 100 },
  pumpe:        { x: 500,  y: 375, r: 70  },
  flockung:     { x: 680,  y: 272, r: 55  },
  filter:       { x: 825,  y: 313, r: 105 },
  desinfektion: { x: 890,  y: 572, r: 65  },
  heizung:      { x: 829,  y: 627, r: 62  },
  'rücklauf':   { x: 390,  y: 668, r: 52  },
};

export const PIPE_PATHS_VERTICAL = {
  'becken-überlauf':      'M 195 125 L 315 125',
  'überlauf-schwall':     'M 315 125 L 435 125',
  'schwall-pumpe':        'M 500 296 L 500 320',
  'pumpe-flockung':       'M 555 375 L 635 375 L 635 290',
  'flockung-filter':      'M 652 290 L 652 100 L 760 100',
  'filter-desinfektion':  'M 825 531 L 825 570',
  'desinfektion-heizung': 'M 825 570 L 825 592',
  'heizung-rücklauf':     'M 755 627 L 400 627 L 400 680',
  'rücklauf-becken':      'M 340 680 L 112 680 L 112 525',
  'filter-kanal':         'M 888 450 L 980 450 L 980 660',
};

export const PIPE_PATHS_MOBILE_VERTICAL = {
  'becken-überlauf':      'M 274 54 L 284 54',
  'überlauf-schwall':     'M 284 54 L 356 54 L 356 115',
  'schwall-pumpe':        'M 356 222 L 356 258',
  'pumpe-flockung':       'M 356 326 L 356 348',
  'flockung-filter':      'M 356 408 L 356 422',
  'filter-desinfektion':  'M 320 603 L 20 603 L 20 500',
  'desinfektion-heizung': 'M 20 500 L 20 406',
  'heizung-rücklauf':     'M 20 406 L 20 284',
  'rücklauf-becken':      'M 20 284 L 20 97',
  'filter-kanal':         'M 392 616 L 415 616 L 415 755',
};

export const PIPE_PATHS_HORIZONTAL = {
  'becken-überlauf':      'M 195 125 L 315 125',
  'überlauf-schwall':     'M 315 125 L 435 125',
  'schwall-pumpe':        'M 500 296 L 500 320',
  'pumpe-flockung':       'M 555 375 L 635 375 L 635 290',
  'flockung-filter':      'M 652 290 L 652 100 L 645 100 L 645 330 L 645 330',
  'filter-desinfektion':  'M 1025 330 L 1080 330 L 1080 572 L 825 572',
  'desinfektion-heizung': 'M 825 572 L 825 592',
  'heizung-rücklauf':     'M 755 627 L 400 627 L 400 680',
  'rücklauf-becken':      'M 340 680 L 112 680 L 112 525',
  'filter-kanal':         'M 900 380 L 980 380 L 980 660',
};

export const readCondition = (condition, snapshot) => {
  if (condition.source === 'control') return snapshot.controls?.[condition.key];
  if (condition.source === 'metric') return snapshot.metrics?.[condition.key];
  return undefined;
};
export const isConditionOk = (condition, snapshot) => {
  const value = readCondition(condition, snapshot);
  if (Object.prototype.hasOwnProperty.call(condition, 'equals') && value !== condition.equals) return false;
  if (Object.prototype.hasOwnProperty.call(condition, 'min') && !(Number(value) >= condition.min)) return false;
  if (Object.prototype.hasOwnProperty.call(condition, 'max') && !(Number(value) <= condition.max)) return false;
  return true;
};
export const isMissionSolved = (mission, snapshot) => {
  const all = mission?.solveWhen?.all || [];
  return all.length > 0 && all.every((c) => isConditionOk(c, snapshot));
};
export const formatCondition = (condition) => {
  const lbl = condition.source === 'control'
    ? (CONTROL_LABELS[condition.key] || condition.key)
    : (METRIC_LABELS[condition.key] || condition.key);
  if (Object.prototype.hasOwnProperty.call(condition, 'equals')) return `${lbl} = ${String(condition.equals)}`;
  if (Object.prototype.hasOwnProperty.call(condition, 'min')) return `${lbl} >= ${condition.min}`;
  if (Object.prototype.hasOwnProperty.call(condition, 'max')) return `${lbl} <= ${condition.max}`;
  return lbl;
};
export const formatLogTime = (ts) => {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? '--:--' : d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
};
