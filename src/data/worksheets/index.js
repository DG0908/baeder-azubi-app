import dieHaut from './dieHaut';
import dasOhr from './dasOhr';
import dasAuge from './dasAuge';
import lungeAtmung from './lungeAtmung';
import dasHerz from './dasHerz';

export const WORKSHEETS = [dieHaut, dasOhr, dasAuge, lungeAtmung, dasHerz];

export const getWorksheet = (id) => WORKSHEETS.find((w) => w.id === id) || null;
