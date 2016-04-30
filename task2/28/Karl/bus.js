var BUS = function() {

    var errorRate = 0.1;    // 丢包率
    var speed = 300;        // 传输速度
    var listeners = [];     // 广播监听者

    // 模拟发送信息，返回是否发送成功
    var sendPackage = function() {
        var randomValue = Math.random();
        if(randomValue<errorRate) { return false; }
        else { return true; }
    }

    /**
     * 广播指令,会一直尝试重新发送直到接收到停止重发的反馈
     * @param {cmd} 要广播的信息
     * @param {output} 是否输出日志
     **/
    var broadcast = function(cmd, output) {
        if(output) { log.out('正在发送广播...'); }
        var timer = setInterval(function(){
            if(!sendPackage()) {
                if(output) { log.out('发送失败，尝试重新发送...'); } 
                return false; 
            }
            clearInterval(timer);
            for(var i=0; i<listeners.length; i++) {
                listeners[i].receiveSignal(cmd);
            }
        },speed);
    }

    // 增加广播监听者
    var addListener = function(listener) {
        listeners.push(listener);
    }

    // 删除广播监听者
    var removeListener = function(listener) {
        var index = listeners.indexOf(listener);
        if(index>-1) {
            listeners.splice(index,1);
        }
    }

     return {
        addListener: addListener,
        removeListener: removeListener,
        broadcast: broadcast
    }
}