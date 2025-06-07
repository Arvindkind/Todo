import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Todo.css";
import "./App.css";

export default function Todo() {
  const [arr, setArr] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(arr));
  }, [arr]);

  const subHandler = (e) => {
    e.preventDefault();
    const inpTrim = input.trim();
    if (inpTrim !== "" && !arr.some((el) => el.text === inpTrim)) {
      const addTodo = {
        id: uuidv4(),
        text: inpTrim,
        completed: false,
      };
      setArr([...arr, addTodo]);
      setInput("");
    } else {
      alert("Add something or avoid duplicates.");
    }
  };

  const toggleComplete = (id) => {
    setArr(
      arr.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const delVal = (val) => {
    const filtered = arr.filter((el) => el.id !== val);
    setArr(filtered);
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    const updated = arr.map((item) =>
      item.id === id ? { ...item, text: editText.trim() } : item
    );
    setArr(updated);
    setEditId(null);
    setEditText("");
  };

  return (
    <>
      <div>
        <h1>Todo</h1>
        <form onSubmit={subHandler}>
          <input
            type="text"
            placeholder="Write Todo"
            value={input}
            name="Todo"
            onChange={(e) => setInput(e.target.value)}
          />
          <br /> <br />
          <button type="submit">Add Todo</button>
        </form>

        <ul>
          {arr.map((item) => (
            <li key={item.id}>
              {editId === item.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(item.id)}>Save</button>
                </>
              ) : (
                <>
                  <span
                    onClick={() => toggleComplete(item.id)}
                    style={{
                      textDecoration: item.completed ? "line-through" : "none",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    {item.text}
                  </span>
                  <button onClick={() => delVal(item.id)}>Delete</button>
                  <button onClick={() => startEdit(item.id, item.text)}>
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
