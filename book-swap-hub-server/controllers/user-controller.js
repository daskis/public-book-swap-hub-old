const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const UserModel = require("../models/user-model")

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json({message: "success"});
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getMe(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const user = await UserModel.findById(req.user.id);
            const imageName = user.imageName
            const prevents = {
                color: user.preventColor,
                backgroundColor: user.preventBackgroundColor,
                fontSize: user.preventFontSize,
                lineHeight: user.preventLineHeight,
                theme: user.preventTheme
            }
            return res.json({user: req.user, image: imageName, token, prevents});
        } catch (e) {
            next(e)
        }
    }

    async getChangePrevents(req, res,next) {
        try {
            const changedUser = await userService.changePrevents(req.body, req.user)
            return res.json(changedUser)
        } catch (e) {
            next(e)
        }

    }
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const user = await userService.getInfo(req.body.email)
            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async getAnotherUserInfo(req, res, next) {
        try {
            const id = req.params.id; // Получаем id из URL
            const user = await userService.getAnotherUserInfo(id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async getChangeUserInfo(req, res, next) {
        try {
            const changedUser = await userService.getChangeUserInfo(req.body, req.files.image);
            return res.json(changedUser)
        } catch (e) {
            next(e)
        }
    }
}


module.exports = new UserController();
