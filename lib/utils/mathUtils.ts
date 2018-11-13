export const power = (base: number) => (exp: number) => Math.pow(base, exp);

const byteMaxValue = power(2)(8) - 1;

export const bytesMaxValue = (bytes: number) => bytes * byteMaxValue;
