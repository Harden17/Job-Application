import request from "supertest";
import app from "../src/server";
import jwt from "jsonwebtoken";
import prisma from "../src/prismaconfig";
import bcrypt from "bcrypt";

// after the importation mock the modules.
jest.mock("jsonwebtoken");
jest.mock("../src/prismaconfig");
jest.mock("bcrypt");