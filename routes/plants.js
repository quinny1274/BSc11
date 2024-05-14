var express = require('express');
var router = express.Router();
var plants = require('../controllers/plants');
var suggestionsController = require('../controllers/suggestions');
const { fetchDBpediaData } = require("../controllers/plants");

router.post('/addSuggestion', function (req, res) {
  let userData = req.body;
  let result = suggestionsController.create(userData, "bob");
  console.log(result);
  res.redirect(`/plants/${userData.plantId}`);
});

router.post('/updateName', function (req, res) {
  let userData = req.body;
  let result = plants.updateName(userData);
  console.log(result);
  res.redirect(`/plants/${userData.plantId}`);
});

router.get('/:id', async function(req, res) {
  const plantId = req.params.id;
  try {
    const plant = await plants.getPlant(plantId);
    if (!plant) {
      return res.status(404).send('Plant not found');
    }

    let userId = "bob"; // When nickname is implemented all occurrences of bob should be replaced with the actual nickname
    const wasPlantCreatedByUser = plant.userId === userId;
    const suggestions = await getSuggestions(wasPlantCreatedByUser, plantId, userId);

    // Fetch DBpedia data
    try {
      const dbpediaData = await fetchDBpediaData(plant.name);
      // Render page
      res.render('plants', {
        title: 'Plant Page',
        suggestions: suggestions,
        wasPlantCreatedByUser: wasPlantCreatedByUser,
        plant: plant,
        ...dbpediaData
      });
    } catch (dbpediaError) {
      // Handle DBpedia fetch error
      res.render('plants', {
        title: 'Plant Page',
        suggestions: suggestions,
        wasPlantCreatedByUser: wasPlantCreatedByUser,
        plant: plant,
        ...dbpediaData
      });
    }
  } catch (plantError) {
    // Handle plant retrieval error
    console.error('Error fetching plant:', plantError);
    res.status(500).send('Error fetching plant');
  }
});

async function getSuggestions(wasPlantCreatedByUser, plantId, userId) {
  let suggestions;
  if (wasPlantCreatedByUser) {
    suggestions = await suggestionsController.getSuggestions(plantId);
  } else {
    suggestions = await suggestionsController.getSuggestionsForUser(plantId, userId);
  }

  return suggestions;
}

module.exports = router;