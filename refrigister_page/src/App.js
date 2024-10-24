import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Login from './components/login/Login';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddFood from './components/Addfood';
function App() {

  return (
    <BrowserRouter>
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/AddFood" element={<AddFood />} />
        </Routes>
      </header>
    </div>

    </BrowserRouter>
    

 );
}

export default App;
 