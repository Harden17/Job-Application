import express from 'express';
import request from 'supertest';
import app from '../src/server';
import prisma from '../src/prismaconfig'; 
import {jest} from '@jest/globals';
import jwt from 'jsonwebtoken';

jest.mock('../src/prismaconfig', () => ({
    prisma: {
        job: {
            create: jest.fn(),
        },
    },
    $disconnect: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));


describe('POST /jobs/', () => {
    const mockUserId: number = 999;
    const mockToken: string = jwt.sign(
          { userId: mockUserId }, 
          process.env.JWT_SECRET || 'your-jwt-secret'
    ); 

    beforeAll(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        prisma.$disconnect();
    });

    it('should create a new job successfully', async () => {
        // Arrange: Define the job data to be sent in the request
        const newJob = {
            company: 'Tech Corp',
            jobTitle: 'Full Stack Developer',
            jobUrl: 'https://techcorp.com/jobs/123',
            status: 'Applied',
        };
        // mock the jwt.verify to return the mock userId
        jest.mocked(jwt.verify).mockReturnValue({ userId: mockUserId } as any);
        // mock the prisma.job.create to return the new job with an id and userId
        jest.mocked(prisma.job.create).mockResolvedValue({
            id: 1,
            ...newJob,
            userId: mockUserId,
        } as any);

        // Send the request to the endpoint
        const response = await request(app)
            .post('/jobs/')
            .set('Authorization', `Bearer ${mockToken}`)
            .send(newJob);

        // Assert: Verify the response
        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(mockUserId);
    });    
});