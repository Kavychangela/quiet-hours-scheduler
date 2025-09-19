'use client'

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import AddScheduleForm from "../components/AddScheduleForm";

export default function Home() {
  const [user, setUser] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schedulesLoading, setSchedulesLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUserAndSchedules() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/auth");
      else {
        setUser(user);
        fetchSchedules(user.id);
      }
    }
    getUserAndSchedules();
  }, [router]);

  const fetchSchedules = async (userId) => {
    setSchedulesLoading(true);
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) alert(error.message);
    else setSchedules(data);

    setSchedulesLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('schedules').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchSchedules(user.id);
  };

  if (!user) return <div className="text-center">Loading...</div>;

  const now = new Date();
  const nextSchedule = schedules.find(s => new Date(`1970-01-01T${s.start_time}:00`) > now);

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome, {user.email}</h1>
        <button
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) alert(error.message);
            else router.push("/auth");
          }}
          className="button-logout"
        >
          Logout
        </button>
      </div>

      <AddScheduleForm
        onAdd={async ({ startTime, endTime }) => {
          setLoading(true);

          const isOverlap = schedules.some(
            (s) => startTime < s.end_time && endTime > s.start_time
          );
          if (isOverlap) {
            alert("This schedule overlaps with an existing one!");
            setLoading(false);
            return;
          }

          const { error } = await supabase
            .from('schedules')
            .insert([{ start_time: startTime, end_time: endTime, user_id: user.id }]);
          if (error) alert(error.message);
          else fetchSchedules(user.id);

          setLoading(false);
        }}
        loading={loading}
      />

      <div className="schedule-grid">
        {schedulesLoading ? (
          <div className="text-center">Loading schedules...</div>
        ) : schedules.length === 0 ? (
          <div className="text-center">No schedules found. Add one above!</div>
        ) : (
          schedules.map((s) => {
            const isNext = nextSchedule && s.id === nextSchedule.id;
            return (
              <div
                key={s.id}
                className={`schedule-card ${isNext ? 'schedule-card-next' : ''}`}
              >
                <h3>{isNext ? 'Next Up ⏰' : 'Quiet Hours'}</h3>
                <p>From <span>{s.start_time}</span> to <span>{s.end_time}</span></p>
                <button onClick={() => handleDelete(s.id)} className="delete-button">
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
