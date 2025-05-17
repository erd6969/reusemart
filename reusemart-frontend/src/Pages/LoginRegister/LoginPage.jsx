import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import './LoginPage.css';
import { ShoppingCart } from 'lucide-react';
import { Login } from '../../api/apiAuth';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await Login({ email, password });

            const { role } = data;

            if (role === "penitip") {
                navigate("/penitip/profile");
            } else if (role === "pembeli") {
                navigate("/pembeli/shop");
            } else if (role === "owner") {
                navigate("/owner/req-donasi");
            } else if (role === "gudang") {
                navigate("/pegawai-gudang/penitipan-barang");
            } else if (role === "admin") {
                navigate("/admin/admin-organisasi-master");
            } else if (role === "cs") {
                navigate("/customerservice/penitip-management");
            } else if(role === "organisasi"){
                navigate("/organisasi/request-donasi")
            } else {
                alert("Role tidak dikenali.");
            }
        } catch (error) {
            if (error.type === "validation") {
                setError("Periksa input Anda.");
            } else {
                setError(error.message || "Login gagal.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="login-wrapper">
                <Card className="p-3 login-welcome" style={{ backgroundColor: '#347928', border: 'none' }}>
                    <p className='login-welcome-text'>Welcome To</p>
                    <p className='login-logo'>ReuseMart<ShoppingCart size={60} /></p>
                    <p className='login-logo2'>Hemat Cerdas, Pilih ReuseMart.</p>
                </Card>

                <Card className="p-4.5 login-form-option">
                    <h2 className='login-title'>LOGIN</h2>
                    <p className='loginText'>Welcome Back</p>

                    {error && <p className="text-danger">{error}</p>}

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

                        <p className='forpas' onClick={() => navigate("/auth/forgot-password")}>Forgot Password?</p>

                        <div className='buttonGroup'>
                            <Button className="tombol" type="submit" variant="warning" disabled={loading}>
                                {loading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    <p>Login</p>
                                )}
                            </Button>
                        </div>
                    </Form>
                    <br />
                    <p>Don't have an account?</p>
                    <Button className="tombol" variant="warning" onClick={() => navigate("/auth/register-option")}>
                        <p>Register</p>
                    </Button>
                </Card>
            </div>
        </div>
    );
}

export default LoginPage;
