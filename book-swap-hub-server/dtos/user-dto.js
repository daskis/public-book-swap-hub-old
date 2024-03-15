module.exports = class UserDto {
    email;
    id;
    isActivated;
    imageName;
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.imageName = model.imageName
    }
}
