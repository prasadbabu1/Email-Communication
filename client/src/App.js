import { Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import CommunicationHistory from './components/CommunicationHistory';
import ComposeEmail from './components/ComposeEmail';
 

 

function App() {
 
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/profile' element={<Dashboard/>}>
      <Route index element={<CommunicationHistory/>}/>
      <Route path='sent' element={<ComposeEmail/>}/>       
      </Route>
     
    </Routes>

       
    </div>
    
  );
}

export default App;
