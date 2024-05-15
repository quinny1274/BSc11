var express = require('express');
var router = express.Router();
var plants = require('../controllers/plants');
var suggestionsController = require('../controllers/suggestions');
const { fetchDBpediaData, fetchDBpediaSuggestions} = require("../controllers/plants");

router.post('/addSuggestion', async function (req, res) {
  let userData = req.body;
  const plantId = userData.plantId;

  if (req.body.action === 'getSuggestions') {
    await renderPlantPage(res, plantId, 'bob2', userData.suggestedName);
  } else if (req.body.action === 'addSuggestion') {
    let result = suggestionsController.create(userData, "bob2");
    res.redirect(`/plants/${userData.plantId}`);
  }
});

router.get('/:id', async function(req, res) {
  const plantId = req.params.id;
  await renderPlantPage(res, plantId, 'bob2');
});

router.post('/updateName', function (req, res) {
  let userData = req.body;
  let result = plants.updateName(userData);
  res.redirect(`/plants/${userData.plantId}`);
});


async function renderPlantPage(res, plantId, userId, suggestedName = null) {
  try {
    const plant = await plants.getPlant(plantId);
    if (!plant) {
      return res.status(404).send('Plant not found');
    }

    const wasPlantCreatedByUser = plant.userId === userId;
    const suggestions = await getSuggestions(wasPlantCreatedByUser, plantId, userId);
    const dbpediaData = await fetchDBpediaData(plant.name);
    let dbPediaSuggestions = [];

    if (suggestedName) {
      dbPediaSuggestions = await fetchDBpediaSuggestions(suggestedName);
    }

    res.render('plants', {
      title: 'Plant Page',
      suggestions: suggestions,
      dbPediaSuggestions: dbPediaSuggestions,
      wasPlantCreatedByUser: wasPlantCreatedByUser,
      plant: plant,
      ...dbpediaData
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error fetching plant');
  }
}

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