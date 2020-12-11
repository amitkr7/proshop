//This is going to validate token
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token
  //check if there is token and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //get the token without Bearer in front of it
      token = req.headers.authorization.split(' ')[1]
      //jsonweb token will verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      //get the user from database by decoded id if any(without password)
      req.user = await User.findById(decoded.id).select('-password')
      console.log(decoded)

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not Auuthorized,token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not Authorized, No Token')
  }
})

export { protect }
