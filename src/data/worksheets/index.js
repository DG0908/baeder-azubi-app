import dieHaut from './dieHaut';
import dasOhr from './dasOhr';
import dasAuge from './dasAuge';
import lungeAtmung from './lungeAtmung';
import dasHerz from './dasHerz';
import blutKreislauf from './blutKreislauf';
import dasSkelett from './dasSkelett';

export const WORKSHEETS = [dieHaut, dasOhr, dasAuge, lungeAtmung, dasHerz, blutKreislauf, dasSkelett];

export const getWorksheet = (id) => WORKSHEETS.find((w) => w.id === id) || null;
