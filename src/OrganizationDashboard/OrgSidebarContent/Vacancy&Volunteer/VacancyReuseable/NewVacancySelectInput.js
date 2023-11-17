import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Autocomplete } from '@react-google-maps/api';

const apiKey = "AIzaSyCByyO3JtJCxeA23nnf-GZUzLR4DikY-0o";
export const NewVacancySelectInput = (
    { disabled, name, id, status, onCityChange, onCountryChange,
        city: initialCity,
        country: initialCountry,
        edit
    }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [city, setCity] = useState(initialCity);
    const [country, setCountry] = useState(initialCountry);
    const [inputValue, setInputValue] = useState("");

    const handlePlaceSelect = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place && place?.geometry && place?.geometry?.location) {
                const location = {
                    lat: place?.geometry?.location?.lat(),
                    lng: place?.geometry?.location?.lng(),
                };
                setSelectedLocation(location);
            }
            const addressComponents = place?.address_components || [];
            for (const component of addressComponents) {
                if (component?.types?.includes("locality")) {
                    setInputValue(component?.long_name?.split(','))
                    setCity(component?.long_name);
                    onCityChange(component?.long_name)
                } else if (component?.types?.includes("country")) {
                    setCountry(component?.long_name);
                    onCountryChange(component?.long_name);
                }
            }
        }
    };
    const onLoad = (autocomplete) => {
        setAutocomplete(autocomplete);
    };
    useEffect(() => {
        if (navigator?.geolocation) {
            navigator?.geolocation?.getCurrentPosition((position) => {
                const userLocation = {
                    lat: position?.coords?.latitude,
                    lng: position?.coords?.longitude,
                };
                setSelectedLocation(userLocation);
            });
        }
    }, []);
    const handleInputChange = (e) => {
        setInputValue(e?.target?.value);
    };
    useEffect(() => {
        setInputValue(city);
    }, [city]);

    return (
        <>
            <div>
                <p className={status !== 1 ? "textheading mb-1 mt-24px" : "textheading dateLocationText mb-1 mt-24px"}>
                    {name} {status !== 1 ? "(required)" : ""}
                </p>
                <div className="row ">
                    <div className={`col col-12 col-md-6 mt-2 mt-md-0 pointer `}>
                        <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
                            <Autocomplete
                                onLoad={onLoad}
                                onPlaceChanged={disabled ? () => { } : handlePlaceSelect}
                                options={{
                                    types: ["(cities)"],
                                    fields: ['name', 'address_components'],
                                }} >
                                <input
                                    className="col-6 form-control  mb-sm-0 mb-2"
                                    type="text"
                                    value={inputValue}
                                    required
                                    disabled={disabled}
                                    onChange={handleInputChange}
                                    placeholder='City' />

                            </Autocomplete>
                        </LoadScript>
                    </div>
                    <div className="col col-12 col-md-6 mb-2 mb-md-0 pointer">
                        <input
                            type="text"
                            className="inputFields w-100"
                            placeholder="Country"
                            id="typeCountry"
                            disabled
                            value={country}
                        />
                    </div>
                </div>
            </div>
        </>
    );
} 