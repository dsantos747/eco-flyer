"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { experimental_useFormState as useFormState } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

export function FlightForm() {
  const [leaveFirstDate, setLeaveFirstDate] = useState(new Date());

  return (
    <form onSubmit={console.log("hello")}>
      <input type="text" placeholder="Home Location"></input>
      <DatePicker selected={leaveFirstDate} onChange={(leaveFirstDate) => setLeaveFirstDate(leaveFirstDate)}></DatePicker>
      <input type="text" placeholder="Outbound Date"></input>
      <input type="text" placeholder="Outbound Date End Range"></input>
      <input type="text" placeholder="Return Date"></input>
      <input type="text" placeholder="Return Date End Range"></input>
      <div>
        <input type="radio" id="trip-short" name="trip_length" value="trip-short"></input>
        <label htmlFor="trip-short">Near</label>
        <input type="radio" id="trip-medium" name="trip_length" value="trip-medium"></input>
        <label htmlFor="trip-medium">Far</label>
        <input type="radio" id="trip-long" name="trip_length" value="trip-long"></input>
        <label htmlFor="trip-long">Really Far</label>
      </div>
      <button type="submit">Submit & make flight search</button>
    </form>
  );
}
