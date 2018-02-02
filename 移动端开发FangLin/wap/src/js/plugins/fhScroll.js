!function(Global){
	
	
	var fhScroll = function(wrapper,pullDownAction,pullUpAction){
		var container = $(wrapper);	
		var minscroller = container.find(".min-scroller");
		var pullDownEl = container.find('.pullDown')[0];
		var pullUpEl = container.find('.pullUp')[0];
		var pullUpOffset, pullDownOffset;
		//var pullDownAction = pullDownAction||function(){};
		//var pullUpAction = pullUpAction||function(){};
		
		if (pullDownEl) {
			pullDownOffset = pullDownEl.offsetHeight;
		} else {
			pullDownOffset = 0;
		}
		
		if (pullUpEl) {
			pullUpOffset = pullUpEl.offsetHeight;
		} else {
			var pullUpOffset = 0;
		}
		
		//debugger;
		var _offset = 1;
		if(pullDownOffset){
			_offset += container.height()+pullDownOffset;
		}else{
			_offset += container.height();
		}
		
		minscroller.css("min-height",_offset);
		
		var scroller = new IScroll(container[0], {
			probeType:1,
			tap:true,
			click:false,
			preventDefaultException:{tagName:/.*/},
			mouseWheel:true,
			scrollY:true,
			scrollX:false,
			preventDefault: false,
			scrollbars:false, 
			fadeScrollbars:true, 
			interactiveScrollbars:false,
			keyBindings:false,
			deceleration:0.0002,
			startY:(parseInt(pullDownOffset)*(-1))
		});
		this.scroller = function(){
			return scroller;
		}
		function pullActionCallback() {
			if (pullDownEl && pullDownEl.className.match('loading')) {
				pullDownEl.className = 'pullDown';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新数据';
				scroller.scrollTo(0, parseInt(pullUpOffset)*(-1), 200);
			} else if (pullUpEl && pullUpEl.className.match('loading')) {
				$(pullUpEl).removeClass('loading').find(".pullUp-container").html('');
			}
		}

		scroller.on('scrollStart', function () {
			scroll_in_progress = true;
		});
		scroller.on('scroll', function () {
			
			scroll_in_progress = true;
			
			if (pullDownAction&&(this.y >= 5 && pullDownEl && !pullDownEl.className.match('flip'))) {
				pullDownEl.className = 'pullDown flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新数据';
				this.minScrollY = 0;
			}else if (pullUpAction&&(this.y <= 5 && pullDownEl && pullDownEl.className.match('flip'))) {
				pullDownEl.className = 'pullDown';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新数据';
				this.minScrollY = -pullDownOffset;
			}
		});
		scroller.on('scrollMove', function () {
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'flip';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开加载...';
                    this.minScrollY = 0;
                } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                    this.minScrollY = -pullDownOffset;
                } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'flip';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开刷新...';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                    this.maxScrollY = pullUpOffset;
                }
        });
		scroller.on('scrollEnd', function () {
			if(-scroller.y>$(window).height()){
				if($("#totop").length!=1){
					$("body").after("<div id='totop'></div>");
	                    $("#totop").on('click', function() {
	                        scroller.scrollTo(0,0,500);
	                });
				}
			}else{
				$("#totop").remove();
			}
			console.log('scroll ended');
			scroll_in_progress = false;
			
			if (pullDownAction&&pullDownEl && pullDownEl.className.match('flip')) {
				pullDownEl.className = 'pullDown loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
				pullDownAction(pullActionCallback);
			}else if (pullUpAction&&(scroller.y <= (scroller.maxScrollY + 200) && pullUpEl &&pullUpEl.style.display!="none")) {
			//	$(pullUpEl).html('<span class="pull-loading"></span><span class="pull-text">加载中……</span>');
				pullUpAction();
				
			}else{
				setTimeout(function(){
					if(Math.abs(scroller.y)< pullUpOffset){
						if(pullDownEl&&pullDownEl.className.indexOf('loading') ==-1){
							scroller.scrollTo(0, parseInt(pullUpOffset)*(-1), 200);
						}
					}
				},200);
			}
		});
		
		return scroller;
	}
	
	Global.MyPlugin = Global.MyPlugin||{};
	
	MyPlugin.fhScroll = fhScroll;

}(this)