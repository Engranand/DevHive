const { Server } = require('socket.io')

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
      ],
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    // Naya user connect hua
    console.log('Connected:', socket.id)

    // User project room mein join karna chahta hai
    socket.on('join_project', (projectId) => {
      socket.join(`project:${projectId}`)
      console.log(`${socket.id} joined project:${projectId}`)
    })

    // Koi task move kiya — sabko batao
    socket.on('task_moved', (data) => {
      console.log(`Task ${data.taskId}: ${data.from} → ${data.to}`)
      // Us project room ke SABKO broadcast karo
      io.to(`project:${data.projectId}`).emit('task_moved', data)
    })

    // User disconnect hua
    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id)
    })
  })

  return io
}

module.exports = { initSocket }