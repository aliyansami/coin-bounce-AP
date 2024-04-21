import {useState,useEffect} from 'react';
//articles will be wshown using useState, useeffect: load external apis
import { getNews } from '../../api/external';
import styles from './Home.module.css';
import Loader from '../../components/Loader/Loader';

function Home(){
    const [articles,setArticles]=useState([]);
    
    //IIFE=IMMIDIATELY INVOKED FUNCTION EXPRESSION, defining a function and then immediately executing it 
    useEffect(()=>{
        (async function newsApiCall(){
            const response =await getNews();
            setArticles(response);
        })();

        //clean up function

        setArticles([]);

    },[]);

    const handleCardClick=(url)=>{
        //to open ina new tab
        window.open(url,'_blank');
    }

    if(articles.length===0)
    {
        return <Loader text="homepage"/>
    }

    return(
     <>
        <div className={styles.Header}>Latest News</div>
        <div className={styles.grid}>
            {articles.map((article)=>(
                <div className={styles.Card} 
                key={article.url}
                onClick={()=> handleCardClick(article.url)}>
                    <img src={article.urlToImage}/>
                    <h3>{article.title}</h3>

                </div>
            ))}
        </div>
     </>    
    )
}

export default Home;