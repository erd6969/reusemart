import { useState } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import './VerifyEmailPage.css';
import { ShoppingCart } from 'lucide-react';
import { sendKonfirmasiEmail } from '../../api/apiAuth';

function VerifyEmailPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Email tidak boleh kosong');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await sendKonfirmasiEmail(email);

            console.log(response);

            if (response.success) {
                setMessage('Email konfirmasi telah dikirim!');
            } else {
                setError('Gagal mengirim email konfirmasi, coba lagi nanti.');
            }
        } catch (err) {
            console.error(err);
            setError('Terjadi kesalahan saat mengirim email konfirmasi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="verify-email-wrapper">
                <Card className="p-3 verify-email-welcome" style={{ backgroundColor: '#347928', border: 'none' }}>
                    <p className='verify-email-welcome-text'>Welcome To</p>
                    <p className='verify-email-logo'>ReuseMart<ShoppingCart size={60} /></p>
                    <p className='verify-email-logo2'>Hemat Cerdas, Pilih ReuseMart.</p>
                </Card>

                <Card className="p-4.5 verify-email-form-option">
                    <h2 className='verify-email-title'>CHANGE PASSWORD</h2>

                    <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Form.Group className="mb-3" style={{ width: '100%' }}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-input"
                            />
                        </Form.Group>
                        <br />
                        <div className='buttonGroup'>
                            <Button className="tombol" type="submit" variant="warning" disabled={loading}>
                                {loading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    <b>Send Email Verification</b>
                                )}
                            </Button>
                        </div>
                        <br />
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

export default VerifyEmailPage;
