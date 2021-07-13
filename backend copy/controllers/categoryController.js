var Category = require('../models/category');
var Job = require('../models/Job');
var async = require('async');

const { body,validationResult } = require("express-validator");

// Display list of all Category.
exports.category_list = function(req, res, next) {

  Category.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_categories) {
      if (err) { return next(err); }
      // Successful, so render.
      res.json({ title: 'Category List', list_categories:  list_categories});
    });

};

// Display detail page for a specific Category.
exports.category_detail = function(req, res, next) {

    async.parallel({
        category: function(callback) {

            Category.findById(req.params.id)
              .exec(callback);
        },

        category_jobs: function(callback) {
          Job.find({ 'category': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category==null) { // No results.
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.json({ title: 'Category Detail', category: results.category, category_jobs: results.category_jobs } );
    });

};

// Display Category create form on GET.
exports.category_create_get = function(req, res, next) {
    res.json({ title: 'Create Category'});
};

// Handle Category create on POST.
exports.category_create_post = [

    // Validate and santise the name field.
    body('name', 'Category name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a category object with escaped and trimmed data.
        var category = new Category(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.json({ title: 'Create Category', category: category, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Category with same name already exists.
            Category.findOne({ 'name': req.body.name })
                .exec( function(err, found_category) {
                     if (err) { return next(err); }

                     if (found_category) {
                         // Category exists, redirect to its detail page.
                         res.redirect(found_category.url);
                     }
                     else {

                         category.save(function (err) {
                           if (err) { return next(err); }
                           // Category saved. Redirect to category detail page.
                           res.redirect(category.url);
                         });

                     }

                 });
        }
    }
];

// Display Category delete form on GET.
exports.category_delete_get = function(req, res, next) {

    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        category_jobs: function(callback) {
            Job.find({ 'category': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category==null) { // No results.
            res.redirect('/jobs/categories');
        }
        // Successful, so render.
        res.json({ title: 'Delete Category', category: results.category, category_jobs: results.category_jobs } );
    });

};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res, next) {

    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        category_jobs: function(callback) {
            Job.find({ 'category': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.category_jobs.length > 0) {
            // Category has jobs. Render in same way as for GET route.
            res.json({ title: 'Delete Category', category: results.category, category_jobs: results.category_jobs } );
            return;
        }
        else {
            // Category has no jobs. Delete object and redirect to the list of categories.
            Category.findByIdAndRemove(req.body.id, function deleteCategory(err) {
                if (err) { return next(err); }
                // Success - go to categories list.
                res.redirect('/jobs/categories');
            });

        }
    });

};

// Display Category update form on GET.
exports.category_update_get = function(req, res, next) {

    Category.findById(req.params.id, function(err, category) {
        if (err) { return next(err); }
        if (category==null) { // No results.
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.json({ title: 'Update Category', category: category });
    });

};

// Handle Category update on POST.
exports.category_update_post = [
   
    // Validate and sanitze the name field.
    body('name', 'Category name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
    

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a category object with escaped and trimmed data (and the old id!)
        var category = new Category(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.json({ title: 'Update Category', category: category, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Category.findByIdAndUpdate(req.params.id, category, {}, function (err,thecategory) {
                if (err) { return next(err); }
                   // Successful - redirect to category detail page.
                   res.redirect(thecategory.url);
                });
        }
    }
];