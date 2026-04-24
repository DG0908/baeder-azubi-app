import dieHaut from './dieHaut';
import dasOhr from './dasOhr';
import dasAuge from './dasAuge';

export const WORKSHEETS = [dieHaut, dasOhr, dasAuge];

export const getWorksheet = (id) => WORKSHEETS.find((w) => w.id === id) || null;
