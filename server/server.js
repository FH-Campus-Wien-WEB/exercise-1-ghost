const express = require('express')
const path = require('path')
const app = express()

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

// Configure a 'get' endpoint for data..
app.get('/movies', async function (req, res) {
  try {
    const wantedMovies = [
      "Harry Potter and the Sorcerer's Stone",
      "Harry Potter and the Chamber of Secrets",
      "Harry Potter and the Prisoner of Azkaban",
      "Harry Potter and the Goblet of Fire",
      "Harry Potter and the Order of the Phoenix",
      "Harry Potter and the Half-Blood Prince",
      "Harry Potter and the Deathly Hallows: Part 1",
      "Harry Potter and the Deathly Hallows: Part 2"
    ]
    const parsedMovies = []
    for (const movie of wantedMovies) {
      const movieData = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(movie)}&type=movie&apikey=68761cba`)
      // get only the properties we need (sea README)
      const { Title, Released, Runtime, Genre, Director, Writer, Actors, Plot, Poster, Metascore, imdbRating } = await movieData.json()

      // format as specified in the README
      const movieJson = {
        title: Title,
        released: new Date(Released).toISOString(),
        runtime: parseInt(Runtime.split(" ")[0]),
        genres: Genre.split(","),
        directors: Director.split(","),
        writers: Writer.split(","),
        actors: Actors.split(","),
        plot: Plot,
        poster: Poster,
        metascore: parseInt(Metascore),
        imdbRating: parseFloat(imdbRating)
      }
      parsedMovies.push(movieJson)
    }
    res.status(200).send(parsedMovies)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error retrieving movies")
  }
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

