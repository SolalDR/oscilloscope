<template>
  <div class="informations">
    <div v-for="info in infos" :key="info.name">
      <p>{{ info.name }}</p>
      <p>{{ info.value }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infos: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="sass">
.informations
  position: absolute
  top: 0
  right: 0
</style>
