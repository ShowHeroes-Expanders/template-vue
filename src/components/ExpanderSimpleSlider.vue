<template>
  <div class="wrapper">
    <div class="slider" ref="slider">
      <Transition mode="out-in">
        <p v-html="current" :key="active"></p>
      </Transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ExpanderSimpleSlider',
    data() {
      return {
        active: 0,
        items: [
          '43% af ledere ved ikke, at der findes støtteordninger for ansatte med psykiske problemer.',
          'Læs mere om støtteordningerne her',
        ]
      }
    },
    mounted() {
      setInterval(() => {
        let next = this.active + 1
        if (next >= this.items.length)
          next = 0
        this.active = next
      }, 5000)
    },
    computed: {
      current() {
        return this.items[this.active]
      }
    }
  }
</script>

<style scoped lang="scss">
  @use '@/scss/variables.scss' as *;
  @use '@/scss/mixins.scss' as *;

  .slider {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 9.3125rem;
    padding: .5rem 2rem;
    background: linear-gradient(90deg, #004638 0%, #008D71 100%);
    p {
      position: absolute;
      font-size: 2.25rem;
      font-weight: 700;
      color: $color-3;
      text-align: center;
    }
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

</style>

