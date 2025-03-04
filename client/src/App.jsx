import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Homepage from './Homepage'
import MeaningYourName from './MeaningYourName'
import TalkToGirlfriend from './TalkToGirlfriend'
import TalkToBoyfriend from './TalkToBoyfriend'
import MakeAFriends from './MakeAFriends'

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/Explore-the-Deeper-Meaning" element={<MeaningYourName/>}/>
          <Route path="/Make-A-Friends" element={<MakeAFriends/>}/>
          <Route path="/Talk-To-Girlfriend" element={<TalkToGirlfriend/>}/>
          <Route path="/Talk-To-Boyfriend" element={<TalkToBoyfriend/>}/>
        </Routes>
      </Router>
    </div>
  )
}
