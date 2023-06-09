const crypto = require("crypto")
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"please Provide your Name"],
  },
  email:{
    type:String,
    required:[true,"please Provide your Email"],
    unique:true,
    lowercase:true,
    validate:[validator.isEmail,"Please provide a Valid Email Address"]
  },
  photo:String,

  role:{
    type:String,
    enum:["user","creator","admin","guide"],
    default:"user"
  },
 
  password:{
    type:String,
    required:[true,"please provide your Password"],
    minlength:8, 
    select:false
  },
  passwordConfirm:{
    type:String,
    required:[true,"Please confirm your Password"],
    validate:{
      validator:function(el){
        return el === this.password
      },
      message:"Password is not the Same"
    }
  },
  passwordChangedAt : Date,
  passwordResetToken:String,
  passwordResetExpires:Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});

userSchema.pre(/^find/,function(next){
  this.find({active:{$ne:false}})
  next()
})

userSchema.pre("save",function(next){
  if(!this.isModified("password") || this.isNew) return next()

  this.passwordChangedAt = Date.now() -1000
  next()
})

userSchema.pre("save",async function(next){
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password,12)
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
){
  return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  if (this.passwordChangedAt){
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() /1000,10)
    return JWTTimestamp < changedTimeStamp

  }
  return false
}

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  console.log({resetToken},this.passwordResetToken)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  
  return resetToken
}

const User = mongoose.model("User",userSchema);
module.exports = User;
