const {Schema, model} = require('mongoose');
const CommentSchema = new Schema({
    comment: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    book: {type: Schema.Types.ObjectId, ref: 'Book'},
})

module.exports = model('Comment', CommentSchema);
