import { jest } from '@jest/globals'; 
import request from "supertest"; 
import app from "../src/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../src/prismaconfig";

// 1. Tell Jest to automatically mock these modules before anything else runs
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../src/prismaconfig", () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
    },
  },
}));

describe("POST /auth/register", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-key";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register a user successfully", async () => {
    const user = {
      email: "test@example.com",
      password: "password123"
    };

    // 2. Setup the "stunt double" behaviors using jest.mocked() for clean TypeScript types
    jest.mocked(bcrypt.hash).mockResolvedValue("fakehashedpassword123" as never);
    jest.mocked(jwt.sign).mockReturnValue("fake-jwt-token-xyz" as any);
    jest.mocked(prisma.user.create).mockResolvedValue({
      id: 999,
      email: user.email,
      password: "fakehashedpassword123"
    } as any);

    // 3. ACT: Execute the endpoint
    const response = await request(app)
      .post("/auth/register")
      .send(user);

    // 4. ASSERT: Verify the outcomes
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body.token).toBe("fake-jwt-token-xyz");

    // Verify the database spy was called exactly once
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });
});
