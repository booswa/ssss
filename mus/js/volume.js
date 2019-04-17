(function () {
    //调节音量
    let vol = $('audio')[0].volume;
    $('audio')[0].volume=0.5;
    window.onload = function() {
        var lineDiv = document.getElementById('lineDiv'); //长线条
        var minDiv = document.getElementById('minDiv'); //小方块
        var vals = document.getElementById("vals");
        var ifBool = false; //判断鼠标是否按下
        //事件
        var start = function(e) {
            e.stopPropagation();
            ifBool = true;
            console.log("鼠标按下")
        }
        var move = function(e) {
            e.stopPropagation();
            console.log("鼠标拖动")
            if(ifBool) {
                if(!e.touches) {    //兼容移动端
                    var y = e.clientY;
                } else {     //兼容PC端
                    var y = e.touches[0].pageY;
                }
                //var x = e.touches[0].pageX || e.clientX; //鼠标横坐标var x
                var lineDiv_left = getPosition(lineDiv).top; //长线条的横坐标
                var minDiv_left = y - lineDiv_left; //小方块相对于父元素（长线条）的left值
                if(minDiv_left >= lineDiv.offsetHeight - 15) {
                    minDiv_left = lineDiv.offsetHeight - 15;
                }
                if(minDiv_left < 0) {
                    minDiv_left = 0;
                }
                //设置拖动后小方块的left值
                minDiv.style.top = minDiv_left + "px";
                // vals.innerText =Math.abs( parseInt((minDiv_left / (lineDiv.offsetHeight - 15)) * 100)-100);
                $('audio')[0].volume = Math.abs( parseInt((minDiv_left / (lineDiv.offsetHeight - 15)) * 100)-100)/100;
            }

        }
        var end = function(e) {
            console.log("鼠标弹起")
            ifBool = false;
        }
        //鼠标按下方块
        minDiv.addEventListener("touchstart", start);
        minDiv.addEventListener("mousedown", start);
        //拖动
        window.addEventListener("touchmove", move);
        window.addEventListener("mousemove", move);
        //鼠标松开
        window.addEventListener("touchend", end);
        window.addEventListener("mouseup", end);
        //获取元素的绝对位置
        function getPosition(node) {
            var left = node.offsetLeft; //获取元素相对于其父元素的left值var left

            var top = node.offsetTop;
            current = node.offsetParent; // 取得元素的offsetParent
            // 一直循环直到根元素

            while(current != null) {
                left += current.offsetLeft;

                top += current.offsetTop;
                current = current.offsetParent;
            }

            return {
                "left": left,
                "top": top
            };
        }

        //背景js代码----------------
        var oCanvas = document.getElementById('canvasParticle');
        var cxt = null;
//用来存放粒子的素组
        var particles = {};
        var particleIndex = 0;

        if (oCanvas.getContext) {
            cxt = oCanvas.getContext('2d');
        }

        oCanvas.width = window.innerWidth;
        oCanvas.height = window.innerHeight;

        function Particle() {
            particleIndex++;

            particles[particleIndex] = this;

//粒子放射的中心点
            this.x = oCanvas.width / 2;
            this.y = oCanvas.height / 2;
//初始化粒子沿X轴和Y轴的速度
            this.vx = Math.random() * 6 - 3;
            this.vy = Math.random() * 4 - 2;


            this.growth = (Math.abs(this.vx) + Math.abs(this.vy)) * 0.01; // 根据x/y轴的位置决定大小
            this.id = particleIndex;
            this.size = 0;
            this.color = getRandomColor();
        };

        Particle.prototype.draw = function() {
            this.x += this.vx;
            this.y += this.vy;
//根据移动的距离逐渐变大
            this.size += this.growth;

            if (this.x < 0 || this.x > oCanvas.width || this.y < 0 || this.y > oCanvas.height) {
//出界则移除
                delete particles[this.id];
            }

            cxt.fillStyle = this.color;
            cxt.beginPath();
            cxt.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            cxt.fill();
        };

        function animate() {
            requestAnimationFrame(animate);

            cxt.fillStyle = '#222222';
            cxt.fillRect(0, 0, oCanvas.width, oCanvas.height);
//每次网数组添加一个数据
            new Particle();

            for (var i in particles) {
                particles[i].draw();
            }
        };
        requestAnimationFrame(animate);
    }
    function getRandomColor() {
        return '#' + (Math.random() * 0xffffff << 0).toString(16);

    }
    //背景js代码----------------
})();