import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { ReactSVG } from 'react-svg'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import passwordIcon from '../../../../asserts/images/password.svg'
import hidepasswordIcon from '../../../../asserts/images/hidepassword.svg'
import Button from '../../../../components/reuseable/Button'
import DonateModelData from "./DonateModelData";


export const DonateModel = ({ GetProjects, sedingTitle, id, showModal, handleModal, projectsID, setShowModal }) => {
    const [data, setData] = useState({});
    const [step, setStep] = useState(true);
    const handleStep2 = () => {
        setStep(false);
    };


    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRepeatePasswordVisible, setIsRepeatePasswordVisible] = useState(false);
    const [fname, setfName] = useState('');
    const [lname, setlName] = useState('');
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [payMethod, setPayMethod] = useState('');
    const [expDate, setExpDate] = useState('');

    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [code, setCode] = useState('');
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const InputField = ({ placeholder, type }) => (
        <input className="input-field" type={type} placeholder={placeholder} />
    );
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const toggleRepeatePasswordVisibility = () => {
        setIsRepeatePasswordVisible(!isRepeatePasswordVisible);
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
            <DonateModelData id={id} sedingTitle={sedingTitle} GetProjects={GetProjects} projectsID={projectsID} setShowModal={setShowModal} />
        </Dialog>
    );
};
