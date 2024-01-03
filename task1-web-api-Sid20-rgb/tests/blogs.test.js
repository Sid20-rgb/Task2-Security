const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/Blog");
const User = require("../models/User");
const Comment = require("../models/comment");
const { default: mongoose } = require("mongoose");
const api = supertest(app);

let token = "";
let userId = "";

beforeAll(async () => {
  await Blog.deleteMany();
  await User.deleteMany();
  await Comment.deleteMany();

  const user = await api.post("/users/register").send({
    username: "testuser2",
    email: "test@gmail.com",
    password: "test123",
  });

  userId = user._id;

  const blog = await Blog.create({
    title: "Love and London",
    content: "This is a blog about love and London",
    contentImg: "contentImg",
    blogCover: "blogCover",
    user: userId,
  });

  const res = await api.post("/users/login").send({
    username: "testuser2",
    password: "test123",
  });
  token = res.body.token;
});

console.log(token);

afterAll(async () => await mongoose.connection.close());

test("logged in user can get list of blogs", async () => {
  const res = await api
    .get("/blogs")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.data[0].title).toMatch(/London/);
});

test("logged in user can get a blog by id", async () => {
  const blog = await Blog.findOne({ title: "Love and London" });
  const res = await api
    .get(`/blogs/${blog._id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.title).toMatch(/London/);
});

test("logged in user can update a blog", async () => {
  const blog = await Blog.findOne({ title: "Love and London" });
  const res = await api
    .put(`/blogs/${blog._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Love and London (Updated)",
      content: "This is a blog about love and London (Updated)",
      contentImg: "contentImg (Updated)",
      blogCover: "blogCover (Updated)",
    })
    .expect(200);

  expect(res.body.title).toMatch(/Love and London \(Updated\)/);
});

// test("logged in user can create a blog", async () => {
//   const res = await api
//     .post("/blogs")
//     .set("Authorization", `Bearer ${token}`)
//     .send({
//       title: "New Blog",
//       content: "This is a new blog",
//       contentImg: "contentImg",
//       blogCover: "blogCover",
//     })
//     .expect(201);

//   expect(res.body.title).toMatch(/New Blog/);
// });

test("logged in user can get blogs uploaded by current user", async () => {
  const res = await api
    .get("/blogs/uploaded-by-current-user")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
});

test("logged in user can bookmark a blog", async () => {
  const blog = await Blog.findOne({ title: "Love and London (Updated)" });
  const res = await api
    .post(`/blogs/bookmark/${blog._id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.message).toBe("Blog bookmarked successfully");
});

test("logged in user can remove bookmark from a blog", async () => {
  const blog = await Blog.findOne({ title: "Love and London (Updated)" });
  const res = await api
    .delete(`/blogs/bookmark/${blog._id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.message).toBe("Blogmark removed successfully");
});

test("logged in user can get bookmarked blogs", async () => {
  const res = await api
    .get("/blogs/bookmarked-blogs")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.data.length).toBe(0);
});

test("logged in user can get blogs by user id", async () => {
  const res = await api
    .get(`/blogs/user/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
});

test("logged in user can search blogs", async () => {
  const res = await api
    .get("/blogs/search?query=London")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.length).toBeGreaterThan(0);
});

test("logged in user can search users", async () => {
  const res = await api
    .get("/blogs/searchUser?query=testuser2")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.length).toBeGreaterThan(0);
});
