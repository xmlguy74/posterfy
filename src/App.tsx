import { url } from 'inspector';
import React, { useEffect, useState } from 'react';
import './App.css';
import { DateTime, DateTimeMode } from './components/DateTime';
import { Platform } from './components/Platform';

const haUrl = "http://192.168.15.50:8123";
const wsUrl = "ws://192.168.15.50:8123/api/websocket";

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

function App() {

  const [movie, setMovie] = useState<Movie|null>(null);

  useEffect(() => {

    async function updateMovie() {
        const urlParams = new URLSearchParams(window.location.search);
        const authToken = urlParams.get('authToken');
  
        const res = await fetch(haUrl + '/api/states/sensor.posterfy_feed', {
          headers: {
            'Authorization': 'Bearer ' + authToken
          }
        });
  
        const entity = (await res.json()) as Entity;
        const movies = entity.attributes.movies.filter(m => m.title !== movie?.title);
        const idx = Math.floor(Math.random() * movies.length);
        setMovie(movies[idx]);
    }

    if (!movie) {
      updateMovie();
    }

    const interval = setInterval(updateMovie, 30000);

    return () => clearInterval(interval);
  })

  function formatCategory(c?: string): string {
    if (c === "coming_soon") {
      return "Coming Soon"
    }
    if (c === "in_theaters") {
      return "In Theaters"
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
        <Platform className="Platform"></Platform>
        <div className="Footer-Text">
          {formatCategory(movie?.category)}
        </div>
      </div>
    </div>
  );
}

export default App;
