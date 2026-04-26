import dieHaut from './dieHaut';
import dasOhr from './dasOhr';
import dasAuge from './dasAuge';
import lungeAtmung from './lungeAtmung';
import dasHerz from './dasHerz';
import blutKreislauf from './blutKreislauf';
import dasSkelett from './dasSkelett';
import dieMuskulatur from './dieMuskulatur';
import dieGelenke from './dieGelenke';
import dasNervensystem from './dasNervensystem';
import waermehaushalt from './waermehaushalt';
import dasImmunsystem from './dasImmunsystem';
import hyperventilation from './hyperventilation';

export const WORKSHEETS = [dieHaut, dasOhr, dasAuge, lungeAtmung, dasHerz, blutKreislauf, dasSkelett, dieMuskulatur, dieGelenke, dasNervensystem, waermehaushalt, dasImmunsystem, hyperventilation];

export const getWorksheet = (id) => WORKSHEETS.find((w) => w.id === id) || null;
