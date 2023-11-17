import { Dialog } from "primereact/dialog";
import React, { useState } from "react";

import { AiOutlineRight } from "react-icons/ai";
import { EventStep1 } from "../OrgMyEvents/EventStep1";
import { EventStep2 } from "../OrgMyEvents/EventStep2";
import { VocancyContent } from "./VocancyContent";

export const Step1 = ({ showModal, handleModal }) => {
    const [data, setData] = useState({});
    const [step, setStep] = useState(true);
    const handleStep2 = () => {
        setStep(false);
    };
    return (
        <Dialog
            visible={showModal}
            dismissableMask={true}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            modal
            draggable={false}
            className=" createEventOrganizationModal "
            onHide={handleModal}
        >
            <div className=" mt-2 p-4 pt-2">
                <h4 className="heading">Create new event</h4>
                <div className="steps mt-2">
                    <a className="ms-0" onClick={() => setStep(true)}>
                        Step 1
                    </a>
                    <AiOutlineRight className="mb-1" fontSize={"20px"} />{" "}
                    <a onClick={() => setStep(false)}>Step 2</a>
                </div>
                {<VocancyContent handleStep2={handleStep2} />}
            </div>
        </Dialog>
    );
};
