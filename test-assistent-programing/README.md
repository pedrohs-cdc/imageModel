# Testes com Assistente de Programação (IA)

## Descrição geral do projeto

Este projeto é um repositório focado em documentar experimentos e interações práticas utilizando Inteligência Artificial como assistente de programação (Pair Programmer). O objetivo principal é demonstrar as capacidades e o fluxo de trabalho de uma IA ao auxiliar em tarefas fundamentais do desenvolvimento de software.

Através deste repositório, exploramos três áreas vitais:
1. **Depuração e Correção de Bugs (Debugging)**: Avaliação de como a IA encontra, explica e corrige problemas sintáticos, lógicos e regras de negócio complexas.
2. **Refatoração de Código**: Melhoria contínua de código funcional para adequação a boas práticas, Clean Code e tipagem (Type Hints).
3. **Criação e Documentação**: Geração de lógicas do zero acompanhadas da construção estruturada de explicações matemáticas e de documentação padronizada (padrão Google).

---

## Estrutura de arquivos do repositório

O repositório é composto por scripts Python executáveis e arquivos Markdown que contêm a documentação detalhada gerada a partir das explicações da IA.

* **`README.md`**: Este arquivo principal de documentação.

### 🐛 Depuração (Debugging)
* **`debug.py`**: Script que originalmente possuía erros lógicos e de sintaxe (como uso incorreto de operadores e precedência) para testes. Atualmente, ele contém o **código corrigido** e validado, incluindo **comentários inline** detalhando passo a passo as decisões lógicas.
* **`explicacao-debug.md`**: Documento com a explicação teórica fornecida pela IA sobre os problemas originais do código de debug e como cada um deles foi analisado e corrigido.

### ♻️ Refatoração de Código
* **`refatoracao.py`**: Um script simples em Python que calcula estatísticas básicas (total, média, máximo e mínimo) a partir de uma lista de números. O script foi refatorado para usar `Type Hints` rigorosos (`typing.Tuple`, `typing.List`) e seguir as melhores convenções.
* **`explicacao_refatoracao.md`**: Documento que detalha as etapas e as boas práticas de desenvolvimento de software adotadas ao refatorar o código-fonte original.

### 📖 Criação e Lógica Matemática
* **`num_primo.py`**: Script que interage com o usuário e valida se um número digitado é um número primo. Possui validações de entrada, testes de borda, otimizações matemáticas (testando divisores apenas até a raiz quadrada) e uma docstring rica no padrão do Google.
* **`explicacao_num_primo.md`**: Documento profundo e descritivo que traduz o algoritmo desenvolvido e os princípios matemáticos para a verificação de números primos.

---

## Instruções de como executar cada script

Certifique-se de estar com o terminal aberto na pasta do projeto (`test-assistent-programing`). 

### Executando `num_primo.py`
Este script interage com o usuário solicitando um número para checagem.
```bash
python num_primo.py
```
* **O que esperar**: Um prompt será exibido no terminal pedindo um número. O programa fará o cálculo e retornará se o número é primo ou não de forma estruturada.

### Executando `refatoracao.py`
Este script não requer inputs externos, as entradas já estão definidas em código.
```bash
python refatoracao.py
```
* **O que esperar**: Ele irá calcular instantaneamente as estatísticas (total, média, maior e menor) para a lista de números em memória e exibirá os resultados de forma formatada.

### Executando `debug.py`
Assim como a refatoração, as variáveis deste script são fixas.
```bash
python debug.py
```
* **O que esperar**: O script rodará por vários blocos de testes unitários simples no console e imprimirá os resultados com base nos fluxos agora corrigidos (ex: cálculo de horas/minutos, regras de aprovação e de aposentadoria, cálculo de raízes e paridade).

---

## Tecnologias e ferramentas utilizadas

* **Linguagem Principal**: Python 3.x
* **Conceitos Essenciais**:
  * Type Hints (módulo `typing`)
  * Tratamento de Exceções (`try/except`)
  * Otimização Matemática (`math.sqrt`)
  * Operadores Booleanos (`and`, `or`, `not`)
* **Documentação**: Markdown (`.md`)
* **Padrões Adotados**: Docstrings no estilo Google, convenções de código limpo (Clean Code).
* **Auxílio Computacional**: Assistentes de IA para geração de documentação, refatoração e debbuging automatizado de erros intencionais.
