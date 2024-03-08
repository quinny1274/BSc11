let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlantSchema = new Schema(
    {
        date: {type: Date},
        location: {type: String},
        description: {type: String , max: 1000},
        size: {type: Number},
        flowers: {type: Boolean},
        leaves: {type: Boolean},
        fruit: {type: Boolean},
        //TODO other options
        //TODO identification
        img: {type: String},
        nickname: {type: String},
        //     chat: {type: Schema.Types.UUID}
        chat: {type: String}
    }
);

PlantSchema.set('toObject', {getters: true, virtuals: true});

let Plant = mongoose.model('plant', PlantSchema);

module.exports = Plant;