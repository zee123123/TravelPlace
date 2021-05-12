const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Travelplace = require('../models/travelplace');

mongoose.connect('mongodb://localhost:27017/travelplaces', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Travelplace.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Travelplace({
          //admin id
            author: '607590b51636cd3763b5a943',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates:  [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:[
              {
                url: 'https://res.cloudinary.com/dlom3w0xm/image/upload/v1618280103/MunHotel/Hotel_sample1.jpg',
                filename: 'MunHotel/Hotel_sample1'
              },
              {
                url: 'https://res.cloudinary.com/dlom3w0xm/image/upload/v1618280164/MunHotel/Hotel_sample2.jpg',
                filename: 'MunHotel/Hotel_sample2'
              },
              {
                url: 'https://res.cloudinary.com/dlom3w0xm/image/upload/v1618280164/MunHotel/Hotel_sample3.jpg',
                filename: 'MunHotel/Hotel_sample3'
              },
              {
                url: 'https://res.cloudinary.com/dlom3w0xm/image/upload/v1618280164/MunHotel/Hotel_sample4.jpg',
                filename: 'MunHotel/Hotel_sample4'
              },
              {
                url: 'https://res.cloudinary.com/dlom3w0xm/image/upload/v1618280164/MunHotel/Hotel_sample5.jpg',
                filename: 'MunHotel/Hotel_sample5'
              }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
