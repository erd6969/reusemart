import { useState } from "react";
import ModalDetailRequestDonasi from "./ModalDetailRequestDonasi";
import ModalFormTransaksiDonasi from "./ModalFormTransaksiDonasi";

const ModalRequestWrapper = ({ show, handleClose, dataDetail, onSuccess }) => {
    const [showDetailModal, setShowDetailModal] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);

    const handleOpenForm = () => {
        setShowDetailModal(false);
        setShowFormModal(true);
    };

    const handleBackToDetail = () => {
        setShowFormModal(false);
        setShowDetailModal(true);
    };

    const handleFinalClose = () => {
        setShowFormModal(false);
        setShowDetailModal(false);
        handleClose(); // notify parent
    };

    return (
        <>
            <ModalDetailRequestDonasi
                show={show && showDetailModal}
                handleClose={handleFinalClose}
                dataDetail={dataDetail}
                onSuccess={onSuccess}
                onAccept={handleOpenForm} // tambahan prop untuk buka form
            />
            <ModalFormTransaksiDonasi
                showModalForm={show && showFormModal}
                handleClose={handleBackToDetail}
                id_request_donasi={dataDetail?.id_request_donasi}
            />
        </>
    );
};

export default ModalRequestWrapper;
