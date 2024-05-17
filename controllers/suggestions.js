const suggestionsModel = require('../models/suggestions');

exports.create = function (userData, userId) {
    let suggestion = new suggestionsModel({
        plantId: userData.plantId,
        suggestedName: userData.suggestedName,
        userId: userId
    });

    return suggestion.save().then(suggestion => {

        return JSON.stringify(suggestion);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getAll = function () {
    return suggestionsModel.find({}).then(suggestion => {
        return JSON.stringify(suggestion);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getSuggestion = function (plantId) {
    return suggestionsModel.findById(plantId)
        .then(suggestion => {
            return suggestion;
        })
        .catch(err => {
            console.error('Error fetching suggestion:', err);
            return null;
        });
};

exports.getSuggestions = function (plantId) {
    return suggestionsModel.find({ plantId: plantId })
        .then(suggestion => {
            return suggestion;
        })
        .catch(err => {
            console.error('Error fetching suggestion:', err);
            return null;
        });
};

exports.getSuggestionsForUser = function (plantId, userId) {
    return suggestionsModel.find({ plantId: plantId, userId: userId })
        .then(suggestion => {
            return suggestion;
        })
        .catch(err => {
            console.error('Error fetching suggestion:', err);
            return null;
        });
};
