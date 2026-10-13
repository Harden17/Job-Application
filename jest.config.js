import tsJest from 'ts-jest';

const { createDefaultPreset } = tsJest;

// Pass { useESM: true } to force ts-jest to output modern module code
const tsJestTransformCfg = createDefaultPreset({ useESM: true }).transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // This tells Jest to treat your TypeScript files as ES modules
  extensionsToTreatAsEsm: ['.ts'], 
};
