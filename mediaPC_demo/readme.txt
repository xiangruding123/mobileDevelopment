
关于媒体查询实现自适应网页布局的一个案例demo
作为pc网页媒体查询的参考案例，实现网页的自适应布局/响应式布局/流式布局 

简单描述：
//------------------------------------
.gridmenu {
	width: 23%;
}
.gridmain {
	width: 48%;
}
.gridright {
	width: 23%;
	margin-right: 0;
}
.gridfooter {
	width: 100%;
	margin-bottom: 0;
}
@media only screen and (max-width: 500px) {
	.gridmenu {
		width: 100%;
	}
	.menuitem {
		margin: 1%;
		padding: 1%;
	}
	.gridmain {
		width: 100%;
	}
	.main {
		padding: 1%;
	}
	.gridright {
		width: 100%;
	}
	.right {
		padding: 1%;
	}
	.gridbox {
		margin-right: 0;
		float: left;
	}
}



