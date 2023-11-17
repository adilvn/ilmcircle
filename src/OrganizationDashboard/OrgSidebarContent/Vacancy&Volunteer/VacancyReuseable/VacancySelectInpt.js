import React, { useState } from "react";
import { useEffect } from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from "react-places-autocomplete";
export const VacancySelectInpt = ({ disabled, name, id, status, onCityChange, onCountryChange,
    city: initialCity,
    country: initialCountry,
    edit
}) => {

    const [day, setDay] = useState([]);
    const [city, setCity] = useState(initialCity);
    const [country, setCountry] = useState([]);
    const [countryCode, setCountryCode] = useState("us");
    const [phone, setPhone] = useState("");

    const handleSelect = async (selectedAddress) => {
        const results = await geocodeByAddress(selectedAddress);
        const { address_components } = results[0];
        let city = "";
        let country = "";
        let countryCode = "";
        address_components.forEach((component) => {
            if (component.types.includes("locality")) {
                city = component.long_name;
            }
            if (component.types.includes("country")) {
                country = component.long_name;
                countryCode = component.short_name.toLowerCase();
            }
        });
        onCityChange(city)
        onCountryChange(country)
        setCity(city);
        setCountry(country);
        setCountryCode(countryCode);
        setPhone("");

    };




    useEffect(() => {
        setCity(initialCity);
        setCountry(initialCountry);
    }, [initialCity, initialCountry]);



    return (
        <div>
            <p className={status !== 1 ? "textheading mb-1 mt-24px" : "textheading dateLocationText mb-1 mt-24px"}>
                {name} {status !== 1 ? "(required)" : ""}
            </p>
            <div className="row ">
                <div className={`col col-12 col-md-6 mt-2 mt-md-0 pointer `}>
                    <PlacesAutocomplete
                        value={city}
                        onChange={setCity}
                        onSelect={disabled ? () => { } : handleSelect}
                        // onSelect={handleSelect}


                        required
                        searchOptions={{ types: ["(cities)"] }}

                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input

                                    {...getInputProps({
                                        placeholder: "City",
                                        name: "city",
                                        id: "typeCity",
                                    })}
                                    className="form-control"
                                    disabled={disabled}
                                />
                                <div className="places-dropdown">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion) => {
                                        const style = {
                                            backgroundColor: suggestion.active
                                                ? "#41b6e6"
                                                : "#fff",
                                        };
                                        return (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    className: "places-dropdown-item",
                                                    style,
                                                })}
                                            >
                                                {suggestion.description}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                </div>

                <div className="col col-12 col-md-6 mb-2 mb-md-0 pointer">
                    <input
                        type="text"
                        className="inputFields w-100"
                        placeholder="Country"
                        id="typeCountry"
                        disabled
                        value={country} // Set the value of country from the state
                    />
                </div>
            </div>
        </div>
    );
};