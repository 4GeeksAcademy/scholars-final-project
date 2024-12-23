import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = () => {

    return (
        <>
            <FullCalendar
                headerToolbar={{
                    start: "prev,next today title",
                    center: "",
                    end:""
                }}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                eventInteractive={true}
                editable={true}
                height={"auto"}
                events={[
                    {title: "Event 1", date: "2024-12-25"},
                    {title: "Event 2", date: "2024-12-31"}
                ]}
            />
        </>
    )
}

export default Calendar;