define(function(require, exports, module) {
    var cookieUtil = {
        setCookie: function(name, value, expires) {
            var date = new Date(), cookieStr = '';
            cookieStr = name + "=" + value;
            if (expires) {
                date.setDate(date.getDate() + expires);
                cookieStr += "; expires=" + date.toUTCString();
            }
            cookieStr += "; path=/";
            document.cookie = cookieStr;
        },
        getCookie: function(name) {
            var regStr = "\s*" + name + "=([\w\W]+?);";
            var match = document.cookie.match(new RegExp(regStr, "i"));
            if (match) {
                return unescape(match[1]);
            }
            return "";
        },
        getAllCookies: function() {
            var ret = {}, cookies = document.cookie ? document.cookie.split(/;\s*/) : [], name, value, cookieStr;
            for (var i=0, leni=cookies.length; i<leni; i++) {
                cookieStr = cookies[i];
                name = cookieStr.substring(0, cookieStr.indexOf('='));
                value = cookieStr.substring(cookieStr.indexOf('=') + 1, cookieStr.length);
                ret[name] = value;
            }
            return ret;
        },
        removeCookie: function(name) {
            var date = new Date("1988-09-26 08:00:00");
            // 设置cookie超时时间为过去某个时刻即可移除该cookie
            document.cookie = name + "=whatever; expires=" + date.toUTCString(); 
        }
    }

    return cookieUtil;
});