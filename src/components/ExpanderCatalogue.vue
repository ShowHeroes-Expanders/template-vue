<template>
  <nav class="nav">
    <button @click="prev" class="button prev"><img src="@/assets/arr-l.svg"></button>

    <!-- <button @click="setIndex(index)" class="button" v-for="index in items.length" :key="index" :class="{active: index == currentIndex + 1}">{{ index }}</button> -->

    <span class="counter">
      <span>{{ currentIndex + 1 }}</span>
      <span>/</span>
      <span>{{ totalCount }}</span>
    </span>

    <button @click="next()" class="button next"><img src="@/assets/arr-r.svg"></button>
  </nav>

  <section
    class="catalogue"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <template v-if="direction === 'next'">
      <div class="page" :class="{ 'shadow-incoming': isAnimating }" style="z-index: 1">
        <img :src="getImage(nextIndex)">
      </div>
      <div class="page" :class="{ 'wipe-next': isAnimating, 'wrap-turn': isAnimating && isWrapTurn }" style="z-index: 2" @animationend="onAnimationEnd">
        <img :src="getCurrentImage()">
        <div v-if="isAnimating" class="page-mirror" :class="{ 'wrap-turn': isWrapTurn }">
          <img :src="getCurrentImage()">
        </div>
        <div class="links">
          <a :href="url + utm" target="_blank" class="fallback" :data-name="`Page ${currentIndex+1}`" @click="stopAutoAdvance()"></a>
          <a :href="item.url + utm" target="_blank" v-for="item in currentItem.items" :key="item" class="item" :data-name="`Product - ${item.name || item.id}`" :style="getLinkStyle(item)" @click="stopAutoAdvance()"></a>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="page" style="z-index: 1">
        <img :src="getCurrentImage()">
      </div>
      <div class="page" :class="{ 'wipe-prev': isAnimating, 'wrap-turn': isAnimating && isWrapTurn }" style="z-index: 2" @animationend="onAnimationEnd">
        <img :src="getImage(nextIndex)">
        <div v-if="isAnimating" class="page-mirror-prev" :class="{ 'wrap-turn': isWrapTurn }">
          <img :src="getImage(nextIndex)">
        </div>
        <div class="links">
          <a :href="url + utm" target="_blank" class="fallback" :data-name="`Page ${currentIndex+1}`" @click="stopAutoAdvance()"></a>
          <a :href="item.url + utm" target="_blank" v-for="item in currentItem.items" :key="item" class="item" :data-name="`Product - ${item.name || item.id}`" :style="getLinkStyle(item)" @click="stopAutoAdvance()"></a>
        </div>
      </div>
    </template>
    <div class="preload" aria-hidden="true">
      <img v-for="i in preloadIndices" :key="i" :src="getImage(i)">
    </div>
  </section>

</template>

<script>
  import items from '@/data/items.json'

  export default {
    name: 'ExpanderCatalogue',
    emits: ['track'],
    data() {
      return {
        currentIndex: 0,
        count: 8,
        items,
        url: this.$shClickUrl('main'),
        utm: '',
        touchStartX: 0,
        touchEndX: 0,
        autoAdvanceInterval: null,
        autoAdvanceTimeout: 4000,
        viewedPages: new Set([0]),
        allPagesViewed: false,
        isAnimating: false,
        nextIndex: 1,
        direction: 'next',
        isWrapTurn: false,
      }
    },
    computed: {
      totalCount() {
        return this.count
      },
      currentItem() {
        return this.items[this.currentIndex]
      },
      preloadIndices() {
        return [
          (this.currentIndex + 1) % this.count,
          (this.currentIndex - 1 + this.count) % this.count,
        ]
      },
    },
    methods: {
      getImage(i) {
        return require(`@/assets/images/page-${String(i + 1).padStart(2, '0')}.jpg`)
      },
      getCurrentImage() {
        return this.getImage(this.currentIndex)
      },
      getLinkStyle(item) {
        let style = '';
        style += `left: ${item.x}; `;
        style += `top: ${item.y}; `;
        style += `width: ${item.width}; `;
        style += `height: ${item.height};`;
        return style;
      },
      prev() {
        this.stopAutoAdvance()
        if (this.isAnimating) return
        const isWrap = this.currentIndex <= 0
        this.direction = isWrap ? 'next' : 'prev'
        this.nextIndex = isWrap ? this.totalCount - 1 : this.currentIndex - 1
        this.isWrapTurn = isWrap
        this.isAnimating = true
      },
      next(isAuto = false) {
        if (!isAuto) this.stopAutoAdvance()
        if (this.isAnimating) return
        const isWrap = this.currentIndex >= this.totalCount - 1
        this.direction = isWrap ? 'prev' : 'next'
        this.nextIndex = isWrap ? 0 : this.currentIndex + 1
        this.isWrapTurn = isWrap
        this.isAnimating = true
      },
      onAnimationEnd() {
        this.currentIndex = this.nextIndex
        this.isAnimating = false
      },
      startAutoAdvance() {
        this.autoAdvanceInterval = setInterval(() => {
          this.next(true)
        }, this.autoAdvanceTimeout)
      },
      stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
          clearInterval(this.autoAdvanceInterval)
          this.autoAdvanceInterval = null
        }
      },
      track(label) {
        window.customTrack('AdInteraction', 'interaction', label)
      },
      onTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX
      },
      onTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX
        this.handleSwipe()
      },
      handleSwipe() {
        const diff = this.touchStartX - this.touchEndX
        if (Math.abs(diff) < 50) return
        if (diff > 0) this.next()
        else this.prev()
      },
    },
    watch: {
      currentIndex(id) {
        this.track(`View page ${id * 1 + 1}`)
        this.viewedPages.add(id)
        if (!this.allPagesViewed && this.viewedPages.size === this.totalCount) {
          this.allPagesViewed = true
          this.track('All pages viewed')
        }
      }
    },
    mounted() {
      this.track('View page 1')
      this.startAutoAdvance()
    },
    beforeUnmount() {
      this.stopAutoAdvance()
    }
  }
</script>

<style>
  :root {
    --page-turn-duration: .6s;
    --page-turn-duration-wrap: 1.2s;
  }
</style>
<style scoped lang="scss">
  @use '@/scss/variables.scss' as *;
  @use '@/scss/mixins.scss' as *;

  .nav {
    position: absolute;
    right: 1rem;
    top: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    color: #fff;
    @include d {
      top: 8.75rem;
      right: 3rem;
    }
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 2.5rem;
      transition: opacity .3s;
      @include d {
        width: 5rem;
      }
      &:hover {
        opacity: .8;
      }
      img {
        width: 2.5rem;
        max-width: none;
      }
    }
    .counter {
      display: flex;
      justify-content: center;
      // gap: .25rem;
      width: 5rem;
      font-size: 1.5rem;
      font-style: normal;
      font-weight: bold;
      line-height: .75;
      text-align: right;
      @include d {
        font-size: 2.5rem;
      }
    }
  }

  .catalogue {
    position: relative;
    overflow: hidden;
    aspect-ratio: 918/1262;

    .page {
      position: absolute;
      inset: 0;
      a {
        position: absolute;
      }
      .fallback {
        @include cover;
      }
      .item {
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(rgba(255,255,255,.4) 0%, rgba(255,255,255,0) 70%);
          opacity: 0;
          transition: opacity .15s;
        }
        &:hover {
          &::after {
            opacity: 1;
          }
        }
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .page.wrap-turn {
      --page-turn-duration: var(--page-turn-duration-wrap);
    }

    .wipe-next {
      animation: wipe-to-left var(--page-turn-duration) linear forwards;
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 4;
        background: linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%);
        animation: front-shade var(--page-turn-duration) linear forwards;
        pointer-events: none;
      }
    }

    .shadow-incoming {
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 2;
        background: linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 70%);
        animation: incoming-shadow var(--page-turn-duration) linear forwards;
        pointer-events: none;
      }
    }

    .page-mirror {
      position: absolute;
      inset: 0;
      z-index: 3;
      transform: scaleX(-1);
      animation: mirror-reveal var(--page-turn-duration) linear forwards;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.7) 10%,rgba(128,186,232,0) 20%,rgba(125,185,232,0) 100%);
        background-repeat: no-repeat;
        animation: mirror-shade var(--page-turn-duration) linear forwards;
        pointer-events: none;
      }
    }

    .wipe-prev {
      animation: wipe-to-right var(--page-turn-duration) linear forwards;
    }

    .page-mirror-prev {
      position: absolute;
      inset: 0;
      z-index: 3;
      transform: scaleX(-1);
      animation: mirror-reveal-prev var(--page-turn-duration) linear forwards;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(to left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.7) 10%,rgba(128,186,232,0) 20%,rgba(125,185,232,0) 100%);
        background-repeat: no-repeat;
        animation: mirror-shade-prev var(--page-turn-duration) linear forwards;
        pointer-events: none;
      }
    }
    .page-mirror,
    .page-mirror-prev {
      &.wrap-turn::before {
        content: '';
        position: absolute;
        right: -3%;
        top: 0;
        bottom: 0;
        width: 3%;
        background: linear-gradient(90deg,rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 1) 11%, rgba(0, 0, 0, 1) 12%, rgba(255, 255, 255, 1) 24%, rgba(0, 0, 0, 1) 25%, rgba(255, 255, 255, 1) 36%, rgba(0, 0, 0, 1) 37%, rgba(255, 255, 255, 1) 49%, rgba(0, 0, 0, 1) 50%, rgba(255, 255, 255, 1) 61%, rgba(0, 0, 0, 1) 62%, rgba(255, 255, 255, 1) 74%, rgba(0, 0, 0, 1) 75%, rgba(255, 255, 255, 1) 86%, rgba(0, 0, 0, 1) 87%, rgba(255, 255, 255, 1) 100%);
      }
    }

    .preload {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .tp {
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
    }

  }

  @keyframes wipe-to-left {
    0%   { clip-path: polygon(0 0, 100% 0,  100% 100%, 0 100%); }
    15%  { clip-path: polygon(0 0,  90% 0,   70% 100%, 0 100%); }
    50%  { clip-path: polygon(0 0,  50% 0,   38% 100%, 0 100%); }
    85%  { clip-path: polygon(0 0,  12% 0,    5% 100%, 0 100%); }
    100% { clip-path: polygon(0 0,   0% 0,    0% 100%, 0 100%); }
  }

  @keyframes mirror-reveal {
    0%   { translate:  100%;  rotate:  0.0deg; }
    15%  { translate:   70%;  rotate:  8.3deg; }
    50%  { translate:    0%;  rotate:  5.0deg; }
    85%  { translate:  -70%;  rotate:  2.9deg; }
    100% { translate: -100%;  rotate:  0.0deg; }
  }

  @keyframes wipe-to-right {
    0%   { clip-path: polygon(0% 0, 0% 0,   0% 100%,  0% 100%); }
    15%  { clip-path: polygon(10% 0, 0% 0,  0% 100%,  30% 100%); }
    50%  { clip-path: polygon(50% 0, 0% 0,  0% 100%,  62% 100%); }
    85%  { clip-path: polygon(88% 0, 0% 0,  0% 100%,  95% 100%); }
    100% { clip-path: polygon(100% 0, 0% 0, 0% 100%, 100% 100%); }
  }

  @keyframes mirror-reveal-prev {
    0%   { translate: -100%;  rotate:  0.0deg; }
    15%  { translate:  -70%;  rotate: -8.3deg; }
    50%  { translate:    0%;  rotate: -5.0deg; }
    85%  { translate:   70%;  rotate: -2.9deg; }
    100% { translate:  100%;  rotate:  0.0deg; }
  }

  @keyframes mirror-shade-prev {
    0% { left: 0%; width: 0%; }
    100% { left: 0%; width: 100%; }
  }

  @keyframes front-shade {
    0%   { opacity: 0; }
    40%  { opacity: 1; }
    100% { opacity: 1; }
  }

  @keyframes incoming-shadow {
    0%   { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes mirror-shade {
    0% { right: 0%; width: 0%; }
    100% { right: 0%; width: 100%; }
  }

</style>
