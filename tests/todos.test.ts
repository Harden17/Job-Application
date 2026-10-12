import request from 'supertest';
import express from 'express';
import  prisma  from '../src/prismaconfig';
import approutes from '../src/routes/applicationroutes'; 

// Mock the Prisma client globally for this test file
jest.mock('../src/prismaconfig', () => ({
  prisma: {
    job: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

// Create a minimal wrapper app to isolate and test just this route group
const testApp = express();
testApp.use(express.json());

// Simulate your auth middleware injecting `req.userId` for testing
let mockUserId: number | string | undefined = 999;
testApp.use((req: any, res, next) => {
  req.userId = mockUserId;
  next();
});

testApp.use('/jobs', approutes);

describe('GET /jobs (Fetch User Job Applications)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUserId = 999; // Reset to a valid authenticated user before each test
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
        const response = await request(testApp) 
            .get('/jobs');

        // 3. Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobs);
    
        // Ensure Prisma was called with the correct filtering criteria
        expect(prisma.job.findMany).toHaveBeenCalledWith({
            where: { userId: 999 },
        });
    });
});