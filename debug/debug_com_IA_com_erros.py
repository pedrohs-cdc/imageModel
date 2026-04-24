from math import sqrt
def main():
    # === BLOCO 1: // e % ===
    s = 3661
    m = s / 60        # erro 1
    s = s // 60       # erro 2
    h = m / 60        # erro 3
    m = m % 60
    print(m, s, h)    # erro 4
    # === BLOCO 2: if aninhado + end='' ===
    nota = 10
    if nota > 6:                          # erro 5
        print("Aprovado")                 # erro 6
        if nota = 10:                     # erro 7
            print("Parabéns!!!")
    else:
        print("Reprovado")
    # === BLOCO 3: potência ** ===
    resultado = (2 ** 3) ** 2   # erro 8
    print("Resultado:", resultado)
    x = 9
    raiz = x ** 1 / 2           # erro 9
    print("Raiz de 9:", raiz)
    # === BLOCO 4: and, or, not ===
    idade = 62
    tempo = 27
    if idade >= 65 or tempo >= 30 and idade >= 60 or tempo >= 25:   # erro 10
        print("Aposenta")
    else:
        print("Não aposenta")
    num = 7
    if num % 2 = 0:             # erro 11
        print("par")
    else:
        print("ímpar)           # erro 12
main()