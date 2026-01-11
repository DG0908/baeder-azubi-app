import React, { useState, useEffect } from 'react';
import { Trophy, MessageCircle, BookOpen, Bell, ClipboardList, Users, Plus, Send, Check, X, Upload, Download, Calendar, Award, Brain, Home, Target, TrendingUp, Zap, Star, Shield, Trash2, UserCog, Lock, AlertTriangle } from 'lucide-react';
import { supabase } from './supabase';

const CATEGORIES = [
  { id: 'org', name: 'Bäderorganisation', color: 'bg-blue-500', icon: '📋' },
  { id: 'pol', name: 'Politik & Wirtschaft', color: 'bg-green-500', icon: '🏛️' },
  { id: 'tech', name: 'Bädertechnik', color: 'bg-purple-500', icon: '⚗️' },
  { id: 'swim', name: 'Schwimm- & Rettungslehre', color: 'bg-cyan-500', icon: '🏊' },
  { id: 'first', name: 'Erste Hilfe', color: 'bg-red-500', icon: '🚑' },
  { id: 'hygiene', name: 'Hygiene', color: 'bg-yellow-500', icon: '🧼' },
  { id: 'health', name: 'Gesundheitslehre', color: 'bg-pink-500', icon: '🫀' }
];

const POOL_CHEMICALS = [
  { name: 'Natriumhypochlorit', formula: 'NaClO', use: 'Flüssigchlor zur Desinfektion' },
  { name: 'Calciumhypochlorit', formula: 'Ca(ClO)₂', use: 'Schnelllösliches Chlorgranulat' },
  { name: 'Trichlor', formula: 'C₃Cl₃N₃O₃', use: 'Langsam lösliche Chlortabletten' },
  { name: 'Natriumcarbonat', formula: 'Na₂CO₃', use: 'pH-Heber (Soda)' },
  { name: 'Natriumhydrogencarbonat', formula: 'NaHCO₃', use: 'Alkalinität erhöhen' },
  { name: 'Natriumhydrogensulfat', formula: 'NaHSO₄', use: 'pH-Senker' },
  { name: 'Salzsäure', formula: 'HCl', use: 'pH-Senker (stark)' },
  { name: 'Schwefelsäure', formula: 'H₂SO₄', use: 'pH-Senker (industriell)' },
  { name: 'Aluminiumsulfat', formula: 'Al₂(SO₄)₃', use: 'Flockungsmittel' },
  { name: 'Calciumchlorid', formula: 'CaCl₂', use: 'Wasserhärte erhöhen' },
  { name: 'Natriumthiosulfat', formula: 'Na₂S₂O₃', use: 'Chlor neutralisieren' },
  { name: 'Wasserstoffperoxid', formula: 'H₂O₂', use: 'Sauerstoffbleiche/Oxidation' }
];

const PERIODIC_TABLE = [
  // Periode 1
  { symbol: 'H', name: 'Wasserstoff', number: 1, mass: '1.008', group: 1, period: 1, category: 'nonmetal' },
  { symbol: 'He', name: 'Helium', number: 2, mass: '4.003', group: 18, period: 1, category: 'noble-gas' },
  // Periode 2
  { symbol: 'Li', name: 'Lithium', number: 3, mass: '6.94', group: 1, period: 2, category: 'alkali' },
  { symbol: 'Be', name: 'Beryllium', number: 4, mass: '9.012', group: 2, period: 2, category: 'alkaline-earth' },
  { symbol: 'B', name: 'Bor', number: 5, mass: '10.81', group: 13, period: 2, category: 'metalloid' },
  { symbol: 'C', name: 'Kohlenstoff', number: 6, mass: '12.01', group: 14, period: 2, category: 'nonmetal' },
  { symbol: 'N', name: 'Stickstoff', number: 7, mass: '14.01', group: 15, period: 2, category: 'nonmetal' },
  { symbol: 'O', name: 'Sauerstoff', number: 8, mass: '16.00', group: 16, period: 2, category: 'nonmetal' },
  { symbol: 'F', name: 'Fluor', number: 9, mass: '19.00', group: 17, period: 2, category: 'halogen' },
  { symbol: 'Ne', name: 'Neon', number: 10, mass: '20.18', group: 18, period: 2, category: 'noble-gas' },
  // Periode 3
  { symbol: 'Na', name: 'Natrium', number: 11, mass: '22.99', group: 1, period: 3, category: 'alkali' },
  { symbol: 'Mg', name: 'Magnesium', number: 12, mass: '24.31', group: 2, period: 3, category: 'alkaline-earth' },
  { symbol: 'Al', name: 'Aluminium', number: 13, mass: '26.98', group: 13, period: 3, category: 'post-transition' },
  { symbol: 'Si', name: 'Silicium', number: 14, mass: '28.09', group: 14, period: 3, category: 'metalloid' },
  { symbol: 'P', name: 'Phosphor', number: 15, mass: '30.97', group: 15, period: 3, category: 'nonmetal' },
  { symbol: 'S', name: 'Schwefel', number: 16, mass: '32.07', group: 16, period: 3, category: 'nonmetal' },
  { symbol: 'Cl', name: 'Chlor', number: 17, mass: '35.45', group: 17, period: 3, category: 'halogen' },
  { symbol: 'Ar', name: 'Argon', number: 18, mass: '39.95', group: 18, period: 3, category: 'noble-gas' },
  // Periode 4
  { symbol: 'K', name: 'Kalium', number: 19, mass: '39.10', group: 1, period: 4, category: 'alkali' },
  { symbol: 'Ca', name: 'Calcium', number: 20, mass: '40.08', group: 2, period: 4, category: 'alkaline-earth' },
  { symbol: 'Sc', name: 'Scandium', number: 21, mass: '44.96', group: 3, period: 4, category: 'transition' },
  { symbol: 'Ti', name: 'Titan', number: 22, mass: '47.87', group: 4, period: 4, category: 'transition' },
  { symbol: 'V', name: 'Vanadium', number: 23, mass: '50.94', group: 5, period: 4, category: 'transition' },
  { symbol: 'Cr', name: 'Chrom', number: 24, mass: '52.00', group: 6, period: 4, category: 'transition' },
  { symbol: 'Mn', name: 'Mangan', number: 25, mass: '54.94', group: 7, period: 4, category: 'transition' },
  { symbol: 'Fe', name: 'Eisen', number: 26, mass: '55.85', group: 8, period: 4, category: 'transition' },
  { symbol: 'Co', name: 'Cobalt', number: 27, mass: '58.93', group: 9, period: 4, category: 'transition' },
  { symbol: 'Ni', name: 'Nickel', number: 28, mass: '58.69', group: 10, period: 4, category: 'transition' },
  { symbol: 'Cu', name: 'Kupfer', number: 29, mass: '63.55', group: 11, period: 4, category: 'transition' },
  { symbol: 'Zn', name: 'Zink', number: 30, mass: '65.38', group: 12, period: 4, category: 'transition' },
  { symbol: 'Ga', name: 'Gallium', number: 31, mass: '69.72', group: 13, period: 4, category: 'post-transition' },
  { symbol: 'Ge', name: 'Germanium', number: 32, mass: '72.63', group: 14, period: 4, category: 'metalloid' },
  { symbol: 'As', name: 'Arsen', number: 33, mass: '74.92', group: 15, period: 4, category: 'metalloid' },
  { symbol: 'Se', name: 'Selen', number: 34, mass: '78.97', group: 16, period: 4, category: 'nonmetal' },
  { symbol: 'Br', name: 'Brom', number: 35, mass: '79.90', group: 17, period: 4, category: 'halogen' },
  { symbol: 'Kr', name: 'Krypton', number: 36, mass: '83.80', group: 18, period: 4, category: 'noble-gas' },
  // Periode 5
  { symbol: 'Rb', name: 'Rubidium', number: 37, mass: '85.47', group: 1, period: 5, category: 'alkali' },
  { symbol: 'Sr', name: 'Strontium', number: 38, mass: '87.62', group: 2, period: 5, category: 'alkaline-earth' },
  { symbol: 'Y', name: 'Yttrium', number: 39, mass: '88.91', group: 3, period: 5, category: 'transition' },
  { symbol: 'Zr', name: 'Zirconium', number: 40, mass: '91.22', group: 4, period: 5, category: 'transition' },
  { symbol: 'Nb', name: 'Niob', number: 41, mass: '92.91', group: 5, period: 5, category: 'transition' },
  { symbol: 'Mo', name: 'Molybdän', number: 42, mass: '95.95', group: 6, period: 5, category: 'transition' },
  { symbol: 'Tc', name: 'Technetium', number: 43, mass: '98', group: 7, period: 5, category: 'transition' },
  { symbol: 'Ru', name: 'Ruthenium', number: 44, mass: '101.07', group: 8, period: 5, category: 'transition' },
  { symbol: 'Rh', name: 'Rhodium', number: 45, mass: '102.91', group: 9, period: 5, category: 'transition' },
  { symbol: 'Pd', name: 'Palladium', number: 46, mass: '106.42', group: 10, period: 5, category: 'transition' },
  { symbol: 'Ag', name: 'Silber', number: 47, mass: '107.87', group: 11, period: 5, category: 'transition' },
  { symbol: 'Cd', name: 'Cadmium', number: 48, mass: '112.41', group: 12, period: 5, category: 'transition' },
  { symbol: 'In', name: 'Indium', number: 49, mass: '114.82', group: 13, period: 5, category: 'post-transition' },
  { symbol: 'Sn', name: 'Zinn', number: 50, mass: '118.71', group: 14, period: 5, category: 'post-transition' },
  { symbol: 'Sb', name: 'Antimon', number: 51, mass: '121.76', group: 15, period: 5, category: 'metalloid' },
  { symbol: 'Te', name: 'Tellur', number: 52, mass: '127.60', group: 16, period: 5, category: 'metalloid' },
  { symbol: 'I', name: 'Iod', number: 53, mass: '126.90', group: 17, period: 5, category: 'halogen' },
  { symbol: 'Xe', name: 'Xenon', number: 54, mass: '131.29', group: 18, period: 5, category: 'noble-gas' },
  // Periode 6
  { symbol: 'Cs', name: 'Cäsium', number: 55, mass: '132.91', group: 1, period: 6, category: 'alkali' },
  { symbol: 'Ba', name: 'Barium', number: 56, mass: '137.33', group: 2, period: 6, category: 'alkaline-earth' },
  { symbol: 'La', name: 'Lanthan', number: 57, mass: '138.91', group: 3, period: 6, category: 'lanthanide' },
  { symbol: 'Hf', name: 'Hafnium', number: 72, mass: '178.49', group: 4, period: 6, category: 'transition' },
  { symbol: 'Ta', name: 'Tantal', number: 73, mass: '180.95', group: 5, period: 6, category: 'transition' },
  { symbol: 'W', name: 'Wolfram', number: 74, mass: '183.84', group: 6, period: 6, category: 'transition' },
  { symbol: 'Re', name: 'Rhenium', number: 75, mass: '186.21', group: 7, period: 6, category: 'transition' },
  { symbol: 'Os', name: 'Osmium', number: 76, mass: '190.23', group: 8, period: 6, category: 'transition' },
  { symbol: 'Ir', name: 'Iridium', number: 77, mass: '192.22', group: 9, period: 6, category: 'transition' },
  { symbol: 'Pt', name: 'Platin', number: 78, mass: '195.08', group: 10, period: 6, category: 'transition' },
  { symbol: 'Au', name: 'Gold', number: 79, mass: '196.97', group: 11, period: 6, category: 'transition' },
  { symbol: 'Hg', name: 'Quecksilber', number: 80, mass: '200.59', group: 12, period: 6, category: 'transition' },
  { symbol: 'Tl', name: 'Thallium', number: 81, mass: '204.38', group: 13, period: 6, category: 'post-transition' },
  { symbol: 'Pb', name: 'Blei', number: 82, mass: '207.2', group: 14, period: 6, category: 'post-transition' },
  { symbol: 'Bi', name: 'Bismut', number: 83, mass: '208.98', group: 15, period: 6, category: 'post-transition' },
  { symbol: 'Po', name: 'Polonium', number: 84, mass: '209', group: 16, period: 6, category: 'metalloid' },
  { symbol: 'At', name: 'Astat', number: 85, mass: '210', group: 17, period: 6, category: 'halogen' },
  { symbol: 'Rn', name: 'Radon', number: 86, mass: '222', group: 18, period: 6, category: 'noble-gas' },
  // Periode 7
  { symbol: 'Fr', name: 'Francium', number: 87, mass: '223', group: 1, period: 7, category: 'alkali' },
  { symbol: 'Ra', name: 'Radium', number: 88, mass: '226', group: 2, period: 7, category: 'alkaline-earth' },
  { symbol: 'Ac', name: 'Actinium', number: 89, mass: '227', group: 3, period: 7, category: 'actinide' },
  { symbol: 'Rf', name: 'Rutherfordium', number: 104, mass: '267', group: 4, period: 7, category: 'transition' },
  { symbol: 'Db', name: 'Dubnium', number: 105, mass: '268', group: 5, period: 7, category: 'transition' },
  { symbol: 'Sg', name: 'Seaborgium', number: 106, mass: '269', group: 6, period: 7, category: 'transition' },
  { symbol: 'Bh', name: 'Bohrium', number: 107, mass: '270', group: 7, period: 7, category: 'transition' },
  { symbol: 'Hs', name: 'Hassium', number: 108, mass: '277', group: 8, period: 7, category: 'transition' },
  { symbol: 'Mt', name: 'Meitnerium', number: 109, mass: '278', group: 9, period: 7, category: 'transition' },
  { symbol: 'Ds', name: 'Darmstadtium', number: 110, mass: '281', group: 10, period: 7, category: 'transition' },
  { symbol: 'Rg', name: 'Roentgenium', number: 111, mass: '282', group: 11, period: 7, category: 'transition' },
  { symbol: 'Cn', name: 'Copernicium', number: 112, mass: '285', group: 12, period: 7, category: 'transition' },
  { symbol: 'Nh', name: 'Nihonium', number: 113, mass: '286', group: 13, period: 7, category: 'post-transition' },
  { symbol: 'Fl', name: 'Flerovium', number: 114, mass: '289', group: 14, period: 7, category: 'post-transition' },
  { symbol: 'Mc', name: 'Moscovium', number: 115, mass: '290', group: 15, period: 7, category: 'post-transition' },
  { symbol: 'Lv', name: 'Livermorium', number: 116, mass: '293', group: 16, period: 7, category: 'post-transition' },
  { symbol: 'Ts', name: 'Tenness', number: 117, mass: '294', group: 17, period: 7, category: 'halogen' },
  { symbol: 'Og', name: 'Oganesson', number: 118, mass: '294', group: 18, period: 7, category: 'noble-gas' }
];

const DID_YOU_KNOW_FACTS = [
  "💧 Ein Schwimmbecken verliert täglich ca. 3-5 mm Wasser durch Verdunstung.",
  "🌡️ Die optimale Wassertemperatur für ein Sportbecken liegt bei 26-28°C.",
  "⚗️ 1 mg/l freies Chlor entspricht etwa 1 ppm (parts per million).",
  "🏊 Ein Erwachsener verdrängt beim Schwimmen ca. 70-80 Liter Wasser.",
  "💦 Pro Badegast rechnet man mit ca. 30 Litern Frischwasserbedarf pro Tag.",
  "🔬 Der pH-Wert des Wassers beeinflusst die Desinfektionswirkung von Chlor erheblich.",
  "🌊 Die Umwälzrate gibt an, wie oft das gesamte Beckenwasser pro Tag gefiltert wird.",
  "🧪 Gebundenes Chlor (Chloramine) verursacht den typischen 'Schwimmbad-Geruch'.",
  "⏱️ Die ideale Umwälzzeit für ein Schwimmbecken beträgt 4-6 Stunden.",
  "🏗️ Edelstahlbecken sind hygienischer als geflieste Becken, da es keine Fugen gibt."
];

const DAILY_WISDOM = [
  // Hauptstädte & Geographie
  "Die Hauptstadt von Australien ist Canberra, nicht Sydney.",
  "Die Hauptstadt von Kanada ist Ottawa, nicht Toronto.",
  "Die Hauptstadt der Schweiz ist Bern.",
  "Der längste Fluss der Welt ist der Nil mit ca. 6.650 km.",
  "Der Mount Everest ist 8.849 Meter hoch - der höchste Berg der Erde.",
  "Russland erstreckt sich über 11 Zeitzonen.",
  "Monaco ist mit 2 km² das zweitkleinste Land der Welt.",
  "Die Sahara ist etwa so groß wie die gesamte USA.",
  "Island liegt auf der Grenze zweier tektonischer Platten.",
  "Der Marianengraben ist mit 11.034 m die tiefste Stelle der Ozeane.",

  // Geschichte
  "Die Berliner Mauer fiel am 9. November 1989.",
  "Die erste Mondlandung war am 20. Juli 1969.",
  "Das Römische Reich existierte über 1.000 Jahre.",
  "Die Französische Revolution begann 1789.",
  "Der Zweite Weltkrieg endete 1945.",
  "Die Chinesische Mauer ist über 21.000 km lang.",
  "Die Pyramiden von Gizeh sind etwa 4.500 Jahre alt.",
  "Das erste gedruckte Buch war die Gutenberg-Bibel um 1455.",
  "Die Titanic sank am 15. April 1912.",
  "Das Kolosseum in Rom fasste ca. 50.000 Zuschauer.",

  // Wissenschaft & Natur
  "Licht braucht 8 Minuten von der Sonne zur Erde.",
  "Der menschliche Körper besteht zu etwa 60% aus Wasser.",
  "Ein Blitz kann bis zu 30.000°C heiß werden.",
  "Honig kann nicht schlecht werden - auch nach 3.000 Jahren nicht.",
  "Oktopusse haben drei Herzen und blaues Blut.",
  "Die Erde dreht sich mit etwa 1.670 km/h am Äquator.",
  "Ein Tag auf der Venus dauert länger als ein Jahr auf der Venus.",
  "Wasser ist die einzige Substanz, die in allen drei Aggregatzuständen natürlich vorkommt.",
  "Das menschliche Gehirn verbraucht etwa 20% unserer Energie.",
  "Diamanten bestehen nur aus Kohlenstoff - wie Bleistiftminen.",

  // Schwimmbad-Insider
  "Das erste öffentliche Hallenbad Deutschlands eröffnete 1855 in Berlin.",
  "Ein olympisches Schwimmbecken fasst 2,5 Millionen Liter Wasser.",
  "Die optimale Luftfeuchtigkeit im Hallenbad liegt bei 50-60%.",
  "Schwimmen verbrennt etwa 500 Kalorien pro Stunde.",
  "Der Weltrekord im 50m-Freistil liegt bei unter 21 Sekunden.",
  "Chlor wurde erstmals 1774 entdeckt.",
  "Die Wassertemperatur bei Olympischen Spielen muss zwischen 25-28°C liegen.",
  "Pro Badegast gelangen ca. 0,5-1 Liter Wasser durch Anhaftung aus dem Becken.",
  "Der typische Chlorgeruch entsteht erst durch die Reaktion mit Verunreinigungen.",
  "Deutschland hat über 6.000 öffentliche Schwimmbäder.",

  // Allgemeinwissen
  "Die menschliche Nase kann über 1 Billion Gerüche unterscheiden.",
  "Venedig wurde auf 118 kleinen Inseln erbaut.",
  "Ein Faultier bewegt sich mit maximal 0,27 km/h fort.",
  "Die Stradivari-Geigen sind so wertvoll wegen des speziellen Holzes und Lacks.",
  "Der Eiffelturm wächst im Sommer durch die Hitze um ca. 15 cm.",
  "Bananen sind botanisch gesehen Beeren, Erdbeeren nicht.",
  "Ein Kolibri kann rückwärts fliegen - als einziger Vogel.",
  "Die Zugspitze ist mit 2.962 m der höchste Berg Deutschlands.",
  "Es gibt mehr Sterne im Universum als Sandkörner auf der Erde.",
  "Der kürzeste Krieg der Geschichte dauerte nur 38 Minuten (England vs. Sansibar, 1896)."
];

const SAFETY_SCENARIOS = [
  {
    title: "Stromausfall im Hallenbad",
    problem: "Plötzlicher Stromausfall während des Badebetriebs",
    solution: "1. Ruhe bewahren und Badegäste beruhigen\n2. Notbeleuchtung aktivieren\n3. Becken räumen (Gefahr durch fehlende Filterung)\n4. Hauptschalter kontrollieren\n5. Bei längerem Ausfall: Bad schließen",
    priority: "high"
  },
  {
    title: "Chlorgasaustritt",
    problem: "Geruch nach Chlorgas im Technikraum",
    solution: "1. SOFORT Raum verlassen und Tür schließen\n2. Feuerwehr alarmieren (112)\n3. Badegäste evakuieren\n4. Belüftung einschalten (falls gefahrlos möglich)\n5. Nie ohne Atemschutz betreten!",
    priority: "critical"
  },
  {
    title: "Trübes Wasser",
    problem: "Wasser wird plötzlich milchig-trüb",
    solution: "1. Becken sofort sperren\n2. Filteranlage überprüfen (läuft sie?)\n3. Wasserwerte messen (pH, Chlor)\n4. Rückspülung durchführen\n5. Flockungsmittel dosieren\n6. Erst nach Klärung wieder freigeben",
    priority: "medium"
  },
  {
    title: "Überdosierung Chemikalien",
    problem: "Zu viel Chlor/pH-Mittel zugegeben",
    solution: "1. Becken sperren\n2. Werte messen und dokumentieren\n3. Bei Chlor >3 mg/l: Frischwasser zugeben\n4. Umwälzung auf Maximum\n5. Regelmäßig nachmessen\n6. Erst bei Normwerten freigeben",
    priority: "high"
  },
  {
    title: "Filteranlage defekt",
    problem: "Pumpe läuft nicht / kein Druck",
    solution: "1. Becken sperren\n2. Hauptschalter Filter aus\n3. Vorfilter auf Verstopfung prüfen\n4. Dichtungen kontrollieren\n5. Techniker rufen\n6. Alternative Filterung organisieren",
    priority: "high"
  }
];

const WORK_SAFETY_TOPICS = [
  {
    category: "Persönliche Schutzausrüstung (PSA)",
    icon: "🦺",
    items: [
      "Schutzbrille beim Umgang mit Chemikalien (Pflicht!)",
      "Chemikalienschutzhandschuhe bei Chlor/Säure-Handling",
      "Sicherheitsschuhe im Technikbereich",
      "Gehörschutz bei lauten Pumpen/Aggregaten",
      "Warnweste bei Arbeiten im Außenbereich"
    ]
  },
  {
    category: "Gefahrstoffe",
    icon: "⚠️",
    items: [
      "Chlorgas ist hochgiftig - Feuerwehr bei Austritt!",
      "Säuren und Laugen NIEMALS mischen",
      "Chemikalien immer beschriften und verschlossen lagern",
      "Sicherheitsdatenblätter griffbereit halten",
      "Augendusche und Notdusche regelmäßig prüfen"
    ]
  },
  {
    category: "Elektrische Sicherheit",
    icon: "⚡",
    items: [
      "FI-Schutzschalter monatlich testen",
      "Elektrische Geräte nicht im Nassbereich verwenden",
      "Defekte Geräte sofort außer Betrieb nehmen",
      "Nur geschultes Personal an Elektrik arbeiten lassen",
      "Prüfprotokolle führen (DGUV V3)"
    ]
  },
  {
    category: "Rutschgefahr & Stolperfallen",
    icon: "⚠️",
    items: [
      "Nasse Bereiche sofort kennzeichnen/absperren",
      "Rutschhemmende Fliesen im Nassbereich (R10-R13)",
      "Barfußbereiche frei von Hindernissen halten",
      "Regelmäßige Reinigung gegen Biofilm",
      "Stolperstellen (Kabel, Schwellen) markieren"
    ]
  },
  {
    category: "Erste Hilfe",
    icon: "🚑",
    items: [
      "Ersthelfer-Ausbildung alle 2 Jahre auffrischen",
      "Erste-Hilfe-Kasten monatlich auf Vollständigkeit prüfen",
      "Notrufnummern gut sichtbar aushängen",
      "AED (Defibrillator) einsatzbereit halten",
      "Unfallmeldebuch führen"
    ]
  }
];

const SAMPLE_QUESTIONS = {
  org: [
    { q: 'Was ist ein Hausrecht?', a: ['Recht des Badbetreibers, Hausordnung durchzusetzen', 'Recht auf ein Haus', 'Baurecht', 'Mietrecht'], correct: 0 },
    { q: 'Wie lange muss eine Aufsichtsperson im Bad sein?', a: ['Während der Öffnungszeiten', 'Nur morgens', 'Nur abends', 'Keine Pflicht'], correct: 0 },
    { q: 'Was regelt die Badeordnung?', a: ['Verhalten der Badegäste', 'Wassertemperatur', 'Eintrittspreise', 'Öffnungszeiten'], correct: 0 }
  ],
  tech: [
    { q: 'Was ist der pH-Wert von neutralem Wasser?', a: ['7', '5', '9', '11'], correct: 0 },
    { q: 'Welche Temperatur hat ein Sportbecken normalerweise?', a: ['26-28°C', '20-22°C', '30-32°C', '35-37°C'], correct: 0 },
    { q: 'Was macht eine Umwälzpumpe?', a: ['Pumpt Wasser durch Filter', 'Heizt das Wasser', 'Misst den pH-Wert', 'Chloriert das Wasser'], correct: 0 }
  ],
  swim: [
    { q: 'Was ist der Rautek-Griff?', a: ['Rettungsgriff', 'Schwimmtechnik', 'Sprungfigur', 'Tauchübung'], correct: 0 },
    { q: 'Welches Abzeichen benötigt man für Rettungsschwimmer?', a: ['DLRG Bronze/Silber/Gold', 'Seepferdchen', 'Freischwimmer', 'Hai'], correct: 0 },
    { q: 'Was ist ein Anlandbringen?', a: ['Retten einer Person ans Ufer', 'Sprungübung', 'Tauchgang', 'Schwimmstil'], correct: 0 }
  ],
  first: [
    { q: 'Was ist die stabile Seitenlage?', a: ['Lagerung bewusstloser Personen', 'Schwimmposition', 'Erste-Hilfe-Tasche', 'Rettungsgriff'], correct: 0 },
    { q: 'Wie oft drückt man bei einer Herzdruckmassage pro Minute?', a: ['100-120 mal', '60 mal', '200 mal', '30 mal'], correct: 0 },
    { q: 'Was ist ein Defibrillator?', a: ['Gerät zur Herzrhythmus-Wiederherstellung', 'Beatmungsgerät', 'Blutdruckmesser', 'Thermometer'], correct: 0 }
  ],
  hygiene: [
    { q: 'Warum muss vor dem Schwimmen geduscht werden?', a: ['Hygiene und Wasserqualität', 'Nur zur Gewohnheit', 'Gesetzliche Pflicht', 'Für warmes Wasser'], correct: 0 },
    { q: 'Was ist eine Legionellenprüfung?', a: ['Kontrolle auf Bakterien im Wasser', 'Sicherheitscheck', 'Temperaturmessung', 'pH-Test'], correct: 0 },
    { q: 'Wie oft muss ein Schwimmbecken gereinigt werden?', a: ['Täglich', 'Wöchentlich', 'Monatlich', 'Jährlich'], correct: 0 }
  ],
  pol: [
    { q: 'Was regelt das Arbeitsrecht?', a: ['Beziehung Arbeitgeber-Arbeitnehmer', 'Nur Gehälter', 'Nur Urlaub', 'Nur Kündigung'], correct: 0 },
    { q: 'Was ist eine Berufsgenossenschaft?', a: ['Unfallversicherung', 'Gewerkschaft', 'Arbeitgeberverband', 'Prüfungsamt'], correct: 0 },
    { q: 'Was bedeutet Tarifvertrag?', a: ['Vereinbarung über Arbeitsbedingungen', 'Mietvertrag', 'Kaufvertrag', 'Versicherungsvertrag'], correct: 0 }
  ],
  health: [
    { q: 'Wie viele Knochen hat der erwachsene Mensch?', a: ['206', '150', '300', '100'], correct: 0 },
    { q: 'Was ist das größte Organ des Menschen?', a: ['Die Haut', 'Die Leber', 'Das Herz', 'Die Lunge'], correct: 0 },
    { q: 'Wie viele Liter Blut pumpt das Herz pro Tag?', a: ['Ca. 7.000 Liter', 'Ca. 1.000 Liter', 'Ca. 500 Liter', 'Ca. 10.000 Liter'], correct: 0 },
    { q: 'Was transportiert das Blut im Körper?', a: ['Sauerstoff und Nährstoffe', 'Nur Wasser', 'Nur Hormone', 'Nur CO2'], correct: 0 },
    { q: 'Welches Organ filtert das Blut?', a: ['Die Nieren', 'Die Leber', 'Die Milz', 'Das Herz'], correct: 0 },
    { q: 'Wie viele Herzkammern hat das menschliche Herz?', a: ['4', '2', '3', '6'], correct: 0 },
    { q: 'Was ist die Funktion der Lunge?', a: ['Gasaustausch (O2/CO2)', 'Blutreinigung', 'Hormonproduktion', 'Verdauung'], correct: 0 },
    { q: 'Wo findet die Verdauung hauptsächlich statt?', a: ['Im Dünndarm', 'Im Magen', 'Im Dickdarm', 'In der Speiseröhre'], correct: 0 }
  ]
};

const PERMISSIONS = {
  admin: {
    label: 'Administrator',
    canManageUsers: true,
    canApproveQuestions: true,
    canUploadMaterials: true,
    canPostNews: true,
    canViewAllStats: true,
    canDeleteData: true
  },
  trainer: {
    label: 'Ausbilder',
    canManageUsers: false,
    canApproveQuestions: true,
    canUploadMaterials: true,
    canPostNews: true,
    canViewAllStats: true,
    canDeleteData: false
  },
  azubi: {
    label: 'Azubi',
    canManageUsers: false,
    canApproveQuestions: false,
    canUploadMaterials: false,
    canPostNews: false,
    canViewAllStats: false,
    canDeleteData: false
  }
};

// Demo-Accounts entfernt - alle Logins laufen über Supabase
const DEMO_ACCOUNTS = {};

export default function BaederApp() {
  const [currentView, setCurrentView] = useState('home');
  const [authView, setAuthView] = useState('login'); // login, register
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem('baeder_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'azubi',
    trainingEnd: ''
  });
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingFlashcards, setPendingFlashcards] = useState([]);

  // Quiz State
  const [activeGames, setActiveGames] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('profi');
  const [currentGame, setCurrentGame] = useState(null);
  const [quizRound, setQuizRound] = useState(0);
  const [quizCategory, setQuizCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  
  const DIFFICULTY_SETTINGS = {
    anfaenger: { time: 45, label: 'Anfänger', icon: '🟢', color: 'bg-green-500' },
    profi: { time: 30, label: 'Profi', icon: '🟡', color: 'bg-yellow-500' },
    experte: { time: 15, label: 'Experte', icon: '🔴', color: 'bg-red-500' }
  };

  // Other State
  const [userStats, setUserStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('org');
  const [newQuestionAnswers, setNewQuestionAnswers] = useState(['', '', '', '']);
  const [newQuestionCorrect, setNewQuestionCorrect] = useState(0);
  const [materials, setMaterials] = useState([]);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialCategory, setMaterialCategory] = useState('org');
  const [resources, setResources] = useState([]);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState('youtube');
  const [resourceDescription, setResourceDescription] = useState('');
  const [news, setNews] = useState([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [exams, setExams] = useState([]);
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTopics, setExamTopics] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dailyWisdom, setDailyWisdom] = useState('');

  // Exam Simulator State
  const [examSimulator, setExamSimulator] = useState(null);
  const [examCurrentQuestion, setExamCurrentQuestion] = useState(null);
  const [examQuestionIndex, setExamQuestionIndex] = useState(0);
  const [examAnswered, setExamAnswered] = useState(false);
  const [userExamProgress, setUserExamProgress] = useState(null);
  
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [devMode, setDevMode] = useState(false);
  const [showDevConsole, setShowDevConsole] = useState(false);
  
  // Flashcards State
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [flashcardProgress, setFlashcardProgress] = useState(null);
  const [userFlashcards, setUserFlashcards] = useState([]);
  const [newFlashcardFront, setNewFlashcardFront] = useState('');
  const [newFlashcardBack, setNewFlashcardBack] = useState('');
  const [newFlashcardCategory, setNewFlashcardCategory] = useState('org');
  
  // Badges State
  const [userBadges, setUserBadges] = useState([]);
  
  // Calculator State
  const [calculatorType, setCalculatorType] = useState('ph');
  const [calculatorInputs, setCalculatorInputs] = useState({});
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // Content moderation
  const BANNED_WORDS = [
    // Explizite Inhalte
    'porn', 'sex', 'xxx', 'nackt', 'nude',
    // Beleidigungen
    'arschloch', 'idiot', 'scheiße', 'fuck', 'shit', 'bastard', 'bitch',
    // Rassismus & Rechtsradikalismus
    'nazi', 'hitler', 'rassist', 'hure', 'schwuchtel', 'neger',
    // Weitere problematische Begriffe
    'hurensohn', 'wichser', 'fotze', 'schlampe'
  ];

  const containsBannedContent = (text) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return BANNED_WORDS.some(word => lowerText.includes(word));
  };

  const moderateContent = (text, context = 'Text') => {
    if (containsBannedContent(text)) {
      alert(`⚠️ ${context} enthält unangemessene Inhalte und wurde blockiert.\n\nBitte achte auf einen respektvollen Umgang.`);
      playSound('wrong');
      return false;
    }
    return true;
  };

  const FLASHCARD_CONTENT = {
    org: [
      { front: 'Was ist das Hausrecht?', back: 'Das Recht des Badbetreibers, die Hausordnung durchzusetzen und Personen des Platzes zu verweisen.' },
      { front: 'Wer ist für die Aufsicht verantwortlich?', back: 'Die Aufsichtsperson während der kompletten Öffnungszeiten.' }
    ],
    tech: [
      { front: 'Optimaler pH-Wert im Schwimmbad?', back: '7,0 - 7,4 (neutral bis leicht basisch)' },
      { front: 'Was macht eine Umwälzpumpe?', back: 'Sie pumpt das Wasser durch die Filteranlage zur Reinigung.' },
      { front: 'Chlor-Richtwert im Becken?', back: '0,3 - 0,6 mg/l freies Chlor' }
    ],
    swim: [
      { front: 'Was ist der Rautek-Griff?', back: 'Rettungsgriff zum Bergen bewusstloser Personen aus Gefahrenbereich.' },
      { front: 'Wie funktioniert die Mund-zu-Mund-Beatmung?', back: 'Kopf überstrecken, Nase zuhalten, 2x beatmen, dann Herzdruckmassage.' }
    ],
    first: [
      { front: 'Verhältnis Herzdruckmassage zu Beatmung?', back: '30:2 - 30 Kompressionen, dann 2 Beatmungen' },
      { front: 'Wo drückt man bei der Herzdruckmassage?', back: 'Unteres Drittel des Brustbeins, 5-6 cm tief' }
    ],
    hygiene: [
      { front: 'Warum Duschpflicht vor dem Schwimmen?', back: 'Entfernung von Schmutz, Schweiß und Kosmetik für bessere Wasserqualität.' },
      { front: 'Was sind Legionellen?', back: 'Bakterien im Wasser, gefährlich bei Inhalation, vermehren sich bei 25-45°C' }
    ],
    pol: [
      { front: 'Was regelt das Arbeitsrecht?', back: 'Beziehung zwischen Arbeitgeber und Arbeitnehmer, Rechte und Pflichten.' },
      { front: 'Was ist die Berufsgenossenschaft?', back: 'Träger der gesetzlichen Unfallversicherung für Arbeitsunfälle.' }
    ]
  };

  const BADGES = [
    { id: 'streak_7', name: '7 Tage Streak', icon: '🔥', description: '7 Tage hintereinander gelernt', requirement: 'streak', value: 7 },
    { id: 'streak_30', name: '30 Tage Streak', icon: '🔥🔥', description: '30 Tage hintereinander gelernt', requirement: 'streak', value: 30 },
    { id: 'questions_50', name: 'Lernmaschine', icon: '💯', description: '50 Fragen richtig beantwortet', requirement: 'questions', value: 50 },
    { id: 'questions_100', name: 'Wissensmeister', icon: '🎓', description: '100 Fragen richtig beantwortet', requirement: 'questions', value: 100 },
    { id: 'quiz_winner_10', name: 'Quiz-Champion', icon: '👑', description: '10 Quizduell-Siege', requirement: 'quiz_wins', value: 10 },
    { id: 'perfectionist', name: 'Perfektionist', icon: '⭐', description: 'Alle Fragen gemeistert', requirement: 'all_mastered', value: 1 },
    { id: 'early_bird', name: 'Frühaufsteher', icon: '🌅', description: 'Vor 7 Uhr morgens gelernt', requirement: 'early', value: 1 },
    { id: 'night_owl', name: 'Nachteule', icon: '🦉', description: 'Nach 22 Uhr gelernt', requirement: 'night', value: 1 }
  ];

  useEffect(() => {
    if (user) {
      loadData();
      loadNotifications();
      const interval = setInterval(() => {
        loadData();
        loadNotifications();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (timerActive && timeLeft > 0 && !answered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answered) {
      handleTimeUp();
    }
  }, [timeLeft, timerActive, answered]);

  // Check for users to delete on load
  useEffect(() => {
    checkDataRetention();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Developer Mode Shortcut: Ctrl+D
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setShowDevConsole(!showDevConsole);
        playSound('splash');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showDevConsole]);

  // Storage Stats Component - using Supabase
  const StorageStats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
      const getStorageStats = async () => {
        try {
          const [usersRes, gamesRes, messagesRes, questionsRes] = await Promise.all([
            supabase.from('users').select('id', { count: 'exact', head: true }),
            supabase.from('games').select('id', { count: 'exact', head: true }),
            supabase.from('messages').select('id', { count: 'exact', head: true }),
            supabase.from('custom_questions').select('id', { count: 'exact', head: true })
          ]);

          setStats({
            accounts: usersRes.count || 0,
            games: gamesRes.count || 0,
            messages: messagesRes.count || 0,
            questions: questionsRes.count || 0
          });
        } catch (error) {
          console.error('Storage stats error:', error);
        }
      };

      getStorageStats();
    }, []);

    if (!stats) {
      return <div className="col-span-4 text-gray-400 text-center">Lädt...</div>;
    }

    return (
      <>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.accounts}</div>
          <div className="text-xs text-gray-400">Accounts</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.games}</div>
          <div className="text-xs text-gray-400">Spiele</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.messages}</div>
          <div className="text-xs text-gray-400">Nachrichten</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.questions}</div>
          <div className="text-xs text-gray-400">Fragen</div>
        </div>
      </>
    );
  };

  const createTestUsers = async () => {
    if (!confirm('5 Test-Accounts erstellen?\n\n- 1 Admin (admin@test.de / admin123)\n- 2 Trainer (trainer1@test.de, trainer2@test.de / test123)\n- 2 Azubis (azubi1@test.de, azubi2@test.de / test123)')) {
      return;
    }

    const testAccounts = [
      { name: 'Admin Test', email: 'admin@test.de', password: 'admin123', role: 'admin' },
      { name: 'Trainer Schmidt', email: 'trainer1@test.de', password: 'test123', role: 'trainer' },
      { name: 'Trainer Müller', email: 'trainer2@test.de', password: 'test123', role: 'trainer' },
      { name: 'Max Mustermann', email: 'azubi1@test.de', password: 'test123', role: 'azubi', trainingEnd: '2026-06-30' },
      { name: 'Lisa Musterfrau', email: 'azubi2@test.de', password: 'test123', role: 'azubi', trainingEnd: '2026-06-30' }
    ];

    try {
      for (const acc of testAccounts) {
        // Insert user into Supabase
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([{
            name: acc.name,
            email: acc.email,
            password: acc.password,
            role: acc.role,
            training_end: acc.trainingEnd || null,
            approved: true
          }])
          .select()
          .single();

        if (userError) {
          console.log(`User ${acc.email} exists or error:`, userError.message);
          continue;
        }

        // Initialize stats
        const initialStats = {
          wins: Math.floor(Math.random() * 10),
          losses: Math.floor(Math.random() * 10),
          draws: Math.floor(Math.random() * 3)
        };

        await supabase
          .from('user_stats')
          .insert([{
            user_id: userData.id,
            wins: initialStats.wins,
            losses: initialStats.losses,
            draws: initialStats.draws,
            category_stats: {},
            opponents: {}
          }]);
      }

      alert('✅ Test-Accounts wurden erstellt!\n\nDu kannst dich jetzt abmelden und mit einem Test-Account anmelden.');
      loadData();
    } catch (error) {
      console.error('Create test users error:', error);
      alert('Fehler beim Erstellen der Test-Accounts!');
    }
  };

  // Sound Effects
  const playSound = (type) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'splash': // Wasser-Platschen
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'whistle': // Pfeife
        oscillator.frequency.value = 2000;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'correct': // Richtige Antwort
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'wrong': // Falsche Antwort
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'bubble': // Blase
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
    }
  };

  const clearAllData = async () => {
    if (!confirm('⚠️ ACHTUNG! Dies löscht ALLE Daten in Supabase unwiderruflich. Fortfahren?')) {
      return;
    }
    if (!confirm('⚠️ BIST DU SICHER? Alle Benutzer, Spiele, Nachrichten werden gelöscht!')) {
      return;
    }

    try {
      // Delete all data from Supabase tables
      await Promise.all([
        supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('games').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('custom_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('materials').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('resources').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('exams').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('user_badges').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('flashcards').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('user_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('news').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      ]);

      // Delete users last (due to foreign keys)
      await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      alert('✅ Alle Daten wurden gelöscht. Bitte neu laden.');
      window.location.reload();
    } catch (error) {
      console.error('Clear data error:', error);
      alert('Fehler beim Löschen der Daten!');
    }
  };

  const changeUserRoleDev = async (email, newRole) => {
    await changeUserRole(email, newRole);
  };

  const calculatePH = (inputs) => {
    const { chlorine, alkalinity, acidCapacity } = inputs;
    if (!chlorine || !alkalinity) return null;
    
    let ph = 7.5 + (parseFloat(chlorine) - 0.5) * 0.2 + (parseFloat(alkalinity) - 120) * 0.01;
    
    // Säurekapazität berücksichtigen
    if (acidCapacity) {
      ph = ph - (parseFloat(acidCapacity) - 2.5) * 0.15;
    }
    
    return {
      result: ph.toFixed(2),
      explanation: `Bei ${chlorine} mg/l Chlor, ${alkalinity} mg/l Alkalinität${acidCapacity ? ` und ${acidCapacity} mmol/l Säurekapazität` : ''} ergibt sich ein pH-Wert von ${ph.toFixed(2)}. Optimal: 7,0-7,4`,
      recommendation: ph < 7.0 ? 'pH-Heber (Na₂CO₃) zugeben' : ph > 7.4 ? 'pH-Senker (NaHSO₄) zugeben' : 'pH-Wert optimal!',
      details: acidCapacity ? `Die Säurekapazität von ${acidCapacity} mmol/l zeigt die Pufferfähigkeit des Wassers an.` : null
    };
  };

  const calculateChlorine = (inputs) => {
    const { poolVolume, currentChlorine, targetChlorine } = inputs;
    if (!poolVolume || currentChlorine === undefined || !targetChlorine) return null;
    
    const difference = parseFloat(targetChlorine) - parseFloat(currentChlorine);
    const needed = (difference * parseFloat(poolVolume)) / 1000;
    
    return {
      result: needed.toFixed(2) + ' kg',
      explanation: `Für ${poolVolume} m³ Wasser von ${currentChlorine} auf ${targetChlorine} mg/l`,
      recommendation: needed > 0 ? `${needed.toFixed(2)} kg Chlor zugeben` : 'Kein Chlor nötig'
    };
  };

  const calculateVolume = (inputs) => {
    const { length, width, depth } = inputs;
    if (!length || !width || !depth) return null;
    
    const volume = parseFloat(length) * parseFloat(width) * parseFloat(depth);
    const liters = volume * 1000;
    
    return {
      result: volume.toFixed(2) + ' m³',
      explanation: `${length}m × ${width}m × ${depth}m = ${volume.toFixed(2)} m³ (${liters.toFixed(0)} Liter)`,
      recommendation: `Bei ${volume.toFixed(0)} m³ beträgt die empfohlene Umwälzrate 4-6 Stunden`
    };
  };

  const handleCalculation = () => {
    let result = null;
    
    switch(calculatorType) {
      case 'ph':
        result = calculatePH(calculatorInputs);
        break;
      case 'chlorine':
        result = calculateChlorine(calculatorInputs);
        break;
      case 'volume':
        result = calculateVolume(calculatorInputs);
        break;
    }
    
    setCalculatorResult(result);
    if (result) playSound('correct');
  };

  const checkDataRetention = async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*');

      if (error || !users) {
        console.log('No users found or Supabase error');
        return;
      }

      const now = Date.now();
      const sixMonthsMs = 6 * 30 * 24 * 60 * 60 * 1000;

      for (const account of users) {
        try {
          // NEVER delete admins - they are permanent
          if (account.role === 'admin') {
            continue;
          }

          // Check Azubi training end
          if (account.role === 'azubi' && account.training_end) {
            const endDate = new Date(account.training_end).getTime();
            if (now > endDate) {
              console.log(`Azubi ${account.name} Ausbildung beendet - Daten werden gelöscht`);
              await deleteUserData(account.id, account.email, account.name);
            }
          }

          // Check Trainer inactivity
          if (account.role === 'trainer' && account.last_login) {
            const lastLoginDate = new Date(account.last_login).getTime();
            if (now - lastLoginDate > sixMonthsMs) {
              console.log(`Ausbilder ${account.name} 6 Monate inaktiv - Daten werden gelöscht`);
              await deleteUserData(account.id, account.email, account.name);
            }
          }
        } catch (e) {
          console.error('Error checking user:', e);
        }
      }
    } catch (error) {
      console.log('Data retention check skipped:', error.message);
    }
  };

  const deleteUserData = async (userId, email, userName) => {
    try {
      // Delete related data first
      await supabase.from('user_stats').delete().eq('user_id', userId);
      await supabase.from('user_badges').delete().eq('user_name', userName);
      await supabase.from('notifications').delete().eq('user_name', userName);

      // Delete user
      await supabase.from('users').delete().eq('id', userId);

      console.log(`Alle Daten für ${email} gelöscht`);
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };

  const exportUserData = async (email, userName) => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        user: userName,
        email: email,
        data: {}
      };

      // Get account data from Supabase
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userData) {
        exportData.data.account = userData;

        // Get stats
        const { data: statsData } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userData.id)
          .single();

        if (statsData) exportData.data.stats = statsData;
      }

      // Get user games
      const { data: gamesData } = await supabase
        .from('games')
        .select('*')
        .or(`player1.eq.${userName},player2.eq.${userName}`);

      exportData.data.games = gamesData || [];

      // Get user exams
      const { data: examsData } = await supabase
        .from('exams')
        .select('*')
        .eq('created_by', userName);

      exportData.data.exams = examsData || [];

      // Get submitted questions
      const { data: questionsData } = await supabase
        .from('custom_questions')
        .select('*')
        .eq('created_by', userName);

      exportData.data.questions = questionsData || [];

      // Get badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_name', userName);

      exportData.data.badges = badgesData || [];

      // Create download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userName}_daten_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Datenexport für ${userName} erfolgreich heruntergeladen!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Fehler beim Datenexport!');
    }
  };

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_name', user.name)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const notifs = (data || []).map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        time: new Date(n.created_at).getTime(),
        read: n.read
      }));
      setNotifications(notifs);
    } catch (error) {
      console.log('Loading notifications...');
    }
  };

  const sendNotification = async (userName, title, message, type = 'info') => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_name: userName,
          title,
          message,
          type,
          read: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Desktop notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '🏊',
          badge: '🔔',
          tag: `notif-${data.id}`
        });
      }

      // Sound notification
      playSound('whistle');
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const markNotificationAsRead = async (notifId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notifId);

      if (error) throw error;

      setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Mark read error:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_name', user.name);

      if (error) throw error;

      setNotifications([]);
    } catch (error) {
      console.error('Clear notifications error:', error);
    }
  };

  const getAdminStats = () => {
    const stats = {
      totalUsers: allUsers.length,
      pendingApprovals: pendingUsers.length,
      azubis: allUsers.filter(u => u.role === 'azubi').length,
      trainers: allUsers.filter(u => u.role === 'trainer').length,
      admins: allUsers.filter(u => u.role === 'admin').length,
      usersToDeleteSoon: allUsers.filter(u => {
        const days = getDaysUntilDeletion(u);
        return days !== null && days < 30 && days >= 0;
      }).length,
      totalGames: 0,
      totalMaterials: materials.length,
      totalQuestions: submittedQuestions.length,
      approvedQuestions: submittedQuestions.filter(q => q.approved).length,
      pendingQuestions: submittedQuestions.filter(q => !q.approved).length,
      activeGamesCount: activeGames.length,
      totalMessages: messages.length
    };

    // Count total games from storage
    activeGames.forEach(() => stats.totalGames++);

    return stats;
  };

  const handleRegister = async () => {
    if (!registerData.name || !registerData.email || !registerData.password) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }

    try {
      // Check if email exists in Supabase
      const { data: existing } = await supabase
        .from('users')
        .select('email')
        .eq('email', registerData.email)
        .single();

      if (existing) {
        alert('Diese E-Mail ist bereits registriert!');
        return;
      }
    } catch (e) {
      // Email doesn't exist, continue (PGRST116 = not found)
      if (e.code !== 'PGRST116') {
        console.log('Email check error:', e);
      }
    }

    try {
      // Insert new user into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          role: registerData.role,
          training_end: registerData.trainingEnd || null,
          approved: false
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('User created:', data);

      alert('✅ Registrierung erfolgreich!\n\n⏳ Dein Account muss von einem Administrator freigeschaltet werden.\n\nDu erhältst eine Benachrichtigung, sobald dein Account aktiviert wurde.');

      setAuthView('login');
      setRegisterData({ name: '', email: '', password: '', role: 'azubi', trainingEnd: '' });
    } catch (error) {
      alert('Fehler bei der Registrierung: ' + error.message);
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert('Bitte E-Mail und Passwort eingeben!');
      return;
    }

    try {
      // ZUERST: Prüfe Demo-Accounts (funktionieren IMMER!)
      if (DEMO_ACCOUNTS[loginEmail]) {
        const account = DEMO_ACCOUNTS[loginEmail];

        if (account.password !== loginPassword) {
          alert('Falsches Passwort!');
          return;
        }

        // Create user session
        const userSession = {
          name: account.name,
          email: account.email,
          role: account.role,
          permissions: PERMISSIONS[account.role]
        };

        setUser(userSession);
        localStorage.setItem('baeder_user', JSON.stringify(userSession));
        setDailyWisdom(DAILY_WISDOM[Math.floor(Math.random() * DAILY_WISDOM.length)]);
        setLoginEmail('');
        setLoginPassword('');
        playSound('whistle');
        return;
      }

      // DANACH: Versuche Supabase (E-Mail ODER Name)
      let account = null;
      const loginInput = loginEmail.trim();

      // Erst nach E-Mail suchen (case-insensitive)
      const { data: byEmail } = await supabase
        .from('users')
        .select('*')
        .ilike('email', loginInput)
        .single();

      if (byEmail) {
        account = byEmail;
      } else {
        // Falls nicht gefunden, nach Name suchen (case-insensitive)
        const { data: byName } = await supabase
          .from('users')
          .select('*')
          .ilike('name', loginInput)
          .single();

        if (byName) {
          account = byName;
        }
      }

      if (!account) {
        alert('Kein Account gefunden!\n\nBitte registriere dich zuerst.');
        return;
      }

      if (account.password !== loginPassword) {
        alert('Falsches Passwort!');
        return;
      }

      if (!account.approved) {
        alert('Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Administrator.');
        return;
      }

      // Update last login in Supabase
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('email', loginEmail);

      // Create user session
      const userSession = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        permissions: PERMISSIONS[account.role]
      };

      setUser(userSession);
      localStorage.setItem('baeder_user', JSON.stringify(userSession));
      setDailyWisdom(DAILY_WISDOM[Math.floor(Math.random() * DAILY_WISDOM.length)]);

      // Initialize stats in Supabase if not exists
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', account.id)
        .single();

      if (!existingStats) {
        await supabase
          .from('user_stats')
          .insert([{
            user_id: account.id,
            wins: 0,
            losses: 0,
            draws: 0,
            category_stats: {},
            opponents: {}
          }]);
      }

      setLoginEmail('');
      setLoginPassword('');

      playSound('whistle');
    } catch (error) {
      alert('Fehler beim Login: ' + error.message);
      console.error('Login error:', error);
    }
  };

  const loadData = async () => {
    try {
      // Load users from Supabase
      if (user && user.permissions.canManageUsers) {
        // Admin sees all users
        const { data: allUsersData } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (allUsersData) {
          const approved = allUsersData.filter(u => u.approved);
          const pending = allUsersData.filter(u => !u.approved);
          setAllUsers(approved);
          setPendingUsers(pending);
        }
      } else {
        // Normal users see only approved users
        const { data: approvedUsers } = await supabase
          .from('users')
          .select('*')
          .eq('approved', true);

        if (approvedUsers) {
          setAllUsers(approvedUsers);
        }
      }

      // Load games from Supabase
      const { data: gamesData } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (gamesData) {
        const games = gamesData.map(g => ({
          id: g.id,
          player1: g.player1,
          player2: g.player2,
          player1Score: g.player1_score,
          player2Score: g.player2_score,
          currentTurn: g.current_turn,
          round: g.round,
          status: g.status,
          difficulty: g.difficulty,
          rounds: g.rounds_data || []
        }));
        setActiveGames(games.filter(g => g.status !== 'finished'));
        updateLeaderboard(games, allUsers);
      }

      // Load user stats from Supabase
      if (user && user.id) {
        try {
          const { data: statsData } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (statsData) {
            setUserStats({
              wins: statsData.wins || 0,
              losses: statsData.losses || 0,
              draws: statsData.draws || 0,
              categoryStats: statsData.category_stats || {},
              opponents: statsData.opponents || {}
            });
          } else {
            setUserStats({
              wins: 0,
              losses: 0,
              draws: 0,
              categoryStats: {},
              opponents: {}
            });
          }
        } catch (e) {
          console.log('Stats load:', e);
          setUserStats({
            wins: 0,
            losses: 0,
            draws: 0,
            categoryStats: {},
            opponents: {}
          });
        }
      }

      // Load messages from Supabase
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (messagesData) {
        const msgs = messagesData.map(m => ({
          id: m.id,
          user: m.user_name,
          text: m.content,
          time: new Date(m.created_at).getTime(),
          isTrainer: false // Will be updated when we have role info
        }));
        setMessages(msgs);
      }

      // Load custom questions from Supabase
      const { data: questionsData } = await supabase
        .from('custom_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (questionsData) {
        const qs = questionsData.map(q => ({
          id: q.id,
          text: q.question,
          category: q.category,
          answers: q.answers,
          correct: q.correct,
          submittedBy: q.created_by,
          approved: q.approved,
          time: new Date(q.created_at).getTime()
        }));
        setSubmittedQuestions(qs);
      }

      // Load materials from Supabase
      const { data: materialsData } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (materialsData) {
        const mats = materialsData.map(m => ({
          id: m.id,
          title: m.title,
          content: m.content,
          category: m.category,
          type: m.type,
          url: m.url,
          createdBy: m.created_by,
          time: new Date(m.created_at).getTime()
        }));
        setMaterials(mats);
      }

      // Load resources from Supabase
      const { data: resourcesData } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (resourcesData) {
        const ress = resourcesData.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          url: r.url,
          category: r.category,
          createdBy: r.created_by,
          time: new Date(r.created_at).getTime()
        }));
        setResources(ress);
      }

      // Load news from Supabase
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (newsData) {
        const newsItems = newsData.map(n => ({
          id: n.id,
          title: n.title,
          content: n.content,
          author: n.author,
          time: new Date(n.created_at).getTime()
        }));
        setNews(newsItems);
      }

      // Load exams from Supabase
      const { data: examsData } = await supabase
        .from('exams')
        .select('*')
        .order('exam_date', { ascending: true });

      if (examsData) {
        const exs = examsData.map(e => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.exam_date,
          location: e.location,
          createdBy: e.created_by,
          time: new Date(e.created_at).getTime()
        }));
        setExams(exs);
      }

      // Load flashcards from Supabase
      const { data: flashcardsData } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });

      if (flashcardsData) {
        const fcs = [];
        const pendingFcs = [];
        flashcardsData.forEach(fc => {
          const card = {
            id: fc.id,
            category: fc.category,
            front: fc.question,
            back: fc.answer,
            approved: fc.approved,
            userId: fc.user_id
          };
          if (fc.approved) {
            fcs.push(card);
          } else {
            pendingFcs.push(card);
          }
        });
        setUserFlashcards(fcs);
        setPendingFlashcards(pendingFcs);
      }

      // Load user badges from Supabase
      if (user?.name) {
        const { data: badgesData } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_name', user.name);

        if (badgesData) {
          const badges = badgesData.map(b => ({
            id: b.badge_id,
            earnedAt: new Date(b.earned_at).getTime()
          }));
          setUserBadges(badges);
        }
      }
    } catch (error) {
      console.log('Loading data - some features may not work:', error.message);
    }
  };

  const updateLeaderboard = (games, users) => {
    const stats = {};
    
    games.filter(g => g.status === 'finished').forEach(game => {
      [game.player1, game.player2].forEach(player => {
        if (!stats[player]) {
          stats[player] = { name: player, wins: 0, losses: 0, draws: 0, points: 0 };
        }
      });

      if (game.winner === game.player1) {
        stats[game.player1].wins++;
        stats[game.player2].losses++;
        stats[game.player1].points += 3;
      } else if (game.winner === game.player2) {
        stats[game.player2].wins++;
        stats[game.player1].losses++;
        stats[game.player2].points += 3;
      } else {
        stats[game.player1].draws++;
        stats[game.player2].draws++;
        stats[game.player1].points += 1;
        stats[game.player2].points += 1;
      }
    });

    const ranking = Object.values(stats).sort((a, b) => b.points - a.points);
    setLeaderboard(ranking);
  };

  const approveUser = async (email) => {
    try {
      // Update user in Supabase
      const { data: account, error } = await supabase
        .from('users')
        .update({ approved: true })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;

      // Initialize stats in Supabase
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', account.id)
        .single();

      if (!existingStats) {
        await supabase
          .from('user_stats')
          .insert([{
            user_id: account.id,
            wins: 0,
            losses: 0,
            draws: 0,
            category_stats: {},
            opponents: {}
          }]);
      }

      loadData();
      playSound('whistle');
      alert(`✅ ${account.name} wurde freigeschaltet!`);
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Fehler beim Freischalten: ' + error.message);
    }
  };

  const deleteUser = async (email) => {
    try {
      // Get user from Supabase
      const { data: account, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError || !account) {
        alert('User nicht gefunden');
        return;
      }

      // NEVER allow deletion of admin accounts
      if (account.role === 'admin') {
        alert('❌ Administratoren können nicht gelöscht werden!\n\nAdmin-Accounts sind permanent und können nur ihre Rolle ändern.');
        return;
      }

      if (!confirm('Möchtest du diesen Nutzer wirklich löschen? Alle Daten werden unwiderruflich gelöscht!')) {
        return;
      }

      // Delete user from Supabase (cascades to user_stats due to foreign key)
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', email);

      if (deleteError) throw deleteError;

      loadData();
      alert('Nutzer und alle Daten wurden gelöscht.');
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Fehler beim Löschen: ' + error.message);
    }
  };

  const changeUserRole = async (email, newRole) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('email', email);

      if (error) throw error;

      loadData();
      alert(`Rolle geändert zu: ${PERMISSIONS[newRole].label}`);
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  const getDaysUntilDeletion = (account) => {
    // Admins are NEVER deleted
    if (account.role === 'admin') {
      return null;
    }
    
    const now = Date.now();
    
    if (account.role === 'azubi' && account.trainingEnd) {
      const endDate = new Date(account.trainingEnd).getTime();
      const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysLeft;
    }
    
    if (account.role === 'trainer' && account.lastLogin) {
      const sixMonthsMs = 6 * 30 * 24 * 60 * 60 * 1000;
      const deleteDate = account.lastLogin + sixMonthsMs;
      const daysLeft = Math.ceil((deleteDate - now) / (1000 * 60 * 60 * 24));
      return daysLeft;
    }
    
    return null;
  };

  // Quiz functions with Supabase
  const challengePlayer = async (opponent) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([{
          player1: user.name,
          player2: opponent,
          difficulty: selectedDifficulty,
          status: 'waiting',
          round: 0,
          player1_score: 0,
          player2_score: 0,
          current_turn: user.name,
          rounds_data: []
        }])
        .select()
        .single();

      if (error) throw error;

      const game = {
        id: data.id,
        player1: data.player1,
        player2: data.player2,
        difficulty: data.difficulty,
        status: data.status,
        round: data.round,
        player1Score: data.player1_score,
        player2Score: data.player2_score,
        currentTurn: data.current_turn,
        rounds: data.rounds_data || []
      };

      setActiveGames([...activeGames, game]);
      setSelectedOpponent(null);
      alert(`Herausforderung an ${opponent} gesendet! 🎯`);
    } catch (error) {
      console.error('Challenge error:', error);
    }
  };

  const acceptChallenge = async (gameId) => {
    const game = activeGames.find(g => g.id === gameId);
    if (!game) return;

    try {
      const { error } = await supabase
        .from('games')
        .update({ status: 'active' })
        .eq('id', gameId);

      if (error) throw error;

      game.status = 'active';
      setCurrentGame(game);
      setQuizRound(0);
      setPlayerTurn(game.currentTurn);
      setCurrentView('quiz');
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  const continueGame = async (gameId) => {
    const game = activeGames.find(g => g.id === gameId);
    if (!game) return;

    setCurrentGame(game);
    setQuizRound(game.round);
    setPlayerTurn(game.currentTurn);
    setCurrentView('quiz');
  };

  // Helper function to save game state to Supabase
  const saveGameToSupabase = async (game) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
          player1_score: game.player1Score,
          player2_score: game.player2Score,
          current_turn: game.currentTurn,
          round: game.round,
          status: game.status,
          rounds_data: game.rounds || game.questionHistory || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', game.id);

      if (error) throw error;
    } catch (error) {
      console.error('Save game error:', error);
    }
  };

  // Helper function to save user stats to Supabase
  const saveUserStatsToSupabase = async (userName, stats) => {
    try {
      // First get user id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .ilike('name', userName)
        .single();

      if (userError) throw userError;

      // Check if stats exist
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('id')
        .eq('user_id', userData.id)
        .single();

      if (existingStats) {
        // Update existing stats
        const { error } = await supabase
          .from('user_stats')
          .update({
            wins: stats.wins,
            losses: stats.losses,
            draws: stats.draws,
            category_stats: stats.categoryStats || {},
            opponents: stats.opponents || {}
          })
          .eq('user_id', userData.id);
        if (error) throw error;
      } else {
        // Create new stats
        const { error } = await supabase
          .from('user_stats')
          .insert([{
            user_id: userData.id,
            wins: stats.wins,
            losses: stats.losses,
            draws: stats.draws,
            category_stats: stats.categoryStats || {},
            opponents: stats.opponents || {}
          }]);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Save stats error:', error);
    }
  };

  // Helper function to get user stats from Supabase
  const getUserStatsFromSupabase = async (userName) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .ilike('name', userName)
        .single();

      if (userError) return null;

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (error) return null;

      return {
        wins: data.wins || 0,
        losses: data.losses || 0,
        draws: data.draws || 0,
        categoryStats: data.category_stats || {},
        opponents: data.opponents || {}
      };
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
  };

  const selectCategory = async (catId) => {
    if (!currentGame || currentGame.currentTurn !== user.name) return;

    setQuizCategory(catId);
    const questions = SAMPLE_QUESTIONS[catId];
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQ);
    setAnswered(false);
    
    const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty].time;
    setTimeLeft(timeLimit);
    setTimerActive(true);

    if (!currentGame.categoryHistory) currentGame.categoryHistory = [];
    currentGame.categoryHistory.push(catId);
    await saveGameToSupabase(currentGame);
  };

  const handleTimeUp = async () => {
    if (answered || !currentGame) return;
    setAnswered(true);
    setTimerActive(false);
    
    const isPlayer1 = user.name === currentGame.player1;
    if (isPlayer1) {
      currentGame.player2Score++;
    } else {
      currentGame.player1Score++;
    }

    const stats = userStats || {
      wins: 0,
      losses: 0,
      draws: 0,
      categoryStats: {},
      opponents: {}
    };

    if (!stats.categoryStats[quizCategory]) {
      stats.categoryStats[quizCategory] = { correct: 0, incorrect: 0, total: 0 };
    }

    stats.categoryStats[quizCategory].incorrect++;
    stats.categoryStats[quizCategory].total++;

    currentGame.questionHistory.push({
      round: quizRound,
      player: user.name,
      category: quizCategory,
      correct: false,
      timeout: true
    });

    await saveUserStatsToSupabase(user.name, stats);
    setUserStats(stats);

    setTimeout(async () => {
      if (currentGame.round < 5) {
        currentGame.currentTurn = currentGame.currentTurn === currentGame.player1
          ? currentGame.player2
          : currentGame.player1;
        currentGame.round++;

        await saveGameToSupabase(currentGame);

        setQuizRound(currentGame.round);
        setQuizCategory(null);
        setCurrentQuestion(null);
        setPlayerTurn(currentGame.currentTurn);
      } else {
        await finishGame();
      }
    }, 2000);
  };

  const answerQuestion = async (answerIndex) => {
    if (answered || !currentGame) return;
    setAnswered(true);
    setTimerActive(false);
    
    const isCorrect = answerIndex === currentQuestion.correct;
    const isPlayer1 = user.name === currentGame.player1;

    if (isCorrect) {
      if (isPlayer1) {
        currentGame.player1Score++;
      } else {
        currentGame.player2Score++;
      }
    } else {
      if (isPlayer1) {
        currentGame.player2Score++;
      } else {
        currentGame.player1Score++;
      }
    }

    const stats = userStats || {
      wins: 0,
      losses: 0,
      draws: 0,
      categoryStats: {},
      opponents: {}
    };

    if (!stats.categoryStats[quizCategory]) {
      stats.categoryStats[quizCategory] = { correct: 0, incorrect: 0, total: 0 };
    }

    if (isCorrect) {
      stats.categoryStats[quizCategory].correct++;
    } else {
      stats.categoryStats[quizCategory].incorrect++;
    }
    stats.categoryStats[quizCategory].total++;

    currentGame.questionHistory.push({
      round: quizRound,
      player: user.name,
      category: quizCategory,
      correct: isCorrect
    });

    await saveUserStatsToSupabase(user.name, stats);
    setUserStats(stats);

    setTimeout(async () => {
      if (currentGame.round < 5) {
        currentGame.currentTurn = currentGame.currentTurn === currentGame.player1
          ? currentGame.player2
          : currentGame.player1;
        currentGame.round++;

        await saveGameToSupabase(currentGame);

        // Send notification to next player
        const nextPlayer = currentGame.currentTurn;
        await sendNotification(
          nextPlayer,
          '⚡ Du bist dran!',
          `${user.name} hat gespielt. Jetzt bist du im Quizduell an der Reihe!`,
          'info'
        );

        setQuizRound(currentGame.round);
        setQuizCategory(null);
        setCurrentQuestion(null);
        setPlayerTurn(currentGame.currentTurn);
      } else {
        await finishGame();
      }
    }, 2000);
  };

  const finishGame = async () => {
    currentGame.status = 'finished';

    let winner = null;
    if (currentGame.player1Score > currentGame.player2Score) {
      winner = currentGame.player1;
    } else if (currentGame.player2Score > currentGame.player1Score) {
      winner = currentGame.player2;
    }
    currentGame.winner = winner;

    try {
      await saveGameToSupabase(currentGame);

      for (const playerName of [currentGame.player1, currentGame.player2]) {
        try {
          // Get existing stats from Supabase
          const existingStats = await getUserStatsFromSupabase(playerName);
          const stats = existingStats || {
            wins: 0,
            losses: 0,
            draws: 0,
            categoryStats: {},
            opponents: {}
          };

          const opponent = playerName === currentGame.player1 ? currentGame.player2 : currentGame.player1;

          if (!stats.opponents[opponent]) {
            stats.opponents[opponent] = { wins: 0, losses: 0, draws: 0 };
          }

          if (winner === playerName) {
            stats.wins++;
            stats.opponents[opponent].wins++;
          } else if (winner === null) {
            stats.draws++;
            stats.opponents[opponent].draws++;
          } else {
            stats.losses++;
            stats.opponents[opponent].losses++;
          }

          await saveUserStatsToSupabase(playerName, stats);

          if (playerName === user.name) {
            setUserStats(stats);
          }
        } catch (error) {
          console.error('Stats update error:', error);
        }
      }

      setCurrentView('stats');
      checkBadges();
    } catch (error) {
      console.error('Finish error:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    // Content moderation
    if (!moderateContent(newMessage, 'Nachricht')) {
      setNewMessage('');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          user_name: user.name,
          content: newMessage.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      // Add to local state with compatible format
      const msg = {
        id: data.id,
        user: data.user_name,
        text: data.content,
        time: new Date(data.created_at).getTime(),
        isTrainer: user.role === 'trainer' || user.role === 'admin'
      };

      setMessages([...messages, msg]);
      setNewMessage('');
    } catch (error) {
      console.error('Message error:', error);
    }
  };

  const submitQuestion = async () => {
    if (!newQuestionText.trim() || !user) return;

    // Content moderation
    if (!moderateContent(newQuestionText, 'Frage')) {
      return;
    }
    
    for (let i = 0; i < newQuestionAnswers.length; i++) {
      if (newQuestionAnswers[i] && !moderateContent(newQuestionAnswers[i], `Antwort ${i + 1}`)) {
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('custom_questions')
        .insert([{
          category: newQuestionCategory,
          question: newQuestionText,
          answers: newQuestionAnswers,
          correct: newQuestionCorrect,
          created_by: user.name,
          approved: false
        }])
        .select()
        .single();

      if (error) throw error;

      const q = {
        id: data.id,
        text: data.question,
        category: data.category,
        answers: data.answers,
        correct: data.correct,
        submittedBy: data.created_by,
        approved: data.approved,
        time: new Date(data.created_at).getTime()
      };

      setSubmittedQuestions([...submittedQuestions, q]);
      setNewQuestionText('');
      setNewQuestionAnswers(['', '', '', '']);
      alert('Frage eingereicht! 🎯');
    } catch (error) {
      console.error('Question error:', error);
    }
  };

  const approveQuestion = async (qId) => {
    try {
      const { error } = await supabase
        .from('custom_questions')
        .update({ approved: true })
        .eq('id', qId);

      if (error) throw error;

      setSubmittedQuestions(submittedQuestions.map(sq => sq.id === qId ? { ...sq, approved: true } : sq));
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  
  // Exam Simulator Functions
  const loadExamProgress = () => {
    const allQuestions = [];
    Object.entries(SAMPLE_QUESTIONS).forEach(([catId, questions]) => {
      questions.forEach(q => { allQuestions.push({ ...q, category: catId }); });
    });
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const examQuestions = shuffled.slice(0, Math.min(30, shuffled.length));
    setExamSimulator({ questions: examQuestions, answers: [], startTime: Date.now() });
    setExamQuestionIndex(0);
    setExamCurrentQuestion(examQuestions[0]);
    setExamAnswered(false);
    setUserExamProgress(null);
  };

  const answerExamQuestion = (answerIndex) => {
    if (examAnswered || !examSimulator) return;
    setExamAnswered(true);
    const isCorrect = answerIndex === examCurrentQuestion.correct;
    if (isCorrect) { playSound('correct'); } else { playSound('wrong'); }
    const newAnswers = [...examSimulator.answers, { question: examCurrentQuestion, selectedAnswer: answerIndex, correct: isCorrect }];
    setExamSimulator({ ...examSimulator, answers: newAnswers });
    setTimeout(() => {
      if (examQuestionIndex < examSimulator.questions.length - 1) {
        const nextIdx = examQuestionIndex + 1;
        setExamQuestionIndex(nextIdx);
        setExamCurrentQuestion(examSimulator.questions[nextIdx]);
        setExamAnswered(false);
      } else {
        const correctAnswers = newAnswers.filter(a => a.correct).length;
        const percentage = Math.round((correctAnswers / newAnswers.length) * 100);
        setUserExamProgress({ correct: correctAnswers, total: newAnswers.length, percentage, passed: percentage >= 50, timeMs: Date.now() - examSimulator.startTime });
        if (percentage >= 50) playSound('whistle');
      }
    }, 1500);
  };

  const resetExam = () => { setExamSimulator(null); setExamCurrentQuestion(null); setExamQuestionIndex(0); setExamAnswered(false); setUserExamProgress(null); };

  const loadFlashcards = () => {
    const hardcodedCards = FLASHCARD_CONTENT[newQuestionCategory] || [];
    const userCards = userFlashcards.filter(fc => fc.category === newQuestionCategory);
    const allCards = [...hardcodedCards, ...userCards];
    setFlashcards(allCards); setFlashcardIndex(0); setCurrentFlashcard(allCards[0] || null); setShowFlashcardAnswer(false);
  };

  const approveFlashcard = async (fcId) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({ approved: true })
        .eq('id', fcId);

      if (error) throw error;

      const fc = pendingFlashcards.find(f => f.id === fcId);
      if (fc) {
        fc.approved = true;
        setPendingFlashcards(pendingFlashcards.filter(f => f.id !== fcId));
        setUserFlashcards([...userFlashcards, fc]);
      }
      playSound('correct');
    } catch (error) {
      console.error('Approve flashcard error:', error);
    }
  };

  const deleteFlashcard = async (fcId) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', fcId);

      if (error) throw error;

      setPendingFlashcards(pendingFlashcards.filter(f => f.id !== fcId));
      setUserFlashcards(userFlashcards.filter(f => f.id !== fcId));
    } catch (error) {
      console.error('Delete flashcard error:', error);
    }
  };

  const checkBadges = async () => {
    if (!user || !userStats) return;
    const earnedBadges = [...userBadges];
    const newBadges = [];

    if (userStats.wins >= 10 && !earnedBadges.find(b => b.id === 'quiz_winner_10')) {
      const badge = { id: 'quiz_winner_10', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }
    const totalCorrect = Object.values(userStats.categoryStats || {}).reduce((sum, cat) => sum + (cat.correct || 0), 0);
    if (totalCorrect >= 50 && !earnedBadges.find(b => b.id === 'questions_50')) {
      const badge = { id: 'questions_50', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }
    if (totalCorrect >= 100 && !earnedBadges.find(b => b.id === 'questions_100')) {
      const badge = { id: 'questions_100', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }
    const hour = new Date().getHours();
    if (hour < 7 && !earnedBadges.find(b => b.id === 'early_bird')) {
      const badge = { id: 'early_bird', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }
    if (hour >= 22 && !earnedBadges.find(b => b.id === 'night_owl')) {
      const badge = { id: 'night_owl', earnedAt: Date.now() };
      earnedBadges.push(badge);
      newBadges.push(badge);
    }

    if (newBadges.length > 0) {
      setUserBadges(earnedBadges);
      try {
        for (const badge of newBadges) {
          await supabase
            .from('user_badges')
            .insert([{
              user_name: user.name,
              badge_id: badge.id
            }]);
        }
      } catch (error) {
        console.error('Save badges error:', error);
      }
    }
  };


  const addMaterial = async () => {
    if (!materialTitle.trim() || !user?.permissions.canUploadMaterials) return;

    try {
      const { data, error } = await supabase
        .from('materials')
        .insert([{
          title: materialTitle,
          category: materialCategory,
          created_by: user.name
        }])
        .select()
        .single();

      if (error) throw error;

      const mat = {
        id: data.id,
        title: data.title,
        category: data.category,
        createdBy: data.created_by,
        time: new Date(data.created_at).getTime()
      };

      setMaterials([...materials, mat]);
      setMaterialTitle('');
      alert('Material hinzugefügt! 📚');
    } catch (error) {
      console.error('Material error:', error);
    }
  };

  const addResource = async () => {
    if (!resourceTitle.trim() || !resourceUrl.trim()) return;
    
    // Only admins can add resources
    if (user.role !== 'admin') {
      alert('⚠️ Nur Administratoren können Ressourcen hinzufügen.\n\nDies dient der Sicherheit und Qualität der geteilten Inhalte.');
      return;
    }

    // Content moderation
    if (!moderateContent(resourceTitle, 'Titel')) {
      return;
    }
    
    if (resourceDescription && !moderateContent(resourceDescription, 'Beschreibung')) {
      return;
    }
    
    if (!moderateContent(resourceUrl, 'URL')) {
      return;
    }

    // URL validation
    try {
      new URL(resourceUrl);
    } catch (e) {
      alert('⚠️ Bitte gib eine gültige URL ein (mit https://)');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([{
          title: resourceTitle,
          url: resourceUrl,
          category: resourceType,
          description: resourceDescription,
          created_by: user.name
        }])
        .select()
        .single();

      if (error) throw error;

      const resource = {
        id: data.id,
        title: data.title,
        url: data.url,
        category: data.category,
        description: data.description,
        createdBy: data.created_by,
        time: new Date(data.created_at).getTime()
      };

      setResources([resource, ...resources]);
      setResourceTitle('');
      setResourceUrl('');
      setResourceDescription('');
      playSound('splash');
      alert('Ressource hinzugefügt! 🔗');
    } catch (error) {
      console.error('Resource error:', error);
    }
  };

  const deleteResource = async (resourceId) => {
    // Only admins can delete resources
    if (user.role !== 'admin') {
      alert('⚠️ Nur Administratoren können Ressourcen löschen.');
      return;
    }

    if (!confirm('Ressource wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      setResources(resources.filter(r => r.id !== resourceId));
    } catch (error) {
      console.error('Delete resource error:', error);
    }
  };

  const addNews = async () => {
    if (!newsTitle.trim() || !user?.permissions.canPostNews) return;

    // Content moderation
    if (!moderateContent(newsTitle, 'News-Titel')) {
      return;
    }

    if (newsContent && !moderateContent(newsContent, 'News-Inhalt')) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('news')
        .insert([{
          title: newsTitle.trim(),
          content: newsContent.trim(),
          author: user.name
        }])
        .select()
        .single();

      if (error) throw error;

      const newsItem = {
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.author,
        time: new Date(data.created_at).getTime()
      };

      setNews([newsItem, ...news]);
      setNewsTitle('');
      setNewsContent('');
    } catch (error) {
      console.error('News error:', error);
    }
  };

  const addExam = async () => {
    if (!examTitle.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([{
          title: examTitle,
          description: examTopics,
          exam_date: examDate || null,
          created_by: user.name
        }])
        .select()
        .single();

      if (error) throw error;

      const exam = {
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.exam_date,
        createdBy: data.created_by,
        time: new Date(data.created_at).getTime()
      };

      setExams([...exams, exam].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setExamTitle('');
      setExamDate('');
      setExamTopics('');
    } catch (error) {
      console.error('Exam error:', error);
    }
  };

  // Login/Register Screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)',
        animation: 'waterFlow 20s ease-in-out infinite'
      }}>
        {/* Water Wave Animation */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.1) 20px,
            rgba(255, 255, 255, 0.1) 40px
          )`,
          animation: 'waves 8s linear infinite'
        }}></div>
        
        {/* Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                left: `${Math.random() * 100}%`,
                bottom: '-50px',
                animation: `bubble ${Math.random() * 10 + 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>

        <style>{`
          @keyframes waterFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes waves {
            0% { transform: translateY(0); }
            100% { transform: translateY(-40px); }
          }
          @keyframes bubble {
            0% { transform: translateY(0) scale(1); opacity: 0.2; }
            50% { opacity: 0.3; }
            100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
          }
        `}</style>

        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏊‍♂️</div>
            <h1 className="text-3xl font-bold text-cyan-700 mb-2">Bäder-Azubi App</h1>
            <p className="text-cyan-600">Professionelle Lern-Plattform</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAuthView('login')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                authView === 'login'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthView('register')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                authView === 'register'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Registrieren
            </button>
          </div>
          
          {authView === 'login' ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="E-Mail oder Name"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Passwort"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                <Lock className="inline mr-2" size={20} />
                Anmelden
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Vollständiger Name"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="E-Mail"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Passwort"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <select
                value={registerData.role}
                onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="azubi">Azubi</option>
                <option value="trainer">Ausbilder</option>
                <option value="admin">Administrator</option>
              </select>
              {registerData.role === 'azubi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voraussichtliches Ausbildungsende:
                  </label>
                  <input
                    type="date"
                    value={registerData.trainingEnd}
                    onChange={(e) => setRegisterData({...registerData, trainingEnd: e.target.value})}
                    className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <AlertTriangle className="inline" size={12} /> Deine Daten werden nach Ausbildungsende automatisch gelöscht.
                  </p>
                </div>
              )}
              
              <button
                onClick={handleRegister}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                <Shield className="inline mr-2" size={20} />
                Registrierung beantragen
              </button>
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-sm text-cyan-800">
                <Shield className="inline mr-2" size={16} />
                Nach der Registrierung muss dein Account von einem Administrator freigeschaltet werden.
              </div>
            </div>
          )}

                        <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-600 text-center">
              <a
                href="https://smartbaden.de/baeder-azubi-app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                <Shield className="inline mr-2" size={14} />
                Datenschutzerklärung
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'dark-mode' : ''}`} style={{
      background: darkMode 
        ? 'linear-gradient(135deg, #0c4a6e 0%, #075985 25%, #0e7490 50%, #164e63 75%, #0f172a 100%)'
        : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
    }}>
      {/* Animated Swimmer */}
      <div className="absolute top-20 left-0 w-full h-32 overflow-hidden pointer-events-none z-0">
        <div className="swimmer animate-swim">
          <span className="text-6xl">🏊‍♂️</span>
        </div>
      </div>

      {/* Water Wave Animation Background */}
      <div className={`absolute inset-0 ${darkMode ? 'opacity-5' : 'opacity-10'}`} style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 30px,
          rgba(255, 255, 255, 0.1) 30px,
          rgba(255, 255, 255, 0.1) 60px
        )`,
        animation: 'waves 12s linear infinite'
      }}></div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white cursor-pointer"
            onClick={() => playSound('bubble')}
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-100px',
              opacity: darkMode ? 0.05 : 0.1,
              animation: `bubble ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              pointerEvents: 'auto'
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes waves {
          0% { transform: translateY(0); }
          100% { transform: translateY(-60px); }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: ${darkMode ? 0.05 : 0.1}; }
          50% { opacity: ${darkMode ? 0.08 : 0.15}; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes swim {
          0% { transform: translateX(-100px) translateY(0); }
          25% { transform: translateX(25vw) translateY(-20px); }
          50% { transform: translateX(50vw) translateY(0); }
          75% { transform: translateX(75vw) translateY(20px); }
          100% { transform: translateX(calc(100vw + 100px)) translateY(0); }
        }
        .swimmer {
          position: absolute;
          animation: swim 20s linear infinite;
        }
        .animate-swim {
          animation: swim 20s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800' : 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600'} text-white p-4 shadow-lg relative z-10`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🏊‍♂️</div>
            <div>
              <h1 className="text-2xl font-bold drop-shadow-lg">Bäder-Azubi App</h1>
              <p className="text-sm opacity-90">
                {user.name} • {PERMISSIONS[user.role].label}
                {user.role === 'admin' && ' 👑'}
                {user.role === 'trainer' && ' 👨‍🏫'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Dev Mode Toggle */}
            {user && user.role === 'admin' && (
              <button
                onClick={() => {
                  setShowDevConsole(!showDevConsole);
                  playSound('splash');
                }}
                className={`${showDevConsole ? 'bg-cyan-500' : 'bg-white/20'} hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm`}
                title="Developer Console (Strg+D)"
              >
                🛠️
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                playSound('splash');
              }}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
              title={darkMode ? 'Tag-Modus' : 'Nacht-Modus'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSound('splash');
              }}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
              title={soundEnabled ? 'Sound aus' : 'Sound an'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* Request Notification Permission */}
            {'Notification' in window && Notification.permission === 'default' && (
              <button
                onClick={() => {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      new Notification('🏊 Benachrichtigungen aktiviert!', {
                        body: 'Du wirst jetzt über News und Spielzüge informiert.',
                        icon: '🏊'
                      });
                    }
                  });
                }}
                className="bg-yellow-500/80 hover:bg-yellow-600/80 px-3 py-2 rounded-lg transition-colors backdrop-blur-sm font-bold text-sm flex items-center gap-2 animate-pulse"
                title="Benachrichtigungen erlauben"
              >
                🔔 Erlauben
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  playSound('splash');
                }}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors relative backdrop-blur-sm"
              >
                <Bell size={24} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-96 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto`}>
                  <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-cyan-50'}`}>
                    <h3 className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>💧 Benachrichtigungen</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className={`text-sm ${darkMode ? 'text-cyan-300 hover:text-cyan-100' : 'text-cyan-600 hover:text-cyan-800'}`}
                      >
                        Alle löschen
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Keine Benachrichtigungen</p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-4 border-b cursor-pointer ${
                            darkMode 
                              ? `hover:bg-slate-700 ${!notif.read ? 'bg-slate-700' : ''} border-slate-700`
                              : `hover:bg-cyan-50 ${!notif.read ? 'bg-cyan-50' : ''}`
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{notif.title}</p>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                            )}
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notif.message}</p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date(notif.time).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                setUser(null);
                localStorage.removeItem('baeder_user');
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm shadow-md sticky top-0 z-10 relative`}>
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {[
            { id: 'home', icon: '🏠', label: 'Start', show: true },
            { id: 'exam-simulator', icon: '📝', label: 'Prüfungssimulator', show: true },
            { id: 'flashcards', icon: '🎴', label: 'Karteikarten', show: true },
            { id: 'calculator', icon: '🧮', label: 'Rechner', show: true },
            { id: 'quiz', icon: '🏊', label: 'Quizduell', show: true },
            { id: 'stats', icon: '🏅', label: 'Statistiken', show: true },
            { id: 'trainer-dashboard', icon: '👨‍🏫', label: 'Azubi-Übersicht', show: user.permissions.canViewAllStats },
            { id: 'chat', icon: '💬', label: 'Chat', show: true },
            { id: 'materials', icon: '📚', label: 'Lernen', show: true },
            { id: 'resources', icon: '🔗', label: 'Ressourcen', show: true },
            { id: 'news', icon: '📢', label: 'News', show: true },
            { id: 'exams', icon: '📋', label: 'Klasuren', show: true },
            { id: 'questions', icon: '💡', label: 'Fragen', show: true },
            { id: 'admin', icon: '⚙️', label: 'Verwaltung', show: user.permissions.canManageUsers }
          ].filter(item => item.show).map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                playSound('splash');
                if (item.id === 'exam-simulator' && !examSimulator) {
                  loadExamProgress();
                }
                if (item.id === 'flashcards') {
                  loadFlashcards();
                }
              }}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                currentView === item.id
                  ? darkMode
                    ? 'text-cyan-400 border-b-4 border-cyan-400 bg-slate-700'
                    : 'text-cyan-600 border-b-4 border-cyan-600 bg-cyan-50'
                  : darkMode
                    ? 'text-gray-300 hover:text-cyan-400 hover:bg-slate-700'
                    : 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 relative z-10">
        {/* Developer Console */}
        {showDevConsole && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`${darkMode ? 'bg-slate-900' : 'bg-gray-900'} rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-500 shadow-2xl`}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                    🛠️ Developer Console
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Strg+D zum Schließen</p>
                </div>
                <button
                  onClick={() => setShowDevConsole(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Storage Stats */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">📊 Storage Übersicht</h3>
                <div className="grid grid-cols-4 gap-3">
                  <StorageStats />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">⚡ Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={createTestUsers}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all"
                  >
                    👥 Test-Nutzer erstellen
                  </button>
                  <button
                    onClick={clearAllData}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all"
                  >
                    🗑️ Alle Daten löschen
                  </button>
                </div>
              </div>

              {/* Current Users */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">👥 Registrierte Nutzer</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allUsers.map(u => (
                    <div key={u.email} className="bg-slate-800 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold">{u.name}</p>
                        <p className="text-sm text-gray-400">{u.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded text-xs font-bold ${
                          u.role === 'admin' ? 'bg-purple-500 text-white' :
                          u.role === 'trainer' ? 'bg-blue-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {PERMISSIONS[u.role].label}
                        </span>
                        <select
                          value={u.role}
                          onChange={(e) => changeUserRoleDev(u.email, e.target.value)}
                          className="bg-slate-700 text-white text-xs rounded px-2"
                        >
                          <option value="azubi">→ Azubi</option>
                          <option value="trainer">→ Trainer</option>
                          <option value="admin">→ Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {allUsers.length === 0 && (
                    <p className="text-gray-400 text-center py-4">Keine Nutzer registriert</p>
                  )}
                </div>
              </div>

              {/* Pending Approvals */}
              {pendingUsers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-yellow-400 mb-3">⏳ Warten auf Freischaltung</h3>
                  <div className="space-y-2">
                    {pendingUsers.map(u => (
                      <div key={u.email} className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="text-white font-bold">{u.name}</p>
                          <p className="text-sm text-gray-400">{u.email} • {PERMISSIONS[u.role].label}</p>
                        </div>
                        <button
                          onClick={() => approveUser(u.email)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold"
                        >
                          ✓ Freischalten
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-cyan-900/50 border border-cyan-600 rounded-lg p-4">
                <h4 className="text-cyan-300 font-bold mb-2">🚀 Quick Start Guide</h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <div className="bg-slate-800 rounded p-3">
                    <p className="font-bold text-white mb-1">Option 1: Test-Nutzer erstellen</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Klicke auf "Test-Nutzer erstellen"</li>
                      <li>5 Accounts werden angelegt (inkl. Admin)</li>
                      <li>Melde dich ab und mit einem Test-Account an</li>
                      <li>Passwörter: test123 oder admin123</li>
                    </ol>
                  </div>
                  
                  <div className="bg-slate-800 rounded p-3">
                    <p className="font-bold text-white mb-1">Option 2: Manuell registrieren</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Gehe zurück zum Login-Screen</li>
                      <li>Klicke auf "Registrieren"</li>
                      <li>Wähle Rolle: <strong>Administrator</strong></li>
                      <li>Account wird erstellt (keine Freischaltung nötig als Admin)</li>
                    </ol>
                  </div>

                  <div className="bg-green-900/50 border border-green-600 rounded p-3 mt-3">
                    <p className="font-bold text-green-300 mb-1">✅ Empfehlung:</p>
                    <p>Erstelle Test-Nutzer für schnellen Start, dann weitere Azubis manuell registrieren lassen!</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/50 border border-blue-600 rounded-lg p-4 mt-4">
                <h4 className="text-blue-300 font-bold mb-2">💡 Developer Tipps</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <strong>Strg+D:</strong> Console jederzeit öffnen/schließen (auch ohne Login!)</li>
                  <li>• <strong>Rollen ändern:</strong> Dropdown bei jedem Nutzer verwenden</li>
                  <li>• <strong>Test-Daten:</strong> Werden mit echten Stats angelegt für Demo-Zwecke</li>
                  <li>• <strong>Alle löschen:</strong> Setzt die komplette App zurück (Storage wird geleert)</li>
                  <li>• <strong>🛠️ Button:</strong> Als Admin im Header sichtbar für schnellen Zugriff</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {currentView === 'admin' && user.permissions.canManageUsers && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">👑 Admin-Bereich</h2>
              <p className="opacity-90">Nutzerverwaltung & Datenschutz</p>
            </div>

            {/* Admin Statistics Dashboard */}
            <div className="grid md:grid-cols-4 gap-4">
              {(() => {
                const stats = getAdminStats();
                return (
                  <>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="text-blue-500" size={32} />
                        <span className="text-3xl font-bold text-blue-600">{stats.totalUsers}</span>
                      </div>
                      <p className="text-sm text-gray-600">Aktive Nutzer</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats.azubis} Azubis • {stats.trainers} Ausbilder
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <AlertTriangle className="text-yellow-500" size={32} />
                        <span className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</span>
                      </div>
                      <p className="text-sm text-gray-600">Ausstehende Freischaltungen</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <Trophy className="text-green-500" size={32} />
                        <span className="text-3xl font-bold text-green-600">{stats.totalGames}</span>
                      </div>
                      <p className="text-sm text-gray-600">Laufende Spiele</p>
                      <p className="text-xs text-gray-500 mt-1">{stats.activeGamesCount} aktiv</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <Brain className="text-purple-500" size={32} />
                        <span className="text-3xl font-bold text-purple-600">{stats.totalQuestions}</span>
                      </div>
                      <p className="text-sm text-gray-600">Eingereichte Fragen</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats.approvedQuestions} genehmigt • {stats.pendingQuestions} offen
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <BookOpen className="text-blue-500" size={32} />
                        <span className="text-3xl font-bold text-blue-600">{stats.totalMaterials}</span>
                      </div>
                      <p className="text-sm text-gray-600">Lernmaterialien</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <MessageCircle className="text-green-500" size={32} />
                        <span className="text-3xl font-bold text-green-600">{stats.totalMessages}</span>
                      </div>
                      <p className="text-sm text-gray-600">Chat-Nachrichten</p>
                    </div>

                    <div className={`bg-white rounded-xl p-6 shadow-md ${
                      stats.usersToDeleteSoon > 0 ? 'border-2 border-red-400' : ''
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <Trash2 className={stats.usersToDeleteSoon > 0 ? 'text-red-500' : 'text-gray-400'} size={32} />
                        <span className={`text-3xl font-bold ${
                          stats.usersToDeleteSoon > 0 ? 'text-red-600' : 'text-gray-400'
                        }`}>{stats.usersToDeleteSoon}</span>
                      </div>
                      <p className="text-sm text-gray-600">Löschung bald fällig</p>
                      <p className="text-xs text-gray-500 mt-1">Innerhalb 30 Tage</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <Shield className="text-indigo-500" size={32} />
                        <span className="text-3xl font-bold text-indigo-600">{stats.admins}</span>
                      </div>
                      <p className="text-sm text-gray-600">Administratoren</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {pendingUsers.length > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center text-yellow-800">
                  <AlertTriangle className="mr-2" />
                  Ausstehende Freischaltungen ({pendingUsers.length})
                </h3>
                <div className="space-y-3">
                  {pendingUsers.map(acc => (
                    <div key={acc.email} className="bg-white rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{acc.name}</p>
                        <p className="text-sm text-gray-600">{acc.email} • {PERMISSIONS[acc.role].label}</p>
                        {acc.role === 'azubi' && acc.trainingEnd && (
                          <p className="text-xs text-gray-500">Ausbildungsende: {new Date(acc.trainingEnd).toLocaleDateString()}</p>
                        )}
                      </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveUser(acc.email)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Account von ${acc.name} wirklich ablehnen und löschen?`)) {
                                await supabase.from('users').delete().eq('email', acc.email);
                                loadData();
                                alert('Account abgelehnt und gelöscht.');
                              }
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
                          >
                            <X size={20} />
                          </button>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Users className="mr-2 text-blue-500" />
                Aktive Nutzer ({allUsers.length})
              </h3>
              <div className="space-y-3">
                {allUsers.map(acc => {
                  const daysLeft = getDaysUntilDeletion(acc);
                  return (
                    <div key={acc.email} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold">{acc.name}</p>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                              acc.role === 'admin' ? 'bg-purple-500' :
                              acc.role === 'trainer' ? 'bg-blue-500' : 'bg-green-500'
                            }`}>
                              {PERMISSIONS[acc.role].label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{acc.email}</p>
                          {acc.trainingEnd && (
                            <p className="text-xs text-gray-500 mt-1">
                              Ausbildungsende: {new Date(acc.trainingEnd).toLocaleDateString()}
                            </p>
                          )}
                          {acc.lastLogin && (
                            <p className="text-xs text-gray-500">
                              Letzter Login: {new Date(acc.lastLogin).toLocaleDateString()}
                            </p>
                          )}
                          {daysLeft !== null && (
                            <div className={`mt-2 flex items-center text-xs ${
                              daysLeft < 30 ? 'text-red-600' : daysLeft < 90 ? 'text-yellow-600' : 'text-gray-600'
                            }`}>
                              <AlertTriangle size={14} className="mr-1" />
                              {daysLeft > 0 
                                ? `Automatische Löschung in ${daysLeft} Tagen`
                                : 'Löschung steht bevor'}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={acc.role}
                            onChange={(e) => changeUserRole(acc.email, e.target.value)}
                            className="px-3 py-1 border rounded text-sm"
                            disabled={acc.role === 'admin'}
                          >
                            <option value="azubi">Azubi</option>
                            <option value="trainer">Ausbilder</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => exportUserData(acc.email, acc.name)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                            title="Daten exportieren"
                          >
                            <Download size={18} />
                          </button>
                          {acc.role !== 'admin' && (
                            <button
                              onClick={() => deleteUser(acc.email)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                              title="Nutzer löschen"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          {acc.role === 'admin' && (
                            <div className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold flex items-center">
                              <Shield size={14} className="mr-1" />
                              Geschützt
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center text-blue-800">
                <Shield className="mr-2" />
                Datenschutz & Löschfristen
              </h3>
              <div className="space-y-2 text-sm text-blue-900">
                <p><strong>Administratoren:</strong> Werden NIEMALS automatisch gelöscht - permanente Accounts.</p>
                <p><strong>Azubis:</strong> Alle Daten werden automatisch am Ende der Ausbildung (eingegebenes Datum) gelöscht.</p>
                <p><strong>Ausbilder:</strong> Daten werden 6 Monate nach dem letzten Login automatisch gelöscht.</p>
                <p><strong>Löschung umfasst:</strong> Account, Statistiken, Spielstände, eingegebene Klasuren.</p>
                <p><strong>Nicht gelöscht:</strong> Lernmaterialien, News, Chat-Nachrichten (allgemeine Inhalte).</p>
                <p className="pt-2 font-bold">📥 Datenexport: Vor dem Löschen wird automatisch angeboten, die Nutzerdaten als JSON zu exportieren.</p>
                <p className="font-bold">🔔 Benachrichtigungen: Nutzer werden über wichtige Ereignisse (Freischaltung, etc.) informiert.</p>
                <p className="pt-2 font-bold text-red-700">⚠️ Die App prüft bei jedem Start automatisch auf abgelaufene Accounts.</p>
                <p className="pt-2 font-bold text-purple-700">👑 Admins sind geschützt und können nicht gelöscht werden!</p>
              </div>
            </div>
          </div>
        )}

        {/* Existing views - Home, Quiz, Stats, Chat, Materials, News, Exams, Questions */}
        {/* (Keeping all previous view code - too long to repeat here, but it stays the same) */}
        
        {currentView === 'home' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-900' : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500'} text-white rounded-xl p-8 text-center shadow-xl backdrop-blur-sm`}>
              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">🌊 Willkommen zurück! 💦</h2>
              {dailyWisdom && (
                <p className="text-sm opacity-90 mb-4 italic">💡 {dailyWisdom}</p>
              )}
              {userStats && (
                <div className="flex justify-center gap-6 mt-4">
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'}`}>
                    <div className="text-2xl font-bold">🏆 {userStats.wins}</div>
                    <div className="text-sm">Siege</div>
                  </div>
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'}`}>
                    <div className="text-2xl font-bold">💪 {userStats.losses}</div>
                    <div className="text-sm">Niederlagen</div>
                  </div>
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm rounded-lg px-6 py-3 border-2 ${darkMode ? 'border-white/20' : 'border-white/30'}`}>
                    <div className="text-2xl font-bold">🤝 {userStats.draws}</div>
                    <div className="text-sm">Unentschieden</div>
                  </div>
                </div>
              )}
            </div>

            {activeGames.filter(g => g.player2 === user.name && g.status === 'waiting').length > 0 && (
              <div className={`${darkMode ? 'bg-yellow-900/80' : 'bg-yellow-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-yellow-700' : 'border-yellow-400'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  <Zap className="mr-2" />
                  ⚡ Offene Herausforderungen
                </h3>
                {activeGames.filter(g => g.player2 === user.name && g.status === 'waiting').map(game => {
                  const diff = DIFFICULTY_SETTINGS[game.difficulty];
                  return (
                    <div key={game.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 mb-3 flex justify-between items-center shadow-md`}>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>🏊 {game.player1} fordert dich heraus!</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                          <span>Quizduell • 6 Runden</span>
                          <span className={`${diff.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                            {diff.icon} {diff.label} ({diff.time}s)
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          acceptChallenge(game.id);
                          playSound('whistle');
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-md"
                      >
                        Annehmen 🎯
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {activeGames.filter(g => (g.player1 === user.name || g.player2 === user.name) && g.status === 'active').length > 0 && (
              <div className={`${darkMode ? 'bg-cyan-900/80' : 'bg-cyan-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-cyan-700' : 'border-cyan-400'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
                  <Trophy className="mr-2" />
                  🏊 Laufende Spiele
                </h3>
                {activeGames.filter(g => (g.player1 === user.name || g.player2 === user.name) && g.status === 'active').map(game => {
                  const diff = DIFFICULTY_SETTINGS[game.difficulty];
                  return (
                    <div key={game.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 mb-3 flex justify-between items-center shadow-md`}>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>⚔️ {game.player1} vs {game.player2}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                          <span>Runde {game.round + 1}/6 • {game.player1Score}:{game.player2Score}</span>
                          <span className={`${diff.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                            {diff.icon} {diff.label}
                          </span>
                          {game.currentTurn === user.name && ' • Du bist dran! ⚡'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          continueGame(game.id);
                          playSound('whistle');
                        }}
                        className={`px-6 py-2 rounded-lg font-bold shadow-md ${
                          game.currentTurn === user.name
                            ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse'
                            : darkMode
                              ? 'bg-slate-600 text-gray-300'
                              : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {game.currentTurn === user.name ? 'Weiterspielen ⚡' : 'Anschauen'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* News Section */}
            {news.length > 0 && (
              <div className={`${darkMode ? 'bg-red-900/80' : 'bg-red-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-red-700' : 'border-red-400'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center justify-between ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                  <span className="flex items-center">
                    <Bell className="mr-2" />
                    📢 Aktuelle News
                  </span>
                  <button
                    onClick={() => {
                      setCurrentView('news');
                      playSound('splash');
                    }}
                    className={`text-sm ${darkMode ? 'text-red-300 hover:text-red-100' : 'text-red-600 hover:text-red-800'} underline`}
                  >
                    Alle anzeigen →
                  </button>
                </h3>
                <div className="space-y-3">
                  {news.slice(0, 3).map(item => (
                    <div key={item.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-md border-l-4 border-red-500`}>
                      <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.title}</h4>
                      <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>{item.content}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Von {item.author} • {new Date(item.time).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exams Section */}
            {exams.length > 0 && (
              <div className={`${darkMode ? 'bg-green-900/80' : 'bg-green-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-green-700' : 'border-green-400'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 flex items-center justify-between ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                  <span className="flex items-center">
                    <Calendar className="mr-2" />
                    📋 Anstehende Klausuren
                  </span>
                  <button
                    onClick={() => {
                      setCurrentView('exams');
                      playSound('splash');
                    }}
                    className={`text-sm ${darkMode ? 'text-green-300 hover:text-green-100' : 'text-green-600 hover:text-green-800'} underline`}
                  >
                    Alle anzeigen →
                  </button>
                </h3>
                <div className="space-y-3">
                  {exams.slice(0, 3).map(exam => {
                    const examDate = new Date(exam.date);
                    const today = new Date();
                    const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntil <= 7 && daysUntil >= 0;
                    
                    return (
                      <div key={exam.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow-md border-l-4 ${
                        isUrgent ? 'border-orange-500' : 'border-green-500'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{exam.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isUrgent 
                              ? 'bg-orange-500 text-white animate-pulse' 
                              : darkMode ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-800'
                          }`}>
                            {daysUntil > 0 ? `in ${daysUntil} Tagen` : daysUntil === 0 ? 'Heute!' : 'Vorbei'}
                          </span>
                        </div>
                        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-1`}>{exam.topics}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {examDate.toLocaleDateString()} • {exam.user}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-4 gap-4">
              <div className={`${darkMode ? 'bg-slate-800/95 border-cyan-600' : 'bg-white/95 border-cyan-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-400`}
                   onClick={() => {
                     setCurrentView('exam-simulator');
                     loadExamProgress();
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">📝</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Prüfungssimulator</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>30 Fragen üben</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-purple-600' : 'bg-white/95 border-purple-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-400`}
                   onClick={() => {
                     setCurrentView('flashcards');
                     loadFlashcards();
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🎴</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>Karteikarten</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Klassisch lernen</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-blue-600' : 'bg-white/95 border-blue-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-400`}
                   onClick={() => {
                     setCurrentView('calculator');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🧮</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Praxis-Rechner</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Mit Lösungsweg</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-cyan-600' : 'bg-white/95 border-cyan-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-400`}
                   onClick={() => {
                     setCurrentView('quiz');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🏊</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Quizduell</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fordere andere heraus!</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-yellow-600' : 'bg-white/95 border-yellow-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-yellow-400`}
                   onClick={() => {
                     setCurrentView('stats');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🏅</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Statistiken</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Badges & Ranking</p>
              </div>

              {user.permissions.canViewAllStats && (
                <div className={`${darkMode ? 'bg-slate-800/95 border-indigo-600' : 'bg-white/95 border-indigo-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-indigo-400`}
                     onClick={() => {
                       setCurrentView('trainer-dashboard');
                       playSound('splash');
                     }}>
                  <div className="text-5xl mb-3 text-center">👨‍🏫</div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Azubi-Übersicht</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fortschritte sehen</p>
                </div>
              )}

              <div className={`${darkMode ? 'bg-slate-800/95 border-green-600' : 'bg-white/95 border-green-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-400`}
                   onClick={() => {
                     setCurrentView('materials');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">📚</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Lernmaterialien</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{materials.length} Materialien</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-indigo-600' : 'bg-white/95 border-indigo-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-indigo-400`}
                   onClick={() => {
                     setCurrentView('resources');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🔗</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>Ressourcen</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{resources.length} Links</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-pink-600' : 'bg-white/95 border-pink-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-pink-400`}
                   onClick={() => {
                     setCurrentView('chat');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">💬</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-pink-400' : 'text-pink-700'}`}>Team-Chat</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{messages.length} Nachrichten</p>
              </div>
            </div>
          </div>
        )}

        {/* Quiz View */}
        {currentView === 'quiz' && !currentGame && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Quizduell 🏆</h2>
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold mb-4">Spieler herausfordern</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Schwierigkeitsgrad wählen:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(DIFFICULTY_SETTINGS).map(([key, diff]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDifficulty(key)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedDifficulty === key
                          ? `${diff.color} text-white border-transparent`
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-3xl mb-2">{diff.icon}</div>
                      <div className="font-bold">{diff.label}</div>
                      <div className="text-sm opacity-90">{diff.time} Sekunden</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                {allUsers.filter(u => u.name !== user.name).map(u => (
                  <div key={u.name} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        u.role === 'trainer' || u.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        {u.role === 'trainer' || u.role === 'admin' ? '👨‍🏫' : '🎓'}
                      </div>
                      <div>
                        <p className="font-bold">{u.name}</p>
                        <p className="text-sm text-gray-600">
                          {u.role === 'admin' ? 'Administrator' : u.role === 'trainer' ? 'Ausbilder' : 'Azubi'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => challengePlayer(u.name)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2"
                    >
                      <Target size={20} />
                      <span>Herausfordern</span>
                    </button>
                  </div>
                ))}
                {allUsers.filter(u => u.name !== user.name).length === 0 && (
                  <p className="text-gray-500 text-center py-8">Noch keine anderen Spieler online</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'quiz' && currentGame && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <div className="text-center mb-4">
                {(() => {
                  const diff = DIFFICULTY_SETTINGS[currentGame.difficulty];
                  return (
                    <span className={`${diff.color} text-white px-6 py-2 rounded-full font-bold inline-flex items-center gap-2`}>
                      {diff.icon} {diff.label} - {diff.time} Sekunden pro Frage
                    </span>
                  );
                })()}
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-center flex-1">
                  <p className="text-sm text-gray-600 mb-1">{currentGame.player1}</p>
                  <p className="text-3xl font-bold text-blue-600">{currentGame.player1Score}</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-gray-400">Runde {quizRound + 1}/6</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {playerTurn === user.name ? '⚡ Du bist dran!' : `${playerTurn} ist dran...`}
                  </p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-sm text-gray-600 mb-1">{currentGame.player2}</p>
                  <p className="text-3xl font-bold text-red-600">{currentGame.player2Score}</p>
                </div>
              </div>
              {!quizCategory && playerTurn === user.name && (
                <div>
                  <h3 className="text-xl font-bold text-center mb-4">Wähle eine Kategorie:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat.id)}
                        className={`${cat.color} text-white rounded-xl p-4 hover:scale-105 transition-transform`}
                      >
                        <div className="text-3xl mb-2">{cat.icon}</div>
                        <div className="font-bold text-sm">{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!quizCategory && playerTurn !== user.name && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⏳</div>
                  <p className="text-xl text-gray-600">Warte auf {playerTurn}...</p>
                </div>
              )}
              {currentQuestion && playerTurn === user.name && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Zeit:</span>
                      <span className={`text-2xl font-bold ${
                        timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'
                      }`}>
                        {timeLeft}s
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(timeLeft / DIFFICULTY_SETTINGS[currentGame.difficulty].time) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-6">
                    <p className="text-xl font-bold text-center">{currentQuestion.q}</p>
                  </div>
                  <div className="grid gap-3">
                    {currentQuestion.a.map((answer, idx) => (
                      <button
                        key={idx}
                        onClick={() => answerQuestion(idx)}
                        disabled={answered}
                        className={`p-4 rounded-xl font-medium transition-all ${
                          answered
                            ? idx === currentQuestion.correct
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                            : 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500'
                        }`}
                      >
                        {answer}
                      </button>
                    ))}
                  </div>
                  {answered && timeLeft === 0 && (
                    <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 text-center">
                      <p className="text-red-700 font-bold">⏰ Zeit abgelaufen!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats View */}
        {currentView === 'stats' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white rounded-xl p-8`}>
              <h2 className="text-3xl font-bold mb-4">📊 Deine Statistiken</h2>
              {userStats && (
                <div className="grid grid-cols-3 gap-4">
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg p-4 text-center`}>
                    <div className="text-3xl font-bold">{userStats.wins}</div>
                    <div className="text-sm">Siege</div>
                  </div>
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg p-4 text-center`}>
                    <div className="text-3xl font-bold">{userStats.losses}</div>
                    <div className="text-sm">Niederlagen</div>
                  </div>
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-lg p-4 text-center`}>
                    <div className="text-3xl font-bold">{userStats.draws}</div>
                    <div className="text-sm">Unentschieden</div>
                  </div>
                </div>
              )}
            </div>

            {/* Badges Section */}
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🏆 Deine Badges
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                {BADGES.map(badge => {
                  const earned = userBadges.find(b => b.id === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl text-center transition-all ${
                        earned
                          ? darkMode
                            ? 'bg-gradient-to-br from-yellow-900 to-yellow-800 border-2 border-yellow-600'
                            : 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400'
                          : darkMode
                            ? 'bg-slate-700 opacity-40'
                            : 'bg-gray-100 opacity-40'
                      }`}
                    >
                      <div className="text-5xl mb-2">{badge.icon}</div>
                      <p className={`font-bold mb-1 ${earned ? darkMode ? 'text-yellow-200' : 'text-yellow-800' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {badge.name}
                      </p>
                      <p className={`text-xs ${earned ? darkMode ? 'text-yellow-300' : 'text-yellow-700' : darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                        {badge.description}
                      </p>
                      {earned && (
                        <p className={`text-xs mt-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          ✓ Erhalten
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Star className="mr-2 text-yellow-500" />
                Bestenliste
              </h3>
              <div className="space-y-2">
                {leaderboard.map((player, idx) => (
                  <div key={player.name} className={`flex items-center justify-between p-4 rounded-lg ${
                    player.name === user.name ? darkMode ? 'bg-blue-900/50 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-500' : darkMode ? 'bg-slate-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl font-bold ${
                        idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-600' : darkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {idx + 1}.
                      </div>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{player.name}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {player.wins}S • {player.losses}N • {player.draws}U
                        </p>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{player.points}</div>
                  </div>
                ))}
              </div>
            </div>
            {userStats && userStats.categoryStats && Object.keys(userStats.categoryStats).length > 0 && (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📈 Performance nach Kategorie</h3>
                <div className="space-y-3">
                  {Object.entries(userStats.categoryStats).map(([catId, stats]) => {
                    const cat = CATEGORIES.find(c => c.id === catId);
                    const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                    return (
                      <div key={catId} className={`border rounded-lg p-4 ${darkMode ? 'border-slate-600' : ''}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`${cat.color} text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
                              {cat.icon}
                            </div>
                            <div>
                              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{cat.name}</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {stats.correct}/{stats.total} richtig
                              </p>
                            </div>
                          </div>
                          <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{percentage}%</div>
                        </div>
                        <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-2`}>
                          <div 
                            className={`h-2 rounded-full ${cat.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat View */}
        {currentView === 'chat' && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex flex-col h-[600px]">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold flex items-center">
                <MessageCircle className="mr-2" />
                Team-Chat
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                🛡️ Respektvoller Umgang erforderlich - Beleidigungen und unangemessene Inhalte sind verboten
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.user === user.name ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-xl p-3 ${
                    msg.user === user.name
                      ? 'bg-blue-500 text-white'
                      : msg.isTrainer
                      ? 'bg-purple-100 text-purple-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-xs font-bold mb-1">
                      {msg.user} {msg.isTrainer && '👨‍🏫'}
                    </p>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Nachricht schreiben..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Materials View */}
        {currentView === 'materials' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <BookOpen className="mr-2 text-blue-500" />
                Lernmaterialien
              </h2>
              {user.permissions.canUploadMaterials && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold mb-3">Neues Material hinzufügen</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      placeholder="Titel des Materials"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <select
                      value={materialCategory}
                      onChange={(e) => setMaterialCategory(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={addMaterial}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                    >
                      <Upload className="inline mr-2" size={18} />
                      Hinzufügen
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {materials.map(mat => {
                  const cat = CATEGORIES.find(c => c.id === mat.category);
                  return (
                    <div key={mat.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`${cat.color} text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                            {cat.icon}
                          </div>
                          <div>
                            <h3 className="font-bold">{mat.title}</h3>
                            <p className="text-sm text-gray-600">{cat.name}</p>
                          </div>
                        </div>
                        <button className="text-blue-500 hover:text-blue-600">
                          <Download size={24} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {materials.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Noch keine Materialien vorhanden</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resources View */}
        {currentView === 'resources' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <span className="text-3xl mr-3">🔗</span>
                Nützliche Links & Ressourcen
              </h2>

              {/* Add Resource Form */}
              {user.role === 'admin' ? (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
                  <h3 className={`font-bold mb-3 ${darkMode ? 'text-cyan-400' : 'text-gray-800'}`}>
                    🔒 Neue Ressource hinzufügen (Nur Admins)
                  </h3>
                  <div className="space-y-3">
                  <input
                    type="text"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="Titel (z.B. 'Prüfungstermine NRW')"
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
                  />
                  
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
                  >
                    <option value="youtube">📺 YouTube Video</option>
                    <option value="website">🌐 Website/Link</option>
                    <option value="document">📄 Dokument</option>
                    <option value="behörde">🏛️ Behörde/Amt</option>
                    <option value="tool">🛠️ Tool/Software</option>
                  </select>

                  <input
                    type="url"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    placeholder="URL (https://...)"
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
                  />

                  <textarea
                    value={resourceDescription}
                    onChange={(e) => setResourceDescription(e.target.value)}
                    placeholder="Beschreibung (optional)"
                    rows="2"
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : ''}`}
                  />

                  <button
                    onClick={addResource}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-bold"
                  >
                    <Plus className="inline mr-2" size={18} />
                    Ressource hinzufügen
                  </button>
                </div>
              </div>
              ) : (
                <div className={`${darkMode ? 'bg-yellow-900/50 border-yellow-600' : 'bg-yellow-50 border-yellow-400'} border-2 rounded-lg p-4 mb-6`}>
                  <div className="flex items-center gap-3">
                    <Shield size={32} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                    <div>
                      <p className={`font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                        🔒 Nur Administratoren können Ressourcen hinzufügen
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                        Dies dient der Sicherheit und Qualität der geteilten Inhalte.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resources List */}
              <div className="space-y-3">
                {resources.map(resource => {
                  const typeIcons = {
                    youtube: '📺',
                    website: '🌐',
                    document: '📄',
                    behörde: '🏛️',
                    tool: '🛠️'
                  };
                  
                  const typeColors = {
                    youtube: 'bg-red-500',
                    website: 'bg-blue-500',
                    document: 'bg-green-500',
                    behörde: 'bg-purple-500',
                    tool: 'bg-orange-500'
                  };

                  return (
                    <div key={resource.id} className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white'} border rounded-lg p-4 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`${typeColors[resource.type]} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                              {typeIcons[resource.type]} {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                            </span>
                          </div>
                          <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {resource.title}
                          </h3>
                          {resource.description && (
                            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {resource.description}
                            </p>
                          )}
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'} hover:underline break-all`}
                          >
                            {resource.url}
                          </a>
                          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Von {resource.addedBy} • {new Date(resource.time).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                            title="Öffnen"
                          >
                            <Download size={20} />
                          </a>
                          {user.role === 'admin' && (
                            <button
                              onClick={() => deleteResource(resource.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                              title="Löschen"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* YouTube Embed Preview */}
                      {resource.type === 'youtube' && resource.url.includes('youtube.com') && (
                        <div className="mt-3">
                          <iframe
                            width="100%"
                            height="315"
                            src={resource.url.replace('watch?v=', 'embed/')}
                            title={resource.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  );
                })}

                {resources.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔗</div>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Noch keine Ressourcen vorhanden
                    </p>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className={`mt-6 ${darkMode ? 'bg-cyan-900/50 border-cyan-600' : 'bg-cyan-50 border-cyan-300'} border-2 rounded-lg p-4`}>
                <h4 className={`font-bold mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
                  💡 Beispiele für nützliche Ressourcen:
                </h4>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• YouTube: Technik-Tutorials, Rettungsschwimmen-Videos</li>
                  <li>• Behörden: Bezirksregierung (Prüfungstermine, Anmeldeformulare)</li>
                  <li>• Websites: DLRG, DGfdB, Berufsverbände</li>
                  <li>• Dokumente: Gesetze, Verordnungen, Leitfäden</li>
                  <li>• Tools: Rechner, Simulationen, Lern-Apps</li>
                </ul>
              </div>

              {/* Security Info Box */}
              <div className={`mt-4 ${darkMode ? 'bg-red-900/50 border-red-600' : 'bg-red-50 border-red-300'} border-2 rounded-lg p-4`}>
                <h4 className={`font-bold mb-2 flex items-center ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                  <Shield className="mr-2" size={20} />
                  🛡️ Sicherheitshinweise
                </h4>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• <strong>Nur Administratoren</strong> können Ressourcen hinzufügen</li>
                  <li>• Alle Inhalte werden automatisch auf unangemessene Begriffe geprüft</li>
                  <li>• Pornografische, beleidigende oder rechtsradikale Inhalte sind verboten</li>
                  <li>• Verstöße führen zur sofortigen Sperrung des Accounts</li>
                  <li>• Bei Problemen: Sofort einen Administrator informieren</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* News View */}
        {currentView === 'news' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Bell className="mr-2 text-red-500" />
                Ankündigungen & News
              </h2>
              {user.permissions.canPostNews && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-bold mb-3">Neue Ankündigung</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      placeholder="Titel"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <textarea
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      placeholder="Inhalt"
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <button
                      onClick={addNews}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                    >
                      <Plus className="inline mr-2" size={18} />
                      Veröffentlichen
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {news.map(item => (
                  <div key={item.id} className="border-l-4 border-red-500 bg-gray-50 rounded-r-lg p-4">
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-700 mb-2">{item.content}</p>
                    <p className="text-sm text-gray-500">
                      Von {item.author} • {new Date(item.time).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {news.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Keine Ankündigungen vorhanden</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Exams View */}
        {currentView === 'exams' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <ClipboardList className="mr-2 text-green-500" />
                Klasuren & Prüfungen
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-3">Klasur eintragen</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="Klasur-Titel"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    value={examTopics}
                    onChange={(e) => setExamTopics(e.target.value)}
                    placeholder="Themen"
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={addExam}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                  >
                    <Calendar className="inline mr-2" size={18} />
                    Eintragen
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {exams.map(exam => (
                  <div key={exam.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{exam.title}</h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {new Date(exam.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{exam.topics}</p>
                    <p className="text-sm text-gray-500">Eingetragen von {exam.user}</p>
                  </div>
                ))}
                {exams.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Keine Klasuren eingetragen</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Exam Simulator View */}
        {currentView === 'exam-simulator' && !userExamProgress && (
          <div className="max-w-4xl mx-auto">
            {!examSimulator ? (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-8 shadow-lg text-center`}>
                <div className="text-6xl mb-4">📝</div>
                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Prüfungssimulator</h2>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Teste dein Wissen mit 30 zufälligen Fragen aus allen Kategorien
                </p>
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-blue-50'} rounded-lg p-6 mb-6`}>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>30</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fragen</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>6</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Kategorien</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>50%</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Zum Bestehen</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    loadExamProgress();
                    playSound('whistle');
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
                >
                  Prüfung starten 🚀
                </button>
              </div>
            ) : (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Frage {examQuestionIndex + 1} / 30
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {CATEGORIES.find(c => c.id === examCurrentQuestion.category)?.name}
                    </p>
                  </div>
                  <div className={`text-right ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                    <div className="text-2xl font-bold">
                      {examSimulator.answers.filter(a => a.correct).length}
                    </div>
                    <div className="text-sm">Richtig</div>
                  </div>
                </div>
                
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {examCurrentQuestion.q}
                  </p>
                </div>

                <div className="grid gap-3">
                  {examCurrentQuestion.a.map((answer, idx) => (
                    <button
                      key={idx}
                      onClick={() => answerExamQuestion(idx)}
                      disabled={examAnswered}
                      className={`p-4 rounded-xl font-medium transition-all text-left ${
                        examAnswered
                          ? idx === examCurrentQuestion.correct
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                          : darkMode
                            ? 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600 hover:border-cyan-500 text-white'
                            : 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'exam-simulator' && userExamProgress && (
          <div className="max-w-4xl mx-auto">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-8 shadow-lg text-center`}>
              <div className="text-6xl mb-4">{userExamProgress.passed ? '🎉' : '📚'}</div>
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {userExamProgress.passed ? 'Bestanden!' : 'Nicht bestanden'}
              </h2>
              <div className={`${userExamProgress.passed ? 'bg-green-500' : 'bg-red-500'} text-white rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6`}>
                <div className="text-4xl font-bold">{userExamProgress.percentage}%</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {userExamProgress.correct}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Richtig</div>
                </div>
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {userExamProgress.total - userExamProgress.correct}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Falsch</div>
                </div>
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                    {Math.round(userExamProgress.timeMs / 60000)}min
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dauer</div>
                </div>
              </div>
              <button
                onClick={resetExam}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg"
              >
                Neue Prüfung starten
              </button>
            </div>
          </div>
        )}

        {/* Flashcards View */}
        {currentView === 'flashcards' && (
          <div className="max-w-4xl mx-auto">
            {/* Add Flashcard Form */}
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ➕ Neue Karteikarte erstellen
              </h3>
              <div className="space-y-3">
                <select
                  value={newFlashcardCategory}
                  onChange={(e) => setNewFlashcardCategory(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
                  }`}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Vorderseite (Frage):
                  </label>
                  <textarea
                    value={newFlashcardFront}
                    onChange={(e) => setNewFlashcardFront(e.target.value)}
                    placeholder="z.B. Was ist der optimale pH-Wert?"
                    rows="2"
                    className={`w-full px-4 py-3 border rounded-lg ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rückseite (Antwort):
                  </label>
                  <textarea
                    value={newFlashcardBack}
                    onChange={(e) => setNewFlashcardBack(e.target.value)}
                    placeholder="z.B. 7,0 - 7,4 (neutral bis leicht basisch)"
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
                    }`}
                  />
                </div>

                <button
                  onClick={async () => {
                    if (!newFlashcardFront.trim() || !newFlashcardBack.trim()) {
                      alert('Bitte Vorder- und Rückseite ausfüllen!');
                      return;
                    }

                    // Content moderation
                    if (!moderateContent(newFlashcardFront, 'Vorderseite')) {
                      return;
                    }
                    if (!moderateContent(newFlashcardBack, 'Rückseite')) {
                      return;
                    }

                    try {
                      const isApproved = user.permissions.canApproveQuestions;
                      const { data, error } = await supabase
                        .from('flashcards')
                        .insert([{
                          user_id: user.id,
                          category: newFlashcardCategory,
                          question: newFlashcardFront.trim(),
                          answer: newFlashcardBack.trim(),
                          approved: isApproved
                        }])
                        .select()
                        .single();

                      if (error) throw error;

                      const flashcard = {
                        id: data.id,
                        front: data.question,
                        back: data.answer,
                        category: data.category,
                        approved: data.approved,
                        userId: data.user_id
                      };

                      if (flashcard.approved) {
                        setUserFlashcards([...userFlashcards, flashcard]);
                        alert('Karteikarte hinzugefügt! 🎴');
                      } else {
                        setPendingFlashcards([...pendingFlashcards, flashcard]);
                        alert('Karteikarte eingereicht! Sie wird nach Prüfung freigeschaltet. ⏳');
                      }

                      setNewFlashcardFront('');
                      setNewFlashcardBack('');
                      playSound('splash');
                    } catch (error) {
                      console.error('Flashcard error:', error);
                      alert('Fehler beim Erstellen der Karteikarte');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
                >
                  <Plus className="inline mr-2" size={20} />
                  Karteikarte erstellen
                </button>

                {!user.permissions.canApproveQuestions && (
                  <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ℹ️ Deine Karteikarte wird nach Prüfung durch einen Trainer freigeschaltet
                  </p>
                )}
              </div>
            </div>

            {/* Flashcard Display */}
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  🎴 Karteikarten
                </h2>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {FLASHCARD_CONTENT[newQuestionCategory]?.length || 0} Standard + {userFlashcards.filter(fc => fc.category === newQuestionCategory).length} Custom
                </div>
              </div>
              
              <select
                value={newQuestionCategory}
                onChange={(e) => {
                  setNewQuestionCategory(e.target.value);
                  const hardcodedCards = FLASHCARD_CONTENT[e.target.value] || [];
                  const userCards = userFlashcards.filter(fc => fc.category === e.target.value);
                  const allCards = [...hardcodedCards, ...userCards];
                  setFlashcards(allCards);
                  setFlashcardIndex(0);
                  setCurrentFlashcard(allCards[0]);
                  setShowFlashcardAnswer(false);
                }}
                className={`w-full px-4 py-3 border rounded-lg mb-6 ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white'
                }`}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            {currentFlashcard && flashcards.length > 0 && (
              <div className="perspective-1000">
                <div 
                  onClick={() => {
                    setShowFlashcardAnswer(!showFlashcardAnswer);
                    playSound('bubble');
                  }}
                  className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 shadow-2xl cursor-pointer transform transition-all hover:scale-105 min-h-[300px] flex items-center justify-center`}
                >
                  <div className="text-center">
                    <div className={`text-sm font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {showFlashcardAnswer ? 'ANTWORT' : 'FRAGE'}
                    </div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {showFlashcardAnswer ? currentFlashcard.back : currentFlashcard.front}
                    </p>
                    <p className={`text-sm mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {showFlashcardAnswer ? '' : 'Klicken zum Umdrehen'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => {
                      if (flashcardIndex > 0) {
                        const prevIdx = flashcardIndex - 1;
                        setFlashcardIndex(prevIdx);
                        setCurrentFlashcard(flashcards[prevIdx]);
                        setShowFlashcardAnswer(false);
                        playSound('splash');
                      }
                    }}
                    disabled={flashcardIndex === 0}
                    className={`px-6 py-3 rounded-lg font-bold ${
                      flashcardIndex === 0
                        ? darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                    }`}
                  >
                    ← Zurück
                  </button>
                  <div className={darkMode ? 'text-white' : 'text-gray-800'}>
                    <span className="font-bold">{flashcardIndex + 1}</span> / {flashcards.length}
                  </div>
                  <button
                    onClick={() => {
                      if (flashcardIndex < flashcards.length - 1) {
                        const nextIdx = flashcardIndex + 1;
                        setFlashcardIndex(nextIdx);
                        setCurrentFlashcard(flashcards[nextIdx]);
                        setShowFlashcardAnswer(false);
                        playSound('splash');
                      }
                    }}
                    disabled={flashcardIndex === flashcards.length - 1}
                    className={`px-6 py-3 rounded-lg font-bold ${
                      flashcardIndex === flashcards.length - 1
                        ? darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                    }`}
                  >
                    Weiter →
                  </button>
                </div>
              </div>
            )}

            {(!currentFlashcard || flashcards.length === 0) && (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 text-center`}>
                <div className="text-6xl mb-4">🎴</div>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Noch keine Karteikarten in dieser Kategorie. Erstelle die erste!
                </p>
              </div>
            )}

            {/* Pending Flashcards for Trainers/Admins */}
            {user.permissions.canApproveQuestions && (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg mt-6`}>
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ⏳ Wartende Karteikarten genehmigen
                </h3>
                {pendingFlashcards.length > 0 ? (
                  <div className="space-y-3">
                    {pendingFlashcards.map(fc => {
                      const cat = CATEGORIES.find(c => c.id === fc.category);
                      return (
                        <div key={fc.id} className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-yellow-50 border-yellow-300'} border-2 rounded-lg p-4`}>
                          <div className="flex justify-between items-start mb-3">
                            <span className={`${cat.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                              {cat.icon} {cat.name}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => approveFlashcard(fc.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                              >
                                <Check size={16} className="inline" /> Genehmigen
                              </button>
                              <button
                                onClick={() => deleteFlashcard(fc.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                              >
                                <X size={16} className="inline" /> Ablehnen
                              </button>
                            </div>
                          </div>
                          <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-3 mb-2`}>
                            <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Vorderseite:</p>
                            <p className={darkMode ? 'text-white' : 'text-gray-800'}>{fc.front}</p>
                          </div>
                          <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-3`}>
                            <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Rückseite:</p>
                            <p className={darkMode ? 'text-white' : 'text-gray-800'}>{fc.back}</p>
                          </div>
                          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            Von {fc.createdBy} • {new Date(fc.time).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Keine wartenden Karteikarten
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Calculator View */}
        {currentView === 'calculator' && (
          <div className="max-w-4xl mx-auto">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🧮 Praxis-Rechner
              </h2>
              
              <div className="grid md:grid-cols-5 gap-4 mb-6">
                <button
                  onClick={() => {
                    setCalculatorType('ph');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'ph'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  💧 pH-Wert
                </button>
                <button
                  onClick={() => {
                    setCalculatorType('chlorine');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'chlorine'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ⚗️ Chlor-Bedarf
                </button>
                <button
                  onClick={() => {
                    setCalculatorType('volume');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'volume'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  📏 Beckenvolumen
                </button>
                <button
                  onClick={() => {
                    setCalculatorType('chemicals');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'chemicals'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  🧪 Chemikalien
                </button>
                <button
                  onClick={() => {
                    setCalculatorType('periodic');
                    setCalculatorInputs({});
                    setCalculatorResult(null);
                  }}
                  className={`p-4 rounded-xl font-bold ${
                    calculatorType === 'periodic'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ⚛️ Periodensystem
                </button>
              </div>

              {calculatorType === 'ph' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-blue-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-800'}`}>pH-Wert / Säurekapazität berechnen</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Chlor-Wert (mg/l)"
                      value={calculatorInputs.chlorine || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, chlorine: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      placeholder="Alkalinität (mg/l)"
                      value={calculatorInputs.alkalinity || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, alkalinity: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Säurekapazität (mmol/l) - Optional"
                      value={calculatorInputs.acidCapacity || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, acidCapacity: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <div className={`${darkMode ? 'bg-slate-600' : 'bg-blue-100'} rounded-lg p-3 text-sm`}>
                      <p className={darkMode ? 'text-cyan-300' : 'text-blue-800'}>
                        💡 <strong>Säurekapazität:</strong> Maß für die Pufferfähigkeit des Wassers. Optimal: 2,0-3,0 mmol/l
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {calculatorType === 'chlorine' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-green-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>Chlor-Bedarf berechnen</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Beckenvolumen (m³)"
                      value={calculatorInputs.poolVolume || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, poolVolume: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Aktueller Chlor-Wert (mg/l)"
                      value={calculatorInputs.currentChlorine || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, currentChlorine: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Ziel-Chlor-Wert (mg/l)"
                      value={calculatorInputs.targetChlorine || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, targetChlorine: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                  </div>
                </div>
              )}

              {calculatorType === 'volume' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-purple-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>Beckenvolumen berechnen</h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Länge (m)"
                      value={calculatorInputs.length || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, length: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Breite (m)"
                      value={calculatorInputs.width || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, width: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Tiefe (m)"
                      value={calculatorInputs.depth || ''}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, depth: e.target.value})}
                      className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                    />
                  </div>
                </div>
              )}

              {calculatorType === 'chemicals' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-orange-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>🧪 Chemische Zusammensetzungen</h3>
                  <select
                    value={selectedChemical?.name || ''}
                    onChange={(e) => {
                      const chem = POOL_CHEMICALS.find(c => c.name === e.target.value);
                      setSelectedChemical(chem);
                      playSound('bubble');
                    }}
                    className={`w-full px-4 py-3 rounded-lg mb-4 ${darkMode ? 'bg-slate-600 text-white border-slate-500' : 'border'}`}
                  >
                    <option value="">-- Chemikalie wählen --</option>
                    {POOL_CHEMICALS.map(chem => (
                      <option key={chem.name} value={chem.name}>{chem.name}</option>
                    ))}
                  </select>
                  
                  {selectedChemical && (
                    <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-6 border-2 ${darkMode ? 'border-orange-500' : 'border-orange-400'}`}>
                      <div className="text-center mb-4">
                        <h4 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {selectedChemical.name}
                        </h4>
                        <div className={`text-5xl font-bold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                          {selectedChemical.formula}
                        </div>
                      </div>
                      <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4`}>
                        <p className={`font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                          Verwendung:
                        </p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {selectedChemical.use}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {calculatorType === 'periodic' && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-indigo-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>⚛️ Periodensystem der Elemente</h3>
                  
                  <div className="grid grid-cols-18 gap-1 mb-6 overflow-x-auto">
                    {PERIODIC_TABLE.map(element => {
                      const colors = {
                        'alkali': 'bg-red-500',
                        'alkaline-earth': 'bg-orange-500',
                        'transition': 'bg-yellow-500',
                        'post-transition': 'bg-green-500',
                        'metalloid': 'bg-teal-500',
                        'nonmetal': 'bg-blue-500',
                        'halogen': 'bg-purple-500',
                        'noble-gas': 'bg-pink-500',
                        'lanthanide': 'bg-cyan-500',
                        'actinide': 'bg-lime-500'
                      };
                      
                      const bgColor = colors[element.category] || 'bg-gray-400';
                      
                      return (
                        <button
                          key={element.number}
                          onClick={() => {
                            setSelectedElement(element);
                            playSound('bubble');
                          }}
                          className={`${bgColor} hover:scale-110 transition-transform rounded p-1 text-white text-center cursor-pointer ${
                            selectedElement?.number === element.number ? 'ring-2 ring-white scale-110' : ''
                          }`}
                          style={{
                            gridColumn: element.group,
                            gridRow: element.period,
                            minWidth: '40px'
                          }}
                        >
                          <div className="text-[8px] font-bold">{element.number}</div>
                          <div className="text-xs font-bold">{element.symbol}</div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedElement && (
                    <div className={`${darkMode ? 'bg-slate-600 border-indigo-500' : 'bg-white border-indigo-400'} rounded-lg p-6 border-2`}>
                      <div className="text-center mb-4">
                        <div className={`text-6xl font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          {selectedElement.symbol}
                        </div>
                        <h4 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {selectedElement.name}
                        </h4>
                      </div>
                      <div className={`grid grid-cols-2 gap-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ordnungszahl</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.number}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Atommasse</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.mass} u</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gruppe</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.group}</p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Periode</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedElement.period}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Alkalimetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Erdalkalimetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Übergangsmetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nichtmetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Halogene</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-pink-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Edelgase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-teal-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Halbmetalle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lanthanoide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-lime-500 rounded"></div>
                      <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actinoide</span>
                    </div>
                  </div>
                </div>
              )}

              {calculatorType !== 'chemicals' && calculatorType !== 'periodic' && (
                <button
                  onClick={handleCalculation}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg mb-6"
                >
                  Berechnen 🧮
                </button>
              )}

              {calculatorResult && (
                <div className={`${darkMode ? 'bg-slate-700 border-cyan-600' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300'} border-2 rounded-xl p-6`}>
                  <div className={`text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <div className="text-sm font-bold mb-2">ERGEBNIS</div>
                    <div className="text-4xl font-bold mb-2">{calculatorResult.result}</div>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-600' : 'bg-white'} rounded-lg p-4 mb-4`}>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Berechnung:</strong> {calculatorResult.explanation}
                    </p>
                    {calculatorResult.details && (
                      <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {calculatorResult.details}
                      </p>
                    )}
                    <p className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                      💡 {calculatorResult.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trainer Dashboard */}
        {currentView === 'trainer-dashboard' && user.permissions.canViewAllStats && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} text-white rounded-xl p-8 text-center`}>
              <h2 className="text-3xl font-bold mb-2">👨‍🏫 Azubi-Übersicht</h2>
              <p className="opacity-90">Fortschritte und Leistungen deiner Azubis</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {allUsers.filter(u => u.role === 'azubi').map(azubi => {
                const azubiGames = activeGames.filter(g => 
                  (g.player1 === azubi.name || g.player2 === azubi.name) && g.status === 'finished'
                );
                const wins = azubiGames.filter(g => g.winner === azubi.name).length;
                const total = azubiGames.length;
                const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

                return (
                  <div key={azubi.email} className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                        🎓
                      </div>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubi.name}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Azubi</p>
                      </div>
                    </div>
                    
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-4 mb-4`}>
                      <div className="flex justify-between mb-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Siegesrate</span>
                        <span className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{winRate}%</span>
                      </div>
                      <div className={`w-full ${darkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full h-2`}>
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${winRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                        <div className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{wins}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Siege</div>
                      </div>
                      <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                        <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{total}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gesamt</div>
                      </div>
                    </div>

                    {azubi.trainingEnd && (
                      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Ausbildungsende: {new Date(azubi.trainingEnd).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {allUsers.filter(u => u.role === 'azubi').length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Noch keine Azubis registriert
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Questions View */}
        {currentView === 'questions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Brain className="mr-2 text-purple-500" />
                Fragen einreichen
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-3">Neue Quizfrage vorschlagen</h3>
                <div className="space-y-3">
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Deine Frage..."
                    rows="2"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <select
                    value={newQuestionCategory}
                    onChange={(e) => setNewQuestionCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {[0, 1, 2, 3].map(i => (
                    <input
                      key={i}
                      type="text"
                      value={newQuestionAnswers[i]}
                      onChange={(e) => {
                        const newAnswers = [...newQuestionAnswers];
                        newAnswers[i] = e.target.value;
                        setNewQuestionAnswers(newAnswers);
                      }}
                      placeholder={`Antwort ${i + 1} ${i === newQuestionCorrect ? '(richtig)' : ''}`}
                      className={`w-full px-4 py-2 border rounded-lg ${i === newQuestionCorrect ? 'border-green-500' : ''}`}
                    />
                  ))}
                  <select
                    value={newQuestionCorrect}
                    onChange={(e) => setNewQuestionCorrect(Number(e.target.value))}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {[0, 1, 2, 3].map(i => (
                      <option key={i} value={i}>Richtige Antwort: {i + 1}</option>
                    ))}
                  </select>
                  <button
                    onClick={submitQuestion}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
                  >
                    <Plus className="inline mr-2" size={18} />
                    Frage einreichen
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-lg">Eingereichte Fragen</h3>
                {submittedQuestions.map(q => {
                  const cat = CATEGORIES.find(c => c.id === q.category);
                  return (
                    <div key={q.id} className={`border rounded-lg p-4 ${q.approved ? 'bg-green-50 border-green-500' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`${cat.color} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                              {cat.name}
                            </span>
                            {q.approved && (
                              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                <Check size={14} className="mr-1" />
                                Genehmigt
                              </span>
                            )}
                          </div>
                          <p className="font-bold mb-2">{q.text}</p>
                          <ul className="text-sm space-y-1">
                            {q.answers.map((a, i) => (
                              <li key={i} className={i === q.correct ? 'text-green-600 font-medium' : ''}>
                                {i + 1}. {a}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-gray-500 mt-2">Von {q.submittedBy}</p>
                        </div>
                        {user.permissions.canApproveQuestions && !q.approved && (
                          <button
                            onClick={() => approveQuestion(q.id)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg ml-4"
                          >
                            <Check size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {submittedQuestions.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Noch keine Fragen eingereicht</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
