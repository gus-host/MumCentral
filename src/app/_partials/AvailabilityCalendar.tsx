// components/AvailabilityCalendar.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import type { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { format, parse } from "date-fns";

interface AvailabilityCalendarProps {
  availability: string[];
}

export function AvailabilityCalendar({
  availability,
}: AvailabilityCalendarProps) {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Use reduce instead of flatMap
  const events: EventInput[] = availability.reduce<EventInput[]>((acc, str) => {
    const [dayName, rawRange] = str.split(": ");
    const dow = weekDays.indexOf(dayName);

    // Normalize spaces & split on hyphen or en-dash
    const range = rawRange.replace(/\u202F/g, " ").trim(); // replace narrow NBSP
    if (range === "Closed") {
      acc.push({
        title: "Closed",
        daysOfWeek: [dow],
        display: "background",
        allDay: true,
        backgroundColor: "#f8d7da",
      });
    } else if (range === "Open 24 hours") {
      acc.push({
        title: "Open 24h",
        daysOfWeek: [dow],
        display: "background",
        allDay: true,
        backgroundColor: "#d4edda",
      });
    } else {
      // split on any dash (– or -)
      const [rawStart, rawEnd] = range.split(/\s*[–-]\s*/);
      const start = rawStart.replace(/\u00A0/g, " ").trim(); // replace NBSP
      const end = rawEnd.replace(/\u00A0/g, " ").trim();

      // parse into Date objects
      const startDate = parse(start, "h:mm a", new Date());
      const endDate = parse(end, "h:mm a", new Date());
      // guard against invalid parses
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn(`Skipping invalid range "${range}" for ${dayName}`);
      } else {
        acc.push({
          title: `${start} – ${end}`,
          daysOfWeek: [dow],
          startTime: format(startDate, "HH:mm:ss"),
          endTime: format(endDate, "HH:mm:ss"),
          allDay: false,
          backgroundColor: "#cfe2ff",
          borderColor: "#9fc5e8",
        });
      }
    }
    return acc;
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      }}
      events={events}
      nowIndicator
      slotMinTime="00:00:00"
      slotMaxTime="24:00:00"
      height="auto"
    />
  );
}
