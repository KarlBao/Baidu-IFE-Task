// 调制解调模块
var Adapter = function() {
    var encodeCommand = function(cmd) {
        var binaryId = leftPad(parseInt(cmd.id.toString(2)),4);
        if(!binaryId) { log.out('id超出可序列化范围'); return false; }
        switch(cmd.command) {
            case 'start':
                return binaryId + '0001';
            case 'stop':
                return binaryId + '0010';
            case 'destroy':
                return binaryId + '1100';
            default:
                return false;
        }
    }
    var decodeCommand = function(binaryCode) {
        var id = parseInt(binaryCode.substr(0,4),2);
        var command = '';

        switch(binaryCode.substr(4,4)) {
            case '0001':
                command = 'start';
                break;
            case '0010':
                command = 'stop';
                break;
            case '1100':
                command = 'destroy';
                break;
            default:
                break;
        }

        return {
            id: id,
            command: command
        }
    }
    var encodeShipInfo = function(info) {
        var binaryId = leftPad(info.id.toString(2),4);
        var binaryEnergy = leftPad(info.energy.toString(2),8);
        var binaryStatus = '';
        switch(info.status) {
            case 0: 
                binaryStatus = '0010'; //停止
                break;
            case 1:
                binaryStatus = '0001'; //飞行中
                break;
            case 2:
                binaryStatus = '1100'; //即将销毁
                break;
            default:
                break;
        }
        return binaryId+binaryStatus+binaryEnergy;
    }

    var decodeShipInfo = function(binaryCode) {
        var id = parseInt(binaryCode.substr(0,4),2);
        var status = binaryCode.substr(4,4);
        var energy = parseInt(binaryCode.substr(8,8),2);
        var engineType = $('#spaceship'+id).data('engineType');
        var energyType = $('#spaceship'+id).data('energyType');
        switch(status) {
            case '0001':
                status = '飞行中';
                break;
            case '0010':
                status = '已停止';
                break;
            case '1100':
                status = '即将销毁';
                break;
            default:
                status = '未知状态';
                break;
        }

        return {
            id: id+'号',
            engineType: engineType,
            energyType: energyType,
            status: status,
            energy: energy+'%'
        }
    }
    var leftPad = function(num, width) {
        num = num+'';
        return num.length>width ? false : new Array(width-num.length+1).join('0') + num;
    }
    return {
        commandAdapter: {
            encode: encodeCommand,
            decode: decodeCommand
        },
        shipInfoAdapter: {
            encode: encodeShipInfo,
            decode: decodeShipInfo
        }
    }
}