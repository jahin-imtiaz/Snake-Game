var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
var scale = 25;
var rows = canvas.height / scale;
var cols = canvas.width / scale;
var cur_direction = "Up";
var total_eaten = 0;
var intervalID;
var interval_time;
// prettier-ignore
var courses = [101, 114, 160,161,214,215,216,220,300,303,306,307,310,311,312,316,320,327,334,337,351,352,354,371,373,376,380,385,416,506,512,526,527,532,540,541,544,545,548,550,555,564,566,600,645]
var initialLength;

function Snake() {
    this.xLength = 0;
    this.yLength = -scale;
    this.x = canvas.width / 2;
    this.y = 10 * scale;
    this.total = 0;
    this.arr = [];

    this.findDirection = () => {
        if (this.arr.length === 1) {
            return cur_direction;
        } else {
            loc1 = this.arr[0];
            loc2 = this.arr[1];

            if (loc1.x === loc2.x) {
                if (loc1.y - loc2.y < 0) {
                    return "Down";
                } else {
                    return "Up";
                }
            } else {
                if (loc1.x - loc2.x < 0) {
                    return "Right";
                } else {
                    return "Left";
                }
            }
        }
    };

    this.crash = (x, y) => {
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i].x === x && this.arr[i].y === y) {
                return true;
            }
        }
        return false;
    };

    this.draw = () => {
        if (
            this.x >= canvas.width ||
            this.x < 0 ||
            this.y >= canvas.height ||
            this.y < 0 ||
            this.crash(this.x, this.y)
        ) {
            document.getElementById("restart_button").style.visibility =
                "visible";
            document.getElementById("game_message").innerHTML =
                "Score: " + (initialLength - courses.length - 1);
            window.clearInterval(intervalID);
        }

        for (let i = 0; i < this.arr.length; i++) {
            if (i === this.arr.length - 1) {
                ctx.fillStyle = "#966c6c";
                ctx.fillRect(this.arr[i].x, this.arr[i].y, scale, scale);

                switch (cur_direction) {
                    case "Up":
                        ctx.beginPath();
                        ctx.fillStyle = "white";
                        // prettier-ignore
                        ctx.arc(this.arr[i].x + 5, this.arr[i].y + 5, 2, 0, 2 * Math.PI);
                        ctx.fill();
                        // prettier-ignore
                        ctx.arc(this.arr[i].x + 20, this.arr[i].y + 5, 2, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    case "Down":
                        ctx.beginPath();
                        ctx.fillStyle = "white";
                        // prettier-ignore
                        ctx.arc(this.arr[i].x + 5, this.arr[i].y + 20, 2, 0, 2 * Math.PI);
                        ctx.fill();
                        // prettier-ignore
                        ctx.arc(this.arr[i].x + 20, this.arr[i].y + 20, 2, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    case "Left":
                        ctx.beginPath();
                        ctx.fillStyle = "white";
                        // prettier-ignore
                        ctx.arc(this.arr[i].x + 5, this.arr[i].y + 5, 2, 0, 2 * Math.PI);
                        ctx.fill();
                        // prettier-ignore
                        ctx.arc(this.arr[i].x + 5, this.arr[i].y + 20, 2, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    case "Right":
                        ctx.beginPath();
                        ctx.fillStyle = "white";
                        // prettier-ignore
                        ctx.arc(this.arr[i].x + 20, this.arr[i].y + 5, 2, 0, 2 * Math.PI);
                        ctx.fill();
                        // prettier-ignore
                        ctx.arc(this.arr[i].x + 20, this.arr[i].y + 20, 2, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                }
            } else {
                ctx.fillStyle = "#e6bcbc";
                ctx.fillRect(this.arr[i].x, this.arr[i].y, scale, scale);
            }

            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.strokeRect(this.arr[i].x, this.arr[i].y, scale + 1, scale + 1);
        }
    };
    this.update = () => {
        this.arr.shift();
        this.arr.push({ x: this.x, y: this.y });

        this.x += this.xLength;
        this.y += this.yLength;
    };

    this.eat = (food) => {
        total_eaten++;
        switch (this.findDirection()) {
            case "Up":
                this.arr.unshift({
                    x: this.arr[0].x,
                    y: this.arr[0].y + scale,
                });
                break;
            case "Down":
                this.arr.unshift({
                    x: this.arr[0].x,
                    y: this.arr[0].y - scale,
                });
                break;
            case "Left":
                this.arr.unshift({
                    x: this.arr[0].x + scale,
                    y: this.arr[0].y,
                });
                break;
            case "Right":
                this.arr.unshift({
                    x: this.arr[0].x - scale,
                    y: this.arr[0].y,
                });
                break;
        }

        food.update();
    };

    this.canEat = (food) => {
        if (this.x === food.x && this.y === food.y) return true;
        else return false;
    };

    this.changeDirection = (direction) => {
        switch (direction) {
            case "Up":
                if (this.yLength !== scale) {
                    this.xLength = 0;
                    this.yLength = -scale;
                    cur_direction = direction;
                }
                break;
            case "Down":
                if (this.yLength !== -scale) {
                    this.xLength = 0;
                    this.yLength = scale;
                    cur_direction = direction;
                }
                break;
            case "Left":
                if (this.xLength !== scale) {
                    this.xLength = -scale;
                    this.yLength = 0;
                    cur_direction = direction;
                }
                break;
            case "Right":
                if (this.xLength !== -scale) {
                    this.xLength = scale;
                    this.yLength = 0;
                    cur_direction = direction;
                }
                break;
        }
    };
}

function Food() {
    this.x;
    this.y;
    this.text;

    this.draw = () => {
        if (this.text === undefined) {
            document.getElementById("restart_button").style.visibility =
                "visible";
            document.getElementById("game_message").innerHTML = "You Win!";
            window.clearInterval(intervalID);
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(this.x, this.y, scale, scale);
            ctx.font = "12px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(this.text, this.x + 2, this.y + 16);
        }
    };

    this.update = () => {
        this.text = courses.shift();
        this.x = Math.floor(Math.random() * cols) * scale;
        this.y = Math.floor(Math.random() * rows) * scale;
    };
}

var snake;
var food;

const interval_func = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            ctx.beginPath();
            ctx.fillStyle = ["#e1ffba", "#cdff8c"][(i + j) % 2];
            ctx.fillRect(j * scale, i * scale, scale, scale);
            ctx.closePath();
        }
    }

    snake.update();

    if (snake.canEat(food)) {
        snake.eat(food);
    }

    snake.draw();
    food.draw();
};

function start() {
    // prettier-ignore
    courses = [101, 114, 160,161,214,215,216,220,300,303,306,307,310,311,312,316,320,327,334,337,351,352,354,371,373,376,380,385,416,506,512,526,527,532,540,541,544,545,548,550,555,564,566,600,645]
    initialLength = courses.length;
    total_eaten = 0;
    interval_time = 500;
    cur_direction = "Up";
    document.getElementById("restart_button").style.visibility = "hidden";
    snake = new Snake();
    food = new Food();

    food.update();
    snake.draw();

    intervalID = window.setInterval(interval_func, interval_time - 250);

    window.addEventListener("keyup", (evt) => {
        snake.changeDirection(evt.key.replace("Arrow", ""));
    });
}

start();
