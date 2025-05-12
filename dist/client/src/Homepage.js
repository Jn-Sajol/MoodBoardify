"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Homepage;
const react_router_dom_1 = require("react-router-dom");
function Homepage() {
    return (<div className="max-w-6xl mx-auto p-6">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Discover Personalized Recommendations Based on Your Mood!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Whether you're feeling happy, sad, or anything in between, we have the
          perfect music, movies, books, and activities for you!
        </p>
        <react_router_dom_1.Link to="/moods">
          <button className="bg-gradient-to-r from-teal-800 to-teal-600 text-white p-4 rounded-lg cursor-pointer 
  hover:from-blue-400 hover:to-blue-900 ">
            Get Started
          </button>
        </react_router_dom_1.Link>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <FeatureCard icon="🎵" title="Music Suggestions" description="Find the perfect music to match your mood."/>
        <FeatureCard icon="🎬" title="Movie Recommendations" description="Get movie recommendations that fit your vibe."/>
        <FeatureCard icon="📊" title="Mood Statistics" description="Track your moods and see trends over time."/>
      </section>

      {/* Mood Quick Select */}
      <section className="text-center mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What are you feeling today?
        </h2>
        <div className="flex justify-center gap-4">
          <MoodButton mood="Happy"/>
          <MoodButton mood="Sad"/>
          <MoodButton mood="Energetic"/>
          <MoodButton mood="Relaxed"/>
        </div>
      </section>

      {/* Fun Mood Fact */}
      <section className="text-center">
        <p className="text-lg text-gray-600 mb-4">
          Did you know? Listening to upbeat music can improve your mood in just
          15 minutes!
        </p>
      </section>
    </div>);
}
function FeatureCard({ icon, title, description, }) {
    return (<div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>);
}
function MoodButton({ mood }) {
    return (<react_router_dom_1.Link to={`/recommendation?mood=${mood.toLowerCase()}`}>
      <button className="bg-gradient-to-r from-teal-800 to-teal-600 text-white p-4 rounded-lg cursor-pointer 
  hover:from-blue-400 hover:to-blue-900 ">
        {mood}
      </button>
    </react_router_dom_1.Link>);
}
