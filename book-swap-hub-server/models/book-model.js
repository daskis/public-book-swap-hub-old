const {Schema, model} = require('mongoose');
const BookSchema = new Schema({
    name: {type: String, required: true, unique: true},
    author: {type: String, required: true},
    description: {type: String, required: true},
    imageName: {type: String, required: true},
    fileName: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
})

module.exports = model('Book', BookSchema);
