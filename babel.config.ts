import type { TransformOptions } from '@babel/core';

const config: TransformOptions = {
  presets: ['babel-preset-expo'],
  plugins: ['nativewind/babel'],
};

export default config;