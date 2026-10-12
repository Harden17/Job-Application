import tsJest from 'ts-jest';

const { createDefaultPreset } = tsJest;

// Pass { useESM: true } to force ts-jest to output modern module code
const tsJestTransformCfg = createDefaultPreset({ useESM: true }).transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  // So basically this line tells jest to include the jest.setup.ts file before running any tests. This is important because we are mocking some modules in that file.
  setupFilesAfterEnv: ['./tests/jest.setup.ts'],
  transform: {
    ...tsJestTransformCfg,
  },
  // This tells Jest to treat your TypeScript files as ES modules
  extensionsToTreatAsEsm: ['.ts'], 
};
