import React from 'react';
import './App.css';
import { Date } from './components/Date';
import { Platform } from './components/Platform';
import { Time } from './components/Time';

function App() {
  return (
    <div className="App">
      <div className="Header">
        <Time className="Time"></Time>
        <div className="Title">
          Morris
          <br/>
          Home Theater
        </div>
        <Date className="Date"></Date>
      </div>
      <div className="Content">
      </div>
      <div className="Footer">
        <Platform className="Platform"></Platform>
        <div className="Footer-Text">
          Coming Soon
        </div>
      </div>
    </div>
  );
}

export default App;
