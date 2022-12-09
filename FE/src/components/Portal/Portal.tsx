import { cloneElement, useEffect,useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../../utils/useClickOutside";
import styles from "./styles.module.css"

export const Portal= ({ children }) => {
    const [mounted, setMounted] = useState(false)
 
    useEffect(() => {
       setMounted(true)
 
       return () => setMounted(false)       
    }, [])

    const ref = useOutsideClick(() => {
        setMounted(!mounted);
      });

      useEffect(() => {
        if (mounted) {
            document.body.classList.add(styles.noScroll)
        } else {
            document.body.classList.remove(styles.noScroll)
        }
    }, [mounted])
    
 
    return mounted
       ? createPortal(<div className={styles.portal} >
           {cloneElement(children, {ref: ref})}
           </div>, 
         document.querySelector("#portal"))
       : null
 }