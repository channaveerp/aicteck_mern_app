import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Dashboard';
import Mycontent from './Pages/Mycontent';
import Template from './Pages/Template';
import Playlist from './Pages/Playlist';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <div className='grid-container'>
      {/* navbar */}

      <Navbar />

      {/* sidebar */}
      <div className=' side'>
        <Sidebar />
      </div>
      {/* content */}
      <div className='content'>
        <Routes>
          <Route element={<Dashboard />} path='/' />
          <Route element={<Mycontent />} path='/content/my-content' />
          <Route element={<Template />} path='/content/templates' />
          <Route element={<Playlist />} path='/content/playlist' />
        </Routes>
      </div>
    </div>
  );
}

export default App;
