const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let JobSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User", required: false},

  title: {
    type: String, required: true, maxLength: 100
  },
  company: {
    type: String, required: true, maxLength: 100
  },
  appliedDate: {
    type: String, required: false
  },
  username: {
    type: String
  },
  phase: {
    type: String, default: 'wishlist'
  },
  category: [{
    type: Schema.Types.ObjectId, ref: 'Category' }],
  }
  )

  //Virtual for job URL
  // JobSchema.virtual('url')
  // .get(function() {
  //   return '/jobs/job' + this._id;
  // })

module.exports = mongoose.model('Job', JobSchema)
