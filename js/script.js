//Обращаемся к игровому полю в HTML
let canvas = document.getElementById("game");
//Делаем поле двухмерным
let context = canvas.getContext("2d");
//Размер игровой клетки
let grid = 15;
//Высота платформы
let paddleHeight = grid * 4;
//Скорость платформы
let paddleSpeed = 7;
//Скорость мяча
let ballSpeed = 3;
//Число определяющее полет мяча
let randomNumber = Math.random().toFixed(1) * 10;
//Набранные очки
let count = 0
//Описываем левую платформу
let leftPaddle = {
    //указываем начальные координаты платформы
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    //Высота платформы
    height: paddleHeight * 2,
    //Ширина платформы
    width: grid,
    //Направление движения
    dy: 0
}


//Описываем правую платформу
let rightPaddle = {
    //указываем начальные координаты платформы
    x: canvas.width - grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    //Высота платформы
    height: paddleHeight,
    //Ширина платформы
    width: grid,
    //Направление движения
    dy: 0
}
//Обозначим границы для платоформы
let maxLeftPaddleY = canvas.height - grid - leftPaddle.height;
//Обозначим границы для платоформы
let maxRightPaddleY = canvas.height - grid - rightPaddle.height;
//Описываем мяч
let ball = {
    //Начальное положение мяча
    x: canvas.width / 2,
    y: canvas.height / 2,
    //Ширина и высота мяча
    width: grid,
    height: grid,
    //признак перезапуска мяча
    restarting: false,
    //Начальное ускорение
    dx: ballSpeed,
    dy: -ballSpeed
}
//Главный цикл игры
function loop(){

    //Очищаем игровое поле
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    //Если платформы куда-то двигались - путь продолжают
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
    //Проверка выхода за границы холста левой платформы
    //Ушла ли платформа вверх
    if(leftPaddle.y <= grid){
        leftPaddle.y = grid;
         
        
    }
    //Ушла ли платформа вниз
    if(leftPaddle.y > maxLeftPaddleY){
        leftPaddle.y = maxLeftPaddleY;
        
    }

    //Проверка выхода за границы холста правой платформы
    //Ушла ли платформа вверх
    if(rightPaddle.y <= grid){
        rightPaddle.y = grid;
    }
    //Ушла ли платформа вниз
    if(rightPaddle.y > maxRightPaddleY){
        rightPaddle.y = maxRightPaddleY;
    }

    //Задаем цвет
    context.fillStyle = 'white';
    //Рисуем платформы
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, grid);
    for(let i = grid; i < canvas.height - grid; i += grid*2)
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
    
    //Задаем цвет
    context.fillStyle = 'green';
    //Рисуем мяч
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    
    //Если мяч двигался, то пусть продолжает
        ball.x += ball.dx;{
        ball.y += ball.dy;
    }
    //Левая платформа двигоется как мяч
    leftPaddle.dy = ball.dy
    //Если мяч коснулся стенки направляем его в противоположную сторону
    if ( (ball.y <= grid) || (ball.y + grid >= canvas.height - grid)) {
        ball.dy *= -1;
        sound()
    }
    //Задаём цвет очков игры
    context.fillStyle = "009900"
    //Шрифт и размер
    context.font = "Algerian"
    //Вводим очки
    context.fillText(count, 450, 550)
        
    //Отслеживаем нажатия клавишь
    document.addEventListener("keydown", function(e){
        //Если нажата стрелка вверх
        if(e.which == 38){
            //Двигаем правую платформу вверх
            rightPaddle.dy = -paddleSpeed;
        }
        //Иначе если нажата стрелка вниз
        else if(e.which == 40){
            //Двигаем правую платформу вниз
            rightPaddle.dy = paddleSpeed;
        

        }
    })
    document.addEventListener("keyup", function(e){
        //Если отпущена стрелка вверх
        if(e.which == 38){
            //Двигаем правую платформу вверх
            rightPaddle.dy = 0;
        }
        //Иначе если отпущена стрелка вниз
        else if(e.which == 40){
            //Двигаем правую платформу вниз
            rightPaddle.dy = 0;
        
        }
    })
    //Если мяч коснулся платформ
    if (collides(ball, rightPaddle)){
        ball.dx *= -1;
        sound()
        count++
    }
    if(collides(ball, leftPaddle)){
        ball.dx *= -1;
        sound()
        
    }
        //Если мяч вылетел за границы игрового поля
        if ((ball.x < 0 || ball.x > canvas.width) && !ball.restarting){
            ball.restarting = true
            alert('Game over!Restart?');
            //Даём секунду игроку
            setTimeout(()=>{
                ball.restarting = false
                count = 0
            //Ставим шарик в начальное положение
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            }, 1000)
            
        
        }
        
}

//Запуск игры
requestAnimationFrame(loop);

//Функция проверки пересечения платформ
function collides(object1, object2){
    return object1.x < object2.x + object2.width &&
           object1.x + object1.width > object2.x &&
           object1.y < object2.y + object2.height &&
           object1.y + object1.height > object2.y;
}

function end(){
    
}
//Запуск звука
function sound(){
    let audio = new Audio()
    audio.src = "src/music/pop.mp3"
    audio.autoplay = true
}