import React from "react";
import io from "socket.io-client";
import axios from "axios";
import { Link } from "react-router-dom";
//components
import Dice from "../reusable/Dice";
//reducer
import gameReducer from "../reducers/gameReducer";
//css
import "../../styles/game.css";

let socket = io.connect();

function Game(props) {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [userInput, setUserInput] = React.useState("");
  const [sid, setSid] = React.useState("");
  const [game, dispatch] = React.useReducer(gameReducer, { players: [] });
  const [text, setText] = React.useState("");
  const [fontSize, setFontSize] = React.useState(12);

  React.useEffect(() => {
    axios.post("/server/cookie").then(() => {
      socket.emit("roomJoin", { url: props.match.params.roomID });
    });
    socket.on("roomJoinResponse", data => {
      console.log(data);
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        if (sid === "") {
          setSid(data.sid);
        }
        dispatch({
          type: "SET_GAME",
          payload: data.data
        });
        setText(data.data.text);
      }
    });

    function updateGame(data) {
      console.log("game updated");
      if (data.data.url === `/${props.match.params.roomID}`) {
        dispatch({
          type: "SET_GAME",
          payload: data.data.game
        });
      }
    }

    socket.on("dieRollResponse", updateGame);
    socket.on("dieMoveResponse", updateGame);
    socket.on("bringDieToFrontResponse", updateGame);

    socket.on("setTextResponse", data => {
      console.log(data);
      setText(data.data.text);
    });
  }, [props.match.params.roomID]);

  //event handlers
  function handleChange(e) {
    setUserInput(e.target.value);
  }
  function bringDieToFront(id) {
    console.log("here");
    socket.emit("bringDieToFront", {
      id,
      url: props.match.params.roomID
    });
  }
  function handleClick() {
    socket.emit("roomJoin", {
      name: userInput,
      url: props.match.params.roomID
    });
    setErrorMessage("");
  }
  function handleRoll(id, value) {
    socket.emit("dieRoll", {
      id,
      value,
      url: game.url
    });
  }
  function handleMove(id, x, y) {
    console.log("moving");
    socket.emit("dieMove", {
      id,
      x,
      y,
      url: game.url
    });
  }
  function updateText(text) {
    socket.emit("setText", {
      text,
      url: props.match.params.roomID
    });
    setText(text);
  }
  const playersIndex = game.players.findIndex(val => val.id === sid);
  return (
    <div>
      <Link to="/">
        <img
          className="game__home"
          src="https://image.flaticon.com/icons/png/512/25/25694.png"
          alt="home_icon"
        />
      </Link>
      <aside className="game_modul__container">
        <h1>{errorMessage.split("_").join(" ")}</h1>
        {errorMessage === "PLEASE_ENTER_NAME" ? (
          <>
            <input onChange={handleChange} />
            <button onClick={handleClick}>Submit</button>
          </>
        ) : null}
        <h1>
          {game.players[playersIndex]
            ? "You are " + game.players[playersIndex].name
            : null}
        </h1>
      </aside>
      {game.blackDice &&
        game.blackDice.map(die => {
          return (
            <Dice
              isGood={false}
              value={die.value}
              handleRoll={handleRoll}
              handleMove={handleMove}
              bringDieToFront={bringDieToFront}
              id={die.id}
              x={die.x}
              y={die.y}
              z={die.z}
              game={game}
              dispatch={dispatch}
            />
          );
        })}
      {game.whiteDice &&
        game.whiteDice.map(die => {
          return (
            <Dice
              isGood
              value={die.value}
              handleRoll={handleRoll}
              handleMove={handleMove}
              bringDieToFront={bringDieToFront}
              id={die.id}
              x={die.x}
              y={die.y}
              z={die.z}
              game={game}
              dispatch={dispatch}
            />
          );
        })}
      <menu className="game__menu">
        <div className="game__players">
          <h2>Members:</h2>
          <ul>
            {game.players.map(val => (
              <li className="game__member">{val.name}</li>
            ))}
          </ul>
        </div>
        <div className="game__chat">
          <textarea
            onChange={e => updateText(e.target.value)}
            className="game__textarea"
            value={text}
            style={{ fontSize: `${fontSize}px` }}
          ></textarea>
          <div>
            <button
              className="game__button--increase-font"
              onClick={() => setFontSize(fontSize - 2)}
            >
              -
            </button>
            <button
              className="game__button--decrease-font"
              onClick={() => setFontSize(fontSize + 2)}
            >
              +
            </button>
          </div>
        </div>
      </menu>
    </div>
  );
}

export default Game;
