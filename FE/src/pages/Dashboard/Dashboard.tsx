import { useRef, useEffect, useState, createRef } from 'react'
import { axiosInstance } from '../../utils/axios'
import { io } from 'socket.io-client';
import styles from './styles.module.css'
import Peer from 'peerjs';
import { createMediaStreamFake } from '../../utils/mediaStreamFake';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { Portal } from '../../components/Portal/Portal';

export const DashboardPage = () => {
    // const videoRef = useRef(null)
    const [myPeer, setMyPeer] = useState(null)
    const [modalData, setModalData] = useState(null)
    const [names, setDangerNames] = useState([])

    const [peers, setPeers] = useState<Record<string, MediaStream>>({
        "LastName1": createMediaStreamFake(),
        "LastName2": createMediaStreamFake(),
        "LastName3": createMediaStreamFake(),
        "LastName4": createMediaStreamFake(),
        "LastName5": createMediaStreamFake(),
        "LastName6": createMediaStreamFake(),
        "LastName7": createMediaStreamFake(),
    })

    useEffect(() => {
        if (myPeer) {
            console.log("myPeer", myPeer._id)
            myPeer.on('open', () => {
                console.log("dashboard")
            })

        }
    }, [myPeer])

    const modalStreamHandler = ({ title, stream }: { title: string, stream: MediaStream }) => {
        setModalData({ title, stream })
    }


    useEffect(() => {
        const socket = io("http://localhost:3001")
        socket.on("stream", (stream: any) => {
            console.log("12", stream)
            {/* @ts-ignore */ }
            videoRef.current.srcObject = stream

        });
        socket.on('message', msg => {
            console.log(msg)
        })
        socket.on('focus', (user) => {
            setTimeout(() => {
                setDangerNames(prevValue => prevValue.filter(name => name !== user.name))
            }, 10000)
            setDangerNames(prevValue => [...prevValue, user.name])
        })
        const peer = new Peer("ProffesorAlba", {
            host: "localhost",
            port: 9000,
            path: "/",
            secure: false
        })
        peer.on('open', () => {
            console.log("dashboard")
        })
        peer.on('connection', function (conn) {
            console.log('conn', conn)
            conn.on('data', function (data) {
                console.log(data);
            });
            conn.on('close', function () {
                console.log('connection closed')
            })
        });

        peer.on('call', async function (call) {
            if (navigator.mediaDevices.getDisplayMedia) {
                try {
                    call.answer(createMediaStreamFake());
                    call.on('stream', function (remoteStream) {
                        if (!Object.keys(peers).includes(call.metadata.userName)) {
                            setPeers(prevState => ({
                                ...prevState,
                                [call.metadata.userName]: remoteStream
                            }))
                        }
                    });
                } catch (e) {
                    console.log(e)
                }
            }
        });
        peer.on('close', function(){
            console.log('close event')
            const activePeers = Object.entries(peers).filter(([key,value]) => value.active)
            setPeers(Object.fromEntries(activePeers))
        })
        peer.on('disconnected', function(){
            console.log('disconnected event')
            const activePeers = Object.entries(peers).filter(([key,value]) => value.active)
            setPeers(Object.fromEntries(activePeers))
        })
        // @ts-ignore
        socket.emit('join-room', { profId: "ProffesorAlba", peerId: peer._id })

        return () => {
            setModalData(null)
        }
    }, [])

    return (
        <div className={styles.dashboardPage}>
            <div>
                <h3 className={styles.dashboardTitle}>Dashboard</h3>

            </div>
            <div className={styles.streamBlock}>
                {Object.entries(peers).map(([key, value]) => {
                    return (
                        <div className={styles.vpContainer} key={key} >
                            <span className={`${styles.vpTitle} ${names.includes(key) ? styles.danger : ""}`}>{key}</span>
                            <VideoPlayer stream={value} onClick={() => modalStreamHandler({ title: key, stream: value })} />
                        </div>
                    )
                })}
            </div>
            {
                modalData ?
                    <Portal>
                        <div className={styles.modalStream}>
                            <VideoPlayer className={styles.modalVP} stream={modalData.stream} />
                        </div>
                    </Portal> : <></>
            }

        </div>
    )
}