import React from 'react';
import './App.css';
import {Routes,Route} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
function App() {
  return (
   <div className='App'>
   <Routes>
    <Route exact path="/" element={<HomePage/>}/>
    <Route path="/chat" element={<ChatPage/>} />
   </Routes>
   </div>
  );
}

export default App;
