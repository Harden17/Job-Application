import request from 'supertest';
import  prisma   from '../src/prismaconfig';
import app from '../src/server';
import { jest } from '@jest/globals'; 

// Mock the Prisma client globally for this test file
jest.mock('../src/prismaconfig', () => ({
  prisma: {
    job: {
      findMany: jest.fn(),
    },
    // this is going to allow us disconnect the prisma client after all tests are done. more like a clean exit.
    $disconnect: jest.fn(),
  },
}));



describe('GET /jobs/', () => {
  // create a mock userid.
  const mockUserId: number = 999;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should successfully return all jobs matching the logged-in userId', async () => {
        // 1. Arrange: Define what Prisma should return
        const mockJobs = [
            { id: 1, title: 'Frontend Developer', userId: 999, status: 'Applied' },
            { id: 2, title: 'Backend Engineer', userId: 999, status: 'Interviewing' },
        ];
        jest.mocked(prisma.job.findMany).mockResolvedValue(mockJobs as any);

        // 2. Act: hit the router root "/" via the wrapper app mount "/jobs"
        const response = await request(app) 
            .get('/jobs/');

        // 3. Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobs);
    
        // Ensure Prisma was called with the correct filtering criteria
        expect(prisma.job.findMany).toHaveBeenCalledWith({
            where: { userId: 999 },
        });
    });
});