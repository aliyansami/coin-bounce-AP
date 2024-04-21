const Joi=require('joi');
const fs=require('fs');
const blog=require('../models/blogs');
const {BACKEND_SERVER_PATH}=require('../config/index');
const BlogDTO = require('../dto/blog');
const User=require('../models/users');
const { Console } = require('console');
const BlogsDetailsDto=require('../dto/blogsdetails');
const mongodbIdPattern=/^[0-9a-fA-F]{24}$/; 
const Comment=require('../models/comments');

const blogController={
async create(req,res,next){
    //1.validate req body
    //2.handle photo storage, naming
    //3.add to db
    //4.return response

    //client side -> base64 encoded string-> decode-> store-> save photo's path in db

    const createBlogSchema=Joi.object({
        title:Joi.string().required(),
        author:Joi.string().regex(mongodbIdPattern).required(),
        content:Joi.string().required(),
        photo:Joi.string().required()   
    });

    const {error}=createBlogSchema.validate(req.body);

    if(error){
        return next(error);
    }

    const {title,author,content,photo}=req.body;

    //read as buffer

    // Verify if the photo is a valid base64-encoded string
    if (!/^data:image\/(png|jpg|jpeg);base64,/.test(photo)) {
    return next(new Error('Invalid base64-encoded image string.'));
    }
  
    // Convert the base64-encoded image string to a buffer
    const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''), 'base64');
  

    //allocate name
    const imagePath=`${Date.now()}-${author}.png`;

    //save locally
    try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
        return next(error);
    }

    //save in db
    let newBlog;
    try {
        newBlog=new blog(
            {
                title,
                author,
                content,
                photoPath:`${BACKEND_SERVER_PATH}/storage/${imagePath}`
            
            }
        );

        await newBlog.save();

    } catch (error) {
        return next(error);
    }

    const blogdto = new BlogDTO(newBlog);

    return res.status(201).json({blog:blogdto});
},
async getAll(req,res,next){

    try {
     
    const blogs=await blog.find({}); 

    const blogsDto=[];

    for (let i=0; i<blogs.length; i++)
    {
        const dto=new BlogDTO(blogs[i]);
        dto.photoPath = blogs[i].photoPath; // Include the photoPath field from the original blog object
        blogsDto.push(dto);
    }

    return res.status(200).json({blogs:blogsDto});
   
    } catch (error) {
        return next(error);        
    }
},
async getById(req,res,next){
    
    //1.validate ids
    //2.send response

    const getByIdSchema=Joi.object({
        id:Joi.string().regex(mongodbIdPattern).required()
    });


    //the data is being sent into the parameters of the request, not the body of req
    const {error}=getByIdSchema.validate(req.params);
    
    if(error){
        return next(error);
    }

    let blog1;

    const {id}=req.params;

    try {
        blog1=await blog.findOne({_id:id}).populate('author');  
        
        // if (!blog1.author) {
        //     return res.status(404).json({ message: 'Author not found' });
        //   }
        if (!blog1) {
            return res.status(404).json({ message: 'Blog not found' });
          }
          
    } catch (error) {
        return next(error);
    }

    const authorUsername = blog1.author.username;

    const blogDto=new BlogsDetailsDto(blog1);
    blogDto.photoPath=blog1.photoPath;
    blogDto.authorusername=blog1.author.username;
    return res.status(200).json({blog:blogDto});


},
async update(req,res,next){

    //validate
    const updateBlogSchema=Joi.object({
        title:Joi.string().required(),
        content:Joi.string().required(),
        author:Joi.string().regex(mongodbIdPattern).required(),
        blogId:Joi.string().regex(mongodbIdPattern).required(),
        photo:Joi.string()
    })

    const {error}=updateBlogSchema.validate(req.body);

    //detructre from req body

    const {title,content,author,blogid,photoPath}= req.body;
    console.log("new values: ",blogid);
    console.log(content);
    //delete previous photo
    //save new photo

    // let blog2;
    
    // blog2=await blog.findOne({_id:blogId});
    // try {
    //     //get blog
    //     blog2=await blog.findOne({_id:blogId});
    //     if (!blog2) {
    //         // Handle the case where the blog post with the given blogId was not found
    //         // For example, you could return an error message to the user
    //         return res.status(404).json({message: 'Blog post not found'});
    //     }
    // } catch (error) {
    //     return next(error);
    // }

    let blogfind;

    try {
        blogfind=await blog.findOne({_id:blogid});
    } catch (error) {
        return next(error);
    }

    if(photoPath){
        let previousPhoto=blogfind.photoPath;
        previousPhoto=previousPhoto.split('/').pop(-1);//image.png

        //delete photo
        fs.unlinkSync(`storage/${previousPhoto}`);

        // Convert the base64-encoded image string to a buffer
        const buffer = Buffer.from(photoPath.replace(/^data:image\/(png|jpg|jpeg);base64,/,''), 'base64');
  

        //allocate name
        const imagePath=`${Date.now()}-${author}.png`;

        //save locally
        try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
        } catch (error) {
        return next(error);
        }
        await blog.findOneAndUpdate(
            { _id: blogid },
            { $set: { title, content, photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}` } },
            { new: true }
          );

    }
    else{
        await blog.findOneAndUpdate(
            { _id: blogid },
            { $set: { title, content } },
            { new: true }
        );
      
        try {
            const updatedBlog = await blog.findOneAndUpdate(
                { _id: blogid },
                { $set: { title, content, photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}` } },
                { new: true }
            );
            console.log(updatedBlog);
            if (!updatedBlog) {
                return res.status(404).json({ message: 'Blog post not found' });
            }
        
            return res.status(200).json({ message: 'blog updated!' });
        } catch (error) {
            console.error('Error updating blog:', error);
            return next(error);
        }
        
        // b1=await blog.find({_id:blogId});
        
        // let c=b1.title;
        // console.log(c);

    }
    
    return res.status(200).json({message:'blog updated!'});
},
async delete(req,res,next){

    
    const deleteBlogSchema=Joi.object({
        id:Joi.string().regex(mongodbIdPattern).required()
    });

    //validate id
    const {error}=deleteBlogSchema.validate(req.params);

    const {id}=req.params;

    //delete blog
    //delete comments

    try {
        await blog.deleteOne({_id:id});
        await Comment.deleteOne({blog:id});
    } catch (error) {
        return next(error);
    }
    return res.status(200).json({message:'blog deleted'});
}
}

module.exports=blogController;