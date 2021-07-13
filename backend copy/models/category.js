var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: {type: String, required: true, maxLength: 100, minLength: 3},
        
    }
);

//Virtual for category's URL
CategorySchema
.virtual('url')
.get(function() {
    return '/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);