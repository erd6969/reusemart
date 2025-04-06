import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import gambarBarang from "../../assets/images/CinaBekas2.jpg";
import gambarToko from "../../assets/images/BurniceKicil.jpg";
import "./CartPage.css";

const CartPage = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([{
        toko: "Cahaya Design",
        items: [
            { id: 1, nama: "Cina bekas 2", harga: 1200000, quantity: 1, gambar: gambarBarang },
            { id: 2, nama: "Hog Rider Solo", harga: 69000, quantity: 1, gambar: gambarBarang },
        ],
    },
    {
        toko: "Monster Melvern",
        items: [{ id: 3, nama: "Kobo Batang", harga: 1000, quantity: 1, gambar: gambarBarang }],
    },
    ]);

    const handleRemoveItem = (tokoIndex, itemIndex) => {
        const updatedCart = [...cartItems];
        updatedCart[tokoIndex].items.splice(itemIndex, 1);
        if (updatedCart[tokoIndex].items.length === 0) {
            updatedCart.splice(tokoIndex, 1);
        }
        setCartItems(updatedCart);
    };

    const totalHarga = cartItems.reduce(
        (acc, toko) => acc + toko.items.reduce((sum, item) => sum + item.harga * item.quantity, 0),0
    );

    return (
    <Container fluid className="cart-page">
        <h1 className="cart-title">CART</h1>
        <div className="cart-content">
            <div className="cart-container mx-auto">
                <Row className="table-header d-none d-md-flex">
                    <Col md={6}>Product</Col>
                    <Col md={2} className="text-center">Price</Col>
                    <Col md={2} className="text-center">Quantity</Col>
                    <Col md={2} className="text-center">Action</Col>
                </Row>

                {cartItems.map((toko, tokoIndex) => (
                    <div key={tokoIndex}>
                    <Row className="toko-header">
                        <Col xs={12} className="d-flex align-items-center">
                        <img src={gambarToko} alt="Toko" className="toko-icon" />
                        <b>{toko.toko}</b>
                        </Col>
                    </Row>

                    {toko.items.map((item, itemIndex) => (
                        <div key={item.id}>
                            <Row className="table-row align-items-center d-none d-md-flex">
                                <Col md={6} className="product-info d-flex align-items-center">
                                    <img src={item.gambar} alt={item.nama} className="product-img" />
                                    <span className="product-name">{item.nama}</span>
                                </Col>
                                <Col md={2} className="text-center">Rp{item.harga.toLocaleString()}</Col>
                                <Col md={2} className="text-center">{item.quantity}</Col>
                                <Col md={2} className="text-center">
                                    <Button variant="link" className="delete-btn" onClick={() => handleRemoveItem(tokoIndex, itemIndex)}>
                                    <FaTrash style={{ color: "red" }} />
                                    </Button>
                                </Col>
                            </Row>

                            <Row className="table-row align-items-center d-flex d-md-none">
                                <Col xs={12} className="product-info-mobile">
                                    <div className="d-flex align-items-center mb-2">
                                        <img src={item.gambar} alt={item.nama} className="product-img" />
                                        <div className="ms-3">
                                            <div className="product-name">{item.nama}</div>
                                            <div className="d-flex justify-content-between mt-2">
                                                <div>Rp{item.harga.toLocaleString()}</div>
                                                <div style={{marginLeft:"10px"}}>Qty: {item.quantity}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <Button variant="link" className="delete-btn" onClick={() => handleRemoveItem(tokoIndex, itemIndex)}>
                                            <FaTrash style={{ color: "red" }} /> Remove
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    ))}
                    </div>
                ))}

                <Row className="total-bill-row">
                    <Col xs={12} className="total-bill">
                        <p>Total Bill : <span className="points">(+127 Points)</span> <b>Rp{totalHarga.toLocaleString('id-ID')}</b></p>
                    </Col>
                </Row>

                <div className="cart-actions-container">
                    <Row className="cart-actions">
                        <Col xs={12} className="cart-buttons">
                            <Button className="delete-cart me-2 mb-2 mb-md-0"><b>Delete Cart</b></Button>
                            <Button className="checkout" onClick={() => navigate("/pembeli/checkout")}><b>Checkout</b></Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    </Container>
  );
};

export default CartPage;