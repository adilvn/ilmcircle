import React from "react";
import { EventAndClass } from "./EventClass/EventAndClass";
import { EventSection } from "./EventClass/EventSection";

const EventsClass = () => {
    return (
        <div className="AllMainSection">
            <EventAndClass />
            <EventSection />
        </div>
    );
};

export default EventsClass;
