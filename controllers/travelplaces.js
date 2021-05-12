const Travelplace = require('../models/travelplace');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({
  accessToken: mapBoxToken
});
const {
  cloudinary
} = require("../cloudinary");


module.exports.index = async (req, res) => {
  const travelplaces = await Travelplace.find({}).populate('popupText');
  res.render('travelplaces/index', {
    travelplaces
  })
}

module.exports.renderNewForm = (req, res) => {
  res.render('travelplaces/new');
}

module.exports.createTravelplace = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.travelplace.location,
    limit: 1
  }).send()
  const travelplace = new Travelplace(req.body.travelplace);
  travelplace.geometry = geoData.body.features[0].geometry;
  travelplace.images = req.files.map(f => ({
    url: f.path,
    filename: f.filename
  }));
  travelplace.author = req.user._id;
  await travelplace.save();
  console.log(travelplace);
  req.flash('success', 'Successfully made a new travel place!');
  res.redirect(`/travelplaces/${travelplace._id}`)
}

module.exports.showTravelplace = async (req, res, ) => {
  const travelplace = await Travelplace.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if (!travelplace) {
    req.flash('error', 'Cannot find that travel place!');
    return res.redirect('/travelplaces');
  }
  res.render('travelplaces/show', {
    travelplace
  });
}

module.exports.renderEditForm = async (req, res) => {
  const {
    id
  } = req.params;
  const travelplace = await Travelplace.findById(id)
  if (!travelplace) {
    req.flash('error', 'Cannot find that travel place!');
    return res.redirect('/travelplaces');
  }
  res.render('travelplaces/edit', {
    travelplace
  });
}

module.exports.updateTravelplace = async (req, res) => {
  const {
    id
  } = req.params;
  console.log(req.body);
  const travelplace = await Travelplace.findByIdAndUpdate(id, {
    ...req.body.travelplace
  });
  const imgs = req.files.map(f => ({
    url: f.path,
    filename: f.filename
  }));
  travelplace.images.push(...imgs);
  await travelplace.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await travelplace.updateOne({
      $pull: {
        images: {
          filename: {
            $in: req.body.deleteImages
          }
        }
      }
    })
  }
  req.flash('success', 'Successfully updated travel place!');
  res.redirect(`/travelplaces/${travelplace._id}`)
}

module.exports.deleteTravelplace = async (req, res) => {
  const {
    id
  } = req.params;
  await Travelplace.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted travel place')
  res.redirect('/travelplaces');
}
