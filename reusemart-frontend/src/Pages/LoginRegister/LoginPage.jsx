import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import './LoginPage.css';
import TopsNavbar from "./NavbarLogin.jsx";
import { ShoppingCart } from 'lucide-react';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/pembeli/login', {
                email_pembeli: email,
                password_pembeli: password
            });

            console.log('Login berhasil:', response.data);
            navigate('/HomePage');
        } catch (error) {
            console.error('Login gagal:', error.response?.data || error.message);
        }
    };

    return (
        <div>
            <TopsNavbar />
            <div className="login-wrapper">
                <Card className="p-3 login-welcome" style={{ backgroundColor: '#347928', border: 'none' }}>
                    <p className='login-welcome-text'>Welcome To</p>
                    <p className='login-logo'>ReuseMart<ShoppingCart size={60} /></p>
                    <p className='login-logo2'>Hemat Cerdas, Pilih ReuseMart.</p>
                </Card>

                <Card className="p-4.5 login-form-option">
                    <h2 className='login-title'>LOGIN</h2>
                    <p className='loginText'>Welcome Back</p>
                    <Form onSubmit={handleLogin} style={{ width: '100%' }}>
                        <Form.Group className="mb-3" style={{ width: '100%' }}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" style={{ width: '100%' }}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <p className='forpas'>Forgot Password?</p>

                        <div className='buttonGroup'>
                            <Button className="tombol" type="submit" variant="warning"><p>Login</p></Button>
                        </div>
                    </Form>
                    <br />
                    <p>Don't have an account?</p>
                    <Button className="tombol" variant="warning" onClick={() => navigate("/auth/register-option")}><p>Register</p></Button>
                </Card>
            </div>
        </div>
    );
}

export default LoginPage;
