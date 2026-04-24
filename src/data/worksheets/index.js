import dieHaut from './dieHaut';
import dasOhr from './dasOhr';

export const WORKSHEETS = [dieHaut, dasOhr];

export const getWorksheet = (id) => WORKSHEETS.find((w) => w.id === id) || null;
