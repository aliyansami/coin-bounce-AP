//When we will get a request then our controller will execute the logic
//used in index.js in routes folder 

const Joi=require('joi');
const User=require('../models/users');
const Bcrypt=require('bcryptjs');
const UserDTO=require('../dto/user');
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const JWTServices=require('../services/JWTServices');
const RefreshToken=require('../models/token');

//obj authcontroller
const authController={
    async register(req,res,next)
    {
        // 1. validate input
        
        const userRegistrationSchema=Joi.object({
            username:Joi.string().min(5).max(30).required(),
            name:Joi.string().max(20).required(),
            email:Joi.string().email().required(),
            password:Joi.string().pattern(passwordPattern).required(),
            confirmPassword:Joi.ref('password')
        });
    
        const {error}=userRegistrationSchema.validate(req.body);

        // 2. if error=>return error via middleware
        //if we do not handle error then our node structre will collapse and then we will have to restart
        if (error){
            return next(error);
            //next will call the next middleware
        } 
        
        // 3. if username or email is already registered then return error
        const {username,name,email,password}=req.body;
        
        //now we are communcating with database, so we will be using try catch
        
        try {
            const emailInUse=await User.exists({email});//User.ecist is a func of mongoose

           
            const usernameInUse = await User.exists({ name });

            if(emailInUse)
            {
                const error ={
                    status:409,
                    message:'Email already in use, use another email!'
                }

                return next(error);
            }

            if(usernameInUse)
            {
                const error ={
                    status:409,
                    message:'Username is not available, use another username'
                }

                return next(error);
            }
            
        } catch (error) {
            return next(error);
        }
        // 4. if no error then password hash
        const hashedPassword=await Bcrypt.hash(password,10);
       
        // 5. Store data in database

        let accessToken;
        let refreshToken;
        let user;

        try {
            const userToRegister=new User({
                username,
                email,
                name,
                password: hashedPassword
            });
    
            user=await userToRegister.save();
        
            //token generation
            accessToken=JWTServices.signAccesToken({_id:user._id},'30m');
            refreshToken=JWTServices.signRefreshToken({_id:user._id},'60m');

        } catch (error) {
            return next(error);
        }

        //store refresh token in database
        await JWTServices.storeRefreshToken(refreshToken,user._id);

        //send tokens in cookies
        res.cookie('accessToken', accessToken,
        {maxAge:1000*60*60*24, httpOnly:true}
        //the browser(javascript on client side) wont be able to access
        //when the refresh token will arrive from client side to back end, only then we will be able to access it
        //reducess vulnability of XXS attacks
        );        

        res.cookie('refreshToken',refreshToken,
        {maxAge:1000*60*60*24, httpOnly:true});
         
        const userDto=new UserDTO(user);

        // 6. Send response
        //auth:true will be used in front end....
        return res.status(201).json({user:userDto,auth:true});

    },
    async login(req,res,next){
        //1.validate user
        //2.if validation error, returm error
        //3.match username and password
        //4.return response

        const userLoginSchema=Joi.object({
            username:Joi.string().min(5).max(30).required(),
            password:Joi.string().pattern(passwordPattern).required()
        });

        const {error}= userLoginSchema.validate(req.body);

        if(error){
            return next(error);
        }

        //match the username and password
        const {username,password}=req.body;

        //const username=req.body.username;
         
        let user;
    

        try {
            //match username

            user=await User.findOne({username:username});
            
            if(!user){

                const error={
                    status:401,
                    message:'Invalid username'
                }
                return next(error);
            }
                
            //match password
            //req.body.password->hash->match

            const match=await Bcrypt.compare(password,user.password);

            if(!match)
            {
                
                const error={
                    status:401,
                    message:'Invalid password'
                }
                return next(error);
            }

        } catch (error) {
            return next(error);
        }

        const accesstoken=JWTServices.signAccesToken({_id:user._id},'30m');
        const refreshToken=JWTServices.signRefreshToken({_id:user._id},'60m');

        //update refresh token in database

        try {
            await RefreshToken.updateOne({_id:user._id},
                {token:refreshToken},
                {upsert:true}
            )         
        } catch (error) {
            return next(error);
        }
   
        
        res.cookie('accessToken',accesstoken,{
            maxAge:1000*60*60*24,
            httpOnly:true
        });
        
        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
        });
    
        //DTOs are used to filter the information that is to be returened by the databse(right now thru insomnia)
        const userDto=new UserDTO(user);
        //returning the response at insmnia, when we add the pass and username
        //the database will return the properties of the user


        return res.status(200).json({ user:userDto,auth:true });  
    },

    async logout(req,res,next)
    {
        //1.delete refresh token
        const  {refreshToken}  = req.cookies.refreshToken;

        if (!refreshToken) {
            const error = {
              status: 401,
              message: 'Unauthorized',
            };
            return next(error);
        }

        try {
            await RefreshToken.deleteOne({ token: refreshToken });
        } catch (error) {
            return next(error);
        }

        //delete cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        //2.send response to user
        res.status(200).json({user:null,auth:false});
    },

    async refresh(req,res,next)
    {
        
        //3.generate new tokens
        //4.update db, return response
    
        //1.get refreshtoeksn from cookies
        //2.verify refreshtokens
        const orignalRefreshToken=req.cookies.refreshToken;
        
        let id;

        try {
            id=JWTServices.verifyRefreshToken(orignalRefreshToken)._id;
        } catch (error) {
            error={
                status:401,
                message:'Unautharized'
            }
            return next(error);
        }

        try {
            const match=RefreshToken.findOne({_id:id,token:orignalRefreshToken});
            if(!match)
            {
                const error={
                    status:401,
                    message:'Unautharized'
                }
            return next(error);
            }
        } catch (error) {
            return next(error);
        }

        try {
            const accessToken=JWTServices.signAccesToken({_id:id},'30m');
            const refreshToken=JWTServices.signRefreshToken({_id:id},'60m');

            await RefreshToken.updateOne({_id:id},{token:refreshToken});    

            res.cookie('accessToken',accessToken,{
                maxAge:1000*60*60*24,
                httpOnly:true
            });

            
            res.cookie('refreshToken',refreshToken,{
                maxAge:1000*60*60*24,
                httpOnly:true
            });
        } catch (error) {
            return next(error);
        }

        //get details of the user
        const user=await User.findOne({_id:id});
        const userdto=new UserDTO(user);

        return res.status(200).json({user:userdto,auth:true});
    }
}

module.exports=authController;