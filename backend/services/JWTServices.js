const jwt=require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET}=require('../config/index');
const {refreshToken}=require('../models/token');


class JWTServices{
    //better to keep secret keys of both accessand refresh token, different

    //sign acces token
    static signAccesToken(payload,expiryTime){
        return jwt.sign(payload,ACCESS_TOKEN_SECRET,{expiresIn:expiryTime});
    }
    //sign refresh token
    static signRefreshToken(payload,expiryTime){
        return jwt.sign(payload,REFRESH_TOKEN_SECRET,{expiresIn:expiryTime});
    }
    
    //verfify acces token
    static verifyAccessToken(token){
        return jwt.verify(token,ACCESS_TOKEN_SECRET);
    }
    //verify refresh token
    static verifyRefreshToken(token){
        return jwt.verify(token,REFRESH_TOKEN_SECRET);
    }
    //store refresh token
    static async storeRefreshToken(token, userId){
        try {
            const newToken=new refreshToken({
                token:token,
                id:userId
            });
            //store in database
            await newToken.save();
               
        } catch (error) {
            console.log(error);           
        }
    }
}

module.exports=JWTServices;