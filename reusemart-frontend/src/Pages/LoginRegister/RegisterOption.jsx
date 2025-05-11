import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import './RegisterOption.css';
import { ShoppingCart, Users, User } from 'lucide-react';

const Option = () => {
    const navigate = useNavigate();

    return (
        <div className="register-option-container">
            <div className="register-option-box" onClick={() => navigate('/auth/register-organisasi')}>
                <Users size={70} color="white" />
                <p className="register-option-text"><b>Organisasi</b></p>
            </div>
            <div className="register-option-box" onClick={() => navigate('/auth/register-buyer')}>
                <User size={70} color="white" />
                <p className="register-option-text"><b>Pembeli</b></p>
            </div>
        </div>
    );
};

function RegisterOptionPage() {
    return (
        <div>
                <div className="register-wrapper">
                    <Card className="p-3 register-welcome" style={{ backgroundColor: '#347928', border: 'none' }}>
                        <p className='register-welcome-text'>Welcome To</p>
                        <p className='register-logo'>ReuseMart<ShoppingCart size={60}/></p>
                        <p className='register-logo2'>Hemat Cerdas, Pilih ReuseMart.</p>
                   </Card>

                    <Card className="p-4 register-form-option">
                        <h2 className='register-title'>DAFTAR SEBAGAI</h2>
                        <Option />
                        <p className="register-info">
                            Mau menjadi penjual? <a href="#">Klik disini</a> untuk info lebih lengkap.
                        </p>
                    </Card>
                </div>
        </div>
    );
}

export default RegisterOptionPage;
