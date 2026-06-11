import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export const useSocket = (projectId, onTaskMoved) => {
  const socketRef = useRef(null)

  useEffect(() => {
    if (!projectId) return

    const socket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    })

    socketRef.current = socket

    socket.emit('join_project', projectId)
    console.log('Joined room:', projectId)

    socket.on('task_moved', (data) => {
      console.log('Received:', data)
      if (onTaskMoved) onTaskMoved(data)
    })

    return () => {
      socket.emit('leave_project', projectId)
      socket.disconnect()
    }
  }, [projectId])

  return socketRef
}