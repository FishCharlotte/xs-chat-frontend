import { Routes, Route } from "react-router-dom";
import Login from 'pages/login'
import Chat from "./pages/chat";
// import { useSelector } from "react-redux";

import './App.css'


function App() {
    // const isLoggedIn = useSelector((state) => state.isLoggedIn);
  return (
      <div className="container select-none flex justify-center items-center">
          <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={<Chat />} />
          </Routes>
      </div>

  );
}

export default App;
