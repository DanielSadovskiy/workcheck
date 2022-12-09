import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client'
import Peer from "peerjs"
import "../tailwind.css"

const ContentScript = () => {
    let stream: MediaStream;
    let videoRef = useRef(null)
    let socket = null;
    let peer: Peer;
    useEffect(() => {
        chrome.storage.sync.get(["isEnabled"], (res) => {
            if (res.isEnabled) {
                chrome.storage.sync.get("User", res => {
                    if(res.User){
                        peer = new Peer(res.User.name, {
                            host: "localhost",
                            port: 9000,
                            path: "/",
                            secure: false
                        })
                        const conn = peer.connect(res.User.profId)
                        conn.on('open', () => {
                            conn.send("Client connected")
                        })
                        const shareScreen = async () => {
                            if (navigator.mediaDevices.getDisplayMedia) {
                                try {
                                    stream = await navigator.mediaDevices.getDisplayMedia({
                                        audio: false,
                                        video: true 
                                    })
                                    const call = peer.call(res.User.profId, stream, {
                                        metadata: {
                                            userName: res.User.name,
                                        },
                                    });
                                    call.on('stream', function(remoteStream) {
                                        videoRef.current.srcObject = remoteStream
                                    });
                                    stream.getVideoTracks()[0].onended = function () {
                                        conn.close()
                                      };
                                    socket.on('call', (call) => {
                                        call.answer(stream)
                                    })
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                        }
                        shareScreen()
                    }
                })
            }
        })
    }, [])

    return (<div>
        {/* <h1 className='bg-red-500'>Hello content</h1>
        <video
            data-testid="peer-video"
            style={{ width: "100%" }}
            ref={videoRef}
            autoPlay
            muted={true}
        /> */}
    </div>)
}


function init() {
    const appContainer = document.createElement('div')
    document.body.appendChild(appContainer)
    if (!appContainer) {
        throw new Error("There is no app container")
    }
    const root = createRoot(appContainer)
    root.render(<ContentScript />)
}

init()