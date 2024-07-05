import { useState, useEffect, useRef } from 'react'
import { baseURL } from 'src/constants/apiBaseUrl'
import { io } from 'socket.io-client'

export const useNotificationSocket = () => {
    const token = localStorage.getItem('token')
    const webSocketRef = useRef(null)
    const [newNotification, setNewNotification] = useState({})

    useEffect(() => {
        if(!token) return 

        webSocketRef.current = io(baseURL, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        webSocketRef.current.on('notifications', (e) => {
            setNewNotification(e)
        })
        return () => webSocketRef.current.close()
    }, [token])
    
    return newNotification
}