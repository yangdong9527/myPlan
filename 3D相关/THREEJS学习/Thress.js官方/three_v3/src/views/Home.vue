<template>
  <div class="page-wrapper">
    目录
    <ul>
      <router-link :to="`/${path}`" v-for="path in list" :key="path">
        <li>{{path}}</li>
      </router-link>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const useRouteListHook = () => {
  const contexts = require.context('../views', true, /\.vue$/)
  const list: string[] = []
  contexts.keys().forEach(path => {
    const name = path.replace(/^\.\/(.*)\.vue$/, '$1')
    console.log(name)
    list.push(name)
  })
  return list
}
export default defineComponent({
  name: 'Home',
  setup () {
    const list = useRouteListHook()
    return { list }
  }
})
</script>
