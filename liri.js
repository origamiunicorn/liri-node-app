require("dotenv").config();

const keys = require("./keys.js");
const axios = require("axios");
const moment = require('moment');
const fs = require("fs");
var request = require('request');

var client_id = keys.spotify.id;
var client_secret = keys.spotify.secret;

let [node, file, action, ...args] = process.argv;
let searchVariable = args.join(" ");
let actionTaken = action;

switch (actionTaken) {
    case "concert-this":
        fs.appendFile("./sample.txt", "concert-this " + searchVariable + "\n", function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Content Added!");
            }

        });
        searchBandsInTown(searchVariable);
        break;
    case "spotify-this-song":
        if (searchVariable !== "") {
            console.log(`Searching Spotify for a song called, "${searchVariable}."`);
            searchVariable.split(" ").join("+");
            searchSpotifyAPI(searchVariable);
        } else {
            searchVariable = "track:the+sign+artist:ace+of+base";
            console.log(`Searching Spotify for a song called, "${searchVariable}."`);
            searchSpotifyAPI(searchVariable);
        }
        break;
    case "movie-this":
        console.log(`Searching for information on a movie titled ${searchVariable}.`);
        searchVariable.split(" ").join("+");
        searchMovies(searchVariable, "");
        break;
    case "do-what-it-says":
        console.log(`Do what it says.`);
        doTheThing();
        break;
    default:
        console.log(`Please use one of the four available commands. They are as follows:
  concert-this <artist>
  spotify-this-song <song title>
  movie-this <movie title>
  do-what-it-says`)
        break;
};

function doTheThing() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        actionTaken = dataArr[0];
        searchVariable = dataArr[1];

        switch (actionTaken) {
            case "concert-this":
                searchBandsInTown(searchVariable);
                break;
            case "spotify-this-song":
                console.log(`Spotify this song, "${searchVariable}."`);
                searchSpotifyAPI();
                break;
            case "movie-this":
                console.log(`Searching for information on a movie titled ${searchVariable}.`);
                searchVariable.split(" ").join("+");
                searchMovies(searchVariable, "");
                break;
        };
    });
};

function searchMovies(movie = "Mr. Nobody") {

    let queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=$&plot=short&apikey=" + keys.omdb.id;

    axios
        .get(queryURL)
        .then(
            function (response) {
                // console.log(response)
                console.log(`
Title: ${response.data.Title}
Release Year: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}
Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
Produced In: ${response.data.Country}
Movie Language(s): ${response.data.Language}
Plot Synopsis: ${response.data.Plot}
Top Billing Actors: ${response.data.Actors}`);
            })
        .catch(
            function (error) {
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
}

function searchSpotifyAPI(song) {
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            let token = body.access_token;
            let options = {
                url: 'https://api.spotify.com/v1/search?q=' + song + '&offset=0&limit=5&type=track',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function (error, response, body) {

                for (let i = 0; i < 5; i++) {
                    console.log(`
Song: ${body.tracks.items[i].name}
Artist: ${body.tracks.items[i].artists[0].name}
Album: ${body.tracks.items[i].album.name}
Preview URL: ${body.tracks.items[i].preview_url}`);
                }
            });
        }
    });
};

function searchBandsInTown(artist) {

    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios
        .get(queryURL)
        .then(function (response) {
            // console.log(response);
            if (response.data.length === 0) {
                console.log(`
There are no upcoming shows by ${artist} visible on Bands In Town.`)
            } else {
                console.log(`
Upcoming shows by ${artist}:`)
            }

            for (let i = 0; i < response.data.length; i++) {
                var toPrint = `
Venue: ${response.data[i].venue.name}
Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}
Date: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}`;
                console.log(toPrint);

                fs.appendFile("./sample.txt", toPrint + "\n", function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Content Added!");
                    }
                });
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