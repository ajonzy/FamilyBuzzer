import React, { useState, useEffect } from 'react'

export default function host(props) {
    const [name] = useState(props.name ? props.name[0].toUpperCase() + props.name.slice(1) : "")
    const [session, updateSession] = useState()
    const [user, updateUser] = useState()
    const [buzzerList, updateBuzzerList] = useState([])


    if (!props.name) {
        props.history.push("/")
    } else {
        useEffect(() => {
            let intervalID

            if (!session) {
                fetch("https://jonesfamilybuzzerapi.herokuapp.com//session/create", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ name: name })
                })
                .then(response => response.json())
                .then(data => {
                    updateSession(data.session)
                    updateUser(data.user)
                })
                .catch(error => console.log(error))
            } else {
                intervalID = setInterval(checkBuzzers, 100)
            }
    
            return () => {
                clearInterval(intervalID)
            }
        })
    }

    const checkBuzzers = () => {
        fetch(`https://jonesfamilybuzzerapi.herokuapp.com//buzzer_list/get/usernames/session/${session.id}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => updateBuzzerList(data))
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
        fetch(`https://jonesfamilybuzzerapi.herokuapp.com//buzzer_list/delete/session/${session.id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => updateBuzzerList([]))
        .catch(error => console.log(error))
    }

   return (
       <div className='host-wrapper'>
            {session ? <div className="host-wrapper-with-session">
                <h5>Your session name:<br/>{session.name}</h5>
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