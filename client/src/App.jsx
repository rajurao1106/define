import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Homepage from './Homepage'
import MeaningYourName from './MeaningTourName'
import TalkToGirlfriend from './TalkToGirlfriend'

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/Explore-the-Deeper-Meaning" element={<MeaningYourName/>}/>
          <Route path="/Talk-To-Girlfriend" element={<TalkToGirlfriend/>}/>
        </Routes>
      </Router>
    </div>
  )
}
