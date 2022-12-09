import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { axiosInstance } from '../../utils/axios'
import styles from './styles.module.css'


type ILoginUserRequest = {
    name: string,
    password: string
}


const loginUser = ({ name, password }: ILoginUserRequest) => {
    return axiosInstance.post('/professor/login', {
        name, password
    })
}

export const LoginPage = () => {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
     if(localStorage.getItem('user')) {
        navigate('/dashboard')
     }
    }, [])

    const handleName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        setName(value)
    }

    const handlePassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(value)
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const { data } = await loginUser({ name, password })
            localStorage.setItem("user", JSON.stringify(data.user))
            toast.success("Successful Login")
            navigate("/dashboard")
        } catch (err) {
            toast.error(err.response.data.message)
        }
    }

    return (
        <form className={styles.loginForm} onSubmit={handleLogin}>
            <h2 className={styles.title}> Provide data to connect</h2>
            <input type="text" onChange={handleName} value={name} placeholder="Please, provide your name" className={styles.nameInput} required/>
            <input type="password" onChange={handlePassword} value={password} placeholder="Please, provide your password" className={styles.roomInput} required/>
            <button className={styles.loginBtn} type="submit">Login</button>
        </form>
    )
}