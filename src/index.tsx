import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HomeAssistantProvider } from './contexts/HomeAssistantContext';

const urlParams = new URLSearchParams(window.location.search);
const authToken = urlParams.get('authToken');
const refreshRate = ((urlParams.get('refresh') ?? 30000) as number);

function loadJS(url: string) {
  var xhttp = new XMLHttpRequest();
  var script = document.createElement("script");
  xhttp.open("GET", url, false);
  xhttp.send();
  script.text = xhttp.responseText;
  document.head.appendChild(script).parentNode.removeChild(script);
}

loadJS("config.js");

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <HomeAssistantProvider hostname={window.CONFIG.homeAssistant} authToken={authToken}>    
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
