import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, MessageCircleHeart } from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Fun & Meaningful Experiences</span>
        </h1>

        <div className="space-y-4">
          <Link
            to="/Explore-the-Deeper-Meaning"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
          >
            <Sparkles className="h-5 w-5" />
            Explore the Deeper Meaning of Your Name
          </Link>

          <Link
            to="/Talk-To-Girlfriend"
            className="flex items-center justify-center gap-3 bg-white border-2 border-purple-500 text-purple-600 py-3 px-6 rounded-xl font-medium shadow-md transition-all duration-200 transform hover:bg-purple-600 hover:text-white hover:scale-105 hover:shadow-xl"
          >
            <MessageCircleHeart className="h-5 w-5" />
            Talk To Girlfriend
          </Link>
        </div>
      </div>
    </div>
  );
}
