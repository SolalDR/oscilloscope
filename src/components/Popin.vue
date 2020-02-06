<template>
  <div class="popin">
    <button class="popin__close" @click="$emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1" stroke-linecap="round" stroke-linejoin="arcs"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
    <slot/>
  </div>
</template>

<style lang="sass">
.popin
  position: fixed
  top: 50%
  left: 50%
  transform: translateX(-50%) translateY(-50%)
  padding: 50px 40px
  background-color: white
  border: 1px solid black
  border-radius: 20px
  max-width: 350px
  width: 100%
  
  &__close
    position: absolute
    top: 10px
    right: 10px
    display: block
    height: 40px
    width: 40px
    margin: 0
    background: transparent
    border: 0
    

    svg
      display: block
      width: 100%
      height: 100%
</style>
