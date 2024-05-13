const suggestionsModel = require('../models/suggestions');

exports.create = function (userData, nickname) {
    let suggestions = new suggestionsModel({
        plantId: userData.plantId,
        suggestedName: userData.suggestedName,
        user: nickname
    });

    return suggestions.save().then(plant => {
        console.log(plant);

        return JSON.stringify(plant);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getAll = function () {
    return suggestionsModel.find({}).then(plant => {
        return JSON.stringify(plant);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getSuggestion = function (plantId) {
    return suggestionsModel.findById(plantId)
        .then(plant => {
            return plant;
        })
        .catch(err => {
            console.error('Error fetching suggestion:', err);
            return null;
        });
};

exports.getSuggestions = function (plantId) {
    return suggestionsModel.find({ plantId: plantId })
        .then(plant => {
            return plant;
        })
        .catch(err => {
            console.error('Error fetching suggestion:', err);
            return null;
        });
};

exports.getSuggestions = function (plantId, nickname) {
    return suggestionsModel.find({ plantId: plantId, nickname: nickname})
        .then(plant => {
            return plant;
        })
        .catch(err => {
            console.error('Error fetching suggestion:', err);
            return null;
        });
};
