let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ChatSchema = new Schema({
    chatId: {type: String},
    message: {type: String},
    userId: {type: String}
});

ChatSchema.set('toObject', {getters: true, virtuals: true});

let Chat = mongoose.model('chats', ChatSchema);

module.exports = Chat;