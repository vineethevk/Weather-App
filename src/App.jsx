import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from "axios"
import { Home } from './components/Home';


function App() {

  return (
    <div className="App">
      <Home />
    </div>
  )
}

export default App
