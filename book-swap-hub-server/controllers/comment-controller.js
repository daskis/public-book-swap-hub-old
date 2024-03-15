const CommentModel = require("../models/comment-model")
const UserModel = require("../models/user-model")
const BookModel = require("../models/book-model")
class BookController {
    async createComment(req,res,next) {
        try {
            const userId = req.body.userId;
            const bookId = req.body.bookId;
            const comment = req.body.comment;
            const newComment = await CommentModel.create({comment: comment, user: userId, book: bookId});
            const user = await UserModel.findByIdAndUpdate(userId, {
                $push: {comment: newComment._id}
            })
            const book = await BookModel.findByIdAndUpdate(bookId, {
                $push: {comment: newComment._id}
            })
            console.log(newComment)
            return res.json({message: "Успех"})
        } catch (e) {
            next(e)
        }
    }


    async getComments(req, res, next) {
        try {
            if (req.query.appointment === "book") {
                const bookId = req.query.id;
                const book = await BookModel.findById(bookId).populate({
                    path: 'comment',
                    populate: {
                        path: 'user',
                        model: 'User',
                    },
                });

                const comments = book.comment;
                res.json(comments);
            } else if (req.query.appointment === "user") {
                const userId = req.query.id;
                const user = await UserModel.findById(userId)
                    .populate({
                        path: 'comment', // Связь comment в модели User
                        populate: {
                            path: 'user', // Вложенная популяция для поля user в каждом комментарии
                            model: 'User', // Модель User
                        },
                    });

                // Теперь user содержит информацию о пользователе и комментарии
                const comments = user.comment;
                res.json(comments);
            } else {
                res.json([]); // Возвращать пустой массив, если appointment не поддерживается
            }
        } catch (e) {
            next(e);
        }
    }




}

module.exports = new BookController();