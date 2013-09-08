$(function() {
    var NUM_FLOORS = 10, MIN_HEIGHT_FLOOR = 100, FLOOR_GAP_HEIGHT = 20, 
        FLOOR_WIDTH = 800, BANNER_WIDTH = 1000, BANNER_HEIGHT = 80, FLOOR_BORDER_WIDTH = 1;

    var $body = $('body'), floorIDArr =[], floorHeightArr = [], floorScrollTopArr = [100];
    // 初始化banner区域
    function initBanner() {
        var $banner = $('<div/>', {
            id: 'banner'
        });
        $banner.html($('<p>', {
            text: 'banner goes here'
        }))
        $body.append($banner);
    }

    // 初始化楼层区块
    function initFloors() {
        var $floorWrapper = $('<div>', {
            id: 'floorWrapper'
        }), $floor, height, floorID;
        $('body').append($floorWrapper);
        for (var i=0, leni=NUM_FLOORS; i<leni; i++) {
            floorID = 'floor' + i;
            height = Math.round(Math.random() * 200) + MIN_HEIGHT_FLOOR;
            floorIDArr[i] = floorID;
            // 记录每个楼层的高度
            floorHeightArr[i] = height;
            // 记录每个楼层距离文档顶部的距离
            if (!floorScrollTopArr[i]) {
                floorScrollTopArr[i] = floorScrollTopArr[i-1] + floorHeightArr[i-1] 
                    + 2 * FLOOR_BORDER_WIDTH + FLOOR_GAP_HEIGHT;
            }
            
            $floor = $('<div>', {
                id: floorID,
                'class': 'floor',
                height: height
            });
            $floor.append($('<p>', {
                text: 'floor #' + floorID
            }));
            $floorWrapper.append($floor);
        }
    }

    // 初始化各楼层的快捷通道
    function initFloorShortcut() {
        var $floorShortcut = $('<div>', {
            id: 'floorShortcut'
        });
        var $floorUl = $('<ul>'), $floorLi;
        
        for (var i=0, leni=NUM_FLOORS; i<leni; i++) {
            $floorLi = $('<li>');
            $floorLi.append($('<a>', {
                text: floorIDArr[i],
                href: '#' + floorIDArr[i],
                "floor-num": i
            }));
            $floorUl.append($floorLi);
        }
        $floorShortcut.append($floorUl);
        $body.append($floorShortcut);
    }

    // 绑定事件，如scroll事件
    function bindEvents() {
        // scroll事件
        $(window).scroll(function() {
            var floorSeq = calFloorNum($(window).scrollTop());
            $('#floorShortcut ul li').removeClass('current');
            $('#floorShortcut ul li').eq(floorSeq).addClass('current');
        });

        // 楼层快捷通道点击事件
        $('#floorShortcut').on('click', 'a', function(ev) {
            ev.preventDefault();
            $(this).parent().siblings('li').removeClass('current');
            $(this).parent().addClass('current');
            $(window).scrollTop(floorScrollTopArr[$(this).attr('floor-num')]);
        });

        // 默认触发一次
        $(window).scroll();
    }

    // 返回目前所在的楼层数
    function calFloorNum(scrollTop) {
        var ret = 0;
        if (scrollTop < floorScrollTopArr[0]) {
            ret = 0;
        }
        if (scrollTop > floorScrollTopArr[NUM_FLOORS-1]) {
            ret = NUM_FLOORS - 1;
        }
        for (var i=0, leni=NUM_FLOORS; i<leni; i++) {

            if (scrollTop >= floorScrollTopArr[i] && scrollTop < floorScrollTopArr[i+1]) {
                // scrollTop超过当前所在楼层的一半高度，则认为进入下一楼层
                if (scrollTop > (floorScrollTopArr[i] + floorScrollTopArr[i+1]) / 2 && scrollTop <= floorScrollTopArr[i+1]) {
                    ret = i + 1;
                } else {
                    ret = i;
                }
                break;
            }
        }
        return ret;
    }

    (function init() {
        // 初始化banner区域
        initBanner();
        // 初始化楼层区块
        initFloors();
        // 初始化各楼层的快捷通道
        initFloorShortcut();
        // 绑定事件，如scroll事件
        bindEvents();
    })();
});