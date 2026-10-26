import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const mockedPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  job: {
    findMany: jest.fn(),
  },
  $disconnect: jest.fn(),
};
jest.unstable_mockModule('../src/prismaconfig', () => ({
    __esModule: true,
  default: mockedPrisma,
}));

const {default: prisma} = await import('../src/prismaconfig');
const {default: app} = await import('../src/server');

describe('Integration Test for User login then getting todos', () => {
    const UserId: number = 1;
    const token: string = jwt.sign(
              { userId: UserId }, 
              process.env.JWT_SECRET || 'your-jwt-secret',
              {expiresIn: "24h"}
    ); 
    const hashedPassword = bcrypt.hashSync('password123', 10);
    beforeAll(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        prisma.$disconnect();
    });

    it('should login and get todos successfully', async () => {
        // Create a user with a hashed password
        const user = {
        id :1,   
        email: 'user1@example.com',
        password: hashedPassword,
        };
        // Create the jobs for the user
        const jobs = [
    {
        id: 1,
        userId: 1,
        company: 'Example Company',
        jobTitle: 'Backend Developer',
        jobUrl: 'https://example.com/jobs/1',
        status: 'Applied',
    },
    {
        id: 2,
        userId: 1,
        company: 'Another Company',
        jobTitle: 'Junior Software Developer',
        jobUrl: 'https://example.com/jobs/2',
        status: 'Interview',
    },
];
        // Mock the database calls
        jest.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
        jest.mocked(prisma.job.findMany).mockResolvedValue(jobs as any);


        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: user.email,
                password: 'password123'
            });

        expect(loginResponse.status).toBe(200);

        const token = loginResponse.body.token;

        expect(token).toBeDefined();

        const jobsResponse = await request(app)
            .get('/jobs')
            .set('Authorization', `Bearer ${token}`);
             
        expect(jobsResponse.status).toBe(200);
    });
});

