import request from "supertest"; // Import the request function to trigger HTTP calls
import { Response } from "supertest";
import app from "../src/server.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../src/prismaconfig.ts";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../src/prismaconfig.ts");
  
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("POST /auth/register", () => {
  // Set up a mock environment variable that your route expects
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

    // 1. Tell our fakes exactly how to behave when the route calls them
    mockBcrypt.hash.mockImplementation(async () => "fakehashedpassword123");
    
    // We fake the Prisma database response to act like it successfully saved a user with ID '999'
    jest.mocked(prisma.user.create).mockResolvedValue({
      id: 999,
      email: user.email,
      password: "fakehashedpassword123"
    } as any);

    // We fake the token generator to return a dummy text pass
    mockJwt.sign.mockImplementation(() => "fake-jwt-token-xyz");

    // 2. ACT: Execute the request using Supertest
    const response: Response = await request(app)
      .post("/auth/register")
      .send(user);

    // 3. ASSERT: Expect the results to match our design specs
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body.token).toBe("fake-jwt-token-xyz");

    // Verify our spy tools tracked that the database was touched exactly once
    expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
  });
}); // <-- Fixed the closing parenthesis here!
