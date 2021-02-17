<template>
  <div>
    <h1>WebSocket</h1>
    <button @click="start">Start</button>
  </div>
</template>
<script setup lang="ts">
import { io } from 'socket.io-client'
import Axios from 'axios'
import { onMounted } from 'vue'

onMounted(async () => {
  // const res = await Axios.get('/api/api')
  // console.log('hello', res)
})

const socket = io({
  host: 'http://127.0.0.1',
  port: '7001',
  path: '/qr'
})

// socket.open()
// client-side
socket.on('connect', () => {
  console.log('connect', socket.id) // x8WIv7-mJelg7on_ALbx
})

// socket.connect()

socket.on('ok', () => {
  console.log('listen ok')
})
socket.on('disconnect', () => {
  console.log('disconnect', socket.id) // undefined
})
socket.onAny((...args) => {
  console.log('log', ...args)
})
const start = async () => {
  // socket.emit('my')
  socket.emit('drawing')
  console.log(socket)
}
</script>
