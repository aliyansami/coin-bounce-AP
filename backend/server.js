const express=require('express');
const dbconnect=require('./database/index');
const {PORT}=require('./config/index');
const router=require('./routes/index');
const errorHandler=require('./middlewares/errorHandler');
const cookieParser=require('cookie-parser');
const cors=require('cors');

const corsOptions={
    credentials:true,
    origin:["http://localhost:3000"] 
}


const app=express();

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json());

app.use(router);

dbconnect();

//we need to set static storage
// now we can access the images
app.use('/storage', express.static('storage'));

app.use(errorHandler);

app.listen(PORT,console.log(`Backend is running on port: ${PORT}.`));