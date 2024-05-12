const plantModel = require('../models/plants');

exports.create = function (userData, filePath, nickname) {
    let plant = new plantModel({
        date: userData.date,
        location: userData.location,
        description: userData.description,
        size: userData.size,
        flowers: userData.flowers === 'on',
        leaves: userData.leaves === 'on',
        fruit: userData.fruit === 'on',
        img: filePath,
        nickname: nickname,
    });

    return plant.save().then(plant => {
        console.log(plant);

        return JSON.stringify(plant);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getAll = function () {
    return plantModel.find({}).then(plant => {
        return JSON.stringify(plant);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getPlant = function (plantId) {
    return plantModel.findById(plantId)
        .then(plant => {
            return plant;
        })
        .catch(err => {
            console.error('Error fetching plant:', err);
            return null;
        });
};
