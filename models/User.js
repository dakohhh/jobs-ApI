const mongoose = require('mongoose')
const bcrpyt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide a name'],
        maxLength:50,
        minLength:3
    },
    email:{
        type:String,
        required:[true,'please provide a valid email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ,'please provide a new email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'please provide a password'],
        minLength:6,
    },
});


userSchema.pre('save', async function(){
    const salt = await bcrpyt.genSalt(10)
    this.password = await bcrpyt.hash(this.password,salt)
})

userSchema.methods.Createjwt = function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.LASTING})
}


userSchema.methods.comparePassword =  async function(compares){
    const isMatch = await bcrpyt.compare(compares,this.password)
    return isMatch
}


module.exports = mongoose.model('user',userSchema)