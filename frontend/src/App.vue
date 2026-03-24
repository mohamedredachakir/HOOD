<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
    <div class="max-w-4xl w-full text-center space-y-8">
      <h1 class="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        EcomCom Full-Stack
      </h1>
      <p class="text-xl text-slate-400">
        Laravel API + PostgreSQL + Vue.js + Docker
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div class="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all cursor-default">
          <h2 class="text-2xl font-bold mb-4">Backend Status</h2>
          <div :class="backendStatus ? 'text-green-400' : 'text-yellow-400'" class="flex items-center justify-center gap-2">
            <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            {{ backendStatus ? 'Connected to Laravel' : 'Connecting...' }}
          </div>
        </div>
        
        <div class="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all cursor-default">
          <h2 class="text-2xl font-bold mb-4">Database</h2>
          <div class="text-slate-400">
            PostgreSQL 16 High Performance
          </div>
        </div>
      </div>

      <div class="mt-12 text-slate-500 text-sm">
        Powered by <a href="#" class="text-blue-400 hover:underline">Antigravity</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const backendStatus = ref(false)

onMounted(async () => {
  try {
    const response = await fetch('/api/user')
    if (response.ok) backendStatus.value = true
  } catch (e) {
    console.log('Backend not ready yet')
  }
})
</script>

<style>

body {
  margin: 0;
  font-family: 'Inter', -apple-system, sans-serif;
}
</style>
