export type Vec3 = [number, number, number];

export type SwimStyleId = string;

export type ViewPreset = 'front' | 'side' | 'top' | 'free';
export type SpeedPreset = 'slow' | 'normal' | 'fast';

export type HotspotArea =
  | 'head'
  | 'breathing'
  | 'rotation'
  | 'right-arm'
  | 'left-arm'
  | 'kick'
  | 'bodyline'
  | 'timing';

export interface TechniqueHotspot {
  id: string;
  area: HotspotArea;
  label: string;
  anchor: Vec3;
  title: string;
  explanation: string;
  mistakes: string[];
  tip: string;
  phaseHint?: string;
  color: string;
}

export interface ArmKeyframe {
  t: number;
  shoulder: Vec3;
  elbow: Vec3;
}

export interface BodyKeyframe {
  t: number;
  roll: number;
  pitch: number;
  yaw: number;
  heave: number;
  surge: number;
  headYaw: number;
  headPitch: number;
  leftHip: number;
  leftKnee: number;
  leftAnkle: number;
  rightHip: number;
  rightKnee: number;
  rightAnkle: number;
}

export interface SwimPhase {
  id: string;
  label: string;
  description: string;
  t: number;
}

export interface SwimAnimationConfig {
  loopDuration: number;
  kickFrequency: number;
  kickAmplitude: number;
  bodyFrames: BodyKeyframe[];
  leftArmFrames: ArmKeyframe[];
  rightArmFrames: ArmKeyframe[];
}

export interface SwimStyleData {
  id: SwimStyleId;
  name: string;
  subtitle: string;
  phases: SwimPhase[];
  hotspots: TechniqueHotspot[];
  animation: SwimAnimationConfig;
}

