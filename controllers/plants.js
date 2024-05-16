const plantModel = require('../models/plants');
const { SparqlEndpointFetcher } = require("fetch-sparql-endpoint");

exports.create = function (userData, filePath, userId) {
    const imageFile = userData.img;  // Assuming formData is a FormData object
    const imageBuffer = fs.readFileSync(imageFile.path);
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
        img: imageBuffer,
        userId: userId,
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

exports.getAll = function (sortBy = null) {
    let query = plantModel.find({});

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

exports.fetchDBpediaData = async function(plantName) {
    const fetcher = new SparqlEndpointFetcher();
    const resource = `http://dbpedia.org/resource/${plantName}`;

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