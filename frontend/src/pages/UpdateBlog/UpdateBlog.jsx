import {useState,useEffect} from 'react';
import { getBlogByID,updateBlog } from '../../api/internal';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styles from './UpdateBlog.module.css';
import TextInput from '../../components/TextInput/TextInput';
import { useSelector } from 'react-redux';


function UpdateBlog(){

    const navigate=useNavigate();
    const params=useParams();
    const blogid=params.id;
    

    //we will use  useEffect to get the latest values of the blog to update them
    const[title,setTitle]=useState('');
    const [content,setContent]=useState('');
    const [photoPath,setPhoto]=useState('');
    
    const getPhoto=(e)=>{//e=event
        const file=e.target.files[0];
        const reader=new FileReader();
        reader.readAsDataURL(file);
        reader.onload=()=>{
            setPhoto(reader.result); //base 64 img
        }
    }
    
    const author=useSelector(state=>state.user._id);
    
    const updateHandler = async () => {
        let data;
        if (photoPath && photoPath.includes('http')) { // Check if photo is defined before using includes
            //data = { author, title, content, blogid };
            data={title,content,author,blogid};
            
        } else {
            
            data={title,content,author,blogid,photoPath};
            
            //data = { author, title, content, photoPath, blogid };
        }
        console.log("uff:",content);
        try {
            const response = await updateBlog(data);
            console.log(data);
            console.log(response.data);
            if (response.status === 200) {
                navigate("/");
            } else {
                // Handle other status codes or errors if needed
                console.log(data);
                console.error("Error updating blog:", response);
            }
        } catch (error) {
            // Handle any network or other errors
            console.error("Error updating blog:", error);
        }
    };
    
    useEffect(()=>{
        async function getBlogDetails() {
            
            const blogResponse = await getBlogByID(blogid);
            console.log("yello:",blogid);
            if (blogResponse && blogResponse.status === 200) {
                // setBlog(blogResponse.data.blog);

                // // Perform ownership check and set ownsblog immediately
                // setOwnsblog(username === blogResponse.data.blog.authorusername);
                const blogData = blogResponse.data.blog;
            console.log("Original Title:", blogData.title);
            console.log("Original Content:", blogData.content);
            console.log("Original Photo:", blogData.photoPath);

            setTitle(blogData.title);
            setContent(blogData.content);
            setPhoto(blogData.photoPath);

            // console.log("Updated Title:", blogData.title);
            // console.log("Updated Content:", blogData.content);
            // console.log("Updated Photo:", blogData.photoPath);
            
            } else {
                console.error("Error fetching blog:", blogResponse);
            }
        }
        getBlogDetails();
    },[])
    
    useEffect(() => {
    console.log("Updated Title:", title);
    console.log("Updated Content:", content);
    console.log("Updated Photo:", photoPath);
    }, [title, content, photoPath]);
    return (
    <div className={styles.wrapper}>
    <div className={styles.header}>Edit your Blog</div>
    <TextInput
    type="text"
    name="title"
    placeholder="title"
    value={title}
    onChange={(e)=> setTitle(e.target.value)}
    style={{width:'60%'}}
    />

    <textarea
    className={styles.content}
    placeholder="your content goes here...."
    maxLength={400}
    value={content}
    onChange={(e)=>setContent(e.target.value)}
    />

    <div className={styles.photoPrompt}>
        <p>Choose a photo </p>
        <input 
        type="file"
        name="photo"
        id="photo"
        accept='image/jpg, image/jpeg,image/png'
        onChange={getPhoto}
        />
    </div>

    <button className={styles.update} onClick={updateHandler}
   // disabled={title===''||photoPath===''||content===''}
    >Update</button>
</div>
);
}

export default UpdateBlog;