const EventDetails = ({ eventDetails, setEventDetails }) => {
  const handleEventDetailChange = (key, value) => {
    setEventDetails({ ...eventDetails, [key]: value })
  }

  return (
    <div className="toggle-section">
      <div className="event-details">
        <div className="input-field">
          Event Name:
          <input
            type="text"
            placeholder="Event Name"
            value={eventDetails.name}
            onChange={(e) => handleEventDetailChange('name', e.target.value)}
          />
        </div>
        <div className="input-field">
          Duration:
          <input
            type="number"
            placeholder="Duration"
            value={eventDetails.duration}
            onChange={(e) =>
              handleEventDetailChange('duration', e.target.value)
            }
          />
        </div>
        <div className="input-field">
          Location:
          <input
            placeholder="Enter a link or address"
            value={eventDetails.location}
            onChange={(e) =>
              handleEventDetailChange('location', e.target.value)
            }
          />
        </div>
        <div className="input-field">
          Description:
          <textarea
            placeholder="Write any details your invitees should know about the event."
            value={eventDetails.description}
            onChange={(e) =>
              handleEventDetailChange('description', e.target.value)
            }
          />
        </div>
      </div>
    </div>
  )
}

export default EventDetails
