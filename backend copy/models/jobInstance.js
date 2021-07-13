/* var mongoose = require('mongoose');
const { DateTime } = require("luxon");  //for date handling

var Schema = mongoose.Schema;

var JobInstanceSchema = new Schema({
    job: { type: Schema.ObjectId, ref: 'Job', required: true }, // Reference to the associated job.
    //: {type: String, required: true},
    imprint: {type: String, required: true},
    category: {type: String, required: true, enum:['Applications', 'Self Care', 'Network', 'Learn'], default:'Applications'},
    follow_up: { type: Date, default: Date.now },
});

// Virtual for this jobinstance object's URL.
JobInstanceSchema
.virtual('url')
.get(function () {
  return '/jobs/jobinstance/'+this._id;
});


JobInstanceSchema
.virtual('follow_up_formatted')
.get(function () {
  return DateTime.fromJSDate(this.follow_up).toLocaleString(DateTime.DATE_MED);
});

JobInstanceSchema
.virtual('follow_up_yyyy_mm_dd')
.get(function () {
  return DateTime.fromJSDate(this.follow_up).toISODate(); //format 'YYYY-MM-DD'
});


// Export model.
module.exports = mongoose.model('JobInstance', JobInstanceSchema); */