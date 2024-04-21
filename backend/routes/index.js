const express=require('express');
const router=express.Router();
const authController=require('../Controller/authController');
const auth=require('../middlewares/auth');
const blogController=require('../Controller/blogController');
const commentController=require('../Controller/commentController');     

//testing
router.get('/test',(req,res)=>res.json({msg:'Working!'}));


//USER

//register
router.post('/register',authController.register);

//login
//it will be a post request since data will be sent from user (username, password)
router.post('/login',authController.login);


//logout
router.post('/logout',auth,authController.logout);

//refresh
router.get('/refresh',authController.refresh);

//blog

//create
router.post('/blog',auth,blogController.create);

//getall
router.get('/blog/all',auth,blogController.getAll);

// //get blog by id
router.get('/blog/:id',auth,blogController.getById);

// //updtae
router.put('/blog',auth,blogController.update);

// //delete
router.delete('/blog/:id',auth,blogController.delete);


//comment

//create
router.post('/comment',auth,commentController.create);

//get
router.get('/comment/:id',auth,commentController.getById);

module.exports=router; 