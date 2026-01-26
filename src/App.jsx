import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, MessageCircle, BookOpen, Bell, ClipboardList, Users, Plus, Send, Check, X, Upload, Download, Calendar, Award, Brain, Home, Target, TrendingUp, Zap, Star, Shield, Trash2, UserCog, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
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

// Ausbildungsrahmenplan gemäß §4 - Fachangestellte für Bäderbetriebe
// Zeitliche Richtwerte in Wochen pro Ausbildungsjahr
const AUSBILDUNGSRAHMENPLAN = [
  {
    nr: 1,
    bereich: 'Berufsbildung',
    paragraph: '§3 Nr. 1',
    icon: '📚',
    color: 'bg-blue-500',
    wochen: { jahr1: 0, jahr2: 0, jahr3: 0 }, // während der gesamten Ausbildung
    gesamtWochen: 0, // wird laufend vermittelt
    inhalte: [
      'Bedeutung des Ausbildungsvertrages, insbesondere Abschluss, Dauer und Beendigung, erklären',
      'Gegenseitige Rechte und Pflichten aus dem Ausbildungsvertrag nennen',
      'Möglichkeiten der beruflichen Fortbildung nennen'
    ]
  },
  {
    nr: 2,
    bereich: 'Aufbau und Organisation des Ausbildungsbetriebes',
    paragraph: '§3 Nr. 2',
    icon: '🏢',
    color: 'bg-indigo-500',
    wochen: { jahr1: 0, jahr2: 0, jahr3: 0 },
    gesamtWochen: 0,
    inhalte: [
      'Struktur und Aufgaben von Freizeit- und Badebetrieben beschreiben',
      'Rechtsform, Aufbau und Ablauforganisation des ausbildenden Betriebes erläutern',
      'Beziehungen des ausbildenden Betriebes zu Wirtschaftsorganisationen, Fachverbänden, Berufsvertretungen, Gewerkschaften und Verwaltungen nennen',
      'Grundlagen, Aufgaben und Arbeitsweise der betriebsverfassungs- oder personalvertretungsrechtlichen Organe beschreiben'
    ]
  },
  {
    nr: 3,
    bereich: 'Arbeits- und Tarifrecht, Arbeitsschutz',
    paragraph: '§3 Nr. 3',
    icon: '⚖️',
    color: 'bg-green-500',
    wochen: { jahr1: 0, jahr2: 0, jahr3: 0 },
    gesamtWochen: 0,
    inhalte: [
      'Über Bedeutung und Inhalt von Arbeitsverträgen Auskunft geben',
      'Bestimmungen der für den ausbildenden Betrieb geltenden Tarifverträge nennen',
      'Aufgaben des betrieblichen Arbeitsschutzes, der zuständigen Unfallversicherung und der Gewerbeaufsicht erläutern',
      'Bestimmungen der für den ausbildenden Betrieb geltenden Arbeitsschutzgesetze anwenden',
      'Bestandteile der Sozialversicherung sowie Träger und Beitragssysteme aufzeigen'
    ]
  },
  {
    nr: 4,
    bereich: 'Arbeitssicherheit, Umweltschutz und rationelle Energieverwendung',
    paragraph: '§3 Nr. 4',
    icon: '🛡️',
    color: 'bg-yellow-500',
    wochen: { jahr1: 0, jahr2: 0, jahr3: 0 },
    gesamtWochen: 0,
    inhalte: [
      'Berufsbezogene Vorschriften der Träger der gesetzlichen Unfallversicherung beachten',
      'Arbeitssicherheitsvorschriften bei den Arbeitsabläufen anwenden',
      'Geeignete Maßnahmen zur Verhütung von Unfällen im eigenen Arbeitsbereich ergreifen',
      'Verhaltensregeln für den Brandfall nennen und Maßnahmen zur Brandbekämpfung ergreifen',
      'Gefahren, die von Giften, Gasen, Dämpfen, leicht entzündlichen Stoffen sowie vom elektrischen Strom ausgehen, beachten',
      'Berufsspezifische Bestimmungen zu Gefahrstoffen und -gütern anwenden',
      'Vorschriften zum Schutz der Gesundheit am Arbeitsplatz anwenden',
      'Zur Vermeidung betriebsbedingter Umweltbelastungen nach ökologischen Gesichtspunkten beitragen',
      'Maßnahmen zur Entsorgung von Abfällen unter Beachtung betrieblicher Sicherheitsbestimmungen ergreifen',
      'Zur rationellen Energie- und Materialverwendung im beruflichen Beobachtungs- und Einwirkungsbereich beitragen'
    ]
  },
  {
    nr: 5,
    bereich: 'Aufrechterhaltung der Betriebssicherheit',
    paragraph: '§3 Nr. 5',
    icon: '🔧',
    color: 'bg-purple-500',
    wochen: { jahr1: 12, jahr2: 6, jahr3: 6 },
    gesamtWochen: 24,
    inhalte: [
      'Rechtsvorschriften und betriebliche Bestimmungen, die für den Betrieb des Bades gelten, anwenden',
      'Rechtsvorschriften und betriebliche Grundsätze der Hygiene anwenden',
      'Mittel, Geräte und Verfahren zur Reinigung und Desinfektion anwenden und deren Auswahl begründen',
      'Bei der Organisation von Betriebsabläufen des Badebetriebes mitwirken',
      'Bei der Kontrolle und Beaufsichtigung im Rahmen der Verkehrssicherungspflicht mitwirken'
    ]
  },
  {
    nr: 6,
    bereich: 'Beaufsichtigung des Badebetriebes',
    paragraph: '§3 Nr. 6',
    icon: '👀',
    color: 'bg-cyan-500',
    wochen: { jahr1: 4, jahr2: 6, jahr3: 8 },
    gesamtWochen: 18,
    inhalte: [
      'Gefahren des Badebetriebes in und an Naturgewässern erläutern',
      'Rechtsnormen, Verwaltungsvorschriften, Betriebs- und Dienstanweisungen zur Aufsicht im Badebetrieb sowie die Badeordnung anwenden',
      'Beaufsichtigung im Badebetrieb, insbesondere im Beckenbereich, durchführen',
      'Bei der Planung und Organisation des Aufsichtsdienstes mitwirken',
      'Bedrohliche Situationen im Badebetrieb feststellen und Sofortmaßnahmen einleiten'
    ]
  },
  {
    nr: 7,
    bereich: 'Betreuen von Besuchern',
    paragraph: '§3 Nr. 7',
    icon: '🤝',
    color: 'bg-pink-500',
    wochen: { jahr1: 4, jahr2: 6, jahr3: 4 },
    gesamtWochen: 14,
    inhalte: [
      'Besucher empfangen und informieren',
      'Konfliktfelder beschreiben und Möglichkeiten zur Konfliktregelung anwenden',
      'Über notwendige Hygienemaßnahmen beraten',
      'Besucherwünsche ermitteln und entsprechende Spiel- und Sportarrangements anbieten',
      'Besucher betreuen',
      'Kommunikationsregeln in verschiedenen beruflichen Situationen anwenden und zur Vermeidung von Kommunikationsstörungen beitragen'
    ]
  },
  {
    nr: 8,
    bereich: 'Schwimmen',
    paragraph: '§3 Nr. 8',
    icon: '🏊',
    color: 'bg-blue-600',
    wochen: { jahr1: 7, jahr2: 7, jahr3: 6 },
    gesamtWochen: 20,
    inhalte: [
      'Wettkampftechniken einschließlich Start- und Wendetechniken anwenden',
      'Techniken des Strecken- und Tieftauchens anwenden',
      'Einfachsprünge ausführen',
      'Theoretischen und praktischen Schwimmunterricht für Anfänger durchführen',
      'Schwimmunterricht für Fortgeschrittene durchführen',
      'Spring- und Tauchunterricht für Anfänger durchführen'
    ]
  },
  {
    nr: 9,
    bereich: 'Einleitung und Ausüben von Wasserrettungsmaßnahmen',
    paragraph: '§3 Nr. 9',
    icon: '🚨',
    color: 'bg-red-500',
    wochen: { jahr1: 6, jahr2: 7, jahr3: 7 },
    gesamtWochen: 20,
    inhalte: [
      'Rettungsmaßnahmen, insbesondere unter Anwendung der Methoden des Rettungsschwimmens, durchführen',
      'Rettungssituationen erläutern und entsprechende Rettungsmaßnahmen ableiten',
      'Rettungsgeräte für Wasserrettungsmaßnahmen warten und einsetzen'
    ]
  },
  {
    nr: 10,
    bereich: 'Durchführen von Erster Hilfe und Wiederbelebungsmaßnahmen',
    paragraph: '§3 Nr. 10',
    icon: '🚑',
    color: 'bg-red-600',
    wochen: { jahr1: 4, jahr2: 2, jahr3: 2 },
    gesamtWochen: 8,
    inhalte: [
      'Aufgaben eines Ersthelfers nach den Unfallverhütungsvorschriften des Trägers der gesetzlichen Unfallversicherung ausüben',
      'Herz-Lungen-Wiederbelebungsmaßnahmen an Personen unterschiedlicher Altersgruppen durchführen',
      'Unfallbeteiligte betreuen',
      'Herz-Lungen-Wiederbelebung mit einfachem Gerät, insbesondere Beutel- und Balgbeatmer, durchführen',
      'Verletzten mit und ohne Gerät transportieren'
    ]
  },
  {
    nr: 11,
    bereich: 'Messen physikalischer und chemischer Größen sowie Bestimmen von Stoffkonstanten',
    paragraph: '§3 Nr. 11',
    icon: '🔬',
    color: 'bg-purple-600',
    wochen: { jahr1: 2, jahr2: 0, jahr3: 3 },
    gesamtWochen: 5,
    inhalte: [
      'Länge, Masse, Volumen, Temperatur und Druck messen',
      'Die Bedeutung von Schmelzpunkt, Siedepunkt und Dichte erläutern',
      'pH-Wert und Hygienehilfsparameter bestimmen',
      'Proben unter betrieblichen Bedingungen entnehmen',
      'Messgeräte zur Überwachung der Wasserqualität handhaben und pflegen'
    ]
  },
  {
    nr: 12,
    bereich: 'Kontrollieren und Sichern des technischen Betriebsablaufs',
    paragraph: '§3 Nr. 12',
    icon: '⚙️',
    color: 'bg-gray-600',
    wochen: { jahr1: 7, jahr2: 8, jahr3: 9 },
    gesamtWochen: 24,
    inhalte: [
      'Betriebsabläufe durch regelmäßige Kontrolle der bädertechnischen Anlagen und der Betriebszustände sichern',
      'Arbeits- und Bäderhygiene kontrollieren und sichern',
      'Betriebsdaten von Steuer-, Regel- und Sicherheitseinrichtungen prüfen und dokumentieren',
      'Notfallpläne zur Bewältigung häufiger Störungen anwenden',
      'Prozessabläufe technischer Anlagen, insbesondere zur Schwimm- und Badebeckenwasseraufbereitung, steuern'
    ]
  },
  {
    nr: 13,
    bereich: 'Pflegen und Warten bäder- und freizeittechnischer Einrichtungen',
    paragraph: '§3 Nr. 13',
    icon: '🔩',
    color: 'bg-orange-500',
    wochen: { jahr1: 4, jahr2: 4, jahr3: 4 },
    gesamtWochen: 12,
    inhalte: [
      'Werkstoffe nach Eigenschaften und Einsatzmöglichkeiten beurteilen',
      'Arbeitsgerät, Werkzeuge und Werkstücke einsetzen',
      'Einfache Schlauch- und Rohrverbindungen zusammenfügen und lösen',
      'Aufbau, Einsatz und Wirkungsweise von Armaturen, Filtern und Aggregaten beschreiben',
      'Dichtungen erneuern und Filtereinsätze auswechseln',
      'Technische Anlagen, Geräte und Werkzeuge pflegen und warten',
      'Innen- und Außenanlagen pflegen und warten'
    ]
  },
  {
    nr: 14,
    bereich: 'Durchführung von Verwaltungsarbeiten im Bad',
    paragraph: '§3 Nr. 14',
    icon: '📝',
    color: 'bg-teal-500',
    wochen: { jahr1: 0, jahr2: 4, jahr3: 2 },
    gesamtWochen: 6,
    inhalte: [
      'Ablauforganisation der Verwaltungsarbeiten im Bad beschreiben',
      'Kassensysteme unterscheiden und Kassenabrechnungen erstellen',
      'Einfache Buchungen durchführen',
      'Schriftverkehr erledigen',
      'Vorschriften zum Datenschutz anwenden',
      'Informations- und Kommunikationssysteme aufgabenorientiert einsetzen',
      'Ausgewählte Vorschriften des Vertrags- und Haftungsrechts anwenden',
      'Zahlungsverkehr abwickeln'
    ]
  },
  {
    nr: 15,
    bereich: 'Öffentlichkeitsarbeit',
    paragraph: '§3 Nr. 15',
    icon: '📢',
    color: 'bg-rose-500',
    wochen: { jahr1: 2, jahr2: 2, jahr3: 2 },
    gesamtWochen: 6,
    inhalte: [
      'Inhalte und Zielstellung öffentlichkeitswirksamer Maßnahmen darstellen',
      'Einfache Texte und Werbeträger gestalten',
      'Bei Planung und Organisation von Werbemaßnahmen mitwirken',
      'Werbemaßnahmen durchführen'
    ]
  }
];

// Gesamtzahl der Ausbildungswochen pro Jahr (ca. 52 Wochen - Urlaub - Berufsschule ≈ 40 Wochen betrieblich)
const WOCHEN_PRO_JAHR = 40;

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

// Fragen-Format:
// - correct: number = Single-Choice (Index der richtigen Antwort)
// - correct: number[] = Multi-Select (Array der richtigen Indizes) - multi: true muss gesetzt sein
const SAMPLE_QUESTIONS = {
  // ===== BÄDERORGANISATION (Badebetrieb) =====
  org: [
    { q: 'Was ist ein Hausrecht?', a: ['Recht des Badbetreibers, Hausordnung durchzusetzen', 'Recht auf ein Haus', 'Baurecht', 'Mietrecht'], correct: 0 },
    { q: 'Wie lange muss eine Aufsichtsperson im Bad sein?', a: ['Während der Öffnungszeiten', 'Nur morgens', 'Nur abends', 'Keine Pflicht'], correct: 0 },
    { q: 'Was regelt die Badeordnung?', a: ['Verhalten der Badegäste', 'Wassertemperatur', 'Eintrittspreise', 'Öffnungszeiten'], correct: 0 },
    // Dienstplanerstellung
    { q: 'Welcher Aspekt muss bei der Erstellung von Dienstplänen berücksichtigt werden?', a: ['Urlaubszeiten der Mitarbeiter', 'Lieblingsfarbe der Gäste', 'Wetter der nächsten Woche', 'Aktienkurse'], correct: 0 },
    { q: 'Was gehört NICHT zu den Umständen bei der Dienstplanerstellung? (Mehrere richtig)', a: ['Qualifikation der Mitarbeiter', 'Besucherzahlen/Stoßzeiten', 'Private Hobbys der Gäste', 'Gesetzliche Ruhezeiten'], correct: 2 },
    { q: 'Welche 5 Aspekte müssen bei der Dienstplanerstellung berücksichtigt werden? (Mehrere richtig)', a: ['Qualifikation/Rettungsfähigkeit', 'Gesetzliche Arbeitszeiten', 'Urlaubsansprüche', 'Stoßzeiten/Besucherzahlen'], correct: [0, 1, 2, 3], multi: true },
    // Schulschwimmen
    { q: 'Welche Auswirkung hat die Schließung eines Schwimmbads auf das Schulschwimmen?', a: ['Längere Anfahrtswege für Schulen', 'Mehr Parkplätze', 'Günstigere Eintrittspreise', 'Weniger Hausaufgaben'], correct: 0 },
    { q: 'Nach welchem Kriterium werden Schwimmzeiten für Schulen verteilt?', a: ['Entfernung zum Bad und Schülerzahl', 'Alphabetische Reihenfolge', 'Wer zuerst kommt', 'Losverfahren'], correct: 0 },
    // Standortwahl Schwimmbad
    { q: 'Welches Kriterium ist bei der Standortwahl für ein neues Schwimmbad wichtig?', a: ['Gute Verkehrsanbindung', 'Nähe zu Flughäfen', 'Hohe Kriminalitätsrate', 'Viele Industriegebiete'], correct: 0 },
    { q: 'Welche Kriterien sind für die Standortwahl eines Schwimmbads relevant? (Mehrere richtig)', a: ['Einzugsgebiet/Bevölkerungsdichte', 'ÖPNV-Anbindung', 'Parkplatzsituation', 'Anzahl der Bäckereien'], correct: [0, 1, 2], multi: true },
    // Wasseraufsicht DGfdB R 94.05
    { q: 'Welche Anforderung gilt für Personen der Wasseraufsicht nach DGfdB R 94.05?', a: ['Rettungsfähigkeit nachgewiesen', 'Mindestens 2m groß', 'Unter 25 Jahre alt', 'Schwimmabzeichen Seepferdchen'], correct: 0 },
    { q: 'Welche Anforderungen gelten für die Wasseraufsicht? (Mehrere richtig)', a: ['Gültiger Rettungsschwimmnachweis', 'Erste-Hilfe-Ausbildung', 'Regelmäßige Fortbildung', 'Führerschein Klasse B'], correct: [0, 1, 2], multi: true },
    // Großrutschen Sicherheit
    { q: 'Welche Sicherheitsmaßnahme gilt beim Betrieb von Großrutschen?', a: ['Ampelanlage zur Startfreigabe', 'Keine Aufsicht nötig', 'Unbegrenzte Personenzahl', 'Rutschen ohne Wasser'], correct: 0 },
    { q: 'Welche Sicherheitsmaßnahmen gelten bei Großrutschen? (Mehrere richtig)', a: ['Startfreigabe-System (Ampel)', 'Auslaufbecken mit Aufsicht', 'Mindestabstand zwischen Nutzern', 'Altersfreigabe ab 3 Jahren'], correct: [0, 1, 2], multi: true },
    // Sprunganlagen Kontrollen
    { q: 'Was muss regelmäßig an Sprunganlagen kontrolliert werden?', a: ['Trittsicherheit der Oberflächen', 'Farbe der Bretter', 'Anzahl der Zuschauer', 'Wassertemperatur im Becken'], correct: 0 },
    { q: 'Welche Kontrollen sind an Sprunganlagen durchzuführen? (Mehrere richtig)', a: ['Standfestigkeit/Verankerung', 'Rutschfestigkeit der Beläge', 'Wassertiefe im Sprungbereich', 'Geländer und Handläufe'], correct: [0, 1, 2, 3], multi: true },
    // Wellenbecken Sicherheit
    { q: 'Welche Sicherheitsmaßnahme ist beim Wellenbecken wichtig?', a: ['Durchsage vor Wellenbetrieb', 'Wellen ohne Vorwarnung', 'Keine Aufsicht im Tiefbereich', 'Schwimmhilfen verboten'], correct: 0 },
    // Betriebstagebuch
    { q: 'Was wird im Betriebstagebuch zur Wasseraufbereitung eingetragen?', a: ['Chlorwerte und pH-Wert', 'Namen der Badegäste', 'Wettervorhersage', 'Fernsehprogramm'], correct: 0 },
    { q: 'Welche Einträge gehören ins Betriebstagebuch? (Mehrere richtig)', a: ['Hygiene-Hilfsparameter (Chlor, pH, Redox)', 'Filterspülungen', 'Chemikalienverbrauch', 'Störungen/Reparaturen'], correct: [0, 1, 2, 3], multi: true },
    // Angebote & Zielgruppen
    { q: 'Welches Angebot passt zur Zielgruppe "Senioren"?', a: ['Wassergymnastik', 'Techno-Schwimmparty', 'Wildwasser-Rafting', 'Turmspringen'], correct: 0 },
    { q: 'Ordne Angebote zu Zielgruppen: Welche passen zusammen? (Mehrere richtig)', a: ['Babyschwimmen - Eltern mit Kleinkindern', 'Aqua-Fitness - Erwachsene', 'Schwimmkurse - Anfänger', 'Nachtbaden - Familien mit Babys'], correct: [0, 1, 2], multi: true },
    // Animationsplanung
    { q: 'Was muss bei der Planung eines Animationsangebots berücksichtigt werden?', a: ['Zielgruppe und Teilnehmerzahl', 'Aktienkurse', 'Mondphasen', 'Politische Lage'], correct: 0 },
    // Marketing-Regelkreis
    { q: 'Was gehört zum Marketing-Regelkreis?', a: ['Analyse - Planung - Durchführung - Kontrolle', 'Kochen - Essen - Schlafen - Aufwachen', 'Einkaufen - Verkaufen - Sparen - Ausgeben', 'Laufen - Springen - Schwimmen - Fliegen'], correct: 0 },
    // Marketing-Mix
    { q: 'Was beschreibt der Marketing-Mix?', a: ['Kombination der 4 Ps: Product, Price, Place, Promotion', 'Mischung verschiedener Getränke', 'Musikprogramm im Bad', 'Zusammenstellung des Personals'], correct: 0 },
    // Einwintern
    { q: 'Was versteht man unter "Einwintern" eines Freibads?', a: ['Maßnahmen zum Schutz vor Frostschäden', 'Öffnung im Winter', 'Heizen des Beckens', 'Winterbaden anbieten'], correct: 0 },
    { q: 'Welche Maßnahmen gehören zur Einwinterung eines Freibad-Sportbeckens? (Mehrere richtig)', a: ['Wasserstand absenken', 'Leitungen entleeren', 'Abdeckung anbringen', 'Wasser auf 40°C heizen'], correct: [0, 1, 2], multi: true },
    // Kassensystem
    { q: 'Was spricht für ein Computer-Kassensystem?', a: ['Automatische Umsatzerfassung', 'Mehr Personalaufwand', 'Langsamere Abfertigung', 'Höhere Fehlerquote'], correct: 0 },
    // Kassentagesabrechnung
    { q: 'Was muss auf einer Kassentagesabrechnung stehen?', a: ['Datum und Gesamtumsatz', 'Lieblingsspeise des Kassierers', 'Wetterbericht', 'Fernsehprogramm'], correct: 0 },
    // Public Relations
    { q: 'Was fällt unter "Public Relations"?', a: ['Zeitungsartikel über das Schwimmbad', 'Gutscheine verkaufen', 'Eintrittspreise erhöhen', 'Personal entlassen'], correct: 0 },
    // Preisdifferenzierung
    { q: 'Was ist eine "Happy Hour" im Schwimmbad?', a: ['Zeitliche Preisdifferenzierung', 'Örtliche Preisdifferenzierung', 'Preisdifferenzierung nach Zielgruppen', 'Quantitative Preisdifferenzierung'], correct: 0 }
  ],

  // ===== BÄDERTECHNIK =====
  tech: [
    { q: 'Was ist der pH-Wert von neutralem Wasser?', a: ['7', '5', '9', '11'], correct: 0 },
    { q: 'Welche Temperatur hat ein Sportbecken normalerweise?', a: ['26-28°C', '20-22°C', '30-32°C', '35-37°C'], correct: 0 },
    { q: 'Was macht eine Umwälzpumpe?', a: ['Pumpt Wasser durch Filter', 'Heizt das Wasser', 'Misst den pH-Wert', 'Chloriert das Wasser'], correct: 0 },
    // Chlor/Desinfektion
    { q: 'Welchen Einfluss hat freies Chlor auf die Desinfektion?', a: ['Tötet Keime ab', 'Färbt das Wasser blau', 'Erhöht die Temperatur', 'Senkt den Wasserstand'], correct: 0 },
    { q: 'Was bedeutet ein zu niedriger freier Chlorwert (0,1 mg/L)?', a: ['Unzureichende Desinfektion', 'Optimale Wasserqualität', 'Zu viel Chlor', 'Perfekter Zustand'], correct: 0 },
    { q: 'Was bedeutet ein hoher gebundener Chlorwert (0,5 mg/L)?', a: ['Zu viele Verunreinigungen, die mit Chlor reagiert haben', 'Gute Wasserqualität', 'Zu wenig Badegäste', 'Optimale Desinfektion'], correct: 0 },
    { q: 'Was bedeutet ein zu niedriger pH-Wert (6,2)?', a: ['Wasser ist zu sauer, Chlorwirkung eingeschränkt', 'Wasser ist zu basisch', 'Optimaler Wert', 'Perfekt für Schwimmer'], correct: 0 },
    // Messfehler
    { q: 'Was kann zu Messfehlern beim photometrischen Verfahren führen?', a: ['Verschmutzte Küvetten', 'Zu sauberes Wasser', 'Zu viele Badegäste', 'Sonnenschein'], correct: 0 },
    { q: 'Welche Fehler können beim photometrischen Verfahren auftreten? (Mehrere richtig)', a: ['Verschmutzte Küvetten', 'Falsche Reagenzien', 'Abgelaufene Reagenzien', 'Zu kaltes Wasser'], correct: [0, 1, 2], multi: true },
    { q: 'Was kann zu Fehlern an der Messzelle führen?', a: ['Verschmutzte Elektroden', 'Zu viel Sonnenlicht', 'Zu viele Schwimmer', 'Falsche Beckengröße'], correct: 0 },
    // Ursachen Abweichung
    { q: 'Was kann eine Ursache für abweichende Wasserwerte sein (ohne Messfehler)?', a: ['Hohe Besucherzahlen', 'Zu wenig Personal', 'Falsche Kassenabrechnung', 'Schlechtes Wetter'], correct: 0 },
    { q: 'Welche Ursachen können zu abweichenden Wasserwerten führen? (Mehrere richtig)', a: ['Hohe Besucherzahl', 'Defekte Dosieranlage', 'Filterproblem', 'Zu wenig Umwälzung'], correct: [0, 1, 2, 3], multi: true },
    // Sorptionsfilter
    { q: 'Welche Aufgabe hat der Sorptionsfilter?', a: ['Entfernung von Ozonresten und organischen Stoffen', 'Wasser erwärmen', 'Chlor hinzufügen', 'pH-Wert erhöhen'], correct: 0 },
    { q: 'Welche Aufgaben hat der Sorptionsfilter? (Mehrere richtig)', a: ['Ozonabbau', 'Adsorption organischer Stoffe', 'Biologischer Abbau von Verunreinigungen', 'Wasser aufheizen'], correct: [0, 1, 2], multi: true },
    // Pumpen-Kenngrößen
    { q: 'Wofür steht U = 400 V bei einer Pumpe?', a: ['Spannung (Volt)', 'Umdrehungen', 'Umwälzrate', 'Uhrzeit'], correct: 0 },
    { q: 'Wofür steht Pzu bei einer Pumpe?', a: ['Zugeführte Leistung (kW)', 'Pumpenanzahl', 'Personenzahl', 'Prüfungszeit'], correct: 0 },
    { q: 'Wofür steht Q bei einer Pumpe?', a: ['Volumenstrom (m³/h)', 'Qualität', 'Quadratmeter', 'Querschnitt'], correct: 0 },
    { q: 'Was bedeutet η (Eta) bei einer Pumpe?', a: ['Wirkungsgrad (Verhältnis Nutz-/Aufwandleistung)', 'Wasserhärte', 'Temperatur', 'Chlorgehalt'], correct: 0 },
    // Flockung
    { q: 'Was ist eine Voraussetzung für funktionierende Flockung?', a: ['Richtige Dosierung des Flockungsmittels', 'Hohe Wassertemperatur', 'Viele Badegäste', 'Starke Beleuchtung'], correct: 0 },
    { q: 'Welche Voraussetzungen braucht eine funktionierende Flockung? (Mehrere richtig)', a: ['Richtige Flockungsmittel-Dosierung', 'Geeigneter pH-Wert', 'Ausreichende Reaktionszeit', 'Turbulente Vermischung'], correct: [0, 1, 2, 3], multi: true },
    // Teilchengrößen
    { q: 'Welche Kategorie von Teilchengrößen gibt es bei Wasserverschmutzung?', a: ['Gelöste Stoffe', 'Gefrorene Stoffe', 'Verdampfte Stoffe', 'Magnetische Stoffe'], correct: 0 },
    { q: 'Welche 3 Kategorien von Teilchengrößen gibt es? (Mehrere richtig)', a: ['Gelöste Stoffe', 'Kolloidale Stoffe', 'Suspendierte Stoffe', 'Radioaktive Stoffe'], correct: [0, 1, 2], multi: true },
    // Filtersysteme
    { q: 'Was ist ein Vorteil des Schnell-Schüttfilters?', a: ['Hohe Filterleistung bei großen Wassermengen', 'Sehr klein', 'Kein Strom nötig', 'Funktioniert ohne Wasser'], correct: 0 },
    { q: 'Was ist ein Vorteil des Anschwemmfilters?', a: ['Sehr feine Filtration möglich', 'Keine Wartung nötig', 'Extrem billig', 'Funktioniert mit Luft'], correct: 0 },
    { q: 'Was ist ein Vorteil des Ultrafilters?', a: ['Entfernt auch Bakterien und Viren', 'Keine Energie nötig', 'Wartungsfrei', 'Funktioniert bei Frost'], correct: 0 },
    // Klappenstellungen
    { q: 'Wie ist die Rohwasser-Klappe im Filterbetrieb?', a: ['Offen', 'Geschlossen', 'Halb offen', 'Gibt es nicht'], correct: 0 },
    { q: 'Wie ist die Spülwasser-Klappe im Filterbetrieb?', a: ['Geschlossen', 'Offen', 'Halb offen', 'Gibt es nicht'], correct: 0 },
    // Filter-Berechnungen
    { q: 'Was ist das Freibord bei einem Filter?', a: ['Abstand zwischen Filterbett-Oberkante und Behälter-Oberkante', 'Wassertiefe', 'Filterdicke', 'Rohrdurchmesser'], correct: 0 },
    { q: 'Was beschreibt die Filtergeschwindigkeit?', a: ['Wie schnell Wasser durch den Filter fließt (m/h)', 'Wie schnell der Filter rotiert', 'Wie schnell man den Filter wechselt', 'Umdrehungen pro Minute'], correct: 0 },
    // Ankreuzfragen Technik
    { q: 'Was versteht man unter "Fluidisierung" bei Filtern?', a: ['Auflockern des Filterbetts bei der Spülung', 'Ablassen des Wassers vor der Spülung', 'Besiedelung durch Algen', 'Verfestigung des Sandes'], correct: 0 },
    { q: 'Welche Aufgabe haben Phosphate in alkalischen Reinigern?', a: ['Binden von Kalk', 'Senken der Oberflächenspannung', 'Lösen von Fetten', 'Färben des Reinigers'], correct: 0 },
    { q: 'Welche Aufgabe haben Emulgatoren in Reinigern?', a: ['Bessere Löslichkeit von Fetten in Wasser', 'Senken der Oberflächenspannung', 'Binden von Kalk', 'Desinfizieren'], correct: 0 },
    { q: 'Welcher Reiniger sollte gegen Mineralablagerungen eingesetzt werden?', a: ['Saurer Reiniger', 'Alkalischer Reiniger', 'Neutraler Reiniger', 'Gar kein Reiniger'], correct: 0 },
    // Flockungsmittel-Berechnung
    { q: 'Ein Bad hat 180 m³/h Volumenstrom und 6,5 kg Flockungsmittelverbrauch in 48h. Wie hoch ist die Konzentration?', a: ['Ca. 0,75 g/m³', 'Ca. 7,5 g/m³', 'Ca. 75 g/m³', 'Ca. 0,075 g/m³'], correct: 0 }
  ],

  // ===== SCHWIMM- & RETTUNGSLEHRE =====
  swim: [
    { q: 'Was ist der Rautek-Griff?', a: ['Rettungsgriff zum Transport von Personen', 'Schwimmtechnik', 'Sprungfigur', 'Tauchübung'], correct: 0 },
    { q: 'Welches Abzeichen benötigt man für Rettungsschwimmer?', a: ['DLRG Bronze/Silber/Gold', 'Seepferdchen', 'Freischwimmer', 'Totenkopf'], correct: 0 },
    { q: 'Was ist ein Anlandbringen?', a: ['Retten einer Person ans Ufer', 'Sprungübung', 'Tauchgang', 'Schwimmstil'], correct: 0 },
    // Ertrinken
    { q: 'Was ist "trockenes Ertrinken"?', a: ['Stimmritzenkrampf verhindert Wassereintritt in die Lunge', 'Ertrinken ohne Wasser', 'Ertrinken in der Wüste', 'Ertrinken mit Schwimmweste'], correct: 0 },
    { q: 'Was passiert beim "nassen Ertrinken in Süßwasser"?', a: ['Wasser dringt in die Lunge, verdünnt das Blut (Hämolyse)', 'Wasser verdunstet sofort', 'Lunge bleibt trocken', 'Blut wird dicker'], correct: 0 },
    { q: 'Was ist "Beinahe-Ertrinken"?', a: ['Person überlebt mindestens 24 Stunden nach Submersion', 'Ertrinken in flachem Wasser', 'Fast ertrunken aber nie unter Wasser', 'Ertrinken im Traum'], correct: 0 },
    { q: 'Was ist der "Badetod"?', a: ['Plötzlicher Herztod im Wasser (z.B. durch Kälteschock)', 'Tod durch zu langes Baden', 'Tod durch Chlorallergie', 'Tod durch Sonnenbrand'], correct: 0 },
    // Wettkampf
    { q: 'Was muss in einer Wettkampf-Werbeanzeige stehen?', a: ['Datum, Ort und Veranstalter', 'Nur der Preis', 'Nur das Logo', 'Lieblingsspeise des Veranstalters'], correct: 0 },
    { q: 'Welche Informationen müssen in einer Wettkampf-Werbeanzeige stehen? (Mehrere richtig)', a: ['Datum und Uhrzeit', 'Veranstaltungsort', 'Veranstalter/Kontakt', 'Disziplinen/Altersklassen'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was ist ein Erkennungsmerkmal eines Wettkampfbeckens?', a: ['50m Länge und Wendewände', 'Nur 10m lang', 'Keine Bahnen', 'Wellenanlage'], correct: 0 },
    { q: 'Welche Merkmale hat ein Wettkampfbecken? (Mehrere richtig)', a: ['Normierte Länge (25m/50m)', 'Startblöcke', 'Wendewände', 'Zeitmessanlage'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was gehört zu den Aufgaben des Wettkampfgerichts?', a: ['Regelüberwachung und Disqualifikation', 'Getränke verkaufen', 'Becken reinigen', 'Tickets kontrollieren'], correct: 0 },
    { q: 'Was sind Aufgaben des Wettkampfgerichts? (Mehrere richtig)', a: ['Startüberwachung', 'Wende-Kontrolle', 'Zieleinlauf bewerten', 'Disqualifikationen aussprechen'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was ist eine organisatorische Aufgabe am Wettkampftag?', a: ['Zeitmessanlage aufbauen', 'Neue Fliesen verlegen', 'Wasser ablassen', 'Becken neu streichen'], correct: 0 },
    { q: 'Welche organisatorischen Aufgaben fallen am Wettkampftag an? (Mehrere richtig)', a: ['Startlisten erstellen', 'Zeitmessanlage prüfen', 'Sanitätsbereich einrichten', 'Siegerehrung vorbereiten'], correct: [0, 1, 2, 3], multi: true },
    // Disqualifikation Brustschwimmen
    { q: 'Was führt zur Disqualifikation beim Brustschwimmen?', a: ['Delfinbeinschlag (außer nach Start/Wende)', 'Zu schnelles Schwimmen', 'Zu langsames Schwimmen', 'Blaue Badekappe'], correct: 0 },
    { q: 'Welche Fehler führen zur Disqualifikation beim Brustschwimmen? (Mehrere richtig)', a: ['Delfinbeinschlag', 'Wechselschlag', 'Einarmiger Anschlag', 'Nicht gleichzeitiger Anschlag'], correct: [0, 1, 2, 3], multi: true },
    // Training
    { q: 'Was bedeutet "anaerob-laktazid"?', a: ['Energiegewinnung ohne Sauerstoff mit Laktatbildung', 'Mit Sauerstoff', 'Ohne Energie', 'Nur mit Fetten'], correct: 0 },
    { q: 'Was ist die Wiederholungsmethode im Training?', a: ['Intensive Belastung mit vollständiger Erholung', 'Dauerhaftes Schwimmen ohne Pause', 'Nur Dehnen', 'Kein Training'], correct: 0 },
    { q: 'Was ist die Intervallmethode?', a: ['Wechsel von Belastung und unvollständiger Erholung', 'Nur Pausen', 'Dauerlauf ohne Ende', 'Einmaliges Schwimmen'], correct: 0 },
    // Trainingsprinzipien
    { q: 'Was ist ein Trainingsprinzip?', a: ['Progressive Belastungssteigerung', 'Immer gleich trainieren', 'Nie trainieren', 'Nur am Wochenende'], correct: 0 },
    { q: 'Welche Trainingsprinzipien gibt es? (Mehrere richtig)', a: ['Progressive Belastungssteigerung', 'Regelmäßigkeit', 'Individualisierung', 'Variation'], correct: [0, 1, 2, 3], multi: true },
    // Methodische Hilfsmittel
    { q: 'Was ist ein methodisches Hilfsmittel im Schwimmunterricht?', a: ['Schwimmbrett', 'Handtuch', 'Sonnencreme', 'Badelatschen'], correct: 0 },
    { q: 'Welche methodischen Hilfsmittel gibt es? (Mehrere richtig)', a: ['Schwimmbrett', 'Pull-Buoy', 'Flossen', 'Paddles'], correct: [0, 1, 2, 3], multi: true }
  ],

  // ===== ERSTE HILFE =====
  first: [
    { q: 'Was ist die stabile Seitenlage?', a: ['Lagerung bewusstloser, atmender Personen', 'Schwimmposition', 'Erste-Hilfe-Tasche', 'Rettungsgriff'], correct: 0 },
    { q: 'Wie oft drückt man bei einer Herzdruckmassage pro Minute?', a: ['100-120 mal', '60 mal', '200 mal', '30 mal'], correct: 0 },
    { q: 'Was ist ein Defibrillator?', a: ['Gerät zur Herzrhythmus-Wiederherstellung', 'Beatmungsgerät', 'Blutdruckmesser', 'Thermometer'], correct: 0 },
    // Lagerungsarten
    { q: 'Wie wird eine Person mit Sonnenstich gelagert?', a: ['Oberkörper erhöht, Kopf kühlen', 'Flach auf dem Bauch', 'Kopfüber', 'In der Sonne'], correct: 0 },
    { q: 'Wie wird eine Person mit Herzinfarkt gelagert?', a: ['Oberkörper erhöht (Herz entlasten)', 'Kopfüber', 'Flach auf dem Bauch', 'Stehend'], correct: 0 },
    { q: 'Wie wird eine Person mit Hitzeerschöpfung gelagert?', a: ['Flach lagern, Beine hoch, kühlen', 'Oberkörper hoch', 'In der Sonne', 'Kopfüber'], correct: 0 },
    { q: 'Wie wird eine Person mit Volumenmangelschock gelagert?', a: ['Schocklage: Beine hoch', 'Oberkörper hoch', 'Sitzend', 'Kopfüber'], correct: 0 },
    { q: 'Wie wird eine Person mit Hitzschlag gelagert?', a: ['Flach lagern, schnell kühlen, Notruf!', 'In der Sonne lassen', 'Warm einpacken', 'Heißen Tee geben'], correct: 0 },
    { q: 'Wie wird eine Person mit Schlaganfall gelagert?', a: ['Oberkörper erhöht (30°), beengende Kleidung öffnen', 'Flach auf dem Bauch', 'Kopfüber', 'Stehend'], correct: 0 },
    // Verbandsbuch
    { q: 'Was muss im Verbandsbuch eingetragen werden?', a: ['Name des Verletzten und Art der Verletzung', 'Lieblingsspeise', 'Schuhgröße', 'Haarfarbe'], correct: 0 },
    { q: 'Welche Einträge gehören ins Verbandsbuch? (Mehrere richtig)', a: ['Datum und Uhrzeit', 'Name des Verletzten', 'Art der Verletzung', 'Durchgeführte Maßnahmen'], correct: [0, 1, 2, 3], multi: true },
    // Neuner-Regel
    { q: 'Was beschreibt die Neuner-Regel?', a: ['Einschätzung der verbrannten Körperoberfläche in %', 'Anzahl der Rettungsschwimmer', 'Chlor-Dosierung', 'Anzahl der Bahnen'], correct: 0 },
    { q: 'Wie viel % der Körperoberfläche macht ein Arm nach der Neuner-Regel aus?', a: ['9%', '18%', '27%', '36%'], correct: 0 },
    { q: 'Wie viel % der Körperoberfläche macht ein Bein nach der Neuner-Regel aus?', a: ['18%', '9%', '27%', '36%'], correct: 0 },
    // Reanimation Ankreuzfragen
    { q: 'Was ist die Funktion der Koronararterien?', a: ['Herzmuskelzellen mit sauerstoffreichem Blut versorgen', 'Herzmuskelzellen mit venösem Blut versorgen', 'Blut aus dem Herzen pumpen', 'Herzklappen steuern'], correct: 0 },
    { q: 'Was ist bei der Reanimation von Säuglingen FALSCH?', a: ['Kopf stark überstrecken', 'Harte Unterlage verwenden', '5 Initialbeatmungen', 'Puls an der Arminnenseite tasten'], correct: 0 },
    { q: 'Wie tief drückt man bei der Reanimation von Säuglingen?', a: ['Ca. 1/3 des Brustkorbs (4 cm)', '4-5 cm wie bei Erwachsenen', '0,5 cm', 'So tief wie möglich'], correct: 0 }
  ],

  // ===== HYGIENE =====
  hygiene: [
    { q: 'Warum muss vor dem Schwimmen geduscht werden?', a: ['Hygiene und Wasserqualität', 'Nur zur Gewohnheit', 'Weil es Spaß macht', 'Um warm zu werden'], correct: 0 },
    { q: 'Was ist eine Legionellenprüfung?', a: ['Kontrolle auf Bakterien im Wasser', 'Sicherheitscheck der Rutschen', 'Temperaturmessung', 'pH-Test'], correct: 0 },
    { q: 'Wie oft muss ein Schwimmbecken gereinigt werden?', a: ['Täglich', 'Wöchentlich', 'Monatlich', 'Jährlich'], correct: 0 },
    // Pseudomonas
    { q: 'Was ist richtig über Pseudomonas aeruginosa?', a: ['Bakterien, die Otitis externa (Ohrenentzündung) verursachen können', 'Viren im Beckenwasser', 'Harmlose Algen', 'Ein Reinigungsmittel'], correct: 0 },
    // Hautschichten
    { q: 'Welche Reihenfolge der Hautschichten von außen nach innen ist korrekt?', a: ['Oberhaut, Lederhaut, Unterhaut', 'Unterhaut, Aderhaut, Oberhaut', 'Unterhaut, Aderhaut, Hornhaut', 'Lederhaut, Oberhaut, Unterhaut'], correct: 0 }
  ],

  // ===== POLITIK & WIRTSCHAFT =====
  pol: [
    { q: 'Was regelt das Arbeitsrecht?', a: ['Beziehung Arbeitgeber-Arbeitnehmer', 'Nur Gehälter', 'Nur Urlaub', 'Nur Kündigung'], correct: 0 },
    { q: 'Was ist eine Berufsgenossenschaft?', a: ['Unfallversicherungsträger der gewerblichen Wirtschaft', 'Gewerkschaft', 'Arbeitgeberverband', 'Prüfungsamt'], correct: 0 },
    { q: 'Was bedeutet Tarifvertrag?', a: ['Vereinbarung über Arbeitsbedingungen zwischen Gewerkschaft und Arbeitgeber', 'Mietvertrag', 'Kaufvertrag', 'Versicherungsvertrag'], correct: 0 },
    // Grundgesetz Art. 1
    { q: 'Was besagt Artikel 1 des Grundgesetzes?', a: ['Die Würde des Menschen ist unantastbar', 'Jeder darf alles', 'Steuern müssen bezahlt werden', 'Autos haben Vorfahrt'], correct: 0 },
    // Bundestag/Bundesrat
    { q: 'Was ist eine wichtige Aufgabe des Bundestags?', a: ['Gesetze beschließen', 'Straßen bauen', 'Schulen leiten', 'Müll abholen'], correct: 0 },
    { q: 'Welche Aufgaben hat der Bundestag? (Mehrere richtig)', a: ['Gesetze beschließen', 'Bundeskanzler wählen', 'Regierung kontrollieren', 'Haushalt beschließen'], correct: [0, 1, 2, 3], multi: true },
    { q: 'Was ist eine wichtige Aufgabe des Bundesrats?', a: ['Mitwirkung bei der Gesetzgebung (Länderkammer)', 'Bundeskanzler wählen', 'Bundespräsident sein', 'Olympische Spiele organisieren'], correct: 0 },
    { q: 'Welche Aufgaben hat der Bundesrat? (Mehrere richtig)', a: ['Mitwirkung bei Bundesgesetzen', 'Vertretung der Länderinteressen', 'Zustimmung bei Verfassungsänderungen', 'Bundeskanzler wählen'], correct: [0, 1, 2], multi: true },
    // Bundespräsident
    { q: 'Wer ist (war) Bundespräsident? (Stand 2024)', a: ['Frank-Walter Steinmeier', 'Olaf Scholz', 'Angela Merkel', 'Robert Habeck'], correct: 0 },
    { q: 'Was ist eine Aufgabe des Bundespräsidenten?', a: ['Gesetze unterzeichnen und verkünden', 'Gesetze beschließen', 'Steuern erheben', 'Polizei leiten'], correct: 0 },
    // Bundesversammlung
    { q: 'Was ist die Aufgabe der Bundesversammlung?', a: ['Wahl des Bundespräsidenten', 'Wahl des Bundeskanzlers', 'Gesetze beschließen', 'Verträge unterschreiben'], correct: 0 },
    // Minister (Kabinett Scholz)
    { q: 'Wer war Finanzminister im Kabinett Scholz?', a: ['Christian Lindner (FDP)', 'Robert Habeck (Grüne)', 'Nancy Faeser (SPD)', 'Karl Lauterbach (SPD)'], correct: 0 },
    { q: 'Wer war Wirtschaftsminister im Kabinett Scholz?', a: ['Robert Habeck (Grüne)', 'Christian Lindner (FDP)', 'Nancy Faeser (SPD)', 'Annalena Baerbock (Grüne)'], correct: 0 },
    { q: 'Wer war Innenministerin im Kabinett Scholz?', a: ['Nancy Faeser (SPD)', 'Annalena Baerbock (Grüne)', 'Christian Lindner (FDP)', 'Robert Habeck (Grüne)'], correct: 0 },
    { q: 'Wer war Außenministerin im Kabinett Scholz?', a: ['Annalena Baerbock (Grüne)', 'Nancy Faeser (SPD)', 'Robert Habeck (Grüne)', 'Christine Lambrecht (SPD)'], correct: 0 },
    { q: 'Wer war Gesundheitsminister im Kabinett Scholz?', a: ['Karl Lauterbach (SPD)', 'Robert Habeck (Grüne)', 'Christian Lindner (FDP)', 'Nancy Faeser (SPD)'], correct: 0 },
    // Tarifvertragsarten
    { q: 'Was ist eine Tarifvertragsart?', a: ['Manteltarifvertrag (regelt allgemeine Arbeitsbedingungen)', 'Mietvertrag', 'Kaufvertrag', 'Handyvertrag'], correct: 0 },
    { q: 'Welche Tarifvertragsarten gibt es? (Mehrere richtig)', a: ['Manteltarifvertrag', 'Entgelttarifvertrag', 'Rahmentarifvertrag', 'Mietvertrag'], correct: [0, 1, 2], multi: true },
    // Tarifbegriffe
    { q: 'Was bedeutet Tarifautonomie?', a: ['Recht von Gewerkschaften und Arbeitgebern, Tarife selbst auszuhandeln', 'Automatische Lohnerhöhung', 'Staatliche Lohnfestsetzung', 'Verbot von Gewerkschaften'], correct: 0 },
    { q: 'Was bedeutet Unabdingbarkeit beim Tarifvertrag?', a: ['Tarifvertrag darf nicht zum Nachteil des Arbeitnehmers unterschritten werden', 'Kündigung ist unmöglich', 'Vertrag kann jederzeit geändert werden', 'Vertrag hat kein Ende'], correct: 0 },
    { q: 'Was bedeutet Allgemeinverbindlichkeit?', a: ['Tarifvertrag gilt für alle Arbeitnehmer einer Branche (auch Nicht-Gewerkschaftsmitglieder)', 'Gilt nur für Gewerkschaftsmitglieder', 'Gilt nur in Bayern', 'Gilt nur für Beamte'], correct: 0 },
    { q: 'Was bedeutet Friedenspflicht?', a: ['Während der Tariflaufzeit keine Streiks über tarifliche Themen', 'Kein Krieg in Deutschland', 'Friedliche Verhandlungen', 'Verbot von Demonstrationen'], correct: 0 },
    // Demokratische Wahlen
    { q: 'Was ist ein Grundsatz demokratischer Wahlen?', a: ['Geheim (niemand sieht, was man wählt)', 'Öffentlich (jeder sieht, was man wählt)', 'Nur für Männer', 'Nur für Reiche'], correct: 0 },
    { q: 'Welche 5 Grundsätze demokratischer Wahlen gibt es? (Mehrere richtig)', a: ['Allgemein', 'Unmittelbar', 'Frei', 'Gleich'], correct: [0, 1, 2, 3], multi: true },
    // Gesellschaftsformen
    { q: 'Welche Gesellschaftsform ist im Handelsregister eingetragen?', a: ['Gesellschaft mit beschränkter Haftung (GmbH)', 'Einzelunternehmen ohne Kaufmannseigenschaft', 'Verein', 'Stiftung'], correct: 0 },
    { q: 'Welche Gesellschaftsformen gibt es? (Mehrere richtig)', a: ['Gesellschaft mit beschränkter Haftung', 'Aktiengesellschaft', 'Offene Handelsgesellschaft', 'Kommanditgesellschaft'], correct: [0, 1, 2, 3], multi: true },
    // Sozialversicherungen
    { q: 'Welche Sozialversicherung gibt es?', a: ['Krankenversicherung', 'Autoversicherung', 'Handyversicherung', 'Reiseversicherung'], correct: 0 },
    { q: 'Welche 5 Sozialversicherungen gibt es? (Mehrere richtig)', a: ['Krankenversicherung', 'Rentenversicherung', 'Arbeitslosenversicherung', 'Pflegeversicherung'], correct: [0, 1, 2, 3], multi: true },
    // Geschäftsfähigkeit
    { q: 'Wer ist geschäftsunfähig?', a: ['Kinder unter 7 Jahren', 'Kinder unter 18 Jahren', 'Alle Minderjährigen', 'Niemand'], correct: 0 },
    { q: 'Wer ist beschränkt geschäftsfähig?', a: ['Minderjährige von 7-17 Jahren', 'Alle unter 21', 'Nur Kinder unter 7', 'Alle Erwachsenen'], correct: 0 },
    { q: 'Ab wann ist man voll geschäftsfähig?', a: ['Ab 18 Jahren', 'Ab 16 Jahren', 'Ab 21 Jahren', 'Ab 14 Jahren'], correct: 0 },
    // Umweltschutz
    { q: 'Was ist eine Umweltschutzmaßnahme im Schwimmbad?', a: ['Solaranlage für Warmwasser', 'Mehr Chlor verwenden', 'Längere Öffnungszeiten', 'Mehr Parkplätze bauen'], correct: 0 },
    { q: 'Welche Umweltschutzmaßnahmen gibt es im Schwimmbad? (Mehrere richtig)', a: ['Solarenergie nutzen', 'Wärmerückgewinnung', 'Regenwassernutzung', 'LED-Beleuchtung'], correct: [0, 1, 2, 3], multi: true },
    // Mutterschutz
    { q: 'Wie viele Wochen gilt das Beschäftigungsverbot nach der Entbindung?', a: ['8 Wochen', '2 Wochen', '6 Wochen', '10 Wochen'], correct: 0 }
  ],

  // ===== GESUNDHEITSLEHRE =====
  health: [
    { q: 'Wie viele Knochen hat der erwachsene Mensch?', a: ['206', '150', '300', '100'], correct: 0 },
    { q: 'Was ist das größte Organ des Menschen?', a: ['Die Haut', 'Die Leber', 'Das Herz', 'Die Lunge'], correct: 0 },
    { q: 'Wie viele Liter Blut pumpt das Herz pro Tag?', a: ['Ca. 7.000 Liter', 'Ca. 1.000 Liter', 'Ca. 500 Liter', 'Ca. 10.000 Liter'], correct: 0 },
    { q: 'Was transportiert das Blut im Körper?', a: ['Sauerstoff und Nährstoffe', 'Nur Wasser', 'Nur Hormone', 'Nur CO2'], correct: 0 },
    { q: 'Welches Organ filtert das Blut?', a: ['Die Nieren', 'Die Leber', 'Die Milz', 'Das Herz'], correct: 0 },
    { q: 'Wie viele Herzkammern hat das menschliche Herz?', a: ['4', '2', '3', '6'], correct: 0 },
    { q: 'Was ist die Funktion der Lunge?', a: ['Gasaustausch (O2/CO2)', 'Blutreinigung', 'Hormonproduktion', 'Verdauung'], correct: 0 },
    { q: 'Wo findet die Verdauung hauptsächlich statt?', a: ['Im Dünndarm', 'Im Magen', 'Im Dickdarm', 'In der Speiseröhre'], correct: 0 },
    // Verdauungssystem
    { q: 'Wo werden Eiweiße bei der Verdauung gespalten?', a: ['Im Magen und Dünndarm', 'Nur im Mund', 'Nur im Dickdarm', 'In der Lunge'], correct: 0 },
    { q: 'Wo werden Kohlenhydrate gespalten?', a: ['Im Mund (Speichel) und Dünndarm', 'Nur im Magen', 'Nur im Dickdarm', 'In der Leber'], correct: 0 },
    { q: 'Wo werden Verdauungssäfte hinzugefügt?', a: ['Magen, Bauchspeicheldrüse, Gallenblase', 'Nur im Mund', 'Nur im Dickdarm', 'Nur in der Lunge'], correct: 0 },
    { q: 'Wo wird bei der Verdauung Wasser entzogen?', a: ['Im Dickdarm', 'Im Magen', 'Im Mund', 'In der Speiseröhre'], correct: 0 },
    { q: 'Was gehört zum Verdauungssystem? (Mehrere richtig)', a: ['Speiseröhre', 'Magen', 'Dünndarm', 'Bauchspeicheldrüse'], correct: [0, 1, 2, 3], multi: true },
    // Blutkreislauf
    { q: 'Was folgt im Blutkreislauf auf den rechten Vorhof?', a: ['Rechte Herzkammer', 'Linke Herzkammer', 'Aorta', 'Lunge'], correct: 0 },
    { q: 'Wohin pumpt die rechte Herzkammer das Blut?', a: ['In die Lungenarterie zur Lunge', 'In den Körper', 'Ins Gehirn', 'In den Magen'], correct: 0 },
    { q: 'Welche Reihenfolge ist im Blutkreislauf korrekt?', a: ['Rechter Vorhof → Rechte Kammer → Lunge → Linker Vorhof', 'Linker Vorhof → Lunge → Rechter Vorhof', 'Aorta → Lunge → Herz', 'Lunge → Magen → Herz'], correct: 0 },
    // Herz-Reiz-Leitungssystem
    { q: 'Was ist die Funktion des Herz-Reiz-Leitungssystems?', a: ['Koordinierte elektrische Erregung für rhythmischen Herzschlag', 'Blut transportieren', 'Sauerstoff speichern', 'Hormone produzieren'], correct: 0 },
    { q: 'Wo beginnt die Erregung im Herz-Reiz-Leitungssystem?', a: ['Sinusknoten', 'AV-Knoten', 'His-Bündel', 'Purkinje-Fasern'], correct: 0 },
    { q: 'Wie ist die Reihenfolge im Herz-Reiz-Leitungssystem?', a: ['Sinusknoten → AV-Knoten → His-Bündel → Purkinje-Fasern', 'AV-Knoten → Sinusknoten → Purkinje-Fasern', 'His-Bündel → Sinusknoten → AV-Knoten', 'Purkinje-Fasern → His-Bündel → Sinusknoten'], correct: 0 }
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

// Avatar-Auswahl für Profil
const AVATARS = [
  // Schwimmen & Wassersport
  { id: 'swimmer', emoji: '🏊', label: 'Schwimmer' },
  { id: 'swimmer_m', emoji: '🏊‍♂️', label: 'Schwimmer' },
  { id: 'swimmer_f', emoji: '🏊‍♀️', label: 'Schwimmerin' },
  { id: 'waterpolo', emoji: '🤽', label: 'Wasserball' },
  { id: 'diver', emoji: '🤿', label: 'Taucher' },
  { id: 'surfer', emoji: '🏄', label: 'Surfer' },
  // Meeresbewohner
  { id: 'dolphin', emoji: '🐬', label: 'Delfin' },
  { id: 'whale', emoji: '🐳', label: 'Wal' },
  { id: 'shark', emoji: '🦈', label: 'Hai' },
  { id: 'octopus', emoji: '🐙', label: 'Oktopus' },
  { id: 'turtle', emoji: '🐢', label: 'Schildkröte' },
  { id: 'fish', emoji: '🐠', label: 'Tropenfisch' },
  { id: 'blowfish', emoji: '🐡', label: 'Kugelfisch' },
  { id: 'seal', emoji: '🦭', label: 'Robbe' },
  { id: 'crab', emoji: '🦀', label: 'Krabbe' },
  { id: 'lobster', emoji: '🦞', label: 'Hummer' },
  { id: 'shrimp', emoji: '🦐', label: 'Garnele' },
  { id: 'squid', emoji: '🦑', label: 'Tintenfisch' },
  { id: 'shell', emoji: '🐚', label: 'Muschel' },
  { id: 'coral', emoji: '🪸', label: 'Koralle' },
  // Strand & Wasser
  { id: 'wave', emoji: '🌊', label: 'Welle' },
  { id: 'beach', emoji: '🏖️', label: 'Strand' },
  { id: 'umbrella', emoji: '⛱️', label: 'Sonnenschirm' },
  { id: 'goggles', emoji: '🥽', label: 'Schwimmbrille' },
  { id: 'flamingo', emoji: '🦩', label: 'Flamingo' },
  { id: 'lifeguard', emoji: '🛟', label: 'Rettungsring' },
];

// Hilfsfunktion: Mischt Antworten und gibt neue Antwort-Array + korrekten Index/Indizes zurück
const shuffleAnswers = (question) => {
  const answers = [...question.a];

  // Multi-Select: correct ist ein Array von Indizes
  if (question.multi && Array.isArray(question.correct)) {
    const correctAnswers = question.correct.map(idx => answers[idx]);

    // Fisher-Yates shuffle
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    // Finde die neuen Indizes der korrekten Antworten
    const newCorrectIndices = correctAnswers.map(ans => answers.indexOf(ans));

    return { ...question, a: answers, correct: newCorrectIndices, multi: true };
  }

  // Single-Choice: correct ist ein einzelner Index
  const correctAnswer = answers[question.correct];

  // Fisher-Yates shuffle
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  // Finde den neuen Index der korrekten Antwort
  const newCorrectIndex = answers.indexOf(correctAnswer);

  return { ...question, a: answers, correct: newCorrectIndex };
};

// Digitale Unterschrift Canvas Komponente
const SignatureCanvas = ({ value, onChange, darkMode, label }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Canvas leeren und Hintergrund setzen
    ctx.fillStyle = darkMode ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Wenn ein Wert vorhanden ist, lade das Bild
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = darkMode ? '#1e293b' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, [value, darkMode]);

  const getCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }, [getCoordinates]);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = darkMode ? '#22d3ee' : '#0891b2';
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, getCoordinates, darkMode]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      onChange(canvas.toDataURL());
    }
  }, [isDrawing, onChange]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = darkMode ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} ✍️
      </label>
      <div className={`relative border-2 border-dashed rounded-lg ${darkMode ? 'border-slate-500 bg-slate-800' : 'border-gray-300 bg-white'}`}>
        <canvas
          ref={canvasRef}
          width={300}
          height={100}
          className="w-full h-24 rounded-lg cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!value && (
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="text-sm">Hier unterschreiben...</span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={clearSignature}
        className={`text-xs px-3 py-1 rounded ${darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
      >
        Löschen
      </button>
    </div>
  );
};

// ==================== SCHWIMMCHALLENGE SYSTEM ====================

const SWIM_STYLES = [
  { id: 'kraul', name: 'Kraul/Freistil', icon: '🏊' },
  { id: 'brust', name: 'Brustschwimmen', icon: '🏊‍♂️' },
  { id: 'ruecken', name: 'Rückenschwimmen', icon: '🔙' },
  { id: 'schmetterling', name: 'Schmetterling', icon: '🦋' },
  { id: 'lagen', name: 'Lagenschwimmen', icon: '🔄' },
];

const SWIM_CHALLENGES = [
  // Distanz-Challenges
  { id: 'kanal', name: 'Ärmelkanal', description: '34 km schwimmen - wie der echte Ärmelkanal!', type: 'distance', target: 34000, unit: 'm', icon: '🌊', points: 500, category: 'distanz' },
  { id: 'bodensee', name: 'Bodensee-Querung', description: '14 km Gesamtdistanz', type: 'distance', target: 14000, unit: 'm', icon: '🏔️', points: 250, category: 'distanz' },
  { id: '10k_club', name: '10km Club', description: '10 km Gesamtdistanz schwimmen', type: 'distance', target: 10000, unit: 'm', icon: '🎯', points: 150, category: 'distanz' },
  { id: 'marathon', name: 'Schwimm-Marathon', description: '42.195 m - die Marathon-Distanz im Wasser', type: 'distance', target: 42195, unit: 'm', icon: '🏅', points: 600, category: 'distanz' },

  // Sprint-Challenges
  { id: 'sprint_50', name: '50m Sprint', description: '50m unter 35 Sekunden', type: 'time', target: 35, distance: 50, unit: 's', icon: '⚡', points: 100, category: 'sprint' },
  { id: 'sprint_100', name: '100m Blitz', description: '100m unter 1:30 Minuten', type: 'time', target: 90, distance: 100, unit: 's', icon: '💨', points: 150, category: 'sprint' },
  { id: 'sprint_200', name: '200m Power', description: '200m unter 3:30 Minuten', type: 'time', target: 210, distance: 200, unit: 's', icon: '🔥', points: 200, category: 'sprint' },

  // Ausdauer-Challenges
  { id: 'nonstop_1000', name: '1000m Non-Stop', description: '1000m am Stück ohne Pause', type: 'single_distance', target: 1000, unit: 'm', icon: '💪', points: 120, category: 'ausdauer' },
  { id: 'nonstop_2000', name: '2000m Ausdauer', description: '2000m am Stück durchschwimmen', type: 'single_distance', target: 2000, unit: 'm', icon: '🦾', points: 200, category: 'ausdauer' },
  { id: '30min', name: '30 Minuten Non-Stop', description: '30 Minuten durchgehend schwimmen', type: 'duration', target: 30, unit: 'min', icon: '⏱️', points: 100, category: 'ausdauer' },
  { id: '60min', name: 'Stunden-Schwimmer', description: '60 Minuten am Stück schwimmen', type: 'duration', target: 60, unit: 'min', icon: '🕐', points: 180, category: 'ausdauer' },

  // Regelmäßigkeits-Challenges
  { id: 'streak_7', name: '7-Tage-Streak', description: '7 Tage hintereinander schwimmen', type: 'streak', target: 7, unit: 'Tage', icon: '📆', points: 100, category: 'regelmaessigkeit' },
  { id: 'streak_30', name: 'Monats-Streak', description: '30 Tage hintereinander schwimmen', type: 'streak', target: 30, unit: 'Tage', icon: '📅', points: 400, category: 'regelmaessigkeit' },
  { id: 'sessions_12', name: 'Fleißiger Schwimmer', description: '12 Trainingseinheiten im Monat', type: 'sessions', target: 12, unit: 'Einheiten', icon: '🗓️', points: 150, category: 'regelmaessigkeit' },

  // Technik-Challenges
  { id: 'alle_stile', name: 'Allrounder', description: 'Alle 4 Schwimmstile in einer Einheit', type: 'styles_single', target: 4, unit: 'Stile', icon: '🌟', points: 80, category: 'technik' },
  { id: 'lagen_400', name: 'Lagen-Meister', description: '400m Lagenschwimmen (100m pro Stil)', type: 'single_distance', target: 400, style: 'lagen', unit: 'm', icon: '🏆', points: 150, category: 'technik' },
];

const SWIM_LEVELS = [
  { level: 1, name: 'Bronze-Schwimmer', minPoints: 0, icon: '🥉', color: 'from-amber-600 to-amber-700' },
  { level: 2, name: 'Silber-Schwimmer', minPoints: 500, icon: '🥈', color: 'from-gray-400 to-gray-500' },
  { level: 3, name: 'Gold-Schwimmer', minPoints: 1500, icon: '🥇', color: 'from-yellow-400 to-yellow-500' },
  { level: 4, name: 'Platin-Schwimmer', minPoints: 3500, icon: '💎', color: 'from-cyan-400 to-blue-500' },
  { level: 5, name: 'Diamant-Schwimmer', minPoints: 7000, icon: '💠', color: 'from-purple-400 to-pink-500' },
  { level: 6, name: 'Legende', minPoints: 15000, icon: '👑', color: 'from-amber-400 to-red-500' },
];

const SWIM_BADGES = [
  { id: 'swim_first_km', name: 'Erster Kilometer', description: '1 km Gesamtdistanz erreicht', icon: '🏊', category: 'swim', requirement: { type: 'total_distance', value: 1000 } },
  { id: 'swim_five_km', name: '5km Meilenstein', description: '5 km Gesamtdistanz erreicht', icon: '🌊', category: 'swim', requirement: { type: 'total_distance', value: 5000 } },
  { id: 'swim_ten_km', name: '10km Club', description: '10 km Gesamtdistanz erreicht', icon: '🎯', category: 'swim', requirement: { type: 'total_distance', value: 10000 } },
  { id: 'swim_marathon', name: 'Marathon-Schwimmer', description: '42.195 km Gesamtdistanz', icon: '🏅', category: 'swim', requirement: { type: 'total_distance', value: 42195 } },
  { id: 'swim_first_session', name: 'Erste Bahnen', description: 'Erste Trainingseinheit abgeschlossen', icon: '🎉', category: 'swim', requirement: { type: 'sessions', value: 1 } },
  { id: 'swim_10_sessions', name: 'Regelmäßig dabei', description: '10 Trainingseinheiten absolviert', icon: '📅', category: 'swim', requirement: { type: 'sessions', value: 10 } },
  { id: 'swim_25_sessions', name: 'Ausdauernd', description: '25 Trainingseinheiten absolviert', icon: '💪', category: 'swim', requirement: { type: 'sessions', value: 25 } },
  { id: 'swim_50_sessions', name: 'Schwimm-Veteran', description: '50 Trainingseinheiten absolviert', icon: '🦈', category: 'swim', requirement: { type: 'sessions', value: 50 } },
  { id: 'swim_1h_training', name: 'Stunden-Schwimmer', description: '1 Stunde Gesamttrainingszeit', icon: '⏱️', category: 'swim', requirement: { type: 'total_time', value: 60 } },
  { id: 'swim_10h_training', name: 'Zehn-Stunden-Held', description: '10 Stunden Gesamttrainingszeit', icon: '⌛', category: 'swim', requirement: { type: 'total_time', value: 600 } },
  { id: 'swim_challenge_first', name: 'Herausforderer', description: 'Erste Challenge abgeschlossen', icon: '🎯', category: 'swim', requirement: { type: 'challenges_completed', value: 1 } },
  { id: 'swim_challenge_5', name: 'Challenge-Jäger', description: '5 Challenges abgeschlossen', icon: '🏆', category: 'swim', requirement: { type: 'challenges_completed', value: 5 } },
  { id: 'swim_challenge_master', name: 'Challenge-Meister', description: '10 Challenges abgeschlossen', icon: '👑', category: 'swim', requirement: { type: 'challenges_completed', value: 10 } },
  { id: 'swim_team_battle', name: 'Team-Kämpfer', description: 'Am Team-Battle teilgenommen', icon: '⚔️', category: 'swim', requirement: { type: 'team_battle_participation', value: 1 } },
];

// Alters-Handicap System (basierend auf sportwissenschaftlichen Daten)
const getAgeHandicap = (birthDate) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  const age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));

  if (age < 40) return 0;
  if (age < 50) return 0.05; // 5% Zeitbonus
  if (age < 60) return 0.10; // 10% Zeitbonus
  if (age < 70) return 0.15; // 15% Zeitbonus
  return 0.20; // 20% Zeitbonus
};

// Berechnet die gewertete Zeit mit Handicap
const calculateHandicappedTime = (actualTime, birthDate) => {
  const handicap = getAgeHandicap(birthDate);
  return actualTime * (1 - handicap);
};

// Punkte-Berechnung für Schwimm-Sessions
const calculateSwimPoints = (sessions, completedChallenges = []) => {
  // Nur bestätigte Sessions zählen
  const confirmedSessions = sessions.filter(s => s.confirmed);

  // Basis-Punkte: 1 Punkt pro 100m geschwommen
  const distancePoints = confirmedSessions.reduce((sum, s) => sum + Math.floor((s.distance || 0) / 100), 0);

  // Bonus-Punkte: 0.5 Punkte pro Minute Trainingszeit
  const timePoints = confirmedSessions.reduce((sum, s) => sum + Math.floor((s.time_minutes || 0) * 0.5), 0);

  // Challenge-Punkte
  const challengePoints = completedChallenges.reduce((sum, challengeId) => {
    const challenge = SWIM_CHALLENGES.find(c => c.id === challengeId);
    return sum + (challenge?.points || 0);
  }, 0);

  return {
    distancePoints,
    timePoints,
    challengePoints,
    total: distancePoints + timePoints + challengePoints
  };
};

// Berechnet den Challenge-Fortschritt basierend auf Sessions
const calculateChallengeProgress = (challenge, sessions, userId) => {
  const confirmedSessions = sessions.filter(s => s.confirmed && s.user_id === userId);

  switch (challenge.type) {
    case 'distance': {
      // Gesamtdistanz über alle Sessions
      const totalDistance = confirmedSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
      return { current: totalDistance, target: challenge.target, percent: Math.min(100, (totalDistance / challenge.target) * 100) };
    }
    case 'single_distance': {
      // Einzelne Session mit Mindestdistanz
      const qualifying = confirmedSessions.filter(s =>
        (s.distance || 0) >= challenge.target &&
        (!challenge.style || s.style === challenge.style)
      );
      return { current: qualifying.length > 0 ? challenge.target : 0, target: challenge.target, percent: qualifying.length > 0 ? 100 : 0 };
    }
    case 'duration': {
      // Einzelne Session mit Mindestdauer
      const qualifying = confirmedSessions.filter(s => (s.time_minutes || 0) >= challenge.target);
      return { current: qualifying.length > 0 ? challenge.target : 0, target: challenge.target, percent: qualifying.length > 0 ? 100 : 0 };
    }
    case 'sessions': {
      // Anzahl Sessions im aktuellen Monat
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthSessions = confirmedSessions.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      return { current: monthSessions.length, target: challenge.target, percent: Math.min(100, (monthSessions.length / challenge.target) * 100) };
    }
    case 'streak': {
      // Berechne längste Streak
      const dates = [...new Set(confirmedSessions.map(s => s.date))].sort();
      let maxStreak = 0, currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak, dates.length > 0 ? 1 : 0);
      return { current: maxStreak, target: challenge.target, percent: Math.min(100, (maxStreak / challenge.target) * 100) };
    }
    default:
      return { current: 0, target: challenge.target, percent: 0 };
  }
};

// Ermittelt das aktuelle Schwimm-Level basierend auf Punkten
const getSwimLevel = (points) => {
  for (let i = SWIM_LEVELS.length - 1; i >= 0; i--) {
    if (points >= SWIM_LEVELS[i].minPoints) {
      return {
        ...SWIM_LEVELS[i],
        nextLevel: SWIM_LEVELS[i + 1] || null,
        pointsToNext: SWIM_LEVELS[i + 1] ? SWIM_LEVELS[i + 1].minPoints - points : 0
      };
    }
  }
  return { ...SWIM_LEVELS[0], nextLevel: SWIM_LEVELS[1], pointsToNext: SWIM_LEVELS[1].minPoints };
};

// Berechnet Team-Battle Statistiken (Azubis vs Trainer/Ausbilder)
const calculateTeamBattleStats = (sessions) => {
  const confirmedSessions = sessions.filter(s => s.confirmed);

  // Gruppiere nach Team und User
  const teams = {
    azubis: { points: 0, distance: 0, time: 0, members: {} },
    trainer: { points: 0, distance: 0, time: 0, members: {} }
  };

  confirmedSessions.forEach(session => {
    const isAzubi = session.user_role === 'azubi';
    const team = isAzubi ? teams.azubis : teams.trainer;
    const oderId = session.user_id;

    // Initialisiere Member wenn nötig
    if (!team.members[oderId]) {
      team.members[oderId] = {
        user_id: session.user_id,
        user_name: session.user_name,
        distance: 0,
        time: 0,
        sessions: 0,
        points: 0
      };
    }

    const distance = session.distance || 0;
    const time = session.time_minutes || 0;

    // Punkte: 1 pro 100m + 0.5 pro Minute
    const sessionPoints = Math.floor(distance / 100) + Math.floor(time * 0.5);

    team.members[oderId].distance += distance;
    team.members[oderId].time += time;
    team.members[oderId].sessions += 1;
    team.members[oderId].points += sessionPoints;

    team.distance += distance;
    team.time += time;
    team.points += sessionPoints;
  });

  // Konvertiere members zu Arrays und sortiere nach Punkten
  teams.azubis.memberList = Object.values(teams.azubis.members).sort((a, b) => b.points - a.points);
  teams.trainer.memberList = Object.values(teams.trainer.members).sort((a, b) => b.points - a.points);

  // Berechne Prozentsätze
  const totalPoints = teams.azubis.points + teams.trainer.points;
  teams.azubis.percent = totalPoints > 0 ? (teams.azubis.points / totalPoints) * 100 : 50;
  teams.trainer.percent = totalPoints > 0 ? (teams.trainer.points / totalPoints) * 100 : 50;

  return teams;
};

export default function BaederApp() {
  const [currentView, setCurrentView] = useState('home');
  const [authView, setAuthView] = useState('login'); // login, register, impressum, datenschutz
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
  const [categoryRound, setCategoryRound] = useState(0); // 0-3 (4 Kategorien)
  const [questionInCategory, setQuestionInCategory] = useState(0); // 0-4 (5 Fragen pro Kategorie)
  const [quizCategory, setQuizCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentCategoryQuestions, setCurrentCategoryQuestions] = useState([]); // 5 Fragen für aktuelle Kategorie
  const [answered, setAnswered] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false); // Warte auf anderen Spieler
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Für Multi-Select Fragen
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState(null); // Für Single-Choice Feedback
  
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
  const [examSelectedAnswers, setExamSelectedAnswers] = useState([]); // Für Multi-Select im Prüfungssimulator
  const [examSelectedAnswer, setExamSelectedAnswer] = useState(null); // Für Single-Choice Feedback
  
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [devMode, setDevMode] = useState(false);
  
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

  // Spaced Repetition State
  const [spacedRepetitionData, setSpacedRepetitionData] = useState(() => {
    const saved = localStorage.getItem('spaced_repetition_data');
    return saved ? JSON.parse(saved) : {};
  });
  const [spacedRepetitionMode, setSpacedRepetitionMode] = useState(false);
  const [dueCards, setDueCards] = useState([]);

  // Daily Challenges State
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [dailyChallengeProgress, setDailyChallengeProgress] = useState(() => {
    const saved = localStorage.getItem('daily_challenge_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if it's from today
      const today = new Date().toDateString();
      if (parsed.date === today) {
        return parsed;
      }
    }
    return { date: new Date().toDateString(), completed: [], stats: {} };
  });

  // Kontrollkarte Berufsschule State
  const [schoolAttendance, setSchoolAttendance] = useState([]);
  const [newAttendanceDate, setNewAttendanceDate] = useState('');
  const [newAttendanceStart, setNewAttendanceStart] = useState('');
  const [newAttendanceEnd, setNewAttendanceEnd] = useState('');
  const [newAttendanceTeacherSig, setNewAttendanceTeacherSig] = useState('');
  const [newAttendanceTrainerSig, setNewAttendanceTrainerSig] = useState('');
  const [signatureModal, setSignatureModal] = useState(null); // { id, field, currentValue }
  const [tempSignature, setTempSignature] = useState(null); // Temporäre Unterschrift im Modal
  const [selectedSchoolCardUser, setSelectedSchoolCardUser] = useState(null); // Ausgewählter Azubi für Kontrollkarten-Ansicht
  const [allAzubisForSchoolCard, setAllAzubisForSchoolCard] = useState([]); // Liste aller Azubis für Auswahl

  // Berichtsheft (Ausbildungsnachweis) State
  const [berichtsheftEntries, setBerichtsheftEntries] = useState([]);
  const [berichtsheftWeek, setBerichtsheftWeek] = useState(() => {
    // Aktuelle Woche als Default
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Montag
    return startOfWeek.toISOString().split('T')[0];
  });
  const [berichtsheftYear, setBerichtsheftYear] = useState(1); // Ausbildungsjahr 1-3
  const [berichtsheftNr, setBerichtsheftNr] = useState(1); // Nachweis-Nummer
  const [currentWeekEntries, setCurrentWeekEntries] = useState({
    Mo: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Di: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Mi: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Do: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Fr: [{ taetigkeit: '', stunden: '', bereich: '' }],
    Sa: [{ taetigkeit: '', stunden: '', bereich: '' }],
    So: [{ taetigkeit: '', stunden: '', bereich: '' }]
  });
  const [berichtsheftBemerkungAzubi, setBerichtsheftBemerkungAzubi] = useState('');
  const [berichtsheftBemerkungAusbilder, setBerichtsheftBemerkungAusbilder] = useState('');
  const [berichtsheftSignaturAzubi, setBerichtsheftSignaturAzubi] = useState('');
  const [berichtsheftSignaturAusbilder, setBerichtsheftSignaturAusbilder] = useState('');
  const [berichtsheftDatumAzubi, setBerichtsheftDatumAzubi] = useState('');
  const [berichtsheftDatumAusbilder, setBerichtsheftDatumAusbilder] = useState('');
  const [selectedBerichtsheft, setSelectedBerichtsheft] = useState(null); // Für Bearbeitung
  const [berichtsheftViewMode, setBerichtsheftViewMode] = useState('edit'); // 'edit', 'list', 'progress', 'profile'

  // Schwimmchallenge State
  const [swimChallengeView, setSwimChallengeView] = useState('overview'); // 'overview', 'challenges', 'add', 'leaderboard', 'battle'
  const [swimSessions, setSwimSessions] = useState([]); // Alle Trainingseinheiten (aus Supabase)
  const [activeSwimChallenges, setActiveSwimChallenges] = useState(() => {
    // Lade aktive Challenges aus localStorage
    const saved = localStorage.getItem('active_swim_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [swimSessionForm, setSwimSessionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    time: '',
    style: 'kraul',
    notes: '',
    challengeId: ''
  });
  const [pendingSwimConfirmations, setPendingSwimConfirmations] = useState([]); // Für Trainer: Zu bestätigende Einheiten
  const [swimChallengeFilter, setSwimChallengeFilter] = useState('alle'); // Filter für Challenge-Kategorien

  // Azubi-Profildaten für Berichtsheft
  const [azubiProfile, setAzubiProfile] = useState(() => {
    const saved = localStorage.getItem('azubi_profile');
    return saved ? JSON.parse(saved) : {
      vorname: '',
      nachname: '',
      ausbildungsbetrieb: '',
      ausbildungsberuf: 'Fachangestellte/r für Bäderbetriebe',
      ausbilder: '',
      ausbildungsbeginn: '',
      ausbildungsende: ''
    };
  });

  // Calculator State
  const [calculatorType, setCalculatorType] = useState('ph');
  const [calculatorInputs, setCalculatorInputs] = useState({});
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // Profil-Bearbeitung State
  const [profileEditName, setProfileEditName] = useState('');
  const [profileEditPassword, setProfileEditPassword] = useState('');
  const [profileEditPasswordConfirm, setProfileEditPasswordConfirm] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [profileEditCompany, setProfileEditCompany] = useState('');
  const [profileEditBirthDate, setProfileEditBirthDate] = useState('');

  // Toast-Benachrichtigungen
  const [toasts, setToasts] = useState([]);

  // Toast anzeigen
  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    setToasts(prev => [...prev, { id, message, type, icon: icons[type] || icons.info }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

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
    // Quiz/Lern-Badges
    { id: 'streak_7', name: '7 Tage Streak', icon: '🔥', description: '7 Tage hintereinander gelernt', requirement: 'streak', value: 7, category: 'quiz' },
    { id: 'streak_30', name: '30 Tage Streak', icon: '🔥🔥', description: '30 Tage hintereinander gelernt', requirement: 'streak', value: 30, category: 'quiz' },
    { id: 'questions_50', name: 'Lernmaschine', icon: '💯', description: '50 Fragen richtig beantwortet', requirement: 'questions', value: 50, category: 'quiz' },
    { id: 'questions_100', name: 'Wissensmeister', icon: '🎓', description: '100 Fragen richtig beantwortet', requirement: 'questions', value: 100, category: 'quiz' },
    { id: 'quiz_winner_10', name: 'Quiz-Champion', icon: '👑', description: '10 Quizduell-Siege', requirement: 'quiz_wins', value: 10, category: 'quiz' },
    { id: 'perfectionist', name: 'Perfektionist', icon: '⭐', description: 'Alle Fragen gemeistert', requirement: 'all_mastered', value: 1, category: 'quiz' },
    { id: 'early_bird', name: 'Frühaufsteher', icon: '🌅', description: 'Vor 7 Uhr morgens gelernt', requirement: 'early', value: 1, category: 'quiz' },
    { id: 'night_owl', name: 'Nachteule', icon: '🦉', description: 'Nach 22 Uhr gelernt', requirement: 'night', value: 1, category: 'quiz' },
    // Win Streak Badges - Ungeschlagenen-Serie
    { id: 'win_streak_3', name: 'Aufsteiger', icon: '🥉', description: '3 Siege in Folge', requirement: 'win_streak', value: 3, category: 'quiz' },
    { id: 'win_streak_5', name: 'Durchstarter', icon: '🥈', description: '5 Siege in Folge', requirement: 'win_streak', value: 5, category: 'quiz' },
    { id: 'win_streak_10', name: 'Unaufhaltsam', icon: '🥇', description: '10 Siege in Folge', requirement: 'win_streak', value: 10, category: 'quiz' },
    { id: 'win_streak_15', name: 'Dominanz', icon: '🏅', description: '15 Siege in Folge', requirement: 'win_streak', value: 15, category: 'quiz' },
    { id: 'win_streak_25', name: 'Legende', icon: '🏆', description: '25 Siege in Folge', requirement: 'win_streak', value: 25, category: 'quiz' },
    { id: 'win_streak_50', name: 'Unbesiegbar', icon: '💎', description: '50 Siege in Folge', requirement: 'win_streak', value: 50, category: 'quiz' },
    // Schwimm-Badges (aus SWIM_BADGES)
    ...SWIM_BADGES.map(b => ({ ...b, requirement: b.requirement.type, value: b.requirement.value }))
  ];

  // Supabase Auth Session Listener
  useEffect(() => {
    // Initiale Session prüfen
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // User ist eingeloggt - Profil laden
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && profile.approved) {
          const userSession = {
            id: session.user.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatar: profile.avatar || null,
            company: profile.company || null,
            birthDate: profile.birth_date || null,
            canViewSchoolCards: profile.can_view_school_cards || false,
            permissions: PERMISSIONS[profile.role]
          };
          setUser(userSession);
          localStorage.setItem('baeder_user', JSON.stringify(userSession));
        } else if (profile && !profile.approved) {
          // User nicht freigeschaltet
          await supabase.auth.signOut();
          setUser(null);
          localStorage.removeItem('baeder_user');
        }
      } else {
        // Keine aktive Session - localStorage löschen
        const savedUser = localStorage.getItem('baeder_user');
        if (savedUser) {
          // Es gibt einen gespeicherten User aber keine Session
          // Das kann passieren wenn die Session abgelaufen ist
          setUser(null);
          localStorage.removeItem('baeder_user');
        }
      }
    };

    checkSession();

    // Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);

      if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('baeder_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

    // Load school attendance when view changes
    if (currentView === 'school-card' && user) {
      loadSchoolAttendance();
      if (canViewAllSchoolCards()) {
        loadAzubisForSchoolCard();
      }
    }

    // Load Berichtsheft when view changes
    if (currentView === 'berichtsheft' && user) {
      loadBerichtsheftEntries();
    }

  }, [currentView, user]);

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
        .from('profiles')
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
      await supabase.from('profiles').delete().eq('id', userId);

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
        .from('profiles')
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

    if (registerData.password.length < 6) {
      alert('Das Passwort muss mindestens 6 Zeichen lang sein!');
      return;
    }

    try {
      // Supabase Auth Registrierung
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            name: registerData.name,
            role: registerData.role,
            training_end: registerData.trainingEnd || null
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          alert('Diese E-Mail ist bereits registriert!');
        } else {
          throw error;
        }
        return;
      }

      console.log('User created via Supabase Auth:', data);

      // Direkt ausloggen - User muss erst freigeschaltet werden
      await supabase.auth.signOut();

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
      // Supabase Auth Login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword
      });

      if (authError) {
        if (authError.message.includes('Invalid login')) {
          alert('E-Mail oder Passwort falsch!');
        } else if (authError.message.includes('Email not confirmed')) {
          alert('Bitte bestätige zuerst deine E-Mail-Adresse.');
        } else {
          alert('Fehler beim Login: ' + authError.message);
        }
        return;
      }

      // Profil aus profiles Tabelle laden
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profil nicht gefunden:', profileError);
        await supabase.auth.signOut();
        alert('Profil nicht gefunden. Bitte kontaktiere den Administrator.');
        return;
      }

      // Prüfe ob Account freigeschaltet ist
      if (!profile.approved) {
        await supabase.auth.signOut();
        alert('Dein Account wurde noch nicht freigeschaltet. Bitte warte auf die Freigabe durch einen Administrator.');
        return;
      }

      // Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user.id);

      // User Session erstellen
      const userSession = {
        id: authData.user.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar || null,
        company: profile.company || null,
        birthDate: profile.birth_date || null,
        canViewSchoolCards: profile.can_view_school_cards || false,
        permissions: PERMISSIONS[profile.role]
      };

      setUser(userSession);
      localStorage.setItem('baeder_user', JSON.stringify(userSession));
      setDailyWisdom(DAILY_WISDOM[Math.floor(Math.random() * DAILY_WISDOM.length)]);

      // Initialize stats in Supabase if not exists
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (!existingStats) {
        await supabase
          .from('user_stats')
          .insert([{
            user_id: authData.user.id,
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
          .from('profiles')
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
          .from('profiles')
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
          categoryRound: g.round || 0,
          status: g.status,
          difficulty: g.difficulty,
          categoryRounds: g.rounds_data || [],
          questionHistory: []
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
          isTrainer: false, // Will be updated when we have role info
          avatar: m.user_avatar || null
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
      if (user?.id) {
        // Versuche zuerst nach user_id zu suchen, dann nach user_name (Abwärtskompatibilität)
        let badgesData = null;
        const { data: byId } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id);

        if (byId && byId.length > 0) {
          badgesData = byId;
        } else if (user.name) {
          // Fallback für alte Einträge ohne user_id
          const { data: byName } = await supabase
            .from('user_badges')
            .select('*')
            .eq('user_name', user.name);
          badgesData = byName;
        }

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
        .from('profiles')
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
      showToast(`${account.name} wurde freigeschaltet!`, 'success');
    } catch (error) {
      console.error('Error approving user:', error);
      showToast('Fehler beim Freischalten', 'error');
    }
  };

  const deleteUser = async (email) => {
    try {
      // Get user from Supabase
      const { data: account, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError || !account) {
        showToast('User nicht gefunden', 'error');
        return;
      }

      // NEVER allow deletion of admin accounts
      if (account.role === 'admin') {
        showToast('Administratoren können nicht gelöscht werden!', 'error');
        return;
      }

      if (!confirm('Möchtest du diesen Nutzer wirklich löschen? Alle Daten werden unwiderruflich gelöscht!')) {
        return;
      }

      // Delete profile from Supabase
      // HINWEIS: Der Supabase Auth User bleibt erhalten und muss über
      // eine Edge Function oder manuell im Dashboard gelöscht werden.
      // Für vollständige Löschung: supabase.auth.admin.deleteUser(userId)
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('email', email);

      if (deleteError) throw deleteError;

      loadData();
      showToast('Nutzerprofil und Daten wurden gelöscht', 'success');
    } catch (error) {
      console.error('Delete user error:', error);
      showToast('Fehler beim Löschen', 'error');
    }
  };

  const changeUserRole = async (email, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('email', email);

      if (error) throw error;

      loadData();
      showToast(`Rolle geändert zu: ${PERMISSIONS[newRole].label}`, 'success');
    } catch (error) {
      console.error('Error changing role:', error);
      showToast('Fehler beim Ändern der Rolle', 'error');
    }
  };

  // Kontrollkarten-Berechtigung für Trainer ändern
  const toggleSchoolCardPermission = async (userId, currentValue) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ can_view_school_cards: !currentValue })
        .eq('id', userId);

      if (error) throw error;

      loadData();
      showToast(
        !currentValue
          ? 'Kontrollkarten-Berechtigung erteilt'
          : 'Kontrollkarten-Berechtigung entzogen',
        'success'
      );
    } catch (error) {
      console.error('Error toggling school card permission:', error);
      showToast('Fehler beim Ändern der Berechtigung', 'error');
    }
  };

  // Profil-Bearbeitung: Name ändern
  const updateProfileName = async () => {
    if (!profileEditName.trim()) {
      showToast('Bitte gib einen Namen ein.', 'warning');
      return;
    }

    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: profileEditName.trim() })
        .eq('id', user.id);

      if (error) throw error;

      // Lokalen User-State aktualisieren
      const updatedUser = { ...user, name: profileEditName.trim() };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));

      showToast('Name erfolgreich geändert!', 'success');
      setProfileEditName('');
    } catch (error) {
      console.error('Error updating name:', error);
      showToast('Fehler beim Ändern des Namens', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // Profil-Bearbeitung: Passwort ändern
  const updateProfilePassword = async () => {
    if (!profileEditPassword || !profileEditPasswordConfirm) {
      showToast('Bitte beide Passwort-Felder ausfüllen.', 'warning');
      return;
    }

    if (profileEditPassword !== profileEditPasswordConfirm) {
      showToast('Die Passwörter stimmen nicht überein!', 'error');
      return;
    }

    if (profileEditPassword.length < 6) {
      showToast('Das Passwort muss mindestens 6 Zeichen haben.', 'warning');
      return;
    }

    setProfileSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: profileEditPassword
      });

      if (error) throw error;

      showToast('Passwort erfolgreich geändert!', 'success');
      setProfileEditPassword('');
      setProfileEditPasswordConfirm('');
    } catch (error) {
      console.error('Error updating password:', error);
      showToast('Fehler beim Ändern des Passworts', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // Profil-Bearbeitung: Avatar ändern
  const updateProfileAvatar = async (avatarId) => {
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar: avatarId })
        .eq('id', user.id);

      if (error) throw error;

      // Lokalen User-State aktualisieren
      const updatedUser = { ...user, avatar: avatarId };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast(avatarId ? 'Avatar geändert!' : 'Avatar entfernt', 'success');
    } catch (error) {
      console.error('Error updating avatar:', error);
      showToast('Fehler beim Ändern des Avatars', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // Profil-Bearbeitung: Betrieb ändern
  const updateProfileCompany = async () => {
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ company: profileEditCompany.trim() || null })
        .eq('id', user.id);

      if (error) throw error;

      // Lokalen User-State aktualisieren
      const updatedUser = { ...user, company: profileEditCompany.trim() || null };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast('Betrieb gespeichert!', 'success');
      setProfileEditCompany('');
    } catch (error) {
      console.error('Error updating company:', error);
      showToast('Fehler beim Speichern des Betriebs', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // Profil-Bearbeitung: Geburtsdatum ändern
  const updateProfileBirthDate = async () => {
    if (!profileEditBirthDate) {
      showToast('Bitte gib dein Geburtsdatum ein', 'warning');
      return;
    }
    setProfileSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ birth_date: profileEditBirthDate })
        .eq('id', user.id);

      if (error) throw error;

      // Lokalen User-State aktualisieren
      const updatedUser = { ...user, birthDate: profileEditBirthDate };
      setUser(updatedUser);
      localStorage.setItem('baeder_user', JSON.stringify(updatedUser));
      showToast('Geburtsdatum gespeichert!', 'success');
      setProfileEditBirthDate('');
    } catch (error) {
      console.error('Error updating birth date:', error);
      showToast('Fehler beim Speichern des Geburtsdatums', 'error');
    } finally {
      setProfileSaving(false);
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
        categoryRound: 0, // 0-3 (4 Kategorien)
        player1Score: data.player1_score,
        player2Score: data.player2_score,
        currentTurn: data.current_turn,
        categoryRounds: [], // Speichert alle Kategorie-Runden mit Fragen
        questionHistory: []
      };

      setActiveGames([...activeGames, game]);
      setSelectedOpponent(null);
      showToast(`Herausforderung an ${opponent} gesendet!`, 'success');
    } catch (error) {
      console.error('Challenge error:', error);
      showToast('Fehler beim Senden der Herausforderung', 'error');
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
      game.categoryRound = 0;
      game.categoryRounds = [];
      setCurrentGame(game);
      setCategoryRound(0);
      setQuestionInCategory(0);
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
    setCategoryRound(game.categoryRound || 0);
    setQuestionInCategory(0);
    setPlayerTurn(game.currentTurn);

    // Prüfe ob der Spieler die gespeicherten Fragen spielen muss
    if (game.categoryRounds && game.categoryRounds.length > 0) {
      const currentCatRound = game.categoryRounds[game.categoryRound || 0];
      if (currentCatRound) {
        const isPlayer1 = user.name === game.player1;
        const myAnswers = isPlayer1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;

        // Wenn ich noch keine Antworten habe aber Fragen existieren, muss ich die gleichen Fragen spielen
        if (myAnswers.length === 0 && currentCatRound.questions.length > 0) {
          setQuizCategory(currentCatRound.categoryId);
          setCurrentCategoryQuestions(currentCatRound.questions);
        }
      }
    }

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
          round: game.categoryRound || 0,
          status: game.status,
          rounds_data: game.categoryRounds || [],
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
        .from('profiles')
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
        .from('profiles')
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

  // Fisher-Yates Shuffle für zufällige Fragenreihenfolge
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Spieler wählt Kategorie → 5 zufällige Fragen werden für BEIDE Spieler gespeichert
  const selectCategory = async (catId) => {
    if (!currentGame || currentGame.currentTurn !== user.name) return;

    setQuizCategory(catId);

    // Hole alle Fragen dieser Kategorie und mische sie
    const allQuestions = SAMPLE_QUESTIONS[catId] || [];
    const shuffledQuestions = shuffleArray(allQuestions);

    // Nimm 5 Fragen (oder weniger falls nicht genug vorhanden)
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(5, shuffledQuestions.length));

    // Mische auch die Antworten jeder Frage
    const questionsWithShuffledAnswers = selectedQuestions.map(q => shuffleAnswers(q));

    // Speichere die Fragen im Game für beide Spieler
    if (!currentGame.categoryRounds) currentGame.categoryRounds = [];
    currentGame.categoryRounds.push({
      categoryId: catId,
      categoryName: CATEGORIES.find(c => c.id === catId)?.name || catId,
      questions: questionsWithShuffledAnswers,
      player1Answers: [], // Antworten von Spieler 1
      player2Answers: [], // Antworten von Spieler 2
      chooser: user.name  // Wer hat die Kategorie gewählt
    });

    setCurrentCategoryQuestions(questionsWithShuffledAnswers);
    setQuestionInCategory(0);
    setCurrentQuestion(questionsWithShuffledAnswers[0]);
    setAnswered(false);
    setSelectedAnswers([]); // Reset für Multi-Select
    setLastSelectedAnswer(null); // Reset für Single-Choice

    const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty].time;
    setTimeLeft(timeLimit);
    setTimerActive(true);

    await saveGameToSupabase(currentGame);
  };

  const handleTimeUp = async () => {
    if (answered || !currentGame) return;
    setAnswered(true);
    setTimerActive(false);

    // Speichere falsche Antwort (Timeout)
    await savePlayerAnswer(false, true);
  };

  // Toggle Antwort für Multi-Select Fragen
  const toggleAnswer = (answerIndex) => {
    if (answered || !currentGame) return;

    setSelectedAnswers(prev => {
      if (prev.includes(answerIndex)) {
        return prev.filter(i => i !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
  };

  // Bestätigen der Multi-Select Antwort
  const confirmMultiSelectAnswer = async () => {
    if (answered || !currentGame || !currentQuestion.multi) return;
    setAnswered(true);
    setTimerActive(false);

    // Prüfe ob alle richtigen Antworten ausgewählt wurden (und keine falschen)
    const correctAnswers = currentQuestion.correct;
    const isCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every(idx => correctAnswers.includes(idx));

    await savePlayerAnswer(isCorrect, false);
  };

  const answerQuestion = async (answerIndex) => {
    if (answered || !currentGame) return;

    // Multi-Select: Nur togglen, nicht direkt antworten
    if (currentQuestion.multi) {
      toggleAnswer(answerIndex);
      return;
    }

    // Single-Choice: Direkt antworten
    setAnswered(true);
    setTimerActive(false);
    setLastSelectedAnswer(answerIndex); // Speichere gewählte Antwort für Feedback

    const isCorrect = answerIndex === currentQuestion.correct;
    await savePlayerAnswer(isCorrect, false);
  };

  // Speichert die Antwort des aktuellen Spielers
  const savePlayerAnswer = async (isCorrect, isTimeout) => {
    const isPlayer1 = user.name === currentGame.player1;
    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];

    // Daily Challenge Progress
    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) {
      updateChallengeProgress('correct_answers', 1);
    }
    if (quizCategory) {
      updateChallengeProgress('category_master', 1, quizCategory);
    }
    updateChallengeProgress('quiz_play', 1);

    // Punkte vergeben
    if (isCorrect) {
      if (isPlayer1) {
        currentGame.player1Score++;
      } else {
        currentGame.player2Score++;
      }
    }

    // Antwort speichern
    const answer = {
      questionIndex: questionInCategory,
      correct: isCorrect,
      timeout: isTimeout
    };

    if (isPlayer1) {
      currentCategoryRound.player1Answers.push(answer);
    } else {
      currentCategoryRound.player2Answers.push(answer);
    }

    // Stats aktualisieren
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

    await saveUserStatsToSupabase(user.name, stats);
    setUserStats(stats);
    await saveGameToSupabase(currentGame);
  };

  // Funktion zum Weitergehen zur nächsten Frage/Runde
  const proceedToNextRound = async () => {
    const isPlayer1 = user.name === currentGame.player1;
    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];
    const questionsInCurrentCategory = currentCategoryRound.questions.length;

    // Nächste Frage in der aktuellen Kategorie?
    if (questionInCategory < questionsInCurrentCategory - 1) {
      // Noch mehr Fragen in dieser Kategorie
      const nextQuestionIndex = questionInCategory + 1;
      setQuestionInCategory(nextQuestionIndex);
      setCurrentQuestion(currentCategoryQuestions[nextQuestionIndex]);
      setAnswered(false);
      setSelectedAnswers([]); // Reset für Multi-Select
      setLastSelectedAnswer(null); // Reset für Single-Choice

      const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty].time;
      setTimeLeft(timeLimit);
      setTimerActive(true);
      return;
    }

    // Alle 5 Fragen dieser Kategorie beantwortet
    // Prüfe ob der andere Spieler auch schon dran war
    const player1Done = currentCategoryRound.player1Answers.length >= questionsInCurrentCategory;
    const player2Done = currentCategoryRound.player2Answers.length >= questionsInCurrentCategory;

    if (isPlayer1 && !player2Done) {
      // Spieler 1 fertig, Spieler 2 muss noch die gleichen Fragen beantworten
      currentGame.currentTurn = currentGame.player2;
      setWaitingForOpponent(true);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setPlayerTurn(currentGame.player2);

      await saveGameToSupabase(currentGame);

      // Benachrichtigung an Spieler 2
      await sendNotification(
        currentGame.player2,
        '⚡ Du bist dran!',
        `${user.name} hat die Kategorie "${currentCategoryRound.categoryName}" gespielt. Jetzt bist du dran mit den gleichen Fragen!`,
        'info'
      );
      return;
    }

    if (!isPlayer1 && !player1Done) {
      // Spieler 2 fertig (hat Kategorie gewählt), Spieler 1 muss noch
      currentGame.currentTurn = currentGame.player1;
      setWaitingForOpponent(true);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setPlayerTurn(currentGame.player1);

      await saveGameToSupabase(currentGame);

      await sendNotification(
        currentGame.player1,
        '⚡ Du bist dran!',
        `${user.name} hat die Kategorie "${currentCategoryRound.categoryName}" gespielt. Jetzt bist du dran mit den gleichen Fragen!`,
        'info'
      );
      return;
    }

    // Beide Spieler haben diese Kategorie abgeschlossen
    // Nächste Kategorie oder Spielende?
    if (currentGame.categoryRound < 3) {
      // Nächste Kategorie-Runde (insgesamt 4)
      currentGame.categoryRound++;

      // Der Spieler der NICHT die letzte Kategorie gewählt hat, wählt jetzt
      const nextChooser = currentCategoryRound.chooser === currentGame.player1
        ? currentGame.player2
        : currentGame.player1;

      currentGame.currentTurn = nextChooser;

      setCategoryRound(currentGame.categoryRound);
      setQuestionInCategory(0);
      setQuizCategory(null);
      setCurrentQuestion(null);
      setCurrentCategoryQuestions([]);
      setPlayerTurn(nextChooser);
      setWaitingForOpponent(false);
      setAnswered(false);

      await saveGameToSupabase(currentGame);

      if (nextChooser !== user.name) {
        await sendNotification(
          nextChooser,
          '🎯 Wähle eine Kategorie!',
          `Runde ${currentGame.categoryRound + 1}/4 - Du darfst die nächste Kategorie wählen!`,
          'info'
        );
      }
    } else {
      // Spiel beendet (4 Kategorien gespielt)
      await finishGame();
    }
  };

  // Wenn Spieler 2 die gespeicherten Fragen spielen muss
  const startCategoryAsSecondPlayer = () => {
    if (!currentGame || !currentGame.categoryRounds) return;

    const currentCategoryRound = currentGame.categoryRounds[currentGame.categoryRound];
    if (!currentCategoryRound) return;

    setQuizCategory(currentCategoryRound.categoryId);
    setCurrentCategoryQuestions(currentCategoryRound.questions);
    setQuestionInCategory(0);
    setCurrentQuestion(currentCategoryRound.questions[0]);
    setAnswered(false);
    setSelectedAnswers([]); // Reset für Multi-Select
    setLastSelectedAnswer(null); // Reset für Single-Choice
    setWaitingForOpponent(false);

    const timeLimit = DIFFICULTY_SETTINGS[currentGame.difficulty].time;
    setTimeLeft(timeLimit);
    setTimerActive(true);
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
            opponents: {},
            winStreak: 0,
            bestWinStreak: 0
          };

          // Ensure winStreak fields exist
          if (stats.winStreak === undefined) stats.winStreak = 0;
          if (stats.bestWinStreak === undefined) stats.bestWinStreak = 0;

          const opponent = playerName === currentGame.player1 ? currentGame.player2 : currentGame.player1;

          if (!stats.opponents[opponent]) {
            stats.opponents[opponent] = { wins: 0, losses: 0, draws: 0 };
          }

          if (winner === playerName) {
            stats.wins++;
            stats.opponents[opponent].wins++;
            // Win Streak erhöhen
            stats.winStreak++;
            if (stats.winStreak > stats.bestWinStreak) {
              stats.bestWinStreak = stats.winStreak;
            }
          } else if (winner === null) {
            stats.draws++;
            stats.opponents[opponent].draws++;
            // Unentschieden beendet die Serie NICHT
          } else {
            stats.losses++;
            stats.opponents[opponent].losses++;
            // Niederlage beendet die Win Streak
            stats.winStreak = 0;
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
          content: newMessage.trim(),
          user_avatar: user.avatar || null
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
        isTrainer: user.role === 'trainer' || user.role === 'admin',
        avatar: data.user_avatar
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
      showToast('Frage eingereicht!', 'success');
    } catch (error) {
      console.error('Question error:', error);
      showToast('Fehler beim Einreichen der Frage', 'error');
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
    // Mische die Antworten jeder Frage, damit die richtige Antwort nicht immer an der gleichen Stelle ist
    const examQuestions = shuffled.slice(0, Math.min(30, shuffled.length)).map(q => shuffleAnswers(q));
    setExamSimulator({ questions: examQuestions, answers: [], startTime: Date.now() });
    setExamQuestionIndex(0);
    setExamCurrentQuestion(examQuestions[0]);
    setExamAnswered(false);
    setExamSelectedAnswers([]); // Reset Multi-Select
    setExamSelectedAnswer(null); // Reset Single-Choice
    setUserExamProgress(null);
  };

  // Toggle für Multi-Select im Prüfungssimulator
  const toggleExamAnswer = (answerIndex) => {
    if (examAnswered || !examSimulator) return;
    setExamSelectedAnswers(prev => {
      if (prev.includes(answerIndex)) {
        return prev.filter(i => i !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
  };

  // Bestätigen der Multi-Select Antwort im Prüfungssimulator
  const confirmExamMultiSelectAnswer = () => {
    if (examAnswered || !examSimulator || !examCurrentQuestion.multi) return;
    setExamAnswered(true);

    const correctAnswers = examCurrentQuestion.correct;
    const isCorrect =
      examSelectedAnswers.length === correctAnswers.length &&
      examSelectedAnswers.every(idx => correctAnswers.includes(idx));

    if (isCorrect) { playSound('correct'); } else { playSound('wrong'); }

    // Daily Challenge Progress
    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) {
      updateChallengeProgress('correct_answers', 1);
    }
    if (examCurrentQuestion.category) {
      updateChallengeProgress('category_master', 1, examCurrentQuestion.category);
    }

    const newAnswers = [...examSimulator.answers, {
      question: examCurrentQuestion,
      selectedAnswers: examSelectedAnswers,
      correct: isCorrect
    }];
    setExamSimulator({ ...examSimulator, answers: newAnswers });

    setTimeout(() => {
      proceedToNextExamQuestion(newAnswers);
    }, 2000);
  };

  const answerExamQuestion = (answerIndex) => {
    if (examAnswered || !examSimulator) return;

    // Multi-Select: Nur togglen, nicht direkt antworten
    if (examCurrentQuestion.multi) {
      toggleExamAnswer(answerIndex);
      return;
    }

    // Single-Choice: Direkt antworten
    setExamAnswered(true);
    setExamSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === examCurrentQuestion.correct;
    if (isCorrect) { playSound('correct'); } else { playSound('wrong'); }

    // Daily Challenge Progress
    updateChallengeProgress('answer_questions', 1);
    if (isCorrect) {
      updateChallengeProgress('correct_answers', 1);
    }
    if (examCurrentQuestion.category) {
      updateChallengeProgress('category_master', 1, examCurrentQuestion.category);
    }
    const newAnswers = [...examSimulator.answers, { question: examCurrentQuestion, selectedAnswer: answerIndex, correct: isCorrect }];
    setExamSimulator({ ...examSimulator, answers: newAnswers });
    setTimeout(() => {
      proceedToNextExamQuestion(newAnswers);
    }, 2000);
  };

  const proceedToNextExamQuestion = (newAnswers) => {
    if (examQuestionIndex < examSimulator.questions.length - 1) {
      const nextIdx = examQuestionIndex + 1;
      setExamQuestionIndex(nextIdx);
      setExamCurrentQuestion(examSimulator.questions[nextIdx]);
      setExamAnswered(false);
      setExamSelectedAnswers([]);
      setExamSelectedAnswer(null);
    } else {
      const correctAnswers = newAnswers.filter(a => a.correct).length;
      const percentage = Math.round((correctAnswers / newAnswers.length) * 100);
      setUserExamProgress({ correct: correctAnswers, total: newAnswers.length, percentage, passed: percentage >= 50, timeMs: Date.now() - examSimulator.startTime });
      if (percentage >= 50) playSound('whistle');
    }
  };

  const resetExam = () => {
    setExamSimulator(null);
    setExamCurrentQuestion(null);
    setExamQuestionIndex(0);
    setExamAnswered(false);
    setUserExamProgress(null);
    setExamSelectedAnswers([]);
    setExamSelectedAnswer(null);
  };

  // Kontrollkarte Berufsschule Funktionen
  const canViewAllSchoolCards = () => {
    return user?.role === 'admin' || user?.canViewSchoolCards;
  };

  const loadAzubisForSchoolCard = async () => {
    if (!canViewAllSchoolCards()) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('role', 'azubi')
        .eq('approved', true)
        .order('name');

      if (error) throw error;
      setAllAzubisForSchoolCard(data || []);
    } catch (err) {
      console.error('Fehler beim Laden der Azubis:', err);
    }
  };

  const loadSchoolAttendance = async (targetUserId = null) => {
    if (!user) return;
    try {
      // Bestimme welche User-ID geladen werden soll
      const userIdToLoad = targetUserId || selectedSchoolCardUser?.id || user.id;

      const { data, error } = await supabase
        .from('school_attendance')
        .select('*')
        .eq('user_id', userIdToLoad)
        .order('date', { ascending: false });

      if (error) throw error;
      setSchoolAttendance(data || []);
    } catch (err) {
      console.error('Fehler beim Laden der Kontrollkarte:', err);
    }
  };

  const addSchoolAttendance = async () => {
    if (!newAttendanceDate || !newAttendanceStart || !newAttendanceEnd) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }

    try {
      const { error } = await supabase
        .from('school_attendance')
        .insert({
          user_id: user.id,
          user_name: user.name,
          date: newAttendanceDate,
          start_time: newAttendanceStart,
          end_time: newAttendanceEnd,
          teacher_signature: newAttendanceTeacherSig,
          trainer_signature: newAttendanceTrainerSig
        });

      if (error) throw error;

      // Benachrichtigung an berechtigte Trainer/Admins senden
      const { data: authorizedUsers } = await supabase
        .from('profiles')
        .select('id')
        .or('role.eq.admin,can_view_school_cards.eq.true');

      if (authorizedUsers) {
        for (const authUser of authorizedUsers) {
          if (authUser.id !== user.id) {
            await supabase.from('notifications').insert({
              user_id: authUser.id,
              type: 'school_card',
              title: '📝 Neuer Kontrollkarten-Eintrag',
              message: `${user.name} hat einen neuen Berufsschul-Eintrag vom ${new Date(newAttendanceDate).toLocaleDateString('de-DE')} hinzugefügt.`,
              data: { azubi_id: user.id, azubi_name: user.name, date: newAttendanceDate }
            });
          }
        }
      }

      // Reset form
      setNewAttendanceDate('');
      setNewAttendanceStart('');
      setNewAttendanceEnd('');
      setNewAttendanceTeacherSig('');
      setNewAttendanceTrainerSig('');

      showToast('Eintrag gespeichert!', 'success');

      // Reload data
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      alert('Fehler beim Speichern');
    }
  };

  const updateAttendanceSignature = async (id, field, value) => {
    try {
      const { error } = await supabase
        .from('school_attendance')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Aktualisieren:', err);
    }
  };

  const deleteSchoolAttendance = async (id) => {
    if (!confirm('Eintrag wirklich löschen?')) return;
    try {
      const { error } = await supabase
        .from('school_attendance')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadSchoolAttendance();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    }
  };

  // ==================== BERICHTSHEFT FUNKTIONEN ====================

  const loadBerichtsheftEntries = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('berichtsheft')
        .select('*')
        .eq('user_name', user.name)
        .order('week_start', { ascending: false });

      if (error) throw error;
      setBerichtsheftEntries(data || []);

      // Setze die Nachweis-Nr auf nächste freie Nummer
      if (data && data.length > 0) {
        const maxNr = Math.max(...data.map(e => e.nachweis_nr || 0));
        setBerichtsheftNr(maxNr + 1);
      }
    } catch (err) {
      console.error('Fehler beim Laden des Berichtshefts:', err);
    }
  };

  const getWeekEndDate = (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Sonntag
    return end.toISOString().split('T')[0];
  };

  // Azubi-Profil speichern
  const saveAzubiProfile = (newProfile) => {
    setAzubiProfile(newProfile);
    localStorage.setItem('azubi_profile', JSON.stringify(newProfile));
  };

  // ==================== SCHWIMMCHALLENGE FUNKTIONEN ====================

  // Aktive Challenges speichern (localStorage)
  const saveActiveSwimChallenges = (challenges) => {
    setActiveSwimChallenges(challenges);
    localStorage.setItem('active_swim_challenges', JSON.stringify(challenges));
  };

  // Trainingseinheiten aus Supabase laden
  const loadSwimSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('swim_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Tabelle existiert nicht - kein Fehler anzeigen, nur leere Liste
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('swim_sessions Tabelle existiert nicht in Supabase');
          setSwimSessions([]);
          return;
        }
        throw error;
      }

      console.log('Schwimm-Sessions geladen:', data?.length || 0);
      setSwimSessions(data || []);

      // Filtere unbestätigte Einheiten für Trainer
      if (user?.permissions?.canViewAllStats) {
        const pending = (data || []).filter(s => !s.confirmed);
        setPendingSwimConfirmations(pending);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Schwimm-Einheiten:', err);
      setSwimSessions([]);
    }
  };

  // Trainingseinheit speichern
  const saveSwimSession = async (sessionData) => {
    try {
      // Prüfe ob User eingeloggt ist und eine ID hat
      if (!user || !user.id) {
        console.error('Kein User oder User-ID vorhanden:', user);
        return { success: false, error: 'Bitte melde dich erneut an.' };
      }

      const newSession = {
        user_id: user.id,
        user_name: user.name,
        user_role: user.role,
        date: sessionData.date,
        distance: parseInt(sessionData.distance) || 0,
        time_minutes: parseInt(sessionData.time) || 0,
        style: sessionData.style,
        notes: sessionData.notes || '',
        challenge_id: sessionData.challengeId || null,
        confirmed: false,
        confirmed_by: null,
        confirmed_at: null
      };

      console.log('Speichere Schwimm-Session:', newSession);

      const { data, error } = await supabase
        .from('swim_sessions')
        .insert([newSession])
        .select();

      if (error) {
        console.error('Supabase Fehler:', error);
        // Prüfe ob Tabelle nicht existiert
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return { success: false, error: 'Die Tabelle swim_sessions existiert nicht in Supabase. Bitte erstellen!' };
        }
        throw error;
      }

      console.log('Session gespeichert:', data);

      // Aktualisiere lokale Liste
      setSwimSessions(prev => [data[0], ...prev]);
      setPendingSwimConfirmations(prev => [data[0], ...prev]);

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Fehler beim Speichern der Schwimm-Einheit:', err);
      return { success: false, error: err.message || 'Unbekannter Fehler' };
    }
  };

  // Trainingseinheit bestätigen (Trainer)
  const confirmSwimSession = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('swim_sessions')
        .update({
          confirmed: true,
          confirmed_by: user.name,
          confirmed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Aktualisiere lokale Listen
      setSwimSessions(prev => prev.map(s =>
        s.id === sessionId ? { ...s, confirmed: true, confirmed_by: user.name } : s
      ));
      setPendingSwimConfirmations(prev => prev.filter(s => s.id !== sessionId));

      return { success: true };
    } catch (err) {
      console.error('Fehler beim Bestätigen:', err);
      return { success: false, error: err.message };
    }
  };

  // Trainingseinheit ablehnen (Trainer)
  const rejectSwimSession = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('swim_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSwimSessions(prev => prev.filter(s => s.id !== sessionId));
      setPendingSwimConfirmations(prev => prev.filter(s => s.id !== sessionId));

      return { success: true };
    } catch (err) {
      console.error('Fehler beim Ablehnen:', err);
      return { success: false, error: err.message };
    }
  };

  // Lade Schwimmdaten beim Start
  useEffect(() => {
    if (user) {
      loadSwimSessions();
    }
  }, [user]);

  // Prüfe Schwimm-Badges wenn sich Sessions ändern
  useEffect(() => {
    if (user && swimSessions.length > 0) {
      checkBadges();
    }
  }, [swimSessions]);

  const resetBerichtsheftForm = () => {
    setCurrentWeekEntries({
      Mo: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Di: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Mi: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Do: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Fr: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Sa: [{ taetigkeit: '', stunden: '', bereich: '' }],
      So: [{ taetigkeit: '', stunden: '', bereich: '' }]
    });
    setBerichtsheftBemerkungAzubi('');
    setBerichtsheftBemerkungAusbilder('');
    setBerichtsheftSignaturAzubi('');
    setBerichtsheftSignaturAusbilder('');
    setBerichtsheftDatumAzubi('');
    setBerichtsheftDatumAusbilder('');
    setSelectedBerichtsheft(null);
  };

  const addWeekEntry = (day) => {
    setCurrentWeekEntries(prev => ({
      ...prev,
      [day]: [...prev[day], { taetigkeit: '', stunden: '', bereich: '' }]
    }));
  };

  const updateWeekEntry = (day, index, field, value) => {
    setCurrentWeekEntries(prev => ({
      ...prev,
      [day]: prev[day].map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const removeWeekEntry = (day, index) => {
    if (currentWeekEntries[day].length <= 1) return; // Mindestens eine Zeile
    setCurrentWeekEntries(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const calculateDayHours = (day) => {
    return currentWeekEntries[day].reduce((sum, entry) => {
      const hours = parseFloat(entry.stunden) || 0;
      return sum + hours;
    }, 0);
  };

  const calculateTotalHours = () => {
    return Object.keys(currentWeekEntries).reduce((sum, day) => {
      return sum + calculateDayHours(day);
    }, 0);
  };

  const saveBerichtsheft = async () => {
    // Validierung
    const hasContent = Object.values(currentWeekEntries).some(day =>
      day.some(entry => entry.taetigkeit.trim() !== '')
    );

    if (!hasContent) {
      alert('Bitte mindestens eine Tätigkeit eintragen');
      return;
    }

    try {
      const berichtsheftData = {
        user_name: user.name,
        week_start: berichtsheftWeek,
        week_end: getWeekEndDate(berichtsheftWeek),
        ausbildungsjahr: berichtsheftYear,
        nachweis_nr: berichtsheftNr,
        entries: currentWeekEntries,
        bemerkung_azubi: berichtsheftBemerkungAzubi,
        bemerkung_ausbilder: berichtsheftBemerkungAusbilder,
        signatur_azubi: berichtsheftSignaturAzubi,
        signatur_ausbilder: berichtsheftSignaturAusbilder,
        datum_azubi: berichtsheftDatumAzubi || null,
        datum_ausbilder: berichtsheftDatumAusbilder || null,
        total_hours: calculateTotalHours()
      };

      if (selectedBerichtsheft) {
        // Update
        const { error } = await supabase
          .from('berichtsheft')
          .update(berichtsheftData)
          .eq('id', selectedBerichtsheft.id);

        if (error) throw error;
        showToast('Berichtsheft aktualisiert!', 'success');
      } else {
        // Insert
        const { error } = await supabase
          .from('berichtsheft')
          .insert(berichtsheftData);

        if (error) throw error;
        showToast('Berichtsheft gespeichert!', 'success');
        setBerichtsheftNr(prev => prev + 1);
      }

      resetBerichtsheftForm();
      loadBerichtsheftEntries();
      setBerichtsheftViewMode('list');
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      showToast('Fehler beim Speichern des Berichtshefts', 'error');
    }
  };

  const loadBerichtsheftForEdit = (entry) => {
    setSelectedBerichtsheft(entry);
    setBerichtsheftWeek(entry.week_start);
    setBerichtsheftYear(entry.ausbildungsjahr);
    setBerichtsheftNr(entry.nachweis_nr);
    setCurrentWeekEntries(entry.entries || {
      Mo: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Di: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Mi: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Do: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Fr: [{ taetigkeit: '', stunden: '', bereich: '' }],
      Sa: [{ taetigkeit: '', stunden: '', bereich: '' }],
      So: [{ taetigkeit: '', stunden: '', bereich: '' }]
    });
    setBerichtsheftBemerkungAzubi(entry.bemerkung_azubi || '');
    setBerichtsheftBemerkungAusbilder(entry.bemerkung_ausbilder || '');
    setBerichtsheftSignaturAzubi(entry.signatur_azubi || '');
    setBerichtsheftSignaturAusbilder(entry.signatur_ausbilder || '');
    setBerichtsheftDatumAzubi(entry.datum_azubi || '');
    setBerichtsheftDatumAusbilder(entry.datum_ausbilder || '');
    setBerichtsheftViewMode('edit');
  };

  const deleteBerichtsheft = async (id) => {
    if (!confirm('Berichtsheft wirklich löschen?')) return;
    try {
      const { error } = await supabase
        .from('berichtsheft')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadBerichtsheftEntries();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    }
  };

  const calculateBereichProgress = () => {
    // Berechnet wie viele Stunden pro Ausbildungsbereich bereits erfasst wurden
    const progress = {};
    AUSBILDUNGSRAHMENPLAN.forEach(bereich => {
      progress[bereich.nr] = {
        name: bereich.bereich,
        icon: bereich.icon,
        color: bereich.color,
        sollWochen: bereich.gesamtWochen,
        istStunden: 0
      };
    });

    berichtsheftEntries.forEach(entry => {
      if (entry.entries) {
        Object.values(entry.entries).forEach(day => {
          day.forEach(item => {
            if (item.bereich && item.stunden) {
              const bereichNr = parseInt(item.bereich);
              if (progress[bereichNr]) {
                progress[bereichNr].istStunden += parseFloat(item.stunden) || 0;
              }
            }
          });
        });
      }
    });

    return progress;
  };

  const generateBerichtsheftPDF = (entry) => {
    // Erstellt eine druckbare HTML-Version
    const weekStart = new Date(entry.week_start);
    const weekEnd = new Date(entry.week_end);

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' });
    };

    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const dayNames = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag' };

    let tableRows = '';
    days.forEach(day => {
      const dayEntries = entry.entries?.[day] || [];
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + days.indexOf(day));

      let dayHours = 0;
      let dayContent = '';

      dayEntries.forEach(e => {
        if (e.taetigkeit) {
          const bereich = AUSBILDUNGSRAHMENPLAN.find(b => b.nr === parseInt(e.bereich));
          dayContent += `<div style="margin-bottom: 4px;">${e.taetigkeit}${bereich ? ` <small style="color: #666;">(${bereich.bereich})</small>` : ''}</div>`;
          dayHours += parseFloat(e.stunden) || 0;
        }
      });

      tableRows += `
        <tr>
          <td style="border: 1px solid #333; padding: 8px; font-weight: bold; width: 50px; vertical-align: top;">${day}</td>
          <td style="border: 1px solid #333; padding: 8px; min-height: 60px;">${dayContent || '-'}</td>
          <td style="border: 1px solid #333; padding: 8px; text-align: center; width: 80px;">${dayHours > 0 ? dayHours : '-'}</td>
          <td style="border: 1px solid #333; padding: 8px; text-align: center; width: 80px;">${dayHours > 0 ? dayHours : '-'}</td>
          <td style="border: 1px solid #333; padding: 8px; width: 150px;"></td>
        </tr>
      `;
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ausbildungsnachweis Nr. ${entry.nachweis_nr}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          body { font-family: Arial, sans-serif; font-size: 12px; }
          h1 { text-align: center; font-size: 18px; margin-bottom: 20px; }
          .header-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .header-info div { flex: 1; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #f0f0f0; border: 1px solid #333; padding: 8px; text-align: left; }
          .signature-section { display: flex; gap: 40px; margin-top: 30px; }
          .signature-box { flex: 1; border: 1px solid #333; padding: 15px; }
          .signature-line { border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; }
        </style>
      </head>
      <body>
        <h1>Ausbildungsnachweis</h1>

        <div class="header-info">
          <div><strong>Ausbildungsnachweis Nr.:</strong> ${entry.nachweis_nr}</div>
          <div><strong>Name:</strong> ${user?.name || ''}</div>
        </div>

        <div class="header-info">
          <div><strong>Woche vom:</strong> ${formatDate(entry.week_start)} bis ${formatDate(entry.week_end)} ${weekEnd.getFullYear()}</div>
          <div><strong>Ausbildungsjahr:</strong> ${entry.ausbildungsjahr}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Ausgeführte Arbeiten, Unterricht usw.</th>
              <th>Einzel-stunden</th>
              <th>Gesamt-stunden</th>
              <th>Ausbildungs-Abteilung</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr>
              <td colspan="3" style="border: 1px solid #333; padding: 8px; text-align: right; font-weight: bold;">Gesamtstunden:</td>
              <td style="border: 1px solid #333; padding: 8px; text-align: center; font-weight: bold;">${entry.total_hours || 0}</td>
              <td style="border: 1px solid #333; padding: 8px;"></td>
            </tr>
          </tbody>
        </table>

        <div style="margin-bottom: 20px;">
          <strong>Besondere Bemerkungen</strong>
          <div style="display: flex; gap: 20px; margin-top: 10px;">
            <div style="flex: 1; border: 1px solid #333; padding: 10px; min-height: 60px;">
              <small>Auszubildender:</small><br>
              ${entry.bemerkung_azubi || ''}
            </div>
            <div style="flex: 1; border: 1px solid #333; padding: 10px; min-height: 60px;">
              <small>Ausbildender bzw. Ausbilder:</small><br>
              ${entry.bemerkung_ausbilder || ''}
            </div>
          </div>
        </div>

        <div style="margin-top: 30px;">
          <strong>Für die Richtigkeit</strong>
          <div style="display: flex; gap: 40px; margin-top: 15px;">
            <div style="flex: 1;">
              <div style="margin-bottom: 5px;">Datum: ${entry.datum_azubi || '________________'}</div>
              <div style="border-top: 1px solid #333; padding-top: 5px; margin-top: 30px;">
                Unterschrift des Auszubildenden<br>
                <strong>${entry.signatur_azubi || ''}</strong>
              </div>
            </div>
            <div style="flex: 1;">
              <div style="margin-bottom: 5px;">Datum: ${entry.datum_ausbilder || '________________'}</div>
              <div style="border-top: 1px solid #333; padding-top: 5px; margin-top: 30px;">
                Unterschrift des Ausbildenden bzw. Ausbilders<br>
                <strong>${entry.signatur_ausbilder || ''}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 30px; font-size: 16px; cursor: pointer;">
            Drucken / Als PDF speichern
          </button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // ==================== ENDE BERICHTSHEFT FUNKTIONEN ====================

  const loadFlashcards = () => {
    const hardcodedCards = FLASHCARD_CONTENT[newQuestionCategory] || [];
    const userCards = userFlashcards.filter(fc => fc.category === newQuestionCategory);
    const allCards = [...hardcodedCards, ...userCards];
    setFlashcards(allCards); setFlashcardIndex(0); setCurrentFlashcard(allCards[0] || null); setShowFlashcardAnswer(false);
  };

  // ==================== SPACED REPETITION SYSTEM ====================

  // Intervalle in Tagen basierend auf Level (SM-2 ähnlich)
  const SPACED_INTERVALS = {
    1: 1,    // Level 1: 1 Tag
    2: 3,    // Level 2: 3 Tage
    3: 7,    // Level 3: 1 Woche
    4: 14,   // Level 4: 2 Wochen
    5: 30,   // Level 5: 1 Monat
    6: 60    // Level 6: 2 Monate (gemeistert)
  };

  const getCardKey = (card, category) => {
    return `${category}_${card.front.substring(0, 30)}`;
  };

  const getCardSpacedData = (card, category) => {
    const key = getCardKey(card, category);
    return spacedRepetitionData[key] || { level: 1, nextReview: Date.now(), reviewCount: 0 };
  };

  const updateCardSpacedData = (card, category, correct) => {
    const key = getCardKey(card, category);
    const current = getCardSpacedData(card, category);

    let newLevel;
    if (correct) {
      newLevel = Math.min(current.level + 1, 6);
    } else {
      newLevel = Math.max(current.level - 1, 1);
    }

    const intervalDays = SPACED_INTERVALS[newLevel];
    const nextReview = Date.now() + (intervalDays * 24 * 60 * 60 * 1000);

    const newData = {
      ...spacedRepetitionData,
      [key]: {
        level: newLevel,
        nextReview: nextReview,
        reviewCount: current.reviewCount + 1,
        lastReview: Date.now()
      }
    };

    setSpacedRepetitionData(newData);
    localStorage.setItem('spaced_repetition_data', JSON.stringify(newData));

    // Update daily challenge progress
    updateChallengeProgress('flashcards_reviewed', 1);
    if (correct) {
      updateChallengeProgress('correct_answers', 1);
    }

    return newLevel;
  };

  const loadDueCards = (category) => {
    const hardcodedCards = FLASHCARD_CONTENT[category] || [];
    const userCards = userFlashcards.filter(fc => fc.category === category);
    const allCards = [...hardcodedCards, ...userCards];

    const now = Date.now();
    const due = allCards
      .map(card => ({
        ...card,
        spacedData: getCardSpacedData(card, category)
      }))
      .filter(card => card.spacedData.nextReview <= now)
      .sort((a, b) => a.spacedData.level - b.spacedData.level); // Niedrigste Level zuerst

    setDueCards(due);
    return due;
  };

  const getDueCardCount = (category) => {
    const hardcodedCards = FLASHCARD_CONTENT[category] || [];
    const userCards = userFlashcards.filter(fc => fc.category === category);
    const allCards = [...hardcodedCards, ...userCards];

    const now = Date.now();
    return allCards.filter(card => getCardSpacedData(card, category).nextReview <= now).length;
  };

  const getTotalDueCards = () => {
    return CATEGORIES.reduce((sum, cat) => sum + getDueCardCount(cat.id), 0);
  };

  const getLevelColor = (level) => {
    const colors = {
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-yellow-500',
      4: 'bg-lime-500',
      5: 'bg-green-500',
      6: 'bg-emerald-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getLevelLabel = (level) => {
    const labels = {
      1: 'Neu',
      2: 'Lernend',
      3: 'Bekannt',
      4: 'Gefestigt',
      5: 'Sicher',
      6: 'Gemeistert'
    };
    return labels[level] || 'Unbekannt';
  };

  // ==================== DAILY CHALLENGES SYSTEM ====================

  const CHALLENGE_TYPES = [
    { id: 'answer_questions', name: 'Fragen beantworten', icon: '❓', unit: 'Fragen', baseTarget: 10 },
    { id: 'correct_answers', name: 'Richtige Antworten', icon: '✅', unit: 'richtige', baseTarget: 7 },
    { id: 'flashcards_reviewed', name: 'Lernkarten wiederholen', icon: '🎴', unit: 'Karten', baseTarget: 15 },
    { id: 'category_master', name: 'Kategorie üben', icon: '📚', unit: 'Fragen aus', baseTarget: 5, hasCategory: true },
    { id: 'quiz_play', name: 'Quiz spielen', icon: '🎮', unit: 'Runde', baseTarget: 1 },
    { id: 'streak_keep', name: 'Lernstreak halten', icon: '🔥', unit: 'Tag', baseTarget: 1 }
  ];

  const generateDailyChallenges = () => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Pseudo-random basierend auf Datum (gleiche Challenges für alle Nutzer am selben Tag)
    const seededRandom = (index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };

    // Wähle 3 Challenges für heute
    const shuffled = [...CHALLENGE_TYPES].sort((a, b) => seededRandom(CHALLENGE_TYPES.indexOf(a)) - seededRandom(CHALLENGE_TYPES.indexOf(b)));
    const selectedChallenges = shuffled.slice(0, 3);

    return selectedChallenges.map((challenge, idx) => {
      const difficulty = 1 + seededRandom(idx + 100) * 0.5; // 1.0 - 1.5x
      const target = Math.round(challenge.baseTarget * difficulty);

      let category = null;
      if (challenge.hasCategory) {
        const catIndex = Math.floor(seededRandom(idx + 200) * CATEGORIES.length);
        category = CATEGORIES[catIndex];
      }

      return {
        ...challenge,
        target,
        category,
        xpReward: target * 10
      };
    });
  };

  const updateChallengeProgress = (challengeType, amount = 1, categoryId = null) => {
    setDailyChallengeProgress(prev => {
      const today = new Date().toDateString();

      // Reset if it's a new day
      if (prev.date !== today) {
        const newProgress = {
          date: today,
          completed: [],
          stats: { [challengeType]: amount }
        };
        if (categoryId) {
          newProgress.stats[`category_${categoryId}`] = amount;
        }
        localStorage.setItem('daily_challenge_progress', JSON.stringify(newProgress));
        return newProgress;
      }

      const newStats = { ...prev.stats };
      newStats[challengeType] = (newStats[challengeType] || 0) + amount;
      if (categoryId) {
        newStats[`category_${categoryId}`] = (newStats[`category_${categoryId}`] || 0) + amount;
      }

      const newProgress = { ...prev, stats: newStats };
      localStorage.setItem('daily_challenge_progress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const getChallengeProgress = (challenge) => {
    const stats = dailyChallengeProgress.stats || {};

    if (challenge.hasCategory && challenge.category) {
      return stats[`category_${challenge.category.id}`] || 0;
    }

    return stats[challenge.id] || 0;
  };

  const isChallengeCompleted = (challenge) => {
    return getChallengeProgress(challenge) >= challenge.target;
  };

  const getCompletedChallengesCount = () => {
    return dailyChallenges.filter(c => isChallengeCompleted(c)).length;
  };

  const getTotalXPEarned = () => {
    return dailyChallenges
      .filter(c => isChallengeCompleted(c))
      .reduce((sum, c) => sum + c.xpReward, 0);
  };

  // Initialize daily challenges
  useEffect(() => {
    const challenges = generateDailyChallenges();
    setDailyChallenges(challenges);
  }, []);

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

    // === QUIZ-BADGES ===
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

    // Win Streak Badges - basierend auf bestWinStreak (höchste erreichte Serie)
    const bestStreak = userStats.bestWinStreak || 0;
    const winStreakMilestones = [
      { id: 'win_streak_3', value: 3 },
      { id: 'win_streak_5', value: 5 },
      { id: 'win_streak_10', value: 10 },
      { id: 'win_streak_15', value: 15 },
      { id: 'win_streak_25', value: 25 },
      { id: 'win_streak_50', value: 50 }
    ];

    for (const milestone of winStreakMilestones) {
      if (bestStreak >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // === SCHWIMM-BADGES ===
    const mySwimSessions = swimSessions.filter(s => s.user_id === user.id && s.confirmed);
    const totalDistance = mySwimSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
    const totalTime = mySwimSessions.reduce((sum, s) => sum + (s.time_minutes || 0), 0);
    const sessionCount = mySwimSessions.length;

    // Distanz-Badges
    const distanceMilestones = [
      { id: 'swim_first_km', value: 1000 },
      { id: 'swim_five_km', value: 5000 },
      { id: 'swim_ten_km', value: 10000 },
      { id: 'swim_marathon', value: 42195 }
    ];
    for (const milestone of distanceMilestones) {
      if (totalDistance >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // Session-Badges
    const sessionMilestones = [
      { id: 'swim_first_session', value: 1 },
      { id: 'swim_10_sessions', value: 10 },
      { id: 'swim_25_sessions', value: 25 },
      { id: 'swim_50_sessions', value: 50 }
    ];
    for (const milestone of sessionMilestones) {
      if (sessionCount >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // Zeit-Badges (in Minuten)
    const timeMilestones = [
      { id: 'swim_1h_training', value: 60 },
      { id: 'swim_10h_training', value: 600 }
    ];
    for (const milestone of timeMilestones) {
      if (totalTime >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // Challenge-Badges
    const completedChallenges = SWIM_CHALLENGES.filter(ch => {
      const progress = calculateChallengeProgress(ch, swimSessions, user.id);
      return progress.percent >= 100;
    });
    const challengeMilestones = [
      { id: 'swim_challenge_first', value: 1 },
      { id: 'swim_challenge_5', value: 5 },
      { id: 'swim_challenge_master', value: 10 }
    ];
    for (const milestone of challengeMilestones) {
      if (completedChallenges.length >= milestone.value && !earnedBadges.find(b => b.id === milestone.id)) {
        const badge = { id: milestone.id, earnedAt: Date.now() };
        earnedBadges.push(badge);
        newBadges.push(badge);
      }
    }

    // Team-Battle Badge (mindestens 1 Session = Teilnahme)
    if (sessionCount >= 1 && !earnedBadges.find(b => b.id === 'swim_team_battle')) {
      const badge = { id: 'swim_team_battle', earnedAt: Date.now() };
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
              user_id: user.id,
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
      showToast('Material hinzugefügt!', 'success');
    } catch (error) {
      console.error('Material error:', error);
      showToast('Fehler beim Hinzufügen', 'error');
    }
  };

  const addResource = async () => {
    if (!resourceTitle.trim() || !resourceUrl.trim()) return;

    // Only admins can add resources
    if (user.role !== 'admin') {
      showToast('Nur Administratoren können Ressourcen hinzufügen', 'warning');
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
      showToast('Bitte gib eine gültige URL ein (mit https://)', 'warning');
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
      showToast('Ressource hinzugefügt!', 'success');
    } catch (error) {
      console.error('Resource error:', error);
      showToast('Fehler beim Hinzufügen', 'error');
    }
  };

  const deleteResource = async (resourceId) => {
    // Only admins can delete resources
    if (user.role !== 'admin') {
      showToast('Nur Administratoren können Ressourcen löschen', 'warning');
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

  const deleteNews = async (newsId) => {
    if (!user?.permissions.canPostNews) return;
    if (!confirm('Diese Ankündigung wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId);

      if (error) throw error;

      setNews(news.filter(n => n.id !== newsId));
    } catch (error) {
      console.error('Delete news error:', error);
      alert('Fehler beim Löschen der Ankündigung');
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

  // Impressum vor Login
  if (!user && authView === 'impressum') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setAuthView('login')}
            className="mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-500 transition-colors"
          >
            ← Zurück zum Login
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">📜 Impressum</h2>

          <div className="space-y-4 text-gray-700 text-sm">
            <section>
              <h3 className="font-bold text-gray-800">Angaben gemäß § 5 TMG</h3>
              <p>Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">Kontakt</h3>
              <p>E-Mail: denniegulbinski@gmail.com</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">Verantwortlich für den Inhalt</h3>
              <p>Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Datenschutz vor Login
  if (!user && authView === 'datenschutz') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 25%, #0891b2 50%, #0e7490 75%, #155e75 100%)'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setAuthView('login')}
            className="mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-500 transition-colors"
          >
            ← Zurück zum Login
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">🔒 Datenschutzerklärung</h2>
          <p className="text-xs text-gray-500 mb-4">Stand: Januar 2025 | Diese Datenschutzerklärung gilt für die Nutzung der Bäder-Azubi App.</p>

          <div className="space-y-4 text-gray-700 text-sm">
            <section>
              <h3 className="font-bold text-gray-800">1. Verantwortlicher</h3>
              <p>Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg<br/>E-Mail: denniegulbinski@gmail.com</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">2. Zwecke der Datenverarbeitung</h3>
              <p>Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zur:</p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Bereitstellung der App-Funktionen</li>
                <li>Unterstützung von Ausbildungsprozessen (Berichtsheft, Lernfortschritt, Kommunikation)</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">3. Verarbeitete Datenarten</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li><strong>Stammdaten:</strong> Name, E-Mail-Adresse, optional Geburtsdatum</li>
                <li><strong>Nutzungsdaten:</strong> Login-Zeitpunkte, aktive Module</li>
                <li><strong>Lern- & Ausbildungsdaten:</strong> Quiz-Ergebnisse, Berichtshefteinträge, Schwimmeinheiten, Schulungsfortschritte</li>
                <li><strong>Kommunikationsdaten:</strong> Chatnachrichten innerhalb der App</li>
                <li><strong>Ausbilderdaten:</strong> Kontrollkarten, Kommentare, Freigaben</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">4. Rechtsgrundlagen der Verarbeitung</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung/Ausbildungsverhältnis)</li>
                <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: z. B. Systembetrieb, Support)</li>
                <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z. B. für Chatfunktion)</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">5. Empfänger der Daten</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>IT-Dienstleister (z. B. Hosting, Wartung)</li>
                <li>Keine Weitergabe an Dritte zu Werbezwecken</li>
                <li>Datenverarbeitung erfolgt ausschließlich innerhalb der EU</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">6. Speicherdauer</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li><strong>Azubis:</strong> Löschung 3 Monate nach Ausbildungsende</li>
                <li><strong>Ausbilder:innen:</strong> Löschung 6 Monate nach Inaktivität</li>
                <li><strong>Admins:</strong> regelmäßige Löschprüfung jährlich</li>
                <li><strong>Chatnachrichten:</strong> max. 12 Monate, dann automatische Löschung</li>
                <li><strong>Berichtshefte:</strong> Löschung spätestens 1 Jahr nach Ausbildungsende</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">7. Betroffenenrechte</h3>
              <p>Du hast das Recht auf:</p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Auskunft (Art. 15 DSGVO)</li>
                <li>Berichtigung (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO)</li>
                <li>Einschränkung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch (Art. 21 DSGVO)</li>
                <li>Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
              </ul>
              <p className="mt-2">Anfragen bitte per E-Mail an: denniegulbinski@gmail.com</p>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">8. Cookies und lokale Speicherung</h3>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Die App nutzt kein Tracking</li>
                <li>Es wird ausschließlich Local Storage verwendet (z. B. für Einstellungen und Anmeldedaten)</li>
                <li>Es erfolgt keine Analyse oder Weitergabe dieser Daten</li>
              </ul>
            </section>
            <section>
              <h3 className="font-bold text-gray-800">9. Sicherheit der Verarbeitung</h3>
              <p>Zum Schutz deiner Daten setzen wir technische und organisatorische Maßnahmen ein:</p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Verschlüsselte Übertragung (TLS)</li>
                <li>Zugriffsrechte nach Rolle</li>
                <li>Datensicherung</li>
                <li>Regelmäßige Updates</li>
              </ul>
            </section>
            <section className="pt-2 border-t border-gray-200 text-xs text-gray-500">
              <p>Diese Datenschutzerklärung wird regelmäßig aktualisiert. Letzte Aktualisierung: Januar 2025</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex justify-center gap-4 text-xs text-gray-600">
              <button
                onClick={() => setAuthView('impressum')}
                className="text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                Impressum
              </button>
              <span>|</span>
              <button
                onClick={() => setAuthView('datenschutz')}
                className="text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                Datenschutz
              </button>
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

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-slide-in ${
              toast.type === 'success' ? 'bg-green-500/90 text-white' :
              toast.type === 'error' ? 'bg-red-500/90 text-white' :
              toast.type === 'warning' ? 'bg-yellow-500/90 text-white' :
              'bg-blue-500/90 text-white'
            }`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <span className="text-xl">{toast.icon}</span>
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-2 opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800' : 'bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600'} text-white p-4 shadow-lg relative z-10`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-3xl bg-white/20 rounded-full w-12 h-12 flex items-center justify-center">
              {user.avatar ? AVATARS.find(a => a.id === user.avatar)?.emoji || '🏊‍♂️' : '🏊‍♂️'}
            </div>
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
              onClick={async () => {
                await supabase.auth.signOut();
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
            { id: 'quiz', icon: '🎮', label: 'Quizduell', show: true },
            { id: 'swim-challenge', icon: '🏊', label: 'Schwimm-Challenge', show: true },
            { id: 'stats', icon: '🏅', label: 'Statistiken', show: true },
            { id: 'trainer-dashboard', icon: '👨‍🏫', label: 'Azubi-Übersicht', show: user.permissions.canViewAllStats },
            { id: 'chat', icon: '💬', label: 'Chat', show: true },
            { id: 'materials', icon: '📚', label: 'Lernen', show: true },
            { id: 'resources', icon: '🔗', label: 'Ressourcen', show: true },
            { id: 'news', icon: '📢', label: 'News', show: true },
            { id: 'exams', icon: '📋', label: 'Klasuren', show: true },
            { id: 'questions', icon: '💡', label: 'Fragen', show: true },
            { id: 'school-card', icon: '🎓', label: 'Kontrollkarte', show: true },
            { id: 'berichtsheft', icon: '📖', label: 'Berichtsheft', show: true },
            { id: 'profile', icon: '👤', label: 'Profil', show: true },
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
        {/* Admin Panel */}
        {currentView === 'admin' && user.permissions.canManageUsers && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-8 text-center relative">
              <h2 className="text-3xl font-bold mb-2">👑 Admin-Bereich</h2>
              <p className="opacity-90">Nutzerverwaltung & Datenschutz</p>
              <div className="absolute bottom-2 right-3 text-xs opacity-60">v1.1.0</div>
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
                                await supabase.from('profiles').delete().eq('email', acc.email);
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
                          {acc.role === 'trainer' && (
                            <button
                              onClick={() => toggleSchoolCardPermission(acc.id, acc.can_view_school_cards)}
                              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                acc.can_view_school_cards
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={acc.can_view_school_cards ? 'Kontrollkarten-Zugriff entziehen' : 'Kontrollkarten-Zugriff erteilen'}
                            >
                              🎓 {acc.can_view_school_cards ? '✓' : '○'}
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
              {/* Profil-Button */}
              <button
                onClick={() => setCurrentView('profile')}
                className={`mt-4 inline-flex items-center gap-2 px-6 py-3 ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/20 hover:bg-white/30'} backdrop-blur-sm rounded-lg border-2 ${darkMode ? 'border-white/20' : 'border-white/30'} transition-all font-medium`}
              >
                <span className="text-xl">👤</span>
                <span>Mein Profil</span>
              </button>
            </div>

            {/* Daily Challenges Section */}
            {dailyChallenges.length > 0 && (
              <div className={`${darkMode ? 'bg-gradient-to-r from-orange-900/80 via-amber-900/80 to-orange-900/80' : 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50'} backdrop-blur-sm border-2 ${darkMode ? 'border-orange-700' : 'border-orange-300'} rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold flex items-center ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                    <Target className="mr-2" />
                    🎯 Tägliche Challenges
                  </h3>
                  <div className={`flex items-center gap-2 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                    <span className="text-sm font-medium">{getCompletedChallengesCount()}/3 erledigt</span>
                    {getCompletedChallengesCount() === 3 && <span className="text-xl">🏆</span>}
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {dailyChallenges.map((challenge, idx) => {
                    const progress = getChallengeProgress(challenge);
                    const completed = isChallengeCompleted(challenge);
                    const percentage = Math.min((progress / challenge.target) * 100, 100);

                    return (
                      <div
                        key={idx}
                        className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-4 shadow-md transition-all ${
                          completed ? 'ring-2 ring-green-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{challenge.icon}</span>
                          {completed && <span className="text-green-500 text-xl">✓</span>}
                        </div>
                        <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {challenge.name}
                        </h4>
                        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {challenge.target} {challenge.unit}
                          {challenge.category && ` ${challenge.category.name}`}
                        </p>
                        <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-3 mb-2`}>
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              completed ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {progress}/{challenge.target}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            completed
                              ? 'bg-green-100 text-green-700'
                              : darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'
                          }`}>
                            +{challenge.xpReward} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {getCompletedChallengesCount() === 3 && (
                  <div className={`mt-4 text-center p-3 rounded-lg ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                    <p className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                      🎉 Alle Challenges geschafft! Du hast heute {getTotalXPEarned()} XP verdient!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Win Streak Banner */}
            {userStats && userStats.winStreak >= 3 && (
              <div className={`${
                userStats.winStreak >= 10
                  ? darkMode ? 'bg-gradient-to-r from-orange-900/80 via-red-900/80 to-orange-900/80 border-orange-500' : 'bg-gradient-to-r from-orange-100 via-red-100 to-orange-100 border-orange-400'
                  : darkMode ? 'bg-gradient-to-r from-yellow-900/80 via-amber-900/80 to-yellow-900/80 border-yellow-600' : 'bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-yellow-400'
              } backdrop-blur-sm border-2 rounded-xl p-4 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl animate-pulse">
                      {userStats.winStreak >= 25 ? '💎' : userStats.winStreak >= 15 ? '🏆' : userStats.winStreak >= 10 ? '🔥' : userStats.winStreak >= 5 ? '⚡' : '💪'}
                    </span>
                    <div>
                      <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {userStats.winStreak} Siege in Folge!
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {userStats.winStreak >= 25 ? 'Legendäre Serie!' :
                         userStats.winStreak >= 15 ? 'Dominanz pur!' :
                         userStats.winStreak >= 10 ? 'Unaufhaltsam!' :
                         userStats.winStreak >= 5 ? 'Durchstarter!' : 'Weiter so!'}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className="text-sm">Nächster Meilenstein</p>
                    <p className="font-bold">
                      {(() => {
                        const milestones = [3, 5, 10, 15, 25, 50];
                        const next = milestones.find(m => m > userStats.winStreak);
                        return next ? `${next - userStats.winStreak} bis ${next}` : 'Maximum erreicht!';
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Spaced Repetition Reminder */}
            {getTotalDueCards() > 0 && (
              <div className={`${darkMode ? 'bg-purple-900/80' : 'bg-purple-50/95'} backdrop-blur-sm border-2 ${darkMode ? 'border-purple-700' : 'border-purple-300'} rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className={`mr-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                        🧠 Lernkarten zur Wiederholung
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        {getTotalDueCards()} Karten sind heute fällig
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSpacedRepetitionMode(true);
                      setCurrentView('flashcards');
                      playSound('splash');
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold shadow-md flex items-center gap-2"
                  >
                    <Zap size={18} />
                    Jetzt wiederholen
                  </button>
                </div>
              </div>
            )}

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

              <div className={`${darkMode ? 'bg-slate-800/95 border-green-600' : 'bg-white/95 border-green-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-400`}
                   onClick={() => {
                     setCurrentView('quiz');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🎮</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>Quizduell</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fordere andere heraus!</p>
              </div>

              <div className={`${darkMode ? 'bg-slate-800/95 border-cyan-600' : 'bg-white/95 border-cyan-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-400`}
                   onClick={() => {
                     setCurrentView('swim-challenge');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🏊</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Schwimm-Challenge</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Azubis vs. Trainer!</p>
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

              {/* Berichtsheft */}
              <div className={`${darkMode ? 'bg-slate-800/95 border-teal-600' : 'bg-white/95 border-teal-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-teal-400`}
                   onClick={() => {
                     setCurrentView('berichtsheft');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">📖</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>Berichtsheft</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Ausbildungsnachweis</p>
              </div>

              {/* Kontrollkarte Berufsschule */}
              <div className={`${darkMode ? 'bg-slate-800/95 border-orange-600' : 'bg-white/95 border-orange-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-orange-400`}
                   onClick={() => {
                     setCurrentView('school-card');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">🎓</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>Kontrollkarte</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Berufsschule</p>
              </div>

              {/* Fragen einreichen */}
              <div className={`${darkMode ? 'bg-slate-800/95 border-amber-600' : 'bg-white/95 border-amber-200'} backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 hover:border-amber-400`}
                   onClick={() => {
                     setCurrentView('questions');
                     playSound('splash');
                   }}>
                <div className="text-5xl mb-3 text-center">💡</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>Fragen</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Einreichen & lernen</p>
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
                  <p className="text-2xl font-bold text-gray-400">Kategorie {(currentGame.categoryRound || 0) + 1}/4</p>
                  {quizCategory && (
                    <p className="text-sm text-gray-500 mt-1">
                      Frage {questionInCategory + 1}/5
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    {playerTurn === user.name ? '⚡ Du bist dran!' : `${playerTurn} ist dran...`}
                  </p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-sm text-gray-600 mb-1">{currentGame.player2}</p>
                  <p className="text-3xl font-bold text-red-600">{currentGame.player2Score}</p>
                </div>
              </div>

              {/* Kategorie-Übersicht */}
              {currentGame.categoryRounds && currentGame.categoryRounds.length > 0 && !currentQuestion && (
                <div className="mb-4 flex justify-center gap-2 flex-wrap">
                  {currentGame.categoryRounds.map((cr, idx) => {
                    const cat = CATEGORIES.find(c => c.id === cr.categoryId);
                    return (
                      <span key={idx} className={`${cat?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm`}>
                        {cat?.icon} {cat?.name}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Kategorie wählen - nur wenn ich dran bin UND noch keine Kategorie gewählt wurde */}
              {!quizCategory && playerTurn === user.name && !waitingForOpponent && (
                <div>
                  <h3 className="text-xl font-bold text-center mb-4">Wähle eine Kategorie:</h3>
                  <p className="text-center text-gray-500 mb-4">Du wählst 5 Fragen - danach spielt {currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1} die gleichen Fragen!</p>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.filter(cat => {
                      // Bereits gespielte Kategorien ausblenden
                      const played = currentGame.categoryRounds?.map(cr => cr.categoryId) || [];
                      return !played.includes(cat.id);
                    }).map(cat => (
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

              {/* Spieler 2 muss die gleichen Fragen spielen */}
              {!currentQuestion && playerTurn === user.name && currentGame.categoryRounds && currentGame.categoryRounds.length > 0 && (() => {
                const currentCatRound = currentGame.categoryRounds[currentGame.categoryRound || 0];
                if (!currentCatRound) return false;
                const isPlayer1 = user.name === currentGame.player1;
                const myAnswers = isPlayer1 ? currentCatRound.player1Answers : currentCatRound.player2Answers;
                return myAnswers.length === 0 && currentCatRound.questions.length > 0;
              })() && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-xl font-bold mb-2">
                    {(() => {
                      const currentCatRound = currentGame.categoryRounds[currentGame.categoryRound || 0];
                      return currentCatRound?.categoryName || 'Kategorie';
                    })()}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {currentGame.player1 === user.name ? currentGame.player2 : currentGame.player1} hat diese Kategorie gespielt. Jetzt bist du dran mit den gleichen 5 Fragen!
                  </p>
                  <button
                    onClick={startCategoryAsSecondPlayer}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                  >
                    Los geht's! 🚀
                  </button>
                </div>
              )}

              {/* Warte auf anderen Spieler */}
              {!quizCategory && playerTurn !== user.name && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⏳</div>
                  <p className="text-xl text-gray-600">Warte auf {playerTurn}...</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {waitingForOpponent ? 'Dein Gegner spielt jetzt die gleichen Fragen' : 'Dein Gegner wählt eine Kategorie'}
                  </p>
                </div>
              )}

              {/* Frage anzeigen */}
              {currentQuestion && playerTurn === user.name && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {(() => {
                          const cat = CATEGORIES.find(c => c.id === quizCategory);
                          return cat ? `${cat.icon} ${cat.name}` : 'Frage';
                        })()}
                      </span>
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
                    {currentQuestion.multi && !answered && (
                      <p className="text-center text-sm text-orange-600 mt-2 font-medium">
                        ⚠️ Mehrere Antworten sind richtig - wähle alle richtigen aus!
                      </p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    {currentQuestion.a.map((answer, idx) => {
                      // Multi-Select Logik
                      const isMulti = currentQuestion.multi;
                      const isSelectedMulti = selectedAnswers.includes(idx);
                      const isSelectedSingle = lastSelectedAnswer === idx;
                      const isCorrectAnswer = isMulti
                        ? currentQuestion.correct.includes(idx)
                        : idx === currentQuestion.correct;

                      let buttonClass = '';
                      if (answered) {
                        if (isCorrectAnswer) {
                          buttonClass = 'bg-green-500 text-white'; // Richtige Antwort grün
                        } else if ((isMulti && isSelectedMulti) || (!isMulti && isSelectedSingle)) {
                          buttonClass = 'bg-red-500 text-white'; // Falsch ausgewählt rot
                        } else {
                          buttonClass = 'bg-gray-200 text-gray-500';
                        }
                      } else {
                        if (isMulti && isSelectedMulti) {
                          buttonClass = 'bg-blue-500 text-white border-2 border-blue-600';
                        } else {
                          buttonClass = 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => answerQuestion(idx)}
                          disabled={answered}
                          className={`p-4 rounded-xl font-medium transition-all ${buttonClass}`}
                        >
                          {isMulti && !answered && (
                            <span className="mr-2">{isSelectedMulti ? '☑️' : '⬜'}</span>
                          )}
                          {answer}
                        </button>
                      );
                    })}
                  </div>
                  {/* Multi-Select Bestätigen Button */}
                  {currentQuestion.multi && !answered && selectedAnswers.length > 0 && (
                    <button
                      onClick={confirmMultiSelectAnswer}
                      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                    >
                      ✓ Antwort bestätigen ({selectedAnswers.length} ausgewählt)
                    </button>
                  )}
                  {answered && timeLeft === 0 && (
                    <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 text-center">
                      <p className="text-red-700 font-bold">⏰ Zeit abgelaufen!</p>
                    </div>
                  )}
                  {answered && (
                    <button
                      onClick={proceedToNextRound}
                      className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                    >
                      Weiter →
                    </button>
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
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
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

                  {/* Win Streak Anzeige */}
                  <div className={`${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{userStats.winStreak >= 10 ? '🔥' : userStats.winStreak >= 5 ? '⚡' : userStats.winStreak >= 3 ? '💪' : '🎯'}</span>
                        <div>
                          <div className="text-2xl font-bold">
                            {userStats.winStreak || 0} Siege in Folge
                          </div>
                          <div className="text-sm opacity-80">
                            Rekord: {userStats.bestWinStreak || 0} Siege
                          </div>
                        </div>
                      </div>
                      {/* Nächster Meilenstein */}
                      {(() => {
                        const current = userStats.winStreak || 0;
                        const milestones = [3, 5, 10, 15, 25, 50];
                        const nextMilestone = milestones.find(m => m > current);
                        if (nextMilestone) {
                          const remaining = nextMilestone - current;
                          return (
                            <div className="text-right">
                              <div className="text-sm opacity-80">Nächster Meilenstein</div>
                              <div className="font-bold">
                                Noch {remaining} {remaining === 1 ? 'Sieg' : 'Siege'} bis {nextMilestone}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className="text-right">
                            <div className="text-2xl">💎</div>
                            <div className="text-sm font-bold">Unbesiegbar!</div>
                          </div>
                        );
                      })()}
                    </div>
                    {/* Streak Progress Bar */}
                    {(() => {
                      const current = userStats.winStreak || 0;
                      const milestones = [3, 5, 10, 15, 25, 50];
                      const nextMilestone = milestones.find(m => m > current) || 50;
                      const prevMilestone = [...milestones].reverse().find(m => m <= current) || 0;
                      const progress = ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
                      return (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1 opacity-70">
                            <span>{prevMilestone}</span>
                            <span>{nextMilestone}</span>
                          </div>
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>

            {/* Badges Section */}
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🏆 Deine Badges
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {userBadges.length} von {BADGES.length} Badges freigeschaltet
              </p>

              {/* Quiz-Badges */}
              <h4 className={`text-lg font-bold mt-4 mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📚 Quiz & Lernen
                <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                  {userBadges.filter(b => BADGES.find(badge => badge.id === b.id && badge.category === 'quiz')).length} / {BADGES.filter(b => b.category === 'quiz').length}
                </span>
              </h4>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {BADGES.filter(b => b.category === 'quiz').map(badge => {
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

              {/* Schwimm-Badges */}
              <h4 className={`text-lg font-bold mt-6 mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🏊 Schwimm-Challenge
                <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                  {userBadges.filter(b => BADGES.find(badge => badge.id === b.id && badge.category === 'swim')).length} / {BADGES.filter(b => b.category === 'swim').length}
                </span>
              </h4>
              <div className="grid md:grid-cols-4 gap-4">
                {BADGES.filter(b => b.category === 'swim').map(badge => {
                  const earned = userBadges.find(b => b.id === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl text-center transition-all ${
                        earned
                          ? darkMode
                            ? 'bg-gradient-to-br from-cyan-900 to-blue-800 border-2 border-cyan-600'
                            : 'bg-gradient-to-br from-cyan-100 to-blue-200 border-2 border-cyan-400'
                          : darkMode
                            ? 'bg-slate-700 opacity-40'
                            : 'bg-gray-100 opacity-40'
                      }`}
                    >
                      <div className="text-5xl mb-2">{badge.icon}</div>
                      <p className={`font-bold mb-1 ${earned ? darkMode ? 'text-cyan-200' : 'text-cyan-800' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {badge.name}
                      </p>
                      <p className={`text-xs ${earned ? darkMode ? 'text-cyan-300' : 'text-cyan-700' : darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                        {badge.description}
                      </p>
                      {earned && (
                        <p className={`text-xs mt-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
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
                <div key={msg.id} className={`flex items-end gap-2 ${msg.user === user.name ? 'justify-end' : 'justify-start'}`}>
                  {msg.user !== user.name && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg flex-shrink-0">
                      {msg.avatar ? AVATARS.find(a => a.id === msg.avatar)?.emoji || msg.user.charAt(0).toUpperCase() : msg.user.charAt(0).toUpperCase()}
                    </div>
                  )}
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
                  {msg.user === user.name && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                      {user.avatar ? AVATARS.find(a => a.id === user.avatar)?.emoji || user.name.charAt(0).toUpperCase() : user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
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
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      {user?.permissions.canPostNews && (
                        <button
                          onClick={() => deleteNews(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-all"
                          title="Löschen"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
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
                  {examCurrentQuestion.multi && !examAnswered && (
                    <p className="text-center text-sm text-orange-600 mt-2 font-medium">
                      ⚠️ Mehrere Antworten sind richtig - wähle alle richtigen aus!
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  {examCurrentQuestion.a.map((answer, idx) => {
                    const isMulti = examCurrentQuestion.multi;
                    const isSelected = isMulti ? examSelectedAnswers.includes(idx) : examSelectedAnswer === idx;
                    const isCorrectAnswer = isMulti
                      ? examCurrentQuestion.correct.includes(idx)
                      : idx === examCurrentQuestion.correct;

                    let buttonClass = '';
                    if (examAnswered) {
                      if (isCorrectAnswer) {
                        buttonClass = 'bg-green-500 text-white'; // Richtige Antwort grün
                      } else if (isSelected && !isCorrectAnswer) {
                        buttonClass = 'bg-red-500 text-white'; // Falsch ausgewählt rot
                      } else {
                        buttonClass = darkMode ? 'bg-slate-600 text-gray-400' : 'bg-gray-200 text-gray-500';
                      }
                    } else {
                      if (isMulti && isSelected) {
                        buttonClass = 'bg-blue-500 text-white border-2 border-blue-600';
                      } else {
                        buttonClass = darkMode
                          ? 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600 hover:border-cyan-500 text-white'
                          : 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => answerExamQuestion(idx)}
                        disabled={examAnswered}
                        className={`p-4 rounded-xl font-medium transition-all text-left ${buttonClass}`}
                      >
                        {isMulti && !examAnswered && (
                          <span className="mr-2">{isSelected ? '☑️' : '⬜'}</span>
                        )}
                        {answer}
                      </button>
                    );
                  })}
                </div>

                {/* Multi-Select Bestätigen Button */}
                {examCurrentQuestion.multi && !examAnswered && examSelectedAnswers.length > 0 && (
                  <button
                    onClick={confirmExamMultiSelectAnswer}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                  >
                    ✓ Antwort bestätigen ({examSelectedAnswers.length} ausgewählt)
                  </button>
                )}
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

              {/* Lernmodus Umschalter */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setSpacedRepetitionMode(false);
                    loadFlashcards();
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                    !spacedRepetitionMode
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📚 Alle Karten
                </button>
                <button
                  onClick={() => {
                    setSpacedRepetitionMode(true);
                    const due = loadDueCards(newQuestionCategory);
                    if (due.length > 0) {
                      setFlashcards(due);
                      setFlashcardIndex(0);
                      setCurrentFlashcard(due[0]);
                      setShowFlashcardAnswer(false);
                    }
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    spacedRepetitionMode
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🧠 Spaced Repetition
                  {getDueCardCount(newQuestionCategory) > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {getDueCardCount(newQuestionCategory)}
                    </span>
                  )}
                </button>
              </div>

              {/* Spaced Repetition Info */}
              {spacedRepetitionMode && (
                <div className={`${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-lg p-4 mb-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                      🧠 Spaced Repetition Modus
                    </h4>
                    <span className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {dueCards.length} Karten fällig
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                    Beantworte mit "Gewusst" oder "Nicht gewusst". Karten die du nicht wusstest kommen früher wieder.
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map(level => (
                      <div key={level} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${getLevelColor(level)}`}></div>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getLevelLabel(level)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kategorien mit fälligen Karten Übersicht */}
              {spacedRepetitionMode && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {CATEGORIES.map(cat => {
                    const dueCount = getDueCardCount(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setNewQuestionCategory(cat.id);
                          const due = loadDueCards(cat.id);
                          if (due.length > 0) {
                            setFlashcards(due);
                            setFlashcardIndex(0);
                            setCurrentFlashcard(due[0]);
                            setShowFlashcardAnswer(false);
                          } else {
                            setFlashcards([]);
                            setCurrentFlashcard(null);
                          }
                        }}
                        className={`p-3 rounded-lg text-left transition-all ${
                          newQuestionCategory === cat.id
                            ? `${cat.color} text-white`
                            : darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{cat.icon}</span>
                          {dueCount > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              newQuestionCategory === cat.id
                                ? 'bg-white/30 text-white'
                                : 'bg-red-500 text-white'
                            }`}>
                              {dueCount}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 truncate ${
                          newQuestionCategory === cat.id
                            ? 'text-white/80'
                            : darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {cat.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {!spacedRepetitionMode && (
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
              )}
            </div>

            {currentFlashcard && flashcards.length > 0 && (
              <div className="perspective-1000">
                {/* Spaced Repetition Level Badge */}
                {spacedRepetitionMode && currentFlashcard.spacedData && (
                  <div className="flex justify-center mb-4">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      darkMode ? 'bg-slate-700' : 'bg-gray-100'
                    }`}>
                      <div className={`w-4 h-4 rounded-full ${getLevelColor(currentFlashcard.spacedData.level)}`}></div>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {getLevelLabel(currentFlashcard.spacedData.level)}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        • {currentFlashcard.spacedData.reviewCount || 0}x wiederholt
                      </span>
                    </div>
                  </div>
                )}

                <div
                  onClick={() => {
                    setShowFlashcardAnswer(!showFlashcardAnswer);
                    playSound('bubble');
                  }}
                  className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 shadow-2xl cursor-pointer transform transition-all hover:scale-105 min-h-[300px] flex items-center justify-center ${
                    spacedRepetitionMode && currentFlashcard.spacedData
                      ? `border-4 ${getLevelColor(currentFlashcard.spacedData.level).replace('bg-', 'border-')}`
                      : ''
                  }`}
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

                {/* Spaced Repetition Buttons */}
                {spacedRepetitionMode && showFlashcardAnswer && (
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => {
                        const newLevel = updateCardSpacedData(currentFlashcard, newQuestionCategory, false);
                        playSound('wrong');

                        // Nächste Karte oder fertig
                        if (flashcardIndex < flashcards.length - 1) {
                          const nextIdx = flashcardIndex + 1;
                          setFlashcardIndex(nextIdx);
                          setCurrentFlashcard(flashcards[nextIdx]);
                          setShowFlashcardAnswer(false);
                        } else {
                          // Alle Karten durchgearbeitet
                          const remaining = loadDueCards(newQuestionCategory);
                          if (remaining.length > 0) {
                            setFlashcards(remaining);
                            setFlashcardIndex(0);
                            setCurrentFlashcard(remaining[0]);
                            setShowFlashcardAnswer(false);
                          } else {
                            setCurrentFlashcard(null);
                            setFlashcards([]);
                          }
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-lg"
                    >
                      ❌ Nicht gewusst
                    </button>
                    <button
                      onClick={() => {
                        const newLevel = updateCardSpacedData(currentFlashcard, newQuestionCategory, true);
                        playSound('correct');

                        // Nächste Karte oder fertig
                        if (flashcardIndex < flashcards.length - 1) {
                          const nextIdx = flashcardIndex + 1;
                          setFlashcardIndex(nextIdx);
                          setCurrentFlashcard(flashcards[nextIdx]);
                          setShowFlashcardAnswer(false);
                        } else {
                          // Alle Karten durchgearbeitet
                          const remaining = loadDueCards(newQuestionCategory);
                          if (remaining.length > 0) {
                            setFlashcards(remaining);
                            setFlashcardIndex(0);
                            setCurrentFlashcard(remaining[0]);
                            setShowFlashcardAnswer(false);
                          } else {
                            setCurrentFlashcard(null);
                            setFlashcards([]);
                          }
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-lg"
                    >
                      ✅ Gewusst
                    </button>
                  </div>
                )}

                {/* Standard Navigation (nicht im Spaced Repetition Modus oder Antwort noch nicht gezeigt) */}
                {(!spacedRepetitionMode || !showFlashcardAnswer) && (
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
                )}
              </div>
            )}

            {(!currentFlashcard || flashcards.length === 0) && (
              <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-12 text-center`}>
                <div className="text-6xl mb-4">{spacedRepetitionMode ? '🎉' : '🎴'}</div>
                <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {spacedRepetitionMode ? 'Alle Karten wiederholt!' : 'Keine Karteikarten'}
                </p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {spacedRepetitionMode
                    ? 'Super! Du hast alle fälligen Karten in dieser Kategorie durchgearbeitet. Komm später wieder!'
                    : 'Noch keine Karteikarten in dieser Kategorie. Erstelle die erste!'}
                </p>
                {spacedRepetitionMode && (
                  <button
                    onClick={() => {
                      setSpacedRepetitionMode(false);
                      loadFlashcards();
                    }}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    📚 Alle Karten anzeigen
                  </button>
                )}
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

        {/* Kontrollkarte Berufsschule View */}
        {currentView === 'school-card' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🎓 Kontrollkarte Berufsschule
                {selectedSchoolCardUser && (
                  <span className="ml-3 text-lg font-normal text-cyan-500">
                    - {selectedSchoolCardUser.name}
                  </span>
                )}
              </h2>

              {/* Azubi-Auswahl für berechtigte User */}
              {canViewAllSchoolCards() && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-purple-50 to-pink-50'} rounded-xl p-4 mb-6`}>
                  <h3 className={`font-bold mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                    👀 Azubi-Kontrollkarten einsehen
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedSchoolCardUser(null);
                        loadSchoolAttendance(user.id);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        !selectedSchoolCardUser
                          ? 'bg-cyan-500 text-white'
                          : (darkMode ? 'bg-slate-600 text-gray-300 hover:bg-slate-500' : 'bg-white text-gray-700 hover:bg-gray-100')
                      }`}
                    >
                      📝 Meine Karte
                    </button>
                    {allAzubisForSchoolCard.map(azubi => (
                      <button
                        key={azubi.id}
                        onClick={() => {
                          setSelectedSchoolCardUser(azubi);
                          loadSchoolAttendance(azubi.id);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedSchoolCardUser?.id === azubi.id
                            ? 'bg-purple-500 text-white'
                            : (darkMode ? 'bg-slate-600 text-gray-300 hover:bg-slate-500' : 'bg-white text-gray-700 hover:bg-gray-100')
                        }`}
                      >
                        👨‍🎓 {azubi.name}
                      </button>
                    ))}
                  </div>
                  {allAzubisForSchoolCard.length === 0 && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Keine Azubis vorhanden.
                    </p>
                  )}
                </div>
              )}

              {/* Neuer Eintrag Form - nur für eigene Karte */}
              {!selectedSchoolCardUser && (
                <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-6 mb-6`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Neuen Eintrag hinzufügen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum</label>
                      <input
                        type="date"
                        value={newAttendanceDate}
                        onChange={(e) => setNewAttendanceDate(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Beginn</label>
                      <input
                        type="time"
                        value={newAttendanceStart}
                        onChange={(e) => setNewAttendanceStart(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ende</label>
                      <input
                        type="time"
                        value={newAttendanceEnd}
                        onChange={(e) => setNewAttendanceEnd(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addSchoolAttendance}
                    className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
                  >
                    <Plus className="inline mr-2" size={18} />
                    Eintrag hinzufügen
                  </button>
                </div>
              )}

              {/* Hinweis wenn fremde Karte angezeigt wird */}
              {selectedSchoolCardUser && (
                <div className={`${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-xl p-4 mb-6 border-2 ${darkMode ? 'border-purple-700' : 'border-purple-200'}`}>
                  <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    👀 Du siehst die Kontrollkarte von <strong>{selectedSchoolCardUser.name}</strong>. Nur der Azubi selbst kann Einträge hinzufügen.
                  </p>
                </div>
              )}

              {/* Tabelle mit Einträgen */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                      <th className={`px-4 py-3 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum</th>
                      <th className={`px-4 py-3 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Beginn</th>
                      <th className={`px-4 py-3 text-left font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ende</th>
                      <th className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lehrer ✍️</th>
                      <th className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbilder ✍️</th>
                      <th className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolAttendance.map((entry, idx) => (
                      <tr key={entry.id} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'} ${idx % 2 === 0 ? (darkMode ? 'bg-slate-800' : 'bg-white') : (darkMode ? 'bg-slate-750' : 'bg-gray-50')}`}>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {new Date(entry.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entry.start_time}</td>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entry.end_time}</td>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          <div
                            onClick={() => setSignatureModal({ id: entry.id, field: 'teacher_signature', currentValue: entry.teacher_signature })}
                            className={`cursor-pointer rounded min-h-[50px] flex items-center justify-center ${entry.teacher_signature && entry.teacher_signature.startsWith('data:image') ? '' : (darkMode ? 'bg-slate-700' : 'bg-gray-100')} hover:opacity-80 transition-all border-2 border-dashed ${darkMode ? 'border-slate-600 hover:border-green-500' : 'border-gray-300 hover:border-green-500'}`}
                          >
                            {entry.teacher_signature && entry.teacher_signature.startsWith('data:image') ? (
                              <img src={entry.teacher_signature} alt="Unterschrift Lehrer" className="h-12 max-w-[120px] object-contain" />
                            ) : (
                              <span className={`italic text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>✍️ Unterschreiben</span>
                            )}
                          </div>
                        </td>
                        <td className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          <div
                            onClick={() => setSignatureModal({ id: entry.id, field: 'trainer_signature', currentValue: entry.trainer_signature })}
                            className={`cursor-pointer rounded min-h-[50px] flex items-center justify-center ${entry.trainer_signature && entry.trainer_signature.startsWith('data:image') ? '' : (darkMode ? 'bg-slate-700' : 'bg-gray-100')} hover:opacity-80 transition-all border-2 border-dashed ${darkMode ? 'border-slate-600 hover:border-blue-500' : 'border-gray-300 hover:border-blue-500'}`}
                          >
                            {entry.trainer_signature && entry.trainer_signature.startsWith('data:image') ? (
                              <img src={entry.trainer_signature} alt="Unterschrift Ausbilder" className="h-12 max-w-[120px] object-contain" />
                            ) : (
                              <span className={`italic text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>✍️ Unterschreiben</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteSchoolAttendance(entry.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {schoolAttendance.length === 0 && (
                  <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-lg">Noch keine Einträge vorhanden</p>
                    <p className="text-sm mt-2">Füge deinen ersten Berufsschultag hinzu!</p>
                  </div>
                )}
              </div>

              {/* Zusammenfassung */}
              {schoolAttendance.length > 0 && (
                <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{schoolAttendance.length}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Einträge gesamt</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {schoolAttendance.filter(e => e.teacher_signature && e.teacher_signature.trim() !== '').length}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lehrer unterschrieben</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {schoolAttendance.filter(e => e.trainer_signature && e.trainer_signature.trim() !== '').length}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ausbilder unterschrieben</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        {schoolAttendance.filter(e => !e.teacher_signature?.trim() || !e.trainer_signature?.trim()).length}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offen</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Unterschrift Modal */}
            {signatureModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full shadow-2xl`}>
                  <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    ✍️ {signatureModal.field === 'teacher_signature' ? 'Unterschrift Lehrer' : 'Unterschrift Ausbilder'}
                  </h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Bitte unterschreiben Sie im Feld unten mit dem Finger oder Stift.
                  </p>
                  <div className="mb-4">
                    <SignatureCanvas
                      value={tempSignature || signatureModal.currentValue}
                      onChange={(sig) => setTempSignature(sig)}
                      darkMode={darkMode}
                      label={signatureModal.field === 'teacher_signature' ? 'Lehrer' : 'Ausbilder'}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (tempSignature) {
                          updateAttendanceSignature(signatureModal.id, signatureModal.field, tempSignature);
                        }
                        setSignatureModal(null);
                        setTempSignature(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-bold transition-all"
                    >
                      <Check className="inline mr-2" size={18} />
                      Speichern
                    </button>
                    <button
                      onClick={() => {
                        setSignatureModal(null);
                        setTempSignature(null);
                      }}
                      className={`flex-1 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-3 rounded-lg font-bold transition-all ${darkMode ? 'text-white' : 'text-gray-700'}`}
                    >
                      <X className="inline mr-2" size={18} />
                      Abbrechen
                    </button>
                  </div>
                  {signatureModal.currentValue && signatureModal.currentValue.startsWith('data:image') && (
                    <button
                      onClick={() => {
                        updateAttendanceSignature(signatureModal.id, signatureModal.field, null);
                        setSignatureModal(null);
                        setTempSignature(null);
                      }}
                      className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      🗑️ Unterschrift löschen
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== SCHWIMMCHALLENGE VIEW ==================== */}
        {currentView === 'swim-challenge' && (
          <div className="space-y-6">
            {/* Header mit Team-Battle */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} text-white rounded-xl p-6 shadow-lg`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    🏊 Schwimm-Challenge
                  </h2>
                  <p className="opacity-90 mt-1">Trainiere, sammle Punkte und miss dich mit anderen!</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['overview', 'challenges', 'add', 'leaderboard', 'battle'].map(view => (
                    <button
                      key={view}
                      onClick={() => setSwimChallengeView(view)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${swimChallengeView === view ? 'bg-white text-cyan-600' : 'bg-white/20 hover:bg-white/30'}`}
                    >
                      {view === 'overview' && '📊 Übersicht'}
                      {view === 'challenges' && '🎯 Challenges'}
                      {view === 'add' && '➕ Einheit'}
                      {view === 'leaderboard' && '🏆 Bestenliste'}
                      {view === 'battle' && '⚔️ Team-Battle'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Team-Battle Banner */}
            {(() => {
              const battleStats = calculateTeamBattleStats(swimSessions);
              const currentMonth = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }).toUpperCase();
              const leading = battleStats.azubis.points > battleStats.trainer.points ? 'azubis' : battleStats.trainer.points > battleStats.azubis.points ? 'trainer' : 'tie';

              return (
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                  <div className="text-center mb-4">
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ⚔️ TEAM-BATTLE: {currentMonth}
                    </h3>
                    {leading !== 'tie' && (
                      <p className={`text-sm mt-1 ${leading === 'azubis' ? (darkMode ? 'text-cyan-400' : 'text-cyan-600') : (darkMode ? 'text-orange-400' : 'text-orange-600')}`}>
                        {leading === 'azubis' ? '👨‍🎓 Azubis führen!' : '👨‍🏫 Trainer führen!'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center flex-1">
                      <div className="text-3xl mb-1">👨‍🎓</div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Team Azubis</div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{battleStats.azubis.points} Pkt</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {battleStats.azubis.memberList.length} Teilnehmer
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-gray-400">VS</div>
                    <div className="text-center flex-1">
                      <div className="text-3xl mb-1">👨‍🏫</div>
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Team Trainer</div>
                      <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{battleStats.trainer.points} Pkt</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {battleStats.trainer.memberList.length} Teilnehmer
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
                      <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.percent}%` }}></div>
                      <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.trainer.percent}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{battleStats.azubis.percent.toFixed(0)}%</span>
                      <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{battleStats.trainer.percent.toFixed(0)}%</span>
                    </div>
                  </div>
                  {/* Distanz-Vergleich */}
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid grid-cols-2 gap-4 text-center text-sm`}>
                    <div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Gesamtdistanz</div>
                      <div className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{(battleStats.azubis.distance / 1000).toFixed(1)} km</div>
                    </div>
                    <div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Gesamtdistanz</div>
                      <div className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{(battleStats.trainer.distance / 1000).toFixed(1)} km</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Übersicht */}
            {swimChallengeView === 'overview' && (() => {
              const mySessions = swimSessions.filter(s => s.user_id === user?.id && s.confirmed);
              const totalDistance = mySessions.reduce((sum, s) => sum + (s.distance || 0), 0);
              const totalTime = mySessions.reduce((sum, s) => sum + (s.time_minutes || 0), 0);
              const completedChallenges = SWIM_CHALLENGES.filter(ch => {
                const progress = calculateChallengeProgress(ch, swimSessions, user?.id);
                return progress.percent >= 100;
              });
              const points = calculateSwimPoints(mySessions, completedChallenges.map(c => c.id));

              return (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">🏊</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {totalDistance >= 1000 ? `${(totalDistance / 1000).toFixed(1)} km` : `${totalDistance} m`}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gesamtdistanz</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">⏱️</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {totalTime >= 60 ? `${Math.floor(totalTime / 60)}h ${totalTime % 60}m` : `${totalTime} min`}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Trainingszeit</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">🎯</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{completedChallenges.length}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Challenges abgeschlossen</p>
                  </div>
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">⭐</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{points.total}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Punkte</p>
                  </div>
                </div>
              );
            })()}

            {/* Level-Anzeige */}
            {swimChallengeView === 'overview' && (() => {
              const mySessions = swimSessions.filter(s => s.user_id === user?.id && s.confirmed);
              const completedChallenges = SWIM_CHALLENGES.filter(ch => {
                const progress = calculateChallengeProgress(ch, swimSessions, user?.id);
                return progress.percent >= 100;
              });
              const points = calculateSwimPoints(mySessions, completedChallenges.map(c => c.id));
              const currentLevel = getSwimLevel(points.total);
              const progressPercent = currentLevel.nextLevel
                ? ((points.total - currentLevel.minPoints) / (currentLevel.nextLevel.minPoints - currentLevel.minPoints)) * 100
                : 100;

              return (
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dein Level</h3>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center text-3xl`}>
                      {currentLevel.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {currentLevel.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {currentLevel.nextLevel
                          ? `${points.total} / ${currentLevel.nextLevel.minPoints} Punkte bis ${currentLevel.nextLevel.name}`
                          : `${points.total} Punkte - Maximales Level erreicht! 🎉`
                        }
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all`} style={{ width: `${Math.min(100, progressPercent)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Punkte-Aufschlüsselung */}
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="flex justify-between">
                        <span>Distanz-Punkte (1 Pkt/100m):</span>
                        <span className="font-medium">{points.distancePoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zeit-Punkte (0.5 Pkt/Min):</span>
                        <span className="font-medium">{points.timePoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Challenge-Punkte:</span>
                        <span className="font-medium">{points.challengePoints}</span>
                      </div>
                    </div>
                  </div>
                  {/* Handicap-Info */}
                  {user?.birthDate && getAgeHandicap(user.birthDate) > 0 && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        <span>🎂</span>
                        <span>Alters-Handicap aktiv: <strong>{Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus</strong> bei Sprint-Challenges</span>
                      </div>
                    </div>
                  )}
                  {!user?.birthDate && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span>💡</span>
                        <span>Tipp: Trage dein <button onClick={() => setCurrentView('profile')} className="underline text-cyan-500 hover:text-cyan-400">Geburtsdatum im Profil</button> ein für Alters-Handicap bei Sprint-Challenges (ab 40 Jahren).</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Challenges Liste */}
            {swimChallengeView === 'challenges' && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap mb-4">
                  {['alle', 'distanz', 'sprint', 'ausdauer', 'regelmaessigkeit', 'technik'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSwimChallengeFilter(cat)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        swimChallengeFilter === cat
                          ? 'bg-cyan-500 text-white'
                          : (darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                      }`}
                    >
                      {cat === 'alle' && '🎯 Alle'}
                      {cat === 'distanz' && '🌊 Distanz'}
                      {cat === 'sprint' && '⚡ Sprint'}
                      {cat === 'ausdauer' && '💪 Ausdauer'}
                      {cat === 'regelmaessigkeit' && '📅 Regelmäßigkeit'}
                      {cat === 'technik' && '🏊 Technik'}
                    </button>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {SWIM_CHALLENGES.filter(c => swimChallengeFilter === 'alle' || c.category === swimChallengeFilter).map(challenge => {
                    const progress = calculateChallengeProgress(challenge, swimSessions, user?.id);
                    const isCompleted = progress.percent >= 100;

                    return (
                      <div key={challenge.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 shadow-lg ${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{challenge.icon}</span>
                            <div>
                              <h4 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {challenge.name}
                                {isCompleted && <span className="text-green-500">✓</span>}
                              </h4>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{challenge.description}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            isCompleted
                              ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                              : (darkMode ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-700')
                          }`}>
                            {isCompleted ? '✓ ' : '+'}{challenge.points} Pkt
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fortschritt</span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {challenge.type === 'distance' || challenge.type === 'single_distance'
                                ? `${(progress.current / 1000).toFixed(1)} / ${(challenge.target / 1000).toFixed(1)} km`
                                : `${progress.current} / ${challenge.target} ${challenge.unit}`
                              }
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-cyan-500'}`}
                              style={{ width: `${Math.min(100, progress.percent)}%` }}
                            ></div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (!activeSwimChallenges.includes(challenge.id)) {
                              saveActiveSwimChallenges([...activeSwimChallenges, challenge.id]);
                            }
                          }}
                          disabled={activeSwimChallenges.includes(challenge.id) || isCompleted}
                          className={`mt-4 w-full py-2 rounded-lg font-medium transition-all ${
                            isCompleted
                              ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                              : activeSwimChallenges.includes(challenge.id)
                                ? (darkMode ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-700')
                                : (darkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white')
                          }`}
                        >
                          {isCompleted ? '🏆 Abgeschlossen!' : activeSwimChallenges.includes(challenge.id) ? '✓ Aktiv' : 'Challenge starten'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trainingseinheit eintragen */}
            {swimChallengeView === 'add' && (
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ➕ Neue Trainingseinheit eintragen
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum</label>
                    <input
                      type="date"
                      value={swimSessionForm.date}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, date: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Schwimmstil</label>
                    <select
                      value={swimSessionForm.style}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, style: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      {SWIM_STYLES.map(style => (
                        <option key={style.id} value={style.id}>{style.icon} {style.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Distanz (Meter)</label>
                    <input
                      type="number"
                      value={swimSessionForm.distance}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, distance: e.target.value})}
                      placeholder="z.B. 1000"
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zeit (Minuten)</label>
                    <input
                      type="number"
                      value={swimSessionForm.time}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, time: e.target.value})}
                      placeholder="z.B. 25"
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Für Challenge (optional)</label>
                    <select
                      value={swimSessionForm.challengeId}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, challengeId: e.target.value})}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="">-- Keine Challenge --</option>
                      {activeSwimChallenges.map(id => {
                        const ch = SWIM_CHALLENGES.find(c => c.id === id);
                        return ch ? <option key={id} value={id}>{ch.icon} {ch.name}</option> : null;
                      })}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notizen</label>
                    <textarea
                      value={swimSessionForm.notes}
                      onChange={(e) => setSwimSessionForm({...swimSessionForm, notes: e.target.value})}
                      placeholder="Wie lief das Training?"
                      rows={2}
                      className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
                <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-300'}`}>
                  <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    ⚠️ Die Einheit muss von einem Trainer/Ausbilder bestätigt werden, bevor die Punkte gutgeschrieben werden.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (swimSessionForm.distance && swimSessionForm.time) {
                      const result = await saveSwimSession(swimSessionForm);
                      if (result.success) {
                        setSwimSessionForm({
                          date: new Date().toISOString().split('T')[0],
                          distance: '',
                          time: '',
                          style: 'kraul',
                          notes: '',
                          challengeId: ''
                        });
                        alert('Trainingseinheit eingereicht! Warte auf Bestätigung durch einen Trainer.');
                      } else {
                        alert('Fehler beim Speichern: ' + result.error);
                      }
                    }
                  }}
                  disabled={!swimSessionForm.distance || !swimSessionForm.time}
                  className={`mt-4 w-full py-3 rounded-lg font-bold transition-all ${
                    swimSessionForm.distance && swimSessionForm.time
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      : (darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400')
                  }`}
                >
                  📤 Einheit zur Bestätigung einreichen
                </button>
              </div>
            )}

            {/* Bestenliste */}
            {swimChallengeView === 'leaderboard' && (() => {
              // Aggregiere bestätigte Sessions pro Benutzer
              const confirmedSessions = swimSessions.filter(s => s.confirmed);
              const userStats = {};

              confirmedSessions.forEach(session => {
                const oderId = session.user_id;
                if (!userStats[oderId]) {
                  userStats[oderId] = {
                    user_id: session.user_id,
                    user_name: session.user_name,
                    user_role: session.user_role,
                    total_distance: 0,
                    total_time: 0,
                    session_count: 0,
                    styles: new Set()
                  };
                }
                userStats[oderId].total_distance += session.distance || 0;
                userStats[oderId].total_time += session.time_minutes || 0;
                userStats[oderId].session_count += 1;
                userStats[oderId].styles.add(session.style);
              });

              // Sortiere nach Gesamtdistanz
              const leaderboard = Object.values(userStats)
                .sort((a, b) => b.total_distance - a.total_distance);

              return (
                <div className="space-y-4">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      🏆 Bestenliste - Gesamtdistanz
                    </h3>

                    {leaderboard.length === 0 ? (
                      <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="text-5xl mb-4 block">🏊</span>
                        <p>Noch keine bestätigten Einträge vorhanden.</p>
                        <p className="text-sm mt-2">Trage deine erste Trainingseinheit ein!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.map((entry, index) => {
                          const medals = ['🥇', '🥈', '🥉'];
                          const medal = medals[index] || `${index + 1}.`;
                          const isCurrentUser = entry.user_id === user?.id;
                          const avgPace = entry.total_time > 0
                            ? ((entry.total_time / (entry.total_distance / 100))).toFixed(1)
                            : 0;

                          return (
                            <div
                              key={entry.user_id}
                              className={`p-4 rounded-lg flex items-center gap-4 transition-all ${
                                isCurrentUser
                                  ? (darkMode ? 'bg-cyan-900/50 border-2 border-cyan-500' : 'bg-cyan-50 border-2 border-cyan-400')
                                  : (darkMode ? 'bg-slate-700' : 'bg-gray-50')
                              }`}
                            >
                              <div className="text-3xl w-12 text-center">
                                {medal}
                              </div>
                              <div className="flex-1">
                                <div className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                  {entry.user_name}
                                  {isCurrentUser && <span className="text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full">Du</span>}
                                  <span className="text-sm font-normal opacity-70">
                                    {entry.user_role === 'azubi' ? '👨‍🎓' : '👨‍🏫'}
                                  </span>
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {entry.session_count} Einheiten • ⌀ {avgPace} Min/100m
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                  {(entry.total_distance / 1000).toFixed(1)} km
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {Math.floor(entry.total_time / 60)}h {entry.total_time % 60}min
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Top 3 Podium für > 3 Teilnehmer */}
                  {leaderboard.length >= 3 && (
                    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                      <h3 className={`font-bold text-lg mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        🏅 Podium
                      </h3>
                      <div className="flex items-end justify-center gap-4">
                        {/* Platz 2 */}
                        <div className="text-center">
                          <div className="text-4xl mb-2">🥈</div>
                          <div className={`w-24 h-20 ${darkMode ? 'bg-gray-500' : 'bg-gray-300'} rounded-t-lg flex items-center justify-center`}>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                              {(leaderboard[1].total_distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leaderboard[1].user_name.split(' ')[0]}
                          </div>
                        </div>
                        {/* Platz 1 */}
                        <div className="text-center">
                          <div className="text-5xl mb-2">🥇</div>
                          <div className={`w-24 h-28 bg-gradient-to-b ${darkMode ? 'from-yellow-500 to-yellow-700' : 'from-yellow-400 to-yellow-500'} rounded-t-lg flex items-center justify-center`}>
                            <span className="font-bold text-white">
                              {(leaderboard[0].total_distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leaderboard[0].user_name.split(' ')[0]}
                          </div>
                        </div>
                        {/* Platz 3 */}
                        <div className="text-center">
                          <div className="text-4xl mb-2">🥉</div>
                          <div className={`w-24 h-16 ${darkMode ? 'bg-orange-700' : 'bg-orange-400'} rounded-t-lg flex items-center justify-center`}>
                            <span className="font-bold text-white">
                              {(leaderboard[2].total_distance / 1000).toFixed(1)} km
                            </span>
                          </div>
                          <div className={`text-sm font-medium mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {leaderboard[2].user_name.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Eigene Statistiken */}
                  {(() => {
                    const myStats = userStats[user?.id];
                    if (!myStats) return null;
                    const myRank = leaderboard.findIndex(e => e.user_id === user?.id) + 1;
                    return (
                      <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} text-white rounded-xl p-6 shadow-lg`}>
                        <h3 className="font-bold text-lg mb-4">📊 Deine Statistiken</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold">{myRank}.</div>
                            <div className="text-sm opacity-80">Platzierung</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{(myStats.total_distance / 1000).toFixed(1)}</div>
                            <div className="text-sm opacity-80">Kilometer</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{myStats.session_count}</div>
                            <div className="text-sm opacity-80">Einheiten</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{Math.floor(myStats.total_time / 60)}h</div>
                            <div className="text-sm opacity-80">Trainingszeit</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })()}

            {/* Team-Battle Detail */}
            {swimChallengeView === 'battle' && (() => {
              const battleStats = calculateTeamBattleStats(swimSessions);

              const renderTeamMember = (member, index, color) => {
                const medals = ['🥇', '🥈', '🥉'];
                const medal = medals[index] || `${index + 1}.`;
                const isCurrentUser = member.user_id === user?.id;

                return (
                  <div
                    key={member.user_id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      isCurrentUser
                        ? (darkMode ? `bg-${color}-900/50 border border-${color}-500` : `bg-${color}-100 border border-${color}-300`)
                        : ''
                    }`}
                  >
                    <span className="text-xl w-8">{medal}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {member.user_name}
                        {isCurrentUser && <span className="ml-1 text-xs opacity-70">(Du)</span>}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {member.sessions} Einheiten • {(member.distance / 1000).toFixed(1)} km
                      </div>
                    </div>
                    <div className={`font-bold ${color === 'cyan' ? (darkMode ? 'text-cyan-400' : 'text-cyan-600') : (darkMode ? 'text-orange-400' : 'text-orange-600')}`}>
                      {member.points} Pkt
                    </div>
                  </div>
                );
              };

              return (
                <div className="space-y-4">
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ⚔️ Team-Battle Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Team Azubis */}
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-cyan-900/30 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200'}`}>
                        <h4 className={`font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                          <span>👨‍🎓 Team Azubis</span>
                          <span>{battleStats.azubis.points} Pkt</span>
                        </h4>
                        {battleStats.azubis.memberList.length === 0 ? (
                          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p>Noch keine Teilnehmer</p>
                            <p className="text-sm mt-1">Trage eine Trainingseinheit ein!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {battleStats.azubis.memberList.map((member, idx) => renderTeamMember(member, idx, 'cyan'))}
                          </div>
                        )}
                        <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-cyan-800' : 'border-cyan-200'} text-sm`}>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamt:</span>
                            <span className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                              {(battleStats.azubis.distance / 1000).toFixed(1)} km • {Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Team Trainer */}
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-orange-900/30 border border-orange-700' : 'bg-orange-50 border border-orange-200'}`}>
                        <h4 className={`font-bold mb-3 flex items-center justify-between ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                          <span>👨‍🏫 Team Trainer</span>
                          <span>{battleStats.trainer.points} Pkt</span>
                        </h4>
                        {battleStats.trainer.memberList.length === 0 ? (
                          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p>Noch keine Teilnehmer</p>
                            <p className="text-sm mt-1">Trainer, zeigt was ihr könnt!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {battleStats.trainer.memberList.map((member, idx) => renderTeamMember(member, idx, 'orange'))}
                          </div>
                        )}
                        <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-orange-800' : 'border-orange-200'} text-sm`}>
                          <div className="flex justify-between">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamt:</span>
                            <span className={`font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                              {(battleStats.trainer.distance / 1000).toFixed(1)} km • {Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistik-Vergleich */}
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📈 Statistik-Vergleich
                    </h4>
                    <div className="space-y-4">
                      {/* Distanz-Vergleich */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{(battleStats.azubis.distance / 1000).toFixed(1)} km</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gesamtdistanz</span>
                          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{(battleStats.trainer.distance / 1000).toFixed(1)} km</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.azubis.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%` }}></div>
                          <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.azubis.distance + battleStats.trainer.distance > 0 ? (battleStats.trainer.distance / (battleStats.azubis.distance + battleStats.trainer.distance)) * 100 : 50}%` }}></div>
                        </div>
                      </div>
                      {/* Zeit-Vergleich */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{Math.floor(battleStats.azubis.time / 60)}h {battleStats.azubis.time % 60}m</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Trainingszeit</span>
                          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{Math.floor(battleStats.trainer.time / 60)}h {battleStats.trainer.time % 60}m</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.azubis.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%` }}></div>
                          <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.azubis.time + battleStats.trainer.time > 0 ? (battleStats.trainer.time / (battleStats.azubis.time + battleStats.trainer.time)) * 100 : 50}%` }}></div>
                        </div>
                      </div>
                      {/* Teilnehmer-Vergleich */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>{battleStats.azubis.memberList.length}</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Teilnehmer</span>
                          <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>{battleStats.trainer.memberList.length}</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                          <div className="bg-cyan-500 transition-all" style={{ width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.azubis.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%` }}></div>
                          <div className="bg-orange-500 transition-all" style={{ width: `${battleStats.azubis.memberList.length + battleStats.trainer.memberList.length > 0 ? (battleStats.trainer.memberList.length / (battleStats.azubis.memberList.length + battleStats.trainer.memberList.length)) * 100 : 50}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Handicap-System */}
                  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📊 Alters-Handicap System
                    </h4>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Für faire Wettkämpfe zwischen verschiedenen Altersgruppen wird ein Handicap-System angewendet:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {[
                        { age: '< 40', bonus: '0%' },
                        { age: '40-49', bonus: '-5%' },
                        { age: '50-59', bonus: '-10%' },
                        { age: '60-69', bonus: '-15%' },
                        { age: '70+', bonus: '-20%' },
                      ].map(h => (
                        <div key={h.age} className={`p-3 rounded-lg text-center ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{h.age}</div>
                          <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{h.bonus} Zeit</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Trainer: Bestätigungen */}
            {(user.role === 'trainer' || user.role === 'ausbilder' || user.permissions.canViewAllStats) && pendingSwimConfirmations.length > 0 && (
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ✅ Zu bestätigende Einheiten
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingSwimConfirmations.length}</span>
                </h3>
                <div className="space-y-3">
                  {pendingSwimConfirmations.map(session => (
                    <div key={session.id} className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {session.user_name} - {session.distance}m in {session.time_minutes} Min
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {SWIM_STYLES.find(s => s.id === session.style)?.name} • {session.date}
                          {session.notes && <span className="ml-2 italic">"{session.notes}"</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmSwimSession(session.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                        >
                          ✓ Bestätigen
                        </button>
                        <button
                          onClick={() => rejectSwimSession(session.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                        >
                          ✗ Ablehnen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== BERICHTSHEFT VIEW ==================== */}
        {currentView === 'berichtsheft' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-xl p-6 shadow-lg`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className={`text-2xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  📖 Digitales Berichtsheft
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { resetBerichtsheftForm(); setBerichtsheftViewMode('edit'); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'edit' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    ✏️ Neu
                  </button>
                  <button
                    onClick={() => setBerichtsheftViewMode('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'list' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    📋 Übersicht
                  </button>
                  <button
                    onClick={() => setBerichtsheftViewMode('progress')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'progress' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    📊 Fortschritt
                  </button>
                  <button
                    onClick={() => setBerichtsheftViewMode('profile')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${berichtsheftViewMode === 'profile' ? 'bg-cyan-500 text-white' : (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
                  >
                    👤 Profil
                  </button>
                </div>
              </div>

              {/* Profil-Hinweis wenn nicht ausgefüllt */}
              {berichtsheftViewMode !== 'profile' && (!azubiProfile.vorname || !azubiProfile.nachname || !azubiProfile.ausbildungsbetrieb) && (
                <div className={`mb-4 p-4 rounded-lg border-2 ${darkMode ? 'bg-yellow-900/30 border-yellow-600' : 'bg-yellow-50 border-yellow-400'}`}>
                  <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    ⚠️ Bitte fülle zuerst dein <button onClick={() => setBerichtsheftViewMode('profile')} className="underline font-bold">Azubi-Profil</button> aus, damit deine Daten automatisch in den Berichten erscheinen.
                  </p>
                </div>
              )}

              {/* PROFILE VIEW - Azubi-Profil bearbeiten */}
              {berichtsheftViewMode === 'profile' && (
                <div className="space-y-6">
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-6`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      👤 Azubi-Profil für Berichtsheft
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Diese Daten werden automatisch in deine Berichtshefte übernommen.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vorname *</label>
                        <input
                          type="text"
                          value={azubiProfile.vorname}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, vorname: e.target.value })}
                          placeholder="Max"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nachname *</label>
                        <input
                          type="text"
                          value={azubiProfile.nachname}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, nachname: e.target.value })}
                          placeholder="Mustermann"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsbetrieb *</label>
                        <input
                          type="text"
                          value={azubiProfile.ausbildungsbetrieb}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbetrieb: e.target.value })}
                          placeholder="Stadtwerke Musterstadt GmbH"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsberuf</label>
                        <input
                          type="text"
                          value={azubiProfile.ausbildungsberuf}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsberuf: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name Ausbilder/in</label>
                        <input
                          type="text"
                          value={azubiProfile.ausbilder}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbilder: e.target.value })}
                          placeholder="Frau/Herr Ausbilder"
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsbeginn</label>
                        <input
                          type="date"
                          value={azubiProfile.ausbildungsbeginn}
                          onChange={(e) => saveAzubiProfile({ ...azubiProfile, ausbildungsbeginn: e.target.value })}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vorschau */}
                  {azubiProfile.vorname && azubiProfile.nachname && (
                    <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-6`}>
                      <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Vorschau Kopfzeile:</h4>
                      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'}`}>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Name:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.vorname} {azubiProfile.nachname}</span></div>
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Betrieb:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbildungsbetrieb || '-'}</span></div>
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Beruf:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbildungsberuf}</span></div>
                          <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Ausbilder:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbilder || '-'}</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setBerichtsheftViewMode('edit')}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg"
                  >
                    <Check className="inline mr-2" size={20} />
                    Profil gespeichert - Zum Berichtsheft
                  </button>
                </div>
              )}

              {/* EDIT VIEW - Neuer Wochenbericht */}
              {berichtsheftViewMode === 'edit' && (
                <div className="space-y-6">
                  {/* Azubi-Kopfzeile */}
                  {(azubiProfile.vorname || azubiProfile.nachname || azubiProfile.ausbildungsbetrieb) && (
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-3 border ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Azubi:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.vorname} {azubiProfile.nachname}</span></div>
                        {azubiProfile.ausbildungsbetrieb && <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Betrieb:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbildungsbetrieb}</span></div>}
                        {azubiProfile.ausbilder && <div><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Ausbilder:</span> <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{azubiProfile.ausbilder}</span></div>}
                      </div>
                    </div>
                  )}

                  {/* Header-Infos */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nachweis Nr.</label>
                        <input
                          type="number"
                          value={berichtsheftNr}
                          onChange={(e) => setBerichtsheftNr(parseInt(e.target.value) || 1)}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Woche vom (Montag)</label>
                        <input
                          type="date"
                          value={berichtsheftWeek}
                          onChange={(e) => setBerichtsheftWeek(e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>bis (Sonntag)</label>
                        <input
                          type="text"
                          value={getWeekEndDate(berichtsheftWeek)}
                          readOnly
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ausbildungsjahr</label>
                        <select
                          value={berichtsheftYear}
                          onChange={(e) => setBerichtsheftYear(parseInt(e.target.value))}
                          className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                        >
                          <option value={1}>1. Ausbildungsjahr</option>
                          <option value={2}>2. Ausbildungsjahr</option>
                          <option value={3}>3. Ausbildungsjahr</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tageseinträge */}
                  <div className="space-y-4">
                    {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, dayIndex) => {
                      const dayNames = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag', So: 'Sonntag' };
                      const dayDate = new Date(berichtsheftWeek);
                      dayDate.setDate(dayDate.getDate() + dayIndex);

                      return (
                        <div key={day} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{day}</span>
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {dayNames[day]} - {dayDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                              </span>
                            </div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {calculateDayHours(day)} Std.
                            </div>
                          </div>

                          {currentWeekEntries[day].map((entry, entryIndex) => (
                            <div key={entryIndex} className="flex flex-wrap lg:flex-nowrap gap-2 mb-2 items-start">
                              <div className="flex-grow min-w-[200px]">
                                <input
                                  type="text"
                                  value={entry.taetigkeit}
                                  onChange={(e) => updateWeekEntry(day, entryIndex, 'taetigkeit', e.target.value)}
                                  placeholder="Ausgeführte Tätigkeit..."
                                  className={`w-full px-3 py-2 border rounded-lg text-sm ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                                />
                              </div>
                              <div className="w-20 flex-shrink-0">
                                <input
                                  type="number"
                                  value={entry.stunden}
                                  onChange={(e) => updateWeekEntry(day, entryIndex, 'stunden', e.target.value)}
                                  placeholder="Std."
                                  step="0.5"
                                  min="0"
                                  max="12"
                                  className={`w-full px-2 py-2 border rounded-lg text-sm text-center ${darkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                                />
                              </div>
                              <div className="w-full sm:w-auto">
                                <select
                                  value={entry.bereich}
                                  onChange={(e) => updateWeekEntry(day, entryIndex, 'bereich', e.target.value)}
                                  className={`w-full min-w-[500px] px-2 py-2 border rounded-lg text-sm ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                                >
                                  <option value="">-- Bereich --</option>
                                  {AUSBILDUNGSRAHMENPLAN.map(b => (
                                    <option key={b.nr} value={b.nr}>{b.icon} {b.nr}. {b.bereich}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                onClick={() => removeWeekEntry(day, entryIndex)}
                                disabled={currentWeekEntries[day].length <= 1}
                                className={`px-2 py-2 rounded-lg transition-all ${currentWeekEntries[day].length <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-100'}`}
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addWeekEntry(day)}
                            className={`mt-2 text-sm flex items-center gap-1 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}
                          >
                            <Plus size={16} /> Weitere Tätigkeit
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Gesamtstunden */}
                  <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} rounded-xl p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">Gesamtstunden diese Woche:</span>
                      <span className="text-3xl font-bold">{calculateTotalHours()} Std.</span>
                    </div>
                  </div>

                  {/* Bemerkungen */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bemerkungen Auszubildender
                      </label>
                      <textarea
                        value={berichtsheftBemerkungAzubi}
                        onChange={(e) => setBerichtsheftBemerkungAzubi(e.target.value)}
                        rows={3}
                        placeholder="Besondere Vorkommnisse, Lernerfolge..."
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bemerkungen Ausbilder
                      </label>
                      <textarea
                        value={berichtsheftBemerkungAusbilder}
                        onChange={(e) => setBerichtsheftBemerkungAusbilder(e.target.value)}
                        rows={3}
                        placeholder="Feedback, Anmerkungen..."
                        className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  </div>

                  {/* Unterschriften */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-6`}>
                    <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Für die Richtigkeit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum Azubi</label>
                          <input
                            type="date"
                            value={berichtsheftDatumAzubi}
                            onChange={(e) => setBerichtsheftDatumAzubi(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                          />
                        </div>
                        <SignatureCanvas
                          value={berichtsheftSignaturAzubi}
                          onChange={setBerichtsheftSignaturAzubi}
                          darkMode={darkMode}
                          label="Unterschrift Auszubildender"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Datum Ausbilder</label>
                          <input
                            type="date"
                            value={berichtsheftDatumAusbilder}
                            onChange={(e) => setBerichtsheftDatumAusbilder(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300'}`}
                          />
                        </div>
                        <SignatureCanvas
                          value={berichtsheftSignaturAusbilder}
                          onChange={setBerichtsheftSignaturAusbilder}
                          darkMode={darkMode}
                          label="Unterschrift Ausbilder"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Speichern Button */}
                  <div className="flex gap-4">
                    <button
                      onClick={saveBerichtsheft}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg"
                    >
                      <Check className="inline mr-2" size={20} />
                      {selectedBerichtsheft ? 'Aktualisieren' : 'Speichern'}
                    </button>
                    {selectedBerichtsheft && (
                      <button
                        onClick={resetBerichtsheftForm}
                        className={`px-6 py-3 rounded-xl font-medium ${darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        Abbrechen
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* LIST VIEW - Übersicht aller Berichte */}
              {berichtsheftViewMode === 'list' && (
                <div className="space-y-4">
                  {berichtsheftEntries.length === 0 ? (
                    <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="text-6xl mb-4">📖</div>
                      <p className="text-lg">Noch keine Berichtshefte vorhanden</p>
                      <p className="text-sm mt-2">Erstelle deinen ersten Wochenbericht!</p>
                      <button
                        onClick={() => setBerichtsheftViewMode('edit')}
                        className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        <Plus className="inline mr-2" size={18} />
                        Neuer Bericht
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={`grid gap-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {berichtsheftEntries.map(entry => (
                          <div key={entry.id} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                  Nr. {entry.nachweis_nr}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${entry.signatur_azubi && entry.signatur_ausbilder ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-600'}`}>
                                  {entry.signatur_azubi && entry.signatur_ausbilder ? '✓ Unterschrieben' : '⏳ Offen'}
                                </span>
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                KW {new Date(entry.week_start).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} - {new Date(entry.week_end).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                <span className="mx-2">|</span>
                                {entry.ausbildungsjahr}. Ausbildungsjahr
                                <span className="mx-2">|</span>
                                <span className="font-medium">{entry.total_hours || 0} Stunden</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => generateBerichtsheftPDF(entry)}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                              >
                                <Download size={16} /> PDF
                              </button>
                              <button
                                onClick={() => loadBerichtsheftForEdit(entry)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                              >
                                ✏️ Bearbeiten
                              </button>
                              <button
                                onClick={() => deleteBerichtsheft(entry.id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Statistik */}
                      <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{berichtsheftEntries.length}</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wochen erfasst</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {berichtsheftEntries.filter(e => e.signatur_azubi && e.signatur_ausbilder).length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Unterschrieben</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                              {berichtsheftEntries.filter(e => !e.signatur_azubi || !e.signatur_ausbilder).length}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offen</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {berichtsheftEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0)}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stunden gesamt</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* PROGRESS VIEW - Fortschritt nach Ausbildungsrahmenplan */}
              {berichtsheftViewMode === 'progress' && (
                <div className="space-y-6">
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-50 to-blue-50'} rounded-xl p-4`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Hier siehst du deinen Fortschritt in den verschiedenen Ausbildungsbereichen gemäß Ausbildungsrahmenplan (§4).
                      Die Soll-Wochen basieren auf den zeitlichen Richtwerten der Verordnung.
                    </p>
                  </div>

                  {(() => {
                    const progress = calculateBereichProgress();
                    const stundenProWoche = 40; // Annahme: 40 Stunden = 1 Woche

                    return (
                      <div className="space-y-4">
                        {Object.entries(progress).map(([nr, data]) => {
                          const istWochen = data.istStunden / stundenProWoche;
                          const prozent = data.sollWochen > 0 ? Math.min(100, (istWochen / data.sollWochen) * 100) : (data.istStunden > 0 ? 100 : 0);

                          return (
                            <div key={nr} className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-4`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{data.icon}</span>
                                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {nr}. {data.name}
                                  </span>
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {istWochen.toFixed(1)} / {data.sollWochen > 0 ? data.sollWochen : '∞'} Wochen
                                  <span className="ml-2 font-bold">({data.istStunden.toFixed(0)} Std.)</span>
                                </div>
                              </div>
                              <div className={`h-4 rounded-full overflow-hidden ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${data.color}`}
                                  style={{ width: `${prozent}%` }}
                                />
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {prozent.toFixed(0)}% erreicht
                                </span>
                                {prozent >= 100 && (
                                  <span className="text-xs text-green-500 font-medium">✓ Abgeschlossen</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Gesamt-Übersicht */}
                  <div className={`${darkMode ? 'bg-gradient-to-r from-cyan-900 to-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} rounded-xl p-6 text-white`}>
                    <h3 className="font-bold text-lg mb-4">Gesamtfortschritt</h3>
                    {(() => {
                      const progress = calculateBereichProgress();
                      const totalIstStunden = Object.values(progress).reduce((sum, d) => sum + d.istStunden, 0);
                      const totalSollWochen = AUSBILDUNGSRAHMENPLAN.reduce((sum, b) => sum + b.gesamtWochen, 0);
                      const totalSollStunden = totalSollWochen * 40;
                      const gesamtProzent = totalSollStunden > 0 ? (totalIstStunden / totalSollStunden) * 100 : 0;

                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-3xl font-bold">{totalIstStunden.toFixed(0)}</div>
                            <div className="text-sm opacity-80">Stunden erfasst</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{(totalIstStunden / 40).toFixed(1)}</div>
                            <div className="text-sm opacity-80">Wochen erfasst</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{totalSollWochen}</div>
                            <div className="text-sm opacity-80">Soll-Wochen (gesamt)</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{gesamtProzent.toFixed(0)}%</div>
                            <div className="text-sm opacity-80">Gesamtfortschritt</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Ausbildungsrahmenplan Übersicht */}
                  <div className={`${darkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl p-6`}>
                    <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      📋 Ausbildungsrahmenplan - Übersicht
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={`${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                            <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nr.</th>
                            <th className={`px-3 py-2 text-left ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bereich</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>1. Jahr</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>2. Jahr</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>3. Jahr</th>
                            <th className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gesamt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {AUSBILDUNGSRAHMENPLAN.map((bereich, idx) => (
                            <tr key={bereich.nr} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'} ${idx % 2 === 0 ? '' : (darkMode ? 'bg-slate-750' : 'bg-gray-100')}`}>
                              <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                <span className="mr-1">{bereich.icon}</span> {bereich.nr}
                              </td>
                              <td className={`px-3 py-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {bereich.bereich}
                                <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{bereich.paragraph}</div>
                              </td>
                              <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {bereich.wochen.jahr1 || '-'}
                              </td>
                              <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {bereich.wochen.jahr2 || '-'}
                              </td>
                              <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {bereich.wochen.jahr3 || '-'}
                              </td>
                              <td className={`px-3 py-2 text-center font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                {bereich.gesamtWochen || 'lfd.'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className={`mt-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      * "lfd." = wird während der gesamten Ausbildung laufend vermittelt
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== PROFIL VIEW ==================== */}
        {currentView === 'profile' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl p-8 text-center">
              <div className="text-6xl mb-3">
                {user.avatar ? AVATARS.find(a => a.id === user.avatar)?.emoji || '👤' : '👤'}
              </div>
              <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
              <p className="opacity-90">{PERMISSIONS[user.role]?.label || user.role}</p>
            </div>

            {/* Avatar auswählen */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Avatar auswählen
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Wähle einen Avatar für dein Profil
              </p>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => updateProfileAvatar(avatar.id)}
                    disabled={profileSaving}
                    title={avatar.label}
                    className={`text-3xl p-2 rounded-xl transition-all hover:scale-110 ${
                      user.avatar === avatar.id
                        ? 'bg-cyan-500 ring-2 ring-cyan-400 ring-offset-2 ' + (darkMode ? 'ring-offset-slate-800' : 'ring-offset-white')
                        : darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {avatar.emoji}
                  </button>
                ))}
              </div>
              {user.avatar && (
                <button
                  onClick={() => updateProfileAvatar(null)}
                  disabled={profileSaving}
                  className={`mt-4 text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                >
                  Avatar entfernen
                </button>
              )}
            </div>

            {/* Aktivitäts-Statistik */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Meine Aktivitäten
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Quiz-Statistik */}
                <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-green-900 to-emerald-900' : 'bg-gradient-to-br from-green-100 to-emerald-100'}`}>
                  <div className="text-3xl mb-1">🏆</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {userStats?.wins || 0}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Quiz-Siege</div>
                </div>
                <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-blue-900 to-cyan-900' : 'bg-gradient-to-br from-blue-100 to-cyan-100'}`}>
                  <div className="text-3xl mb-1">🏊</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {swimSessions.filter(s => s.user_id === user.id || s.user_name === user.name).reduce((sum, s) => sum + (s.distance || 0), 0).toLocaleString()}m
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Geschwommen</div>
                </div>
                <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
                  <div className="text-3xl mb-1">🎖️</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {userBadges.length}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Badges</div>
                </div>
                <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gradient-to-br from-orange-900 to-amber-900' : 'bg-gradient-to-br from-orange-100 to-amber-100'}`}>
                  <div className="text-3xl mb-1">✅</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    {Object.values(userStats?.categoryStats || {}).reduce((sum, cat) => sum + (cat.correct || 0), 0)}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>Richtige Antworten</div>
                </div>
              </div>
              {/* Erweiterte Stats */}
              <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} grid grid-cols-3 gap-4 text-center`}>
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {userStats?.losses || 0}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Niederlagen</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {userStats?.draws || 0}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unentschieden</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {swimSessions.filter(s => s.user_id === user.id || s.user_name === user.name).length}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Schwimm-Einheiten</div>
                </div>
              </div>
            </div>

            {/* Aktuelle Daten */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Aktuelle Kontodaten
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>E-Mail</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.email}</p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rolle</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {PERMISSIONS[user.role]?.label || user.role}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Betrieb</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {user.company || <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Nicht angegeben</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Betrieb ändern */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Betrieb angeben
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder={user.company || "z.B. Stadtbad München, Hallenbad Köln..."}
                  value={profileEditCompany}
                  onChange={(e) => setProfileEditCompany(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                />
                <button
                  onClick={updateProfileCompany}
                  disabled={profileSaving}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  {profileSaving ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                In welchem Schwimmbad / Betrieb arbeitest du?
              </p>
            </div>

            {/* Geburtsdatum für Handicap */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🎂 Geburtsdatum
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="date"
                  value={profileEditBirthDate || user.birthDate || ''}
                  onChange={(e) => setProfileEditBirthDate(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                />
                <button
                  onClick={updateProfileBirthDate}
                  disabled={profileSaving || !profileEditBirthDate}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  {profileSaving ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
              {user.birthDate && (
                <p className={`mt-2 text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ Gespeichert: {new Date(user.birthDate).toLocaleDateString('de-DE')}
                  {getAgeHandicap(user.birthDate) > 0 && (
                    <span className="ml-2 text-cyan-500">
                      (Handicap: {Math.round(getAgeHandicap(user.birthDate) * 100)}% Zeitbonus)
                    </span>
                  )}
                </p>
              )}
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Wird für das Alters-Handicap bei der Schwimm-Challenge verwendet (ab 40 Jahren).
              </p>
            </div>

            {/* Name ändern */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Anzeigename ändern
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Neuer Name"
                  value={profileEditName}
                  onChange={(e) => setProfileEditName(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                />
                <button
                  onClick={updateProfileName}
                  disabled={profileSaving || !profileEditName.trim()}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  {profileSaving ? 'Speichern...' : 'Name ändern'}
                </button>
              </div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Dein Anzeigename wird in der App, im Chat und in der Bestenliste angezeigt.
              </p>
            </div>

            {/* Passwort ändern */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Passwort ändern
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Neues Passwort
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mindestens 6 Zeichen"
                      value={profileEditPassword}
                      onChange={(e) => setProfileEditPassword(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Passwort bestätigen
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordConfirm ? 'text' : 'password'}
                      placeholder="Passwort wiederholen"
                      value={profileEditPasswordConfirm}
                      onChange={(e) => setProfileEditPasswordConfirm(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-lg ${darkMode ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-100 border-gray-300'} border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                    >
                      {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={updateProfilePassword}
                  disabled={profileSaving || !profileEditPassword || !profileEditPasswordConfirm}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  {profileSaving ? 'Speichern...' : 'Passwort ändern'}
                </button>
              </div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Verwende ein sicheres Passwort mit mindestens 6 Zeichen.
              </p>
            </div>

            {/* Abmelden */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Sitzung beenden
              </h3>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  localStorage.removeItem('baeder_user');
                }}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
              >
                Abmelden
              </button>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Du wirst aus der App abgemeldet und musst dich erneut anmelden.
              </p>
            </div>

            {/* Rechtliches */}
            <div className={`${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'} rounded-xl p-6`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                📜 Rechtliches
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setCurrentView('impressum')}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} transition-all`}
                >
                  Impressum
                </button>
                <button
                  onClick={() => setCurrentView('datenschutz')}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'} transition-all`}
                >
                  Datenschutzerklärung
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Impressum */}
        {currentView === 'impressum' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-8 shadow-lg`}>
              <button
                onClick={() => setCurrentView('profile')}
                className={`mb-6 flex items-center gap-2 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors`}
              >
                ← Zurück zum Profil
              </button>

              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📜 Impressum
              </h2>

              <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Angaben gemäß § 5 TMG</h3>
                  <p>Dennie Gulbinski</p>
                  <p>Zeitstraße 108</p>
                  <p>53721 Siegburg</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Kontakt</h3>
                  <p>E-Mail: denniegulbinski@gmail.com</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                  <p>Dennie Gulbinski</p>
                  <p>Zeitstraße 108</p>
                  <p>53721 Siegburg</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Haftungsausschluss</h3>
                  <p className="text-sm leading-relaxed">
                    Die Inhalte dieser App wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
                    Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter sind wir gemäß
                    § 7 Abs.1 TMG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich.
                  </p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Urheberrecht</h3>
                  <p className="text-sm leading-relaxed">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke unterliegen dem deutschen Urheberrecht.
                    Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
                    Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Datenschutzerklärung */}
        {currentView === 'datenschutz' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-8 shadow-lg`}>
              <button
                onClick={() => setCurrentView('profile')}
                className={`mb-6 flex items-center gap-2 ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'} transition-colors`}
              >
                ← Zurück zum Profil
              </button>

              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🔒 Datenschutzerklärung
              </h2>
              <p className={`text-xs mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Stand: Januar 2025 | Diese Datenschutzerklärung gilt für die Nutzung der Bäder-Azubi App.
              </p>

              <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>1. Verantwortlicher</h3>
                  <p className="text-sm">Dennie Gulbinski<br/>Zeitstraße 108<br/>53721 Siegburg<br/>E-Mail: denniegulbinski@gmail.com</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>2. Zwecke der Datenverarbeitung</h3>
                  <p className="text-sm leading-relaxed mb-2">Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zur:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Bereitstellung der App-Funktionen</li>
                    <li>Unterstützung von Ausbildungsprozessen (Berichtsheft, Lernfortschritt, Kommunikation)</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>3. Verarbeitete Datenarten</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li><strong>Stammdaten:</strong> Name, E-Mail-Adresse, optional Geburtsdatum</li>
                    <li><strong>Nutzungsdaten:</strong> Login-Zeitpunkte, aktive Module</li>
                    <li><strong>Lern- & Ausbildungsdaten:</strong> Quiz-Ergebnisse, Berichtshefteinträge, Schwimmeinheiten, Schulungsfortschritte</li>
                    <li><strong>Kommunikationsdaten:</strong> Chatnachrichten innerhalb der App</li>
                    <li><strong>Ausbilderdaten:</strong> Kontrollkarten, Kommentare, Freigaben</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>4. Rechtsgrundlagen der Verarbeitung</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung/Ausbildungsverhältnis)</li>
                    <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: z. B. Systembetrieb, Support)</li>
                    <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z. B. für Chatfunktion)</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>5. Empfänger der Daten</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>IT-Dienstleister (z. B. Supabase für Hosting)</li>
                    <li>Keine Weitergabe an Dritte zu Werbezwecken</li>
                    <li>Datenverarbeitung erfolgt ausschließlich innerhalb der EU</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>6. Speicherdauer</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li><strong>Azubis:</strong> Löschung 3 Monate nach Ausbildungsende</li>
                    <li><strong>Ausbilder:innen:</strong> Löschung 6 Monate nach Inaktivität</li>
                    <li><strong>Admins:</strong> regelmäßige Löschprüfung jährlich</li>
                    <li><strong>Chatnachrichten:</strong> max. 12 Monate, dann automatische Löschung</li>
                    <li><strong>Berichtshefte:</strong> Löschung spätestens 1 Jahr nach Ausbildungsende</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>7. Betroffenenrechte</h3>
                  <p className="text-sm leading-relaxed mb-2">Du hast das Recht auf:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Auskunft (Art. 15 DSGVO)</li>
                    <li>Berichtigung (Art. 16 DSGVO)</li>
                    <li>Löschung (Art. 17 DSGVO)</li>
                    <li>Einschränkung (Art. 18 DSGVO)</li>
                    <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                    <li>Widerspruch (Art. 21 DSGVO)</li>
                    <li>Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
                  </ul>
                  <p className="text-sm leading-relaxed mt-2">Anfragen bitte per E-Mail an: denniegulbinski@gmail.com</p>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>8. Cookies und lokale Speicherung</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Die App nutzt kein Tracking</li>
                    <li>Es wird ausschließlich Local Storage verwendet (z. B. für Einstellungen und Anmeldedaten)</li>
                    <li>Es erfolgt keine Analyse oder Weitergabe dieser Daten</li>
                  </ul>
                </section>

                <section>
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>9. Sicherheit der Verarbeitung</h3>
                  <p className="text-sm leading-relaxed mb-2">Zum Schutz deiner Daten setzen wir technische und organisatorische Maßnahmen ein:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Verschlüsselte Übertragung (TLS)</li>
                    <li>Zugriffsrechte nach Rolle</li>
                    <li>Datensicherung</li>
                    <li>Regelmäßige Updates</li>
                  </ul>
                </section>

                <section className={`pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <p className="text-xs text-gray-500">
                    Diese Datenschutzerklärung wird regelmäßig aktualisiert. Letzte Aktualisierung: Januar 2025
                  </p>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
