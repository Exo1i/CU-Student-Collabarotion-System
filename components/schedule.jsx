"use client";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";

const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [view, setView] = useState(Views.WORK_WEEK);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, seteventTitle] = useState("");

  const handleSelectSlot = (slotInfo) => {
    setshowModal(true);
    setSelectedDate(slotInfo.start);
  };

  const saveEvent = () => {
    if (eventTitle && selectedDate) {
      const newEvent = {
        title: eventTitle,
        start: selectedDate,
        end: moment(selectedDate).add(1, "hours").toDate(),
      };
      setEvents([...events, newEvent]);
      setshowModal(false);
      seteventTitle("");
    }
  };
  const handleOnChangeView = (selectedView) => setView(selectedView);
  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        onView={handleOnChangeView}
        style={{ height: 350 }}
        min={new Date(2024, 11, 20, 8, 0)}
        max={new Date(2025, 12, 30, 18, 30)}
      />
      {showModal && (
        <Card className="position: relative left-10 -top-52 size-2/4 ">
          <CardHeader>
            <CardTitle>Add an event to your calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Event Title</Label>
            <Input
              className="form.control"
              value={eventTitle}
              onChange={(e) => seteventTitle(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex-row gap-5 justify-end">
            <Button variant="destructive" onClick={() => setshowModal(false)}>
              Close
            </Button>
            <Button className="bg-green-400" onClick={saveEvent}>
              Save
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
