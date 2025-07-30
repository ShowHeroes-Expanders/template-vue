<template>
  <h1 class="heading">
    HVA KAN DU OM KAFFE?
  </h1>
  <div class="quiz" v-if="!showResults">
    <p class="question">
      <strong>{{ index + 1 }}/{{ items.length }}:</strong>
      {{ currentItem.question }}
    </p>
    <div class="options" :class="{answered: answered}">
      <button v-for="option, i in currentItem.options" :key="option" @click="pickOption(i)" class="button" :class="{small: currentItem.smallText,correct: answered && currentItem.correct === i, wrong: answered && selectedOption === i}">{{ option }}</button>
    </div>
    <div class="bottom">
      <template v-if="answered">
        <button v-if="finished" @click="finsihQuiz">Se resultatet</button>
        <button v-else @click="nextQuestion">Neste spørsmål ></button>
      </template>
    </div>
  </div>
  <div class="results" v-else>
    <p>
      {{ resultPhrases[points] }}
    </p>
    <button class="button" @click="restartQuiz">Start quiz på nytt</button>
  </div>
</template>

<script>
  export default {
    name: 'ExpanderQuiz',
    emits: ['track'],
    data() {
      return {
        index: 0,
        selectedOption: null,
        points: 0,
        showResults: false,
        firstStart: false,
        resultPhrases: [
          'Prøv igjen.',
          'Du har lært litt om kaffe.',
          'Du har god kunnskap om kaffe.',
          'Du kan da riktig så mye om kaffe.',
        ],
        items: [
          {
            question: 'Hvilke brenningsmetoder brukes på Coffee of the World?',
            options: [
              'Lysbrent og mørkbrent',
              'Slowroast og trommelbrenning',
              'Varmluft og Fastroast'
            ],
            correct: 1,
          },
          {
            question: 'Hva betyr ordet terroir?',
            options: [
              'Terroir kommer fra fransk terre og betyr «land». Terroir er smaken av kaffens opprinnelse.',
              'Terroir betyr «vann» og brukes til å beskrive hvor mye vann det er i jordsmonnet.',
              'Terroir betyr «jord» og brukes til å fortelle hva slags jord som brukes til å dyrke kaffe.'
            ],
            correct: 0,
            smallText: true,
          },
          {
            question: 'Hvor kommer kaffebønnene i Monsooned Malabar fra?',
            options: [
              'Java i Indonesia',
              'Chikmagalur i India',
              'Karnataka i India'
            ],
            correct: 2,
          },
        ],
      }
    },
    computed: {
      currentItem() {
        return this.items[this.index]
      },
      answered() {
        return this.selectedOption !== null
      },
      finished() {
        return this.selectedOption !== null && this.index == this.items.length - 1
      },
    },
    methods: {
      pickOption(id) {
        if (id == this.currentItem.correct) {
          this.points++
        }
        this.selectedOption = id
        if (!this.firstStart) {
          this.firstStart = true
          this.$emit('track', 'Quiz - start')
        }
      },
      nextQuestion() {
        this.selectedOption = null
        this.index++
      },
      finsihQuiz() {
        this.showResults = true
        this.$emit('track', 'Quiz - complete')
        this.$emit('track', `Quiz - result: ${this.points}`)
      },
      restartQuiz() {
        this.showResults = false
        this.selectedOption = null
        this.index = 0
        this.points = 0
        this.$emit('track', 'Quiz - restart')
      }
    },
  }
</script>

<style scoped lang="scss">
  @use '@/scss/variables.scss' as *;
  @use '@/scss/mixins.scss' as *;

  $color-correct: #6a957a;
  $color-wrong: #f9a19a;

  .heading {
    &::before {
      content: '';
      display: block;
      height: 2.75rem;
      margin-bottom: 2.5rem;
      background: url('@/assets/quiz.svg') no-repeat center top / contain;
    }
  }

  .question {
    margin: 0 1.5rem;
    text-align: center;
    @include d {
      width: 37.5rem;
      margin: 0 auto;
    }
  }

  .options {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 3.5rem 0 0;
    &.answered {
      .button {
        pointer-events: none;
      }
    }
  }
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22rem;
    height: 4.375rem;
    margin-bottom: 1.25rem;
    padding: 0 1rem;
    border-radius: .5rem;
    border: 1px solid $color-1;
    font-size: 1.375rem;
    color: $color-text;
    text-align: center;
    line-height: 1;
    transition: .15s;
    @include d {
      width: 28rem;
    }
    &:hover {
      background: $color-1;
      color: $color-bg;
    }
    &.wrong {
      background: $color-wrong;
      color: $color-bg;
    }
    &.correct {
      background: $color-correct;
    }
    &.small {
      font-size: 1.125rem;
    }
  }

  .bottom {
    height: 3rem;
    margin-top: 1rem;
    text-align: center;
    @include d {
      margin-top: 2rem;
    }
    button {
      color: $color-text;
      font-size: 1.375rem;
      font-weight: bold;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .results {
    display: flex;
    flex-direction: column;
    height: 27.125rem;
    justify-content: center;
    align-items: center;
    p {
      margin-bottom: 4rem;
      font-size: 1.375rem;
    }
  }

</style>

