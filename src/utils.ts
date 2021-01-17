export const mround = (value: number, precision: number): number => Math.round(value / precision) * precision;

export const miredToKelvin = (mired: number): number => 1e6 / mired;
export const kelvinToMired = (kelvin: number): number => 1e6 / kelvin;

export const getKelvin = (mired: number): number => mround(miredToKelvin(mired), 50);
export const getMired = (kelvin: number): number => Math.round(kelvinToMired(kelvin));

export type Level = 'info' | 'warn' | 'error' | 'debug';
export type Status = null | 0 | 1 | 2;
export type LogMessage = { level: Level, message: string };

export type Token = string;
