import { useEffect, useRef } from "react";
import styles from "./styles.module.css"

export const VideoPlayer: React.FC<{stream?: MediaStream, onClick?: any, className?: string}> = ({ stream, onClick, className }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream]);
    return (
        <video
            className={`${styles.vpPlayer} ${className}`}
            data-testid="peer-video"
            ref={videoRef}
            autoPlay
            muted={true}
            onClick={onClick}
        />
    );
};