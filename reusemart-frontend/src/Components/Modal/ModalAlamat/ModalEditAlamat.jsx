import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import InputColumn from "../../InputColumn";
import { EditAlamat } from '../../../api/apiAlamat';
import "./ModalAlamat.css";
import { GetKabupaten, GetKecamatan, GetKelurahan } from '../../../api/apiAlamat';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const ModalEditAlamat = ({ show, handleClose, dataEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_alamat: '',
    alamat: '',
    keterangan: '',
    kecamatan: '',
    kabupaten: '',
    kelurahan: '',
    kode_pos: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedKelurahan, setSelectedKelurahan] = useState('');
  const [selectedOldAlamat, setSelectedOldAlamat] = useState([
    '',
    '',
    ''
  ]);

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

  useEffect(() => {
    getKabupaten();
  }, []);

  useEffect(() => {
    if (dataEdit) {
      setFormData({
        nama_alamat: dataEdit.nama_alamat || '',
        alamat: dataEdit.alamat || '',
        keterangan: dataEdit.keterangan || '',
        kecamatan: dataEdit.kecamatan || '',
        kabupaten: dataEdit.kabupaten || '',
        kelurahan: dataEdit.kelurahan || '',
        kode_pos: dataEdit.kode_pos || '',
        alamat_utama: dataEdit.alamat_utama || false,
      });
      setSelectedOldAlamat([
        dataEdit.kabupaten || '',
        dataEdit.kecamatan || '',
        dataEdit.kelurahan || ''
      ]);
      setSelectedKabupaten('');
      setSelectedKecamatan('');
      setSelectedKelurahan('');
    }
  }, [dataEdit]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (dataEdit && dataEdit.id_alamat) {
        await EditAlamat(dataEdit.id_alamat, formData);
        onSuccess?.();
        handleClose();
      } else {
        console.log("Data edit tidak ditemukan.");
      }
    } catch (error) {
      console.error("Gagal menyimpan alamat:", error.response?.data || error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal-width">
      <Modal.Header closeButton>
        <Modal.Title><b>Edit Alamat</b></Modal.Title>
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

          <InputColumn
            nameLabel="kabupaten"
            contentLabel="Kabupaten Sebelumnya"
            typeInput="text"
            idInput="kabupaten"
            placeholderInput="Masukkan kabupaten..."
            value={selectedOldAlamat[0]}
            disabled="true"
          />

          <InputColumn
            nameLabel="kecamatan"
            contentLabel="Kecamatan Sebelumnya"
            typeInput="text"
            idInput="kecamatan"
            placeholderInput="Masukkan kecamatan..."
            value={selectedOldAlamat[1]}
            disabled="true"
          />
          
          <InputColumn
            nameLabel="kelurahan"
            contentLabel="Kelurahan Sebelumnya"
            typeInput="text"
            idInput="kelurahan"
            placeholderInput="Masukkan kelurahan..."
            value={selectedOldAlamat[2]}
            disabled="true"
          />

          <div className="input-data">
            <label htmlFor="dropdown-basic-button">Kabupaten Baru</label>
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
              <label htmlFor="dropdown-basic-button">Kecamatan Baru</label>
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
              <label htmlFor="dropdown-basic-button">Kelurahan Baru</label>
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
          <Button className="btn-submit" type="submit">
            <b>Edit Alamat</b>
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalEditAlamat;
