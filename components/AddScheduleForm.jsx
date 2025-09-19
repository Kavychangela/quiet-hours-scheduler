'use client'

import { useState } from "react";

export default function AddScheduleForm({ onAdd, loading }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ startTime, endTime });
    setStartTime('');
    setEndTime('');
  };

  return (
    <form className="add-schedule-form" onSubmit={handleSubmit}>
      <label htmlFor="startTime">Start Time</label>
      <input
        id="startTime"
        type="time"
        value={startTime}
        onChange={e => setStartTime(e.target.value)}
        required
      />

      <label htmlFor="endTime">End Time</label>
      <input
        id="endTime"
        type="time"
        value={endTime}
        onChange={e => setEndTime(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Schedule'}
      </button>
    </form>
  );
}
