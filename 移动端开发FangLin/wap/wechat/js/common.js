
var WapSiteUrl = "http://www.fenhongshop.com";
//var WapSiteUrl = "http://t.fenhongshop.com";

function GetQueryString(name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

    var r = window.location.search.substr(1).match(reg);

    if (r != null)

        return decodeURI(r[2]);

    return null;

}

//格式化时间方法
	function dateFormat(date){  
          
        date = new Date(date*1000);  
        var map = {  
            "M": date.getMonth() + 1, //月份   
            "d": date.getDate(), //日   
            "h": date.getHours(), //小时   
            "m": date.getMinutes(), //分   
            "s": date.getSeconds(), //秒   
            "q": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds() //毫秒   
        };  
          
        format = "yyyy年MM月dd日  hh:mm".replace(/([yMdhmsqS])+/g, function(all, t){  
            var v = map[t];  
            if (v !== undefined) {  
                if (all.length > 1) {  
                    v = '0' + v;  
                    v = v.substr(v.length - 2);  
                }  
                return v;  
            }  
            else if (t === 'y') {  
                    return (date.getFullYear() + '').substr(4 - all.length);  
                }  
            return all;  
        });  
        return format;  
    } 