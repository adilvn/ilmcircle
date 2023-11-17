import React, { useState, useEffect } from 'react';
import image from "../../asserts/images/nointernet404/NoInternetAvaliable.png"
import { Detector } from "react-detect-offline"
const NoInternetConnection = (props) => {
    return (
        <>
            <Detector
                render={({ online }) => (
                    online ? props.children :
                        <div className='container'>
                            <div className='row '  >
                                <div className='col-12 d-flex justify-content-center'>
                                    <img

                                        style={{ height: "100%", width: "50%", objectFit: "cover" }}
                                        src={image}
                                        alt="No InterNet" />
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <h2 className="d-flex justify-content-center">No Internet </h2>
                                <h2 className="d-flex justify-content-center text-center">Check your connection and try again! </h2>
                            </div>
                        </div>
                )} />

        </>
    )



}
// }

export default NoInternetConnection;