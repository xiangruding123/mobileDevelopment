!function(Global) {
	var num = 10,
		start  = 1,
		sort = 1,
		order = 2,
		state = "";
	var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;
	var count = 0; //当前商品总数 用来判断是否还要继续加载更多
	curpage = 1;
	var index_num = GetQueryString('index');
	if(index_num=="1"){
		$('.bottomnav li').eq(1).addClass("active").siblings("li").removeClass('active');
		$('#my_index>div').eq(1).removeClass("tableChange").siblings("div").addClass('tableChange');
		moneyFun();
	}else if(index_num=="2"){
		$('.bottomnav li').eq(2).addClass("active").siblings("li").removeClass('active');
		$('#my_index>div').eq(2).removeClass("tableChange").siblings("div").addClass('tableChange');
		loadTeam(0,"#team_all","teamAll");
		bindTeamEvent();
	}
	/*****************微店*********************/
	FL.judgeLogin();
	var shop_id;

	function getMember(){
		FL.ajaxDate('get',get_shop_info,{mid:FL.mid},function(data){
			if(data&&data.error=="0"){
				var res = data.result;
				if(res.shop_logo){
					$(".weidianPhoto").attr("src",res.shop_logo);
				}

				if(res.shop_name){
					$('#shop_name').text(res.shop_name);
				}else{
					$("#shop_name").text(getcookie('member_name'));
				}
				if(res.shop_scope){
					$('#shop_scope').text(res.shop_scope);
				}
				shop_id = res.shop_id;
				//设置微信分享信息
				var wx_title = res.shop_name;
				var wx_desc = '我发现一个很有意思的小店，快来看看吧！';
				var wx_link = WapSiteUrl + "/wap/tmpl/activity/discover_details.html?shop_id="+shop_id;
				var wx_img = res.shop_logo||"http://www.fenhongshop.com/wap/images/wap/logo.png";

				FL.wxShare(wx_title,wx_desc,wx_link,wx_img);
				$(".share").click(function(){

					$('.-mob-share-ui').show();

					FL.share(wx_title,wx_desc,wx_img,wx_link);
				});

			}

		});
	}
	function shareList(type,numb,curpagenum){
		FL.ajaxDate('get',get_shared_goods,{mid:FL.mid,num:numb,curpage:curpagenum},function(data){

			if(data&&data.error=="0"){
				template.helper('clickIcon',function(r,index){
					if(r.indexOf(index)>=0){
						return "click";
					}
				});
				var html = template.render("generalize_goodslist_tmpl",data);
				if(type == 'yes'){
					$("#generalize_list").html(html);
				}else{
					$("#generalize_list").append(html);
				}

				$(".shareBtn").click(function(){
					var me = this;
					$('.-mob-share-ui').show();
					var _title = $(me).attr("goods_name");
					var _desc = $(me).attr("goods_desc");
					var _url = WapSiteUrl + "/wap/tmpl/shopping/goods_details.html?goods_id="+ $(me).attr("goods_id");
					var _pic = $(me).attr("goods_image");
					FL.share(_title,_desc,_pic,_url,"",shop_id,0);
				});

			}
		});


	}
	getMember();
	shareList("yes",10,1);
	$(window).scroll(function() {
		var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
		var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		if (scrollTop + clientHeight +42 >= htmlHeight) {
			var showNum = $("#generalize_list .skip_link").length; //当前页面显示的个数
			page = showNum / num + 1; //上拉加载要显示的页数
			if (count != page && regu.test(page)) {
				shareList("no",num,page);
				count = page;
			} else {

			}
		}
	})

	/*************佣金收入*****************/

	function loadData(){
		getList();
	}
	$('.bottomnav li').bind("click",function(){
		var me  = this;
		var index = $(me).index();
		$(me).addClass("active").siblings("li").removeClass('active');
		$('#my_index>div').eq(index).removeClass("tableChange").siblings("div").addClass('tableChange');
		if(index == 0){
			getMember();
			shareList("yes",10,1);
			$(window).scroll(function() {
				var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
				var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
				var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
				if (scrollTop + clientHeight+42 >= htmlHeight) {
					var showNum = $("#generalize_list .skip_link").length; //当前页面显示的个数
					page = showNum / num + 1; //上拉加载要显示的页数
					if (count != page && regu.test(page)) {
						shareList("no",num,page);
						count = page;
					} else {

					}
				}
			})
		}else if(index == 1){

			moneyFun();

		}else if(index == 2){
			loadTeam(0,"#team_all","teamAll");
			bindTeamEvent();

		}
	});

	function moneyFun(){
		loadData();
		bindMoneyEvent();
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".com-history").length; //当前页面显示的个数
				page = showNum / num + 1; //上拉加载要显示的页数
				if (count != page && regu.test(page)) {
					state=$('.focus-btn').attr('tab');
					getList(num,page,sort,order,state,"no");
					count = page;
				} else {

				}
			}
		})
	}


	//
	function getList(num,start,sort,order,state,status){
		$.ajax({
			type: "post",
			url: WapSiteUrl + "/api/index.php?act=shoper_commission&op=getmoney",
			data: {mid:FL.mid,token: FL.token,flag: "wap",num:num,start:start,sort:sort,order:order,state:state},
			dataType: 'json',
			success: function(data) {
				if(data&&data.result.user_acount){
					$("#acount").text(data.result.user_acount);
					$("#freeze").text(data.result.freeze_deduct.toFixed(4));
					$("#available").text(data.result.available_predeposit);
				}
				if(data&&data.result.deduct_list){
					var html = template.render("commission_list",data.result);
					if(status=="yes"){
						$(".cos-ul2").html(html);
					}else{
						$(".cos-ul2").append(html);
					}
				}else{
					$(".cos-ul2").empty();
				}

				$(".cashBtn").click(function(){
					$("#noinfoDialog").show();
					FL.addShade();
				});
				$('#leftbtn').click(function(){
					$("#noinfoDialog").hide();
					FL.removeShade();
				});
				$('#rightbtn').click(function(){
					$("#noinfoDialog").hide();
					FL.removeShade();
					location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.fanglin.fenhong.microbuyer';
				});

			}
		});
	}
	function bindMoneyEvent(){
		$(".cos-ul1 li").click(function(){
			var me = this;
			var state = $(me).attr("tab");
			$(".cos-ul1 li").removeClass("focus-btn");
			$(me).addClass("focus-btn");
			getList(num,start,sort,order,state,"yes");
		});
	}



	/*****我的团队******/
	function loadTeam(type,id,script_id){
		$.ajax({
			type: "post",
			url: WapSiteUrl + "/api/index.php?act=shoper_commission&op=getteam",
			data: {mid: FL.mid,flag:'wap',token:FL.token,type:type},
			dataType: 'json',
			success: function(data) {
				if(data.error==='0'){
					var html = template.render(script_id,data);
					$(id).html(html);

					$("#all").text(data.result.all);
					$("#b").text(data.result.first_count);
					$("#c").text(data.result.second_count);

					$('#team img').lazyload();
				}
			},
			error:function(xhr){
			}
		});
	}

	//table切换
	function bindTeamEvent(){
		$("#team .nav li").click(function(event) {
			var id = $(this).attr("tabId");
			if(id==0){
				loadTeam(id,"#team_all","teamAll");
			}else if(id==1){
				loadTeam(id,"#team_b","teamB");
			}else if(id==2){
				loadTeam(id,"#team_c","teamC");
			}
			$(this).addClass('selected').siblings('li').removeClass('selected');
			$("#team .tableChange").eq($(this).index()).show().siblings(".tableChange").hide();
		});
	}

}(this);
