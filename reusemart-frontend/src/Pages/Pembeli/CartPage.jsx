import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import gambarBarang from "../../assets/images/CinaBekas2.jpg";
import gambarToko from "../../assets/images/BurniceKicil.jpg";
import "./CartPage.css";

import { ShowCart, DeleteCartItem } from "../../api/apiKeranjang";

const CartPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    const fetchCartData = async () => {
        setIsLoading(true);
        try {
            const response = await ShowCart();
            setCartItems(response); // karena ShowCart sudah return response.data
        } catch (error) {
            console.error("Error fetching cart data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const handleDeleteItem = async (id_keranjang) => {
        if (window.confirm("Are you sure you want to delete this item from the cart?")) {
            try {
                await DeleteCartItem(id_keranjang);
                fetchCartData();
            } catch (error) {
                console.error("Error deleting cart item:", error);
            }
        }
    }

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
                        <div key={toko.id_penitip}>
                            <Row className="toko-header">
                                <Col xs={12} className="d-flex align-items-center">
                                    <img src={gambarToko} alt="Toko" className="toko-icon" />
                                    <b>{toko.nama_penitip}</b>
                                </Col>
                            </Row>

                            {toko.barang.map((item, itemIndex) => (
                                <div key={item.id_barang}>
                                    <Row className="table-row align-items-center d-none d-md-flex">
                                        <Col md={6} className="product-info d-flex align-items-center">
                                            <img src={item.gambar_barang || gambarBarang} alt={item.nama_barang} className="product-img" />
                                            <span className="product-name">{item.nama_barang}</span>
                                        </Col>
                                        <Col md={2} className="text-center">Rp{item.harga_barang?.toLocaleString('id-ID')}</Col>
                                        <Col md={2} className="text-center">{item.quantity || 1}</Col>
                                        <Col md={2} className="text-center">
                                            <Button
                                                variant="link"
                                                className="delete-btn"
                                                onClick={() => handleDeleteItem(item.id_keranjang)}
                                            >
                                                <FaTrash style={{ color: "red" }} />
                                            </Button>
                                        </Col>
                                    </Row>

                                    {/* Mobile view */}
                                    <Row className="table-row align-items-center d-flex d-md-none">
                                        <Col xs={12} className="product-info-mobile">
                                            <div className="d-flex align-items-center mb-2">
                                                <img src={item.gambar_barang || gambarBarang} alt={item.nama_barang} className="product-img" />
                                                <div className="ms-3">
                                                    <div className="product-name">{item.nama_barang}</div>
                                                    <div className="d-flex justify-content-between mt-2">
                                                        <div>Rp{item.harga_barang?.toLocaleString('id-ID')}</div>
                                                        <div style={{ marginLeft: "10px" }}>Qty: {item.quantity || 1}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <Button
                                                    variant="link"
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteItem(item.id_keranjang)}
                                                >
                                                    <FaTrash style={{ color: "red" }} />
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Total & actions */}
                    <Row className="total-bill-row">
                        <Col xs={12} className="total-bill">
                            <p>Total Bill : <span className="points">(+127 Points)</span> <b>Rp0</b></p>
                        </Col>
                    </Row>

                    <div className="cart-actions-container">
                        <Row className="cart-actions">
                            <Col xs={12} className="cart-buttons">
                                <Button className="delete-cart me-2 mb-2 mb-md-0" ><b>Delete Cart</b></Button>
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
