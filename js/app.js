// 这是我们的玩家要躲避的敌人 
var Enemy = function(row, speed) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    if (row === undefined)
        row = 0;
    if (speed === undefined)
        speed = 1;

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    var rowOffset = 60;
    this.y = rowOffset + cellHeight * row;
    this.x = 0;
    this.speed = speed;
    console.log("new Enemy.y:" + this.y);
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    var speedBase = 20;
    var newX = this.x + this.speed * speedBase * dt;
    if (newX > ctx.canvas.width)
        newX = 0;
    this.x = newX;
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
    this.sprite = 'images/char-boy.png';

}

Player.prototype.update = function() {

}

Player.prototype.render = function() {

}

Player.prototype.handleInput = function(key) {
    switch(key)
    {
        case "left":
            break;
        case "right":
            break;
        case "up":
            break;
        case "down":
            break;
    }
}

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