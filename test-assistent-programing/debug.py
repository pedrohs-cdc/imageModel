from math import sqrt
def main():
    # === BLOCO 1: // e % ===
    s = 3661
    m = s // 60       # erro 1 (corrigido: divisão inteira)
    s = s % 60        # erro 2 (corrigido: resto da divisão)
    h = m // 60       # erro 3 (corrigido: divisão inteira)
    m = m % 60
    print(h, m, s)    # erro 4 (corrigido: ordem de exibição)

    # === BLOCO 2: if aninhado + end='' ===
    nota = 10
    # Verifica a condição principal de aprovação (nota maior ou igual a 6)
    if nota >= 6:                         # erro 5 (corrigido: >= 6)
        print("Aprovado", end=' ')        # erro 6 (corrigido: adicionado end=' ')
        # Decisão aninhada: verifica um caso específico (nota máxima) apenas para alunos que já passaram na condição anterior
        if nota == 10:                    # erro 7 (corrigido: operador de igualdade ==)
            print("Parabéns!!!")
    else:
        # Fluxo alternativo para notas que não cumprem o requisito mínimo
        print("Reprovado")

    # === BLOCO 3: potência ** ===
    resultado = 2 ** 3 ** 2     # erro 8 (corrigido: removido parênteses para associatividade à direita ou mantido se intenção diferente)
    print("Resultado:", resultado)
    x = 9
    raiz = x ** (1 / 2)         # erro 9 (corrigido: adicionado parênteses na fração)
    print("Raiz de 9:", raiz)

    # === BLOCO 4: and, or, not ===
    idade = 62
    tempo = 27
    # Avalia os critérios de negócio para aposentadoria:
    # 1. Por idade mínima (65 anos) OU
    # 2. Por tempo de contribuição mínimo (30 anos) OU
    # 3. Regra composta: idade mínima (60) E tempo mínimo (25) atingidos simultaneamente.
    # (A ausência de parênteses na regra composta pode causar avaliação inesperada devido à precedência de 'and' sobre 'or')
    if idade >= 65 or tempo >= 30 or (idade >= 60 and tempo >= 25):   # erro 10 (corrigido: 'or' ao invés de 'and' e parênteses)
        print("Aposenta")
    else:
        print("Não aposenta")

    num = 7
    # Verifica a paridade testando se o resto da divisão por 2 é zero
    if num % 2 == 0:            # erro 11 (corrigido: operador de igualdade ==)
        print("par")
    else:
        print("ímpar")          # erro 12 (corrigido: fechamento de aspas)

main()