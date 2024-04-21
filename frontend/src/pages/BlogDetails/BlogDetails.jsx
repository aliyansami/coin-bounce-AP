    import { useState,useEffect } from "react";
    import { useSelector } from "react-redux";
    import { useParams } from "react-router-dom";
    import { getBlogByID,getCommentByID,postComment,deleteBlog } from "../../api/internal";
    import { useNavigation } from "react-router-dom";
    import Loader from "../../components/Loader/Loader";
    import styles from './BlogDetails.module.css'; 
    import CommentList from "../../components/CommentList/CommentList";
    import { useNavigate } from "react-router-dom";

    function BlogDetails(){
        
        
        const [blog,setBlog]=useState([]);//state initiallization
        const [comments,setComments]=useState([]);
        const[ownsblog,setOwnsblog]=useState(false);//chk who is the owner of the blog
        const [newComment,setNewComment]=useState("");
        const [reload,setReload]=useState(false);
        console.log("bye");
       
        const navigate=useNavigate();
        console.log("bye12");
        const params = useParams(); // Access parameters from the URL
        const blogid = params.id;  
        console.log(blogid);
        console.log("bye123");
        //get the username and id of user from global state
        const username=useSelector(state=>state.user.username);
        const userId=useSelector(state=>state.user._id);
       //either make an IFFE or make a normal gunc and call it
        console.log(username);
        console.log("!");
        console.log(blog.authorusername);
       
        useEffect(() => {
            async function getBlogDetails() {
                const commentResponse = await getCommentByID(blogid);
                if (commentResponse && commentResponse.status === 200) {
                    setComments(commentResponse.data.data);
                } else {
                    console.error("Error fetching comments:", commentResponse);
                }
    
                const blogResponse = await getBlogByID(blogid);
                if (blogResponse && blogResponse.status === 200) {
                    setBlog(blogResponse.data.blog);
    
                    // Perform ownership check and set ownsblog immediately
                    setOwnsblog(username === blogResponse.data.blog.authorusername);
                } else {
                    console.error("Error fetching blog:", blogResponse);
                }
            }
            getBlogDetails();
        }, [reload]);//empty dependency list means the page will render once we have mounted, if we passa state then whenever the state reloads then our page will be automatuically rendered
        
        useEffect(() => {
            console.log("Ownsblog updated:", ownsblog);
        }, [ownsblog]);
        
        const postCommentHandler=async()=>{
            const data={
                author:userId,
                blog:blogid,
                content:newComment
            }
           console.log("onceAgain");
           console.log(data.blog);
           console.log(data.author);
           //console.log(newComment);
           const response=await postComment(data);
           console.log(response);
            if(response.status===201){
                setNewComment("");
                setReload(!reload); //update the reload once it's done
            }
        }
        
        const deleteBlogHandler=async()=>{
            console.log("delete");
            const response= await deleteBlog(blogid);
            
            if(response.status===200)
            {
                navigate("/");
                
            }
        
        };
        console.log(blog.authorusername);

        if(blog.length===0){
            return <Loader text="Blog Details"/>
        }
        console.log("Comments:", comments); // Add this line
        return (
        <div className={styles.detailsWrapper}>
            
            <div className={styles.left}>
                <h1 className={styles.title}>{blog.title}</h1>
                <div className={styles.meta}>
                    <p>@{blog.authorusername + " on " + new Date(blog.createdAt).toDateString()}</p>
                </div>
                    <div className={styles.photo}>
                        <img src={blog.photoPath} width={250} height={250}/>
                    </div>
                    <p className={styles.conetnt}>{blog.content}</p>
                    {
                        ownsblog && (
                            <div className={styles.controls}>
                                <button className={styles.editButton} onClick={()=>{
                                    navigate(`/blog/update/${blogid}`)
                                    
                                }}>
                                Edit
                                </button>

                                <button className={styles.deleteButton} onClick={deleteBlogHandler}>
                                    Delete
                                </button>
                            </div>
                        )    
                    }
                </div>
            <div className={styles.right}>
                <div className={styles.commentsWrapper}>
                    <CommentList comments={comments}/>
                    <div className={styles.postComment}>
                        <input
                        className={styles.input}
                        placeholder='comment goes here...'
                        value={newComment}
                        onChange={(e)=> setNewComment(e.target.value)}
                        />
                        <button className={styles.postCommentButton} onClick={postCommentHandler}>Post</button>
                    </div>
                </div>
            </div>

        </div>         
        )
    }

    export default BlogDetails;