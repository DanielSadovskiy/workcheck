import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { axiosInstance } from "../../utils/axios"
import { isValidURL, matchParse } from "../../utils/matchParse"
import styles from "./styles.module.css"

const getPolicies = ({ name }: { name: string }) => {
    return axiosInstance.get<{ policies: string[] }>('/professor/getPolicies', { params: { name } })
}

interface IChangeOldPasswordRequest {
    id: string
    oldPassword: string
    newPassword: string
}

const changePassword =  ({id, oldPassword, newPassword}: IChangeOldPasswordRequest) => {
    return  axiosInstance.post('/professor/changeOldPassword', {
        id, oldPassword, newPassword
    })
}

interface IAddPolicyRequest {
    id: string
    policy: string
}

const addNewPolicy = ({id, policy}: IAddPolicyRequest) => {
    return  axiosInstance.put('/professor/addNewPolicy', {
        id, policy
    })
}

const removePolicy = ({id, policy}: IAddPolicyRequest) => {
    return  axiosInstance.delete('/professor/removePolicy', {
        data: {id, policy}
    })
}


export const SettingsPage = () => {
    const [policies, setPolicies] = useState([])
    const [fieldsState, setFieldsState] = useState({
        oldPassword: {
            value: "",
            type: "password"
        },
        newPassword: {
            value: "",
            type: "password"
        },
        confirmPassword: {
            value: "",
            type: "password"
        }
    })
    const [newPolicy, setNewPolicy] = useState("")

    const getPoliciesHandler = async ({ name }: { name: string }) => {
        try {
            const userName = JSON.parse(localStorage.getItem('user')).name
            const { data } = await getPolicies({ name: userName })
            setPolicies(data.policies)
        } catch (err) {
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {
        getPoliciesHandler({ name: "Admin" })
    }, [])

    const togglePassword = ( name ) => {
        if (fieldsState[name].type === "password") {
            setFieldsState({
                ...fieldsState,
                [name]: {...fieldsState[name], type: "text"}
            })
        } else {
            setFieldsState({
                ...fieldsState,
                [name]: {...fieldsState[name], type: "password"}
            })
        }
    }

    const changeFieldValue = (e) => {
        const {name, value} = e.target
        setFieldsState({
            ...fieldsState,
            [name]: {...fieldsState[name], value}
        })
    }

    const getPasswordValue = (name) => {
        return fieldsState[name].value
    }

    const getPasswordType = (name) => {
        return fieldsState[name].type
    }

    const toggleShowPassBtn = (name) => {
        return (
            <span className={styles.showBtn} onClick={() => togglePassword(name)}>
                {getPasswordType(name) === "password" ? "show" : "hide"}
            </span>
        )
    }

    const setNewPolicyHandler = (e) => {
        const {value} = e.target
        setNewPolicy(value)
    }

    const addNewPolicyHandler = async (e) => {
        if(e.keyCode === 13) {
            if(!isValidURL(newPolicy)){
                toast.error("URL in not valid format")
            } else {
                try{
                const newPolicyURL = matchParse(newPolicy)
                const userId = JSON.parse(localStorage.getItem('user')).id
                const {data} = await addNewPolicy({id:userId, policy:newPolicyURL })
                setPolicies([...policies, data.policy])
                toast.success(data.message)
                } catch(e) {
                    toast.error(e.response.data.message)
                }
            }
        }
    }

    const removePolicyHandler = async (policy: string) => {
        try {
            const userId = JSON.parse(localStorage.getItem('user')).id
            const {data} = await removePolicy({id:userId, policy })
            setPolicies(prevState => prevState.filter(plc => plc !== data.policy))
            toast.success(data.message)
        } catch(e) {
            toast.error(e.response.data.message)
        }
    }

    const saveNewPassword = async () => {
        const oldPassword = fieldsState.oldPassword.value
        const newPassword = fieldsState.newPassword.value
        const confirmPassword = fieldsState.confirmPassword.value

        if(newPassword !== confirmPassword) {
            toast.error("New password is not equal to confirm password")
        } else {
            try {
                const user = JSON.parse(localStorage.getItem('user'))
                const response = await changePassword({ id: user.id, oldPassword, newPassword })
                toast.success(response.data)
                setFieldsState(
                    {
                        oldPassword: {
                            value: "",
                            type: "password"
                        },
                        newPassword: {
                            value: "",
                            type: "password"
                        },
                        confirmPassword: {
                            value: "",
                            type: "password"
                        }
                    }
                )
                
            } catch (err) {
                toast.error(err.response.data.message)
            }
        }
    }

    return (
        <div className={styles.settingsPage}>
            <div className={styles.changePasswordContainer}>
                <h3 className={styles.title}>Change Password</h3>
                <div className={styles.inputBox}>
                    <label htmlFor="">Provide your current password:</label>
                    <input type={getPasswordType("oldPassword")} maxLength={16} name="oldPassword" value={getPasswordValue("oldPassword")} onChange={(e) => changeFieldValue(e)} className={styles.inputField} />
                    {toggleShowPassBtn("oldPassword")}
                </div>
                <div className={styles.inputBox}>
                    <label htmlFor="">Your new password:</label>
                    <input type={getPasswordType("newPassword")} maxLength={16} name="newPassword" value={getPasswordValue("newPassword")} onChange={changeFieldValue} className={styles.inputField} />
                    {toggleShowPassBtn("newPassword")}
                </div>
                <div className={styles.inputBox}>
                    <label htmlFor="">Confirm your current password:</label>
                    <input type={getPasswordType("confirmPassword")} maxLength={16} name="confirmPassword" value={getPasswordValue("confirmPassword")} onChange={changeFieldValue} className={styles.inputField} />
                    {toggleShowPassBtn("confirmPassword")}
                </div>
                <button className={styles.saveBtn} onClick={saveNewPassword}>Save</button>
            </div>
            <div className={styles.changePolicyContainer}>
                <h3 className={styles.title}
                >Change Access Policy
                </h3>
                {policies.length ? <ul className={styles.policiesList}>
                    {
                        policies.map(policy => {
                            return (
                                <li key={policy} className={styles.listItem}>
                                    <span>{policy}</span>
                                    <button onClick={() => removePolicyHandler(policy)}>X</button>
                                </li>
                            )
                        })
                    }
                </ul> : <></>}
                <label htmlFor="">Add new policy</label>
                <input type="text" value={newPolicy} onKeyDown={(e) => addNewPolicyHandler(e)} onChange={(e) => setNewPolicyHandler(e)} className={styles.inputField} placeholder={"Press ENTER to save"} />
            </div>
        </div>
    )
}