# Explicação Técnica e Didática - Verificador de Números Primos em Python

## **Visão Geral do Programa**

Este programa implementa um **verificador interativo de números primos** que solicita um número ao usuário e determina se é primo ou não, aplicando boas práticas de **clean code** e **algoritmos otimizados**.

**Não requer importações externas** - usa apenas a biblioteca padrão do Python.

---

## **Estrutura do Código**

### 1. **Função `eh_primo()` (Linhas 1-50)**

#### Definição e Type Hints
```python
def eh_primo(numero: int) -> bool:
```
- `numero: int` → Tipo hint especificando que o parâmetro é um inteiro
- `-> bool` → Tipo hint especificando que retorna um booleano

#### Docstring Completa
```python
"""
Verifica se um número inteiro é primo.

Um número primo é um número natural maior que 1 que possui exatamente
dois divisores distintos: 1 e ele mesmo.

Args:
    numero: O número inteiro a ser verificado.
    
Returns:
    True se o número é primo, False caso contrário.
    
Raises:
    TypeError: Se o argumento não for um inteiro.
    
Examples:
    >>> eh_primo(2)
    True
"""
```
**Clean Code**: Docstring completa com descrição, argumentos, retorno, exceções e exemplos.

#### Validação de Entrada (Linhas 26-28)
```python
if not isinstance(numero, int):
    raise TypeError(f"Esperado int, recebido {type(numero).__name__}")
```
**Robustez**: Valida o tipo antes de processar. Lança `TypeError` com mensagem descritiva.

#### Otimização 1: Números ≤ 1 (Linhas 30-32)
```python
if numero <= 1:
    return False
```
Por definição matemática, números menores ou iguais a 1 **não são primos**. Retorna imediatamente.

#### Otimização 2: Número 2 (Linhas 34-36)
```python
if numero == 2:
    return True
```
O 2 é o **único número primo par**. Não precisa verificação adicional.

#### Otimização 3: Números Pares (Linhas 38-40)
```python
if numero % 2 == 0:
    return False
```
Todo número par > 2 é divisível por 2, portanto **não é primo**. Elimina metade dos candidatos imediatamente!

#### Algoritmo Principal (Linhas 42-48)
```python
divisor = 3
while divisor * divisor <= numero:
    if numero % divisor == 0:
        return False
    divisor += 2

return True
```

**Pontos-chave**:
- Começa em `divisor = 3` (já testamos 2)
- **Condição `divisor * divisor <= numero`** é CRUCIAL: só verifica até √n
  - Razão matemática: Se `numero = a × b` e `a > √numero`, então `b < √numero`
  - Exemplo: Para verificar 97, só testa até 9 (pois 10² = 100 > 97)
- `divisor += 2` incrementa de 2 em 2 (só testa números ímpares)
- Se encontrar divisor → retorna `False` (não é primo)
- Se passar por todo loop → retorna `True` (é primo)

---

### 2. **Função `obter_numero_do_usuario()` (Linhas 53-67)**

```python
def obter_numero_do_usuario() -> int:
    """Solicita um número inteiro ao usuário via entrada padrão."""
    while True:
        try:
            entrada = input("Digite um número inteiro para verificar se é primo: ").strip()
            numero = int(entrada)
            return numero
        except ValueError:
            print("⚠ Entrada inválida. Por favor, digite um número inteiro válido!\n")
```

**Clean Code - Responsabilidade Única**:
- Função dedicada apenas a capturar entrada do usuário
- `.strip()` remove espaços em branco desnecessários
- `try/except` captura erros se o usuário digitar texto não numérico
- Loop `while True` permanece até receber entrada válida
- Mensagem de erro clara ajuda o usuário

---

### 3. **Função `exibir_resultado()` (Linhas 70-83)**

```python
def exibir_resultado(numero: int, eh_primo_resultado: bool) -> None:
    """Exibe o resultado da verificação de forma formatada."""
    print(f"\n{'='*40}")
    if eh_primo_resultado:
        print(f"✓ O número {numero} É PRIMO!")
    else:
        print(f"✗ O número {numero} NÃO é um número primo.")
    print(f"{'='*40}\n")
```

**Clean Code - Separação de Concerns**:
- Função dedicada apenas à apresentação de resultados
- F-string com formatação para melhor legibilidade
- Usa convenção de ícones (✓ e ✗) para feedback visual

---

### 4. **Função `main()` (Linhas 86-103)**

```python
def main() -> None:
    """Função principal que orquestra a execução do programa."""
    print(f"\n{'='*40}")
    print("VERIFICADOR DE NÚMEROS PRIMOS")
    print(f"{'='*40}\n")
    
    try:
        numero = obter_numero_do_usuario()
        eh_primo_resultado = eh_primo(numero)
        exibir_resultado(numero, eh_primo_resultado)
    except TypeError as erro:
        print(f"\n⚠ Erro de tipo: {erro}\n")
```

**Fluxo do Programa**:
1. Exibe cabeçalho formatado
2. Chama `obter_numero_do_usuario()` para capturar entrada
3. Chama `eh_primo()` para verificar se é primo
4. Chama `exibir_resultado()` para mostrar o resultado
5. Trata exceções `TypeError` (erros de validação)

---

### 5. **Ponto de Entrada (Linhas 106-107)**

```python
if __name__ == "__main__":
    main()
```

**Best Practice**:
- Garante que o código só execute quando o arquivo for rodado diretamente
- Permite importar a função `eh_primo` em outro módulo sem executar o programa
- Padrão profissional em Python

---

## **Complexidade Computacional**

### **Ordem: O(√n)** – Muito eficiente! 🚀

#### Exemplos de Eficiência:
| Número | Até | Divisões Sem Otimização | Com √n | Redução |
|---|---|---|---|---|
| 100 | √100 = 10 | 99 testes | 5 testes | ~95% ✓ |
| 1.000 | √1000 ≈ 32 | 999 testes | 16 testes | ~98% ✓ |
| 1.000.000 | √1000000 = 1.000 | 999.999 testes | 500 testes | ~99.95% ✓ |

Isso torna possível verificar números muito grandes em millisegundos!

---

## **Técnicas de Clean Code Aplicadas**

### 1. **Type Hints (Anotações de Tipo)**
```python
def eh_primo(numero: int) -> bool:
```
- `numero: int` especifica que o parâmetro deve ser um inteiro
- `-> bool` indica que a função retorna um booleano
- **Benefício**: Melhora legibilidade, facilita detecção de erros e auxilia IDEs

### 2. **Docstring Aprimorada**
```python
"""
Verifica se um número inteiro é primo.

Um número primo é um número natural maior que 1 que possui exatamente
dois divisores distintos: 1 e ele mesmo.

Args:
    numero: O número inteiro a ser verificado.
    
Returns:
    True se o número é primo, False caso contrário.
    
Raises:
    TypeError: Se o argumento não for um inteiro.
    
Examples:
    >>> eh_primo(2)
    True
```
- Descrição completa com definição matemática
- Exemplos de uso com doctests
- Documentação de exceções

### 3. **Nomes Descritivos de Variáveis**
```python
# Antes: i
# Depois: divisor
```
- `divisor` é auto-explicativo comparado ao genérico `i`
- Aumenta a **compreensibilidade** do código sem necessidade de comentários

### 4. **Separação de Responsabilidades**
- **Antes**: Tudo junto no `if __name__ == "__main__"`
- **Depois**: Funções separadas:
  - `executar_testes_automaticos()`: Responsável pelos testes pré-definidos
  - `executar_testes_interativos()`: Responsável pela interação com usuário
  - `main()`: Orquestra a execução

### 5. **Extração de Constantes**
```python
NUMEROS_TESTE_AUTOMATICOS = [0, 1, 2, 3, 4, 5, 10, 11, 13, 15, 17, 20, 23, 29, 30, 97, 100]
SEPARADOR_SECAO = "=" * 35
```
- Valores mágicos transformados em **constantes nomeadas**
- Facilita manutenção e mudanças futuras

### 6. **Tratamento de Erros Robusto**
```python
if not isinstance(numero, int):
    raise TypeError(f"Esperado int, recebido {type(numero).__name__}")
```
- Validação de entrada com mensagens claras
- Exceções específicas ao invés de silenciar erros

### 7. **Melhor Estrutura de Código**
```python
def main() -> None:
    executar_testes_automaticos()
    executar_testes_interativos()

if __name__ == "__main__":
    main()
```
- **Ponto de entrada único** através de `main()`
- Facilita testes unitários e importação do módulo

---

## **Análise Técnica do Código**

### **Definição da Função (Linhas 1-3)**
```python
def eh_primo(numero: int) -> bool:
    """
    Verifica se um número inteiro é primo.
```
Define uma função chamada `eh_primo` com:
- **Type hint** `numero: int` - o parâmetro é um inteiro
- **Type hint** `-> bool` - a função retorna um booleano
- Docstring completa com descrição, parâmetros, retorno e exemplos

### **Validação de Entrada (Linhas 27-30)**
```python
if not isinstance(numero, int):
    raise TypeError(f"Esperado int, recebido {type(numero).__name__}")

if numero <= 1:
    return False
```
**Otimização 1**: 
- `isinstance(numero, int)` valida o tipo de entrada
- Lança exceção `TypeError` com mensagem descritiva se tipo inválido
- Números menores ou iguais a 1 não são primos por definição matemática

### **Caso Especial (Linhas 32-34)**
```python
if numero == 2:
    return True
```
**Otimização 2**: O 2 é o **único número primo par**, portanto não precisa verificação adicional. Retorna imediatamente `True`.

### **Eliminação de Pares (Linhas 36-38)**
```python
if numero % 2 == 0:
    return False
```
**Otimização 3**: Qualquer número par > 2 não é primo (divisível por 2). O operador `%` retorna o resto da divisão, eliminando metade dos candidatos.

### **Loop Principal (Linhas 40-46)**
```python
divisor = 3
while divisor * divisor <= numero:
    if numero % divisor == 0:
        return False
    divisor += 2

return True
```
**Algoritmo eficiente**: 
- Inicializa `divisor = 3` (já verificamos 2)
- Variável descritiva `divisor` (antes era `i`) - **clean code**
- A condição `divisor * divisor <= numero` é crucial: só precisa verificar até a raiz quadrada
  - **Justificativa matemática**: Se `numero = a * b` e `a > √numero`, então `b < √numero`, então se não encontrou divisor até √numero, é primo
  - *Exemplos práticos*: Se número = 25, verifica até 5 (5² = 25); Se número = 100, até 10 (10² = 100)
- `divisor += 2` incrementa de 2 em 2 (testa apenas números ímpares)
- Se encontrar divisor, retorna `False` (não é primo)
- Se passar por todo loop, retorna `True` (é primo)

---

## **Testes da Função - Estrutura Refatorada**

### **Constantes (Linhas 49-50)**
```python
NUMEROS_TESTE_AUTOMATICOS = [0, 1, 2, 3, 4, 5, 10, 11, 13, 15, 17, 20, 23, 29, 30, 97, 100]
SEPARADOR_SECAO = "=" * 35
```
**Clean Code - Extração de Constantes**:
- Valores mágicos transformados em constantes nomeadas
- Facilita manutenção e reutilização
- `SEPARADOR_SECAO` usado para formatação consistente

### **Função de Testes Automáticos (Linhas 53-65)**
```python
def executar_testes_automaticos() -> None:
    for numero in NUMEROS_TESTE_AUTOMATICOS:
        resultado = eh_primo(numero)
        status = "✓ PRIMO" if resultado else "✗ NÃO É PRIMO"
        print(f"{numero:3d} → {status}")
```
**Separação de Responsabilidades**:
- Função dedicada aos testes pré-definidos
- Type hint `-> None` indica que não retorna valor
- Docstring explica o propósito
- Código mais testável e reutilizável

### **Função de Testes Interativos (Linhas 68-91)**
```python
def executar_testes_interativos() -> None:
    while True:
        try:
            entrada = input("Digite um número (ou 'sair' para finalizar): ").strip()
            if entrada.lower() == 'sair':
                print("\nEncerrando programa...\n")
                break
            
            numero = int(entrada)
            eh_primo_resultado = eh_primo(numero)
            # ... resto do código
        except ValueError:
            print("⚠ Entrada inválida...")
        except TypeError as erro:
            print(f"⚠ Erro de tipo: {erro}\n")
```
**Tratamento de Erros Robusto**:
- `try/except` captura `ValueError` (entrada não numérica)
- `except TypeError` captura erros da função `eh_primo`
- `.strip()` remove espaços em branco desnecessários
- Nomes descritivos como `eh_primo_resultado`

### **Função Main (Linhas 94-104)**
```python
def main() -> None:
    """Função principal que orquestra a execução dos testes."""
    executar_testes_automaticos()
    executar_testes_interativos()

if __name__ == "__main__":
    main()
```
**Ponto de Entrada Único**:
- `main()` orquestra toda a execução
- Facilita testes unitários
- Permite importar o módulo sem executar testes
- Código mais modular e profissional

---

## **Complexidade Computacional**

**Ordem de Complexidade**: **O(√n)** – muito eficiente mesmo para números grandes! 🚀

### Por quê?
- Ao invés de testar todos os números de 2 até n-1, testamos apenas até √n
- Exemplo prático: para verificar se 1.000.000 é primo, só testamos até 1.000 (aproximadamente)
- Isso reduz drasticamente o número de operações necessárias

---

## **Resumo das Otimizações de Clean Code**

| Técnica | Aplicação | Benefício |
|---|---|---|
| **Type Hints** | `def eh_primo(numero: int) -> bool` | Melhor legibilidade e detecção de erros |
| **Docstring Extendida** | Examples + Raises + Args detalhado | Documentação completa e autodescritiva |
| **Variáveis Descritivas** | `divisor` ao invés de `i` | Código auto-explicativo |
| **Extração de Constantes** | `NUMEROS_TESTE_AUTOMATICOS` | Facilita manutenção |
| **Funções com Responsabilidade Única** | `executar_testes_automaticos()` | Código testável e reutilizável |
| **Validação de Tipo** | `isinstance(numero, int)` | Previne erros de entrada |
| **Tratamento de Exceções** | `except TypeError`, `except ValueError` | Código robusto |
| **Ponto de Entrada Único** | `main()` + `if __name__ == "__main__"` | Profissional e modular |
| **Otimização Algorítmica** | Verificação até √n | O(√n) de complexidade |
| **Incremento de 2 em 2** | `divisor += 2` | Testa apenas ímpares |

---

## **Resumo das Otimizações Algorítmicas**

| Otimização | Benefício |
|---|---|
| Validação de entrada (≤ 1) | Retorna imediatamente |
| Caso especial (= 2) | Identifica único primo par |
| Eliminação de pares | Elimina metade dos candidatos |
| Verificação até √n | Reduz drasticamente iterações |
| Incremento de 2 em 2 | Testa apenas números ímpares |

---

## **Casos de Teste Esperados**

| Número | Resultado | Motivo |
|---|---|---|
| 0, 1 | Não primo | Definição matemática |
| 2 | Primo | Único primo par |
| 3, 5, 7, 11, 13, 17, 19, 23, 29 | Primo | Sem divisores |
| 4, 6, 8, 10, 12, 14, 16, 18, 20 | Não primo | Números pares > 2 |
| 9, 15, 21, 25, 27 | Não primo | Divisíveis por números ímpares |
| 97 | Primo | Número grande sem divisores |

---

## **Melhores Práticas de Python (PEP 8 & Clean Code)**

### 1. **Nomenclatura UPPERCASE para Constantes**
```python
NUMEROS_TESTE_AUTOMATICOS = [...]  # Constante
SEPARADOR_SECAO = "=" * 35        # Constante
```
- Constantes devem estar em UPPERCASE com underscores
- Seguindo a convenção PEP 8 do Python

### 2. **Docstrings em Português Técnico**
- Descrição clara e objetiva
- Incluir Args, Returns, Raises e Examples
- Permite geração automática de documentação (Sphinx)

### 3. **Return Type Hints**
```python
def executar_testes_automaticos() -> None:
```
- `-> None` indica explicitamente que não há retorno
- Funções sem `return` devem ser `-> None`

### 4. **String Methods para Limpeza**
```python
entrada = input(...).strip()  # Remove espaços em branco
if entrada.lower() == 'sair':  # Case-insensitive comparison
```

### 5. **Expressões Ternárias para Lógica Simples**
```python
status = "✓ PRIMO" if resultado else "✗ NÃO É PRIMO"
```
- Mais legível que `if/else` para atribuições simples

### 6. **F-strings para Formatação**
```python
print(f"{numero:3d} → {status}")  # Número alinhado em 3 dígitos
print(f"Esperado int, recebido {type(numero).__name__}")
```
- Mais legível e performático que `.format()` ou `%`

### 7. **Estrutura de Projeto Profissional**
```
rum_primo.py
├── Definição de constantes no topo
├── Função principal (eh_primo)
├── Funções auxiliares (executar_testes_automaticos, etc)
├── Função main()
└── if __name__ == "__main__": main()
```

---

## **Como Usar Este Código**

### Executar testes
```bash
python rum_primo.py
```

### Importar a função em outro módulo
```python
from rum_primo import eh_primo

# Usar apenas a função, sem executar testes
resultado = eh_primo(17)
print(resultado)  # True
```

---

## **Possíveis Melhorias Futuras**

1. **Testes Unitários** - Criar `test_rum_primo.py` com pytest
2. **Logging** - Substituir `print()` por `logging.Logger`
3. **Performance** - Usar Sieve of Eratosthenes para múltiplos primos
4. **Validação** - Aceitar números grandes (BigInt)
5. **Documentação** - Gerar docs com Sphinx
6. **Type Checking** - Usar mypy para validação estática
