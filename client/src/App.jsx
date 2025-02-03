import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState("");

  const apiKey = "AIzaSyAx8jwwCseYD1gXmAsF09cyLrl9z8PdKdY"; // Replace with your actual API key

  const customizePrompt = (userInput) => {
    return `when i put any name give short meaning of that name: "${userInput}"`;
  };

  const fetchContent = async () => {
    if (!apiKey) {
      setError("API key is missing. Please provide a valid API key.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const finalPrompt = customizePrompt(prompt);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: finalPrompt }],
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Oops! Something went wrong while fetching the response.");
      }

      const data = await res.json();
      const contentText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received. Try a different prompt!";
      
      setResponse(contentText);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchContent();
  };

  return (
    <div>
      <h1>Define Your Name</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={handleInputChange}
          placeholder="Enter Your Name"
        />
        <button type="submit">Generate Response</button>
      </form>

      {loading && <p>Generating response, please wait...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div>
          <h2>AI Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default App;
