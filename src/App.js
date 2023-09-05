import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import { Routes, Route} from "react-router-dom";
import Authenticate from "./components/Authenticate";
import ChatRooms from "./components/ChatRooms";
import ChatRoom from "./components/ChatRoom";
import CreateChatRoom from "./components/CreateChatRoom";
import Logout from "./components/Logout";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import MyChatRooms from "./components/MyChatRooms";

function App() {

  return (
    <div className="App">
      

        {/* If user is not authenticated only show the main page and the authenticate feature */}
        <Routes>
          <Route element={<Home />}>
            <Route path="/" element={<Authenticate />} />
            <Route path="/login" element={<Authenticate />} />
          </Route>

          {/* authenticated routes */}
          <Route path="/home/" element={<Dashboard />}>
            <Route path = "" element = {<ChatRooms />}/>
            <Route path="logout" element={<Logout />} />
            <Route path="chatrooms" element={<ChatRooms />} />
            <Route path="createroom" element={<CreateChatRoom />} />
            <Route path="room/:slug" element={<ChatRoom />} />
            <Route path = 'mychatrooms' element = {<MyChatRooms />} />
          </Route>
        </Routes>
      
    </div>
  );
}

export default App;
