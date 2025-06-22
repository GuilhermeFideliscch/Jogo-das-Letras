# 🎮 Jogo das Letras

Jogo das Letras é um jogo web feito em Vue.js onde o jogador precisa adivinhar palavras em diferentes modos de dificuldade. O objetivo é descobrir a palavra secreta com o menor número de tentativas possível.

## 📦 Tecnologias
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- HTML / CSS
- Git e GitHub

---

## 🧠 Como jogar

### 🎯 Objetivo
Descubra a palavra secreta digitando tentativas e observando o feedback por cores em cada letra:

- 🟩 Verde: letra correta no lugar certo.
- 🟨 Amarela: letra existe, mas está na posição errada.
- ⬛ Cinza: letra não está na palavra.

---

## 🕹️ Modos de Jogo

### ✅ Modo Clássico
- Palavras de **6 letras**.
- Até **10 tentativas**.
- Palavras vêm de um dicionário em português.

### 🔥 Modo Difícil
- Palavras de **10 a 20 letras**.
- Interface ajusta dinamicamente os quadrados.
- Requer atenção e vocabulário mais avançado.

### 🧩 Modo Criptografia
- A palavra **é exibida em texto comum**, e o objetivo é digitar a versão **criptografada** dela.
- A criptografia usa substituições, como:
  - `A → @`, `E → 3`, `S → $`, `O → 0`, `I → 1` etc.
- Você deve entender a lógica de conversão para acertar.

> Exemplo:
> Palavra exibida: `sereno`  
> Entrada correta: `$3R3N0`

---

## 🧪 Funcionalidades
- Animações ao revelar letras.
- Feedback visual para acertos/parciais/erros.
- Botões para reiniciar ou voltar ao menu inicial.
---

## 🛠️ Como rodar localmente

```bash
# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
