require("dotenv").config();

const axios = require("axios");
const moment = require('moment');
const fs = require("fs");
const keys = require("./keys.js");

const [node, file, action, ...args] = process.argv;
console.log(node);
console.log(file);
console.log(action);
console.log(args);

const searchVariable = args.join(" ");
const actionTaken = action;

// var spotify = new Spotify(keys.spotify);

// if (action === "concert-this") {
//     console.log(`${searchVariable}'s upcoming events.
//     `);
//     searchBandsInTown(searchVariable);
// } else if (action === "spotify-this-song") {
//     console.log(`Spotify this song, "${process.argv[3]}."`);
// } else if (action === "movie-this") {
//     console.log(`Search for information on the movie titled ${process.argv[3]}.`);
// } else if (action === "do-what-it-says") {
//     console.log(`Do what it says.`);
// } else {
//     console.log(`Please use one of the four available commands. They are as follows:
//     concert-this <artist>
//     spotify-this-song <song title>
//     movie-this <movie title>
//     do-what-it-says`)
// };

switch (actionTaken) {
    case "concert-this":
        console.log(`${searchVariable}'s upcoming events.
`);
        searchBandsInTown(searchVariable);
        break;
    case "spotify-this-song":
        console.log(`Spotify this song, "${searchVariable}."`);
        break;
    case "movie-this":
        console.log(`Search for information on the movie titled ${searchVariable}.`);
        break;
    case "do-what-it-says":
        console.log(`Do what it says.`);
        break;
    default:
        console.log(`Please use one of the four available commands. They are as follows:
  concert-this <artist>
  spotify-this-song <song title>
  movie-this <movie title>
  do-what-it-says`)
        break;
}

function searchBandsInTown(artist) {

    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios
        .get(queryURL)
        .then(function (response) {
            // console.log(response);
            if (response.data.length === 0) {
                console.log(`There are no upcoming shows by ${artist} visible on Bands In Town.`)
            } else {
                console.log(`Upcoming shows by ${artist}:
`)
            }

            for (let i = 0; i < response.data.length; i++) {
                console.log(`Venue: ${response.data[i].venue.name}
Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}
Date: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}
`);
            }

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

