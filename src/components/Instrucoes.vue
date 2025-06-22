<script>
export default {
  name: 'Instrucoes',
  methods: {
    voltar() {
      this.$emit('voltarParaInicio')
    }
  }
}
</script>

<template>
  <div class="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-dark text-custom p-4">
    <h2 class="mb-4">Instruções</h2>

    <div class="text-start w-100" style="max-width: 600px">
      <h4>🎯 Modo Clássico</h4>
      <p>Descubra uma palavra entre 1000 palavras diferentes de 6 letras. A cada tentativa:</p>
      <ul>
        <li><span class="verde">Verde</span>: letra correta no lugar certo</li>
        <li><span class="amarelo">Amarelo</span>: letra existente, mas no lugar errado</li>
        <li><span class="semcor">Sem cor</span>: letra não existe na palavra</li>
      </ul>

      <h4>💣 Modo Difícil</h4>
      <p>Mesma lógica do modo clássico, mas com palavras 7896 palavras de 10 a 20 letras. A grade se adapta ao tamanho da palavra.</p>

      <h4>🧩 Modo Criptografia</h4>
      <p>Você vê a palavra original, mas deve digitar a versão *criptografada*, com letras trocadas por símbolos ou números (ex: <code>sereno</code> vira <code>$3R3N0</code>).</p>

      <p class="mt-4">Você tem até 10 tentativas para acertar a palavra correta em todos os modos.</p>
    </div>

    <button class="btn btn-custom mt-4" @click="voltar">Voltar</button>
  </div>
</template>

<style scoped>
.text-custom {
  color: #6e7c61;
}

.verde {
  color: white;
  background-color: #4caf50;
  padding: 2px 6px;
  border-radius: 4px;
}

.amarelo {
  color: black;
  background-color: #ffc107;
  padding: 2px 6px;
  border-radius: 4px;
}

.semcor {
  color: #6e7c61;
  background-color: #2a2a2a;
  padding: 2px 6px;
  border-radius: 4px;
}

.btn-custom {
  background-color: #2a2a2a;
  color: #6e7c61;
  border: none;
  border-radius: 12px;
  padding: 10px 25px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-custom:hover {
  background-color: #3a3a3a;
  transform: scale(1.05);
}
</style>
