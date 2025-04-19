import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginRegister/LoginPage';
import HomePage from './Homepage/Homepage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/HomePage" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;