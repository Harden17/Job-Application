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
});