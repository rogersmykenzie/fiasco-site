import React from "react";
import Dice from "./components/reusable/Dice";
// import logo from "./logo.svg";
import routes from "./routes";
import axios from "axios";
//css
import "./App.css";

function App() {
  React.useEffect(() => {
    axios.post("/server/cookie");
  }, []);

  return <div className="App">{routes}</div>;
}

export default App;
