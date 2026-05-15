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