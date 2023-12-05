import { useContext, useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { shuffle } from './arrayHelpers';
import { DateTime, DateTimeMode } from './components/DateTime';
import { Platform } from './components/Platform';
import { Poster } from './components/Poster';
import { TitleBanner } from './components/TitleBanner';
import { HomeAssistantContext } from './contexts/HomeAssistantContext';
import type { Movie } from './dataTypes';

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

  const { ha, states } = useContext(HomeAssistantContext);

  const moviesRef = useRef<Movie[]>();
  moviesRef.current = movies;

  useEffect(() => {
    if (ha.ready) {
      toast.clearWaitingQueue();
      toast.dismiss();
      toast("Connected!", { type: 'success', delay: 1000 });
    } else if (ha.ready === false) {
      toast("Not Connected! Attempting to restore.", { type: 'error', autoClose: false });
    }
  }, [ha.ready])

  useEffect(() => {
    if (moviesRef.current.length === 0) {
      try {
        const source = states.find(e => e.entity_id === "sensor.tmdb_feed")
        if (source) {
          const copy = shuffle([...source.attributes.movies]);
          console.log(`Discovered ${copy.length} movies.`)
          setMovies(copy);
        }
      } catch (e) {
        console.error(`Failed to load movie list. ${e}`)
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
    <AppSection className="App">
      <TaskbarSection className="Taskbar">
        <DateTime className="Time" mode={DateTimeMode.Time} style={{visibility: config.showTime ? 'visible' : 'hidden'}}></DateTime>
        <DateTime className="Date" mode={DateTimeMode.Date} style={{visibility: config.showDate ? 'visible' : 'hidden'}}></DateTime>
      </TaskbarSection>
      
      <HeaderSection className="Header">
        <TitleBanner title={config.title} subtitle={config.subtitle}></TitleBanner>
      </HeaderSection>
      
      <PosterSection>
        <Poster className="Poster" imageUrl={movie?.poster} style={{visibility: config.showPoster ? 'visible' : 'hidden'}}/>
      </PosterSection>      
      
      <FooterSection className="Footer" style={{visibility: config.showFooter ? 'visible' : 'hidden'}}>
        <Platform className="Platform" platform={movie?.platform}></Platform>
        <FooterText className="Footer-Text">
          {formatCategory(movie?.category)}
        </FooterText>
      </FooterSection>

      <StatusbarSection className="Statusbar">
        <MediaPlayer style={{visibility: config.showMediaPlayer ? 'visible' : 'hidden'}} config={config.mediaPlayer}></MediaPlayer>
      </StatusbarSection>

      
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        newestOnTop 
        closeButton={false}
        pauseOnFocusLoss={false} 
        limit={3}
        theme='colored' />
    
    </AppSection>
  );
}

export default App;
