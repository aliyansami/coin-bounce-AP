class BlogsDetailsDto{
    constructor(blog){
        this.id=blog.id;
        this.title=blog.title;
        this.content=blog.content;
        this.author=blog.author;
       // this.photo=blog.photo;
        this.photoPath = blog.photoPath;
        this.createdAt=blog.createdAt;
        //this.authorName=blog.author.name;
        this.authorusername=blog.authorusername;
        //this.author.username=blog.authorUsername;
        //  const { author: { username } } = blog;
        //  this.authorUsername = username;
    }
}
module.exports=BlogsDetailsDto;