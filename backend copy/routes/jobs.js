var express = require('express');
var router = express.Router();

// Require controller modules.
var job_controller = require('../controllers/jobController');
var user_controller = require('../controllers/userController');
var category_controller = require('../controllers/categoryController');
//var job_instance_controller = require('../controllers/jobInstanceController');

/// Job ROUTES ///

// GET Job home page.
router.get('/', job_controller.index);

// GET request for creating a Job. NOTE This must come before routes that display Job (uses id).
router.get('/job/create', job_controller.job_create_get);

// POST request for creating Job.
router.post('/job/create', job_controller.job_create_post);

// GET request to delete Job.
router.get('/job/:id/delete', job_controller.job_delete_get);

// POST request to delete Job.
router.post('/job/:id/delete', job_controller.job_delete_post);

// GET request to update Job.
router.get('/job/:id/update', job_controller.job_update_get);

// POST request to update Job.
router.post('/job/:id/update', job_controller.job_update_post);

// GET request for one Job.
router.get('/job/:id', job_controller.job_detail);

// GET request for list of all Job items.
router.get('/jobs', job_controller.job_list);

// GET request for list of all Job items.
router.get('/jobs/byuser/:username', job_controller.job_list_by_user);

router.post('/jobs/:id/phase', job_controller.job_switch_phase);


/// USER ROUTES ///

// GET request for creating User. NOTE This must come before route for id (i.e. display user).
router.get('/user/create', user_controller.user_create_get);

// POST request for creating User.
router.post('/user/create', user_controller.user_create_post);

// GET request to delete User.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete User.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update User.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update User.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one User.
router.get('/user/:id', user_controller.user_detail);

// GET request for list of all User.
router.get('/users', user_controller.user_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get('/category/create', category_controller.category_create_get);

//POST request for creating Category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete Category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete Category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update Category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update Category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one Category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all Category.
router.get('/categories', category_controller.category_list);

/// JOBINSTANCE ROUTES ///

// GET request for creating a JobInstance. NOTE This must come before route that displays JobInstance (uses id).
//router.get('/jobinstance/create', job_instance_controller.jobinstance_create_get);

// POST request for creating JobInstance.
//router.post('/jobinstance/create', job_instance_controller.jobinstance_create_post);

// GET request to delete JobInstance.
//router.get('/jobinstance/:id/delete', job_instance_controller.jobinstance_delete_get);

// POST request to delete JobInstance.
//router.post('/jobinstance/:id/delete', job_instance_controller.jobinstance_delete_post);

// GET request to update JobInstance.
///router.get('/jobinstance/:id/update', job_instance_controller.jobinstance_update_get);

// POST request to update JobInstance.
//router.post('/jobinstance/:id/update', job_instance_controller.jobinstance_update_post);

// GET request for one JobInstance.//
//router.get('/jobinstance/:id', job_instance_controller.jobinstance_detail);

// GET request for list of all JobInstance.
//router.get('/jobinstances', job_instance_controller.jobinstance_list);

module.exports = router;
