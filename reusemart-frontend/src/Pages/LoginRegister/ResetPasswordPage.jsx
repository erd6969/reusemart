import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { ShoppingCart } from 'lucide-react';
import './VerifyEmailPage.css';
import { ResetPassword } from '../../api/apiAuth';

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) setToken(tokenFromUrl);
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await ResetPassword({
                token,
                password,
                password_confirmation: confirmPassword,
            });

            setMessage('Password berhasil diperbarui.');
            setTimeout(() => navigate('/auth/login'), 2000);
        } catch (err) {
            if (err?.message) {
                setError(err.message);
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError('Terjadi kesalahan saat mengubah password.');
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
                    <h2 className='login-title'>RESET PASSWORD</h2>

                    <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Password Baru</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-input"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Konfirmasi Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="form-input"
                            />
                        </Form.Group>

                        <br />
                        <div className='buttonGroup'>
                            <Button className="tombol" type="submit" variant="warning" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : <p>Update Password</p>}
                            </Button>
                        </div>

                        {message && (
                            <div style={{ width: '100%' }}>
                                <p className="text-success">{message}</p>
                            </div>
                        )}
                        {error && (
                            <div style={{ width: '100%' }}>
                                <p className="text-danger">{error}</p>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
