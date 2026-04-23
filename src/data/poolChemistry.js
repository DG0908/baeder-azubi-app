export const FLOCCULANT_PRODUCTS = [
  {
    id: 'pac_liquid_standard',
    label: 'PAC flüssig (Aluminiumbasis)',
    base: 'aluminum',
    continuousDoseMlPerM3: 0.12,
    shockDoseMlPerM3: 0.22,
  },
  {
    id: 'aluminum_sulfate_solution',
    label: 'Aluminiumsulfat-Lösung',
    base: 'aluminum',
    continuousDoseMlPerM3: 0.15,
    shockDoseMlPerM3: 0.28,
  },
  {
    id: 'ferric_chloride_solution',
    label: 'Eisen-III-chlorid-Lösung',
    base: 'iron',
    continuousDoseMlPerM3: 0.09,
    shockDoseMlPerM3: 0.18,
  },
  {
    id: 'ferric_sulfate_solution',
    label: 'Eisen-III-sulfat-Lösung',
    base: 'iron',
    continuousDoseMlPerM3: 0.11,
    shockDoseMlPerM3: 0.2,
  },
];

export const FLOCCULANT_PUMP_TYPES = [
  { id: 'peristaltic', label: 'Schlauchpumpe' },
  { id: 'diaphragm', label: 'Membrandosierpumpe' },
  { id: 'manual', label: 'Manuelle Literdosierung' },
];

export const FLOCCULANT_PUMP_MODELS = [
  {
    id: 'concept_420_smd',
    pumpTypeId: 'peristaltic',
    label: 'Concept 420 SMD',
    hoseOptions: [
      {
        id: 'blue_sk_3_2',
        color: 'Blau',
        label: 'SK 3,2 mm',
        innerDiameterMm: 3.2,
        minMlH: 15,
        maxMlH: 150,
        minPressureBar: 2.0,
        maxPressureBar: 2.5,
      },
      {
        id: 'green_sk_4_0',
        color: 'Grün',
        label: 'SK 4,0 mm',
        innerDiameterMm: 4.0,
        minMlH: 40,
        maxMlH: 400,
        minPressureBar: 1.5,
        maxPressureBar: 2.0,
      },
      {
        id: 'red_sk_4_0_reinforced',
        color: 'Rot',
        label: 'SK 4,0 mm (verstärkt)',
        innerDiameterMm: 4.0,
        minMlH: 50,
        maxMlH: 500,
        minPressureBar: 2.0,
        maxPressureBar: 2.0,
      },
      {
        id: 'black_sk_4_8',
        color: 'Schwarz',
        label: 'SK 4,8 mm',
        innerDiameterMm: 4.8,
        minMlH: 60,
        maxMlH: 600,
      },
    ],
  },
  {
    id: 'chem_ad_vpp_e',
    pumpTypeId: 'peristaltic',
    label: 'Chem AD VPP E',
    hoseOptions: [
      {
        id: 'blue_sk_3_2',
        color: 'Blau',
        label: 'SK 3,2 mm',
        innerDiameterMm: 3.2,
        minMlH: 15,
        maxMlH: 150,
        minPressureBar: 2.0,
        maxPressureBar: 2.5,
      },
      {
        id: 'green_sk_4_0',
        color: 'Grün',
        label: 'SK 4,0 mm',
        innerDiameterMm: 4.0,
        minMlH: 40,
        maxMlH: 400,
        minPressureBar: 1.5,
        maxPressureBar: 2.0,
      },
      {
        id: 'red_sk_4_0_reinforced',
        color: 'Rot',
        label: 'SK 4,0 mm (verstärkt)',
        innerDiameterMm: 4.0,
        minMlH: 50,
        maxMlH: 500,
        minPressureBar: 2.0,
        maxPressureBar: 2.0,
      },
      {
        id: 'black_sk_4_8',
        color: 'Schwarz',
        label: 'SK 4,8 mm',
        innerDiameterMm: 4.8,
        minMlH: 60,
        maxMlH: 600,
      },
    ],
  },
  {
    id: 'prominent_gamma_x',
    pumpTypeId: 'diaphragm',
    label: 'ProMinent gamma/X',
    minMlH: 40,
    maxMlH: 2000,
  },
  {
    id: 'grundfos_dde_6_10',
    pumpTypeId: 'diaphragm',
    label: 'Grundfos DDE 6-10',
    minMlH: 60,
    maxMlH: 6000,
  },
  {
    id: 'manual_litering',
    pumpTypeId: 'manual',
    label: 'Manuell (Liter an der Pumpe)',
  },
];

export const FLOCCULANT_LOAD_FACTORS = {
  low: 0.85,
  normal: 1,
  high: 1.2,
  peak: 1.35,
};

export const FLOCCULANT_WATER_FACTORS = {
  clear: 0.9,
  normal: 1,
  turbid: 1.2,
  severe: 1.35,
};

export const CHLORINATION_PRODUCTS = [
  {
    id: 'sodium_hypochlorite_13',
    label: 'Chlorbleichlauge (NaOCl, 13% Aktivchlor)',
    productType: 'liquid',
    activeChlorinePercent: 13,
    densityKgPerL: 1.2,
  },
  {
    id: 'aktivchlor_granulate_56',
    label: 'Aktivchlor Granulat (56% Aktivchlor)',
    productType: 'solid',
    activeChlorinePercent: 56,
  },
];

export const ANTICHLOR_PRODUCTS = [
  {
    id: 'antichlor_powder_100',
    label: 'Natriumthiosulfat Pulver (100%)',
    productType: 'solid',
    neutralizationFactorKgPerKgActiveChlorine: 1.8,
  },
  {
    id: 'antichlor_solution_38',
    label: 'Natriumthiosulfat Lösung (38%)',
    productType: 'liquid',
    neutralizationFactorKgPerKgActiveChlorine: 4.74,
    densityKgPerL: 1.3,
  },
];
