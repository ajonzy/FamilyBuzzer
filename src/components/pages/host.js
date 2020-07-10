import React, { useState, useEffect } from 'react'

export default function host(props) {
    const [name] = useState(props.name ? props.name[0].toUpperCase() + props.name.slice(1) : "")
    const [session, updateSession] = useState("")
    const [buzzerList, updateBuzzerList] = useState([])

    const socket = props.socket
    let sess

    if (!props.name) {
        props.history.push("/")
    } else {
        useEffect(() => {
            socket.on("session_created", data => {
                updateSession(data.session)
                sess = data.session
            })
        
            socket.on("new_buzz", data => {
                if (data.session === sess) {
                    updateBuzzerList(data.buzz_list)
                }
            })
            
            socket.emit('host_user', { host: name })
        }, [])
    }

    const renderBuzzers = () => {
        const buzzers = []

        for (let user of buzzerList) {
            buzzers.push(
                <h3 key={user} className="buzzer">{user}</h3>
            )
        }

        return buzzers
    }

    const clearBuzzers = () => {
        console.log("clear")
        socket.emit("clear_buzzers", { session: session })
        updateBuzzerList([])
    }

   return (
       <div className='host-wrapper'>
            {session ? <div className="host-wrapper-with-session">
                <h5>Your session name:<br/>{session}</h5>
                {buzzerList.length > 0 ? <h2>Player Buzzed!</h2> : <h2>Waiting for a Buzz...</h2>}
                {renderBuzzers()}
                {buzzerList.length > 0 ? <button onClick={clearBuzzers}>Next Question!</button> : null}
            </div>
            : <div className="host-wrapper-without-session">
                <h3>Building new session...</h3>
            </div>}
       </div>
   )
}