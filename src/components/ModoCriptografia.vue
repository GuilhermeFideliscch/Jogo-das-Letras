<script>
export default {
  name: 'ModoCriptografia',
  data() {
    return {
      palavras: [],
      palavraSecretaOriginal: '',
      palavraSecreta: '',
      palavraCriptografada: '',
      tentativas: [],
      inputAtual: '',
      maxTentativas: 10,
      maxLetras: 6,
      jogoFinalizado: false,
      mensagem: '',
      animacoes: [],
      erroInput: false,
      mapaCriptografia: {
        a: '@', b: '8', c: '(', d: '!', e: '3', f: '#', g: '9',
        h: '#', i: '1', j: ',', k: '-', l: '%', m: '6', n: '4',
        o: '0', p: '{', q: '.', r: '=', s: '$', t: '7', u: '5',
        v: ';', w: '}', x: '/', y: '+', z: '2'
      }
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
        this.palavraSecretaOriginal = ''
        this.palavraSecreta = ''
        this.palavraCriptografada = ''
        return
      }

      let aleatoria = ''
      const maxTentativas = 20
      let tentativas = 0

      do {
        aleatoria = this.palavras[Math.floor(Math.random() * this.palavras.length)] || ''
        tentativas++
        if (tentativas > maxTentativas) break
      } while (!aleatoria || aleatoria.length !== this.maxLetras)

      if (!aleatoria || aleatoria.length !== this.maxLetras) {
        this.mensagem = 'Não foi possível sortear uma palavra válida.'
        this.palavraSecretaOriginal = ''
        this.palavraSecreta = ''
        this.palavraCriptografada = ''
        return
      }

      this.palavraSecretaOriginal = aleatoria.toLowerCase()
      this.palavraSecreta = this.palavraSecretaOriginal
      this.palavraCriptografada = this.palavraSecreta
        .split('')
        .map(letra => this.mapaCriptografia[letra] || letra)
        .join('')
    },
    tentar() {
      if (this.jogoFinalizado) return

      const chute = this.inputAtual

      if (chute.length !== this.maxLetras) {
        this.mensagem = `Digite exatamente ${this.maxLetras} símbolos.`
        this.erroInput = true
        setTimeout(() => this.erroInput = false, 600)
        return
      }

      this.tentativas.push(chute)
      this.animacoes.push(this.tentativas.length - 1)
      this.inputAtual = ''
      this.mensagem = ''
      this.erroInput = false

      if (chute === this.palavraCriptografada) {
        this.mensagem = 'Parabéns! Você acertou a palavra criptografada!'
        this.jogoFinalizado = true
      } else if (this.tentativas.length >= this.maxTentativas) {
        this.mensagem = `Fim de jogo! A palavra era: ${this.palavraCriptografada}`
        this.jogoFinalizado = true
      } else {
        this.mensagem = 'Tente novamente.'
      }
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
      const chute = this.tentativas[tentativaIndex];
      if (!chute) return '';
      const palavra = this.palavraCriptografada;
      const letrasPalavra = {};
      for (const l of palavra) {
        letrasPalavra[l] = (letrasPalavra[l] || 0) + 1;
      }
      const letrasVerdes = {};
      for (let idx = 0; idx < chute.length; idx++) {
        if (chute[idx] === palavra[idx]) {
          letrasVerdes[chute[idx]] = (letrasVerdes[chute[idx]] || 0) + 1;
        }
      }
      const restantes = {};
      for (const l in letrasPalavra) {
        restantes[l] = letrasPalavra[l] - (letrasVerdes[l] || 0);
      }

      if (letra === palavra[i]) {
        return 'verde';
      } else if (palavra.includes(letra)) {
        let usadosAntes = 0;
        for (let x = 0; x < i; x++) {
          if (chute[x] === letra && chute[x] !== palavra[x]) {
            usadosAntes++;
          }
        }
        if (restantes[letra] > usadosAntes) {
          return 'amarelo';
        }
      }

      return 'semcor';
    }
  }
}
</script>

<template>
  <div class="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-custom p-3">
    <h2 class="text-degrade mb-4">Modo Criptografia</h2>

    <p class="mensagem text-degrade mb-3">
      Palavra original: <strong>{{ palavraSecretaOriginal.toUpperCase() }}</strong>
    </p>

    <div class="grid-palavras d-flex flex-column gap-2 mb-3">
      <div v-for="(chute, i) in tentativas" :key="i" class="d-flex gap-2 justify-content-center">
        <div v-for="(letra, j) in chute" :key="j" class="bloco-letra"
          :class="[corLetra(letra, j, i), animacoes.includes(i) ? 'animada' : '']">
          {{ letra }}
        </div>
      </div>

      <div v-for="i in maxTentativas - tentativas.length" :key="'vazio' + i"
        class="d-flex gap-2 justify-content-center">
        <div v-for="j in maxLetras" :key="j" class="bloco-letra">&nbsp;</div>
      </div>
    </div>

    <input
      v-model="inputAtual"
      :maxlength="maxLetras"
      :disabled="jogoFinalizado"
      @keyup.enter="tentar"
      :class="['input-palavra', 'text-degrade', { 'erro-input': erroInput }]"
      placeholder="Digite a palavra original"
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
  0% { transform: rotateX(0deg); }
  50% { transform: rotateX(90deg); opacity: 0.3; }
  100% { transform: rotateX(0deg); opacity: 1; }
}

@keyframes tremor {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.erro-input {
  border-color: #e74c3c !important;
  animation: tremor 0.3s ease;
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

.btn-custom:hover:enabled {
  background-color: #3a3a3a;
  transform: scale(1.05);
}

.btn-custom:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.text-degrade {
  background-image: linear-gradient(90deg, #4caf50, #00bcd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mensagem {
  min-height: 1.5em;
  font-size: 1.2rem;
  color: #6e7c61;
  text-align: center;
}
</style>
