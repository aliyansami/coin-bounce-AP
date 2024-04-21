    const JWTServices=require('../services/JWTServices');
    const User=require('../models/users');
    const UserDTO=require('../dto/user');

    const auth=async(req,res,next)=>{

    try {
        
    //1. valiate access and refresh token
    const {refreshToken,accessToken}=req.cookies;
    if(!refreshToken || !accessToken)
    {
        const error={
            status:401,
            message:'Unautharized'
        }
        return next(error);
    }

    //verify access tokens

    let _id1;

    try {
        _id1=JWTServices.verifyAccessToken(accessToken)._id;    
    } catch (error) {
        return next(error);
    }

    let user;

    try {
        user=await User.findOne({_id:_id1 });  
    } catch (error) {
        return next(error);
    }

    const userdto=new UserDTO(user);

    req.user=userdto;

    next();
        
    } catch (error) {
        return next(error);
    }

    }

    module.exports=auth;