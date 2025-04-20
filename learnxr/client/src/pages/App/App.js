import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/Header/Header.jsx";
import Landing from "../Landing/Landing.jsx";

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/')
    .then(res => setMessage(res.data.msg))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <Header />
      <h1>{message}</h1>
      <Landing />
    </div>
  );
};

