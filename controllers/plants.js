const plantModel = require('../models/plants');
const { SparqlEndpointFetcher } = require("fetch-sparql-endpoint");

exports.create = function (userData, filePath, nickname) {
    let plant = new plantModel({
        name: userData.name,
        enableSuggestions: userData.enableSuggestions === 'on',
        date: userData.date,
        location: userData.location,
        description: userData.description,
        size: userData.size,
        flowers: userData.flowers === 'on',
        leaves: userData.leaves === 'on',
        fruit: userData.fruit === 'on',
        sunExposure: userData.sunExposure,
        flowerColour: userData.flowerColour,
        img: filePath,
        nickname: nickname,
        chat: "w"
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

exports.updateName = function (userData) {
    return plantModel.findByIdAndUpdate(userData.plantId, { name: userData.suggestedName, enableSuggestions: false }, { new: true })
      .then(updatedPlant => {
          if (updatedPlant) {
              console.log("Plant name updated successfully:", updatedPlant);
              return JSON.stringify(updatedPlant);
          } else {
              console.log("Plant not found with the given ID:", userData.plantId);
              return null;
          }
      })
      .catch(err => {
          console.error('Error updating plant name:', err);
          return null;
      });
};
