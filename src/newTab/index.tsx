import axios from 'axios';
import React from 'react';
import {createRoot} from 'react-dom/client'
import "../tailwind.css"

const NewTab = () => {

    // useEffect(() => {
    //     axios.get("http://localhost:3000/").then((response) => {
    //       console.log(response)
    //     });
    //   }, [])

    return (<div>
        <h1 className='bg-yellow-500'>Hello tab</h1>   
    </div>)
}
 

function init() {
    const appContainer = document.createElement('div')
    document.body.appendChild(appContainer)
    if(!appContainer){
        throw new Error("There is no app container")
    }
    const root = createRoot(appContainer)
    root.render(<NewTab/>)
}

init()