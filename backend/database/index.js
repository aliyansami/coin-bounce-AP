const mongoose=require('mongoose')

const {MONGODB_CONNECTION_STRING}=require('../config/index');

const connectionString="mongodb+srv://Aliyan:gFfDu3BP6j8v6$g@cluster0.ceukgxr.mongodb.net/?retryWrites=true&w=majority";

const dbconnect=async()=>
{
    try{
        const conn=await mongoose.connect(MONGODB_CONNECTION_STRING);
        console.log(`Database succesfullt connected to host: ${conn.connection.host}`);
    }
    catch(error)
    {
        console.log(`Error: ${error}`);
    }
}

module.exports=dbconnect; 