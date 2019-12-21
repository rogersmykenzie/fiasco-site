import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect();

function HomeLanding(props) {
  const [numPlayers, setNumPlayers] = React.useState(2);
  const [redirectUrl, setRedirectUrl] = React.useState(null);

  React.useEffect(() => {
    axios.post("/server/cookie");

    socket.on("newGameResponse", data => {
      console.log(data);
      setRedirectUrl(data.url);
    });
  }, []);

  //event handlers
  function updateNumPlayers(e) {
    setNumPlayers(+e.target.value);
  }

  function handleNewGame(e) {
    socket.emit("newGame", {
      numPlayers
    });
  }
  //redirect
  if (redirectUrl !== null) {
    return <Redirect to={redirectUrl} />;
  }
  //render
  return (
    <>
      <select onChange={updateNumPlayers}>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
      </select>
      <button onClick={handleNewGame}>Start New Game</button>
      <h1>Have a game url? Paste that here:</h1>
      <input placeholder="URL" />
      <button>Go to URL</button>
    </>
  );
}

export default HomeLanding;
