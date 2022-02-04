import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { HomeAssistantProvider } from './contexts/HomeAssistantContext';

const urlParams = new URLSearchParams(window.location.search);
const authToken = urlParams.get('authToken');
const refreshRate = ((urlParams.get('refresh') ?? 30000) as number);

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <HomeAssistantProvider hostname={window.CONFIG?.homeAssistant} authToken={authToken}>    
        <App refreshRate={refreshRate} />
      </HomeAssistantProvider>
    </React.StrictMode>,
    document.getElementById('root'));
};

//load the theme
if (window.CONFIG?.theme) {
  import(`./themes/${window.CONFIG.theme}.scss`).then(() => {
    render();
  })
} else {
  render();
}
