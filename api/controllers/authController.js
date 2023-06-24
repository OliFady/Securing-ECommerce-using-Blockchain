const User = require("./../models/userModel")
const crypto = require("crypto")
const {promisify} = require("util")
const jwt = require("jsonwebtoken")
const AppError = require("../Utils/appError")
const sendEmail = require("../Utils/email")

const signToken = (id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES
  })
}

const catchAsync = (fun) =>{
  return(req,res,next)=>{
  fun(req,res,next).catch(next)
}
}

const createSentToken = (user,statusCode,res)=>{

  const token = signToken(user._id)

/*  const cookieOptions = {
    maxAge: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly:true,
  }
  res.cookie("jwt",token,cookieOptions)
  user.password = undefined*/

  res.status(statusCode).json({
    status:"Success",
    token,
    data:{
      user,
    }
  })
}

exports.signup = catchAsync(async(req,res,next)=>{
  const newUser = await User.create(req.body)
  /*const newUser = await User.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm
  })*/

  const token = await signToken(newUser._id)

  res.status(201).json({
    status:"Success",
    token,
    data:{
      user:newUser,
    }
  })
    res.status(404).json({
      status:"Failed Signup",
    })
})


exports.login = catchAsync(async(req,res,next)=>{
  const {email,password}= req.body

  if (!email || !password){
    const err ="please provide both Email and Password"
    res.status(404).json({
      status:"fail",
      message:err
    })
   return next(err)
  }

  const user = await User.findOne({email}).select("+password")

  if (!user || !(await user.correctPassword(password,user.password))){
    return next(new AppError("incorrect email and password",401))
 }

  const token = signToken(user.id);
  res.status(200).json({
    status:"success",
    token,
  })
})

exports.protect = catchAsync(async(req,res,next)=>{
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1]
  }
  if (!token){
    return next(new AppError("You're not logged in",401))
  }

  const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
  console.log(decoded)

  const freshUser =await User.findById(decoded.id)


  if (!freshUser){
    return next(
      new AppError("This User no longer Exists",401)
    )
  }

  
  req.user= freshUser
  
  next()
})


exports.restrictTo = (...roles)=>{
  return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new AppError("You don't have Access"),403)
    }
    next()
  }
}

exports.forgetPassword = catchAsync(async(req,res,next)=>{
  const user = await User.findOne({email:req.body.email});

  if(!user){
    return next(new AppError("there's no user with this Email",404))
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({validateBeforeSave:false})

  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`

  const message = `forget your Passowrd ? ${resetUrl}`

  try{


  await sendEmail({
    email:user.email,
    subject:"your password Reset Token",
    message,
  })

  res.status(200).json({
    status:"success",
    message:""
  })
  }catch(error){
    user.passwordResetToken= undefined
    await user.save({validateBeforeSave:false})

    return next(new AppError("Try sending the Email Again",500))
  }

})
exports.resetPassword = async(req,res,next)=>{

  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

  const user = await User.findOne({
    passwordResetToken:hashedToken,
    passwordResetExpires:{$gt:Date.now()}
  })

  if (!user){
    return next(new AppError("Token has expired"),400)
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()

  const token = signToken(user.id);
  res.status(200).json({
    status:"success",
    token,
  })
}

exports.updatePassword = catchAsync(async (req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password")

  if(!(await user.correctPassword(req.body.passwordCurrent,user.password))){
    return next(new AppError("your Password is Wrong"),401)
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  createSentToken(user,200,res)
})
