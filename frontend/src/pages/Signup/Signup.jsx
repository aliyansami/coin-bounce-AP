import { useState } from 'react';
import styles from './Signup.module.css';
import TextInput from '../../components/TextInput/TextInput';
import signupSchema from '../../Schemas/signupSchema';
import  { useFormik}  from 'formik';
import { setUser } from '../../store/userSlice';
import { useDispatch } from 'react-redux';//to write the state
import { useNavigate } from 'react-router-dom';//to navigate
import { signup } from '../../api/internal';//since it's a named expotrt so it will be in brackets

function Signup(){
    const navigate=useNavigate();

    const dispatch=useDispatch();
    
    const [error,setError]=useState('');

    const handleSignup=async()=>{
        const data={
            name:values.name,
            username:values.username,
            password:values.password,
            confirmPassword:values.confirmPassword,
            email:values.email
        }
        const response=await signup(data);

        if(response.status===201){
            //1.set user
            console.log("Hello");
            const user={
                _id:response.data.user._id,
                email:response.data.user.email,
                username:response.data.user.username,
                auth:response.data.auth
            }
            dispatch(setUser(user));
            console.log("Hello");
            //2.redirect user to home page
            navigate('/')   
            console.log("Hello");
        }
        else if(response.code==='ERR_BAD_REQUEST'){
            //display error
            //we will use a state to show the error msg
            setError(response.response.data.message);
        }
    }

    const {values, touched, handleBlur,handleChange,errors}=useFormik({
        initialValues:{
            name:"",
            username:"",
            email:"",
            password:"",
            confirmPassword:""
        },
        validationSchema: signupSchema
    });

    return(
        <div className={styles.signupWarpper}>
            <div className={styles.signupHeader}>Create an account</div>
            <TextInput
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={errors.name && touched.name ? 1:undefined}
            errormessage={errors.name}  
            placeholder="name"
            />
            <TextInput
            type="text"
            value={values.username}
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="username"
            error={errors.username && touched.username ? 1: undefined}//user interacted with the input firld and the input is invalid
            errormessage={errors.username}
            />
            <TextInput
            type="text"
            value={values.email}
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="email"
            error={errors.email && touched.email ? 1: undefined}//user interacted with the input firld and the input is invalid
            errormessage={errors.email}
            
            />
            <TextInput
              type="password"                 
              name="password"
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="password"
              error={errors.password && touched.password ? 1: undefined}//user interacted with the input firld and the input is invalid
              errormessage={errors.password}        
     
            />
            <TextInput
               type="password"                 
               name="confirmPassword"
               value={values.confirmPassword}
               onBlur={handleBlur}
               onChange={handleChange}
               placeholder="confirm password"
               error={errors.confirmPassword && touched.confirmPassword ? 1: undefined}//user interacted with the input firld and the input is invalid
               errormessage={errors.confirmPassword}        
      
            />
        
             <div className={styles.signup}>
    <button className={styles.signupbutton} onClick={handleSignup}
    disabled={!values.username  || !values.password || errors.username|| errors.password||Object.keys(errors).length > 0}
    >
      Sign Up
    </button>
    <span>
      Already have an Account?{" "}
      <button className={styles.login} onClick={() => navigate("/login")}>
        Log In
      </button>
    </span>
  </div>
            {error !== "" ? <p className={styles.errorMessage}>{error}</p>:""}
        </div>

    )
}

export default Signup;