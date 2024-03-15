const UserModel = require('../models/user-model');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const UserInfoDto = require('../dtos/user-info-dto');
const ApiError = require('../exceptions/api-error');
const path = require("path");
const {fileURLToPath} = require("url");

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
    async getInfo(email) {
        const user = await UserModel.findOne({email})
        const info = new UserInfoDto(user)
        return info;
    }

    async getAnotherUserInfo(id) {
        const user = await UserModel.findById(id)
        const info = new UserInfoDto(user)
        console.log(info)
        return info;
    }

    async getChangeUserInfo(info, image) {
        const filter = { _id: info.id };
        if (image) {
            const uploadedImage = image;
            const originalImageName = uploadedImage.name;
            const imageExtension = path.extname(originalImageName);
            const uniqueId = Date.now();
            const newImageName = `${uniqueId}${imageExtension}`;
            console.log(newImageName)
            const __dirname = path.dirname(fileURLToPath(require("url").pathToFileURL(__filename).toString()));
            const imagePath = path.join(__dirname, "../uploads/avatars", newImageName);
            await uploadedImage.mv(imagePath);

            // Если есть изображение, обновите поле imageName в модели UserModel
            const update = {
                imageName: newImageName,
            };

            await UserModel.findByIdAndUpdate(filter, update);
        }

        if (!info.password) {
            const update = {
                email: info.email,
                name: info.name,
                city: info.city,
                sex: info.sex,
                about: info.about,
            };
            const changedInfo = await UserModel.findByIdAndUpdate(filter, update);
            if (changedInfo) {
                const data = {
                    type: "success",
                    message: "Данные успешно изменены",
                };
                return data;
            }
        }
        if (info.password) {
            const user = await UserModel.findById(filter);
            const isPassEquals = await bcrypt.compare(info.password, user.password);
            if (isPassEquals) {
                const hashPassword = await bcrypt.hash(info.confirmPassword, 3);
                const update = {
                    email: info.email,
                    name: info.name,
                    city: info.city,
                    sex: info.sex,
                    about: info.about,
                    password: hashPassword,
                };
                const changedInfo = await UserModel.findByIdAndUpdate(filter, update);
                return {
                    type: "success",
                    message: "Данные успешно изменены",
                };
            } else {
                return {
                    type: "error",
                    message: "Неверный пароль",
                };
            }
        }
    }


    async changePrevents(body, user) {
        const filter = { _id: user.id };
        console.log(body)
        const update = {
            preventColor: body.color,
            preventFontSize: body.fontSize,
            preventBackgroundColor: body.backgroundColor,
            preventLineHeight: body.lineHeight
        }
        const userData = await UserModel.findByIdAndUpdate(filter, update);
        return userData

    }

}

module.exports = new UserService();
