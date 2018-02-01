$(function() {
	//获取页面奖品的文字描述及图片
	firstajax();

	function firstajax() {
		$.ajax({
			type: "get",
			url: "ind.json",
			data: {
				flag: "wap"
			},
			dataType: "json",
			success: function(data) {
				for(var i = 0; i < data.result.length; i++) {
					$(".textposi").children('.textdesc').eq(i).html(data.result[i].prize_name);
					$(".textposi").children('.textimg').eq(i).attr("src", data.result[i].prize_pic);
				}
			}
		});
	}
	//====================================
	var $btn = $('.playbtn1');
	var $btn2 = $('.playbtn2');
	
	$btn2.click(function(){
		$btn.trigger("click");　　
	});
	
	var isture = 0;
	$btn.click(function() {
		if(isture) return; // 如果在执行就退出
		isture = true; // 标志为 在执行
		if(true) {
			$.ajax({
				type: "get",
				url: "ind.json",
				data: {
					flag: "wap"
				},
				dataType: "json",
				success: function(data) {
					//console.log(data.prize_chance);
					var prize_chance = data.prize_chance;
					var txt = data.result[prize_chance - 1].prize_name;
					var imgsrc = data.result[prize_chance - 1].prize_pic
					var data1 = prize_chance;
					switch(data1) {
						case "1":
							rotateFunc(1, 0, txt, imgsrc);
							break;
						case "2":
							rotateFunc(2, 60, txt, imgsrc);
							break;
						case "3":
							rotateFunc(3, 120, txt, imgsrc);
							break;
						case "4":
							rotateFunc(4, 180, txt, imgsrc);
							break;
						case "5":
							rotateFunc(5, 240, txt, imgsrc);
							break;
						case "6":
							rotateFunc(6, 300, txt, imgsrc);
							break;
					}
				}
			});
		}
	});
	//=====================================================
	var rotateFunc = function(awards, angle, text, imgsrc) {
		isture = true;
		$btn.stopRotate();
		$btn.rotate({
			angle: 0,
			duration: 5000, //旋转时间
			animateTo: angle + 1440, //让它根据得出来的结果加上1440度旋转
			callback: function() {
				isture = false;
				addShade();
				$('.tips').show();
				$(".prize img").attr("src", imgsrc);
				$('.btn_desc').html(text);
				removediv();
			}
		});
	};
	//=============================================
	function addShade() {
		var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
		$("body").append('<div class="loading-shade"></div>');
		$(".loading-shade").css("100%");
	}
	sharezhe();

	function sharezhe() {
		$('#share').unbind("click").bind("click", function() {
			addShade();
			$('.btn_share').show();
			del();
		});
	}

	function del() {
		$(".loading-shade").unbind("click").bind("click", function() {
			$('.loading-shade').remove();
			$('.btn_share').hide();
		});
	}
	//-----------
	function removediv() {
		$('.btn_close').unbind("click").bind('click', function() {
			$('.loading-shade').remove();
			$('.tips').hide();
		});
	}
	//==============
	//更多规则弹出层
	$('.conrulesmore').unbind("click").bind('click', function() {
		addShade();
		$('.morerulestips').show();
		del2()
	});

	function del2() {
		$('.btn_close').bind('click', function() {
			$('.loading-shade').remove();
			$('.morerulestips').hide();
		});
	}
});