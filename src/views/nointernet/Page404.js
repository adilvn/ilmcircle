import React from 'react'
import pageImage from "../../asserts/images/nointernet404/Error404.png"
import "./nointernet.css"
import Button from "../../components/reuseable/Button";
import { Link } from 'react-router-dom';
function Page404() {
    return (
        <>
        
<div className='container-fluid'>

        <div className='container'>
            <div className='row '  >
                <div className='col-12 d-flex justify-content-center'>
                <img
            
            style={{ height: "100%", width: "50%", objectFit: "cover" }}
     
            src={pageImage}
            alt="No InterNet"
        />

                </div>
            <div className='row align-item-center mb-5'>
                <div className='col d-flex justify-content-center '>
                <Link to="/">
                    <Button
                        data="Go to Home"
                        class={"main-btn-2"}
                    ></Button>
                </Link>
                </div>
            </div>
            </div>
        </div>
</div>
        

        </>



    )
}

export default Page404