import request from 'supertest';
import { jest } from '@jest/globals'; 
import jwt from 'jsonwebtoken';

// Mock the Prisma client globally for this test file
jest.unstable_mockModule('../src/prismaconfig', () => ({
  default: {
    job: {
      findMany: jest.fn(),
    },
    // this is going to allow us disconnect the prisma client after all tests are done. more like a clean exit.
    $disconnect: jest.fn(),
  },
}));

const { default: prisma } = await import('../src/prismaconfig');
const { default: app } = await import('../src/server');

describe('GET /jobs/', () => {
  // create a mock userid.
  const mockUserId: number = 999;
  const mockToken: string = jwt.sign(
      { userId: mockUserId }, 
      process.env.JWT_SECRET || 'your-jwt-secret'
    );  

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
            .get('/jobs/')
            .set('Authorization', `Bearer ${mockToken}`); 

        // 3. Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobs);
    
        // Ensure Prisma was called with the correct filtering criteria
        expect(prisma.job.findMany).toHaveBeenCalledWith({
            where: { userId: 999 },
        });
    });
});