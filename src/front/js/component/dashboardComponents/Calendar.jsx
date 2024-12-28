import React, { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"
import { useState } from "react";


const Calendar = () => {

    const [events,setEvents] = useState ([
        {id:1, title: "Event 1", start: "2024-12-25"},
        {id:2, title: "Event 2", start: "2024-12-31"}
    ]);
    const [contextMenu, setContextMenu] = useState({visible: false, x:0,y:0,event:null,date:null})

    const handleEventClick = (e,clickInfo) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("click on", clickInfo.event)
        const calendarContainer = e.target.closest(".fc");
        const rect = calendarContainer.getBoundingClientRect();
        setContextMenu({
            visible: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            event: clickInfo.event || null,
            date:clickInfo.dateStr
        })
    }
    const handleCloseContextMenu = () =>{
        setContextMenu({visible: false, x:0,y:0,event:null,date:null})
    }
    const handleAddEvent = () => {
        if(contextMenu.date){
            const title = prompt("Add a new event:")
            if(title){
                const newEvent={
                    id: events.length + 1,
                    title: title,
                    start: contextMenu.date
                }
                setEvents([... events,newEvent]);
                console.log(events);
            }
            setContextMenu({visible:false});
        }
    }

    const handleEventDrop = (dropInfo) => {
        const {event} = dropInfo
        console.log(event.id)
        const updateEvent = {
            id: event.id,
            title: event.title,
            start: event.start.toISOString().split('T')[0],
        };
        console.log(updateEvent.start)
        setEvents((prevEvents) => prevEvents.map((currentEvent)=> currentEvent.id == event.id ? updateEvent : currentEvent));
        console.log(events)
    }
    const handleEditEvent = () =>{
        if(contextMenu.event){
            const updateEvent = prompt("Change the event:", contextMenu.event.title)
            if(updateEvent){
                console.log("before",events);
                console.log(updateEvent)
                setEvents(events.map((event)=>event.id == contextMenu.event.id ? {...event,title:updateEvent}: event))
                console.log("after",events);
            }
        }
        handleCloseContextMenu();
    }

    const handleRemoveEvent = () =>{
        if(contextMenu.event && window.confirm(`Are you sure to delete the event "${contextMenu.event.title}"?`))
            setEvents(events.filter((event)=>event.id != contextMenu.event.id));
        handleCloseContextMenu();
    }

    useEffect(()=>{console.log(events)},[events])

    return (
        <>
            <div onClick={handleCloseContextMenu} style={{position:'relative'}}>
                <FullCalendar
                    headerToolbar={{
                        start: "prev,next today title",
                        center: "",
                        end:""
                    }}
                    plugins={[dayGridPlugin,interactionPlugin]}
                    initialView="dayGridMonth"
                    height={"auto"}
                    editable={true}
                    droppable={true}
                    eventReceive={(dropInfo) => handleEventDrop(dropInfo)}
                    events={events}
                    dateClick={(clickInfo) => handleEventClick(clickInfo.jsEvent,clickInfo)}
                    eventClick={(clickInfo) => handleEventClick(clickInfo.jsEvent,clickInfo)}
                />
                {contextMenu.visible && (
                    <ul className="dropdown-menu show" 
                            style={{
                                position:'absolute', 
                                top:contextMenu.y, 
                                left:contextMenu.x, 
                                zIndex:1000,
                                display:"block",
                                minWidth:"150px",
                                backgroundColor:"white",
                                boxShadow:"0 4px 8px rgba(0,0,0,0.1)",
                                borderRadius:"5px"
                                }}>
                        {contextMenu.event ? (
                            <>
                                {console.log("show Contextmenu", contextMenu.event)}
                                <li>
                                    <button className="dropdown-item" onClick={handleEditEvent}>Edit Event</button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={handleRemoveEvent}>Remove Event</button>
                                </li>
                                <li>
                                    <button className="dropdown-item">Cancel</button>
                                </li>
                            </>
                        ) : (
                            <>
                                 <li>
                                    <button className="dropdown-item" onClick={()=>handleAddEvent(new Date())}>Add Event</button>
                                </li>
                                <li>
                                    <button className="dropdown-item">Cancel</button>
                                </li>
                            </>
                        )}
                    </ul>
                )}
            </div>
        </>
    )
}

export default Calendar;