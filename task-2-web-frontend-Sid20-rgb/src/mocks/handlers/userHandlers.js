import { rest } from "msw";

const API_BASE_URL = "http://localhost:3001/";

export const userHandlers = [
  // User registration
  rest.post(`${API_BASE_URL}/users/register`, (req, res, ctx) =>
    res(
      ctx.status(201),
      ctx.json({ status: "success", message: "User created" })
    )
  ),

  // User login
  rest.post(`${API_BASE_URL}/users/login`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({ status: "success", token: "your_jwt_token_here" })
    )
  ),

  // Get user profile
  rest.get(`${API_BASE_URL}/users/`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            username: "shasmitbasnet",
            email: "shasmitbasnet@gmail.com",
            image: "IMG-1688881123983.jpeg",
            password:
              "$2a$10$.ZkYAD/AD3s4/hKSBrG.PuECp896Ce4vxSmwpD.obeb/Zwab.MXsy",
            bookmarkedBlogs: [
              "64ae319b5be0c1d4536c8992",
              "64bf77a9a6573e9c959e92d5",
            ],
            id: "64a79e961ca6dafce4db1df0",
          },
        ],
      })
    )
  ),

  // Get user info from user id
  rest.get(`${API_BASE_URL}/users/:user_id`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        username: "shasmitbasnet",
        email: "shasmitbasnet@gmail.com",
        image: "IMG-1688881123983.jpeg",
        password:
          "$2a$10$.ZkYAD/AD3s4/hKSBrG.PuECp896Ce4vxSmwpD.obeb/Zwab.MXsy",
        bookmarkedBlogs: [
          "64ae319b5be0c1d4536c8992",
          "64bf77a9a6573e9c959e92d5",
        ],
        id: "64a79e961ca6dafce4db1df0",
      })
    )
  ),

  // Update password
  rest.put(`${API_BASE_URL}/users/change-password`, (req, res, ctx) =>
    res(ctx.status(204))
  ),

  // Update user profile
  rest.put(`${API_BASE_URL}/users/edit-profile`, (req, res, ctx) => {
    const updatedData = req.data;
    return res(ctx.status(200), ctx.json({ data: updatedData }));
  }),

  // Upload image
  rest.post(`${API_BASE_URL}/users/uploadImage`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ success: true, data: "image_url_here" }))
  ),

  // User logout
  rest.get(`${API_BASE_URL}/users/logout`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({ status: "success", message: "User logged out" })
    )
  ),
];
