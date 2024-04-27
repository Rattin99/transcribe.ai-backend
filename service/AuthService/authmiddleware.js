import httpStatus from "http-status";
import pool from "../../config/db";
import jwt from 'jsonwebtoken';
const dotEnv=require('dotenv').config();
const getUserById = async userid => {
    try {
      const [rows] = await pool.execute('SELECT * FROM user WHERE id = ?', [
        userid,
      ]);
      const user = rows[0];
      return user;
    } catch (error) {
      throw error;
    }
  };
const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        status: httpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: 'Please log in',
      });
    }
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.secret);
      // Check if the user exists in your database using the decoded token information
      const user = await getUserById(decoded.userId); // Replace with your actual function to fetch the user by ID
      if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          status: httpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: 'User not found',
        });
      }
      // Attach the user information to the request object
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Token is invalid' });
      } else if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token has expired' });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
  export default authenticateToken;