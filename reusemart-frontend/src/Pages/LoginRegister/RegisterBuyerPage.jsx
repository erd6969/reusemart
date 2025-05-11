import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button} from 'react-bootstrap';
import './RegisterBuyerPage.css';
import InputColumn from "../../Components/InputColumn";
import { ShoppingCart } from 'lucide-react';

import { toast } from 'react-toastify';
import { RegisterPembeli } from '../../api/apiPembeli.jsx';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nama_pembeli: '',
        email_pembeli: '',
        password_pembeli: '',
        konfirmasi_password_pembeli: '',
        nomor_telepon_pembeli: '',
        tanggal_lahir_pembeli: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field ${name} diubah menjadi:`, value);
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Data yang akan dikirim:', formData);
    
        try {
            setIsSubmitting(true);
            const response = await RegisterPembeli(formData);
            console.log('Response:', response);
    
            toast.success("Register berhasil");
            navigate("/auth/login");
    
            // Reset form
            setFormData({
                nama_pembeli: '',
                email_pembeli: '',
                password_pembeli: '',
                konfirmasi_password_pembeli: '',
                nomor_telepon_pembeli: '',
                tanggal_lahir_pembeli: ''
            });
        } catch (error) {
            console.error('Error:', error);
    
            if (error.type === "validation" && error.errors) {
                Object.values(error.errors).forEach((messages) => {
                    messages.forEach((msg) => toast.error(msg));
                });
            } else {
                toast.error(error.message || "Gagal melakukan registrasi");
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    


    return (
        <div>
            <div className="register-wrapper">
                <Card className="p-3 register-welcome" style={{ backgroundColor: '#347928', border: 'none' }}>
                    <p className='register-welcome-text'>Welcome To</p>
                    <p className='register-logo'>ReuseMart<ShoppingCart size={60}/></p>
                    <p className='register-logo2'>Hemat Cerdas, Pilih ReuseMart.</p>
                </Card>

                <Card className="p-4 register-form-pembeli">
                    <p className='register-titles' >PENDAFTARAN</p>
                    <h4 className='sub-register-title'>Sebagai Pembeli</h4>
                    <div className='input-register-pembeli-container'>
                        <form className='input-register-pembeli' onSubmit={handleSubmit}>
                            <InputColumn 
                                nameLabel="nama_pembeli"
                                contentLabel="Nama Pengguna"
                                typeInput="text"
                                idInput="nama_pembeli"
                                placeholderInput="Masukkan Nama..."
                                value={formData.nama_pembeli}
                                onChange={handleChange}
                            />
                            <InputColumn 
                                nameLabel="email_pembeli"
                                contentLabel="Email"
                                typeInput="text"
                                idInput="email_pembeli"
                                placeholderInput="Masukkan Email Pembeli..."
                                value={formData.email_pembeli}
                                onChange={handleChange}
                            />
                            <InputColumn 
                                nameLabel="password_pembeli"
                                contentLabel="Password"
                                typeInput="password"
                                idInput="password_pembeli"
                                placeholderInput="Masukkan Password..."
                                value={formData.password_pembeli}
                                onChange={handleChange}
                            />
                            <InputColumn 
                                nameLabel="konfirmasi_password_pembeli"
                                contentLabel="Konfirmasi_password"
                                typeInput="password"
                                idInput="konfirmasi_password_pembeli"
                                placeholderInput="Konfirmasi Password..."
                                value={formData.konfirmasi_password_pembeli}
                                onChange={handleChange}
                            />
                            <InputColumn 
                                nameLabel="nomor_telepon_pembeli"
                                contentLabel="Nomor_telepon"
                                typeInput="number"
                                idInput="nomor_telepon_pembeli"
                                placeholderInput="Masukkan Nomor Telepon..."
                                value={formData.nomor_telepon_pembeli}
                                onChange={handleChange}
                            />
                            <InputColumn 
                                nameLabel="tanggal_lahir_pembeli"
                                contentLabel="Tanggal_lahir"
                                typeInput="date"
                                idInput="tanggal_lahir_pembeli"
                                placeholderInput="Masukkan Tanggal Lahir..."
                                value={formData.tanggal_lahir_pembeli}
                                onChange={handleChange}
                            />
                            <div className="form-check mt-3">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="termsAndConditions" 
                                    required 
                                />
                                <label className="form-check-label" htmlFor="termsAndConditions">
                                    Saya menyetujui segala <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">kebijakan dan privasi</a>
                                </label>
                            </div>
                            <br />
                            <Button 
                                className="tombol" 
                                variant="warning" 
                                type='submit'
                                disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : <b>Daftar</b>}</Button>
                        </form>
                    </div>
                    
                </Card>
            </div>
        </div>
    );
}

export default RegisterPage;
