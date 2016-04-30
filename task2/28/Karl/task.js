//轨道半径
var orbits = [200,300];

var space;
var mediator;
var controlPanel;
var log;
var dc;


var Space = function() {
    var init = function() {
        //渲染轨道
        for(var index in orbits) {
            var radius = orbits[index];
            var orbit = $('<div class="orbit"></div>');
            orbit.css({
                width: 2*radius,
                height: 2*radius
            });
            orbit.appendTo('#space');
        }
    }
    init();
}



// 控制台
var ControlPanel = function() {
    var totalShips = 0; //控制台所知的现有飞船总数（与实际未必相符）
    var maxShips = 4;   //最大飞船数量
    var id = 0; //飞船id计数器，自动递增

    // 安装调制解调模块
    var adapter = new Adapter();

    // 发射新飞船
    var launchShip = function() {

        if(totalShips == maxShips) { log.out('飞船数量达到上限'); return false; }
        
        // 设置飞船配置
        var engineLevel = $('input[name=engine]:checked','.engine-form').val();
        var energyLevel = $('input[name=energy]:checked','.energy-form').val();
        var settings = {
            id: ++id,   //飞船id
            consumption : spaceshipSetting.engine[engineLevel].consumption,
            chargeSpeed : spaceshipSetting.energy[energyLevel].chargeSpeed,
            speed: spaceshipSetting.engine[engineLevel].speed
        }
        var spaceship = new SpaceShip(settings);
        spaceshipArr.push(spaceship);
        createShipPanel(id);

        // 将飞船对象与实体绑定
        mediator.addListener(spaceship);
        $('#spaceship'+spaceship.id).data('fn', spaceship);
        // 记录飞船信息
        $('#spaceship'+spaceship.id).data('engineType', spaceshipSetting.engine[engineLevel].type);
        $('#spaceship'+spaceship.id).data('energyType', spaceshipSetting.energy[energyLevel].type);

        totalShips++;
    }

    /**
     * 创建对应的飞船控制面板
     * @param {spaceship} 面板对应的飞船id
     **/
    var createShipPanel = function(id) {
        var $shipPanel = $('<div class="ship-panel"><label>'+id+'号飞船</label><button class="start-btn">飞行</button><button class="stop-btn">停止</button><button class="destroy-btn">销毁</button></div>');
        $shipPanel.appendTo('#ship-panel-container');
        shipHandler($shipPanel, id);
    }

    /**
     * 控制台与飞船进行绑定
     * @param {$panel} 需要绑定的控制面板
     * @param {$spaceship} 需要绑定的飞船对象
     **/
    var shipHandler = function($panel,id) {
        
        // 将对飞船的指令进行序列化后广播
        var encodeAndSend = function(cmd) {  
            mediator.broadcast(adapter.commandAdapter.encode(cmd),true);
        }

        $('.start-btn',$panel).on('click',function(){
            var cmd = {
                id: id,
                command: 'start'
            }
            encodeAndSend(cmd);
        });
        $('.stop-btn',$panel).on('click',function(){
            var cmd = {
                id: id,
                command: 'stop'
            }
            encodeAndSend(cmd);
        });
        $('.destroy-btn',$panel).on('click',function(){
            var cmd = {
                id: id,
                command: 'destroy'
            }
            encodeAndSend(cmd);
            $panel.remove();
            totalShips--;
        });

    }

    var init = function() {
        $('#launch-btn').on('click', function(event) {
            launchShip();
        });
    }

    init();

    // 公共方法
    return {
        launchShip: launchShip
    }
}

// 操作日志
var Log = function($panel) {

    var $logPanel = $panel;
    var out = function(str,type) {
        type = type || '';
        $logPanel.append('<div class="log '+type+'">'+str+'</div>');
    };

    return {
        out: out
    }
}


$(document).ready(function(){

    // 创建宇宙
    space = new Space();

    // 创建信号传输介质
    mediator = new BUS();

    // 创建飞船控制台
    controlPanel = new ControlPanel();

    // 创建宇航日志
    log = new Log($('#log-panel'));

    // 创建飞船状态监视系统
    dc = new DigitalCenter($('#monitor'));
    // 添加到广播监听列表
    mediator.addListener(dc);
})