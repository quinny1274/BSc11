const plantModel = require('../models/plants');
const {SparqlEndpointFetcher} = require("fetch-sparql-endpoint");

exports.create = function (userData, filePath) {
    let plant = new plantModel({
        name: userData.name,
        //enableSuggestions: userData.enableSuggestions === 'on',
        enableSuggestions: true,
        date: userData.date,
        location: userData.location,
        description: userData.description,
        size: userData.size,
        flowers: userData.flowers,
        leaves: userData.leaves,
        fruit: userData.fruit,
        sunExposure: userData.sunExposure,
        flowerColour: userData.flowerColour,
        img: filePath,
        userId: userData.userId,
    });

  return plant.save().then(plant => {

    return JSON.stringify(plant);
  }).catch(err => {
    console.log(err);

    return null;
  });
};

exports.getAll = function (sortBy = null, filter = null) {
    let query = plantModel.find({});

    // Apply filter if provided
    if (filter) {
        query = query.where(filter, true);
    }

    // If sortBy, sort results
    if (sortBy) {
        query = query.sort(sortBy);
    }

    return query.then(plants => {
        return JSON.stringify(plants);
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
  return plantModel.findByIdAndUpdate(userData.plantId, {
    name: userData.suggestedName,
    enableSuggestions: false
  }, {new: true})
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

exports.fetchDBpediaData = async function(plantName) {
    const fetcher = new SparqlEndpointFetcher();
    const modifiedPlantName = plantName.replace(/\s/g, '_');
    const resource = `http://dbpedia.org/resource/${modifiedPlantName}`;

  // Build query
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

  try {
    // Fetch bindings
    const bindingsStream = await fetcher.fetchBindings('https://dbpedia.org/sparql', sparqlQuery);

    // Process bindings
    const bindings = await new Promise((resolve, reject) => {
      const result = [];
      bindingsStream.on('data', bindings => result.push(bindings));
      bindingsStream.on('end', () => resolve(result));
      bindingsStream.on('error', reject);
    });

    // Data found
    if (bindings.length > 0) {
      return {
        dbp_title: bindings[0].label.value,
        dbp_comment: bindings[0].comment.value,
        dbp_uri: bindings[0].uri.value
      };
    } else {
      // No data found from query, return empty strings
      return {
        dbp_title: "",
        dbp_comment: "",
        dbp_uri: ""
      };
    }
  } catch (error) {
    // DBPedia query failed, return empty strings
    return {
      dbp_title: "",
      dbp_comment: "",
      dbp_uri: ""
    };
  }
}

exports.fetchDBpediaSuggestions = async function(plantName) {
    const fetcher = new SparqlEndpointFetcher();
    const modifiedPlantName = plantName.replace(/\s/g, '_');

    // Build query
    const sparqlQuery = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?uri ?label ?abstract
        WHERE {
            {
                BIND(IRI(CONCAT("http://dbpedia.org/resource/", "${plantName}")) AS ?uri)
                ?uri rdfs:label ?label ;
                    dbo:abstract ?abstract .
                   
                FILTER(langMatches(lang(?label), "EN"))
                FILTER(langMatches(lang(?abstract), "EN"))
            }
            UNION
            {
                ?uri a dbo:Plant ;
                    rdfs:label ?label ;
                    dbo:abstract ?abstract .
                FILTER(REGEX(?label, "${plantName}", "i"))
                FILTER(langMatches(lang(?label), "EN"))
                FILTER(langMatches(lang(?abstract), "EN"))
                FILTER(?uri != IRI(CONCAT("http://dbpedia.org/resource/", "${plantName}")))
            }
        }
        LIMIT 10
    `;

    try {
        // Fetch bindings
        const bindingsStream = await fetcher.fetchBindings('https://dbpedia.org/sparql', sparqlQuery);

        // Process bindings
        const bindings = await new Promise((resolve, reject) => {
            const result = [];
            bindingsStream.on('data', bindings => result.push(bindings));
            bindingsStream.on('end', () => resolve(result));
            bindingsStream.on('error', reject);
        });

        // Data found
        let labels = [];
        if (bindings.length > 0) {
            for (let i = 0; i < bindings.length; i++) {
                labels[i] = bindings[i].label.value;
            }
        }
        return labels;
    } catch (error) { // Error fetching DBpedia
        console.log(error);
    }
}