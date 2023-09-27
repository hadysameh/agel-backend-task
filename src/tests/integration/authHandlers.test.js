import request from "supertest";
import { app } from "../../app.js"; // your express app
import db from "../../models/index.js";
import jwt from "jsonwebtoken";
import { globalErrorHandler } from "../../utils/globalErrorHandler.js";
// Mock the database for unit tests
jest.mock("../../models/index.js");
jest.mock("jsonwebtoken");

beforeEach(() => {
  jest.clearAllMocks();
});

const userData = {
  email: "test@test.com",
  userName: "test",
  password: "123456789",
};

describe("POST /api/v1/auth/register", () => {
  it("should return 401 if password and confirmPassword don't match", async () => {
    const data = {
      ...userData,
      confirmPassword: "1234",
    };
    const res = await request(app).post("/api/v1/auth/register").send(data);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "message",
      "password and confirmPassword are not the same!"
    );
  });

  it("should return 201 if user registered successfully", async () => {
    const mockUser = {
      ...userData,
      confirmPassword: "123456789",
    };

    db.User.create.mockResolvedValue(mockUser);

    const res = await request(app).post("/api/v1/auth/register").send(mockUser);

    expect(res.statusCode).toEqual(201);
  });
});

describe("POST /api/v1/auth/login", () => {
  it("should return 400 if no email or password is provided", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "", password: "" });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "message",
      "Please provide email and password!"
    );
  });

  it("should return 401 if email or password is incorrect", async () => {
    db.User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@test.com", password: "password" });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Incorrect email or password");
  });

  it("should return 200 and a token if email and password are correct", async () => {
    db.User.findOne.mockResolvedValue({
      email: "test@test.com",
      password: "password",
      validatePassword: () => true,
    });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@test.com", password: "password" });

    expect(res.statusCode).toEqual(200);
  });
});

describe("POST /api/v1/auth/refresh", () => {
  it("should return 401 if no jwt cookie is provided", async () => {
    const res = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", "");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "message",
      "Invalid token. Please log in again!"
    );
  });

  it("should return 200 and a new access token if jwt cookie is valid", async () => {
    jwt.verify.mockImplementationOnce((token, secret, cb) => {
      cb(null, { id: "123" });
    });

    const res = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", "jwt=validtoken");

    expect(res.statusCode).toEqual(200);
  });
});

app.use(globalErrorHandler);
