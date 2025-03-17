import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./Pages/Home/Home";
import EventForm from './Pages/EventForm/EventForm'
import PreviewPage from './Pages/Preview/PreviewPage';
import CelebrationForm from './Pages/EventForm/CelebrationForm';

function App() {
  const [count, setCount] = useState(0)

    return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/design-invitation" element={<EventForm />} />
        <Route path="/celebration-form" element={<CelebrationForm />} />
      </Routes>
    </Router>
  );
}

export default App
