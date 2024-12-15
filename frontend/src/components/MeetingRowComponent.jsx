import React from 'react';
import { Link } from 'react-router-dom'
import '../index.css';
import '../css/meeting-row-component.css';
import { CgProfile } from "react-icons/cg";
import { MdEdit } from "react-icons/md";
import { IoMdShare } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

// NOTE: meeting types are 'Upcoming', 'Hosting', 'Requests', 'Past' or 'Declined'

const MeetingRowComponent = ({ 
  meeting, 
  typeOfMeeting, 
  shareCallback, 
  acceptCallback, 
  declineCallback, 
}) => {

  const { 
    id, 
    hostProfilePic = null, 
    hostName,
    attendeeName,
    title, 
    starttime,
    endtime,
    date, 
    userIsHostingMeeting
  } = meeting;

  const dateObject = new Date(date);

  const formattedDate = dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className='meeting-row-container'>
      <div className='meeting-row-datetime-container'>
        <span className='icon-margin'>
          {hostProfilePic ? 
            <img
              src={hostProfilePic}
              className='profile-circle'
              style={{height: '70px', width:'70px'}}
              alt='host profile'
            />
            : <CgProfile style={{height: '70px', width:'70px'}}/>
          }
        </span>
        <div>
          {starttime}-{endtime}
          <div className='subtitle'>{formattedDate}</div>
        </div>
      </div>
      <div className='meeting-row-title-container'>
        <Link 
          to={`/meetings?id=${id}`}
          style={{color:'black', textDecoration:'none'}}
        >
          {title}
        </Link>
        <div className='subtitle'>
          {userIsHostingMeeting ? attendeeName : hostName}
        </div>
      </div>
      <div className='meeting-row-button-container'>
        {(typeOfMeeting === 'Upcoming' || typeOfMeeting === 'Hosting') && (
          <>
            {userIsHostingMeeting && (
              <>
                <Link 
                  to={`/edit?id=${id}`}
                  className='meeting-row-button green-background'
                >
                  <MdEdit />
                </Link>

                <div 
                  className='meeting-row-button green-background'
                  onClick={shareCallback}
                >
                  <IoMdShare />
                </div>
              </>
            )}
            <div 
              className='meeting-row-button yellow-background'
              onClick={declineCallback}
            >
              <IoMdClose />
            </div>
          </>
        )}
        {typeOfMeeting === 'Requests' && (
          <>
            <div 
              className='meeting-row-button green-background'
              onClick={acceptCallback}
            >
              <FaCheck className='icon-margin'/>
              Accept
            </div>

            <div 
              className='meeting-row-button yellow-background'
              onClick={declineCallback}
            >
              <IoMdClose className='icon-margin'/>
              Decline
            </div>
          </>
        )}
        {typeOfMeeting === 'Declined' && (
           <div 
           className='meeting-row-button green-background'
           onClick={acceptCallback}
         >
           <FaCheck className='icon-margin'/>
           Accept
         </div>
        )}
      </div>
    </div>
  );
};

export default MeetingRowComponent;