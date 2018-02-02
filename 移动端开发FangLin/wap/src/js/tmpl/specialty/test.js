/**
 * Created by Administrator on 2016/6/20.
 */
loaded();
function loaded() {
    myScroll = new IScroll('.talentcentent', { mouseWheel: true });
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);