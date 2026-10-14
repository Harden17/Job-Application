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
jest.mock('../src/prismaconfig', () => ({
  default: mockedPrisma,
}));

const {default: prisma} = await import('../src/prismaconfig');
const {default: app} = await import('../src/server');

describe('Integration Test for User login then getting todos', () => {
    const UserId: number = 1;
    const token: string = jwt.sign(
              { userId: UserId }, 
              process.env.JWT_SECRET || 'your-jwt-secret'
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
        email: 'user1@example.com',
        password: hashedPassword,
        };
        // Create the jobs for the user
        const todos = [
        { id: 1, title: 'Todo 1', userId: 1 },
        { id: 2, title: 'Todo 2', userId: 1 },
        ];

        // Mock the database calls
        jest.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
        jest.mocked(prisma.job.findMany).mockResolvedValue(todos as any);


        // Send the requests.
        const response = await request(app)
            .post('/auth/login')
            .send(user)

        // Responses
        expect(response.status).toBe(200);
        
        // Send another request to get the todos
        const response1 = await request(app)
            .get('/jobs/')
            .send(todos)
            .set('Authorization', `Bearer ${token}`);

        // Responses
        expect(response1.status).toBe(200);        

    });
});

