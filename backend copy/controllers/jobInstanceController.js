// var JobInstance = require('../models/jobInstance')
// var Job = require('../models/Job')
// var async = require('async')

// const { body,validationResult } = require("express-validator");

// // Display list of all JobInstances.
// exports.jobinstance_list = function(req, res, next) {

//   JobInstance.find()
//     .populate('job')
//     .exec(function (err, list_jobinstances) {
//       if (err) { return next(err); }
//       // Successful, so render.
//       res.render('jobinstance_list', { title: 'Job Instance List', jobinstance_list:  list_jobinstances});
//     })

// };

// // Display detail page for a specific JobInstance.
// exports.jobinstance_detail = function(req, res, next) {

//     JobInstance.findById(req.params.id)
//     .populate('job')
//     .exec(function (err, jobinstance) {
//       if (err) { return next(err); }
//       if (jobinstance==null) { // No results.
//           var err = new Error('Job copy not found');
//           err.category = 404;
//           return next(err);
//         }
//       // Successful, so render.
//       res.render('jobinstance_detail', { title: 'Job:', jobinstance:  jobinstance});
//     })

// };

// // Display JobInstance create form on GET.
// exports.jobinstance_create_get = function(req, res, next) {

//      Job.find({},'title')
//     .exec(function (err, jobs) {
//       if (err) { return next(err); }
//       // Successful, so render.
//       res.render('jobinstance_form', {title: 'Create JobInstance', job_list:jobs } );
//     });

// };

// // Handle JobInstance create on POST.
// exports.jobinstance_create_post = [

//     // Validate and sanitize fields.
//     body('job', 'Job must be specified').trim().isLength({ min: 1 }).escape(),
//     body('imprint').trim().escape(),
//     body('category').escape(),
//     body('follow_up', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
    
    
//     // Process request after validation and sanitization.
//     (req, res, next) => {

//         // Extract the validation errors from a request.
//         const errors = validationResult(req);

//         // Create a JobInstance object with escaped and trimmed data.
//         var jobinstance = new JobInstance(
//           { job: req.body.job,
//             imprint: req.body.imprint,
//             category: req.body.category,
//             follow_up: req.body.follow_up
//            });

//         if (!errors.isEmpty()) {
//             // There are errors. Render form again with sanitized values and error messages.
//             Job.find({},'title')
//                 .exec(function (err, jobs) {
//                     if (err) { return next(err); }
//                     // Successful, so render.
//                     res.render('jobinstance_form', { title: 'Create JobInstance', job_list : jobs, selected_job : jobinstance.job._id , errors: errors.array(), jobinstance:jobinstance });
//             });
//             return;
//         }
//         else {
//             // Data from form is valid
//             jobinstance.save(function (err) {
//                 if (err) { return next(err); }
//                    // Successful - redirect to new record.
//                    res.redirect(jobinstance.url);
//                 });
//         }
//     }
// ];



// // Display JobInstance delete form on GET.
// exports.jobinstance_delete_get = function(req, res, next) {

//     JobInstance.findById(req.params.id)
//     .populate('job')
//     .exec(function (err, jobinstance) {
//         if (err) { return next(err); }
//         if (jobinstance==null) { // No results.
//             res.redirect('/jobs/jobinstances');
//         }
//         // Successful, so render.
//         res.render('jobinstance_delete', { title: 'Delete JobInstance', jobinstance:  jobinstance});
//     })

// };

// // Handle JobInstance delete on POST.
// exports.jobinstance_delete_post = function(req, res, next) {
    
//     // Assume valid JobInstance id in field.
//     JobInstance.findByIdAndRemove(req.body.id, function deleteJobInstance(err) {
//         if (err) { return next(err); }
//         // Success, so redirect to list of JobInstance items.
//         res.redirect('/jobs/jobinstances');
//         });

// };

// // Display JobInstance update form on GET.
// exports.jobinstance_update_get = function(req, res, next) {

//     // Get job, users and categories for form.
//     async.parallel({
//         jobinstance: function(callback) {
//             JobInstance.findById(req.params.id).populate('job').exec(callback)
//         },
//         jobs: function(callback) {
//             Job.find(callback)
//         },

//         }, function(err, results) {
//             if (err) { return next(err); }
//             if (results.jobinstance==null) { // No results.
//                 var err = new Error('Job copy not found');
//                 err.category = 404;
//                 return next(err);
//             }
//             // Success.
//             res.render('jobinstance_form', { title: 'Update  JobInstance', job_list : results.jobs, selected_job : results.jobinstance.job._id, jobinstance:results.jobinstance });
//         });

// };

// // Handle JobInstance update on POST.
// exports.jobinstance_update_post = [

//     // Validate and sanitize fields.
//     body('job', 'Job must be specified').trim().isLength({ min: 1 }).escape(),
//     body('imprint').trim().escape(),
//     body('category').escape(),
//     body('follow_up', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
    
    
//     // Process request after validation and sanitization.
//     (req, res, next) => {

//         // Extract the validation errors from a request.
//         const errors = validationResult(req);

//         // Create a JobInstance object with escaped/trimmed data and current id.
//         var jobinstance = new JobInstance(
//           { job: req.body.job,
//             imprint: req.body.imprint,
//             category: req.body.category,
//             follow_up: req.body.follow_up,
//             _id: req.params.id
//            });

//         if (!errors.isEmpty()) {
//             // There are errors so render the form again, passing sanitized values and errors.
//             Job.find({},'title')
//                 .exec(function (err, jobs) {
//                     if (err) { return next(err); }
//                     // Successful, so render.
//                     res.render('jobinstance_form', { title: 'Update JobInstance', job_list : jobs, selected_job : jobinstance.job._id , errors: errors.array(), jobinstance:jobinstance });
//             });
//             return;
//         }
//         else {
//             // Data from form is valid.
//             JobInstance.findByIdAndUpdate(req.params.id, jobinstance, {}, function (err,thejobinstance) {
//                 if (err) { return next(err); }
//                    // Successful - redirect to detail page.
//                    res.redirect(thejobinstance.url);
//                 });
//         }
//     }
// ];