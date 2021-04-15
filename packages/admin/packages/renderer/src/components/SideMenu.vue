<template>
  <el-menu
    default-active="/"
    class="w-36 h-screen"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <div class="menu-title h-16 text-center">
      <span class="leading-16 text-yellow-400">Kokodayo</span>
    </div>
    <el-menu-item
      v-for="(route, index) in routerList"
      :key="index"
      :index="route.url"
    >
      <!-- <i :class="route.icon"></i> -->
      <template #title>{{ route.title }}</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ElMenu, ElMenuItem } from 'element-plus'

ref: routerList = [
  {
    url: '/',
    icon: 'el-icon-s-home',
    title: '首页',
  },
  {
    url: '/about',
    icon: 'el-icon-menu',
    title: '测试页',
  },
  {
    url: '/charlist',
    icon: 'el-icon-user-solid',
    title: '干员一览',
  },
  {
    url: '/chardetail/p_char_010_chen',
    icon: 'el-icon-user-solid',
    title: '干员详情',
  },
  {
    url: '/',
    icon: 'el-icon-user-solid',
    title: '敌人一览',
  },
  {
    url: '/qrcode',
    icon: 'el-icon-user-solid',
    title: '扫码登录',
  },
]
</script>
