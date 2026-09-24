import tsJest from 'ts-jest';

// Extract the preset creator from the ts-jest default export
const { createDefaultPreset } = tsJest;
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // This tells Jest to treat your TypeScript files as ES modules
  extensionsToTreatAsEsm: ['.ts'], 
};
