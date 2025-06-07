import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import gambarBarang from "../../assets/images/CinaBekas2.jpg";
import "./CartPage.css";

import { ShowCart, DeleteCartItem, CheckCart, DeleteAllCart } from "../../api/apiKeranjang";
import { useCart } from "../../Components/Context/CartContext";
import { getThumbnailBarang, getThumbnailPenitip } from "../../api";
import { toast } from "react-toastify";

const CartPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const { refreshCartCount } = useCart();
    const navigate = useNavigate();

    const fetchCartData = async () => {
        setIsLoading(true);
        try {
            const response = await ShowCart();
            setCartItems(response);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cartCheck();
        fetchCartData();
    }, []);

    const handleDeleteItem = async (id_keranjang) => {
        if (window.confirm("Are you sure you want to delete this item from the cart?")) {
            try {
                await DeleteCartItem(id_keranjang);
                fetchCartData();
                refreshCartCount();
            } catch (error) {
                console.error("Error deleting cart item:", error);
            }
        }
    }

    const handleDeleteAllCart = async () => {
        if (window.confirm("Are you sure you want to delete all items from the cart?")) {
            try {
                await DeleteAllCart();
                fetchCartData();
                refreshCartCount();
            } catch (error) {
                console.error("Error deleting all cart items:", error);
            }
        }
    };

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach((toko) => {
            toko.barang.forEach((item) => {
                const price = item.harga_barang || 0;
                const quantity = item.quantity || 1;
                total += price * quantity;
            });
        });
        return total;
    };

    const calculatePoints = () => {
        const total = calculateTotal();
        let points = Math.floor(total / 10000);
        if (total > 500000) {
            points += Math.floor(points * 0.2);
        }
        return points;
    };

    const cartCheck = async () => {
        try {
            const response = await CheckCart();
            if (response.status === "success") {
                if (response.message.toLowerCase().includes("terjual")) {
                    toast.warning("Barang sudah terjual, silahkan pilih barang lain");
                }
            } else {
                toast.error("Gagal melakukan checkout");
            }
        } catch (error) {
            alert("Terjadi kesalahan saat memeriksa keranjang.");
            console.error(error);
        } finally {
            refreshCartCount();
        }
    };


    const handleCheckout = async () => {
        try {

            if(cartItems.length === 0){
                toast.warning("Keranjang Masih Kosong");
                return;
            }else{
                const response = await CheckCart();

                if (response.status === "success") {
                    if (response.message.toLowerCase().includes("terjual")) {
                        toast.warning("Barang sudah terjual, silahkan pilih barang lain");
                    }else{
                        navigate("/pembeli/checkout");
                    }
                } else {
                    toast.error("Gagal melakukan checkout");
                }
            }
        } catch (error) {
            alert("Terjadi kesalahan saat memeriksa keranjang.");
            console.error(error);
        } finally {
            refreshCartCount();
        }
    };
    
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

                    {cartItems.length === 0 ? (
                        <div className="text-center my-5">
                            <h5>Tidak Ada Barang di dalam Keranjang</h5>
                        </div>
                    ) : (
                        cartItems.map((toko, tokoIndex) => (
                            <div key={toko.id_penitip}>
                                <Row className="toko-header">
                                    <Col xs={12} className="d-flex align-items-center">
                                        <img src={getThumbnailPenitip(toko.foto_penitip)} alt="Toko" className="toko-icon" />
                                        <b>{toko.nama_penitip}</b>
                                    </Col>
                                </Row>

                                {toko.barang.map((item, itemIndex) => (
                                    <div key={item.id_barang}>
                                        <Row className="table-row align-items-center d-none d-md-flex">
                                            <Col md={6} className="product-info d-flex align-items-center">
                                                <img src={getThumbnailBarang(item.foto_barang)} alt={item.nama_barang} className="product-img" />
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
                        ))
                    )}

                    {cartItems.length > 0 && (
                        <Row className="total-bill-row">
                            <Col xs={12} className="total-bill">
                                <p>
                                    Total Bill : <span className="points">(+{calculatePoints()} Points)</span>{" "}
                                    <b>Rp{calculateTotal().toLocaleString('id-ID')}</b>
                                </p>
                            </Col>
                        </Row>
                    )}


                    <div className="cart-actions-container">
                        <Row className="cart-actions">
                            <Col xs={12} className="cart-buttons">
                                <Button 
                                    className="delete-cart me-2 mb-2 mb-md-0"
                                    onClick={() => handleDeleteAllCart()} 
                                >
                                    <b>Delete Cart</b>
                                </Button>
                                <Button className="checkout" onClick={handleCheckout}>
                                    <b>Checkout</b>
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default CartPage;
