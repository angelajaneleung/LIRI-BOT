// environment request 
require("dotenv").config();

// Adding the code required to import the keys.js file and store it in a variable.

var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');

// //Required Spotify API & Keys
var spotify = new Spotify(keys.spotify);

// file system
var fs = require('fs');

// Input Argument
var command = process.argv[2];
var input = process.argv[3]; //song or movie input

//Switch Case

switch (command) {
    case "concert-this":
        getBands(input);
        break;
    case "spotify-this-song":
        getSongs(input);
        break;
    case "movie-this":
        getMovies(input)
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Wrong command! Please try again.");
        break;
}

// concert-this
function getBands(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function(response) {
            const data = response.data;
            if (data === undefined || data.length == 0) {
                console.log(`No events for ${artist}.`);
            } else {
                data.forEach((event, index) => {
                    console.log(`========== ${index+1} ==========`)
                        // Name of the venue
                    console.log("Name of the venue:", event.venue.name);
                    // Venue location
                    console.log("Venue location:", event.venue.city);
                    // Date of the Even
                    var eventDate = moment(event.datetime).format('MM/DD/YYYY');
                    console.log("Date of the Event:", eventDate, "\n");
                });
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}


// spotify-this-song
function getSongs(song) {

    //If user has not specified a song
    if (song === undefined || song == "") {
        song = "That's What I Like";
    }

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //Artist(s)
        console.log("Artists: ", data.tracks.items[0].album.artists[0].name)
            // The song's name
        console.log("Song Name: ", data.tracks.items[0].album.name)
            // A preview link of the song from Spotify
        console.log("Preview Link: ", data.tracks.items[0].preview_url)
            // The album that the song is from
        console.log("Album Name: ", data.tracks.items[0].album.name)
    });
}

// movie-this
function getMovies(Movie) {

    if (Movie === undefined || Movie == "") {
        Movie = "Mr. Nobody";
    }

    axios.get("http://www.omdbapi.com/?apikey=42518777&t=" + Movie)
        .then(function(data) {
            // console.log(data.data); 
            var results = `
        Title of the movie: ${data.data.Title}
        Year the movie came out: ${data.data.Year}
        IMDB Rating of the movie: ${data.data.Rated}
        Rotten Tomatoes Rating of the movie: ${data.data.Ratings[0].Value}
        Country where the movie was produced: ${data.data.Country}
        Language of the movie: ${data.data.Language}
        Plot of the movie: ${data.data.Plot}
        Actors in the movie: ${data.data.Actors}`;
            console.log(results)

        })
        .catch(function(error) {
            console.log(error);
        });

    //Response if user does not type in a movie title
    if (Movie === "Mr. Nobody") {
        console.log("------------------------------");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
        console.log("------------------------------");
    };
}
// do-what-it-says
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        data = data.split(",");
        var command = data[0]
        var input = data[1]
            // getSongs(input)
        console.log("------------------------------")
        switch (command) {
            case "concert-this":
                getBands(input)
                break;
            case "spotify-this-song":
                getSongs(input)
                break;
            case "movie-this":
                getMovies(input)
                break;
            default:
                break;

        }
    });
}