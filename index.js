import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { ConnectDatabase } from './src/service/database.js';
import ArticleByAdmin from './src/router/Article.router.js'
import practiceRouter from './src/router/practice.router.js'
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoRouter from './src/router/mongo.router.js';
import { checkDBConnection } from './src/service/mysqlDatabase.js';
import mysqlRouter from './src/router/MYSQL.router.js';
import "./src/config/redis.js";
import emailRouter from "./src/router/email.routes.js";
import "./src/workers/emailWorker.js";
import otpRouter from "./src/router/otp.router.js";
import workerRouter from "./src/router/worker.route.js";


const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded());

app.use(morgan('combined'))

const port = process.env.PORT || 4000;

app.use('/api/v1/articleByAdmin', ArticleByAdmin)

app.use("/api/v1/user", practiceRouter);

app.use('/api/v1/mongoPractice', mongoRouter);

app.use('/api/v1/mysqlPractice', mysqlRouter);

app.use("/api/v1/email", emailRouter);

app.use("/api/v1/otp", otpRouter);

app.use("/api/v1/worker", workerRouter);

app.listen(port, () => {
    console.log(`server is running on ${port}`)
    ConnectDatabase();
    // checkDBConnection();//mysql
});