<script>
export default {
  name: 'ModoClassico',
  data() {
    return {
      palavras: [],
      palavraSecreta: '',
      tentativas: [],
      inputAtual: '',
      maxTentativas: 10,
      maxLetras: 6,
      jogoFinalizado: false,
      mensagem: '',
      animacoes: [],
      erroInput: false,
    }
  },

  async created() {
    await this.carregarDicionario()
    if (this.palavras.length > 0) {
      this.sortearPalavra()
    } else {
      this.mensagem = 'Nenhuma palavra disponível.'
    }
  },

  methods: {
    async carregarDicionario() {
      try {
        const res = await fetch('/pt-br.json')
        const listaCompleta = await res.json()
        this.palavras = listaCompleta.filter(p => p.length === this.maxLetras)
      } catch (err) {
        this.mensagem = 'Erro ao carregar o dicionário.'
        console.error(err)
      }
    },

    sortearPalavra() {
      if (!this.palavras.length) {
        this.mensagem = 'Nenhuma palavra válida disponível para sortear.'
        this.jogoFinalizado = true
        return
      }

      let tentativa = ''
      let tentativas = 0
      do {
        tentativa = this.palavras[Math.floor(Math.random() * this.palavras.length)]?.toLowerCase() || ''
        tentativas++
      } while (tentativa.trim() === '' && tentativas < 10)

      if (tentativa.trim() === '') {
        this.mensagem = 'Falha ao sortear palavra válida.'
        this.jogoFinalizado = true
      } else {
        this.palavraSecreta = tentativa
      }
    },

    tentar() {
      if (this.jogoFinalizado) return

      const chute = this.inputAtual.toLowerCase()

      if (chute.length !== this.maxLetras) {
        this.mensagem = `Digite exatamente ${this.maxLetras} letras.`
        this.erroInput = true
        this.resetarErroInput()
        return
      }

      if (!this.palavras.includes(chute)) {
        this.mensagem = 'Palavra inválida.'
        this.erroInput = true
        this.resetarErroInput()
        return
      }

      this.tentativas.push(chute)
      this.animacoes.push(this.tentativas.length - 1)
      this.inputAtual = ''

      if (chute === this.palavraSecreta) {
        this.mensagem = 'Parabéns! Você acertou a palavra!'
        this.jogoFinalizado = true
      } else if (this.tentativas.length >= this.maxTentativas) {
        this.mensagem = `Fim de jogo! A palavra era: ${this.palavraSecreta.toUpperCase()}`
        this.jogoFinalizado = true
      } else {
        this.mensagem = ''
      }
    },

    resetarErroInput() {
      setTimeout(() => {
        this.erroInput = false
      }, 500)
    },

    reiniciarJogo() {
      this.tentativas = []
      this.inputAtual = ''
      this.jogoFinalizado = false
      this.mensagem = ''
      this.animacoes = []
      this.sortearPalavra()
    },

    voltar() {
      this.$emit('voltarParaInicio')
    },

    corLetra(letra, i, tentativaIndex) {
      const chute = this.tentativas[tentativaIndex]
      if (!chute) return ''
      const palavra = this.palavraSecreta
      const letrasPalavra = {}
      for (const l of palavra) {
        letrasPalavra[l] = (letrasPalavra[l] || 0) + 1
      }
      const letrasVerdes = {}
      for (let idx = 0; idx < chute.length; idx++) {
        if (chute[idx] === palavra[idx]) {
          letrasVerdes[chute[idx]] = (letrasVerdes[chute[idx]] || 0) + 1
        }
      }
      const restantes = {}
      for (const l in letrasPalavra) {
        restantes[l] = letrasPalavra[l] - (letrasVerdes[l] || 0)
      }
      if (letra === palavra[i]) {
        return 'verde'
      } else if (palavra.includes(letra)) {
        let usadosAntes = 0
        for (let x = 0; x < i; x++) {
          if (chute[x] === letra && chute[x] !== palavra[x]) {
            usadosAntes++
          }
        }
        if (restantes[letra] > usadosAntes) {
          return 'amarelo'
        }
      }
      return 'semcor'
    }
  }
}
</script>

<template>
  <div class="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-custom p-3">
    <h2 class="text-degrade mb-4">Modo Clássico</h2>

    <div class="grid-palavras d-flex flex-column gap-2 mb-3">
      <div v-for="(chute, i) in tentativas" :key="i" class="d-flex gap-2 justify-content-center">
        <div v-for="(letra, j) in chute" :key="j" class="bloco-letra"
          :class="[corLetra(letra, j, i), animacoes.includes(i) ? 'animada' : '']">
          {{ letra.toUpperCase() }}
        </div>
      </div>

      <div v-for="i in maxTentativas - tentativas.length" :key="'vazio' + i"
        class="d-flex gap-2 justify-content-center">
        <div v-for="j in maxLetras" :key="j" class="bloco-letra">&nbsp;</div>
      </div>
    </div>

    <input v-model="inputAtual"
      :maxlength="maxLetras"
      :disabled="jogoFinalizado"
      @keyup.enter="tentar"
      class="input-palavra text-degrade"
      :class="{ erro: erroInput }"
      placeholder="Digite sua palavra"
      autofocus
    />

    <button @click="tentar" :disabled="jogoFinalizado" class="btn btn-custom mt-3">Chutar</button>
    <button @click="reiniciarJogo" class="btn btn-custom mt-2">Reiniciar</button>
    <button @click="voltar" class="btn btn-custom mt-2">Voltar</button>

    <p class="mensagem mt-3">{{ mensagem }}</p>
  </div>
</template>

<style scoped>
@keyframes flipar {
  0% {
    transform: rotateX(0deg);
  }

  50% {
    transform: rotateX(90deg);
    opacity: 0.3;
  }

  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

@keyframes tremor {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.animada {
  animation: flipar 0.6s ease-in-out;
}

.text-custom {
  color: #6e7c61;
}

.grid-palavras {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 350px;
}

.bloco-letra {
  width: 50px;
  height: 50px;
  background-color: #2a2a2a;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.7rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #6e7c61;
  user-select: none;
}

.bloco-letra.verde {
  background-color: #4caf50;
  color: white;
}

.bloco-letra.amarelo {
  background-color: #ffc107;
  color: black;
}

.bloco-letra.semcor {
  background-color: #2a2a2a;
  color: #6e7c61;
}

.input-palavra {
  width: 350px;
  max-width: 100%;
  padding: 10px 15px;
  font-size: 1.3rem;
  border-radius: 10px;
  border: 2px solid #6e7c61;
  background-color: #1f1f1f;
  color: #6e7c61;
  outline: none;
  text-transform: lowercase;
  transition: border-color 0.3s ease;
}

.input-palavra:focus {
  border-color: #4caf50;
}

.input-palavra.erro {
  border-color: red !important;
  animation: tremor 0.3s ease;
}

.btn-custom {
  width: 250px;
  background-color: #2a2a2a;
  border: none;
  border-radius: 12px;
  padding: 12px 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-image: linear-gradient(90deg, #4caf50, #00bcd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-degrade {
  background-image: linear-gradient(90deg, #4caf50, #00bcd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-custom:hover:enabled {
  background-color: #3a3a3a;
  transform: scale(1.05);
}

.btn-custom:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensagem {
  min-height: 1.5em;
  font-size: 1.2rem;
  color: #6e7c61;
  text-align: center;
}
</style>
