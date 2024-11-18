import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./utils/db.js";
import userRouter from './routes/user.route.js';
import companyRouter from "./routes/company.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";

dotenv.config({});


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors());
const PORT = process.env.PORT || 3000;

// Api's
app.get('/api/v1/test', function(req, res) {
    res.send("Hello World!")
});
app.use('/api/v1/user', userRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/application', applicationRouter);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});