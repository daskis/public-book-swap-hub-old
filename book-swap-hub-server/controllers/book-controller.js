const {fileURLToPath} = require("url");
const tokenService = require("../service/token-service");
const BookModel = require("../models/book-model")
const UserModel = require("../models/user-model")
const BookDto = require("../dtos/book-dto")
const dotenv = require('dotenv')
dotenv.config()
const path = require("path");
const fs = require("fs");
const FB2HTML = require('../reader/parser');
const cheerio = require('cheerio');
const parse = require('html-react-parser');
class BookController {
    async createNewBook(req, res, next) {
        try {
            if (req.files && req.files.image && req.files.file) {
                const userData = tokenService.validateRefreshToken(req.cookies.refreshToken);
                const uploadedImage = req.files.image;
                const uploadedFile = req.files.file;
                const imageName = req.body.name;
                const uniqueId = Date.now();

                // Генерация новых имен для изображения и файла
                const originalImageName = uploadedImage.name;
                const imageExtension = path.extname(originalImageName);
                const newImageName = `${uniqueId}.${imageName}${imageExtension}`;
                const originalFileName = uploadedFile.name;
                const fileExtension = path.extname(originalFileName);
                const newFileName = `${uniqueId}${fileExtension}`;
                const __dirname = path.dirname(fileURLToPath(require("url").pathToFileURL(__filename).toString()));
                // Пути сохранения
                const imagePath = path.join(__dirname, "../uploads/images", newImageName);
                const filePath = path.join(__dirname, "../uploads/Books", newFileName);

                await uploadedImage.mv(imagePath);
                await uploadedFile.mv(filePath);
                const bookInfo = {
                    name: req.body.name,
                    author: req.body.author,
                    description: req.body.description,
                    imageName: newImageName,
                    fileName: newFileName
                }
                console.log(bookInfo)
                try {
                    const book = await BookModel.create({...bookInfo, user: userData.id})
                    const user = await UserModel.findByIdAndUpdate(userData.id, {
                        $push: {book: book._id}
                    })
                    return res.json({message: "Книга успешно добавлена!"})
                } catch (e) {
                    next(e)
                }

            }
        } catch (e) {
            next(e);
        }
    }

    async getBook(req, res, next) {
        const id = req.params.id;
        try {
            const bookInfo = await BookModel.findById(id);
            const book = new BookDto(bookInfo);
            return res.json(book)
        } catch (e) {
            next(e);
        }
    }

    async getAllBooks(req, res, next) {
        try {
            const books = await BookModel.find({});
            return res.json(books);
        } catch (error) {
            next(error); // Pass the error to the error handling middleware
        }
    }

    async readBook(req, res, next) {
        try {
            const template = "<div className='book'>{{body}}</div>";

            const book = await BookModel.findById(req.params.id);

            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            const fb2FilePath = path.join(__dirname, `../uploads/books/${book.fileName}`);

            FB2HTML.read(fb2FilePath)
                .then((book) => {
                    const bookData = book.format();
                    const result = template.replace('{{body}}', bookData);
                    return res.send(result);
                })
        } catch (error) {
            next(error);
        }
    }}

module.exports = new BookController();
