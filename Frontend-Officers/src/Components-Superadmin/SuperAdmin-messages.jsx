import React from 'react'
import "./styles/driver-style.css";


function SuperAdminMessages() {

  const messages = [
    { msgText: "msg1", Time: "7.00 AM", },
    { msgText: "msg2", Time: "7.30 AM", },
    { msgText: "msg3", Time: "8.00 AM", },
    { msgText: "msg4", Time: "7.15 AM", },
    { msgText: "msg5", Time: "7.45 AM", },
    { msgText: "msg6", Time: "9.00 PM", },
    { msgText: "msg7", Time: "2.00 PM", },
    { msgText: "msg8", Time: "7.00 AM", },
    { msgText: "msg9", Time: "7.30 AM", },
    { msgText: "msg10", Time: "8.00 AM", },
    { msgText: "msg11", Time: "7.15 AM", },
    { msgText: "msg12", Time: "7.45 AM", },
    { msgText: "msg14", Time: "9.00 PM", },
    { msgText: "msg15", Time: "2.00 PM", },
  ];

  return (
    <>
    <div className='row'>
    <div
          className="container mb-5 justify-content-center align-items-center "
          style={{
            padding: "1rem",
            marginLeft: window.innerWidth < 576 ? "2rem" : "3rem"
  
          }}
      >
      <h5 className="fw-bold" style={{margin:"7px"}}>Messages</h5>
     
 <ul className="list-group list-group-flush" style={{ maxHeight: "300px" ,borderRadius: "10px"}}>

{
  messages.map((item) => (
<li  className="list-group-item d-flex justify-content-between align-items-center">
           {item.msgText}
            <span className="text-muted small">{item.Time}</span>
          </li>
  ))
}

</ul>
      
      </div>
      
    </div>
    </>
  )
}

export default SuperAdminMessages
