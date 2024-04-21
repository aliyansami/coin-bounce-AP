import styles from "./CommentList.module.css";
import Comment from "../Comment/Comment";

function CommentList({ comments }) {
           console.log("Tipchu12");
     
    return (
        <div className={styles.commentListWrapper}>
            
            <div className={styles.commentList}>
            {/* If there are no comments on the blog */}
            {comments.length === 0 ?
                (<div className={styles.noComments}>No comments posted</div>)
                :
                comments.map(comment => (
                    <Comment key={comment._id} comment={comment} />
                ))
            }
            </div>
            {/* {comments.map(comment => (
                    <Comment key={comment._id} comment={comment} />
                ))} */}
        </div>
    );
}

export default CommentList;
