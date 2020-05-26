import React, { useState, useEffect } from 'react'

export default function join(props) {
    const [name] = useState(props.name ? props.name[0].toUpperCase() + props.name.slice(1) : "")
    const [session, updateSession] = useState()
    const [host, updateHost] = useState("")
    const [user, updateUser] = useState()
    const [buzzed, updateBuzzed] = useState(false)
    const [buzzerList, updateBuzzerList] = useState([])
    const [buzzedListReceived, updateBuzzedListReceived] = useState(false)
    const [sessionError, updateSessionError] = useState(false)

    if (!props.name) {
        props.history.push("/")
    } else {
        useEffect(() => {
            let intervalID

            if (!session) {
                initializer()
            } else if (buzzed) {
                intervalID = setInterval(checkBuzzers, 2000)
            }

            return () => {
                clearInterval(intervalID)
            }
        })
    }

    const initializer = async () => {
        let sessionTemp

        await fetch(`https://jonesfamilybuzzerapi.herokuapp.com//session/get/name/${props.session}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            updateSession(data)
            sessionTemp = data
        })
        .catch(error => console.log(error))

        if (sessionTemp) {
            if (Object.keys(sessionTemp).length === 0) {
                updateSessionError(true)
            } else {
                await fetch("https://jonesfamilybuzzerapi.herokuapp.com//user/create", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ 
                        name: name,
                        session_id: sessionTemp.id
                    })
                })
                .then(response => response.json())
                .then(data => updateUser(data))
                .catch(error => console.log(error))
    
                await fetch(`https://jonesfamilybuzzerapi.herokuapp.com//session/get/host/${sessionTemp.id}`, {
                    method: "Get"
                })
                .then(response => response.json())
                .then(data => updateHost(data))
                .catch(error => console.log(error))
            }
        }
    }

    const checkBuzzers = () => {
        if (buzzed) {
            fetch(`https://jonesfamilybuzzerapi.herokuapp.com//buzzer_list/get/usernames/session/${session.id}`, {
                method: "GET"
            })
            .then(response => response.json())
            .then(data => {
                if (data.length == 0 && buzzedListReceived) {
                    updateBuzzerList(data)
                    updateBuzzed(false)
                    updateBuzzedListReceived(false)
                }
            })
        }
    }

    const handleBuzz = async () => {
        if (!buzzed) {
            await fetch("https://jonesfamilybuzzerapi.herokuapp.com//buzzer_list/add", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    session_id: session.id,
                    user_id: user.id
                })
            })
            .then(response => response.json())
            .then(data => updateBuzzed(true))
            .catch(error => console.log(error))

            await fetch(`https://jonesfamilybuzzerapi.herokuapp.com//buzzer_list/get/usernames/session/${session.id}`, {
                method: "GET"
            })
            .then(response => response.json())
            .then(data => {
                updateBuzzerList(data)
                updateBuzzedListReceived(true)
            })
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
            {!sessionError ? session && host ? <div className="join-wrapper-with-session">
                <h5>Your session name:<br/>{session.name}</h5>
                <h5>Session Host:<br/>{host.name}</h5>
                <button onClick={handleBuzz} style={{backgroundColor: buzzed ? "limegreen" : "red", borderColor: buzzed ? "green" : "darkred"}}>{renderBuzzedText()}</button>
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