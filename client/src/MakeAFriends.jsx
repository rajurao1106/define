import React, { useState, useEffect } from "react";

const DB_NAME = "AI_Friend_DB";
const STORE_NAME = "conversations";
const DB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => reject("Database error");
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

const saveToIndexedDB = async (message) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.add({ message, timestamp: Date.now() });
  tx.oncomplete = () => console.log("Message saved to IndexedDB");
};

const getAllMessages = async () => {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
};

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    getAllMessages().then(setMessages);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { user: "You", text: input };
    setMessages((prev) => [...prev, newMessage]);
    saveToIndexedDB(newMessage);
    localStorage.setItem("lastMessage", JSON.stringify(newMessage));
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🤖 AI Friend</h1>
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg">
        <div className="h-64 overflow-y-auto mb-4 border-b border-gray-700">
          {messages.map((msg, index) => (
            <p key={index} className="p-2">
              <strong>{msg.user}:</strong> {msg.text}
            </p>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={sendMessage}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;
