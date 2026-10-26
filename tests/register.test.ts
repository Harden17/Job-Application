// Import the modules used in tests.
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import request from "supertest";
import { jest } from "@jest/globals";

jest.unstable_mockModule('../src/prismaconfig', () => ({
    default: {
        user: {
            create: jest.fn(),
        },
    },
}));

const { default: prisma } = await import('../src/prismaconfig.js');
const { default: app } = await import('../src/server.js');

// Start our test
describe("POST /auth/register", () => {
    const mockUserId: number = 999;
    const token = jwt.sign(
        { userId: mockUserId }, 
        process.env.JWT_SECRET || 'your-jwt-secret',
        { expiresIn: '24h' },
    );

    
  afterEach(() => {
      jest.clearAllMocks();
  });

  it("should register a user successfully", async () => {
      const user = {
          email: "test@example.com",
          password: "password123"
      };
      // Here we set up the "stunt double" behaviors using jest.mocked() for clean TypeScript types 
      const hashedPassword =  bcrypt.hashSync(user.password, 10);
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
  });
});    