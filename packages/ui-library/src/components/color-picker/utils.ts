import tinycolor, { type ColorInput } from 'tinycolor2';

export type ColorFormat = 'rgb' | 'hex';

const MAX_HUE = 360;
const ALPHA_SCALE = 100;

export function roundTwoDecimal(num: number): number {
  return Math.round(num * 100) / 100;
}

export class Color {
  instance: tinycolor.Instance;
  alphaValue = 0;

  // rgb
  redValue = 0;
  greenValue = 0;
  blueValue = 0;

  // HSV
  hueValue = 0;
  saturationValue = 0;
  brightnessValue = 0;

  constructor(input?: ColorInput) {
    this.instance = tinycolor(input);

    this.initRgb();
    this.initHsb();
    this.initAlpha();
  }

  initAlpha(): void {
    const initAlpha = this.instance.getAlpha();
    this.alphaValue = Math.min(1, initAlpha) * ALPHA_SCALE;
  }

  initRgb(): void {
    const { b, g, r } = this.instance.toRgb();

    this.redValue = roundTwoDecimal(r);
    this.greenValue = roundTwoDecimal(g);
    this.blueValue = roundTwoDecimal(b);
  }

  initHsb(): void {
    const { h, s, v } = this.instance.toHsv();

    this.hueValue = Math.min(MAX_HUE, Math.ceil(h));
    this.saturationValue = roundTwoDecimal(s);
    this.brightnessValue = roundTwoDecimal(v);
  }

  updateFromHsv(h: number, s: number, v: number): void {
    this.instance = tinycolor({
      a: this.alphaValue / ALPHA_SCALE,
      h: roundTwoDecimal(h),
      s: roundTwoDecimal(s),
      v: roundTwoDecimal(v),
    });
    this.initRgb();
  }

  updateFromRgb(r: number, g: number, b: number): void {
    this.instance = tinycolor({
      a: this.alphaValue / ALPHA_SCALE,
      r: roundTwoDecimal(r),
      g: roundTwoDecimal(g),
      b: roundTwoDecimal(b),
    });
    this.initHsb();
  }

  toString(format?: ColorFormat): string {
    return this.instance.toString(format);
  }

  get hexString(): string {
    return this.instance.toHexString();
  }

  get hex(): string {
    return this.instance.toHex();
  }

  set hex(hexString: string) {
    this.instance = tinycolor(hexString);
    this.initHsb();
    this.initRgb();
    this.initAlpha();
  }

  set hue(value: number) {
    if (this.saturation === 0 && this.brightness === 0) {
      this.saturationValue = 1;
      this.brightnessValue = 1;
    }
    this.updateFromHsv(value, this.saturation, this.brightness);
    this.hueValue = roundTwoDecimal(value);
  }

  get hue(): number {
    return this.hueValue;
  }

  set saturation(value: number) {
    this.updateFromHsv(this.hue, value, this.brightness);
    this.saturationValue = roundTwoDecimal(value);
  }

  get saturation(): number {
    return this.saturationValue;
  }

  set brightness(value: number) {
    this.updateFromHsv(this.hue, this.saturation, value);
    this.brightnessValue = roundTwoDecimal(value);
  }

  get brightness(): number {
    return this.brightnessValue;
  }

  set red(value: number) {
    this.updateFromRgb(value, this.green, this.blue);
    this.redValue = roundTwoDecimal(value);
  }

  get red(): number {
    return this.redValue;
  }

  set green(value: number) {
    this.updateFromRgb(this.red, value, this.blue);
    this.greenValue = roundTwoDecimal(value);
  }

  get green(): number {
    return this.greenValue;
  }

  set blue(value: number) {
    this.updateFromRgb(this.red, this.green, value);
    this.blueValue = roundTwoDecimal(value);
  }

  get blue(): number {
    return this.blueValue;
  }

  get rgb(): [number, number, number] {
    return [this.red, this.green, this.blue];
  }
}

type DragHandler = (x: number, y: number) => void;

interface DragEvents {
  handleClick: (e: { clientX: number; clientY: number }) => void;
  onMouseDown: (e: MouseEvent) => void;
  onTouchStart: (e: TouchEvent) => void;
}

export function useElementDrag(handler: DragHandler): DragEvents {
  let rafId: number | null = null;

  function handleClick(e: { clientX: number; clientY: number }): void {
    if (rafId !== null)
      return;

    rafId = requestAnimationFrame(() => {
      handler(e.clientX, e.clientY);
      rafId = null;
    });
  }

  function handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch)
      handleClick(touch);
  }

  function cancelRaf(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function cleanup(): void {
    cancelRaf();
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', handleClick);
      window.removeEventListener('mouseup', cleanup);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', cleanup);
    }
  }

  function onMouseDown(e: MouseEvent): void {
    e.preventDefault();

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleClick);
      window.addEventListener('mouseup', cleanup);
    }
  }

  function onTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch)
      handleClick(touch);

    if (typeof window !== 'undefined') {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', cleanup);
    }
  }

  onUnmounted(() => {
    cleanup();
  });

  return {
    handleClick,
    onMouseDown,
    onTouchStart,
  };
}
