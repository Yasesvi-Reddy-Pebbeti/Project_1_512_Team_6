import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes , Route } from 'react-router-dom'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import Messages from './Pages/Messages/messages'
import './App.css'

function App() {
  const [user_id, setUser_id] = useState();

  return (
    <div className=' h-[100vh] flex w-[100vw] flex-col items-center'>
      <Routes>
        <Route path='/messages' element={<Messages id={user_id} setId={setUser_id}/>}/>
        <Route path="/register" element={<Register id={user_id} setId={setUser_id}/>}/>
        <Route path="/login" element={<Login id={user_id} setId={setUser_id}/>}/>
      </Routes>
    </div>
  )
}

export default App
