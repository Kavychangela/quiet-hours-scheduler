'use client'

import { useState, useEffect } from "react"
import { supabase } from "./lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Home() {
  const [user, setUser] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [schedulesLoading, setSchedulesLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getUserAndSchedules() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth")
      } else {
        setUser(user)
        fetchSchedules(user.id)
      }
    }
    getUserAndSchedules()
  }, [router])

  const fetchSchedules = async (userId) => {
    setSchedulesLoading(true)
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      alert("Error fetching schedules: " + error.message)
    } else {
      setSchedules(data)
    }
    setSchedulesLoading(false)
  }

  const handleAddSchedule = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Check for overlapping schedules
    const isOverlap = schedules.some(
      (s) => (startTime < s.end_time && endTime > s.start_time)
    )
    if (isOverlap) {
      alert("This schedule overlaps with an existing one!")
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('schedules')
      .insert([
        { start_time: startTime, end_time: endTime, user_id: user.id }
      ])

    if (error) {
      alert("Error adding schedule: " + error.message)
    } else {
      setStartTime("")
      setEndTime("")
      fetchSchedules(user.id)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('schedules').delete().eq('id', id)
    if (error) alert("Error deleting: " + error.message)
    else fetchSchedules(user.id)
  }

  if (!user) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
      <button 
        onClick={() => supabase.auth.signOut()}
        className="bg-red-500 text-white p-2 rounded mb-4"
      >
        Logout
      </button>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">Add Quiet Hours</h2>
        <form onSubmit={handleAddSchedule}>
          <div className="mb-4">
            <label htmlFor="start_time" className="block mb-1">Start Time</label>
            <input
              type="time"
              id="start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="end_time" className="block mb-1">End Time</label>
            <input
              type="time"
              id="end_time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Schedule'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Your Upcoming Schedules</h2>
        {schedulesLoading ? (
          <div className="text-center">Loading schedules...</div>
        ) : schedules.length > 0 ? (
          <ul>
            {schedules.map((schedule) => (
              <li key={schedule.id} className="border-b last:border-b-0 py-2 flex justify-between items-center">
                Quiet hours from {schedule.start_time} to {schedule.end_time}
                <button 
                  onClick={() => handleDelete(schedule.id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No schedules found. Add one above!</p>
        )}
      </div>
    </div>
  )
}
