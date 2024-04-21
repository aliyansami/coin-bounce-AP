const mongoose = require('mongoose');

const {Schema}=mongoose;

const BlogSchema=new Schema({
    title:{type:String, required:true},
    content:{type: String, required:true},
    photoPath:{type:String, required:true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    
},
{timestamps: true}
);

module.exports=mongoose.model('Blogs',BlogSchema,'blogs'); 