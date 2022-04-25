export function ftoc(ftemp) {
  const ctemp = ((ftemp - 32) * 5) / 9;
  return Number(ctemp.toFixed(1));
}

export function ctof(ctemp) {
  const ftemp = (ctemp * 9) / 5 + 32;
  return Number(ftemp.toFixed(1));
}

export function mphToMs(val) {
  return val * 0.447;
}

export function msToMph(val) {
  return val * 2.2369;
}
