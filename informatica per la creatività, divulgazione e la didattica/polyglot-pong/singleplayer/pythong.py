bar_x = 0
score = 0
interval = 0
interval_step = 0
ball_x = 0
ball_y = 0
ball_dx = 0
ball_dy = 0
in_game = False

def on_button_pressed_a():
    global bar_x
    if bar_x > 0:
        led.unplot(bar_x + 1, 4)
        bar_x = bar_x - 1
        led.plot(bar_x, 4)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global bar_x
    if bar_x < 3:
        led.unplot(bar_x, 4)
        bar_x = bar_x + 1
        led.plot(bar_x + 1, 4)
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_forever():
    global score, interval, interval_step, ball_x, ball_y, ball_dx, ball_dy, bar_x, in_game
    score = 0
    interval = 500
    interval_step = 10
    ball_x = 3
    ball_y = 4
    ball_dx = -1
    ball_dy = -1
    bar_x = 0
    basic.show_string("GO")
    led.plot(ball_x, ball_y)
    led.plot(bar_x, 4)
    led.plot(bar_x + 1, 4)
    in_game = True
    while in_game:
        if ball_x + ball_dx > 4:
            ball_dx = ball_dx * -1
        elif ball_x + ball_dx < 0:
            ball_dx = ball_dx * -1
        if ball_y + ball_dy < 0:
            ball_dy = ball_dy * -1
        elif ball_y + ball_dy > 3:
            if led.point(ball_x + ball_dx, ball_y + ball_dy):
                ball_dy = ball_dy * -1
                score = score + 1
                if interval - interval_step >= 0:
                    interval = interval - interval_step
            else:
                in_game = False
        if in_game:
            led.plot(ball_x + ball_dx, ball_y + ball_dy)
            led.unplot(ball_x, ball_y)
            ball_x = ball_x + ball_dx
            ball_y = ball_y + ball_dy
            basic.pause(interval)
        else:
            game.set_score(score)
            game.game_over()
basic.forever(on_forever)

