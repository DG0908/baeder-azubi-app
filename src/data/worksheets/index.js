import dieHaut from './dieHaut';

export const WORKSHEETS = [dieHaut];

export const getWorksheet = (id) => WORKSHEETS.find((w) => w.id === id) || null;
