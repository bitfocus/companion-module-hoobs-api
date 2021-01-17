import { getMired } from './utils';

export const BRIGHTNESS_MIN = 1
export const BRIGHTNESS_MAX = 100;

export const MIRED_MIN = 154;
export const MIRED_MAX = 370;

export const KELVIN_MAX = 6500;
export const KELVIN_MIN = 2700;
export const KELVIN_STEP = 50;

export const KELVIN_LIST = Array.from(Array((KELVIN_MAX - KELVIN_MIN) / KELVIN_STEP + 1).keys())
	.map(n => (n + (KELVIN_MIN / KELVIN_STEP)) * KELVIN_STEP)
	.reverse();

export const TEMP_CHOICES = KELVIN_LIST.map(kelvin => ({ id: getMired(kelvin), label: `${kelvin}K` }));
