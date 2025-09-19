'use client';

export default function ScheduleList({ schedules, onDelete }) {
  if (!schedules || schedules.length === 0) {
    return <p className="text-center mt-4 text-gray-500">No upcoming schedules.</p>;
  }

  return (
    <div className="max-w-md mx-auto my-6 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Your Upcoming Schedules</h2>
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className="flex justify-between items-center bg-white p-4 rounded shadow"
        >
          <div>
            <p>
              Quiet hours from <span className="font-medium">{schedule.startTime}</span> to{' '}
              <span className="font-medium">{schedule.endTime}</span>
            </p>
          </div>
          <button
            onClick={() => onDelete(schedule.id)}
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
