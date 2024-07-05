import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNotifications, useSetNotifications } from './GlobalContext'
import { baseURL } from 'src/constants/apiBaseUrl'
import { io } from 'socket.io-client'


export const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
    const token = localStorage.getItem('token')
    const socketRef = useRef(null)
    const notifications = useNotifications()
    const setNotification = useSetNotifications()
    const [socket, setSocket] = useState()

    useEffect(() => {
        if(!token) return 

        socketRef.current = io(baseURL, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        setSocket(socketRef.current)
        socketRef.current.on('notifications', (e) => {
            handNewNotification(e)
        })
        return () => socketRef.current.close()
    }, [token])

    const handNewNotification = (e) => {
        let tempNotifications = notifications.map(obj => ({...obj}))
        tempNotifications.unshift(e)
        setNotification(tempNotifications)
    }

    return (
        <SocketContext.Provider value={socket} >
            {children}
        </SocketContext.Provider>
    )
}