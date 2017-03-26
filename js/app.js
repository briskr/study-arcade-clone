// 作为 Enemy 和 Player 共同的基类
var Entity = function() {
    this.sprite = null;
    this.x = 0;
    this.y = 0;
};

// 用来在
Entity.prototype.render = function() {
    if (this.sprite)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 这是我们的玩家要躲避的敌人
var Enemy = function(row, speed) {
    Entity.call(this);
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    if (row === undefined)
        row = 0;
    if (speed === undefined)
        speed = 1;

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.row = row;
    this.speed = speed;
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    var speedBase = 20;
    var rowOffset = 60;
    this.y = rowOffset + cellHeight * this.row;
    if (this.x === undefined)
        this.x = 0;
    var newX = this.x + this.speed * speedBase * dt;
    if (newX > ctx.canvas.width)
        newX = 0;
    this.x = newX;
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function () {
    Entity.call(this);
    this.sprite = 'images/char-boy.png';
    this.r = 5;
    this.c = 2;
};

Player.prototype = Object.create(Entity.prototype);
Player.constructor = Player;

Player.prototype.update = function() {
    var yOffset = -20;
    this.x = this.c * cellWidth;
    this.y = yOffset + this.r * cellHeight;
};

Player.prototype.handleInput = function(key) {
    var maxCol = 4,
        maxRow = 5;
    switch(key)
    {
        case "left":
            if (this.c > 0)
                this.c--;
            break;
        case "right":
            if (this.c < maxCol)
                this.c++;
            break;
        case "up":
            if (this.r > 1) // avoid water (row 0)
                this.r--;
            break;
        case "down":
            if (this.r < maxRow)
                this.r++;
            break;
    }
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies = [];
allEnemies.push(new Enemy(0, 1));
allEnemies.push(new Enemy(1, 1));
allEnemies.push(new Enemy(2, 1));

var player = new Player();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});