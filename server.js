import  express from "express";
import cors from 'cors';
import fileUpload from 'express-fileupload';
//import path from 'path'

import {router} from './routes/auth.js'

const app=express()
app.use(cors())
app.use(express.json())
//engedélyezünk egy temporális könyvtárat ideiglenes tárolásra:
app.use(fileUpload({               
    useTempFiles : true,
    tempFileDir : '/tmp/'
            }));

app.use('/auth',router)

const port=process.env.PORT || 5000

app.listen(port,()=>console.log(`listening on port ${port}...`))