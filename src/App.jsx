import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useState } from "react";
 
function App() {
  const [user, setUser] = useState(null);
  const [pass, setPass] = useState(null);
  const [mail, setMail] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user}/>} />
        <Route path="/login" element={<Login setUser={setUser} setPass={setPass} setMail={setMail}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;