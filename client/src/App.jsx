import React, { useState, useEffect } from "react";

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
  }, []); // Run only once on component mount

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchContent();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Define Your Name</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">
        <input
          type="text"
          value={prompt}
          onChange={handleInputChange}
          placeholder="Enter Your Name"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Generate Response
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-600">Generating response, please wait...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {response && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-700">AI Response:</h2>
          <p className="text-gray-600 mt-2">{response}</p>
        </div>
      )}
    </div>
  );
};

export default App;
