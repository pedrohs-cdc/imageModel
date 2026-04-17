def eh_primo(numero: int) -> bool:
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
        >>> eh_primo(17)
        True
        >>> eh_primo(4)
        False
        >>> eh_primo(1)
        False
    """
    if not isinstance(numero, int):
        raise TypeError(f"Esperado int, recebido {type(numero).__name__}")
    
    # Números menores ou iguais a 1 não são primos por definição
    if numero <= 1:
        return False
    
    # 2 é o único número primo par
    if numero == 2:
        return True
    
    # Números pares maiores que 2 não são primos
    if numero % 2 == 0:
        return False
    
    # Verifica divisibilidade por números ímpares até a raiz quadrada do número
    # Otimização: só precisa testar até sqrt(numero) pois se numero = a * b
    # e a > sqrt(numero), então b < sqrt(numero)
    divisor = 3
    while divisor * divisor <= numero:
        if numero % divisor == 0:
            return False
        divisor += 2
    
    return True


def obter_numero_do_usuario() -> int:
    """
    Solicita um número inteiro ao usuário via entrada padrão.
    
    Returns:
        int: O número inteiro fornecido pelo usuário.
        
    Raises:
        ValueError: Se a entrada não for um número inteiro válido.
    """
    while True:
        try:
            entrada = input("Digite um número inteiro para verificar se é primo: ").strip()
            numero = int(entrada)
            return numero
        except ValueError:
            print("⚠ Entrada inválida. Por favor, digite um número inteiro válido!\n")


def exibir_resultado(numero: int, eh_primo_resultado: bool) -> None:
    """
    Exibe o resultado da verificação de número primo de forma formatada.
    
    Args:
        numero: O número verificado.
        eh_primo_resultado: True se o número é primo, False caso contrário.
    """
    print(f"\n{'='*40}")
    if eh_primo_resultado:
        print(f"✓ O número {numero} É PRIMO!")
    else:
        print(f"✗ O número {numero} NÃO é um número primo.")
    print(f"{'='*40}\n")


def main() -> None:
    """
    Função principal que orquestra a execução do programa.
    
    Solicita um número ao usuário e verifica se é primo.
    """
    print(f"\n{'='*40}")
    print("VERIFICADOR DE NÚMEROS PRIMOS")
    print(f"{'='*40}\n")
    
    try:
        numero = obter_numero_do_usuario()
        eh_primo_resultado = eh_primo(numero)
        exibir_resultado(numero, eh_primo_resultado)
    except TypeError as erro:
        print(f"\n⚠ Erro de tipo: {erro}\n")


if __name__ == "__main__":
    main()
