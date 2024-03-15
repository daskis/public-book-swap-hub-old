require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const authRouter = require('./router/auth')
const bookRouter = require('./router/book')
const commentRouter = require("./router/comment")
const errorMiddleware = require('./middlewares/error-middleware');
const fileUpload = require("express-fileupload")
const PORT = process.env.PORT || 5000;
const app = express()



app.use(express.json());
app.use(cookieParser());
app.use(express.static('uploads'))
app.use(fileUpload({}))
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/auth', authRouter);
app.use('/book', bookRouter);
app.use('/comment', commentRouter)
app.use('/images', express.static("./uploads/images"))
app.use('/avatars', express.static("./uploads/avatars"))
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@book-swap-hub.ybfbpej.mongodb.net/?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();
