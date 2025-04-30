import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GuestOnlyRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (token !== null) {
            navigate(-1);
        }
    }, [token, navigate]);

    if (token) return null;

    return children;
};

export default GuestOnlyRoute;
