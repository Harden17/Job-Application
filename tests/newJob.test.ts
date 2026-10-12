import express from 'express';
import request from 'supertest';
import approurtes from '../src/routes/applicationroutes';
import prisma from '../src/prismaconfig'; 
import {jest} from '@jest/globals';

jest.mock('../src/prismaconfig', () => ({
    prisma: {
        job: {
            create: jest.fn(),
        },
    },
    $disconnect: jest.fn(),
}));
