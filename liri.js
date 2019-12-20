require("dotenv").config();
const inquirer = require("inquirer");

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

printToLog(`
---

${actionTaken} ${searchVariable}`);

function runLiri() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which action would you like to take?",
                choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
                name: "actionTaken"
            }
        ]).then(function (response) {

            let searchType = response.actionTaken;
            let actionType = "";
            let actionDefault = "";

            switch (searchType) {
                case "concert-this":
                    actionType = "musician or band";
                    actionDefault = "Blink-182";
                    break;
                case "spotify-this-song":
                    actionType = "song"
                    actionDefault = "The Sign";
                    break;
                case "movie-this":
                    actionType = "movie"
                    actionDefault = "Mr. Nobody";
                    break;
                case "do-what-it-says":
                    console.log(`Do what it says.`);
                    break;
            };

            if (searchType !== "do-what-it-says") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: `Give Liri a ${actionType} to find information on:`,
                            default: `${actionDefault}`,
                            name: "searchTerm"
                        }
                    ]).then(function (response) {

                        let searchVariable = response.searchTerm;

                        switch (actionType) {
                            case "musician or band":
                                console.log(`Searching for upcoming events featuring ${searchVariable}`);
                                searchBandsInTown(searchVariable);
                                break;
                            case "song":
                                console.log(`Searching Spotify for a song called, "${searchVariable}."`);
                                if (searchVariable !== "The Sign") {
                                    searchVariable.split(" ").join("+");
                                    searchSpotifyAPI(searchVariable);
                                } else {
                                    searchVariable = "track:the+sign+artist:ace+of+base";
                                    searchSpotifyAPI(searchVariable);
                                };
                                break;
                            case "movie":
                                console.log(`Searching for information on a movie titled ${searchVariable}.`);
                                searchVariable.split(" ").join("+");
                                searchMovies(searchVariable, "");
                                break;
                        };
                    })
            } else {
                doTheThing();
            };
        });
};

function searchAgain() {
    inquirer.prompt([
        {
            type: "confirm",
            message: `Would you like Liri to perform another search?`,
            name: "searchAgain",
            default: false
        }
    ]).then(function (response) {
        if (response.searchAgain === true) {
            runLiri();
        } else {
            return;
        }
    });
};

function doTheThing() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        actionTaken = dataArr[0];
        searchVariable = dataArr[1];

        doAllTheThings(actionTaken, searchVariable);
    });
};

function doAllTheThings(actionTaken, searchVariable) {
    printToLog(`
${actionTaken} ${searchVariable}`);
    switch (actionTaken) {
        case "concert-this":
            searchBandsInTown(searchVariable);
            break;
        case "spotify-this-song":
            console.log(`Spotify this song, ${searchVariable}.`);
            searchSpotifyAPI(searchVariable);
            break;
        case "movie-this":
            console.log(`Searching for information on a movie titled ${searchVariable}.`);
            searchVariable.split(" ").join("+");
            searchMovies(searchVariable, "");
            break;
    };
}

function searchMovies(movie) {

    let queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=$&plot=short&apikey=" + keys.omdb.id;

    axios
        .get(queryURL)
        .then(
            function (response) {
                let toPrint = `
Title: ${response.data.Title}
Release Year: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}
Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
Produced In: ${response.data.Country}
Movie Language(s): ${response.data.Language}
Plot Synopsis: ${response.data.Plot}
Top Billing Actors: ${response.data.Actors}`;
                console.log(toPrint, "\n");
                printToLog(toPrint);
                searchAgain();
            }
        )
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
            }
        );
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
                    let toPrint = `
Song: ${body.tracks.items[i].name}
Artist: ${body.tracks.items[i].artists[0].name}
Album: ${body.tracks.items[i].album.name}
Preview URL: ${body.tracks.items[i].preview_url}`;
                    console.log(toPrint);
                    printToLog(toPrint);
                };
                console.log("\r");
                searchAgain();
            });
        }
    });
};

function searchBandsInTown(artist) {

    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios
        .get(queryURL)
        .then(function (response) {
            if (response.data.length === 0) {
                var toPrint = `
There are no upcoming shows by ${artist} visible on Bands In Town API.`;
                console.log(toPrint);
                printToLog(toPrint);
            } else {
                var toPrint = `
Upcoming shows by ${artist}:`;
                console.log(toPrint);
                printToLog(toPrint);
            };

            for (let i = 0; i < response.data.length && i < 5; i++) {
                var toPrint = `
Venue: ${response.data[i].venue.name}
Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}
Date: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}`;
                console.log(toPrint);
                printToLog(toPrint);
            };
            console.log("\r");
            searchAgain();
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
            };
            console.log(error.config);
        });
};

function printToLog(toPrint) {
    fs.appendFile("./log.txt", toPrint + "\n", function (err) {
        if (err) {
            console.log(err);
        };
    });
};

runLiri();