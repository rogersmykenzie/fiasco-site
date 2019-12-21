import React from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const [name, setName] = React.useState("");
  //event handlers
  function handleChange(e) {
    setName(e.target.value);
  }
  function handleClick() {}
  return (
    <div>
      <h1>What would you like your name to be?</h1>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Proceed</button>
    </div>
  );
}

export default Register;
