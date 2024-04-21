import styles from "./Error.module.css"
import { Link } from "react-router-dom";

function Error(){
return (
    <div className={styles.errorWrapper}>ERROR
    
    <div className={styles.errorHeader}>Error 404 - Page not Found</div>
    <div className={styles.errorBody}>
        Got Back To <Link to="/" className={styles.errorHomeLink}>Home</Link>
    </div>

    </div>
    
)
}

export default Error;