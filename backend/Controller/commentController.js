const Joi=require('joi');
const Comment=require('../models/comments');
const CommentDTO=require('../dto/comment');
const mongodbIdPattern=/^[0-9a-fA-F]{24}$/; 


const commentController={

    async create(req,res,next){
        const createCommentSchema=Joi.object({
            content:Joi.string().required(),
            author:Joi.string().regex(mongodbIdPattern).required(),
            blog:Joi.string().regex(mongodbIdPattern).required(),
        });
        console.log("backend:");
        //validate

        const {error}=createCommentSchema.validate(req.body);

        if(error){
            return next(error);
        }

        //destructre
        const {content,author,blog}=req.body;
        console.log(content);
        
        try {
            const newComment=new Comment({
                content,author,blog
            });
           
            await newComment.save();

        } catch (error) {
            return next(error);
        }

        return res.status(201).json({message:'comment creataed!'}); 
    },
    async getById(req,res,next){
        const getByIdSchema=Joi.object({
            id:Joi.string().regex(mongodbIdPattern).required()
        });

        //validate
        const {error}=getByIdSchema.validate(req.params);

        const {id}=req.params;

        let comments;
        try {
            comments=await Comment.find({blog:id}).populate('author');

        } catch (error) {
            return next(error); 
        }

        let commentsdto=[];

        for(let i=0; i<comments.length; i++)
        {
            const obj=new CommentDTO(comments[i]);
            commentsdto.push(obj);
        }
        
        return res.status(200).json({data:commentsdto});
    },
    

}

module.exports=commentController;