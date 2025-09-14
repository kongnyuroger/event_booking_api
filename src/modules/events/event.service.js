
import { createUser, findUser } from './event.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();



const ACCESS_EXPIRES = '1h';            
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;


if (!ACCESS_SECRET) {
  throw new Error('Missing ACCESS_TOKEN_SECRET env var');
}

function generateAccessToken(user) {

  return jwt.sign(
    { id: user.id, username: user.username },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
}

export const userService = {
  async register({ name, email, password }) {
    if (!name || !email || !password) throw new Error('name, email and password required');
    if (password.length < 8) throw new Error('Password must be >= 8 characters');

    const existing = await findUser(email);
    if (existing) throw new Error('User already exists with this email');

    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password_hash });

    
    const accessToken = generateAccessToken(user);
    return { message: 'Registration successful', user, accessToken };
  },

  async login({ email, password }) {
    const user = await findUser(email);
    if (!user) throw new Error(`User with email ${email} does not exist`);

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new Error('Password is incorrect');

    const accessToken = generateAccessToken(user);
    
    return { message: 'Login successful', user, accessToken };
  }
};
