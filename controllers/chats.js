const chatModel = require('../models/chats');

exports.create = function (room, chatText, userId) {
    let chat = new chatModel({
        chatId: room,
        message: chatText,
        user: userId
    });

    return chat.save().then(plant => {
        console.log(plant);

        return JSON.stringify(plant);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getAll = function () {
    return chatModel.find({}).then(plant => {
        return JSON.stringify(plant);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getChat = function (chatId) {
    return chatModel.findById(chatId)
        .then(plant => {
            return plant;
        })
        .catch(err => {
            console.error('Error fetching chat:', err);
            return null;
        });
};

exports.getChats = function (chatId) {
    return chatModel.find({ chatId: chatId })
        .then(plant => {
            return plant;
        })
        .catch(err => {
            console.error('Error fetching chat:', err);
            return null;
        });
};
