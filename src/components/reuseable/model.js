import React from 'react';
import Button from "./Button";
import "./model.css"
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
function CustomModal({ title, content, onClose }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        secureLocalStorage.removeItem("token");
        secureLocalStorage.removeItem("id");
        secureLocalStorage.removeItem("image");
        navigate("/login");
    };
    return (
        <div className="custom-modal">
            <div className="modal-content">
                <h4>{title}!</h4>
                {/* <p>{content}</p> */}
                <div className='d-flex justify-content-center align-items-center'>
                    <div className="py-3">
                        <Button data={"Login"} class={"profile-btn "} onClick={() => { handleLogout(); onClose() }}>Login</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomModal;
