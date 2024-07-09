import { useEffect, useState } from "react"
import "./App.css";
import Cleanup from "./Cleanup";
import ToDoList from "./TodoList";

function App(){
const [num, setNum] = useState(0);
const [text, setText] = useState("");

const handleClick = () => {
  setNum(num+1);
}

useEffect(() => {
  console.log("나는 컴포넌트가 최초 렌더링될 때 실행되는 uef야.");
}, []);

useEffect(() => {
  console.log("나는 count가 변경될 때 실행되는 uef야.");
}, [num]);

useEffect(() => {
  console.log("나는 text가 변경될 때 실행되는 uef야.");
}, [text]);

  return(
    <div>
      <input />
      <h2>입력한 값: </h2>
      <h1></h1>
      <button onClick={handleClick}>Click me</button>
      <hr />
      <Cleanup />
      <hr />
      <ToDoList />
    </div>
  )
}

export default App;
