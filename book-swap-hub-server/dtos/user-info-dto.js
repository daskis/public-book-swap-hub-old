module.exports = class UserInfoDto {
    email;
    name;
    city;
    sex;
    about;
    id;
    isActivated;
    imageName;
    preventColor;
    preventBackgroundColor;
    preventFontSize;
    preventLineHeight;
    preventTheme;

    constructor(model) {
        this.email = model.email;
        this.name = model.name;
        this.city = model.city;
        this.sex = model.sex;
        this.about = model.about;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.imageName = model.imageName
        this.preventColor = model.preventColor
        this.preventBackgroundColor = model.preventBackgroundColor
        this.preventFontSize = model.preventFontSize
        this.preventLineHeight = model.preventLineHeight
        this.preventTheme = model.preventTheme
    }
}
