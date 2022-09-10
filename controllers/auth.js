const {StatusCodes} = require('http-status-codes')
const users = require('../models/User')
const {BadRequestError,UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken')


const register = async(req,res)=>{
    const user = await users.create({...req.body})
    const token = user.Createjwt()
   res.status(StatusCodes.CREATED).json({users:{user:user._id,name:user.name},token})
}

const login = async(req,res)=>{
  const {email,password} = req.body

  if(!email || !password){
    throw new BadRequestError('Please provide email and password')
  }

  const user = await users.findOne({email})

  if(!user){
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const checkPassword = await user.comparePassword(password);

  if(!checkPassword){
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const token = user.Createjwt() 

  res.status(StatusCodes.OK).json({user:{name:user.name},token})
}




module.exports = {
    register,
    login
}




