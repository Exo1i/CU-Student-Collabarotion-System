"use client";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useState } from "react";

const localizer = momentLocalizer(moment);
const calendarEvents = [
  {
    title: "Math",
    allDay: false,
    start: new Date(2024, 11, 30, 9, 0),
    end: new Date(2024, 11, 30, 11, 0),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2024, 11, 30, 10, 0),
    end: new Date(2024, 11, 30, 12, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2024, 11, 26, 10, 0),
    end: new Date(2024, 11, 26, 12, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2024, 11, 27, 10, 0),
    end: new Date(2024, 11, 27, 12, 45),
  },
];

export default function Schedule() {
  const [view, setView] = useState(Views.WORK_WEEK);
  const handleOnChangeView = (selectedView) => setView(selectedView);
  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      onView={handleOnChangeView}
      style={{ height: 350 }}
      min={new Date(2024, 11, 20, 8, 0)}
      max={new Date(2025, 12, 30, 18, 30)}
    />
  );
}
