import request from "supertest";
import { app } from "../../app.js"; // your express app
import db from "../../models/index.js";
// Mock the database for unit tests
jest.mock("../../models/index.js");

beforeEach(() => {
  jest.clearAllMocks();
});

// Unit tests
describe("Unit tests for handlers", () => {
  test("getUsers should return all users", async () => {
    const mockUsers = [
      { id: 1, email: "test@test.com", userName: "test", password: "test" },
    ];
    db.User.findAll.mockResolvedValue(mockUsers);
    const res = await request(app).get("/api/v1/users");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("users", mockUsers);
  });

  test("getUser should return specific user with id", async () => {
    const mockUser = {
      id: 1,
      email: "test@test.com",
      userName: "test",
      password: "test",
    };

    db.User.findOne.mockResolvedValue(mockUser);
    const res = await request(app).get("/api/v1/users/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("user", mockUser);
  });

  test("createUser should create new user", async () => {
    const mockUser = {
      email: "test@test.com",
      userName: "test",
      password: "123456789",
    };

    db.User.create.mockResolvedValue(mockUser);
    const res = await request(app).post("/api/v1/users");
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
  });

  test("deleteUser should delete existing user", async () => {
    const numOfModifiedRecords = 1;

    db.User.destroy.mockResolvedValue(numOfModifiedRecords);

    const res = await request(app).delete("/api/v1/users/4");
    expect(res.statusCode).toEqual(204);
  });

  test("updateUser should delete existing user", async () => {
    const numOfModifiedRecords = 1;

    db.User.update.mockResolvedValue(numOfModifiedRecords);

    const res = await request(app).patch("/api/v1/users/4");
    expect(res.statusCode).toEqual(200);
  });
});
