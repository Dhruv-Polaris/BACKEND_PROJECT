import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// routes would be added here
import userRouter from './routes/user.routes.js';

//routes declaration
app.use('/api/v1/users', userRouter);

export  {app};