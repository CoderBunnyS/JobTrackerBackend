var Job = require('../models/Job');
var User = require('../models/User');
var Category = require('../models/category');
//var JobInstance = require('../models/jobinstance');

const { body,validationResult } = require("express-validator");

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        job_count: function(callback) {
            Job.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        //job_instance_count: function(callback) {
        //    JobInstance.countDocuments({}, callback);
        //},
        //job_instance_available_count: function(callback) {
        //    JobInstance.countDocuments({status:'Available'}, callback);

        user_count: function(callback) {
            User.countDocuments({}, callback);
        },
        category_count: function(callback) {
            Category.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.json({ title: 'ArtemisTracker', error: err, data: results });
    });
};

// Display list of all jobs.
exports.job_list = function(req, res, next) {
    Job.find({}, (err, allJobs) => {
        if(err) {return next(err)}
        res.json(allJobs)
    })
    // Job.find({}, "title user")
    // .populate('user').exec(function (err, list_jobs) {
    //     if(err) {return next(err)}
    //     else {
    //         //successful, so render
    //         res.json({title: 'Job List', job_list: list_jobs});
    //     }
    // })
};

exports.job_list_by_user = function(req, res, next) {
    Job.find({username: req.params.username}, (err, allJobs) => {
        if(err) {return next(err)}
        res.json(allJobs)
    })
    // Job.find({}, "title user")
    // .populate('user').exec(function (err, list_jobs) {
    //     if(err) {return next(err)}
    //     else {
    //         //successful, so render
    //         res.json({title: 'Job List', job_list: list_jobs});
    //     }
    // })
};

// Display detail page for a specific job.
 exports.job_detail = function(req, res, next) {

    // async.parallel({
    //     job: function(callback) {
    //         Job.findById(req.params.id)
    //           .populate('user')
    //           .populate('category')
    //           .exec(callback);
    //     }
    // });



    Job.findById(req.params.id, (err, val) => {
      if (err) {next(err)}
      res.json(val)
    })

};

// Display job create form on GET.
exports.job_create_get = function(req, res, next) {

    // Get all users and categories, which we can use for adding to our job.
    async.parallel({
        users: function(callback) {
            User.find(callback);
        },
        categories: function(callback) {
            Category.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.json({ title: 'Create Job',users:results.users, categories:results.categories });
    });

};

// Handle job create on POST.
exports.job_create_post = (req, res, next) => {
  const job = new Job(
    { title: req.body.title,
      user: req.body.user,
      company: req.body.company,
      appliedDate: req.body.appliedDate,
      category: req.body.category,
      username: req.body.username,
      phase: req.body.phase,
     });
  job.save((err, val) => {
    if (err) {return next(err)}
    res.json({job})
  })
}
// [
//     // Convert the category to an array.
//     (req, res, next) => {
//         if(!(req.body.category instanceof Array)){
//             if(typeof req.body.category==='undefined')
//             req.body.category=[];
//             else
//             req.body.category=new Array(req.body.category);
//         }
//         next();
//     },
//
//     // Validate and sanitize fields.
//     body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
//     //body('user', 'User must not be empty.').trim().isLength({ min: 1 }).escape(),
//     body('company', 'Company name must not be empty.').trim().isLength({ min: 1 }).escape(),
//     body('appliedDate', 'Application Date must not be empty').trim().isLength({ min: 1 }).escape(),
//     body('jobs.*').escape(),
//     // Process request after validation and sanitization.
//     (req, res, next) => {
//
//       console.log('create hit');
//
//         // Extract the validation errors from a request.
//         const errors = validationResult(req);
//
//         // Create a Job object with escaped and trimmed data.
//         var job = new Job(
//           { title: req.body.title,
//             user: req.body.user,
//             company: req.body.company,
//             appliedDate: req.body.appliedDate,
//             category: req.body.category,
//             username: req.body.username,
//            });
//
//         if (!errors.isEmpty()) {
//             // There are errors. Render form again with sanitized values/error messages.
//
//             // Get all users and categories for form.
//             async.parallel({
//                 users: function(callback) {
//                     User.find(callback);
//                 },
//                 categories: function(callback) {
//                     Category.find(callback);
//                 },
//             }, function(err, results) {
//                 if (err) { return next(err); }
//
//                 // Mark our selected categories as checked.
//                 for (let i = 0; i < results.categories.length; i++) {
//                     if (job.category.indexOf(results.categories[i]._id) > -1) {
//                         results.categories[i].checked='true';
//                     }
//                 }
//                 res.json({ title: 'Create Job',users:results.users, categories:results.categories, job: job, errors: errors.array() });
//             });
//             return;
//         }
//         else {
//             // Data from form is valid. Save job.
//             job.save(function (err) {
//                 if (err) { return next(err); }
//                    // Successful - redirect to new job record.
//                    res.redirect(job.url);
//                 });
//         }
//     }
// ];

// Display job delete form on GET.
exports.job_delete_get = function(req, res, next) {

    async.parallel({
        job: function(callback) {
            Job.findById(req.params.id).populate('user').populate('category').exec(callback);
        },
        //job_jobinstances: function(callback) {
        //    JobInstance.find({ 'job': req.params.id }).exec(callback);
       // },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.job==null) { // No results.
            res.redirect('/jobs/jobs');
        }
        // Successful, so render.
        res.json({ title: 'Delete Job', job: results.job, job_instances: results.job_jobinstances } );
    });

};

// Handle job delete on POST.
exports.job_delete_post = function(req, res, next) {

    // Assume the post has valid id (ie no validation/sanitization).

    Job.findByIdAndDelete(req.params.id, (err, deleted) => {
      if (err) { return next(err) }
      res.status(205).json({message: 'gone'})
    })

};

// Display job update form on GET.
exports.job_update_get = function(req, res, next) {

    // Get job, users and categories for form.
    async.parallel({
        job: function(callback) {
            Job.findById(req.params.id).populate('user').populate('category').exec(callback);
        },
        users: function(callback) {
            User.find(callback);
        },
        categories: function(callback) {
            Category.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.job==null) { // No results.
                var err = new Error('Job not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected categories as checked.
            for (var all_g_iter = 0; all_g_iter < results.categories.length; all_g_iter++) {
                for (var job_g_iter = 0; job_g_iter < results.job.category.length; job_g_iter++) {
                    if (results.categories[all_g_iter]._id.toString()===results.job.category[job_g_iter]._id.toString()) {
                        results.categories[all_g_iter].checked='true';
                    }
                }
            }
            res.json({ title: 'Update Job', users:results.users, categories:results.categories, job: results.job });
        });

};

exports.job_switch_phase = (req, res) => {
  const update = {
    phase: req.body.phase
  }
  Job.findByIdAndUpdate(req.params.id, update, (err, obj) => {
    if (err) { return next(err) }
    res.status(200).json({msg: `phase set to ${res.body.phase}`})
  })
}

// Handle job update on POST.
exports.job_update_post = [

    // Convert the category to an array.
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.category=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },

    // Validate and santitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    //body('user', 'User must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('company', 'CompanyName must not be empty.').trim().isLength({ min: 1 }).escape(),
    // body('appliedDate', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('category.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Job object with escaped/trimmed data and old id.
        var job = new Job(
          { title: req.body.title,
            company: req.body.company,
            user: req.body.user,
            phase: req.body.phase,
            summary: req.body.summary,
            appliedDate: req.body.appliedDate,
            category: (typeof req.body.category==='undefined') ? [] : req.body.category,
            _id:req.params.id // This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all users and categories for form
            async.parallel({
                users: function(callback) {
                    User.find(callback);
                },
                categories: function(callback) {
                    Category.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected categories as checked.
                for (let i = 0; i < results.categories.length; i++) {
                    if (job.category.indexOf(results.categories[i]._id) > -1) {
                        results.categories[i].checked='true';
                    }
                }
                res.status(200).json({ title: 'Update Job',users:results.users, categories:results.categories, job: job, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Job.findByIdAndUpdate(req.params.id, job, {}, function (err,thejob) {
                if (err) { return next(err); }
                   // Successful - redirect to job detail page.
                   //res.redirect(thejob.url);
                   res.json({job:job})
                });
        }
    }
];
