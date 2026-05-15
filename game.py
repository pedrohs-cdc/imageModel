import tkinter as tk
import random
import math

# ==========================================
# Configurações Globais (Tkinter)
# ==========================================
WIDTH, HEIGHT = 800, 600
FPS = 60
DELAY = 1000 // FPS

COLOR_BG = "#0a0a12"        
COLOR_PLAYER = "#00d2ff"   
COLOR_TEXT = "#f0f0f0"     
COLOR_HEART = "#ff3c64"    
COLOR_BONUS = "#00ffcc"

JEWEL_TYPES = [
    {"color": "#ff3232", "points": 1},   # Rubi
    {"color": "#32ff78", "points": 1},  # Esmeralda
    {"color": "#ffd700", "points": 2},   # Ouro
    {"color": "#b446ff", "points": 1}   # Ametista
]

class JewelHunterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Arcade Shooter - Antigravity Edition")
        self.root.geometry(f"{WIDTH}x{HEIGHT}")
        self.root.resizable(False, False)

        self.canvas = tk.Canvas(root, width=WIDTH, height=HEIGHT, bg=COLOR_BG, highlightthickness=0)
        self.canvas.pack()

        # Estado do jogo
        self.score = 0
        self.lives = 5
        self.running = False
        
        self.jewels = []
        self.projectiles = []
        self.bonuses = []
        
        # Player Stats
        self.attack_power = 1
        
        # Dificuldade Dinâmica
        self.base_spawn_rate = 50 
        self.frame_count = 0
        self.speed_multiplier = 1.0

        # Textos da Interface
        self.score_text = self.canvas.create_text(30, 30, text=f"SCORE: {self.score}", fill=COLOR_TEXT, font=("Segoe UI", 24, "bold"), anchor="nw")
        self.lives_text = self.canvas.create_text(WIDTH - 150, 30, text=f"LIVES: {self.lives}", fill=COLOR_HEART, font=("Segoe UI", 24, "bold"), anchor="nw")
        self.power_text = self.canvas.create_text(30, 70, text=f"WEAPON LVL: {self.attack_power}", fill=COLOR_BONUS, font=("Segoe UI", 16, "bold"), anchor="nw")
        
        self.hint_text = self.canvas.create_text(WIDTH//2, HEIGHT - 30, text="Mover: Setas | Atirar: Espaço", fill="#646464", font=("Segoe UI", 12))

        # Jogador
        self.player_w, self.player_h = 60, 40 # Formato mais de "nave" (largo embaixo, bico em cima? vamos usar rect por enquanto)
        self.player_x = WIDTH // 2 - self.player_w // 2
        self.player_y = HEIGHT - 80
        self.player_speed = 12
        
        # Glow do jogador (vários retângulos para simular blur)
        self.player_glow2 = self.canvas.create_rectangle(self.player_x - 4, self.player_y - 4, self.player_x + self.player_w + 4, self.player_y + self.player_h + 4, fill="", outline="#0080aa", width=4)
        self.player_glow = self.canvas.create_rectangle(self.player_x - 2, self.player_y - 2, self.player_x + self.player_w + 2, self.player_y + self.player_h + 2, fill="", outline="#00aacc", width=2)
        
        self.player_rect = self.canvas.create_polygon(
            self.player_x + self.player_w//2, self.player_y, # Ponta
            self.player_x, self.player_y + self.player_h, # Base Esquerda
            self.player_x + self.player_w, self.player_y + self.player_h, # Base Direita
            fill=COLOR_PLAYER, outline="white"
        )

        # Controles
        self.keys = {'Left': False, 'Right': False}
        self.root.bind('<KeyPress-Left>', self.key_press)
        self.root.bind('<KeyRelease-Left>', self.key_release)
        self.root.bind('<KeyPress-Right>', self.key_press)
        self.root.bind('<KeyRelease-Right>', self.key_release)
        self.root.bind('<KeyPress-a>', self.key_press)
        self.root.bind('<KeyRelease-a>', self.key_release)
        self.root.bind('<KeyPress-d>', self.key_press)
        self.root.bind('<KeyRelease-d>', self.key_release)
        
        self.root.bind('<KeyPress-space>', self.shoot)

        self.start_game()

    def update_player_visuals(self):
        # Atualiza a posição do triângulo
        self.canvas.coords(self.player_rect, 
            self.player_x + self.player_w//2, self.player_y,
            self.player_x, self.player_y + self.player_h,
            self.player_x + self.player_w, self.player_y + self.player_h
        )
        self.canvas.coords(self.player_glow, self.player_x - 2, self.player_y - 2, self.player_x + self.player_w + 2, self.player_y + self.player_h + 2)
        self.canvas.coords(self.player_glow2, self.player_x - 4, self.player_y - 4, self.player_x + self.player_w + 4, self.player_y + self.player_h + 4)


    def key_press(self, event):
        key = event.keysym
        if key in ['Left', 'a', 'A']: self.keys['Left'] = True
        if key in ['Right', 'd', 'D']: self.keys['Right'] = True

    def key_release(self, event):
        key = event.keysym
        if key in ['Left', 'a', 'A']: self.keys['Left'] = False
        if key in ['Right', 'd', 'D']: self.keys['Right'] = False

    def shoot(self, event):
        if not self.running: return
        
        p_speed = -15
        p_radius = 4
        p_color = "#ffff00"
        
        # Ponto de origem (bico da nave)
        origin_x = self.player_x + self.player_w // 2
        origin_y = self.player_y
        
        if self.attack_power == 1:
            self.spawn_projectile(origin_x, origin_y, 0, p_speed, p_radius, p_color)
        elif self.attack_power == 2:
            self.spawn_projectile(origin_x - 10, origin_y, 0, p_speed, p_radius, p_color)
            self.spawn_projectile(origin_x + 10, origin_y, 0, p_speed, p_radius, p_color)
        elif self.attack_power == 3:
            self.spawn_projectile(origin_x - 15, origin_y, -2, p_speed, p_radius, p_color)
            self.spawn_projectile(origin_x, origin_y, 0, p_speed, p_radius, p_color)
            self.spawn_projectile(origin_x + 15, origin_y, 2, p_speed, p_radius, p_color)
        else: # Nível 4 ou mais
            self.spawn_projectile(origin_x - 20, origin_y, -3, p_speed, p_radius, p_color)
            self.spawn_projectile(origin_x - 10, origin_y, 0, p_speed, p_radius, p_color)
            self.spawn_projectile(origin_x + 10, origin_y, 0, p_speed, p_radius, p_color)
            self.spawn_projectile(origin_x + 20, origin_y, 3, p_speed, p_radius, p_color)

    def spawn_projectile(self, x, y, dx, dy, r, color):
        p_id = self.canvas.create_oval(x-r, y-r, x+r, y+r, fill=color, outline="white")
        self.projectiles.append({
            'id': p_id,
            'x': x,
            'y': y,
            'dx': dx,
            'dy': dy,
            'radius': r
        })

    def start_game(self):
        self.running = True
        self.game_loop()

    def game_loop(self):
        if not self.running: return

        # 1. Atualizar Multiplicador de Velocidade (Aumenta a cada 20 pontos)
        self.speed_multiplier = 1.0 + (self.score // 20) * 0.2
        # Spawn rate mais rápido com a dificuldade
        current_spawn_rate = max(10, int(self.base_spawn_rate / self.speed_multiplier))

        # 2. Movimento do Jogador
        if self.keys['Left'] and self.player_x > 0:
            self.player_x -= self.player_speed
        if self.keys['Right'] and self.player_x < WIDTH - self.player_w:
            self.player_x += self.player_speed

        self.update_player_visuals()

        # 3. Spawn de Inimigos / Bônus
        self.frame_count += 1
        if self.frame_count >= current_spawn_rate:
            if random.random() < 0.1: # 10% de chance de spawnar um bônus
                self.spawn_bonus()
            else:
                self.spawn_jewel()
            self.frame_count = 0

        # 4. Atualiza Projéteis
        for proj in self.projectiles[:]:
            proj['y'] += proj['dy']
            proj['x'] += proj['dx']
            self.canvas.coords(proj['id'], proj['x'] - proj['radius'], proj['y'] - proj['radius'], proj['x'] + proj['radius'], proj['y'] + proj['radius'])
            
            if proj['y'] < 0 or proj['x'] < 0 or proj['x'] > WIDTH:
                self.canvas.delete(proj['id'])
                self.projectiles.remove(proj)

        # 5. Atualiza Inimigos (Joias)
        for jewel in self.jewels[:]:
            jewel['y'] += jewel['speed'] * self.speed_multiplier
            self.canvas.coords(jewel['id'], jewel['x'] - jewel['radius'], jewel['y'] - jewel['radius'], jewel['x'] + jewel['radius'], jewel['y'] + jewel['radius'])
            
            # Colisão Jogador vs Inimigo (Perde Vida)
            if self.check_collision_circle_rect(jewel['x'], jewel['y'], jewel['radius'], self.player_x, self.player_y, self.player_w, self.player_h):
                self.lives -= 1
                self.canvas.itemconfig(self.lives_text, text=f"LIVES: {self.lives}")
                self.canvas.delete(jewel['id'])
                self.jewels.remove(jewel)
                self.show_damage_effect()
                if self.lives <= 0:
                    self.game_over()
                    return
                continue
            
            # Passou do fundo (apenas deleta)
            if jewel['y'] > HEIGHT + jewel['radius']:
                self.canvas.delete(jewel['id'])
                self.jewels.remove(jewel)

        # 6. Atualiza Bônus
        for bonus in self.bonuses[:]:
            bonus['y'] += bonus['speed'] * self.speed_multiplier
            self.canvas.coords(bonus['id'], bonus['x'] - bonus['radius'], bonus['y'] - bonus['radius'], bonus['x'] + bonus['radius'], bonus['y'] + bonus['radius'])
            self.canvas.coords(bonus['core_id'], bonus['x'] - bonus['radius']/2, bonus['y'] - bonus['radius']/2, bonus['x'] + bonus['radius']/2, bonus['y'] + bonus['radius']/2)
            
            # Colisão Jogador vs Bônus (Não dá dano, deleta apenas)
            if self.check_collision_circle_rect(bonus['x'], bonus['y'], bonus['radius'], self.player_x, self.player_y, self.player_w, self.player_h):
                self.canvas.delete(bonus['id'])
                self.canvas.delete(bonus['core_id'])
                self.bonuses.remove(bonus)
                continue
                
            if bonus['y'] > HEIGHT + bonus['radius']:
                self.canvas.delete(bonus['id'])
                self.canvas.delete(bonus['core_id'])
                self.bonuses.remove(bonus)

        # 7. Colisão Projétil vs Inimigo/Bônus
        for proj in self.projectiles[:]:
            hit_something = False
            
            # Checa contra inimigos
            for jewel in self.jewels[:]:
                dist = math.hypot(proj['x'] - jewel['x'], proj['y'] - jewel['y'])
                if dist < proj['radius'] + jewel['radius']:
                    # Acertou Inimigo
                    self.score += jewel['points']
                    self.canvas.itemconfig(self.score_text, text=f"SCORE: {self.score}")
                    
                    self.canvas.delete(jewel['id'])
                    self.jewels.remove(jewel)
                    hit_something = True
                    break
            
            if hit_something:
                self.canvas.delete(proj['id'])
                if proj in self.projectiles:
                    self.projectiles.remove(proj)
                continue
                
            # Checa contra Bônus
            for bonus in self.bonuses[:]:
                dist = math.hypot(proj['x'] - bonus['x'], proj['y'] - bonus['y'])
                if dist < proj['radius'] + bonus['radius']:
                    # Acertou Bônus -> Upgrade!
                    self.attack_power = min(4, self.attack_power + 1)
                    self.canvas.itemconfig(self.power_text, text=f"WEAPON LVL: {self.attack_power}")
                    
                    self.canvas.delete(bonus['id'])
                    self.canvas.delete(bonus['core_id'])
                    self.bonuses.remove(bonus)
                    hit_something = True
                    break
                    
            if hit_something:
                self.canvas.delete(proj['id'])
                if proj in self.projectiles:
                    self.projectiles.remove(proj)

        self.root.after(DELAY, self.game_loop)

    def check_collision_circle_rect(self, cx, cy, r, rx, ry, rw, rh):
        # Forma simples de colisão (trata a nave como retângulo)
        closest_x = max(rx, min(cx, rx + rw))
        closest_y = max(ry, min(cy, ry + rh))
        distance_x = cx - closest_x
        distance_y = cy - closest_y
        return (distance_x ** 2 + distance_y ** 2) < (r ** 2)

    def spawn_jewel(self):
        j_type = random.choice(JEWEL_TYPES)
        radius = random.randint(12, 18)
        x = random.randint(radius, WIDTH - radius)
        y = -radius
        speed = random.uniform(3.0, 5.5)
        
        j_id = self.canvas.create_oval(x - radius, y - radius, x + radius, y + radius, fill=j_type['color'], outline="white")
        
        self.jewels.append({
            'id': j_id,
            'x': x,
            'y': y,
            'radius': radius,
            'speed': speed,
            'points': j_type['points']
        })
        
    def spawn_bonus(self):
        radius = 16
        x = random.randint(radius, WIDTH - radius)
        y = -radius
        speed = random.uniform(2.0, 4.0)
        
        # Visual especial (Duplo círculo)
        b_id = self.canvas.create_oval(x - radius, y - radius, x + radius, y + radius, fill="", outline=COLOR_BONUS, width=3)
        b_core = self.canvas.create_oval(x - radius/2, y - radius/2, x + radius/2, y + radius/2, fill=COLOR_BONUS, outline="white")
        
        self.bonuses.append({
            'id': b_id,
            'core_id': b_core,
            'x': x,
            'y': y,
            'radius': radius,
            'speed': speed
        })

    def show_damage_effect(self):
        # Pisca a tela em vermelho
        flash = self.canvas.create_rectangle(0, 0, WIDTH, HEIGHT, fill="#ff0000", stipple="gray50")
        self.root.after(50, lambda: self.canvas.delete(flash))

    def game_over(self):
        self.running = False
        self.canvas.create_rectangle(0, 0, WIDTH, HEIGHT, fill="#000000", stipple="gray50")
        self.canvas.create_text(WIDTH//2, HEIGHT//2 - 40, text="GAME OVER", fill="#ff5050", font=("Segoe UI", 48, "bold"))
        self.canvas.create_text(WIDTH//2, HEIGHT//2 + 30, text=f"Pontuação Final: {self.score}", fill="white", font=("Segoe UI", 24))

if __name__ == "__main__":
    root = tk.Tk()
    app = JewelHunterApp(root)
    root.mainloop()
