import React, { useState, useEffect } from 'react'

export default function join(props) {
    const [name] = useState(props.name ? props.name[0].toUpperCase() + props.name.slice(1) : "")
    const [session] = useState(props.session)
    const [host, updateHost] = useState("")
    const [buzzed, updateBuzzed] = useState(false)
    const [buzzerList, updateBuzzerList] = useState([])
    const [sessionError, updateSessionError] = useState(false)
    const [hostDisconnected, updateHostDisconnected] = useState(false)

    const socket = props.socket

    if (!props.name) {
        props.history.push("/")
    } else {
        useEffect(() => {
            socket.on("session_data", data => {
                if (data.session_data !== -1) {
                    updateHost(data.session_data.host)
                }
                else {
                    updateSessionError(true)
                }
            })
            
            socket.on("buzz_added", data => {
                if (data.session === session) {
                    updateBuzzerList(data.buzz_list)
                    updateBuzzed(true)
                }
            })
            
            socket.on("buzzers_cleared", () => {
                updateBuzzerList([])
                updateBuzzed(false)
            })

            socket.on("host_disconnect", data => {
                if (data.session === session) {
                    props.handleSessionClear()
                    updateHostDisconnected(true)
                }
            })

            socket.emit("join_session", { session: session })
        }, [])
    }
    
    const handleBuzz = () => {
        if (!buzzed) {
            socket.emit("buzz", { session: session, name: name })
        }
    }

    const renderBuzzedText = () => {
        if (!buzzed || buzzerList.length == 0) {
            return "BUZZ"
        } else {
            return buzzerList.findIndex(value => value == name ) + 1
        }
    }

   return (
       <div className='join-wrapper'>
            {!sessionError ? session && host ? !hostDisconnected ? <div className="join-wrapper-with-session">
                <h5>Your session name:<br/>{session}</h5>
                <h5>Session Host:<br/>{host}</h5>
                <button onClick={handleBuzz} style={{backgroundColor: buzzed ? "limegreen" : "red", borderColor: buzzed ? "green" : "darkred"}}>{renderBuzzedText()}</button>
            </div>
            : <div className="join-wrapper-with-error">
                <h3>Host Disconnected...</h3>
                <button onClick={() => props.history.push("/")}>Return Home</button>
            </div>
            : <div className="join-wrapper-without-session">
                <h3>Joining Session...</h3>
            </div>
            : <div className="join-wrapper-with-error">
                <h3>Session not found...</h3>
                <button onClick={() => props.history.push("/")}>Back</button>
            </div>}
       </div>
   )
}