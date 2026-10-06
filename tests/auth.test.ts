import { jest } from '@jest/globals'; 
import request from "supertest";
import app from "../src/server";
import jwt from "jsonwebtoken";
import prisma from "../src/prismaconfig";
import bcrypt from "bcrypt";

// after the importation mock the modules.
jest.mock("jsonwebtoken");
jest.mock("../src/prismaconfig");
jest.mock("bcrypt");


// now we can write our test cases for the /auth/login endpoint
describe("POST /auth/login", () => {
    // Here we setup the necessary env variable.
    beforeAll(() => {
        process.env.JWT_SECRET = "test-secret-key";
    });
    // here we clear the mocks after every test.so that  one test doesnt affect the other since the mock history is kept.
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should login a user successfully", async () => {
        const user = {
            email: "test@example.com",  
            password: "password123"
        };
        // tell our mocked modules how to behave.
        jest.mocked(bcrypt.hash).mockResolvedValue("fakehashedpassword123" as never);
        jest.mocked(jwt.sign).mockReturnValue("fake-jwt-token-xyz" as any);
        jest.mocked(prisma.user.create).mockResolvedValue({
            id: 999,
            email: user.email,
            password: "fakehashedpassword123"
        } as any);
        // Excecute the endpoint
        const response = await request(app)
            .post("/auth/login")
            .send(user);
        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });      
    
}); 