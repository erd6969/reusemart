import { getThumbnail } from "../../../api/index";
import { Modal, Container, Button } from "react-bootstrap";
import { useState, useEffect, use } from 'react';
import InputColumn from "../../InputColumn";
import { CreateBarang, EditBarang } from "../../../api/apiBarang";
import { toast } from 'react-toastify';
import { ShowAllJabatan } from "../../../api/apiJabatan";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Spinner } from "react-bootstrap";
import { SearchKategori } from "../../../api/apiKategori";
import { SearchPegawaiByNama } from "../../../api/apiPegawai";
import { SearchHunter } from "../../../api/apiHunter";
import { getThumbnailBarang } from "../../../api/index";

const ModalEditBarang = ({ show, handleClose, onSuccess, dataBarang }) => {
    const [formData, setFormData] = useState({
        nama_barang: '',
        nama_kategori: '',
        harga_barang: 0,
        tanggal_garansi: '',
        kondisi_barang: '',
        deskripsi_barang: '',
        berat_barang: 0,
        foto_barang: '',
        foto_barang2: '',
        foto_barang3: '',
        nama_pegawai: '',
        nama_hunter: '',
        id_barang: 0,
    });


    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState({
        image1: false,
        image2: false,
        image3: false
    });

    const [selectedImage2, setSelectedImage2] = useState(null);
    const [selectedImage3, setSelectedImage3] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [showKategori, setShowKategori] = useState(false);
    const [id_kategori, setIdKategori] = useState(null);
    const [skipKategoriSearch, setSkipKategoriSearch] = useState(true);


    const [pegawaiOptions, setPegawaiOptions] = useState([]);
    const [showPegawai, setShowPegawai] = useState(false);
    const [id_pegawai, setIdPegawai] = useState(null);
    const [skipPegawaiSearch, setSkipPegawaiSearch] = useState(true);

    const [id_hunter, setIdHunter] = useState(null);
    const [hunterOptions, setHunterOptions] = useState([]);
    const [showHunter, setShowHunter] = useState(false);
    const [skipHunterSearch, setSkipHunterSearch] = useState(true);

    useEffect(() => {
        if (dataBarang) {
            setFormData({
                id_barang: dataBarang.barang.id_barang || 0,
                nama_barang: dataBarang.barang.nama_barang || '',
                nama_kategori: dataBarang.barang.kategori.nama_kategori || '',
                harga_barang: dataBarang.barang.harga_barang || 0,
                tanggal_garansi: dataBarang.barang.tanggal_garansi || '',
                kondisi_barang: dataBarang.barang.kondisi_barang || '',
                deskripsi_barang: dataBarang.barang.deskripsi_barang || '',
                berat_barang: dataBarang.barang.berat_barang || 0,
                foto_barang: dataBarang.barang.foto_barang || '',
                foto_barang2: dataBarang.barang.foto_barang2 || '',
                foto_barang3: dataBarang.barang.foto_barang3 || '',
                nama_pegawai: dataBarang.barang.pegawai.nama_pegawai || '',
                nama_hunter: dataBarang.barang.id_hunter == null ? '' : dataBarang.barang.hunter.nama_hunter,
            });
            setSelectedImage(dataBarang.barang.foto_barang);
            setSelectedImage2(dataBarang.barang.foto_barang2);
            setSelectedImage3(dataBarang.barang.foto_barang3);
            setIdKategori(dataBarang.barang.kategori.id_kategori);
            setIdPegawai(dataBarang.barang.pegawai.id_pegawai);
            setIdHunter(dataBarang.barang.id_hunter == null ? null : dataBarang.barang.hunter.id_hunter);
        }
    }, [dataBarang]);

    useEffect(() => {
        let debounceTimer = null;
        if (skipKategoriSearch) {
            return;
        } else {
            const fetchKategoriOptions = async () => {
                if (formData.nama_kategori.length > 2) {

                    try {
                        const response = await SearchKategori(formData.nama_kategori);
                        console.log("Kategori Options:", response);
                        setKategoriOptions(response);
                        setShowKategori(true);
                    } catch (error) {
                        setKategoriOptions([]);
                    }
                } else {
                    setKategoriOptions([]);
                    setShowKategori(false);
                }
            };
            debounceTimer = setTimeout(fetchKategoriOptions, 300);
        }
        return () => clearTimeout(debounceTimer);
    }, [formData.nama_kategori]);

    useEffect(() => {
        let debounceTimer = null;
        if (skipPegawaiSearch) {
            return;
        } else {
            const fetchPegawaiOptions = async () => {
                if (formData.nama_pegawai.length > 2) {

                    try {
                        const response = await SearchPegawaiByNama(formData.nama_pegawai);
                        console.log("Pegawai Options:", response);
                        setPegawaiOptions(response);
                        setShowPegawai(true);
                    } catch (error) {
                        setPegawaiOptions([]);
                    }
                } else {
                    setPegawaiOptions([]);
                    setShowPegawai(false);
                }
            };
            debounceTimer = setTimeout(fetchPegawaiOptions, 300);
        }
        return () => clearTimeout(debounceTimer);
    }, [formData.nama_pegawai]);


    useEffect(() => {
        let debounceTimer = null;
        if (skipHunterSearch) {
            return;
        } else {
            const fetchHunterOptions = async () => {
                if (formData.nama_hunter.length > 2) {

                    try {
                        const response = await SearchHunter(formData.nama_hunter);
                        console.log("Hunter Options:", response);
                        setHunterOptions(response);
                        setShowHunter(true);
                    } catch (error) {
                        setHunterOptions([]);
                    }
                } else {
                    setHunterOptions([]);
                    setShowHunter(false);
                }
            };
            debounceTimer = setTimeout(fetchHunterOptions, 300);
        }
        return () => clearTimeout(debounceTimer);
    }, [formData.nama_hunter]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const fileName = e.target.name;
        if (fileName === "foto_barang") {
            if (file) {
                setSelectedImage(URL.createObjectURL(file)); // Preview image
                setFormData(prev => ({
                    ...prev,
                    [fileName]: file
                }));
                setUploadedImage(prev => ({
                    ...prev,
                    image1: true
                }));
            }
        } else if (fileName === "foto_barang2") {
            if (file) {
                setSelectedImage2(URL.createObjectURL(file)); // Preview image
                setFormData(prev => ({
                    ...prev,
                    [fileName]: file
                }));
                setUploadedImage(prev => ({
                    ...prev,
                    image2: true
                }));
            }
        } else if (fileName === "foto_barang3") {
            if (file) {
                setSelectedImage3(URL.createObjectURL(file)); // Preview image
                setFormData(prev => ({
                    ...prev,
                    [fileName]: file
                }));
                setUploadedImage(prev => ({
                    ...prev,
                    image3: true
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            if (!formData.nama_barang || !formData.nama_kategori || !formData.harga_barang || !formData.tanggal_garansi || !formData.kondisi_barang || !formData.deskripsi_barang || !formData.berat_barang || !formData.nama_pegawai) {
                toast.error("Semua field harus diisi");
                return;
            }

            if (!formData.foto_barang && !formData.foto_barang2) {
                toast.error("Foto Barang 1 atau Foto Barang 2 harus diisi");
                return;
            }

            formDataToSend.append('id_barang', formData.id_barang);
            formDataToSend.append('nama_kategori', formData.nama_kategori);
            formDataToSend.append('nama_barang', formData.nama_barang);
            formDataToSend.append('harga_barang', formData.harga_barang);
            formDataToSend.append('tanggal_garansi', formData.tanggal_garansi);
            formDataToSend.append('kondisi_barang', formData.kondisi_barang);
            formDataToSend.append('deskripsi_barang', formData.deskripsi_barang);
            formDataToSend.append('berat_barang', formData.berat_barang);
            formDataToSend.append('nama_pegawai', formData.nama_pegawai);
            formDataToSend.append('nama_hunter', formData.nama_hunter);
            

            if (formData.foto_barang instanceof File) {
                formDataToSend.append('foto_barang', formData.foto_barang);
            }
            if (formData.foto_barang2 instanceof File) {
                formDataToSend.append('foto_barang2', formData.foto_barang2);
            }
            if (formData.foto_barang3 instanceof File) {
                formDataToSend.append('foto_barang3', formData.foto_barang3);
            }

            await EditBarang(formDataToSend);
            onSuccess?.();
            handleClose();

        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).forEach((messages) => {
                    messages.forEach((msg) => toast.error(msg));
                });
            } else {
                toast.error(error.message || "Gagal melakukan create pegawai");
            }
        }
    };

    const handleKategoriOptions = (kategori, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setSkipKategoriSearch(true);
        setFormData(prev => ({
            ...prev,
            nama_kategori: kategori.nama_kategori
        }));
        setIdKategori(kategori.id_kategori);
        setShowKategori(false);
    };

    const handlePegawaiOptions = (pegawai, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setSkipPegawaiSearch(true);
        setFormData(prev => ({
            ...prev,
            nama_pegawai: pegawai.nama_pegawai
        }));
        setIdPegawai(pegawai.id_pegawai);
        setShowPegawai(false);
    };

    const handleHunterOptions = (hunter, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setSkipHunterSearch(true);
        setFormData(prev => ({
            ...prev,
            nama_hunter: hunter.nama_hunter
        }));
        setIdHunter(hunter.id_hunter);
        setShowHunter(false);
    };



    return (
        <Modal show={show} onHide={handleClose} className="custom-modal-width">
            <Modal.Header closeButton>
                <Modal.Title><b>Edit Barang</b></Modal.Title>
            </Modal.Header>
            {isLoading ? (
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        padding: "20px",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <Spinner
                            as="span"
                            animation="border"
                            variant="primary"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                </div>
            ) : (
                <Container className="modal-body">
                    <form onSubmit={handleSubmit}>

                        <InputColumn
                            nameLabel="nama_barang"
                            contentLabel="Nama Barang"
                            typeInput="text"
                            idInput="nama_barang"
                            placeholderInput="Masukkan Nama Barang..."
                            value={formData.nama_barang}
                            onChange={handleChange}
                        />

                        <InputColumn
                            nameLabel="nama_kategori"
                            contentLabel="Nama Kategori"
                            typeInput="text"
                            idInput="nama_kategori"
                            placeholderInput="Masukkan Nama Kategori..."
                            value={formData.nama_kategori}
                            onChange={handleChange}
                            onFocus={() => {
                                setSkipKategoriSearch(false);
                                setShowKategori(true);
                            }}
                            onBlur={() => {
                                setSkipKategoriSearch(true);
                                setShowKategori(false);
                            }}
                        />
                        {showKategori && kategoriOptions.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                zIndex: 1000,
                                width: '95%',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                {kategoriOptions.map((kategori, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #eee'
                                        }}
                                        onMouseDown={(e) => handleKategoriOptions(kategori, e)}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        {kategori.nama_kategori}
                                    </div>
                                ))}
                            </div>
                        )}

                        <InputColumn
                            nameLabel="harga_barang"
                            contentLabel="Harga Barang"
                            typeInput="number"
                            idInput="harga_barang"
                            placeholderInput="Masukkan Harga Barang..."
                            value={formData.harga_barang}
                            onChange={handleChange}
                        />

                        <InputColumn
                            nameLabel="berat_barang"
                            contentLabel="Berat Barang"
                            typeInput="number"
                            idInput="berat_barang"
                            placeholderInput="Masukkan Berat Barang..."
                            value={formData.berat_barang}
                            onChange={handleChange}
                        />

                        <InputColumn
                            nameLabel="tanggal_garansi"
                            contentLabel="Tanggal Garansi"
                            typeInput="date"
                            idInput="tanggal_garansi"
                            placeholderInput="Masukkan Tanggal Garansi..."
                            value={formData.tanggal_garansi}
                            onChange={handleChange}
                        />

                        <InputColumn
                            nameLabel="kondisi_barang"
                            contentLabel="Kondisi Barang"
                            typeInput="text"
                            idInput="kondisi_barang"
                            placeholderInput="Masukkan Kondisi Barang..."
                            value={formData.kondisi_barang}
                            onChange={handleChange}
                        />

                        <InputColumn
                            nameLabel="deskripsi_barang"
                            contentLabel="Deskripsi Barang"
                            typeInput="textarea"
                            idInput="deskripsi_barang"
                            placeholderInput="Masukkan Deskripsi Barang..."
                            value={formData.deskripsi_barang}
                            onChange={handleChange}
                        />

                        <InputColumn
                            nameLabel="foto_barang"
                            contentLabel="Foto Barang 1"
                            typeInput="file"
                            idInput="foto_barang"
                            placeholderInput="Masukkan Foto Barang 1..."
                            accept="image/*"
                            className="d-none"
                            onChange={handleImageChange}
                        />
                        <div className="image-container text-center">

                            {selectedImage && (
                                <div className="image-preview">
                                    <img
                                        src={uploadedImage.image1 ? selectedImage : getThumbnailBarang(selectedImage)}
                                        alt="Selected"
                                        className="img-thumbnail"
                                        style={{ width: "250px", height: "300px" }}
                                    />
                                </div>
                            )}
                        </div>


                        <InputColumn
                            nameLabel="foto_barang2"
                            contentLabel="Foto Barang 2"
                            typeInput="file"
                            idInput="foto_barang2"
                            placeholderInput="Masukkan Foto Barang 2..."
                            accept="image/*"
                            className="d-none"
                            onChange={handleImageChange}
                        />
                        <div className="image-container text-center">

                            {selectedImage2 && (
                                <div className="image-preview">
                                    <img
                                        src={uploadedImage.image2 ? selectedImage2 : getThumbnailBarang(selectedImage2)}
                                        alt="Selected"
                                        className="img-thumbnail"
                                        style={{ width: "250px", height: "300px" }}
                                    />
                                </div>
                            )}
                        </div>


                        <InputColumn
                            nameLabel="foto_barang3"
                            contentLabel="Foto Barang 3 (Opsional)"
                            typeInput="file"
                            idInput="foto_barang3"
                            placeholderInput="Masukkan Foto Barang 3..."
                            accept="image/*"
                            className="d-none"
                            onChange={handleImageChange}
                        />
                        <div className="image-container text-center">

                            {selectedImage3 && (
                                <div className="image-preview">
                                    <img
                                        src={uploadedImage.image3 ? selectedImage3 : getThumbnailBarang(selectedImage3)}
                                        alt="Selected"
                                        className="img-thumbnail"
                                        style={{ width: "250px", height: "300px" }}
                                    />
                                </div>
                            )}
                        </div>

                        <InputColumn
                            nameLabel="nama_pegawai"
                            contentLabel="Nama Pegawai"
                            typeInput="text"
                            idInput="nama_pegawai"
                            placeholderInput="Masukkan Nama Pegawai..."
                            value={formData.nama_pegawai}
                            onChange={handleChange}
                            onFocus={() => {
                                setSkipPegawaiSearch(false);
                                setShowPegawai(true);
                            }}
                            onBlur={() => {
                                setSkipPegawaiSearch(true);
                                setShowPegawai(false);
                            }}
                        />
                        {showPegawai && pegawaiOptions.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                zIndex: 1000,
                                width: '95%',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                {pegawaiOptions.map((pegawai, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #eee'
                                        }}
                                        onMouseDown={(e) => handlePegawaiOptions(pegawai, e)}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        {pegawai.nama_pegawai}
                                    </div>
                                ))}
                            </div>
                        )}

                        <InputColumn
                            nameLabel="nama_hunter"
                            contentLabel="Nama Hunter (Opsional)"
                            typeInput="text"
                            idInput="nama_hunter"
                            placeholderInput="Masukkan Nama Hunter..."
                            value={formData.nama_hunter}
                            onChange={handleChange}
                            onFocus={() => {
                                setSkipHunterSearch(false);
                                setShowHunter(true);
                            }}
                            onBlur={() => {
                                setSkipHunterSearch(true);
                                setShowHunter(false);
                            }}
                        />
                        {showHunter && hunterOptions.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                zIndex: 1000,
                                width: '95%',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                {hunterOptions.map((hunter, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #eee'
                                        }}
                                        onMouseDown={(e) => handleHunterOptions(hunter, e)}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        {hunter.nama_hunter}
                                    </div>
                                ))}
                            </div>
                        )}


                        <div className="d-flex justify-content-end">
                            <Button
                                variant="primary"
                                type="submit"
                                style={{ backgroundColor: "#347928", border: "none" }}
                            >
                                <b>Simpan Pegawai</b>
                            </Button>
                        </div>
                    </form>

                </Container>
            )}
        </Modal>
    );
};

export default ModalEditBarang;
