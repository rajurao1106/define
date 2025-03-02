import React, { useState, useEffect, useCallback } from "react";

const DB_NAME = "AI_Friend_DB";
const STORE_NAME = "conversations";
const DB_VERSION = 1;
const apiKey = import.meta.env.VITE_API_KEY;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject("Database error");
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
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getAllMessages().then(setMessages);
  }, []);

  const startListening = useCallback(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = async (event) => {
      const userInput = event.results[0][0].transcript;
      setProcessing(true);
      setError(null);
      await fetchAIResponse(userInput);
    };
    recognition.onerror = () => setError("Speech recognition failed.");
    recognition.onend = () => setListening(false);

    recognition.start();
  }, []);

  const fetchAIResponse = async (text) => {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text }] }] }),
        }
      );

      if (!res.ok) throw new Error("AI response failed.");
      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand.";

      setResponse(aiText);
      speak(aiText);
      saveToIndexedDB({ user: "AI", text: aiText });
      setMessages((prev) => [...prev, { user: "AI", text: aiText }]);
    } catch (error) {
      setError("Error fetching AI response.");
    } finally {
      setProcessing(false);
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🤖 AI Friend</h1>
      <button onClick={startListening} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md">
        🎤 Speak
      </button>
      {processing && <p className="text-yellow-400 mt-4">Processing AI response...</p>}
      {response && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-lg font-semibold">🤖 AI:</h2>
          <p className="mt-2 text-gray-300">{response}</p>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AIChat;