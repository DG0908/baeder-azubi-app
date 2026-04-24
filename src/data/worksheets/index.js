import dieHaut from './dieHaut';
import dasOhr from './dasOhr';
import dasAuge from './dasAuge';
import lungeAtmung from './lungeAtmung';

export const WORKSHEETS = [dieHaut, dasOhr, dasAuge, lungeAtmung];

export const getWorksheet = (id) => WORKSHEETS.find((w) => w.id === id) || null;
