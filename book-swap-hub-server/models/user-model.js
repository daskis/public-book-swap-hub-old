const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String, required: false, default: function () {
            return this.email; // Задаем значение name как email
        }
    },
    imageName: {type: String, default: ""},
    email: {type: String, unique: true, required: true},
    city: {type: String, required: false, default: ""},
    sex: {type: String, unique: false, default: "male"},
    about: {type: String, unique: false, default: ""},
    password: {type: String, required: true},
    book: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    isActivated: {type: Boolean, default: false},
    comment: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    activationLink: {type: String},
    preventColor: {type: String, default: "#000"},
    preventBackgroundColor: {type: String, default: "#fff"},
    preventFontSize: {type: Number, default: 14},
    preventLineHeight: {type: Number, default: 16},
    preventTheme: {type: String, default: "light"}
});

module.exports = model('User', UserSchema);
