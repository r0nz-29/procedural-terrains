import React from "react";
import { World } from "./World";
import "./App.css";

const App = () => {
  React.useEffect(() => {
    const root = document.getElementById("root");
    const world = new World(root);
    world.start();
  }, []);
  return null;
};

export default App;
