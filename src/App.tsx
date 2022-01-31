import { useContext, useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { shuffle } from './arrayHelpers';
import { DateTime, DateTimeMode } from './components/DateTime';
import { Platform } from './components/Platform';
import { Poster } from './components/Poster';
import { TitleBanner } from './components/TitleBanner';
import { HomeAssistantContext } from './contexts/HomeAssistantContext';
import type { Movie } from './dataTypes';
import { ConnectionState } from './hooks/useHomeAssistant';

import 'react-toastify/dist/ReactToastify.min.css';
import { AppSection, FooterSection, FooterText, PosterSection, TaskbarSection, HeaderSection, StatusbarSection } from './App.styled';
import { MediaPlayer } from './components/MediaPlayer';

export interface AppProps {
  refreshRate: number;
}

function App(props: AppProps) {
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie>();
  const [config] = useState<Configuration>(window.CONFIG);
  const [ready, setReady] = useState<boolean>(false);

  const { ha, states } = useContext(HomeAssistantContext);

  const moviesRef = useRef<Movie[]>();
  moviesRef.current = movies;

  useEffect(() => {
    if (ha.connectionState === ConnectionState.AUTHENTICATED) {
      setReady(true);
      toast("Connected!", { type: 'success' });
    } else if (ha.connectionState === ConnectionState.CLOSED) {
      toast("Not Connected! Attempting to restore.", { type: 'error' });
    }
  }, [ha.connectionState]);

  useEffect(() => {
    if (moviesRef.current.length === 0) {
      const source = states?.find(e => e.entity_id === "sensor.tmdb_feed")
      if (source) {
         const copy = shuffle([...source.attributes.movies]);
         console.log(`Discovered ${copy.length} movies.`)
         setMovies(copy);
       }
     }
  }, [states, movie]);

  useEffect(() => {
    if (!movie && movies.length > 0) {
      updateMovie();
    }
  }, [movies, movie])

  function updateMovie() {  
    if (moviesRef.current.length > 0) {
      const nextMovie = moviesRef.current.pop();
      setMovie(nextMovie);
    }  
  }

  useEffect(() => {      
    const interval = setInterval(updateMovie, props.refreshRate);
    return () => clearInterval(interval);
  }, [props.refreshRate])

  function formatCategory(c?: string): string {
    if (c === "coming_soon") {
      return "Coming Soon"
    }
    if (c === "in_theaters") {
      return "In Theaters"
    }
    if (c === "streaming") {
      return "Now Streaming"
    }
    return ""
  }

  return (
    <AppSection className="App" style={{visibility: ready ? 'visible' : 'hidden'}}>
      <TaskbarSection className="Taskbar">
        <DateTime className="Time" mode={DateTimeMode.Time} style={{visibility: config.showTime ? 'visible' : 'hidden'}}></DateTime>
        <DateTime className="Date" mode={DateTimeMode.Date} style={{visibility: config.showDate ? 'visible' : 'hidden'}}></DateTime>
      </TaskbarSection>
      
      <HeaderSection className="Header">
        <TitleBanner title={config.title} subtitle={config.subtitle}></TitleBanner>
      </HeaderSection>
      
      <PosterSection>
        <Poster className="Poster" imageUrl={movie?.poster} />
      </PosterSection>      
      
      <FooterSection className="Footer">
        <Platform className="Platform" platform={movie?.platform}></Platform>
        <FooterText className="Footer-Text">
          {formatCategory(movie?.category)}
        </FooterText>
      </FooterSection>

      <StatusbarSection className="Statusbar">
        <MediaPlayer style={{visibility: config.mediaPlayer ? 'visible' : 'hidden'}} config={config.mediaPlayer}></MediaPlayer>
      </StatusbarSection>

      
      <ToastContainer position="bottom-right" autoClose={3000} newestOnTop closeButton={false} pauseOnFocusLoss={false} theme='colored' />
    
    </AppSection>
  );
}

export default App;
