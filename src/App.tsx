import Search from './components/Search';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/" element={<Welcome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
