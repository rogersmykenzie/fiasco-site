import React from "react";
//libs
import Draggable from "react-draggable";
//css
import "../../styles/dice.css";
import "../../styles/DiceOne.css";
import "../../styles/DiceTwo.css";
import "../../styles/DiceThree.css";
import "../../styles/DiceFour.css";
import "../../styles/DiceFive.css";
import "../../styles/DiceSix.css";

/**
 *
 * @prop {Boolean} isGood - States whether this is a white die or a black die
 * @prop {Number} startingValue - (Optional) Starting value for the die
 */
function Dice(props) {
  // const [value, setStartingValue] = React.useState(
  //   props.startingValue ? props.startingValue : Math.ceil(Math.random() * 6)
  // );

  const { value } = props;
  const [diceRef] = React.useState(React.useRef());
  const [tempZ, setTemp] = React.useState(-1);
  const [propsUpdate, setValue] = React.useState(false);
  React.useEffect(() => {
    setValue(true);
    // setX(props.x);
    // setY(props.y);
  }, [props.x, props.y]);
  function rollDice() {
    props.handleRoll &&
      props.handleRoll(props.id, Math.ceil(Math.random() * 6));
  }
  function bringToFront() {
    props.bringDieToFront(props.id);
  }
  function updateLocation(e) {
    props.handleMove(props.id, e.pageX, e.pageY);
    // const selectedArr = props.isGood
    //   ? props.game.whiteDice
    //   : props.game.blackDice;
    // const index = selectedArr.findIndex(val => val.id === props.id);
    // let newGame = { ...props.game };
    // if (props.isGood) {
    //   newGame.whiteDice[index].x = e.pageX;
    //   newGame.whiteDice[index].y = e.pageY;
    // } else {
    //   newGame.blackDice[index].x = e.pageX;
    //   newGame.blackDice[index].y = e.pageY;
    // }
    // props.dispatch({
    //   type: "SET_GAME",
    //   payload: newGame
    // });
  }
  function handleDrag(e) {
    console.log(e);
    // setValue(false);
    updateLocation(e);
    // setX(e.pageX);
    // setY(e.pageY);
  }

  const dots = [];
  for (let i = 1; i <= value; i++) {
    dots.push(
      <div className={`dice-${value}-dot__container__${i}`}>
        <div className={props.isGood ? " dot black-dot" : "dot red-dot"}></div>
      </div>
    );
  }

  return (
    <Draggable
      onStart={bringToFront}
      // onDrag={handleDrag}
      onStop={updateLocation}
      position={{ x: props.x - 50, y: props.y - 121.83 }}
    >
      <div
        onDoubleClick={rollDice}
        ref={diceRef}
        className={`dice ${props.isGood === true ? "good-die" : "bad-die"}`}
        style={{ zIndex: props.z }}
      >
        {dots}
      </div>
    </Draggable>
  );
}
export default Dice;
