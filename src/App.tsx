import { url } from 'inspector';
import React, { useEffect, useState } from 'react';
import './App.css';
import { shuffle } from './arrayHelpers';
import { DateTime, DateTimeMode } from './components/DateTime';
import { Platform } from './components/Platform';

const haUrl = "http://localhost:8123";

interface Entity {
  entity_id: string,
  attributes: EntityAttributes,
}

interface EntityAttributes {
  movies: Movie[]
}

interface Movie {
  title: string
  category: string
  platform: string
  poster: string
}

const urlParams = new URLSearchParams(window.location.search);
const authToken = urlParams.get('authToken');
const refreshRate = (urlParams.get('refresh') ?? 30000) as number;

function App() {

  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie>();

  useEffect(() => {

    async function updateMovieList() {
      const res = await fetch(haUrl + '/api/states/sensor.tmdb_feed', {
        headers: {
          'Authorization': 'Bearer ' + authToken
        }
      });

      const entity = (await res.json()) as Entity;      
      setMovies(shuffle(entity.attributes.movies));
    }

    async function updateMovie() {
  
        if (movies.length == 0) {
          await updateMovieList();
        }

        if (movies.length > 0) {
          setMovie(movies.pop());
        }
    }

    if (!movie) {
      updateMovie();
    }

    const interval = setInterval(updateMovie, refreshRate);

    return () => clearInterval(interval);
  })

  function formatCategory(c?: string): string {
    if (c === "coming_soon") {
      return "Coming Soon"
    }
    if (c === "in_theaters") {
      return "In Theaters"
    }
    if (c === "streaming") {
      return "Now Playing"
    }
    return ""
  }

  return (
    <div className="App">
      <div className="Header">
        <DateTime className="Time" mode={DateTimeMode.Time}></DateTime>
        <div className="Title">
          Morris
          <br/>
          Home Theater
        </div>
        <DateTime className="Date" mode={DateTimeMode.Date}></DateTime>
      </div>
      <div className="Content" style={{backgroundImage: `url(${movie?.poster})`}}>
      </div>
      <div className="Footer">
        <Platform className="Platform" platform={movie?.platform}></Platform>
        <div className="Footer-Text">
          {formatCategory(movie?.category)}
        </div>
      </div>
    </div>
  );
}

export default App;
