import { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { shuffle } from './arrayHelpers';
import { DateTime, DateTimeMode } from './components/DateTime';
import { Platform } from './components/Platform';
import { Poster } from './components/Poster';
import { TitleBanner } from './components/TitleBanner';
import { HomeAssistantContext } from './contexts/HomeAssistantContext';
import type { Entity, FeedAttributes, Movie } from './dataTypes';
import { ConnectionState, SubscribeEventsCommand } from './hooks/useHomeAssistant';

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

  const { ha } = useContext(HomeAssistantContext);

  useEffect(() => {
    if (ha.connectionState === ConnectionState.AUTHENTICATED) {
      toast("Connected!", { type: 'success' });
    }
  }, [ha.connectionState]);

  useEffect(() => {

    async function updateMovieList() {
      const entity = await ha.api("GET", "states/sensor.tmdb_feed") as Entity<FeedAttributes>;
      setMovies(shuffle(entity.attributes.movies));
    }

    async function updateMovie() {

      if (movies.length === 0) {
        await updateMovieList();
      }

      if (movies.length > 0) {
        const nextMovie = movies.pop();
        setMovie(nextMovie);
      }
    }

    if (!movie) {
      updateMovie();
    }

    const interval = setInterval(updateMovie, props.refreshRate);

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
        <Poster className="Poster" imageUrl={movie?.poster} />
      </PosterSection>      
      
      <FooterSection className="Footer">
        <Platform className="Platform" platform={movie?.platform}></Platform>
        <FooterText className="Footer-Text">
          {formatCategory(movie?.category)}
        </FooterText>
      </FooterSection>

      <StatusbarSection className="Statusbar">
        <MediaPlayer style={{visibility: config.mediaPlayer ? 'visible' : 'hidden'}} entity={config.mediaPlayer}></MediaPlayer>
      </StatusbarSection>

      
      <ToastContainer position="bottom-right" autoClose={3000} newestOnTop closeButton={false} pauseOnFocusLoss={false} />
    
    </AppSection>
  );
}

export default App;
