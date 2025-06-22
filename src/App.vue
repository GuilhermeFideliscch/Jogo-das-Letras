<script>
import ModoClassico from './components/ModoClassico.vue'
import ModoDificil from './components/ModoDificil.vue'
import ModoCriptografia from './components/ModoCriptografia.vue'
import Instrucoes from './components/Instrucoes.vue'

export default {
  name: 'App',
  components: {
    ModoClassico,
    ModoDificil,
    ModoCriptografia,
    Instrucoes
  },
  data() {
    return {
      telaAtual: 'inicio'
    }
  },
  methods: {
    iniciarClassico() {
      this.telaAtual = 'classico'
    },
    iniciarDificil() {
      this.telaAtual = 'dificil'
    },
    iniciarCriptografia() {
      this.telaAtual = 'criptografia'
    },
    abrirInstrucoes() {
      this.telaAtual = 'instrucoes'
    },
    voltarParaInicio() {
      this.telaAtual = 'inicio'
    }
  }
}
</script>

<template>
  <div>
    <template v-if="telaAtual === 'inicio'">
      <div class="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-dark text-custom">
        <h1 class="display-2 fw-bold text-degrade mb-5">Jogo das Letras</h1>

        <button class="btn btn-custom px-5 py-3 fs-4 mb-3" @click="iniciarClassico">
          Clássico
        </button>
        <button class="btn btn-custom px-5 py-3 fs-4 mb-3" @click="iniciarDificil">
          Difícil
        </button>
        <button class="btn btn-custom px-5 py-3 fs-4 mb-3" @click="iniciarCriptografia">
         Criptografia
        </button>
        <button class="btn btn-custom px-5 py-3 fs-4" @click="abrirInstrucoes">
          Instruções
        </button>
      </div>
    </template>

    <template v-else-if="telaAtual === 'classico'">
      <ModoClassico @voltarParaInicio="voltarParaInicio" />
    </template>

    <template v-else-if="telaAtual === 'dificil'">
      <ModoDificil @voltarParaInicio="voltarParaInicio" />
    </template>

    <template v-else-if="telaAtual === 'criptografia'">
      <ModoCriptografia @voltarParaInicio="voltarParaInicio" />
    </template>

    <template v-else-if="telaAtual === 'instrucoes'">
      <Instrucoes @voltarParaInicio="voltarParaInicio" />
    </template>
  </div>
</template>

<style scoped>
.text-custom {
  color: #6e7c61;
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


.btn-custom:hover {
  background-color: #3a3a3a;
  transform: scale(1.05);
}
</style>
