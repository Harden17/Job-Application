import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken'; 

//Mock the prisma module
const mockPrisma = {
    job: {
        updateMany: jest.fn(),
        findFirst: jest.fn(),
    },
    $disconnect: jest.fn(),
};
jest.unstable_mockModule('../src/prismaconfig', () => ({
    default: mockPrisma,
}));

// So these static imports are going to first wait for us to mock prisma.
const {default: prisma} = await import('../src/prismaconfig');
const {default: app} = await import('../src/server');


describe('PATCH /jobs/:id', () => {
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

    it('should update the job status successfully', async () => {
        // Arrange: Define the job ID and the new status to be sent in the request
        const jobId = 1;
        const updatedStatus = { status: 'Interview' };

        jest.mocked(prisma.job.updateMany).mockResolvedValue({ count: 1 });
        
        // Send the request to the endpoint
        const response = await request(app)
        // See here we are patching the id 
            .patch(`/jobs/${jobId}`)
            .set('Authorization', `Bearer ${mockToken}`)
            .send(updatedStatus);

        // Assert: Check that the response status is 200 and the response body contains the expected message
        expect(response.body).toEqual({ message: 'Job status updated successfully' });
        expect(response.status).toBe(200);

    });    
});    