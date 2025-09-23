import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
          
export default app;