const chatModel = require('../models/chats');

exports.create = function (plantId, message, userId) {
    let chat = new chatModel({
        plantId: plantId,
        message: message,
        userId: userId
    });

    return chat.save().then(chat => {
        console.log(chat);

        return JSON.stringify(chat);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getAll = function () {
    return chatModel.find({}).then(chat => {
        return JSON.stringify(chat);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getChat = function (plantId) {
    return chatModel.findById(plantId)
        .then(chat => {
            return chat;
        })
        .catch(err => {
            console.error('Error fetching chat:', err);
            return null;
        });
};

exports.getChats = function (plantId) {
    return chatModel.find({ plantId: plantId })
        .then(chat => {
            return chat;
        })
        .catch(err => {
            console.error('Error fetching chat:', err);
            return null;
        });
};
