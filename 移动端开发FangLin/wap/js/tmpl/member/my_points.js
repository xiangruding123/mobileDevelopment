!function(e){function t(e,t){$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_account&op=points",data:{flag:"wap",mid:FL.mid,start:e,num:t},dataType:"json",success:function(e){if($("#allPoints").text(e.result.allpoints),e&&"0"===e.error){var t=template.render("myPoints",e.result);$("#my_points").append(t)}},error:function(e){}})}var n=10,o=1,i=/^[-]{0,1}[0-9]{1,}$/,a=0;$(window).scroll(function(){var e=document.body.scrollHeight||document.documentElement.scrollHeight,o=document.body.clientHeight||document.documentElement.clientHeight,c=document.body.scrollTop||document.documentElement.scrollTop;if(c+o==e){var l=$(".pt-li").length;page=l/n+1,a!=page&&i.test(page)?(t(page,n),a=page):layer.msg("没有更多了")}});var c=function(){this.onLoad=function(){FL.judgeLogin(),t(o,n)}};e.Member=e.Member||{},Member.myPoints=new c}(this);