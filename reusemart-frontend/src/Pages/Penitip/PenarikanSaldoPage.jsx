import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import "./PenarikanSaldoPage.css";
import FotoPenitip from "../../Components/Penitip/FotoPenitip";
import InputColumn from "../../Components/InputColumn";
import { ShowProfilePenitip } from "../../api/apiPenitip";
import { FaMedal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { PenarikanSaldoPenitip } from "../../api/apiPenitip";
import { Button } from "react-bootstrap";

const PenarikanSaldo = () => {
    const [penitip, setPenitip] = useState(null);
    const [formData, setFormData] = useState({
        nominal_tarik: 0
    });
    const [biayaPenarikan, setBiayaPenarikan] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ShowProfilePenitip();
                setPenitip(data);
            } catch (error) {
                console.error("Gagal mengambil data penitip:", error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;
        const newValue = type === 'file' ? files[0] : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nominal_tarik || formData.nominal_tarik <= 0) {
            alert("Nominal tarik harus lebih dari 0");
            return;
        }

        if (formData.nominal_tarik > penitip.saldo) {
            alert("Nominal tarik tidak boleh lebih besar dari saldo penitip");
            return;
        }

        if (penitip.saldo - formData.nominal_tarik - (formData.nominal_tarik * 0.05) < 0) {
            alert("Saldo penitip tidak mencukupi untuk melakukan penarikan, jika ingin menarik semua, disarankan memasukkan " + (penitip.saldo - (penitip.saldo * 0.05)).toLocaleString('id-ID'));
            return;
        }

        const isConfirmed = confirm(
            "Apakah Anda yakin ingin menarik saldo sebesar Rp" +
            (formData.nominal_tarik).toLocaleString('id-ID') +
            "? Biaya Penarikan: " +
            (formData.nominal_tarik * 0.05).toLocaleString('id-ID') +
            ", sisa saldo anda setelah penarikan adalah " +
            (penitip.saldo - formData.nominal_tarik - (formData.nominal_tarik * 0.05)).toLocaleString('id-ID')
        );
        if (!isConfirmed) return;

        try {

            setIsSubmitting(true);

            const formDataToSend = new FormData();
            formDataToSend.append('nominal_tarik', formData.nominal_tarik);

            await PenarikanSaldoPenitip(formDataToSend);
            window.location.reload();
            toast.success("Penarikan saldo berhasil");
        } catch (error) {
            console.error('Error:', {
                message: error.message,
                response: error.response?.data
            });
            toast.error(error.response?.data?.message || "Gagal menambahkan penitip");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Container className="penitip-container">
                <div className="profile-penitip-header">
                    <h1><b>Penarikan saldo</b></h1>
                    <hr />
                </div>

                {!penitip ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (

                    <Container className="input-container">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">

                            <InputColumn
                                nameLabel="id_penitip"
                                contentLabel="ID Penitip"
                                typeInput="text"
                                idInput="id_penitip"
                                placeholderInput={penitip.id_penitip}
                                disabled
                            />

                            <InputColumn
                                nameLabel="fullName"
                                contentLabel="Nama Lengkap"
                                typeInput="text"
                                idInput="name"
                                placeholderInput={penitip.nama_penitip}
                                disabled
                            />

                            <InputColumn
                                nameLabel="email"
                                contentLabel="Email"
                                typeInput="email"
                                idInput="email"
                                placeholderInput={penitip.email_penitip}
                                disabled
                            />

                            <InputColumn
                                nameLabel="saldo"
                                contentLabel="Saldo"
                                typeInput="text"
                                idInput="saldo"
                                placeholderInput={`Rp ${penitip.saldo.toLocaleString('id-ID')}`}
                                disabled
                            />

                            <InputColumn
                                nameLabel="saldoMax"
                                contentLabel="Saldo Maksimal Untuk Penarikan"
                                typeInput="text"
                                idInput="saldoMax"
                                placeholderInput={`Rp ${(penitip.saldo - (penitip.saldo * 0.05))}`}
                                disabled
                            />

                            <InputColumn
                                nameLabel="nominal_tarik"
                                contentLabel="Nominal Tarik"
                                typeInput="number"
                                idInput="nominal_tarik"
                                placeholderInput="Masukkan Nominal Tarik..."
                                value={formData.nominal_tarik}
                                onChange={handleChange}
                            />

                            <Button variant="primary" type="submit">Tarik Saldo</Button>
                        </form>
                    </Container>
                )}
            </Container>
            <br />
        </>
    );
};


export default PenarikanSaldo;