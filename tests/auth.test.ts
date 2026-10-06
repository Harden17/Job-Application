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
    });        
}); 