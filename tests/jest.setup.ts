// jest.setup.ts
// Why we are doing all this is because we are telling jest that these our functions provided by these modules.
import { jest } from "@jest/globals";

// 1. Mock bcrypt with pure JS stubs to avoid native C++ compilation bugs
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// 2. Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// 3. Mock Prisma completely
jest.mock("../src/prismaconfig", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));
