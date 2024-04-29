import bcrypt from 'bcrypt';
import pool from '../../../config/db';
import { generateUUID } from '../../../utils/generateUUID';
import jwt from 'jsonwebtoken';
const dotEnv=require('dotenv').config();
const createUser = async (firstName,lastName,email, password, phone) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert the data (except for userId) into the database
      const [existingUserByEmail] = await pool.execute(
        `SELECT email FROM user WHERE email = ?`,
        [email]
      );
  
      const [existingUserByPhone] = await pool.execute(
        `SELECT phone FROM user WHERE phone = ?`,
        [phone]
      );
  
      if (existingUserByEmail.length > 0) {
        // Email already exists, return an error response
        throw new Error('Email already registered')
        
      }
  
      if (existingUserByPhone.length > 0) {
        // Phone number already exists, return an error response
        throw new Error('Phone number already registered')
        
      }
      const id=generateUUID()
      const values=[id,firstName,lastName,email, hashedPassword, phone]
      console.log(values)
      const [results] = await pool.execute(
        `INSERT INTO user (id,first_name,last_name, email, password, phone) VALUES (?,?,?,?,?,?)`,
        values
      );
      const expiresIn = parseInt(process.env.expiresIn) * 24 * 3600;
      
      const token = jwt.sign({ userId: id }, process.env.secret, {
        expiresIn,
      });
  
      return {
        email: email,
        message: 'Account created successfully',
        token: token
      };
    } catch (error) {
      
      throw new Error(error.message); // Throw the error to be handled in the controller
    }
  };
// get usersEmail
const getUserByEmail = async email => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return 'No email found';
    }
    const user = rows[0];

    return user;
  } catch (error) {
    throw error;
  }
};
  export const userService = {
    createUser,
    getUserByEmail
  }