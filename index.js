import express from 'express';
import dotenv from 'dotenv';
import { ConnectDatabase } from './src/service/database.js';
import ArticleByAdmin from './src/router/Article.router.js'
import practiceRouter from './src/router/practice.router.js'
import   bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoRouter from './src/router/mongo.router.js';
  
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded());


app.use(morgan('combined'))

const port = process.env.PORT || 4000;

app.use('/api/v1/articleByAdmin',ArticleByAdmin)

app.use("/api/v1/user",practiceRouter);

app.use('/api/v1/mongoPractice',mongoRouter);

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
    ConnectDatabase();
});