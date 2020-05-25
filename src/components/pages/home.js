import React, {useState} from 'react'
import DownArrow from "../../../static/assets/down_arrow.png"

export default function home(props) {
    const [nameError, updateNameError] = useState(false)
    const [sessionError, updateSessionError] = useState(false)

    const handleHost = () => {
        updateNameError(false)

        if (!props.name) {
            updateNameError(true)
        } else {
            props.history.push("/host")
        }
    }

    const handleJoin = () => {
        updateNameError(false)
        updateSessionError(false)

        if (!props.name) {
            updateNameError(true)
        } else if (!props.session) {
            updateSessionError(true)
        } else {
            props.history.push("/join")
        }
    }

   return (
       <div className='home-wrapper'>
            <div className="instructions-wrapper">
                <h2>Start Here</h2>
                <img src={DownArrow} alt=""/>
                <input type="text" placeholder="Your Name" value={props.name} onChange={() => props.handleUpdate("name")}/>
                <div className="error" style={{color: "red", visibility: nameError ? "visible" : "hidden"}}>Please enter your name</div>
                <h3>Then either start a new session, or enter the name of an existing one to join!</h3>
            </div>

            <div className="choice-wrapper">
                <button onClick={handleHost}>Host Session</button>
                <h6>-or-</h6>
                <input type="text" placeholder="Session Name" value={props.session} onChange={() => props.handleUpdate("session")}/>
                <div className="error" style={{color: "red", visibility: sessionError ? "visible" : "hidden"}}>Please enter a session name</div>
                <button onClick={handleJoin}>Join Session</button>
            </div>
       </div>
   )
}