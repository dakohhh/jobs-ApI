const Jobs = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')
const { findByIdAndDelete } = require('../models/Job')

const getJob = async(req,res)=>{
    const {user:{userId},params:{id:jobId}} = req

    const job = await Jobs.findOne({
      id:userId,createdBy:jobId
    });

    if(!job){
       throw new NotFoundError(`No user found with this id ${userId}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const getAlljobs = async(req,res)=>{
  const allJobs = await Jobs.find({createdBy:req.user.userId}).sort('CreatedAt')
  res.status(StatusCodes.OK).json({allJobs,count:allJobs.length})

}



const createJob = async(req,res)=>{
 req.body.createdBy = req.user.userId
 const jobs = await Jobs.create(req.body)

 res.status(StatusCodes.CREATED).json({jobs})
}


const UpdateJob= async(req,res)=>{
  const {
    body:{company,position},
    user:{userId},
    params:{id:jobId}
  } = req

  if(company === " " || position === " "){
    throw new BadRequestError('company and position cannot be empty')
  }
const job = await Jobs.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true})


if(!job){
  throw new NotFoundError(`no user found with this Id ${userId}`)
}

res.status(StatusCodes.OK).json({job})

}




const deleteJob = async(req,res)=>{
    const {
      user:{userId},
      params:{id:jobId}
    } = req
    
    const delJob = await Jobs.findByIdAndRemove({
      _id:jobId,
      createdBy:userId
    });

    if(!delJob){
      throw new NotFoundError(`user not found with Id ${jobId}`)
    }

    res.status(StatusCodes.OK).send('user deleted')

}




  module.exports = {
    getAlljobs,
    getJob,
    createJob,
    UpdateJob,
    deleteJob
  }