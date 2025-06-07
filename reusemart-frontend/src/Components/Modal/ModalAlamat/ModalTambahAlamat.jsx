import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import InputColumn from "../../InputColumn";
import { AddAlamat } from '../../../api/apiAlamat';
import { GetKabupaten, GetKecamatan, GetKelurahan } from '../../../api/apiAlamat';
import { toast } from 'react-toastify';
import "./ModalAlamat.css";
import { useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const ModalTambahAlamat = ({ show, handleClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_alamat: '',
    alamat: '',
    keterangan: '',
    kecamatan: '',
    kabupaten: '',
    kelurahan: '',
    kode_pos: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedKelurahan, setSelectedKelurahan] = useState('');

  useEffect(() => {
    getKabupaten();
  }, []);

  const getKabupaten = async () => {
    try {
      const response = await GetKabupaten();
      console.log('Kabupaten:', response);
      setKabupatenList(response);
    } catch (error) {
      console.error('Error fetching kabupaten:', error);
      toast.error("Gagal memuat daftar kabupaten");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} diubah menjadi:`, value);

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Data yang akan dikirim:', formData);

    try {
      setIsSubmitting(true);
      const response = await AddAlamat(formData);
      console.log('Response:', response);

      toast.success("Alamat berhasil ditambahkan");
      onSuccess?.();
      handleClose();

      // Reset form
      setFormData({
        nama_alamat: '',
        alamat: '',
        keterangan: '',
        kecamatan: '',
        kabupaten: '',
        kelurahan: '',
        kode_pos: ''
      });
    } catch (error) {
      console.error('Error:', {
        message: error.message,
        response: error.response?.data
      });
      toast.error(error.response?.data?.message || "Gagal menambahkan alamat");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleKabupatenSelect = async (kabupaten) => {
    setSelectedKabupaten(kabupaten.name);
    setFormData(prev => ({
      ...prev,
      kabupaten: kabupaten.name
    }));

    try {
      const response = await GetKecamatan(kabupaten.id);
      console.log('Kecamatan:', response);
      setKecamatanList(response);
      setSelectedKecamatan('');
      setSelectedKelurahan('');
      setFormData(prev => ({
        ...prev,
        kecamatan: '',
        kelurahan: ''
      }));
    } catch (error) {
      console.error('Error fetching kecamatan:', error);
      toast.error("Gagal memuat daftar kecamatan");
    }
  }

  const handleKecamatanSelect = async (kecamatan) => {
    setSelectedKecamatan(kecamatan.name);
    setFormData(prev => ({
      ...prev,
      kecamatan: kecamatan.name
    }));
    try {
      const response = await GetKelurahan(kecamatan.id);
      console.log('Kelurahan:', response);
      setKelurahanList(response);
      setSelectedKelurahan('');
      setFormData(prev => ({
        ...prev,
        kelurahan: ''
      }));
    } catch (error) {
      console.error('Error fetching kelurahan:', error);
      toast.error("Gagal memuat daftar kelurahan");
    }
  }

  const handleKelurahanSelect = (kelurahan) => {
    setSelectedKelurahan(kelurahan.name);
    setFormData(prev => ({
      ...prev,
      kelurahan: kelurahan.name
    }));
    console.log('Kelurahan yang dipilih:', kelurahan.name);
  }

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title><b>Tambah Alamat</b></Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <InputColumn
            nameLabel="nama_alamat"
            contentLabel="Nama Alamat"
            typeInput="text"
            idInput="nama_alamat"
            placeholderInput="Masukkan Nama Alamat..."
            value={formData.nama_alamat}
            onChange={handleChange}
          />

          <InputColumn
            nameLabel="alamat"
            contentLabel="Alamat"
            typeInput="text"
            idInput="alamat"
            placeholderInput="Masukkan Alamat..."
            value={formData.alamat}
            onChange={handleChange}
          />

          <InputColumn
            nameLabel="keterangan"
            contentLabel="Keterangan"
            typeInput="text"
            idInput="keterangan"
            placeholderInput="Masukkan Keterangan Alamat..."
            value={formData.keterangan}
            onChange={handleChange}
          />

          <div className="input-data">
            <label htmlFor="dropdown-basic-button">Kabupaten</label>
            <DropdownButton
              id="dropdown-basic-button"
              title={selectedKabupaten || "Pilih Kabupaten"}
              className="custom-dropdown"
              variant="light"
            >
              {kabupatenList.map((kabupaten) => (
                <Dropdown.Item
                  key={kabupaten.id}
                  onClick={() => handleKabupatenSelect(kabupaten)}
                >
                  {kabupaten.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>

          {selectedKabupaten && (
            <div className="input-data">
              <label htmlFor="dropdown-basic-button">Kecamatan</label>
              <DropdownButton
                id="dropdown-basic-button"
                title={selectedKecamatan || "Pilih kecamatan"}
                className="custom-dropdown"
                variant="light"
              >
                {kecamatanList.map((kecamatan) => (
                  <Dropdown.Item
                    key={kecamatan.id}
                    onClick={() => handleKecamatanSelect(kecamatan)}
                  >
                    {kecamatan.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          )}

          {selectedKecamatan && (
            <div className="input-data">
              <label htmlFor="dropdown-basic-button">Kelurahan</label>
              <DropdownButton
                id="dropdown-basic-button"
                title={selectedKelurahan || "Pilih Kelurahan"}
                className="custom-dropdown"
                variant="light"
              >
                {kelurahanList.map((kelurahan) => (
                  <Dropdown.Item
                    key={kelurahan.id}
                    onClick={() => handleKelurahanSelect(kelurahan)}
                  >
                    {kelurahan.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          )}

          <InputColumn
            nameLabel="kode_pos"
            contentLabel="Kode Pos"
            typeInput="text"
            idInput="kode_pos"
            placeholderInput="Masukkan Kode Pos..."
            value={formData.kode_pos}
            onChange={handleChange}
          />

          
            

        </Modal.Body>

        <Modal.Footer className="modal-footer">
          <Button className="btn-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : <b>Tambah Alamat</b>}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalTambahAlamat;