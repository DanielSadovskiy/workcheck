import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { createRoot } from 'react-dom/client'
import "./popup.css";
import "../tailwind.css"


const Test = () => {
    const [isEnabled, toggle] = useState(false)
    const [user, setUser] = useState(null)
    // const ENDPOINT = 'ws://localhost:3002';
    // const socket = io(ENDPOINT)

    const handleToggleExtension = () => {
        toggle(prevValue => !prevValue)
    }

    const [name, setName] = useState("")
    const [profId, setProfId] = useState("")

    useEffect(() => {
        chrome.storage.sync.get(["isEnabled"], (res) => {
            if (res.isEnabled) {
                toggle(true)
            }
        })
        chrome.storage.sync.get(["User"], ({ User }) => {
            if(User) setUser({ name: User?.name, profId: User?.profId })
        })

    }, [])

    const login = () => {
        chrome.storage.sync.set({ "User": { name, profId } }, () => {
            setUser({ name, profId })
            console.log("User is connected as: ", { name, profId })
        })

        // socket.emit('login', { name }, (response: any) => {
        //     if (response.error) {
        //         console.log(response.error)
        //         alert(response.error)
        //     } else {
        //         alert("Success")
        // localStorage.setItem('user', JSON.stringify(response.user))
        // setUser(response.user)
        // toast("You are logged in")
        //         }

        //     })
    }

    console.log('state', user)

    useEffect(() => {
        chrome.storage.sync.set({ isEnabled }, () => {
            console.log("isEnabled equales to: ", isEnabled)
        })
    }, [isEnabled])

    return (!user ? (<div>
        <h1 className={`bg-green-300 text-center py-10 text-4xl font-bold text-green-800`}>Check Work Extension</h1>
        <div className="p-12 flex justify-center items-center flex-col">
            <input disabled={!isEnabled} value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Please, provide your name...' className="mb-8 w-full" />
            <input disabled={!isEnabled} value={profId} onChange={(e) => setProfId(e.target.value)} type="text" placeholder="Please, provide your group ID..." className="mb-8 w-full" />
            <button disabled={!isEnabled} onClick={login} className="mb-24 bg-green-700 hover:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.8)] text-white font-bold py-1  rounded text-lg w-6/12 disabled:opacity-25 disabled:shadow-none">
                Submit
            </button>
            <button id="toggleExtension" onClick={handleToggleExtension} className={`${isEnabled ? 'bg-red-700' : 'bg-green-700'} w-full hover:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.8)] text-white font-bold py-2 px-4 rounded text-2xl`}>
                {isEnabled ? "Disable" : "Enable"}
            </button>
        </div>

    </div>) : (
        <div>
            <div>
                <span>You are: {user.name}</span>
                <span>You are connected to: {user.profId}</span>
                <span>Allowed resouces:</span>
                <button>logout</button>
                <ul>

                </ul>
                <button id="toggleExtension" onClick={handleToggleExtension} className={`${isEnabled ? 'bg-red-700' : 'bg-green-700'} w-full hover:shadow-[0px_0px_10px_0px_rgba(0,0,0,0.8)] text-white font-bold py-2 px-4 rounded text-2xl`}>
                    {isEnabled ? "Disable" : "Enable"}
                </button>
                <button onClick={() => {
                    console.log('logout')
                    setUser(null)
                    chrome.storage.sync.clear()
                }}>Logout</button>
            </div>
        </div>)
    )
}


function init() {
    const appContainer = document.createElement('div')
    document.body.appendChild(appContainer)
    if (!appContainer) {
        throw new Error("There is no app container")
    }
    const root = createRoot(appContainer)
    root.render(<Test />)
}

init()