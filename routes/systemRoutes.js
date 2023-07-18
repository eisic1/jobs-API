const express = require('express');
const router = express.Router();

const { 
    signUp,
    login
} = require('../controllers/loginController');
const { 
    getAllJobs, 
    checkAuthorization,
    createJobs,
    getSingleJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController');

router.route('/registration').post(signUp);
router.route('/login').post(login);
router.route('/').get(checkAuthorization, getAllJobs).post(checkAuthorization, createJobs);
router.route('/:id').get(checkAuthorization, getSingleJob).patch(checkAuthorization, updateJob).delete(checkAuthorization, deleteJob);

module.exports = router