import React from "react";
import Dice from "./Dice";

function Board({ name, color, gameHistory }) {
  const sum = gameHistory.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  return (
    <div>
      <h2>{name}</h2>
      <Dice color={color} num={gameHistory[gameHistory.length - 1]} />
      <p>{sum}</p>
    </div>
  );
}

export default Board;
