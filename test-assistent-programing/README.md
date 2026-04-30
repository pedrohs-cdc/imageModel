# Testes com Assistente de Programação (IA)

Este diretório contém uma série de experimentos e testes documentando o uso de Inteligência Artificial (IA) para auxiliar em tarefas de programação. O objetivo principal é demonstrar as capacidades da IA em diferentes cenários comuns de desenvolvimento de software, como explicação de código, refatoração, e depuração (debugging).

## Estrutura do Projeto

O projeto é composto por scripts em Python e documentos Markdown com explicações geradas a partir das interações com a IA.

### 🐛 Depuração (Debugging)
* **`debug.py`**: Um script Python intencionalmente criado com erros lógicos e de sintaxe (como uso incorreto de operadores, precedência e problemas com tipos) para testar a capacidade da IA de identificar e corrigir os bugs.
* **`explicacao-debug.md`**: Documento contendo a explicação detalhada da IA sobre os erros encontrados no código de debug e como cada um deles foi solucionado/analisado.

### ♻️ Refatoração de Código
* **`refatoracao.py`**: Um script em Python simples que calcula estatísticas (total, média, máximo, mínimo) de uma lista de números. É utilizado como base para testes de refatoração, visando melhorar legibilidade, aplicar tipagem (Type Hints) e seguir boas práticas.
* **`explicacao_refatoracao.md`**: Documento explicando as decisões tomadas durante o processo de refatoração do código.

### 📖 Explicação e Criação de Código
* **`num_primo.py`**: Script que verifica se um número fornecido pelo usuário é primo. Possui validações, documentação em padrão Google e boas práticas de estruturação.
* **`explicacao_num_primo.md`**: A documentação profunda sobre a lógica matemática e de implementação por trás da verificação de números primos.

## Como Utilizar

Você pode explorar os arquivos individualmente para ver exemplos práticos de como a Inteligência Artificial pode agir como um assistente (Pair Programmer):

1. **Para testar as lógicas em Python:**
   Execute os scripts diretamente no terminal, por exemplo:
   ```bash
   python num_primo.py
   python refatoracao.py
   python debug.py
   ```
2. **Para ler as análises:**
   Abra os arquivos `.md` (Markdown) para visualizar as anotações, as explicações lógicas de decisões e as etapas documentadas de como a IA pensou ao resolver as tarefas.

---
*Este repositório serve como material de estudo sobre Pair Programming com IAs, reforçando o desenvolvimento de prompts eficientes e revisão de código auxiliada por inteligência artificial.*
