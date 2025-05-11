import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button} from 'react-bootstrap';
import './RegisterBuyerPage.css';
import InputColumn from "../../Components/InputColumn";
import { ShoppingCart } from 'lucide-react';

import { toast } from 'react-toastify';
import { RegisterOrganisasi } from '../../api/apiOrganisasi.jsx';

function RegisterOrganisasiPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nama_organisasi: '',
        email_organisasi: '',
        password_organisasi: '',
        konfirmasi_password_organisasi: '',
        nomor_telepon_organisasi: '',
        alamat_organisasi: ''
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
            const response = await RegisterOrganisasi(formData);
            console.log('Response:', response);
    
            toast.success("Register berhasil");
            navigate("/auth/login");
    
            // Reset form
            setFormData({
                nama_organisasi: '',
                email_organisasi: '',
                password_organisasi: '',
                konfirmasi_password_organisasi: '',
                nomor_telepon_organisasi: '',
                alamat_organisasi: ''
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
                    <h4 className='sub-register-title'>Sebagai Organisasi</h4>
                    <div className='input-register-pembeli-container'>
                        <form className='input-register-pembeli' onSubmit={handleSubmit}>
                        <InputColumn 
                            nameLabel="nama_organisasi"
                            contentLabel="Nama Organisasi"
                            typeInput="text"
                            idInput="nama_organisasi"
                            placeholderInput="Masukkan Nama Organisasi..."
                            value={formData.nama_organisasi}
                            onChange={handleChange}
                        />
                        <InputColumn 
                            nameLabel="email_organisasi"
                            contentLabel="Email"
                            typeInput="email"
                            idInput="email_organisasi"
                            placeholderInput="Masukkan Email Organisasi..."
                            value={formData.email_organisasi}
                            onChange={handleChange}
                        />
                        <InputColumn 
                            nameLabel="password_organisasi"
                            contentLabel="Password"
                            typeInput="password"
                            idInput="password_organisasi"
                            placeholderInput="Masukkan Password..."
                            value={formData.password_organisasi}
                            onChange={handleChange}
                        />
                        <InputColumn 
                            nameLabel="konfirmasi_password_organisasi"
                            contentLabel="Konfirmasi Password"
                            typeInput="password"
                            idInput="konfirmasi_password_organisasi"
                            placeholderInput="Konfirmasi Password..."
                            value={formData.konfirmasi_password_organisasi}
                            onChange={handleChange}
                        />
                        <InputColumn 
                            nameLabel="nomor_telepon_organisasi"
                            contentLabel="Nomor Telepon"
                            typeInput="text"
                            idInput="nomor_telepon_organisasi"
                            placeholderInput="Masukkan Nomor Telepon..."
                            value={formData.nomor_telepon_organisasi}
                            onChange={handleChange}
                        />
                        <InputColumn 
                            nameLabel="alamat_organisasi"
                            contentLabel="Alamat"
                            typeInput="text"
                            idInput="alamat_organisasi"
                            placeholderInput="Masukkan Alamat Organisasi..."
                            value={formData.alamat_organisasi}
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

export default RegisterOrganisasiPage;
