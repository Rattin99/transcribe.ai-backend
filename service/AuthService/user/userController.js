import httpStatus from "http-status";
import { userService } from "./userService";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const dotEnv=require('dotenv').config();
const createUser = async (req, res) => {
    try {
      const userData = req.body;
      const result = await userService.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
        userData.phone,
        req
      );
    
        // User created successfully
        res.status(200).json({
          success: true,
          message: 'User created successfully',
          data: result,
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await userService.getUserByEmail(email);
      if (user === 'No email found') {
        return res.status(401).json({
          success: false,
          message: 'Email Does not exist',
        });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
      }
  
      // Parse the expiresIn value to convert it to milliseconds
      const expiresIn = parseInt(process.env.expiresIn) * 24 * 3600;
      
      const token = jwt.sign({ userId: user.id }, process.env.secret, {
        expiresIn,
      });
  
      // Save the token in a cookie
      res.cookie('token', token, {
        httpOnly: true, // Make the cookie accessible only via HTTP(S)
        maxAge: expiresIn, // Use the parsed value directly (in milliseconds)
        sameSite: 'strict', // Adjust this according to your needs
        secure: process.env.NODE_ENV === 'production', // Set to true in production
      });
  
      res.status(httpStatus.OK).json({
        success: true,
        message: 'Login successful',
        id: user.id,
        email: user.email,
        token,
      });
    } catch (error) {
      console.log('Error during login:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred during login',
      });
    }
  };
  export const userController ={
    createUser,
    login
  }