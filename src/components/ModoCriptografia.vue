<script>
export default {
  name: 'ModoCriptografia',
  data() {
    return {
      animacoesCripto: [],
      palavrasCripto: [],
      palavraSecretaOriginal: '',       // palavra original normal
      palavraCriptografada: '',          // palavra criptografada que o jogador tem que adivinhar
      tentativasCripto: [],
      inputAtualCripto: '',
      maxTentativasCripto: 10,
      maxLetrasCripto: 6,
      jogoFinalizadoCripto: false,
      mensagemCripto: '',
      mapaCriptografia: {
        a: '@', b: '8', c: '(', d: 'D', e: '3', f: '#', g: '9',
        h: '#', i: '1', j: 'J', k: 'K', l: '1', m: 'M', n: 'N',
        o: '0', p: 'P', q: 'Q', r: 'R', s: '$', t: '7', u: 'U',
        v: 'V', w: 'W', x: 'X', y: 'Y', z: '2'
      },
    }
  },
  async created() {
    await this.carregarDicionarioCripto()
    if (this.palavrasCripto.length) {
      this.sortearPalavraCripto()
    } else {
      this.mensagemCripto = 'Nenhuma palavra disponível.'
    }
  },

  methods: {
    async carregarDicionarioCripto() {
      try {
        const res = await fetch('/palavras6.json')
        const lista = await res.json()
        this.palavrasCripto = lista.filter(p => p.length === this.maxLetrasCripto)
      } catch (err) {
        this.mensagemCripto = 'Erro ao carregar o dicionário.'
        console.error(err)
      }
    },

    sortearPalavraCripto() {
      const aleatoria = this.palavrasCripto[Math.floor(Math.random() * this.palavrasCripto.length)]
      this.palavraSecretaOriginal = aleatoria.toLowerCase()
      this.palavraCriptografada = this.palavraSecretaOriginal
        .split('')
        .map(letra => this.mapaCriptografia[letra] || letra)
        .join('')
    },

    tentarCripto() {
      if (this.jogoFinalizadoCripto) return

      const chute = this.inputAtualCripto.toUpperCase() // jogador digita a palavra criptografada

      if (chute.length !== this.maxLetrasCripto) {
        this.mensagemCripto = `Digite exatamente ${this.maxLetrasCripto} caracteres.`
        return
      }

      // Aqui a validação é feita contra a palavra criptografada
      if (chute !== this.palavraCriptografada.toUpperCase()) {
        this.mensagemCripto = 'Palavra incorreta.'
        this.tentativasCripto.push(chute)
        this.animacoesCripto.push(this.tentativasCripto.length - 1)
        this.inputAtualCripto = ''
        
        if (this.tentativasCripto.length >= this.maxTentativasCripto) {
          this.mensagemCripto = `Fim de jogo! A palavra correta era: ${this.palavraCriptografada.toUpperCase()}`
          this.jogoFinalizadoCripto = true
        }
        return
      }

      // Se acertou
      this.tentativasCripto.push(chute)
      this.animacoesCripto.push(this.tentativasCripto.length - 1)
      this.mensagemCripto = 'Parabéns! Você acertou a palavra criptografada!'
      this.jogoFinalizadoCripto = true
      this.inputAtualCripto = ''
    },

    corLetraCripto(letra, i, tentativaIndex) {
      const chute = this.tentativasCripto[tentativaIndex]
      if (!chute) return ''

      if (letra === this.palavraCriptografada[i].toUpperCase()) {
        return 'verde'
      } else if (this.palavraCriptografada.includes(letra)) {
        return 'amarelo'
      } else {
        return 'semcor'
      }
    },

    reiniciarJogoCripto() {
      this.tentativasCripto = []
      this.inputAtualCripto = ''
      this.jogoFinalizadoCripto = false
      this.mensagemCripto = ''
      this.animacoesCripto = []
      this.sortearPalavraCripto()
    },

    voltarCripto() {
      this.$emit('voltarParaInicio')
    }
  }
}
</script>

<template>
  <div class="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-custom p-3">
    <h2 class="mb-4">Modo Criptografia</h2>

    <p class="mensagem mb-3">
      Palavra original: <strong>{{ palavraSecretaOriginal.toUpperCase() }}</strong>
    </p>

    <div class="grid-palavras d-flex flex-column gap-2 mb-3">
      <div v-for="(chute, i) in tentativasCripto" :key="i" class="d-flex gap-2 justify-content-center">
        <div v-for="(letra, j) in chute" :key="j" class="bloco-letra"
          :class="[corLetraCripto(letra, j, i), animacoesCripto.includes(i) ? 'animada' : '']">
          {{ letra }}
        </div>
      </div>

      <div v-for="i in maxTentativasCripto - tentativasCripto.length" :key="'vazio' + i"
        class="d-flex gap-2 justify-content-center">
        <div v-for="j in maxLetrasCripto" :key="j" class="bloco-letra">&nbsp;</div>
      </div>
    </div>

    <input
      v-model="inputAtualCripto"
      :maxlength="maxLetrasCripto"
      :disabled="jogoFinalizadoCripto"
      @keyup.enter="tentarCripto"
      class="input-palavra"
      placeholder="Digite a palavra criptografada"
      autofocus
    />

    <button @click="tentarCripto" :disabled="jogoFinalizadoCripto" class="btn btn-custom mt-3">
      Chutar
    </button>

    <button @click="reiniciarJogoCripto" class="btn btn-custom mt-2">
      Reiniciar
    </button>

    <button @click="voltarCripto" class="btn btn-custom mt-2">
      Voltar
    </button>

    <p class="mensagem mt-3">{{ mensagemCripto }}</p>
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
  text-transform: uppercase;
}

.input-palavra:focus {
  border-color: #4caf50;
}

.btn-custom {
  background-color: #2a2a2a;
  color: #6e7c61;
  border: none;
  border-radius: 12px;
  padding: 10px 25px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
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
