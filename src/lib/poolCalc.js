import {
  FLOCCULANT_PRODUCTS,
  FLOCCULANT_PUMP_MODELS,
  FLOCCULANT_LOAD_FACTORS,
  FLOCCULANT_WATER_FACTORS,
  CHLORINATION_PRODUCTS,
  ANTICHLOR_PRODUCTS,
} from '../data/poolChemistry';

export const parseDecimalInput = (value) => {
  const normalized = String(value ?? '').trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatClockTimeFromMinutes = (totalMinutesInput) => {
  const safeMinutes = Math.max(0, Math.round(totalMinutesInput));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  return `${hours}:${String(minutes).padStart(2, '0')} h`;
};

export const formatMl = (valueMlInput) => {
  const valueMl = Number(valueMlInput) || 0;
  return `${valueMl.toFixed(0).replace('.', ',')} ml`;
};

export const formatLitersFromMl = (valueMlInput) => {
  const valueMl = Number(valueMlInput) || 0;
  return `${(valueMl / 1000).toFixed(3).replace('.', ',')} L`;
};

export const resolveFlocculantPumpCapacity = (pumpTypeId, pumpModelId, hoseSizeInput) => {
  const fallbackModel = FLOCCULANT_PUMP_MODELS.find((model) => model.pumpTypeId === pumpTypeId) || null;
  const model = FLOCCULANT_PUMP_MODELS.find(
    (entry) => entry.id === pumpModelId && entry.pumpTypeId === pumpTypeId
  ) || fallbackModel;

  if (!model) {
    return {
      pumpModel: null,
      maxMlH: null,
      minMlH: null,
      selectedHoseSize: null,
      selectedHoseOption: null,
    };
  }

  if (pumpTypeId === 'peristaltic') {
    const hoseOptionsFromArray = Array.isArray(model.hoseOptions) ? model.hoseOptions : [];
    if (hoseOptionsFromArray.length > 0) {
      const normalizedInput = String(hoseSizeInput || '').trim();
      const selectedHoseOption = hoseOptionsFromArray.find((option) => option.id === normalizedInput) || hoseOptionsFromArray[0];

      return {
        pumpModel: model,
        maxMlH: selectedHoseOption?.maxMlH ?? null,
        minMlH: selectedHoseOption?.minMlH ?? null,
        selectedHoseSize: selectedHoseOption?.id ?? null,
        selectedHoseOption,
      };
    }

    const hoseOptions = Object.keys(model.maxMlHByHose || {});
    if (hoseOptions.length === 0) {
      return {
        pumpModel: model,
        maxMlH: null,
        minMlH: null,
        selectedHoseSize: null,
        selectedHoseOption: null,
      };
    }

    const normalizedInput = String(Math.max(1, Math.round(parseDecimalInput(hoseSizeInput) || 0)));
    const selectedHoseSize = hoseOptions.includes(normalizedInput) ? normalizedInput : hoseOptions[0];

    return {
      pumpModel: model,
      maxMlH: model.maxMlHByHose?.[selectedHoseSize] ?? null,
      minMlH: model.minMlHByHose?.[selectedHoseSize] ?? null,
      selectedHoseSize,
      selectedHoseOption: {
        id: selectedHoseSize,
        label: `SK ${selectedHoseSize} mm`,
        innerDiameterMm: parseDecimalInput(selectedHoseSize),
        minMlH: model.minMlHByHose?.[selectedHoseSize] ?? null,
        maxMlH: model.maxMlHByHose?.[selectedHoseSize] ?? null,
      },
    };
  }

  return {
    pumpModel: model,
    maxMlH: model.maxMlH ?? null,
    minMlH: model.minMlH ?? null,
    selectedHoseSize: null,
    selectedHoseOption: null,
  };
};

export const calculatePH = (inputs) => {
  const { chlorine, alkalinity, acidCapacity } = inputs;
  if (!chlorine || !alkalinity) return null;

  let ph = 7.5 + (parseFloat(chlorine) - 0.5) * 0.2 + (parseFloat(alkalinity) - 120) * 0.01;

  if (acidCapacity) {
    ph = ph - (parseFloat(acidCapacity) - 2.5) * 0.15;
  }

  return {
    result: ph.toFixed(2),
    explanation: `Bei ${chlorine} mg/L Chlor, ${alkalinity} mg/L Alkalinität${acidCapacity ? ` und ${acidCapacity} mmol/L Säurekapazität` : ''} ergibt sich ein pH-Wert von ${ph.toFixed(2)}. Optimal: 7,0-7,4`,
    recommendation: ph < 7.0 ? 'pH-Heber (Na₂CO₃) zugeben' : ph > 7.4 ? 'pH-Senker (NaHSO₄) zugeben' : 'pH-Wert optimal!',
    details: acidCapacity ? `Die Säurekapazität von ${acidCapacity} mmol/L zeigt die Pufferfähigkeit des Wassers an.` : null,
  };
};

export const calculateChlorine = (inputs) => {
  const poolVolume = parseDecimalInput(inputs.poolVolume);
  const currentChlorine = parseDecimalInput(inputs.currentChlorine);
  const targetChlorine = parseDecimalInput(inputs.targetChlorine);
  const chlorineDirection = inputs.chlorineDirection === 'decrease' ? 'decrease' : 'increase';

  if (
    poolVolume === null
    || currentChlorine === null
    || targetChlorine === null
    || poolVolume <= 0
    || currentChlorine < 0
    || targetChlorine < 0
  ) {
    return null;
  }

  const deltaMgPerL = targetChlorine - currentChlorine;

  if (chlorineDirection === 'increase') {
    if (deltaMgPerL <= 0) {
      return {
        result: '0,00 kg',
        explanation: `Aktueller Wert ${currentChlorine.toFixed(2).replace('.', ',')} mg/L liegt bereits auf/über Ziel ${targetChlorine.toFixed(2).replace('.', ',')} mg/L.`,
        recommendation: 'Kein Aufchloren notwendig.',
      };
    }

    const product = CHLORINATION_PRODUCTS.find((entry) => entry.id === inputs.chlorineProductId)
      || CHLORINATION_PRODUCTS[0];
    const dosingMethod = inputs.chlorineDosingMethod === 'plant' ? 'plant' : 'manual';
    const activeFraction = (product?.activeChlorinePercent || 0) / 100;
    if (!product || activeFraction <= 0) return null;

    const activeChlorineKg = (deltaMgPerL * poolVolume) / 1000;
    const productMassKg = activeChlorineKg / activeFraction;
    const productLiters = (product.productType === 'liquid' && Number.isFinite(product.densityKgPerL) && product.densityKgPerL > 0)
      ? (productMassKg / product.densityKgPerL)
      : null;

    if (dosingMethod === 'plant') {
      const plantRunHours = parseDecimalInput(inputs.chlorinePlantRunHours);
      if (plantRunHours === null || plantRunHours <= 0 || plantRunHours > 24) return null;

      const productKgPerHour = productMassKg / plantRunHours;
      const productLitersPerHour = productLiters !== null ? productLiters / plantRunHours : null;

      return {
        result: productLitersPerHour !== null
          ? `${productLitersPerHour.toFixed(3).replace('.', ',')} L/h`
          : `${productKgPerHour.toFixed(3).replace('.', ',')} kg/h`,
        explanation: `Aufchloren von ${currentChlorine.toFixed(2).replace('.', ',')} auf ${targetChlorine.toFixed(2).replace('.', ',')} mg/L bei ${poolVolume.toFixed(1).replace('.', ',')} m3.`,
        details: `Produkt: ${product.label}. Aktivchlor-Bedarf: ${activeChlorineKg.toFixed(3).replace('.', ',')} kg. Gesamtmenge Produkt: ${productLiters !== null ? `${productLiters.toFixed(3).replace('.', ',')} L` : `${productMassKg.toFixed(3).replace('.', ',')} kg`} für ${plantRunHours.toFixed(1).replace('.', ',')} h Anlagenlaufzeit.`,
        recommendation: `Chloranlage auf etwa ${productLitersPerHour !== null ? `${productLitersPerHour.toFixed(3).replace('.', ',')} L/h` : `${productKgPerHour.toFixed(3).replace('.', ',')} kg/h`} einstellen und nach 30-60 min nachmessen.`,
      };
    }

    return {
      result: productLiters !== null
        ? `${productLiters.toFixed(3).replace('.', ',')} L`
        : `${productMassKg.toFixed(3).replace('.', ',')} kg`,
      explanation: `Aufchloren von ${currentChlorine.toFixed(2).replace('.', ',')} auf ${targetChlorine.toFixed(2).replace('.', ',')} mg/L bei ${poolVolume.toFixed(1).replace('.', ',')} m3.`,
      details: `Produkt: ${product.label}. Aktivchlor-Bedarf: ${activeChlorineKg.toFixed(3).replace('.', ',')} kg.`,
      recommendation: `Produktmenge ${productLiters !== null ? `${productLiters.toFixed(3).replace('.', ',')} L` : `${productMassKg.toFixed(3).replace('.', ',')} kg`} in Teilgaben dosieren und nach 30-60 min kontrollieren.`,
    };
  }

  const reductionMgPerL = currentChlorine - targetChlorine;
  if (reductionMgPerL <= 0) {
    return {
      result: '0,00 kg',
      explanation: `Aktueller Wert ${currentChlorine.toFixed(2).replace('.', ',')} mg/L liegt bereits auf/unter Ziel ${targetChlorine.toFixed(2).replace('.', ',')} mg/L.`,
      recommendation: 'Kein Runterchloren notwendig.',
    };
  }

  const antichlorProduct = ANTICHLOR_PRODUCTS.find((entry) => entry.id === inputs.antichlorProductId)
    || ANTICHLOR_PRODUCTS[0];
  if (!antichlorProduct) return null;

  const activeChlorineToNeutralizeKg = (reductionMgPerL * poolVolume) / 1000;
  const antichlorMassKg = activeChlorineToNeutralizeKg * (antichlorProduct.neutralizationFactorKgPerKgActiveChlorine || 0);
  if (!Number.isFinite(antichlorMassKg) || antichlorMassKg < 0) return null;

  const antichlorLiters = (antichlorProduct.productType === 'liquid'
    && Number.isFinite(antichlorProduct.densityKgPerL)
    && antichlorProduct.densityKgPerL > 0)
    ? antichlorMassKg / antichlorProduct.densityKgPerL
    : null;

  return {
    result: antichlorLiters !== null
      ? `${antichlorLiters.toFixed(3).replace('.', ',')} L`
      : `${antichlorMassKg.toFixed(3).replace('.', ',')} kg`,
    explanation: `Runterchloren von ${currentChlorine.toFixed(2).replace('.', ',')} auf ${targetChlorine.toFixed(2).replace('.', ',')} mg/L bei ${poolVolume.toFixed(1).replace('.', ',')} m3.`,
    details: `Produkt: ${antichlorProduct.label}. Zu neutralisieren: ${activeChlorineToNeutralizeKg.toFixed(3).replace('.', ',')} kg Aktivchlor.`,
    recommendation: `${antichlorLiters !== null ? `${antichlorLiters.toFixed(3).replace('.', ',')} L` : `${antichlorMassKg.toFixed(3).replace('.', ',')} kg`} Anti-Chlor in 2-3 Teilgaben dosieren, gut umwälzen und nach 15-30 min erneut messen.`,
  };
};

export const calculateVolume = (inputs) => {
  const { length, width, depth } = inputs;
  if (!length || !width || !depth) return null;

  const volume = parseFloat(length) * parseFloat(width) * parseFloat(depth);
  const liters = volume * 1000;

  return {
    result: volume.toFixed(2) + ' m³',
    explanation: `${length}m × ${width}m × ${depth}m = ${volume.toFixed(2)} m³ (${liters.toFixed(0)} Liter)`,
    recommendation: `Bei ${volume.toFixed(0)} m³ beträgt die empfohlene Umwälzrate 4-6 Stunden`,
  };
};

export const calculateIndustrialTime = (inputs) => {
  const mode = inputs.industrialMode || 'clockToIndustrial';

  if (mode === 'clockToIndustrial') {
    const hours = parseDecimalInput(inputs.clockHours);
    const minutes = parseDecimalInput(inputs.clockMinutes);
    if (hours === null || minutes === null || hours < 0 || minutes < 0 || minutes >= 60) {
      return null;
    }

    const totalMinutes = (hours * 60) + minutes;
    const industrialHours = totalMinutes / 60;
    const industrialMinutes = totalMinutes * (100 / 60);

    return {
      result: `${industrialHours.toFixed(2).replace('.', ',')} h`,
      explanation: `${hours} h ${minutes} min entsprechen ${totalMinutes.toFixed(0)} Minuten Gesamtzeit.`,
      details: `Industrieminuten: ${industrialMinutes.toFixed(2).replace('.', ',')} min`,
      recommendation: `Als Industriezeit kannst du ${industrialHours.toFixed(2).replace('.', ',')} h abrechnen.`,
    };
  }

  const industrialHours = parseDecimalInput(inputs.industrialHours);
  if (industrialHours === null || industrialHours < 0) {
    return null;
  }

  const totalMinutes = industrialHours * 60;
  const industrialMinutes = industrialHours * 100;

  return {
    result: formatClockTimeFromMinutes(totalMinutes),
    explanation: `${industrialHours.toFixed(2).replace('.', ',')} Industriestunden entsprechen ${totalMinutes.toFixed(1).replace('.', ',')} Realminuten.`,
    details: `Industrieminuten gesamt: ${industrialMinutes.toFixed(2).replace('.', ',')} min`,
    recommendation: `In Uhrzeit entspricht das ${formatClockTimeFromMinutes(totalMinutes)}.`,
  };
};

export const calculateDilution = (inputs) => {
  const concentrateParts = parseDecimalInput(inputs.concentrateParts);
  const ratioValue = parseDecimalInput(inputs.ratioValue);
  const containerSize = parseDecimalInput(inputs.containerSize);
  const containerCount = parseDecimalInput(inputs.containerCount);
  const containerUnit = inputs.containerUnit === 'ml' ? 'ml' : 'l';
  const dilutionMode = inputs.dilutionMode || 'partToWater';

  if (
    concentrateParts === null
    || ratioValue === null
    || containerSize === null
    || containerCount === null
    || concentrateParts <= 0
    || ratioValue <= 0
    || containerSize <= 0
    || containerCount <= 0
  ) {
    return null;
  }

  const roundedContainerCount = Math.max(1, Math.floor(containerCount));
  const volumePerContainerMl = containerUnit === 'l' ? containerSize * 1000 : containerSize;
  if (!Number.isFinite(volumePerContainerMl) || volumePerContainerMl <= 0) {
    return null;
  }

  const totalParts = dilutionMode === 'partToTotal'
    ? ratioValue
    : concentrateParts + ratioValue;

  if (!Number.isFinite(totalParts) || totalParts <= concentrateParts) {
    return null;
  }

  const totalVolumeMl = volumePerContainerMl * roundedContainerCount;
  const concentrateTotalMl = totalVolumeMl * (concentrateParts / totalParts);
  const waterTotalMl = totalVolumeMl - concentrateTotalMl;

  const concentratePerContainerMl = concentrateTotalMl / roundedContainerCount;
  const waterPerContainerMl = waterTotalMl / roundedContainerCount;

  const ratioText = `${concentrateParts.toString().replace('.', ',')}:${ratioValue.toString().replace('.', ',')}`;
  const modeText = dilutionMode === 'partToTotal'
    ? 'Interpretation: 1:10 bedeutet 1 Teil in 10 Teilen gesamt'
    : 'Interpretation: 1:10 bedeutet 1 Teil + 10 Teile Wasser';

  const roundTo = (value, step = 5) => Math.round(value / step) * step;
  const concentrateRoundedMl = roundTo(concentratePerContainerMl, 5);
  const waterRoundedMl = roundTo(waterPerContainerMl, 5);

  return {
    result: `${formatLitersFromMl(concentrateTotalMl)} Konzentrat`,
    explanation: `${ratioText} für ${roundedContainerCount} Behaelter a ${containerSize.toString().replace('.', ',')} ${containerUnit === 'l' ? 'L' : 'ml'}. ${modeText}.`,
    details: `Pro Behaelter: ${formatMl(concentratePerContainerMl)} Konzentrat + ${formatMl(waterPerContainerMl)} Wasser. Gesamtmenge: ${formatLitersFromMl(totalVolumeMl)}.`,
    recommendation: `Praxiswert je Behaelter (auf 5 ml gerundet): ${concentrateRoundedMl} ml Konzentrat + ${waterRoundedMl} ml Wasser. Gesamt Wasser: ${formatLitersFromMl(waterTotalMl)}.`,
  };
};

export const calculateFlocculation = (inputs) => {
  const circulationFlow = parseDecimalInput(inputs.circulationFlow);
  const poolVolume = parseDecimalInput(inputs.poolVolume);
  const dosingHoursPerDay = parseDecimalInput(inputs.dosingHoursPerDay);
  const stockConcentrationPercent = parseDecimalInput(inputs.stockConcentrationPercent);
  const stockTankLiters = parseDecimalInput(inputs.stockTankLiters);
  const pumpTypeId = inputs.flocPumpTypeId || 'peristaltic';
  const pumpModelId = inputs.flocPumpModelId || '';
  const flocculationMode = inputs.flocculationMode === 'shock' ? 'shock' : 'continuous';
  const loadProfile = inputs.loadProfile || 'normal';
  const waterCondition = inputs.waterCondition || 'normal';

  if (
    circulationFlow === null
    || poolVolume === null
    || dosingHoursPerDay === null
    || stockConcentrationPercent === null
    || stockTankLiters === null
    || circulationFlow <= 0
    || poolVolume <= 0
    || dosingHoursPerDay <= 0
    || dosingHoursPerDay > 24
    || stockConcentrationPercent <= 0
    || stockConcentrationPercent > 100
    || stockTankLiters <= 0
  ) {
    return null;
  }

  const product = FLOCCULANT_PRODUCTS.find((item) => item.id === inputs.flocProductId)
    || FLOCCULANT_PRODUCTS[0];
  if (!product) return null;

  const loadFactor = FLOCCULANT_LOAD_FACTORS[loadProfile] || 1;
  const waterFactor = FLOCCULANT_WATER_FACTORS[waterCondition] || 1;
  const baseDoseMlPerM3 = flocculationMode === 'shock'
    ? product.shockDoseMlPerM3
    : product.continuousDoseMlPerM3;
  const adjustedDoseMlPerM3 = baseDoseMlPerM3 * loadFactor * waterFactor;

  const pureProductMlH = circulationFlow * adjustedDoseMlPerM3;
  const pureProductMlDay = pureProductMlH * dosingHoursPerDay;

  const stockFraction = stockConcentrationPercent / 100;
  const stockSolutionMlH = pureProductMlH / stockFraction;
  const stockSolutionMlDay = stockSolutionMlH * dosingHoursPerDay;

  const turnoversPerDay = (circulationFlow * dosingHoursPerDay) / poolVolume;
  const tankRuntimeHours = stockSolutionMlH > 0
    ? (stockTankLiters * 1000) / stockSolutionMlH
    : null;
  const tankProductLiters = stockTankLiters * stockFraction;
  const tankWaterLiters = Math.max(0, stockTankLiters - tankProductLiters);

  const {
    pumpModel,
    maxMlH,
    minMlH,
    selectedHoseSize,
    selectedHoseOption,
  } = resolveFlocculantPumpCapacity(pumpTypeId, pumpModelId, inputs.flocHoseSizeMm);

  const modelCapacityInfo = (() => {
    if (!pumpModel || !maxMlH) return null;
    const settingPercent = (stockSolutionMlH / maxMlH) * 100;
    const minPercent = minMlH ? (minMlH / maxMlH) * 100 : 0;
    return { settingPercent, minPercent };
  })();

  let recommendation = `Ziel-Dosierung: ${adjustedDoseMlPerM3.toFixed(3).replace('.', ',')} ml/m3 (Produkt).`;
  if (pumpTypeId === 'manual') {
    recommendation = `Manuell pro Tag dosieren: ${(pureProductMlDay / 1000).toFixed(2).replace('.', ',')} L Produkt.`;
  } else if (!pumpModel || !maxMlH) {
    recommendation = `Pumpenmodell oder Kapazität fehlt. Zielzufuhr: ${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h Dosierloesung.`;
  } else if (modelCapacityInfo.settingPercent > 100) {
    recommendation = `Pumpe zu klein: benoetigt ${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h, Modell schafft ${(maxMlH / 1000).toFixed(3).replace('.', ',')} L/h.`;
  } else if (modelCapacityInfo.minPercent > 0 && modelCapacityInfo.settingPercent < modelCapacityInfo.minPercent) {
    recommendation = `Pumpe läuft unter Mindestbereich. Stellwert waere ${modelCapacityInfo.settingPercent.toFixed(1).replace('.', ',')}%. Größere Verduennung oder kleineres Modell nutzen.`;
  } else {
    recommendation = `Pumpeneinstellung: ca. ${modelCapacityInfo.settingPercent.toFixed(1).replace('.', ',')}% (${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h).`;
  }

  const hoseLabel = selectedHoseOption?.label || (selectedHoseSize ? `${selectedHoseSize} mm` : '');
  const hoseColorText = selectedHoseOption?.color ? `${selectedHoseOption.color} ` : '';
  const pressureLower = Number.isFinite(selectedHoseOption?.minPressureBar) ? selectedHoseOption.minPressureBar : null;
  const pressureUpper = Number.isFinite(selectedHoseOption?.maxPressureBar) ? selectedHoseOption.maxPressureBar : null;
  const pressureText = (() => {
    if (pressureLower !== null && pressureUpper !== null) {
      if (Math.abs(pressureLower - pressureUpper) < 0.001) {
        return `${pressureLower.toFixed(1).replace('.', ',')} bar`;
      }
      return `${pressureLower.toFixed(1).replace('.', ',')} - ${pressureUpper.toFixed(1).replace('.', ',')} bar`;
    }
    if (pressureUpper !== null) return `${pressureUpper.toFixed(1).replace('.', ',')} bar`;
    if (pressureLower !== null) return `${pressureLower.toFixed(1).replace('.', ',')} bar`;
    return null;
  })();
  const hoseText = hoseLabel ? ` | Schlauch: ${hoseColorText}${hoseLabel}` : '';
  const hosePressureText = pressureText ? ` | Druckbereich: ${pressureText}` : '';
  const modelText = pumpModel ? `${pumpModel.label}${hoseText}` : 'kein Modell';

  return {
    result: `${(stockSolutionMlH / 1000).toFixed(3).replace('.', ',')} L/h Dosierloesung`,
    explanation: `${product.label} (${product.base === 'aluminum' ? 'Aluminiumbasis' : 'Eisenbasis'}) bei ${circulationFlow.toFixed(1).replace('.', ',')} m3/h Umwälzung. Berechnung für ${flocculationMode === 'shock' ? 'Stoss' : 'kontinuierliche'} Flockung.`,
    details: `Produktbedarf: ${(pureProductMlH / 1000).toFixed(3).replace('.', ',')} L/h bzw. ${(pureProductMlDay / 1000).toFixed(2).replace('.', ',')} L/Tag. | Dosierloesung: ${(stockSolutionMlDay / 1000).toFixed(2).replace('.', ',')} L/Tag bei ${stockConcentrationPercent.toFixed(1).replace('.', ',')}% Ansatz. | Modell: ${modelText}${hosePressureText}. | Becken-Umwälzungen/Tag: ${turnoversPerDay.toFixed(2).replace('.', ',')}. | Ansatz für ${stockTankLiters.toFixed(1).replace('.', ',')} L: ${tankProductLiters.toFixed(2).replace('.', ',')} L Produkt + ${tankWaterLiters.toFixed(2).replace('.', ',')} L Wasser. | Tankreichweite: ${tankRuntimeHours ? `${tankRuntimeHours.toFixed(1).replace('.', ',')} h` : '-'}.`,
    recommendation,
  };
};
