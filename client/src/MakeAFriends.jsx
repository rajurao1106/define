import React, { useState, useEffect, useCallback } from "react";

const App = () => {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("hi-IN"); // डिफ़ॉल्ट हिंदी भाषा
  const [jokeMode, setJokeMode] = useState(false); // जोक मोड

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Vite env वेरिएबल

  const startListening = useCallback(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("सुन रहा हूँ...");
    };

    recognition.onresult = async (event) => {
      const userInput = event.results[0][0].transcript;
      console.log("आपने कहा:", userInput);
      setProcessing(true);
      setError(null);
      await fetchAIResponse(userInput);
    };

    recognition.onerror = (event) => {
      console.error("स्पीच रिकग्निशन त्रुटि:", event.error);
      setError("वाणी पहचान विफल। कृपया पुनः प्रयास करें।");
      setListening(false);
    };

    recognition.onend = () => {
      console.log("सुनना बंद किया।");
      setListening(false);
    };

    recognition.start();
  }, [language]);

  useEffect(() => {
    if (listening) {
      startListening();
    }
  }, [listening, startListening, jokeMode]);

  const fetchAIResponse = async (text) => {
    try {
      const prompt = jokeMode
        ? `तुम एक शायर की तरह बोलो और यूजर द्वारा पूछे गए सवाल का उत्तर हिंदी शायरी में दो।।।\nयूजर ने कहा: "${text}"`
        : `यूजर ने हिंदी में कुछ कहा: "${text}" कृपया इसका उत्तर हिंदी में दें।`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      if (!res.ok) throw new Error("AI प्रतिक्रिया प्राप्त करने में विफल।");

      const data = await res.json();
      console.log("API प्रतिक्रिया:", data);

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "माफ़ कीजिए, मैं समझ नहीं पाया।";

      setResponse(aiText);
      speak(aiText);
    } catch (error) {
      setError("AI प्रतिक्रिया लाने में समस्या। कृपया API कुंजी जांचें।");
      console.error("AI प्रतिक्रिया त्रुटि:", error);
    } finally {
      setProcessing(false);
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN"; // हिंदी भाषा में बोलेगा
    speech.rate = jokeMode ? 1.2 : 1; // जोक मोड में तेज़ बोलेगा
    speech.pitch = jokeMode ? 1.5 : 1; // जोक मोड में ऊँची आवाज़

    speech.onend = () => {
      setListening(true); // उत्तर के बाद दोबारा सुनना शुरू करें
    };

    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="voice-chatbot-container">
      <h1 className="voice-chatbot-title">🎙 वॉयस AI चैटबॉट</h1>

      <select onChange={(e) => setLanguage(e.target.value)} value={language} className="language-select">
        <option value="hi-IN">हिंदी</option>
        <option value="en-US">अंग्रेज़ी</option>
      </select>

      <label className="toggle-label">
        <input type="checkbox" checked={jokeMode} onChange={() => setJokeMode(!jokeMode)} /> शायराना मोड 🎭
      </label>

      {!listening && !processing && (
        <button onClick={() => setListening(true)} className="start-button">
          🎤 बात करना शुरू करें
        </button>
      )}

      {processing && <p className="processing-text">AI प्रतिक्रिया प्रोसेस हो रही है...</p>}

      {response && (
        <div className="ai-response">
          <h2 className="ai-response-title">🤖 AI उत्तर:</h2>
          <p>{response}</p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default App;