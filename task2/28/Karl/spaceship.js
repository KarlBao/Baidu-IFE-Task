// 太空中所有现有飞船
var spaceshipArr = [];

// 可选的飞船配置
var spaceshipSetting = {
    engine: {
        level_1: {
            speed: 30,
            consumption: 5,
            type: '前进号'
        },
        level_2: {
            speed: 50,
            consumption: 7,
            type: '奔腾号'
        },
        level_3: {
            speed: 80,
            consumption: 9,
            type: '超越号'
        }
    },
    energy: {
        level_1: {
            chargeSpeed: 2,
            type: '劲量型'
        },
        level_2: {
            chargeSpeed: 3,
            type: '光能型'
        },
        level_3: {
            chargeSpeed: 5,
            type: '永久型'
        }
    }
}

// 飞船类
var SpaceShip = function(options) {

    var $spaceship;

    var defaults = {
        id : 0,
        consumption : 5,    //飞船单位时间(s)能耗
        chargeSpeed : 2,    //飞船能源系统充电速率
        speed: 20           //飞船线速度
    };

    var settings = $.extend({}, defaults, options);
    var orbitIndex = Math.floor(Math.random()*orbits.length);       //所属轨道
    var fps = 60; //动画播放帧率
    var energy = 100;   //总能量
    var status = 0; //飞船状态，0为停止，1为飞行中，2为即将销毁
    var radius = orbits[orbitIndex];    //轨道半径
    var angularSpeed = 360*settings.speed/(2*radius*Math.PI);    //飞船角速度
    var curAngular = 360*Math.random(); //飞船当前角度, 初始为随机角度
    var period = 1000/fps;  //动画播放周期
    var maxEnergy = 100;
    var delay = 1000;   //飞船状态发送间隔

    // 安装调制解调模块
    var adapter = new Adapter();

    // 飞船动力系统
    var engine = {

        // 初始化动力系统
        init: function() {
            
        },
        // 启动
        start: function() {
            status = 1;
            log.out(settings.id+'号飞船启动');
        },
        // 停止
        stop: function() {
            status = 0;
            log.out(settings.id+'号飞船已停止');
        },
        // 消耗能源
        consumeEnergy: function() {
            if(energy>0) { energy-=settings.consumption/fps; }
            else { engine.stop(); }
        }
    };

    // 飞船能源系统
    var energySystem = {
        chargeEnergy: function() {
            if(energy<maxEnergy) { energy+=settings.chargeSpeed/fps; }
        }
    }
    // 创建飞船
    var init = function() {
        $spaceship = $('<div id="spaceship'+settings.id+'" class="spaceship"></div>');
        render();
        $spaceship.css({ 
            transform: 'translateY(-'+radius+'px) rotate(0)',
            transformOrigin: 'center '+(20+radius)+'px'
        });
        engine.init();
        log.out(settings.id+'号飞船已发送至'+(orbitIndex+1)+'号轨道');

        // 广播飞船状态
        setInterval(sendInfo,delay);
    }

    // 销毁飞船
    var destroy = function() {
        var index = spaceshipArr.indexOf($spaceship.data('fn'));
        log.out(settings.id+'号飞船即将销毁');
        status = 2;
        if(index>-1) {
            // 接收到销毁信号后延迟销毁，以便飞船广播即将销毁的信号
            setTimeout(function(){
                spaceshipArr.splice(index,1);
                mediator.removeListener($spaceship.data('fn')); // 从监听列表中移除
                $spaceship.remove();
                clearInterval(frameAnimation);
                log.out(settings.id+'号飞船已销毁');
            },delay); 
        } 
    }

    //绘制飞船
    var render = function() {
        $spaceship.append('<div class="energy-progress"></div>');
        $spaceship.append('<div class="energy-text"><label>'+settings.id+'号 - </label><span class="energy">'+energy+'</span><span>%</span></div>');
        $spaceship.appendTo('#space');
    }

    // 逐帧渲染飞船动作
    var frameAnimation = setInterval(function(){
        // 任何状态下
        energySystem.chargeEnergy();
        // 飞行状态
        if(status!=0) {
            // 飞船轨迹变化
            curAngular+=angularSpeed/fps;
            // 飞船能源变化
            engine.consumeEnergy();
        }
        // 渲染
        $spaceship.css({
            transform: 'translateY(-'+radius+'px) rotate('+curAngular%360+'deg)'
        });
        $('.energy',$spaceship).text(parseInt(energy));
        $('.energy-progress',$spaceship).css('width',energy);

    },period);

    // 获取飞船的jquery对象
    var getObj = function() {
        return $spaceship;
    }

    // 信号接收
    var receiveSignal = function(cmd) {
        if(cmd.length!=8) { return false; } // 只接收8位二进制序列
        cmd = adapter.commandAdapter.decode(cmd);
        if(cmd.id==settings.id && methods[cmd.command]) {
            methods[cmd.command]();
        }
    }

    // 定时广播飞船状态
    var sendInfo = function() {
        var info = {
            id: settings.id,
            energy: parseInt(energy),
            status: status
        }
        console.log(info.status);
        var binaryInfo = adapter.shipInfoAdapter.encode(info);
        mediator.broadcast(binaryInfo,false);
    }
    // 供command调用的方法
    var methods = {
        create: init,
        start: engine.start,
        stop: engine.stop,
        destroy: destroy
    }

    init();

    // 返回公共接口
    return {
        id: settings.id,   //飞船id
        getObj: getObj,  //飞船的jquery对象
        receiveSignal: receiveSignal    //飞船接收指令
    }
}
