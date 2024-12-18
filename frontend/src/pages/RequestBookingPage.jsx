// Lilan Forsyth and Lian Lambert
import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Calendar from '../components/Calendar'
import TimeSlot from '../components/TimeSlots'
import axios from 'axios'
import '../css/booking-page.css'
import { format, addMinutes, parse } from 'date-fns'
// import '../css/request-page.css'

const RequestBookingPage = () => {
  const location = useLocation()

  // Retrieve userId from localStorage or state passed via location
  const userId = location.state?.userId || localStorage.getItem('userId')

  const { meetingId } = useParams()
  const [meetingData, setMeetingData] = useState(null)
  const [hostData, setHostData] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fullTimeAvailabilites = {
    Monday: [
      {
        start: '09:00',
        end: '17:00',
      },
    ],
    Tuesday: [
      {
        start: '09:00',
        end: '17:00',
      },
    ],
    Wednesday: [
      {
        start: '09:00',
        end: '17:00',
      },
    ],
    Thursday: [
      {
        start: '09:00',
        end: '17:00',
      },
    ],
    Friday: [
      {
        start: '09:00',
        end: '17:00',
      },
    ],
    Saturday: [
      {
        start: '09:00',
        end: '17:00',
      },
    ],
    Sunday: [
      {
        start: '09:00',
        end: '17:00',
      },
    ],
  }

  // Function to fetch meeting data
  const fetchMeetingData = async () => {
    try {
      const response = await axios.get(`/server/meetings/${meetingId}`)
      const meeting = response.data
      setMeetingData(meeting)
      const currentDate = format(new Date(), 'yyyy-MM-dd')
      const isSameDate = currentDate === meeting.dateRange['start']

      if (!isSameDate) {
        meeting.dateRange['start'] = currentDate
      }

      if (meeting.host) {
        const hostResponse = await axios.get(`/server/users/${meeting.host}`)
        setHostData(hostResponse.data)
      }

      setLoading(false)
    } catch (err) {
      console.error('Error fetching meeting data:', err)
      setError('Failed to load meeting details.')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeetingData()
  }, [meetingId])

  function isTimeSlotAvailable(starttime, endtime) {
    // get availabilities for the selected day
    const dayOfWeek = format(new Date(selectedDate), 'EEEE')
    const dayAvailabilities = meetingData?.availabilities[dayOfWeek] || []

    // check if starttime and endtime fall within any of the available time slots
    const isWithinAvailability = dayAvailabilities.some(({ start, end }) => {
      return starttime >= start && endtime <= end
    })

    return isWithinAvailability
  }

  const handleBooking = async () => {
    // determine if requested slot is inside availabilities
    const starttime = format(parse(selectedSlot, 'HH:mm', new Date()), 'HH:mm')
    const endtime = format(
      addMinutes(
        parse(selectedSlot, 'HH:mm', new Date()),
        meetingData.duration
      ),
      'HH:mm'
    )

    isTimeSlotAvailable(starttime, endtime) ? createBooking() : createRequest()
  }

  const createRequest = async () => {
    if (!selectedSlot || !selectedDate) {
      alert('Please select a date and time slot before booking.')
      return
    }

    try {
      const newRequest = {
        meeting: meetingId,
        userAskingAccount: userId || null,
        userAnswering: meetingData.host,
        userAnsweringResponse: null,
        date: format(new Date(selectedDate), 'yyyy-MM-dd'),
        starttime: format(parse(selectedSlot, 'HH:mm', new Date()), 'HH:mm'),
        endtime: format(
          addMinutes(
            parse(selectedSlot, 'HH:mm', new Date()),
            meetingData.duration
          ),
          'HH:mm'
        ),
      }

      const response = await axios.post('/server/requests/create', newRequest)
      console.log('Response:', response.data)
      alert('Your request to meet was sent successfully!')
      return response.data
    } catch (error) {
      console.error('Error creating request:', error)
      throw error
    }
  }

  // Handle booking a slot
  const createBooking = async () => {
    if (!selectedSlot || !selectedDate) {
      alert('Please select a date and time slot before booking.')
      return
    }

    try {
      const newBooking = {
        attendee: userId,
        date: format(selectedDate, 'yyyy-MM-dd'), // Store date as 'YYYY-MM-DD'
        starttime: format(parse(selectedSlot, 'HH:mm', new Date()), 'HH:mm'), // Store time as 'HH:mm'
        endtime: format(
          addMinutes(
            parse(selectedSlot, 'HH:mm', new Date()),
            meetingData.duration
          ),
          'HH:mm'
        ),
      }

      const updatedBookings = [...meetingData.bookings, newBooking]

      await axios.put(`/server/meetings/${meetingId}`, {
        bookings: updatedBookings,
      })

      alert('Your requested time was available! Meeting Booked!')
      fetchMeetingData() // Re-fetch meeting data after booking
    } catch (error) {
      console.error('Error booking meeting:', error)
      alert('Failed to book meeting. Please try again.')
    }
  }

  if (loading) return <p>Loading...</p> // Render a loading message until data is fetched
  if (error) return <p>{error}</p>

  return (
    <>
      <div className="public-page-wrapper">
        <div className="display-wrapper">
          <div className="meeting-details">
            <h2>{meetingData.title}</h2>
            <p>
              <strong>Host:</strong>{' '}
              {hostData
                ? `${hostData.firstName} ${hostData.lastName}`
                : 'Loading...'}
            </p>
            <p>
              <strong>Location:</strong> {meetingData.linkOrLocation}
            </p>
            <p>
              <strong>Duration:</strong> {meetingData.duration} minutes
            </p>
            <p>{meetingData.description}</p>
          </div>

          <div className="preview-wrapper">
            <div className="calendar-preview">
              <Calendar
                dateRange={meetingData.dateRange || { start: '', end: '' }}
                availableDays={fullTimeAvailabilites || {}}
                onDateSelect={setSelectedDate}
              />
            </div>

            <div className="time-slot">
              {selectedDate && (
                <TimeSlot
                  selectedDate={selectedDate}
                  availableDays={fullTimeAvailabilites || {}}
                  bookings={meetingData.bookings} // Pass bookings to TimeSlots
                  duration={meetingData.duration}
                  clickable={true} // Enable interactivity
                  onSlotSelect={setSelectedSlot} // Pass selected slot to state
                />
              )}
            </div>

            {/* Conditionally render the "Book Slot" button */}
            {meetingData.host !== userId ? (
              <button
                onClick={handleBooking}
                disabled={!selectedSlot}
                className="alternative-slot-button"
              >
                Request Slot
              </button>
            ) : (
              <p className="host-warning">
                You are the host for this meeting. You cannot book a slot.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default RequestBookingPage
