<script>
export default {
  name: 'ModoDificil',
  data() {
    return {
      palavras: [],
      palavraSecreta: '',
      tentativas: [],
      inputAtual: '',
      maxTentativas: 10,
      maxLetrasMin: 10,
      maxLetrasMax: 20,
      maxLetras: 0,
      jogoFinalizado: false,
      mensagem: '',
      animacoes: [],
    }
  },
  async created() {
    await this.carregarDicionario()
    if (this.palavras.length) {
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
        this.palavras = listaCompleta.filter(p => p.length >= this.maxLetrasMin && p.length <= this.maxLetrasMax)
      } catch (err) {
        this.mensagem = 'Erro ao carregar o dicionário.'
        console.error(err)
      }
    },
    sortearPalavra() {
      const aleatoria = this.palavras[Math.floor(Math.random() * this.palavras.length)]
      this.palavraSecreta = aleatoria.toLowerCase()
      this.maxLetras = this.palavraSecreta.length
    },
    tentar() {
      if (this.jogoFinalizado) return;

      const chute = this.inputAtual.toLowerCase();

      if (chute.length !== this.maxLetras) {
        this.mensagem = `Digite exatamente ${this.maxLetras} letras.`;
        return;
      }

      if (!this.palavras.includes(chute)) {
        this.mensagem = 'Palavra inválida.';
        return;
      }

      this.tentativas.push(chute);
      this.animacoes.push(this.tentativas.length - 1);
      this.inputAtual = '';

      if (chute === this.palavraSecreta) {
        this.mensagem = 'Parabéns! Você acertou a palavra!';
        this.jogoFinalizado = true;
      } else if (this.tentativas.length >= this.maxTentativas) {
        this.mensagem = `Fim de jogo! A palavra era: ${this.palavraSecreta.toUpperCase()}`;
        this.jogoFinalizado = true;
      } else {
        this.mensagem = '';
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
      const chute = this.tentativas[tentativaIndex]
      if (!chute) return ''

      if (letra === this.palavraSecreta[i]) {
        return 'verde'
      } else if (this.palavraSecreta.includes(letra)) {
        return 'amarelo'
      } else {
        return 'semcor'
      }
    }
  }
}
</script>

<template>
  <div class="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-custom p-3">
    <h2 class="text-degrade mb-4">Modo Difícil</h2>

    <div class="grid-palavras d-flex flex-column gap-2 mb-3">
      <div v-for="(chute, i) in tentativas" :key="i" class="d-flex gap-2 justify-content-center flex-wrap">
        <div v-for="(letra, j) in chute" :key="j" class="bloco-letra"
          :class="[corLetra(letra, j, i), animacoes.includes(i) ? 'animada' : '']">
          {{ letra.toUpperCase() }}
        </div>
      </div>

      <div v-for="i in maxTentativas - tentativas.length" :key="'vazio' + i"
        class="d-flex gap-2 justify-content-center flex-wrap">
        <div v-for="j in maxLetras" :key="j" class="bloco-letra">
          &nbsp;
        </div>
      </div>
    </div>

    <input v-model="inputAtual" :maxlength="maxLetras" :disabled="jogoFinalizado" @keyup.enter="tentar"
      class="input-palavra text-degrade" :placeholder="`Digite uma palavra de ${maxLetras} letras`" autofocus />

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

.animada {
  animation: flipar 0.4s ease-in-out;
}

.text-custom {
  color: #6e7c61;
}

.grid-palavras {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 90vw;
}

.bloco-letra {
  width: 40px;
  height: 50px;
  background-color: #2a2a2a;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #6e7c61;
  text-transform: uppercase;
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
  width: 100%;
  max-width: 600px;
  padding: 10px 15px;
  font-size: 1.3rem;
  border-radius: 10px;
  border: 2px solid #6e7c61;
  background-color: #1f1f1f;
  color: #6e7c61;
  outline: none;
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
