
// 飞船数据处理中心
var DigitalCenter = function($panel) {
    
    var adapter = new Adapter();
    var spaceshipStatus = {};  // 飞船状态监控存储

    var update = function(info) {
        spaceshipStatus[info.id] = info;
        if(info.status == '即将销毁') {
            delete spaceshipStatus[info.id];
        }
        render();
    }

    var render = function() {
        $panel.empty();
        $panel.append('\
        <table>\
            <thead><tr>\
                <th>飞船</th>\
                <th>动力系统</th>\
                <th>能源系统</th>\
                <th>当前飞行状态</th>\
                <th>剩余能耗</th>\
            </tr></thead>\
            <tbody></tbody>\
        </table>\
        ');
        for(var spaceship in spaceshipStatus) {
            var $row = $('<tr></tr>');
            for(var property in spaceshipStatus[spaceship]) {
                $row.append('<td>'+spaceshipStatus[spaceship][property]+'</td>');
            }
            $row.appendTo('tbody',$panel);
        }
    }

    /**
     * 用以监听飞船向行星发送的信号
     * @param {info} 存储飞船信息的对象
     **/
    var receiveSignal = function(info) {
        if(info.length != 16) { return false; } // 只接受16位二进制序列
        update(adapter.shipInfoAdapter.decode(info));
    }

    return {
        receiveSignal: receiveSignal
    }
}
