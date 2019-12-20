# Liri Node App
Liri is an app run in node.js which searches through Bands-in-Town API, Spotify API, and OMDB API to retrieve information related to requests input by a user in terminal. It maintains a log of all commands and results in log.txt, utilises .gitignore and .env to store API keys, and can retrieve a line of information stored in random.txt to conduct a search through the APIs using the information stored there. This is all part of a homework assignment for UCLA's Fullstack Web Development Coding Bootcamp (September 2019 to March 2020).

## Liri Functionality
To view Liri in action, please follow the link below:

[![Liri.js Bot](https://i.ibb.co/pLxSKyM/https-i-ytimg-com-vi-VZ-q-UDns8c-maxresdefault.jpg)](https://youtu.be/VZ__qUDns8c "Liri.js Bot")

Liri was designed to take one of four commands:
* concert-this
* spotify-this-song
* movie-this
* do-what-it-says

Originally, these were all command line inputs, but after going back and restructuring the JavaScript to work with the inquirer package, these four options became the four choices one could make upon running the liri.js file in node.

Upon load, users will be provided with a list. Using the arrow keys to navigate the list, they may select one of the four options listed above.

* ```concert-this``` uses the Bands in Town API in order to retrieve information about a musician or band's upcoming performances. It will list up to five upcoming performances related to the musician or band input, and will display a console.log of "There are no upcoming shows by Conjure One visible on Bands In Town API." if no performances are found. 

![alt text](https://i.imgur.com/mB93FE2.png "Words Here")

* ```spotify-this-song``` uses the Spotify API in order to retrieve up to five songs related to an input search term. 

* ```movie-this``` uses the OMDB API in order to retrieve information from one film most closely matching the input search term.

* ```do-what-it-says``` reads the contents of the file ```random.txt```, splits that data into an array, then takes those pieces of the new array and passes them into a function to perform the written search, be it ```concert-this```, ```spotify-this-song```, or ```movie-this```. The given default for the file is ```spotify-this-song,"I want it that way"```.

Once an option has been selected, users will have one of two things happen: 
1. If they selected ```do-what-it-says```, Liri will run whatever search was listed in ```random.txt``` and return the results before prompting if a user would like Liri to perform another search.

2. If they selected any other option, they'll be prompted to give Liri a search term to find information on, as seen in the image above.

For each search, Liri will console.log results as well as push an addendum of those commands and their results to ```log.txt```.

Liri comes with a few default search options, visible on the "Give Liri a [musician or band/song/movie] to find information on:" line before user input. If a user doesn't input their own term(s), the default will be used to run the Liri information retrieval.

After each retrieval of information, Liri will prompt the user "Would you like Liri to perform another search?" If a user selects y (or yes), Liri will run the initial function and present the user with the same original four choices under the "Which action would you like to take?" message and associated list. If a user selects n (or no), Liri.js will stop running.

## Languages Used
* JavaScript

## Libraries, Packages, and Tools Used
* Moment.js
* Node.js
* inquirer npm
* axios npm
* dotenv npm
* fs npm
* request

## APIs Used
* Bands In Town API
* OMDB API
* Spotify API

## Features
The use of .gitignore and .env to store keys related to the Spotify and OMDB APIs. The use of inquirer and chained promises to allow for recursive use of the runLiri() method to prompt users to confirm when they're done using Liri to search the various APIs.

Moment.js was used to convert the dates of upcoming musician or band events into a MM/DD/YYYY format from the string presented in the JSON object retrieved from the Bands In Town API.
