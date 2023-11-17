import React, { useState } from "react";
import API_Routes from "../../Routes/API_Routes";
import { Loader } from "./Loader";
import { showMessage } from "./Tostify";

const AddFavoriteAPI = ({ url, method, body, headers, onSuccess, onError }) => {
    const [loader, setLoader] = useState(false);

    const handleApiRequest = () => {
        setLoader(true);

        fetch(API_Routes.ADDTOFAVORITE, {
            method,
            headers,
            body,
            redirect: "follow",
        })
            .then((response) => response.text())
            .then((result) => {
                if (result.status == 200 || result.status == 201) {
                    setLoader(false);
                    showMessage(result.message)
                    onSuccess(result);
                } else {
                    setLoader(false);
                    showMessage(result.message, 'error')
                }

            })
            .catch((error) => {
                setLoader(false);
                onError(error);
            });
    };

    return (
        <div>
            {loader && (
                <div className="loaderScreen">
                    <Loader />
                </div>
            )}
            <button onClick={handleApiRequest} disabled={loader}>
                {loader ? "Loading..." : "Make API Request"}
            </button>
        </div>
    );
};

export default AddFavoriteAPI;
