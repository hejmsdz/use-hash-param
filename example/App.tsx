import React from "react";
import useHashParam from "../src";

function ControlledInput() {
  const [name, setName] = useHashParam("name");

  return (
    <div>
      <input value={name || ""} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setName()}>reset</button>
      <button
        onClick={() => setName((val) => `${val}${val}`, { history: "push" })}
      >
        double
      </button>
    </div>
  );
}

export default ControlledInput;
