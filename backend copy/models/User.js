var mongoose = require('mongoose');
//const { DateTime } = require("luxon");  //for date handling

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  lastName: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, maxLength: 100 }
});

// Virtual for user "full" name.
UserSchema.virtual('name').get(function() {
  return this.firstName + ' ' + this.lastName;
});

// Virtual for this user instance URL.
UserSchema.virtual('url').get(function() {
  return '/jobs/user/' + this._id;
});

// UserSchema.virtual('lifespan').get(function() {
//   var lifetime_string = '';
//   if (this.date_of_birth) {
//     lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
//   }
//   lifetime_string += ' - ';
//   if (this.date_of_death) {
//     lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
//   }
//   return lifetime_string;
// });

// UserSchema.virtual('date_of_birth_yyyy_mm_dd').get(function() {
//   return DateTime.fromJSDate(this.date_of_birth).toISODate(); //format 'YYYY-MM-DD'
// });

// UserSchema.virtual('date_of_death_yyyy_mm_dd').get(function() {
//   return DateTime.fromJSDate(this.date_of_death).toISODate(); //format 'YYYY-MM-DD'
// });

// Export model.
module.exports = mongoose.model('User', UserSchema);
