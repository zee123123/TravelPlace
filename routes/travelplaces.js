const express = require('express');
const router = express.Router();
const travelplaces = require('../controllers/travelplaces');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateTravelplace } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Travelplace = require('../models/travelplace');

router.route('/')
    .get(catchAsync(travelplaces.index))
    .post(isLoggedIn, upload.array('image'), validateTravelplace, catchAsync(travelplaces.createTravelplace))


router.get('/new', isLoggedIn, travelplaces.renderNewForm)

router.route('/:id')
    .get(catchAsync(travelplaces.showTravelplace))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateTravelplace, catchAsync(travelplaces.updateTravelplace))
    .delete(isLoggedIn, isAuthor, catchAsync(travelplaces.deleteTravelplace));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(travelplaces.renderEditForm))



module.exports = router;
