import tinycolor, { type ColorInput } from 'tinycolor2';

export type ColorFormat = 'rgb' | 'hex';

export function roundTwoDecimal(num: number) {
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

  // HSL
  hslSaturationValue = 0;
  lightnessValue = 0;

  constructor(input?: ColorInput) {
    this.instance = tinycolor(input);

    this.initRgb();
    this.initHsb();
    this.initLightness();
    this.initAlpha();
  }

  initAlpha = () => {
    const initAlpha = this.instance.getAlpha();
    this.alphaValue = Math.min(1, initAlpha) * 100;
  };

  initLightness = () => {
    const { l, s } = this.instance.toHsl();
    this.hslSaturationValue = roundTwoDecimal(s);
    this.lightnessValue = roundTwoDecimal(l);
  };

  initRgb = () => {
    const { b, g, r } = this.instance.toRgb();

    this.redValue = roundTwoDecimal(r);
    this.greenValue = roundTwoDecimal(g);
    this.blueValue = roundTwoDecimal(b);
  };

  initHsb = () => {
    const { h, s, v } = this.instance.toHsv();

    this.hueValue = Math.min(360, Math.ceil(h));
    this.saturationValue = roundTwoDecimal(s);
    this.brightnessValue = roundTwoDecimal(v);
  };

  toString(format?: ColorFormat) {
    return this.instance.toString(format);
  }

  get hexString() {
    return this.instance.toHexString();
  };

  get hex() {
    return this.instance.toHex();
  }

  set hex(hexString: string) {
    this.instance = tinycolor(hexString);
    this.initHsb();
    this.initRgb();
    this.initAlpha();
    this.initLightness();
  }

  set hue(value: number) {
    if (this.saturation === 0 && this.brightness === 0) {
      this.saturationValue = 1;
      this.brightnessValue = 1;
    }
    this.instance = tinycolor({
      a: this.alphaValue / 100,
      h: roundTwoDecimal(value),
      s: this.saturation,
      v: this.brightness,
    });

    this.initRgb();
    this.initLightness();
    this.hueValue = roundTwoDecimal(value);
  }

  get hue() {
    return this.hueValue;
  }

  set saturation(value: number) {
    this.instance = tinycolor({
      a: this.alphaValue / 100,
      h: this.hue,
      s: roundTwoDecimal(value),
      v: this.brightness,
    });

    this.initRgb();
    this.initLightness();
    this.saturationValue = roundTwoDecimal(value);
  }

  get saturation() {
    return this.saturationValue;
  }

  set brightness(value: number) {
    this.instance = tinycolor({
      a: this.alphaValue / 100,
      h: this.hue,
      s: this.saturation,
      v: roundTwoDecimal(value),
    });

    this.initRgb();
    this.initLightness();
    this.brightnessValue = roundTwoDecimal(value);
  }

  get brightness() {
    return this.brightnessValue;
  }

  set red(value: number) {
    const rgb = this.instance.toRgb();
    this.instance = tinycolor({
      ...rgb,
      a: this.alphaValue / 100,
      r: roundTwoDecimal(value),
    });

    this.initHsb();
    this.initLightness();
    this.redValue = roundTwoDecimal(value);
  }

  get red() {
    return this.redValue;
  }

  set green(value: number) {
    const rgb = this.instance.toRgb();
    this.instance = tinycolor({
      ...rgb,
      a: this.alphaValue / 100,
      g: roundTwoDecimal(value),
    });

    this.initHsb();
    this.initLightness();
    this.greenValue = roundTwoDecimal(value);
  }

  get green() {
    return this.greenValue;
  }

  set blue(value: number) {
    const rgb = this.instance.toRgb();
    this.instance = tinycolor({
      ...rgb,
      a: this.alphaValue / 100,
      b: roundTwoDecimal(value),
    });

    this.initHsb();
    this.initLightness();
    this.blueValue = roundTwoDecimal(value);
  }

  get blue() {
    return this.blueValue;
  }

  get rgb(): [number, number, number] {
    return [this.red, this.green, this.blue];
  }
}

export function useElementDrag(handler: (x: number, y: number) => any) {
  function handleClick(e: { clientX: number; clientY: number }) {
    handler(e.clientX, e.clientY);
  }

  function onMouseDown(e: MouseEvent) {
    e.preventDefault();

    window.addEventListener('mousemove', handleClick);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseUp() {
    window.removeEventListener('mousemove', handleClick);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  onUnmounted(() => {
    handleMouseUp();
  });

  return {
    handleClick,
    onMouseDown,
  };
}
