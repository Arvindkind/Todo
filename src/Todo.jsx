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
  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(arr));
  }, [arr]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const subHandler = (e) => {
    e.preventDefault();
    const inpTrim = input.trim();
    if (inpTrim !== "" && !arr.some((el) => el.text === inpTrim)) {
      const addTodo = {
        id: uuidv4(),
        text: inpTrim,
        completed: false,
        image: image,
      };
      setArr([...arr, addTodo]);
      setInput("");
      setImage(null);
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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginLeft: "8px" }}
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
                    <span style={{ marginRight: "14px" }}>{item.text}</span>
                    {previewImg && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100vw",
                          height: "100vh",
                          background: "rgba(0,0,0,0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1000,
                        }}
                        onClick={() => setPreviewImg(null)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImg(null);
                          }}
                          style={{
                            position: "absolute",
                            top: 30,
                            right: 30,
                            transform: "translate(50%, -50%)",
                            background: "rgba(255,255,255,0.9)",
                            color: "#333",
                            border: "none",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            fontSize: 22,
                            cursor: "pointer",
                            zIndex: 1001,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                          }}
                          aria-label="Close"
                        >
                          ✖
                        </button>
                        <img
                          src={previewImg}
                          alt="Preview"
                          style={{
                            maxWidth: "90vw",
                            maxHeight: "80vh",
                            borderRadius: "12px",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                            background: "#fff",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                    {item.image && (
                      <img
                        src={item.image}
                        alt="todo"
                        style={{
                          width: "36px",
                          height: "36px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          marginLeft: "10px",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImg(item.image);
                        }}
                      />
                    )}
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
