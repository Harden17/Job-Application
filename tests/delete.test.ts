import {jest} from '@jest/globals'; 
import request from 'supertest';
import jwt from 'jsonwebtoken';

const mockPrisma = {
    job: {
        deleteMany: jest.fn(),
    },
    $disconnect: jest.fn(),
};
jest.unstable_mockModule('../src/prismaconfig', () => ({
    default: mockPrisma,
}));

const {default: prisma} = await import('../src/prismaconfig');
const {default: app} = await import('../src/server');


describe('DELETE /jobs/:id', () => {
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

    it('should delete the job successfully', async () => {
        // Arrange: Define the job ID to be deleted
        const jobId = 1;        
        const mockToken: string = jwt.sign(
            { userId: mockUserId }, 
            process.env.JWT_SECRET || 'your-jwt-secret'
        );

        // mock the prisma.job.deleteMany to return a count of 1, indicating one record was deleted
        jest.mocked(prisma.job.deleteMany).mockResolvedValue({ count: 1 });


        // Send the request to the endpoint
        const response = await request(app)
            .delete(`/jobs/${jobId}`)
            .set('Authorization', `Bearer ${mockToken}`);

        // Assert: Check that the response status is 200 and the response body contains the expected message
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Job application deleted successfully' });    
    });    
});    
