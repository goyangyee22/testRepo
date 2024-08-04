import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action){
    switch(action.type){
case "PLUS":
return { count: state.count + 1 };
case "MINUS":
return { count: state.count - 1 };
default:
    return state;
    }
}

function ReducerTest() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (<div>
        <p>Count: {state.count}</p>
        <button onClick={() => dispatch({ type: "PLUS" })}>plus</button>
        <button onClick={() => dispatch({ type: "MINUS" })}>minus</button>
    </div>);
}

export default ReducerTest;