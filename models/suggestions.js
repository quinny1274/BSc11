let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let SuggestionsSchema = new Schema({
    plantId: {type: String},
    suggestedName: {type: String},
    user: {type: String}
});

SuggestionsSchema.set('toObject', {getters: true, virtuals: true});

let Suggestions = mongoose.model('suggestions', SuggestionsSchema);

module.exports = Suggestions;