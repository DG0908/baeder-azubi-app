import type { ArmKeyframe, BodyKeyframe, Vec3 } from '../types';

export const wrap01 = (value: number): number => {
  const wrapped = value % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
};

export const lerpNumber = (from: number, to: number, t: number): number => (
  from + (to - from) * t
);

export const lerpVec3 = (from: Vec3, to: Vec3, t: number): Vec3 => ([
  lerpNumber(from[0], to[0], t),
  lerpNumber(from[1], to[1], t),
  lerpNumber(from[2], to[2], t)
]);

// Generic keyframe sampler for looped animation tracks.
export const sampleLoopedKeyframes = <T>(
  frames: T[],
  progress: number,
  getT: (frame: T) => number,
  lerp: (a: T, b: T, t: number) => T
): T => {
  if (frames.length === 0) {
    throw new Error('sampleLoopedKeyframes requires at least one keyframe');
  }
  if (frames.length === 1) {
    return frames[0];
  }

  const p = wrap01(progress);
  const sorted = [...frames].sort((a, b) => getT(a) - getT(b));

  let i = 0;
  while (i < sorted.length - 1 && p >= getT(sorted[i + 1])) {
    i += 1;
  }

  const current = sorted[i];
  const next = sorted[(i + 1) % sorted.length];
  const currentT = getT(current);
  const nextT = i === sorted.length - 1 ? getT(next) + 1 : getT(next);

  const localT = (p - currentT) / (nextT - currentT || 1);
  return lerp(current, next, localT);
};

export const lerpArmKeyframe = (a: ArmKeyframe, b: ArmKeyframe, t: number): ArmKeyframe => ({
  t: lerpNumber(a.t, b.t, t),
  shoulder: lerpVec3(a.shoulder, b.shoulder, t),
  elbow: lerpVec3(a.elbow, b.elbow, t)
});

export const lerpBodyKeyframe = (a: BodyKeyframe, b: BodyKeyframe, t: number): BodyKeyframe => ({
  t: lerpNumber(a.t, b.t, t),
  roll: lerpNumber(a.roll, b.roll, t),
  pitch: lerpNumber(a.pitch, b.pitch, t),
  yaw: lerpNumber(a.yaw, b.yaw, t),
  heave: lerpNumber(a.heave, b.heave, t),
  surge: lerpNumber(a.surge, b.surge, t),
  headYaw: lerpNumber(a.headYaw, b.headYaw, t),
  headPitch: lerpNumber(a.headPitch, b.headPitch, t),
  leftHip: lerpNumber(a.leftHip, b.leftHip, t),
  leftKnee: lerpNumber(a.leftKnee, b.leftKnee, t),
  leftAnkle: lerpNumber(a.leftAnkle, b.leftAnkle, t),
  rightHip: lerpNumber(a.rightHip, b.rightHip, t),
  rightKnee: lerpNumber(a.rightKnee, b.rightKnee, t),
  rightAnkle: lerpNumber(a.rightAnkle, b.rightAnkle, t)
});

