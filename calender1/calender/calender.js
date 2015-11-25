$(function(){
/*    console.log(position($("#test")).relTOp);*/
    $(".calDays td").hover(function(){
        var relativeTop = getRelTop($(this));
        var relativeBottom = getRelBottom($(this));
        var  relativeLeft = getRelLeft($(this));
        var relativeRight = getRelRight($(this));
        var  absTop = getAbsTop($(this));
        var  absBottom = getAbsBottom($(this));
        var  absLeft = getAbsLeft($(this));
        var  absRight = getAbsRight($(this));
        var  hoverBoxHeight = $(".calHoverBox").outerHeight();
        var  hoverBoxWidth = $(".calHoverBox").outerWidth();
        var  dayBoxHeight = $(this).outerHeight();
        var  dayBoxWidth = $(this).outerWidth();
        //悬浮框在下方
        if(relativeBottom > hoverBoxHeight){
            if(relativeLeft > hoverBoxWidth){
                $(".calHoverBox").css({"top":absBottom+"px","left":absLeft + dayBoxWidth +"px"});//悬浮框在下左
                $(".calHoverBox i:first-child").removeClass().addClass("tipTopOut").css({"top": -20 +"px","left": hoverBoxWidth - dayBoxWidth/2+"px"});
                $(".calHoverBox i:eq(1)").removeClass().addClass("tipTopIn").css({"top": -19 +"px","left":  hoverBoxWidth - dayBoxWidth/2+"px"});
            }
            else if(relativeLeft <= hoverBoxWidth){
                $(".calHoverBox").css({"top":absBottom+"px","left":absRight - dayBoxWidth +"px"});//悬浮框在下右
                $(".calHoverBox i:first-child").removeClass().addClass("tipTopOut").css({"top": -20 +"px","left":  dayBoxWidth/2+"px"});
                $(".calHoverBox i:eq(1)").removeClass().addClass("tipTopIn").css({"top": -19 +"px","left":  dayBoxWidth/2+"px"});
            }

        }
        else{
            //悬浮框在中部(只有当出现四条提示时才会进入此逻辑)
            if(relativeTop < hoverBoxHeight){
                if(relativeLeft > hoverBoxWidth){
                    $(".calHoverBox").css({"top":absTop + hoverBoxHeight/2 +"px","left":absLeft +"px"});//悬浮框在中左
                    $(".calHoverBox i:first-child").removeClass().addClass("tipRightOut").css({"top": hoverBoxHeight - 94 +"px","left": hoverBoxWidth - 1+"px"});
                    $(".calHoverBox i:eq(1)").removeClass().addClass("tipRightIn").css({"top": hoverBoxHeight - 94 +"px","left":  hoverBoxWidth-2+"px"});
                }
                else{
                    $(".calHoverBox").css({"top":absTop + hoverBoxHeight/2 +"px","left":absRight +"px"});//悬浮框在中右
                    $(".calHoverBox i:first-child").removeClass().addClass("tipLeftOut").css({"top": hoverBoxHeight - 94 +"px","left": -20+"px"});
                    $(".calHoverBox i:eq(1)").removeClass().addClass("tipLeftIn").css({"top": hoverBoxHeight - 94 +"px","left":  -19+"px"});
                }
            }
            //悬浮框在上部
            else {
                if(relativeLeft > hoverBoxWidth){
                    $(".calHoverBox").css({"top":absTop +"px","left":absLeft + dayBoxWidth +"px"});//悬浮框在上左
                    $(".calHoverBox i:first-child").removeClass().addClass("tipBottomOut").css({"top": hoverBoxHeight-2 +"px","left": hoverBoxWidth-dayBoxWidth/2+"px"});
                    $(".calHoverBox i:eq(1)").removeClass().addClass("tipBottomIn").css({"top": hoverBoxHeight-3 +"px","left":  hoverBoxWidth-dayBoxWidth/2+"px"});
                }
                else{
                    $(".calHoverBox").css({"top":absTop +"px","left":absRight - dayBoxWidth +"px"});//悬浮框在上右
                    $(".calHoverBox i:first-child").removeClass().addClass("tipBottomOut").css({"top": hoverBoxHeight-2 +"px","left": dayBoxWidth/2+"px"});
                    $(".calHoverBox i:eq(1)").removeClass().addClass("tipBottomIn").css({"top": hoverBoxHeight-3 +"px","left":  dayBoxWidth/2+"px"});
                }
            }
        }
    });
/*    $(".calDays").mouseout(function(){
        setTimeout(function(){
            $("calHoverBox").css({"display":"none"});
            $(".calHoverBox i:first-child").removeClass();
            $(".calHoverBox i:eq(1)").removeClass();
        },1500);
    });*/
});
/*var position = function($this){
    relTop:$this.position().top;
}*/
//$a对象边框相对于某个父元素（position为relative的最近父元素）边框的距离
function getRelTop($a){
    return $a.position().top;
}
function getRelBottom($a){
    return $(".calDays").outerHeight() - $a.outerHeight() - $a.position().top;
}
function getRelLeft($a){
    return $a.position().left;
}
function getRelRight($a){
    return $(".calDays").outerWidth() - $a.outerWidth() - $a.position().left;
}
//获取元素在文档中绝对位置
function getAbsTop($a){
    return $a.offset().top -$(".calendarBox ").offset().top -  $(".calHoverBox").outerHeight();
}
function getAbsBottom($a){
    return $a.offset().top -$(".calendarBox ").offset().top + $a.outerHeight();
}
function getAbsLeft($a){
    return $a.offset().left -$(".calendarBox ").offset().left - $(".calHoverBox").outerWidth();
}
function getAbsRight($a){
    return $a.offset().left -$(".calendarBox ").offset().left + $a.outerWidth();
}