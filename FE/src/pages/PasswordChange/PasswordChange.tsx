import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { axiosInstance } from '../../utils/axios'
import styles from './styles.module.css'


type IChangePasswordRequest = {
    id: string
    password: string
}


const changePassword =  ({id, password}:IChangePasswordRequest) => {
    return  axiosInstance.post('/professor/changePassword', {
        id, password
    })
}

export const PasswordChangePage = () => {
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handlePassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(value)
    }

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            const response = await changePassword({ id: user.id, password })
            console.log(response)
            toast.success(response.data)
            localStorage.setItem('user', JSON.stringify({...user, passwordIsChanged: true}))
            navigate("/dashboard")
            
        } catch (err) {
            toast.error(err.response.data.message)
        }
    }

    return (
        <form className={styles.loginForm} onSubmit={handlePasswordChange}>
            <p className={styles.title}> You are required to change password</p>
            <input type="text" onChange={handlePassword} value={password} placeholder="Please, provide your new password" className={styles.passwordInput} />
            <button className={styles.changePasswordBtn} type="submit">Change Password</button>
        </form>
    )
}