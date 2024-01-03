const supertest = require("supertest");

const app = require("../app");
const { default: mongoose } = require("mongoose");
const User = require("../models/User");

const api = supertest(app);

let validToken;

beforeAll(async () => {
  await User.deleteMany({});
});

test("user registration", async () => {
  const res = await api
    .post("/users/register")
    .send({
      username: "testuser1",
      email: "test@gmail.com",
      password: "test123",
    })
    .expect(201);

  // console.log(res.body)
  expect(res.body.username).toBe("testuser1");
});

test("registration of duplicate username", () => {
  return api
    .post("/users/register")
    .send({
      username: "testuser1",
      email: "test@gmail.com",
      password: "test123",
    })
    .expect(400)
    .then((res) => {
      // console.log(res.body)
      expect(res.body.error).toMatch(/Duplicate/);
    });
});

test("registered user can login", async () => {
  const res = await api
    .post("/users/login")
    .send({
      username: "testuser1",
      password: "test123",
    })
    .expect(200);
  validToken = res.body.token;
  expect(res.body.token).toBeDefined();
});

test("user login with unregistered username", async () => {
  const res = await api
    .post("/users/login")
    .send({
      username: "testuser3",
      password: "test143",
    })
    .expect(400);
  expect(res.body.error).toMatch(/registered/);
});

test("user login with wrong password", async () => {
  const res = await api
    .post("/users/login")
    .send({
      username: "testUser",
      password: "test1234",
    })
    .expect(400);
});

test("user login with incomplete fields", async () => {
  const res = await api
    .post("/users/login")
    .send({
      username: "testUser",
    })
    .expect(400);
});

test("update user profile - successful update", async () => {
  const res = await api
    .put("/users/updateProfile")
    .set("Authorization", `Bearer ${validToken}`)
    .send({
      email: "Updated Email",
    })
    .expect(200);

  expect(res.body.email).toBe("Updated Email");
});

test("update user profile - unauthorized", async () => {
  const res = await api
    .put("/users/updateProfile")
    .send({
      fullname: "Unauthorized Update",
    })
    .expect(401);

  expect(res.body.error).toBe("auth token not present");
});

test("update password - incorrect current password", async () => {
  const res = await api
    .put("/users/change-password")
    .set("Authorization", `Bearer ${validToken}`)
    .send({
      currentPassword: "wrongPassword",
      newPassword: "newPassword123",
      confirmPassword: "newPassword123",
    })
    .expect(401);

  expect(res.body.error).toBe("Incorrect current password");
});

test("update password - new password and confirm password do not match", async () => {
  const res = await api
    .put("/users/change-password")
    .set("Authorization", `Bearer ${validToken}`)
    .send({
      currentPassword: "test123",
      newPassword: "newPassword123",
      confirmPassword: "mismatchPassword",
    })
    .expect(400);

  expect(res.body.error).toBe("New password and confirm password do not match");
});

test("update password - new password same as current password", async () => {
  const res = await api
    .put("/users/change-password")
    .set("Authorization", `Bearer ${validToken}`)
    .send({
      currentPassword: "test123",
      newPassword: "test123",
      confirmPassword: "test123",
    })
    .expect(400);

  expect(res.body.error).toBe(
    "New password must be different from the current password"
  );
});

test("update password - successful", async () => {
  const res = await api
    .put("/users/change-password")
    .set("Authorization", `Bearer ${validToken}`) // Use the stored token
    .send({
      currentPassword: "test123",
      newPassword: "newPassword123",
      confirmPassword: "newPassword123",
    })
    .expect(204);

  // Perform login with the updated password
  const loginRes = await api
    .post("/users/login")
    .send({
      username: "testuser1",
      password: "newPassword123",
    })
    .expect(200);

  expect(loginRes.body.token).toBeDefined();
});

test("get user info by ID", async () => {
  const newUser = await User.create({
    username: "getUserInfoTest",
    password: "test123456789",
    email: "getinfo@test.com",
  });

  const res = await api
    .get(`/users/${newUser._id}`)
    .set("Authorization", `Bearer ${validToken}`)
    .expect(200);

  expect(res.body.username).toBe("getUserInfoTest");
});

test("get user profile", async () => {
  const res = await api
    .get("/users")
    .set("Authorization", `Bearer ${validToken}`)
    .expect(200);
});

afterAll(async () => await mongoose.connection.close());
