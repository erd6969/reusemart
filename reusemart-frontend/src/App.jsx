import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './Pages/LoginRegister/LoginPage';
import OwnerPage from './Pages/Owner/OwnerPage';
import HomePage from './Homepage/Homepage';

function App() {
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        const storedUser = localStorage.getItem("user");

        if (storedRole && storedUser) {
            setRole(storedRole);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/HomePage" element={<HomePage />} />
                <Route path="/owner" element={<OwnerPage />} />
            </Routes>
        </Router>
    );
}

export default App;