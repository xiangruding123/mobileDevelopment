! function(Global) {


    var num = 10,
        start = 1,
        sort = 1,
        order = 2,
        state = "",
        source = 'null';
    var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;
    var count = 0; //当前商品总数 用来判断是否还要继续加载更多
    var curpage = 1;

    var shop_id = getcookie('shop_id');
    //share
    var _title = "我是红人店主，邀您共现创富梦",
        _desc = "【赚钱】独创运营模式，全方位指导，专业团队，引领世界共创富，分红全球购打造亿万大众创富梦想的平台，财富等您加入！！！",
        _pic = "http://www.fenhongshop.com/wap/images/wap/logo.png",
        _url = WapSiteUrl + '/wap/tmpl/mircoshop/shop.html?shop_id=' + shop_id;


    FL.wxShare(_title, _desc, _url, _pic, _desc);

    function loadTeam(status, type, id, script_id, num, curpage) {
        $.ajax({
            type: "post",
            url: WapSiteUrl + "/api/index.php?act=shoper_commission&op=getteam",
            data: {
                mid: FL.mid,
                flag: 'wap',
                token: FL.token,
                type: type,
                num: num,
                start: curpage
            },
            dataType: 'json',
            success: function(data) {
                if (data.error === '0') {
                    var html = template.render(script_id, data);
                    if (status == 'yes') {
                        $(id).html(html);
                    } else {
                        $(id).append(html);
                    }

                    var res = data.result;

                    $('.teamtitle .number').text(res.all + "人");
                    $('.teamtitle .verify').text("已认证:" + res.verify_count + "人");
                    $('.teamtitle .focus-font').text(res.first_money + res.second_money);
                }
            },
            error: function(xhr) {}
        });
    }


    $(window).scroll(function() {
        var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop + clientHeight >= htmlHeight) {
            var showNum = $(".fill").length - 1; //当前页面显示的个数
            page = showNum / num + 1; //上拉加载要显示的页数
            if (count != page && regu.test(page)) {

                loadTeam('no', '0', "#team_all", "teamAll", 10, page);
                count = page;
            } else {
                //  layer.msg("已经没有商品了");
            }
        }
    })

    var Team = function() {
        this.onLoad = function() {
            setTimeout(function() {
                loadTeam('yes', 0, "#team_all", "teamAll");
            }, 500);

        }
    }
    Global.Member = Global.Member || {};
    Member.Team = new Team();

}(this);
