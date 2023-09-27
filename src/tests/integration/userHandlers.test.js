import request from "supertest";
import { app } from "../../app.js"; // your express app
import db from "../../models/index.js";

const getLatestUser = async () => {
  const users = await db.User.findAll({
    limit: 1,
    where: {
      //your where conditions, or without them if you need ANY entry
    },
    order: [["createdAt", "DESC"]],
  });
  return users[0];
};

describe("Integration tests for handlers", () => {
  test("getUsers should return all users", async () => {
    const res = await request(app).get(`/api/v1/users`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("users");
  });

  test("getUser should return specific user with id", async () => {
    const res = await request(app).get("/api/v1/users/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
  });

  test("getUser should return specific user with id", async () => {
    const res = await request(app).get("/api/v1/users/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
  });

  test("createUser should create new user", async () => {
    const latestUser = await getLatestUser();

    const res = await request(app)
      .post("/api/v1/users")
      .send({
        email: `test${Number(latestUser.id) + 1}@test.com`,
        password: "123",
        confirmPassword: "123",
        userName: "test",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("data");
  });

  test("updateUser should update existing user", async () => {
    const latestUser = await getLatestUser();

    const res = await request(app)
      .patch("/api/v1/users/" + latestUser.id)
      .send({
        userName: `test${Number(latestUser.id) + 1}`,
      });
    expect(res.statusCode).toEqual(200);
  });
  test("deleteUser should delete existing user", async () => {
    const latestUser = await getLatestUser();
    const res = await request(app).delete("/api/v1/users/" + latestUser.id);
    expect(res.statusCode).toEqual(204);
  });
});
