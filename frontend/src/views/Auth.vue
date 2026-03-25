<script setup>
import { store } from '../store';
import { ref } from 'vue';

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const name = ref('');

const submit = async () => {
    if (isLogin.value) {
        await store.login({ email: email.value, password: password.value });
    } else {
        await store.register({ name: name.value, email: email.value, password: password.value, password_confirmation: password.value });
    }
};
</script>

<template>
  <div class="auth-wrap">
    <div class="auth-box">
       <h1 class="auth-title">{{ isLogin ? 'LOGIN' : 'JOIN' }}</h1>
       <p class="auth-sub">Access your HOOD account.</p>

       <div class="fl" v-if="!isLogin">
          <label class="fl-lbl">Your Name</label>
          <input class="fi" v-model="name" type="text" placeholder="Full Name">
       </div>
       <div class="fl">
          <label class="fl-lbl">Email Address</label>
          <input class="fi" v-model="email" type="email" placeholder="your@email.com">
       </div>
       <div class="fl">
          <label class="fl-lbl">Password</label>
          <input class="fi" v-model="password" type="password" placeholder="••••••••">
       </div>

       <button class="btn-auth" @click="submit">{{ isLogin ? 'LOGIN →' : 'REGISTER →' }}</button>
       
       <div class="auth-toggle">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button @click="isLogin = !isLogin">{{ isLogin ? 'Register' : 'Login' }}</button>
       </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrap { min-height: calc(100vh - 84px); display: flex; align-items: center; justify-content: center; padding: 40px; }
.auth-box { width: 100%; max-width: 400px; border: 1px solid var(--b2); padding: 40px; background: var(--s1); }
.auth-title { font-family: var(--font-d); font-size: 24px; margin-bottom: 8px; }
.auth-sub { font-size: 12px; color: var(--w3); margin-bottom: 32px; }
.fl { margin-bottom: 18px; }
.fl-lbl { display: block; font-size: 10px; color: var(--w3); margin-bottom: 8px; text-transform: uppercase; }
.fi { width: 100%; background: var(--s2); border: 1px solid var(--b2); color: var(--w); padding: 12px; outline: none; }
.btn-auth { width: 100%; background: var(--w); color: var(--void); padding: 14px; font-family: var(--font-d); margin-top: 10px; }
.auth-toggle { margin-top: 24px; text-align: center; font-size: 12px; color: var(--w4); }
.auth-toggle button { color: var(--w); text-decoration: underline; margin-left: 5px; }
</style>
