import { useState } from "react";
import styles from "./Login.module.css";
import TextInput from "../../components/TextInput/TextInput";
import loginSchema from "../../Schemas/LoginSchema";
import { useFormik } from "formik";
import { login } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux"; //to write the state
import { useNavigate } from "react-router-dom"; //to navigate

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const handlelogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };
    console.log("Hello");
    console.log("Hello5");

    const response = await login(data);

    console.log(response.data);
    if (response.status === 200) {
      //1.set user
      console.log("Hellobyebye");
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        auth: response.data.auth,
      };
      dispatch(setUser(user));
      console.log("Hello");
      //2.redirect user to home page
      navigate("/");
      console.log("Hello");
    } else if (response.code === "ERR_BAD_REQUEST") {
      //display error
      //we will use a state to show the error msg
      // const errorMessage = response?.data?.errormessage;
      // if (errorMessage) {
      //   setError(errorMessage);
      // } else {
      //   console.log('Response:', response);
      //   setError('Unknown error occurred.');
      // }
      console.log("Error State:", error);
      setError(response.response.data.message);
    }
    // else if(response.status===401){

    //     setError(response.response.data.errormessage);
    // }
  };

  //values:field valus, touched:user interacted with that field,will show error message using it
  //handleBlur: formik will use to handle an event of touched, Handle change: formik will change the values using it
  //error:validation errors
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginHeader}>Log in to your Account</div>

      <TextInput
        type="text"
        value={values.username}
        name="username"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="username"
        error={errors.username && touched.username ? 1 : undefined} //user interacted with the input firld and the input is invalid
        errormessage={errors.username}
      />

      <TextInput
        type="password"
        name="password"
        value={values.password}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="password"
        error={errors.password && touched.password ? 1 : undefined} //user interacted with the input firld and the input is invalid
        errormessage={errors.password}
      />

      <button className={styles.logInButton} onClick={handlelogin}
        disabled={!values.username  || !values.password || errors.username|| errors.password||Object.keys(errors).length > 0}
      >
        Log In
      </button>

      <span>
        Dont have an Account?{" "}
        <button
          className={styles.createAccount}
          onClick={() => navigate("/signup")}
        >
          Register
        </button>
      </span>

      {error !== "" ? <p className={styles.errormessage}>{error}</p> : ""}
    </div>
  );
}

export default Login;
