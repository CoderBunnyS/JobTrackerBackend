var User = require('../models/User');
var async = require('async')
var Job = require('../models/Job')

const { body,validationResult } = require("express-validator");

// Display list of all Users.
exports.user_list = function (req, res, next) {

    User.find()
        .sort([['lastName', 'ascending']])
        .exec(function (err, list_users) {
            if (err) { return next(err); }
            // Successful, so render.
            res.json({ title: 'User List', user_list: list_users });
        })

};

// Display detail page for a specific User.
exports.user_detail = function (req, res, next) {

    async.parallel({
        user: function (callback) {
            User.findById(req.params.id)
                .exec(callback)
        },
        users_jobs: function (callback) {
            Job.find({ 'user': req.params.id }, 'title summary')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.user == null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.json({ title: 'User Detail', user: results.user, user_jobs: results.users_jobs });
    });

};

// Display User create form on GET.
exports.user_create_get = function (req, res, next) {
    res.json({ title: 'Create User' });
};

// Handle User create on POST.
exports.user_create_post = [

    // Validate and sanitize fields.
    body('firstName').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('email').trim().isLength({min: 1}).escape().withMessage('Email Required'),
    body('password').trim().isLength({min: 1}).escape().withMessage("Password Required"),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create User object with escaped and trimmed data
        var user = new User(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.json({ title: 'Create User', user: user, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save user.
            user.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new user record.
                res.redirect(user.url);
            });
        }
    }
];


// Display User delete form on GET.
exports.user_delete_get = function (req, res, next) {

    async.parallel({
        user: function (callback) {
            User.findById(req.params.id).exec(callback)
        },
        users_jobs: function (callback) {
            Job.find({ 'user': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.user == null) { // No results.
            res.redirect('/jobs/users');
        }
        // Successful, so render.
        res.json({ title: 'Delete User', user: results.user, user_jobs: results.users_jobs });
    });

};

// Handle User delete on POST.
exports.user_delete_post = function (req, res, next) {

    async.parallel({
        user: function (callback) {
            User.findById(req.body.userid).exec(callback)        },
        users_jobs: function (callback) {
            Job.find({ 'user': req.body.userid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.users_jobs.length > 0) {
            // User has jobs. Render in same way as for GET route.
            res.json({ title: 'Delete User', user: results.user, user_jobs: results.users_jobs });
            return;
        }
        else {
            // User has no jobs. Delete object and redirect to the list of users.
            User.findByIdAndRemove(req.body.userid, function deleteUser(err) {
                if (err) { return next(err); }
                // Success - go to user list.
                res.redirect('/jobs/users')
            })

        }
    });

};

// Display User update form on GET.
exports.user_update_get = function (req, res, next) {

    User.findById(req.params.id, function (err, user) {
        if (err) { return next(err); }
        if (user == null) { // No results.
            let err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.json({ title: 'Update User', user: user });

    });
};


// Handle User update on POST.
exports.user_update_post = [

    // Validate and santize fields.
    body('firstName').trim().isLength({ min: 1 }).escape().withMessage('First name required.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').trim().isLength({ min: 1 }).escape().withMessage('Last name required.')
        .isAlphanumeric().withMessage('last name has non-alphanumeric characters.'),
    body('email').trim().isLength({min: 1}).escape().withMessage('Email Required'),
    body('password').trim().isLength({min: 1}).escape().withMessage("Password Required"),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Usesr object with escaped and trimmed data (and the old id!)
        var user = new User(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.json({ title: 'Update User', user: user, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            User.findByIdAndUpdate(req.params.id, user, {}, function (err, theuser) {
                if (err) { return next(err); }
                // Successful - redirect to category detail page.
                res.redirect(theuser.url);
            });
        }
    }
];