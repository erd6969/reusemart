import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import './RegisterBuyerPage.css';
import axios from 'axios';
import TopsNavbar from "./NavbarLogin.jsx";
import { ShoppingCart } from 'lucide-react';

function RegisterPage() {
    return (
        <div>
            <TopsNavbar />
            <div className="loginCards">
                <Card className="p-3 reuseTitles" style={{ backgroundColor: '#347928', border: 'none' }}>
                    <p className='wels'>Welcome To</p>
                    <p className='cams'>ReuseMart<ShoppingCart size={60}/></p>
                </Card>

                <Card className="p-4 reuseForms" >
                    <h2 className='loginTitles'>Register</h2>
                    <p className='loginTexts'>Welcome Back</p>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                // value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                // value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <p className='forpass'>Forgot Password</p>
                        <div className='buttonGroups'>
                            <Button className="tombols" type="regis" variant="warning"><p>Register</p></Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
}

export default RegisterPage;
