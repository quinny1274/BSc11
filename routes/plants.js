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

    let nickname = "bob"; // When nickname is implemented all occurrences of bob should be replaced with the actual nickname
    const wasPlantCreatedByUser = plant.nickname === nickname;
    const suggestions = await getSuggestions(wasPlantCreatedByUser, plantId, nickname);

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

    let nickname = "bob"; //When nickname is implemented all occurances of bob should be replaced with the actual nickname
    let wasPlantCreatedByUser = plant.nickname === nickname;
    const suggestions = await getSuggestions(wasPlantCreatedByUser, plantId, nickname);

    const plantName = plant.name;
    const resource = `http://dbpedia.org/resource/${plantName}`;
    const endpointUrl = 'https://dbpedia.org/sparql';
    const sparqlQuery = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    SELECT ?uri ?label ?comment
    WHERE {
      ?uri rdfs:label ?label .
      ?uri rdfs:comment ?comment .
      FILTER (langMatches(lang(?label), "en")) .
      FILTER (langMatches(lang(?comment), "en")) .
      FILTER (?uri = <${resource}>)
    }
  `;

    const encodedQuery = encodeURIComponent(sparqlQuery);
    const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('DBpedia query failed');
        }
        return response.json();
      })
      .then(data => {
        const bindings = data.results.bindings;
        if (bindings.length > 0) {
          res.render('plants', {
            title: 'Plant Page',
            suggestions: suggestions,
            wasPlantCreatedByUser: wasPlantCreatedByUser,
            plant: plant,
            dbp_title: bindings[0].label.value,
            dbp_comment: bindings[0].comment.value,
            dbp_uri: bindings[0].uri.value
          });
        } else {
          // Render the page without DBpedia stuff
          res.render('plants', {
            title: 'Plant Page',
            suggestions: suggestions,
            wasPlantCreatedByUser: wasPlantCreatedByUser,
            plant: plant,
            dbp_title: '', // Provide empty values for DBpedia properties
            dbp_comment: '',
            dbp_uri: ''
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data from DBpedia:', error);
        // Render the page without DBpedia stuff
        res.render('plants', {
          title: 'Plant Page',
          suggestions: suggestions,
          wasPlantCreatedByUser: wasPlantCreatedByUser,
          plant: plant,
          dbp_title: '', // Provide empty values for DBpedia properties
          dbp_comment: '',
          dbp_uri: ''
        });
      });
  } catch (err) {
    console.error('Error fetching plant:', err);
    res.status(500).send('Internal Server Error');
  }
});

async function getSuggestions(wasPlantCreatedByUser, plantId, nickname) {
  //if its the owner return all suggestions
  //if not the owner get for their nickname and plant and if its 2 or more then show suggested names and dont allow more?? idk
  let suggestions;
  if (wasPlantCreatedByUser) {
    suggestions = await suggestionsController.getSuggestions(plantId);
  } else {
    suggestions = await suggestionsController.getSuggestionsForUser(plantId, nickname);
  }

  return suggestions;
}

module.exports = router;