require("dotenv").config();

var axios = require("axios");
var moment = require('moment');
moment().format();

var searchVariable = process.argv[3];

var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

if (process.argv[2] === "concert-this") {
    console.log(`${process.argv[3]}'s upcoming events.`);
} else if (process.argv[2] === "spotify-this-song") {
    console.log(`Spotify this song, "${process.argv[3]}."`);
} else if (process.argv[2] === "movie-this") {
    console.log(`Search for information on the movie titled ${process.argv[3]}.`);
} else if (process.argv[2] === "do-what-it-says") {
    console.log(`Do what it says.`);
} else {
    console.log(`Please use one of the four available commands. They are as follows:
    concert-this <artist>
    spotify-this-song <song title>
    movie-this <movie title>
    do-what-it-says`)
};

// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")

function searchBandsInTown(artist) {

    var queryURL = "https://rest.bandsintown.com/artists/" + "cher" + "/events?app_id=codingbootcamp";

    axios
        .get(queryURL)
        .then(function (response) {
            console.log(response.venue.name);
            console.log(response.venue.city, response.venue.region);
            console.log(moment(response.datetime, "MM/DD/YYY"));
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
};

