import { useState } from 'react';
import gameLogo from './game-logo.png';
import './App.css';
import Game from './Game';

function App() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="App">
      {showGame ?
        <Game /> :
        (<div className="App-start-screen">
          <img src={gameLogo} className="App-logo" alt="logo" />
          <h1 className='App-header'>Connections</h1>
          <button onClick={() => setShowGame(true)} className="App-play-btn" type="button" aria-label="Play game">Play</button>
        </div>
        )

      }
    </div>
  );
}

export default App;
