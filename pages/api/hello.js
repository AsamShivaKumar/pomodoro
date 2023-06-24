// import connect from "@/database/connection";
// import { User } from "@/database/schema";

// connect();

// const user = new User({
//   name: "ask",
//   mail: "ask@gmail.com",
//   password: "123456"
// });

// user.save();

export default function handler(req, res) {
  res.status(200).send("Hello World!")
}
