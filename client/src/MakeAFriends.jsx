import React, { useState, useEffect } from "react";
import { FaMicrophone, FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const VoiceChatbot = () => {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("hi-IN");

  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (listening) {
      startListening();
    }
  }, [listening]);

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => console.log("Listening...");

    recognition.onresult = async (event) => {
      const userInput = event.results[0][0].transcript;
      setProcessing(true);
      setError(null);
      await fetchAIResponse(userInput);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError("Speech recognition failed. Please try again.");
      setListening(false);
    };

    recognition.onend = () => {
      console.log("Stopped listening.");
      setListening(false);
    };

    recognition.start();
  };

  const fetchAIResponse = async (text) => {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch AI response.");

      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand.";

      setResponse(aiText);
      speak(aiText);
    } catch (error) {
      setError("Error fetching AI response. Please check API key.");
      console.error("Error fetching AI response:", error);
    } finally {
      setProcessing(false);
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language;
    speech.rate = 1;
    speech.pitch = 1;

    speech.onend = () => {
      setListening(true);
    };

    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 text-white p-6">
      <div className="w-full max-w-lg bg-white text-black p-6 rounded-2xl shadow-lg text-center transition-all">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🎙 AI Voice Assistant</h1>

        {/* Language Selection */}
        <div className="mb-4">
          <label className="block text-gray-600 font-semibold mb-2">🌍 Select Language:</label>
          <select
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
            className="p-2 border border-gray-300 rounded-md w-full text-gray-800"
          >
            <option value="hi-IN">Hindi</option>
            <option value="en-US">English</option>
          </select>
        </div>

        {/* Start Listening Button */}
        <button
          onClick={() => setListening(true)}
          className={`px-6 py-3 rounded-full font-semibold text-white flex items-center justify-center space-x-2 
          ${listening ? "bg-red-500 animate-pulse" : "bg-blue-500 hover:bg-blue-600"} 
          transition-all duration-300 w-full`}
        >
          <FaMicrophone className="text-xl" />
          <span>{listening ? "Listening..." : "Start Talking"}</span>
        </button>

        {/* Processing Indicator */}
        {processing && (
          <p className="mt-4 text-yellow-500 flex items-center justify-center">
            <FaSpinner className="animate-spin mr-2" /> Processing AI response...
          </p>
        )}

        {/* AI Response */}
        {response && (
          <div className="mt-4 p-4 bg-gray-100 text-gray-900 shadow-md rounded-md border border-gray-300">
            <h2 className="text-lg font-semibold flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" /> AI Response:
            </h2>
            <p className="mt-2">{response}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-500 flex items-center bg-red-100 p-3 rounded-md shadow-md">
            <FaTimesCircle className="mr-2" /> {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceChatbot;