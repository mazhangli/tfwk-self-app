<template>
  <h1>{{ msg }}</h1>
  <van-button type="primary" @click="count++">count is: {{ count }}</van-button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components(){
  },
  data() {
    return {
      count: 0
    }
  }
}
</script>
