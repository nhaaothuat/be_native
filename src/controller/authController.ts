import TryCatch from "../utils/TryCatch.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import { sql } from "../utils/db.js";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const Login = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const result = await sql`
   SELECT * FROM users WHERE email = ${email}
   `;

  if (!result || result.length === 0) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const user = result[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Wrong password" });
    return;
  }
  
  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "10h" });
  let finalUser = {...user,token}
  res.status(200).json({message:"Login Successfully",result:finalUser})
});

export const Register = TryCatch(async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await sql`
     INSERT INTO users (username, email, password) VALUES (${username},${email},${hashedPassword}) 
     RETURNING *
     `;

  res.status(200).json({
    message: "User created successfully",
    user: result[0],
  });
});
