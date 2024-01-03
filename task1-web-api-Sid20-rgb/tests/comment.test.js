const supertest = require("supertest");

const app = require("../app");
const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/comment");

const api = supertest(app);

let validToken;

beforeAll(async () => {
  await User.deleteMany();
  await Blog.deleteMany();
  await Comment.deleteMany();

  await api.post("/users/register").send({
    username: "testuser3",
    email: "test3@gmail.com",
    password: "test1234",
  });

  const res = await api.post("/users/login").send({
    username: "testuser3",
    password: "test1234",
  });

  validToken = res.body.token;
});

test("logged in user can create a comment", async () => {
  const blog = await Blog.create({
    title: "Love and London",
    content: "This is a blog about love and London",
    contentImg: "contentImg",
    blogCover: "blogCover",
  });

  return api
    .post(`/comments/${blog._id}`)
    .set("Authorization", `Bearer ${validToken}`)
    .send({
      content: "This is a comment",
      blogId: blog._id,
    })
    .expect(201);
});

test("logged in user can delete their comment - unauthorized", async () => {
  // Create a new test user
  await api.post("/users/register").send({
    username: "testuser4",
    email: "test4@gmail.com",
    password: "test1234",
  });

  // Login as the new test user to get a different token
  const loginRes = await api.post("/users/login").send({
    username: "testuser4",
    password: "test1234",
  });

  const newValidToken = loginRes.body.token;

  const blog = await Blog.create({
    title: "Love and London",
    content: "This is a blog about love and London",
    contentImg: "contentImg",
    blogCover: "blogCover",
  });

  const user = await User.findOne({ username: "testuser4" });

  const comment = await Comment.create({
    content: "This is a comment",
    blogId: blog._id,
    user: user._id,
  });

  return api.delete(`/comments/${comment._id}`).expect(401);
});

afterAll(async () => await mongoose.connection.close());
