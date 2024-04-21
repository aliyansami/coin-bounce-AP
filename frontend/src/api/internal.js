//this file contains the code related to the express(backend related api calls)
import axios from 'axios';

const api=axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials:true,//for cookies
    headers:{
        "Content-Type":"application/json",
    }
});

//we will use this login method in our login page

export const login=async (data)=>{
    let response;
    console.log("Helloo");
    try {
        console.log("Helloo");
        response =await api.post('/login',data);
        console.log("Helloo");
    } catch (error) {
        return error;
    }

  return response;
 
};

export const signup=async (data)=>{
    let response;
    console.log("Helloo");
    try {
        console.log("Helloo");
        response =await api.post("/register",data);
        console.log("Helloo");
    } catch (error) {
        return error;
    }

  return response;
 
};

export const signout=async(data)=>{
    let response;
    console.log("Helloo");
    try {
        console.log("Helloo");
        response=await api.post("/register",data);
        console.log("Helloo");
    } catch (error) {
        return error;
    }

    return response;
}

export const getAllBlogs= async()=>{
let response;
try {
    response=await api.get("/blog/All");
} catch (error) {
    
}             

return response;
}

export const submitBlog=async (data)=>{
    let response;

    try {
        response=await api.post('/blog',data);
    } catch (error) {
        return error;
    }

    return response;
}


export const getBlogByID=async(id)=>{
    let response;
    try {
       
        response=await api.get(`/blog/${id}`); 
        console.log("akjsnnsd");
    } catch (error) {
        return error;
    }
    return response;
}

export const getCommentByID=async(id)=>{
    let response;
    try {
        console.log("shittte");
        response=await api.get(`/comment/${id}`,{
            validateStatus:false //incase we do not get any comment, we can handle it properly
        })
        console.log("shittte22");
    } catch (error) {
        return error
    }

    return response;
}

export const postComment=async(data)=>{
    let response;
    console.log("mar jaa");
    console.log(data);
    try {
        
        
        response=await api.post('/comment',data);
        console.log("mar jaa");
        console.log('Comment Response:', response);
    } catch (error) {
        return error;   
    }
    return response;
}

export const deleteBlog=async(id)=>{
    let response;
    console.log(id);
    try {
        response=await api.delete(`/blog/${id}`);
    } catch (error) {
        return error;
    }

    return response;
}

export const updateBlog = async (data) => {
    console.log(data);
    try {
        const response = await api.put('/blog', data);
           
        

        console.log('API Response:', response.status);

        if (response.status === 200) {
            return response;
        } else {
            throw new Error('Update failed with status: ' + response.status);
        }
    } catch (error) {
        console.error("Error updating blog:", error);
        throw error;
    }
};

