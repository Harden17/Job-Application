// Import the modules used in tests.
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../src/prismaconfig";
import request from "supertest";
import app from "../src/server";
import { jest } from "@jest/globals";

// Start our test
describe("POST /auth/register", () => {
  beforeAll(() => {
      process.env.JWT_SECRET = "test-secret-key"
  });
  afterEach(() => {
      jest.clearAllMocks();
  });

  it("should register a user successfully", async () => {
      const user = {
          email: "test@example.com",
          password: "password123"
      };
      // Here we set up the "stunt double" behaviors using jest.mocked() for clean TypeScript types 
      jest.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as any);
      jest.mocked(jwt.sign).mockReturnValue("fake-jwt-token-xyz" as any);
      jest.mocked(prisma.user.create).mockResolvedValue({
          id: 999,
          email: user.email,
          password: "hashed-password"
      } as any);

      // now after getting our data we send the request to the endpoint and assert the response
      const response = await request(app)
          .post("/auth/register")
          .send(user);  
      // ASSERT: Verify the outcomes
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.token).toBe("fake-jwt-token-xyz");    
  });
});    