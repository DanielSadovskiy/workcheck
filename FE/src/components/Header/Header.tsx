import styles from './styles.module.css'
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const settingsHandler = () => {
        navigate('/settings')
    }

    const dashboardHandler = () => {
        navigate("/dashboard")
    }

    const logoutHandler = () => {
        localStorage.removeItem("user")
        navigate("/login")
    }
    return (
        <header className={styles.header}>
            <h2 className={styles.title}>Work Check</h2>
            <div className={styles.navBtns}>
                {localStorage.getItem("user") ? (
                    <>
                    {pathname === '/settings' ? (
                        <button onClick={dashboardHandler}>Dashboard</button>
                    ) : (
                        <button onClick={settingsHandler}>Settings</button>
                    )}
                     <button onClick={logoutHandler}>Logout</button>
                    </>) : <></>
                }
            </div>
        </header>
    )
}