<template>
  <div class="wrapper">
    <div class="slider" ref="slider">
      <article class="item" :class="`item-${index}`" v-for="item, index in items" :key="item">
        <a :href="item.url" target="_blank" class="inner" :data-name="item.title">
          <div class="image">
            <img :src="getImage(item.image)">
          </div>
          <div class="info">
            <h1 class="title">{{ item.title }}</h1>
            <p v-html="item.text"></p>
          </div>
        </a>
      </article>
    </div>
  </div>
</template>

<script>
  import {tns} from 'tiny-slider'

  export default {
    name: 'ExpanderSlider',
    data() {
      return {
        items: [
          {
            title: '',
            text: '',
            image: '',
            url: '',
          },
        ]
      }
    },
    mounted() {
      tns({
        container: this.$refs.slider,
        items: 1,
        gutter: 20,
        controls: false,
        nav: false,
        autoplay: true,
        autoplayTimeout: 2000,
        autoplayButtonOutput: false,
        speed: 750,
        loop: true
      });
    },
    methods: {
      getImage(image) {
        return require(`@/assets/slider/${image}`)
      }
    }
  }
</script>

<style lang="scss">
  @use "/node_modules/tiny-slider/src/tiny-slider";
</style>

<style scoped lang="scss">
  @use '@/scss/variables.scss' as *;
  @use '@/scss/mixins.scss' as *;

  .wrapper {
    position: relative;

    .inner {
      display: block;
    }
    
    :deep(.tns-controls) {
      outline: 0;
      button {
        position: absolute;
        top: 0;
        width: 1.75rem;
        height: 100%;
        background: none;
        border: 0;
        text-indent: -2000%;
        overflow: hidden;
        &:first-child {
          left: .5rem;
          // background: url('../assets/arr-l.svg') no-repeat center center / contain;
          @include d {
            left: 1rem;
          }
        }
        &:last-child {
          right: .5rem;
          // background: url('../assets/arr-r.svg') no-repeat center center / contain;
          @include d {
            right: 1rem;
          }
        }
        &[disabled] {
          display: none;
        }
      }
    }

    :deep(.tns-nav) {
      outline: 0;
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      button {
        width: .5rem;
        height: .5rem;
        margin: 0 .375rem;
        background: #888;
        border-radius: 50%;
      }
      .tns-nav-active {
        background: #fff;
      }
    }
  }

</style>

