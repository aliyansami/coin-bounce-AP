import  {Navigate} from "react-router-dom";

/*isAuth=true => user logged in  */
function Protected({isAuth,children}){
    if(isAuth){
        return children;
    }

    else{
        /*navigate to login page*/
        return <Navigate to='/login'/>
    }
}

export default Protected;
