// Import the modules used in tests.
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import request from "supertest";
import { jest } from "@jest/globals";

jest.unstable_mockModule('../src/prismaconfig', () => ({
    default: {
        user: {
            findUnique: jest.fn()
        }
    }
}));

const { default: prisma } = await import('../src/prismaconfig.js');
const { default: app } = await import('../src/server.js');

// Start our test 
describe("POST /auth/login", () => {
    const mockUserId: number = 999;
    const token = jwt.sign(
        { userId: mockUserId }, 
        process.env.JWT_SECRET || 'your-jwt-secret',
        { expiresIn: '24h' },
    );
    const hashedPassword = bcrypt.hashSync("password123", 10);
    beforeAll(() => {
        process.env.JWT_SECRET = "test-secret-key";
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should login a user successfully", async () => {
        const user = {
            email: "test@example.com",
            password: "password123"
        };
        // Here we set up the "stunt double" behaviors using jest.mocked() for clean TypeScript types
        jest.mocked(prisma.user.findUnique).mockResolvedValue({
            id: 999,
            email: user.email,
            password: hashedPassword
        } as any); 

        // now after getting our data we send the request to the endpoint and assert the response
    const response = await request(app)
        .post("/auth/login")
        .send(user);

    // ASSERT: Verify the outcomes
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    });
});