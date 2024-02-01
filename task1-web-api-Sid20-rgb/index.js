const app = require('./app')
const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});

//..................

// const app = require("./app");
// // const port = process.env.PORT
// const https = require("https");
// const fs = require("fs");

// const port = process.env.PORT;
// https
//   .createServer(
//     {
//       cert: fs.readFileSync("./localhost.crt"),
//       key: fs.readFileSync("./localhost.key"),
//     },
//     app
//   )
//   .listen(port);
//.............................

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`)
// });
