interface ISin {
  x: number
  amp?: number
  freq?: number
  phase?: number
  threshold?: number
}


export const sin = function({ x, amp = 2, freq = 1, phase = 0, threshold = 0 }: ISin): number {
  return Math.sin(x*2*Math.PI*freq + phase)*amp*0.5 + threshold;
}

export const tri = function({ x, amp = 2, freq = 1, phase = 0, threshold = 0 }: ISin): number {
  const P = 1/freq;
  return amp*2*Math.abs((x + phase)/(P)-Math.floor((x + phase)/(P)+(1)/(2)))-(amp)/(2)+threshold
}

export const squ = function({ x, amp = 2, freq = 1, phase = 0, threshold = 0 }: ISin): number {
  const s = sin({...arguments[0]})
  return s/Math.abs(s) * amp/2;
}