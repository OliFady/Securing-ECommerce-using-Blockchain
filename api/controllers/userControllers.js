const User = require("./../models/userModel");
const AppError = require("./../Utils/appError")
const filterObj = (obj,...allowedFields)=>{
  const newObj = {}
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el))
      newObj[el] = obj[el]
  })
  return newObj
}

const catchAsync = (fun) =>{
  return(req,res,next)=>{
  fun(req,res,next).catch(next)
}
}

exports.updateData = catchAsync(async(req,res,next)=>{

  if (req.body.password || req.body.passwordConfirm){
    return next(new AppError("Route is not Correct",400))
  }

  const filterBody = filterObj(req.body,"name","email")
  const user = await User.findByIdAndUpdate(req.user.id,filterBody,{
    new:true,
    runVaidatiors:true
  })

  res.status(200).json({
    status:"Success",
    data:{
      user:user
      
    }

  })
})

exports.deleteData = catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id,{active:false})

  res.status(204).json({
    status:"success",
    data:null
  })

})


exports.getAllUsers = catchAsync(async(req, res) => {
        const users = await User.find();

        res.status(200).json({
            status: "success",
            results: users.length,
            data: {
                users,
            },
        }); 
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};

exports.getSingleUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};
