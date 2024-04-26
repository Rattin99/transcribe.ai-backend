import bcrypt from 'bcrypt';
import pool from '../../../config/db';
const createUser = async (firstName,lastName,email, password, phone) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert the data (except for userId) into the database
      const [existingUser] = await pool.execute(
        `SELECT * FROM user WHERE email = ?`,
        [email]
      );
      if (existingUser.phone > 0) {
        // Email already exists, return an error response
        return {
          message: 'Phone number already registered',
        };
      }
      const values=[firstName,lastName,email, hashedPassword, phone]
      console.log(values)
      const [results] = await pool.execute(
        `INSERT INTO user (first_name,last_name, email, password, phone) VALUES (?,?,?,?,?)`,
        values
      );

      return {
        email: email,
        message: 'Account created successfully',
      };
    } catch (error) {
      console.log(error);
      throw new Error("Internel Server Error"); // Throw the error to be handled in the controller
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