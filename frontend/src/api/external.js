import axios from 'axios'
const NEWS_API_KEY='f1e04698a14e48c68190793f40d97183';
console.log(NEWS_API_KEY);
console.log('Hello');

const NEWS_API_ENDPOINT = `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${NEWS_API_KEY}`;
const CRYPTO_API_END_POINT='https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en';
export const getNews=async()=>{
    let response;
    try {
        response=await axios.get(NEWS_API_ENDPOINT);
        response=response.data.articles.slice(0,15);
    } catch (error) {
        console.log(error);
    }

    return response;
}

export const getCrypto=async()=>{
    let response;
try {
    response=await axios.get(CRYPTO_API_END_POINT);
    response=response.data;
} 
catch (error) {
console.log(error);
}
    return response;
}