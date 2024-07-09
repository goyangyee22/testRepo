import React, { useState } from "react";

function ToDoList(props){
    const [toDo, setToDo] = useState("");
    const [toDoList, setToDoList] = useState([]);

    const onChange = (e) => {
        setToDo(e.target.value);
    };

const handleSubmit = (e) => {
    e.preventDefault();
    if(toDo === "") return false;
    setToDoList((prevItems) => [prevItems, ...toDo]);
    setToDo("");
};

    return (
        <div>
            <h1>My To Do {toDoList.length}</h1>
            <form onSubmit={handleSubmit}>
                <input onChange={onChange} value={toDo} />
                <button>Add To Do</button>
            </form>
            <hr />
            <ul>
                {toDoList.map((item, idx) => {
                    <li key={idx}>{item}</li>
                })}
            </ul>
        </div>
    )
}

export default ToDoList;