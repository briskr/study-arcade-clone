/**
 * @description 作为 Enemy 和 Player 共同的基类
 * @constructor
 */
var Entity = function () {
    this.sprite = null;
    this.x = 0;
    this.y = 0;
    // 定义用于检测碰撞的实体框位置和大小(根据实际图形内容试验得到的值)
    this.boxOffsetX = 0;
    this.boxOffsetY = 82;
    this.boxWidth = cellWidth;
    this.boxHeight = cellHeight - 26;
};

/**
 * @description 在canvas上绘制自身的图像
 */
Entity.prototype.render = function () {
    if (this.sprite) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    // trying to determine box position
   /* ctx.strokeRect(this.x + this.boxOffsetX, this.y + this.boxOffsetY,
        this.boxWidth, this.boxHeight); */
};

/**
 * @description 计算用于检测碰撞的矩形框(以相对于canvas的坐标值表示)
 * @return 含left,right,top,bottom属性的对象，表示this Entity占用的空间
 */
Entity.prototype.collideBox = function () {
    var left = this.x + this.boxOffsetX;
    var right = left + this.boxWidth;
    var top = this.y + this.boxOffsetY;
    var bottom = top + this.boxHeight;
    return {
        "left": left,
        "right": right,
        "top": top,
        "bottom": bottom
    };
}

/**
 * @description judges whether 'target' collides with 'this'
 * @param {Entity} target - the Entity to be checked against 'this'.
 */
Entity.prototype.collideWith = function (target) {
    if (!(target instanceof Entity)) return false;

    // 按实体框的位置判断是否碰撞
    if ((target.collideBox().left < this.collideBox().right && target.collideBox().right > this.collideBox().left) &&
        (target.collideBox().top < this.collideBox().bottom && target.collideBox().bottom > this.collideBox().top)) {
        console.log("collision: p.left=%f,p.right=%f; e.left=%f,e.right=%f",
            this.collideBox().left, this.collideBox().right, target.collideBox().left, target.collideBox().right);
        console.log("collision: p.top=%f,p.bottom=%f; e.top=%f,e.bottom=%f",
            this.collideBox().left, this.collideBox().right, target.collideBox().top, target.collideBox().bottom);
        return true;
    }
    return false;
}

/**
 * @description 这是我们的玩家要躲避的敌人, 继承Entity类
 * @param {number} row - enemy moving lane, 0 ~ 3
 * @param {*} speed - enemy moving speed
 */
var Enemy = function (row, speed) {
    Entity.call(this);
    // 要应用到每个敌人的实例的变量
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.row = row ? row : 0;
    this.speed = speed ? speed : 1;

    var OFFSET_Y = 55; // 第0行Enemy绘图时的y座标
    this.y = OFFSET_Y + cellHeight * this.row;
    this.x = -cellWidth; // 让Enemy从边缘进入

    this.boxHeight = cellHeight - 16;
};

// Enemy extends Entity
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * @description 根据时隙数量和逻辑位置更新敌人的绘制座标
// @param {number} dt - 表示上次重绘至当前经过的时间间隙数
 */
Enemy.prototype.update = function (dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    var SPEED_BASE = 20;
    var newX = this.x + this.speed * SPEED_BASE * dt;
    if (newX > ctx.canvas.width) {
        // 已移出canvas，从集合中删除
        allEnemies.splice(allEnemies.indexOf(this), 1);
    }
    this.x = newX;
};

/**
 * @description 玩家类, 继承 Entity
 * @constructor
 */
var Player = function () {
    Entity.call(this);
    this.sprite = 'images/char-boy.png';
    this.reset();
    this.boxOffsetX = 16;
    this.boxOffsetY = 83;
    this.boxWidth = cellWidth - 31;
    this.boxHeight = cellHeight - 22;
};

// Player extends Entity
Player.prototype = Object.create(Entity.prototype);
Player.constructor = Player;

/**
 * @description set initial position of player.
 */
Player.prototype.reset = function () {
    this.r = 5;
    this.c = 2;
}

/**
 * @description calc current coords
 */
Player.prototype.update = function () {
    var yOffset = -25;
    this.x = this.c * cellWidth;
    this.y = yOffset + this.r * cellHeight;
};

/**
 * @description calc new row / column value after key input
 */
Player.prototype.handleInput = function (key) {
    var maxCol = 4,
        maxRow = 5;
    switch (key) {
        case 'left':
            if (this.c > 0)
                this.c--;
            break;
        case 'right':
            if (this.c < maxCol)
                this.c++;
            break;
        case 'up':
            if (this.r > 1) // avoid water (row 0)
                this.r--;
            break;
        case 'down':
            if (this.r < maxRow)
                this.r++;
            break;
    }
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies = [];

var player = new Player();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});