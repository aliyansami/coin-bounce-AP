/* Navlink helps in styling*/
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { resetUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { signout } from "../../api/internal";

function Navbar() {
    const isAuthenticated=useSelector((state)=>state.user.auth); 
    const dispatch=useDispatch();
    const handleSignout=async()=>{
      await signout();
      //reset user's global state
      dispatch(resetUser());
    };
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink
          to="/" /*path of the link(index)*/
          className={`${styles.logo} ${styles.inActiveStyle}`}
          activeclassname={styles.activeStyle}
        >
          CoinBounce
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Home
        </NavLink>

        <NavLink
          to="crypto"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Cryptocurrencies
        </NavLink>

        <NavLink
          to="blogs"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Blog
        </NavLink>

        <NavLink
          to="submit"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Submit a blog
        </NavLink>

        { isAuthenticated ? <div><NavLink><button className={styles.signOutButton} onClick={handleSignout}>Sign Out</button></NavLink></div>
        :<div><NavLink
          to="login"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          <button className={styles.logInButton}>Log In</button>
        </NavLink>

        <NavLink
          to="signup"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          <button className={styles.signUpButton}>Sign Up</button>
        </NavLink>
        </div>}
      </nav>
      <div className={styles.seperator}></div>
    </>
  );
}

export default Navbar;
