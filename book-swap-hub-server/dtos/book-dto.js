module.exports = class BookDto {
    name;
    author;
    description;
    imageName;
    fileName;
    user;
    constructor(model) {
        this.name = model.name;
        this.author = model.author;
        this.description = model.description;
        this.imageName = model.imageName;
        this.fileName = model.fileName;
        this.user = model.user.toString();
    }
}
