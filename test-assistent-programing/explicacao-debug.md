from typing import Tuple, List


def calculate_statistics(numbers: List[int]) -> Tuple[int, float, int, int]:
    """
    Calcula estatísticas básicas de uma lista de números.
    
    Args:
        numbers: Lista de números inteiros
        
    Returns:
        Tupla contendo (total, média, máximo, mínimo)
    """
    total = sum(numbers)
    average = total / len(numbers)
    maximum = max(numbers)
    minimum = min(numbers)
    
    return total, average, maximum, minimum


def main() -> None:
    """Função principal para demonstração das estatísticas."""
    numbers = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]
    
    total, average, maximum, minimum = calculate_statistics(numbers)
    
    print(f"Total:   {total}")
    print(f"Média:   {average:.2f}")
    print(f"Maior:   {maximum}")
    print(f"Menor:   {minimum}")


if __name__ == "__main__":
    main()



Explique este código linha por linha.



Explicação linha por linha
Importação
pythonfrom typing import Tuple, List
Importa os tipos Tuple e List do módulo typing, usados para anotações de tipo (type hints). Isso permite indicar que uma variável é uma lista ou tupla com tipos específicos, melhorando a legibilidade e permitindo verificação estática.
Função calculate_statistics
pythondef calculate_statistics(numbers: List[int]) -> Tuple[int, float, int, int]:
Define a função que recebe numbers (uma lista de inteiros) e retorna uma tupla com quatro valores: um int, um float e mais dois int. Essas anotações são apenas indicativas — o Python não força os tipos em tempo de execução.
python"""
Calcula estatísticas básicas de uma lista de números.
...
"""
Docstring que documenta o propósito da função, seus parâmetros e o retorno. É uma boa prática e pode ser acessada via help(calculate_statistics).
pythontotal = sum(numbers)
Usa a função embutida sum() para somar todos os elementos da lista. Para [23, 7, 45, 2, 67, 12, 89, 34, 56, 11], o resultado é 346.
pythonaverage = total / len(numbers)
Calcula a média dividindo o total pelo número de elementos (len(numbers) retorna o tamanho da lista). O operador / faz divisão real (resulta em float), então o valor será 34.6.
pythonmaximum = max(numbers)
minimum = min(numbers)
Funções embutidas que retornam, respectivamente, o maior e o menor valor da lista. Aqui dão 89 e 2.
pythonreturn total, average, maximum, minimum
Retorna os quatro valores. Em Python, separar valores por vírgula no return cria implicitamente uma tupla — equivalente a return (total, average, maximum, minimum).
Função main
pythondef main() -> None:
Define a função principal. A anotação -> None indica que ela não retorna nada significativo (apenas executa ações com efeito colateral, como imprimir).
pythonnumbers = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]
Cria uma lista com 10 inteiros para servir como dados de entrada.
pythontotal, average, maximum, minimum = calculate_statistics(numbers)
Chama a função e faz desempacotamento de tupla (tuple unpacking): os quatro valores retornados são atribuídos a quatro variáveis em uma só linha.
pythonprint(f"Total:   {total}")
print(f"Média:   {average:.2f}")
print(f"Maior:   {maximum}")
print(f"Menor:   {minimum}")
Usa f-strings (strings formatadas) para imprimir os resultados. O detalhe importante está em {average:.2f}: o :.2f formata o número como ponto flutuante com 2 casas decimais, então 34.6 aparece como 34.60.
Bloco de execução
pythonif __name__ == "__main__":
    main()
Esse é um padrão idiomático em Python. A variável especial __name__ recebe o valor "__main__" quando o arquivo é executado diretamente, mas recebe o nome do módulo se for importado por outro script. Assim, main() só roda quando o arquivo é executado diretamente — útil para que o código possa ser reaproveitado como módulo sem disparar a execução automaticamente.
Saída esperada
Total:   346
Média:   34.60
Maior:   89
Menor:   2
Observação sobre robustez
Vale notar que calculate_statistics lança erros se receber uma lista vazia: len(numbers) seria 0 (causando ZeroDivisionError) e max/min levantariam ValueError. Em código de produção, seria interessante tratar esse caso explicitamente.