var monLog = 0;//1为双月标志，0为单月标志
var calData = {};
var displayMonths = 4;//设置日历显示月数，到第设置月数月后nextMonth按钮不可点击（注意：最小设置为3，因为当为2时没有判断双月首次加载时即为不可点击状态）。

$(function () {

    var mon = calendarMonth();//首次加载页面时月份（单月或者双月）
    var userMonth = mon;//用户点击翻月时的月份，初始化userMonth值为首次加载判断的月份。
    if(monLog == 0){
        var nextStopSingleMonth = parseInt(mon) + displayMonths > 13 ? parseInt(mon) + displayMonths - 13 : parseInt(mon) + displayMonths -1;//根据displayMonths设置显示的截止月份
    } else if (monLog == 1) {
        var firstMon = parseInt(mon.split(",")[0]);
        var nextStopDoubleMonth = firstMon + displayMonths > 14 ? firstMon + displayMonths - 14 : firstMon + displayMonths - 2;//根据displayMonths设置显示的截止月份
    }
    initMonths();
    renderCalendar(mon);//根据月份填充日历数据。
    hoverBoxPosition();//绑定弹出框出现位置事件，以及弹出框消失事件。

    $(".preMonth").on("click", function () {
        if ($(".preMonth").css("cursor") != "default") {
            if ($(".nextMonth").css("cursor") != "pointer") {
                if(monLog==0){
                    $(".nextMonth").css({ "background-position": "0px -16px", "cursor": "pointer" });
                } else if (monLog == 1) {
                    $(".nextMonth").css({ "background-position": "0px -88px", "cursor": "pointer" });
                }
                
            }
            if (monLog == 0) {
                var firstMon = parseInt(userMonth) - 1 > 0 ? parseInt(userMonth) - 1 : parseInt(userMonth) + 11;
                userMonth = firstMon.toString();
                $(".oneMonth").find("span").text(userMonth + "月");
                //当点击到首次加载页面判定的日期时(服务器时间当月)不重新加载数据。
                if (userMonth == mon) {
                    $(".preMonth").css({ "background-position": "0px -34px", "cursor": "default" });
                }

                $(".calHoverBox").addClass("none");//悬浮框消失

                renderCalendar(userMonth);//根据月份填充日历数据。
                hoverBoxPosition();//绑定弹出框出现位置事件，以及弹出框消失事件。

            } else if (monLog == 1) {
                var firstMon = parseInt(userMonth.split(",")[0]) - 1 > 0 ? parseInt(userMonth.split(",")[0]) - 1 : parseInt(userMonth.split(",")[0]) + 11;
                var secMon = parseInt(userMonth.split(",")[1]) - 1 > 0 ? parseInt(userMonth.split(",")[1]) - 1 : parseInt(userMonth.split(",")[1]) + 11;
                userMonth = firstMon.toString() + ',' + secMon.toString();
                if (userMonth == mon) {
                    $(".preMonth").css({ "background-position": "0px -34px", "cursor": "default" });
                }
                $(".calMonths .month").eq(0).find("span").text(firstMon+"月");
                $(".calMonths .month").eq(1).find("span").text(secMon + "月");

                $(".calHoverBox").addClass("none");//悬浮框消失

                renderCalendar(userMonth);//根据月份填充日历数据。
                hoverBoxPosition();//绑定弹出框出现位置事件，以及弹出框消失事件。
            }
        }


    });
    $(".nextMonth").on("click", function () {
        if ($(".nextMonth").css("cursor") != "default") {
            if ($(".preMonth").css("cursor") != "pointer") {
                $(".preMonth").css({ "background-position": "0px 2px", "cursor": "pointer" });
            }
            if (monLog == 0) {
                var firstMon = parseInt(userMonth) + 1 > 12 ? 1 : parseInt(userMonth) + 1;

                userMonth = firstMon.toString();
                
                $(".oneMonth").find("span").text(userMonth + "月");

                $(".calHoverBox").addClass("none");//悬浮框消失

                renderCalendar(userMonth);//根据月份填充日历数据。
                hoverBoxPosition();//绑定弹出框出现位置事件，以及弹出框消失事件。
                if (userMonth == nextStopSingleMonth) {
                    $(".nextMonth").css({ "background-position": "0px -51px", "cursor": "default" });
                }   

            } else if (monLog == 1) {
                var firstMon = parseInt(userMonth.split(",")[0]) + 1 > 12 ? 1 : parseInt(userMonth.split(",")[0]) + 1;
                var secMon = parseInt(userMonth.split(",")[1]) + 1 > 12 ? 1 : parseInt(userMonth.split(",")[1]) + 1;
                userMonth = firstMon.toString() + ',' + secMon.toString();

                $(".calMonths .month").eq(0).find("span").text(firstMon + "月");
                $(".calMonths .month").eq(1).find("span").text(secMon + "月");

                $(".calHoverBox").addClass("none");//悬浮框消失

                renderCalendar(userMonth);//根据月份填充日历数据。
                hoverBoxPosition();//绑定弹出框出现位置事件，以及弹出框消失事件。
                if (firstMon == nextStopDoubleMonth) {
                    $(".nextMonth").css({ "background-position": "0px -51px", "cursor": "default" });
                }
            }
        }
    });
})
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
//日历悬浮框的位置，根据情况显示或者隐藏悬浮框
function hoverBoxPosition(){
    $(".calDays").on("mouseenter", "td", function () {
        if ($(this).hasClass("hasData")) {
            $(".calHoverBox").removeClass("none");

            renderHoverBox($(this));//不能放在后面，否则无法正确获取hoverBoxHeight和hoverBoxWidth；

            var relativeTop = getRelTop($(this));
            var relativeBottom = getRelBottom($(this));
            var relativeLeft = getRelLeft($(this));
            var relativeRight = getRelRight($(this));
            var absTop = getAbsTop($(this));
            var absBottom = getAbsBottom($(this));
            var absLeft = getAbsLeft($(this));
            var absRight = getAbsRight($(this));
            var hoverBoxHeight = $(".calHoverBox").outerHeight();
            var hoverBoxWidth = $(".calHoverBox").outerWidth();
            var dayBoxHeight = $(this).outerHeight();
            var dayBoxWidth = $(this).outerWidth();
            //悬浮框在下方
            if (relativeBottom > hoverBoxHeight) {
                if (relativeLeft > hoverBoxWidth) {
                    $(".calHoverBox").css({ "top": absBottom + "px", "left": absLeft + dayBoxWidth + "px" });//悬浮框在下左
                    $(".calHoverBox i:first-child").removeClass().addClass("tipTopOut").css({ "top": -20 + "px", "left": hoverBoxWidth - dayBoxWidth / 2 + "px" });
                    $(".calHoverBox i:eq(1)").removeClass().addClass("tipTopIn").css({ "top": -19 + "px", "left": hoverBoxWidth - dayBoxWidth / 2 + "px" });
                }
                else if (relativeLeft <= hoverBoxWidth) {
                    $(".calHoverBox").css({ "top": absBottom + "px", "left": absRight - dayBoxWidth + "px" });//悬浮框在下右
                    $(".calHoverBox i:first-child").removeClass().addClass("tipTopOut").css({ "top": -20 + "px", "left": dayBoxWidth / 2 + "px" });
                    $(".calHoverBox i:eq(1)").removeClass().addClass("tipTopIn").css({ "top": -19 + "px", "left": dayBoxWidth / 2 + "px" });
                }

            }
            else {
                //悬浮框在中部(只有当出现四条提示时才会进入此逻辑)
                if (relativeTop < hoverBoxHeight) {
                    if (relativeLeft > hoverBoxWidth) {
                        $(".calHoverBox").css({ "top": absTop + hoverBoxHeight / 2 + "px", "left": absLeft + "px" });//悬浮框在中左
                        $(".calHoverBox i:first-child").removeClass().addClass("tipRightOut").css({ "top": hoverBoxHeight - 94 + "px", "left": hoverBoxWidth - 1 + "px" });
                        $(".calHoverBox i:eq(1)").removeClass().addClass("tipRightIn").css({ "top": hoverBoxHeight - 94 + "px", "left": hoverBoxWidth - 2 + "px" });
                    }
                    else {
                        $(".calHoverBox").css({ "top": absTop + hoverBoxHeight / 2 + "px", "left": absRight + "px" });//悬浮框在中右
                        $(".calHoverBox i:first-child").removeClass().addClass("tipLeftOut").css({ "top": hoverBoxHeight - 94 + "px", "left": -20 + "px" });
                        $(".calHoverBox i:eq(1)").removeClass().addClass("tipLeftIn").css({ "top": hoverBoxHeight - 94 + "px", "left": -19 + "px" });
                    }
                }
                    //悬浮框在上部
                else {
                    if (relativeLeft > hoverBoxWidth) {
                        $(".calHoverBox").css({ "top": absTop + "px", "left": absLeft + dayBoxWidth + "px" });//悬浮框在上左
                        $(".calHoverBox i:first-child").removeClass().addClass("tipBottomOut").css({ "top": hoverBoxHeight - 2 + "px", "left": hoverBoxWidth - dayBoxWidth / 2 + "px" });
                        $(".calHoverBox i:eq(1)").removeClass().addClass("tipBottomIn").css({ "top": hoverBoxHeight - 3 + "px", "left": hoverBoxWidth - dayBoxWidth / 2 + "px" });
                    }
                    else {
                        $(".calHoverBox").css({ "top": absTop + "px", "left": absRight - dayBoxWidth + "px" });//悬浮框在上右
                        $(".calHoverBox i:first-child").removeClass().addClass("tipBottomOut").css({ "top": hoverBoxHeight - 2 + "px", "left": dayBoxWidth / 2 + "px" });
                        $(".calHoverBox i:eq(1)").removeClass().addClass("tipBottomIn").css({ "top": hoverBoxHeight - 3 + "px", "left": dayBoxWidth / 2 + "px" });
                    }
                }
            }
        }
    });
    //当移出有数据框时悬浮框消失
    $(".calDays").on("mouseenter", "td", function (event) {
        if (!$(this).hasClass("hasData")) {
            $(".calHoverBox").addClass("none");
        }
    });
    //当移出非td标签且没有进入悬浮框时，悬浮框消失
    $(".calDays").on("mouseleave", "td", function (event) {
        
        var leaveDom = (function (event) {
            if (event.relatedTarget) {
                return event.relatedTarget;
            } else if (event.toElement) {
                return event.toElement;
            } else {
                return null;
            }
        })(event);

        if (leaveDom) {
            if (leaveDom.tagName != "I" && leaveDom.tagName != "LI" && leaveDom.className != "calHoverBox") {
                $(".calHoverBox").addClass("none");
            }
        }

    });
    //当鼠标从悬浮框移出时，悬浮框消失
    $(".calHoverBox").on("mouseleave", function () {
        $(".calHoverBox").addClass("none");
    });
}
///填充日历数据
function renderCalendar(month) {
/*    $.ajax({
        url: '/TeMai/GetPriceCalendar?month=' + month + '&activeId=1106&periodIds=1582,1583,1584',
        dataType: 'json',
        success: function (data, status, xhr) {*/
            $("#calendarHtml").empty();
            calData =
            {"priceInfoList":[{"date":"2015-11-16","logs":0,"product":[]},{"date":"2015-11-17","logs":0,"product":[]},{"date":"2015-11-18","logs":0,"product":[]},{"date":"2015-11-19","logs":0,"product":[]},{"date":"2015-11-20","logs":0,"product":[]},{"date":"2015-11-21","logs":0,"product":[]},{"date":"2015-11-22","logs":0,"product":[]},{"date":"2015-11-23","logs":0,"product":[]},{"date":"2015-11-24","logs":0,"product":[]},{"date":"2015-11-25","logs":1,"product":[]},{"date":"2015-11-26","logs":0,"product":[]},{"date":"2015-11-27","logs":0,"product":[{"LeavePortCityId":"324","AmountDirect":399,"MainTitle":"【三星住宿】赤水大瀑布+佛光岩+四洞沟+中国侏罗纪公园汽车3日跟团游","LineProperty":1,"LineId":7847,"LineProType":1,"AK":"B9C215E4610731BB7546FA68F27AF207","RouteTitle":"成都 - 赤水"},{"LeavePortCityId":"324","AmountDirect":579,"MainTitle":"【五星豪生温泉奢享】九寨沟+牟尼沟双汽3日跟团游","LineProperty":1,"LineId":21484,"LineProType":1,"AK":"0D692DC0410FF2A413C994DD22E6A839","RouteTitle":"成都 - 成都"},{"LeavePortCityId":"91","AmountDirect":699,"MainTitle":"【元旦不涨价】厦门鼓浪屿双动3日自由行","LineProperty":3,"LineId":21825,"LineProType":1,"AK":"7F3C30D3925C2FC213C994DD22E6A839","RouteTitle":"深圳 - 厦门"}]},{"date":"2015-11-28","logs":0,"product":[{"LeavePortCityId":"324","AmountDirect":579,"MainTitle":"【五星豪生温泉奢享】九寨沟+牟尼沟双汽3日跟团游","LineProperty":1,"LineId":21484,"LineProType":1,"AK":"0D692DC0410FF2A413C994DD22E6A839","RouteTitle":"成都 - 成都"},{"LeavePortCityId":"321","AmountDirect":599,"MainTitle":"【销量过千，5分好评】桂林+阳朔双飞4日跟团游","LineProperty":1,"LineId":340,"LineProType":1,"AK":"DBB4F0570073211D01EA55E348BDBD6C","RouteTitle":"上海 - 桂林"},{"LeavePortCityId":"192","AmountDirect":599,"MainTitle":"【盛宴•桂林】桂林+阳朔双卧5日跟团游","LineProperty":1,"LineId":20700,"LineProType":1,"AK":"49E2C86C6E00E53213C994DD22E6A839","RouteTitle":"武汉 - 桂林"},{"LeavePortCityId":"80","AmountDirect":659,"MainTitle":"【厦·暖冬】厦门+鼓浪屿双动3日自由行","LineProperty":3,"LineId":17593,"LineProType":1,"AK":"8D2818AC2AA2866313C994DD22E6A839","RouteTitle":"广州 - 厦门"}]},{"date":"2015-11-29","logs":0,"product":[{"LeavePortCityId":"321","AmountDirect":599,"MainTitle":"【销量过千，5分好评】桂林+阳朔双飞4日跟团游","LineProperty":1,"LineId":340,"LineProType":1,"AK":"DBB4F0570073211D01EA55E348BDBD6C","RouteTitle":"上海 - 桂林"},{"LeavePortCityId":"192","AmountDirect":599,"MainTitle":"【盛宴•桂林】桂林+阳朔双卧5日跟团游","LineProperty":1,"LineId":20700,"LineProType":1,"AK":"49E2C86C6E00E53213C994DD22E6A839","RouteTitle":"武汉 - 桂林"},{"LeavePortCityId":"80","AmountDirect":659,"MainTitle":"【厦·暖冬】厦门+鼓浪屿双动3日自由行","LineProperty":3,"LineId":17593,"LineProType":1,"AK":"8D2818AC2AA2866313C994DD22E6A839","RouteTitle":"广州 - 厦门"},{"LeavePortCityId":"91","AmountDirect":699,"MainTitle":"【元旦不涨价】厦门鼓浪屿双动3日自由行","LineProperty":3,"LineId":21825,"LineProType":1,"AK":"7F3C30D3925C2FC213C994DD22E6A839","RouteTitle":"深圳 - 厦门"}]},{"date":"2015-11-30","logs":0,"product":[{"LeavePortCityId":"80","AmountDirect":429,"MainTitle":"桂林+阳朔双动3日跟团游","LineProperty":1,"LineId":19277,"LineProType":1,"AK":"42ACE47FA4241B5913C994DD22E6A839","RouteTitle":"广州 - 桂林"},{"LeavePortCityId":"324","AmountDirect":579,"MainTitle":"【五星豪生温泉奢享】九寨沟+牟尼沟双汽3日跟团游","LineProperty":1,"LineId":21484,"LineProType":1,"AK":"0D692DC0410FF2A413C994DD22E6A839","RouteTitle":"成都 - 成都"},{"LeavePortCityId":"321","AmountDirect":599,"MainTitle":"【销量过千，5分好评】桂林+阳朔双飞4日跟团游","LineProperty":1,"LineId":340,"LineProType":1,"AK":"DBB4F0570073211D01EA55E348BDBD6C","RouteTitle":"上海 - 桂林"},{"LeavePortCityId":"192","AmountDirect":599,"MainTitle":"【盛宴•桂林】桂林+阳朔双卧5日跟团游","LineProperty":1,"LineId":20700,"LineProType":1,"AK":"49E2C86C6E00E53213C994DD22E6A839","RouteTitle":"武汉 - 桂林"}]},{"date":"2015-12-01","logs":0,"product":[{"LeavePortCityId":"192","AmountDirect":599,"MainTitle":"【盛宴•桂林】桂林+阳朔双卧5日跟团游","LineProperty":1,"LineId":20700,"LineProType":1,"AK":"49E2C86C6E00E53213C994DD22E6A839","RouteTitle":"武汉 - 桂林"},{"LeavePortCityId":"80","AmountDirect":659,"MainTitle":"【厦·暖冬】厦门+鼓浪屿双动3日自由行","LineProperty":3,"LineId":17593,"LineProType":1,"AK":"8D2818AC2AA2866313C994DD22E6A839","RouteTitle":"广州 - 厦门"},{"LeavePortCityId":"91","AmountDirect":699,"MainTitle":"【元旦不涨价】厦门鼓浪屿双动3日自由行","LineProperty":3,"LineId":21825,"LineProType":1,"AK":"7F3C30D3925C2FC213C994DD22E6A839","RouteTitle":"深圳 - 厦门"},{"LeavePortCityId":"321","AmountDirect":799,"MainTitle":"【宿在美丽银滩】北海双飞4日自由行","LineProperty":3,"LineId":352,"LineProType":1,"AK":"3BC0FD9A582C43E201EA55E348BDBD6C","RouteTitle":"上海 - 北海"}]},{"date":"2015-12-02","logs":0,"product":[{"LeavePortCityId":"80","AmountDirect":659,"MainTitle":"【厦·暖冬】厦门+鼓浪屿双动3日自由行","LineProperty":3,"LineId":17593,"LineProType":1,"AK":"8D2818AC2AA2866313C994DD22E6A839","RouteTitle":"广州 - 厦门"},{"LeavePortCityId":"91","AmountDirect":699,"MainTitle":"【元旦不涨价】厦门鼓浪屿双动3日自由行","LineProperty":3,"LineId":21825,"LineProType":1,"AK":"7F3C30D3925C2FC213C994DD22E6A839","RouteTitle":"深圳 - 厦门"},{"LeavePortCityId":"321","AmountDirect":799,"MainTitle":"【宿在美丽银滩】北海双飞4日自由行","LineProperty":3,"LineId":352,"LineProType":1,"AK":"3BC0FD9A582C43E201EA55E348BDBD6C","RouteTitle":"上海 - 北海"},{"LeavePortCityId":"192","AmountDirect":991,"MainTitle":"【暖冬爆款 流浪鹭岛】厦门双飞4日自由行\u003c赠送接机服务\u003e","LineProperty":3,"LineId":4478,"LineProType":1,"AK":"5A68D0E64063BD317546FA68F27AF207","RouteTitle":"武汉 - 厦门"}]},{"date":"2015-12-03","logs":0,"product":[{"LeavePortCityId":"91","AmountDirect":699,"MainTitle":"【元旦不涨价】厦门鼓浪屿双动3日自由行","LineProperty":3,"LineId":21825,"LineProType":1,"AK":"7F3C30D3925C2FC213C994DD22E6A839","RouteTitle":"深圳 - 厦门"},{"LeavePortCityId":"321","AmountDirect":799,"MainTitle":"【宿在美丽银滩】北海双飞4日自由行","LineProperty":3,"LineId":352,"LineProType":1,"AK":"3BC0FD9A582C43E201EA55E348BDBD6C","RouteTitle":"上海 - 北海"},{"LeavePortCityId":"53","AmountDirect":888,"MainTitle":"【超值特惠】西安双飞5日自由行","LineProperty":3,"LineId":21951,"LineProType":1,"AK":"91D7F43DEBD9D71913C994DD22E6A839","RouteTitle":"北京 - 西安"},{"LeavePortCityId":"53","AmountDirect":1166,"MainTitle":"【特惠12月】绵阳+九寨沟+牟尼沟+成都双飞6日跟团游","LineProperty":1,"LineId":677,"LineProType":1,"AK":"36ABDD10FEDDE91201EA55E348BDBD6C","RouteTitle":"北京 - 成都"}]},{"date":"2015-12-04","logs":0,"product":[{"LeavePortCityId":"321","AmountDirect":799,"MainTitle":"【宿在美丽银滩】北海双飞4日自由行","LineProperty":3,"LineId":352,"LineProType":1,"AK":"3BC0FD9A582C43E201EA55E348BDBD6C","RouteTitle":"上海 - 北海"},{"LeavePortCityId":"53","AmountDirect":888,"MainTitle":"【超值特惠】西安双飞5日自由行","LineProperty":3,"LineId":21951,"LineProType":1,"AK":"91D7F43DEBD9D71913C994DD22E6A839","RouteTitle":"北京 - 西安"},{"LeavePortCityId":"192","AmountDirect":991,"MainTitle":"【暖冬爆款 流浪鹭岛】厦门双飞4日自由行\u003c赠送接机服务\u003e","LineProperty":3,"LineId":4478,"LineProType":1,"AK":"5A68D0E64063BD317546FA68F27AF207","RouteTitle":"武汉 - 厦门"},{"LeavePortCityId":"53","AmountDirect":1166,"MainTitle":"【特惠12月】绵阳+九寨沟+牟尼沟+成都双飞6日跟团游","LineProperty":1,"LineId":677,"LineProType":1,"AK":"36ABDD10FEDDE91201EA55E348BDBD6C","RouteTitle":"北京 - 成都"}]},{"date":"2015-12-05","logs":0,"product":[{"LeavePortCityId":"53","AmountDirect":888,"MainTitle":"【超值特惠】西安双飞5日自由行","LineProperty":3,"LineId":21951,"LineProType":1,"AK":"91D7F43DEBD9D71913C994DD22E6A839","RouteTitle":"北京 - 西安"},{"LeavePortCityId":"53","AmountDirect":1166,"MainTitle":"【特惠12月】绵阳+九寨沟+牟尼沟+成都双飞6日跟团游","LineProperty":1,"LineId":677,"LineProType":1,"AK":"36ABDD10FEDDE91201EA55E348BDBD6C","RouteTitle":"北京 - 成都"},{"LeavePortCityId":"80","AmountDirect":1609,"MainTitle":"【双岛加温泉】海南双飞4日跟团游","LineProperty":1,"LineId":20143,"LineProType":1,"AK":"919CA4A212E9E3B013C994DD22E6A839","RouteTitle":"广州 - 海口"},{"LeavePortCityId":"80","AmountDirect":1760,"MainTitle":"【特色温泉 低价品质】成都+九寨沟+牟尼沟双飞5日跟团游","LineProperty":1,"LineId":21475,"LineProType":1,"AK":"EF1FEB55C061944513C994DD22E6A839","RouteTitle":"广州 - 成都"}]},{"date":"2015-12-06","logs":0,"product":[{"LeavePortCityId":"53","AmountDirect":1166,"MainTitle":"【特惠12月】绵阳+九寨沟+牟尼沟+成都双飞6日跟团游","LineProperty":1,"LineId":677,"LineProType":1,"AK":"36ABDD10FEDDE91201EA55E348BDBD6C","RouteTitle":"北京 - 成都"},{"LeavePortCityId":"80","AmountDirect":1609,"MainTitle":"【双岛加温泉】海南双飞4日跟团游","LineProperty":1,"LineId":20143,"LineProType":1,"AK":"919CA4A212E9E3B013C994DD22E6A839","RouteTitle":"广州 - 海口"},{"LeavePortCityId":"80","AmountDirect":1760,"MainTitle":"【特色温泉 低价品质】成都+九寨沟+牟尼沟双飞5日跟团游","LineProperty":1,"LineId":21475,"LineProType":1,"AK":"EF1FEB55C061944513C994DD22E6A839","RouteTitle":"广州 - 成都"},{"LeavePortCityId":"53","AmountDirect":2699,"MainTitle":"【超值特惠】三亚双飞5日自由行","LineProperty":3,"LineId":6969,"LineProType":1,"AK":"4E4937605246C2397546FA68F27AF207","RouteTitle":"北京 - 海口"}]},{"date":"2015-12-07","logs":0,"product":[{"LeavePortCityId":"192","AmountDirect":991,"MainTitle":"【暖冬爆款 流浪鹭岛】厦门双飞4日自由行\u003c赠送接机服务\u003e","LineProperty":3,"LineId":4478,"LineProType":1,"AK":"5A68D0E64063BD317546FA68F27AF207","RouteTitle":"武汉 - 厦门"},{"LeavePortCityId":"53","AmountDirect":1166,"MainTitle":"【特惠12月】绵阳+九寨沟+牟尼沟+成都双飞6日跟团游","LineProperty":1,"LineId":677,"LineProType":1,"AK":"36ABDD10FEDDE91201EA55E348BDBD6C","RouteTitle":"北京 - 成都"},{"LeavePortCityId":"80","AmountDirect":1609,"MainTitle":"【双岛加温泉】海南双飞4日跟团游","LineProperty":1,"LineId":20143,"LineProType":1,"AK":"919CA4A212E9E3B013C994DD22E6A839","RouteTitle":"广州 - 海口"},{"LeavePortCityId":"80","AmountDirect":1760,"MainTitle":"【特色温泉 低价品质】成都+九寨沟+牟尼沟双飞5日跟团游","LineProperty":1,"LineId":21475,"LineProType":1,"AK":"EF1FEB55C061944513C994DD22E6A839","RouteTitle":"广州 - 成都"}]},{"date":"2015-12-08","logs":0,"product":[{"LeavePortCityId":"80","AmountDirect":1609,"MainTitle":"【双岛加温泉】海南双飞4日跟团游","LineProperty":1,"LineId":20143,"LineProType":1,"AK":"919CA4A212E9E3B013C994DD22E6A839","RouteTitle":"广州 - 海口"},{"LeavePortCityId":"80","AmountDirect":1760,"MainTitle":"【特色温泉 低价品质】成都+九寨沟+牟尼沟双飞5日跟团游","LineProperty":1,"LineId":21475,"LineProType":1,"AK":"EF1FEB55C061944513C994DD22E6A839","RouteTitle":"广州 - 成都"},{"LeavePortCityId":"53","AmountDirect":2699,"MainTitle":"【超值特惠】三亚双飞5日自由行","LineProperty":3,"LineId":6969,"LineProType":1,"AK":"4E4937605246C2397546FA68F27AF207","RouteTitle":"北京 - 海口"}]},{"date":"2015-12-09","logs":0,"product":[{"LeavePortCityId":"80","AmountDirect":1760,"MainTitle":"【特色温泉 低价品质】成都+九寨沟+牟尼沟双飞5日跟团游","LineProperty":1,"LineId":21475,"LineProType":1,"AK":"EF1FEB55C061944513C994DD22E6A839","RouteTitle":"广州 - 成都"},{"LeavePortCityId":"192","AmountDirect":2000,"MainTitle":"【全景云南】昆明+大理+丽江+香格里拉+西双版纳5飞8日跟团游","LineProperty":1,"LineId":18069,"LineProType":1,"AK":"16042BB76F5B160E13C994DD22E6A839","RouteTitle":"武汉 - 昆明"},{"LeavePortCityId":"321","AmountDirect":2199,"MainTitle":"【升级1晚5星】西安+华山+郑州+洛阳+开封卧动5日跟团游","LineProperty":1,"LineId":2925,"LineProType":1,"AK":"72D3568877FBA5B07546FA68F27AF207","RouteTitle":"上海 - 西安"},{"LeavePortCityId":"53","AmountDirect":2699,"MainTitle":"【超值特惠】三亚双飞5日自由行","LineProperty":3,"LineId":6969,"LineProType":1,"AK":"4E4937605246C2397546FA68F27AF207","RouteTitle":"北京 - 海口"}]},{"date":"2015-12-10","logs":0,"product":[{"LeavePortCityId":"53","AmountDirect":2699,"MainTitle":"【超值特惠】三亚双飞5日自由行","LineProperty":3,"LineId":6969,"LineProType":1,"AK":"4E4937605246C2397546FA68F27AF207","RouteTitle":"北京 - 海口"}]},{"date":"2015-12-11","logs":0,"product":[{"LeavePortCityId":"321","AmountDirect":1199,"MainTitle":"【低价兜售】成都双飞4日自由行","LineProperty":3,"LineId":22161,"LineProType":1,"AK":"25A37E0F924EDE2313C994DD22E6A839","RouteTitle":"上海 - 成都"},{"LeavePortCityId":"80","AmountDirect":1609,"MainTitle":"【双岛加温泉】海南双飞4日跟团游","LineProperty":1,"LineId":20143,"LineProType":1,"AK":"919CA4A212E9E3B013C994DD22E6A839","RouteTitle":"广州 - 海口"},{"LeavePortCityId":"80","AmountDirect":1760,"MainTitle":"【特色温泉 低价品质】成都+九寨沟+牟尼沟双飞5日跟团游","LineProperty":1,"LineId":21475,"LineProType":1,"AK":"EF1FEB55C061944513C994DD22E6A839","RouteTitle":"广州 - 成都"},{"LeavePortCityId":"53","AmountDirect":1838,"MainTitle":"【醉美雪景】哈尔滨+亚布力滑雪+雪乡+吉林雾淞卧去动回5日跟团游","LineProperty":1,"LineId":19578,"LineProType":1,"AK":"F8ED60A8FC6B3C5313C994DD22E6A839","RouteTitle":"北京 - 长春"}]},{"date":"2015-12-12","logs":0,"product":[]},{"date":"2015-12-13","logs":0,"product":[]},{"date":"2015-12-14","logs":0,"product":[{"LeavePortCityId":"192","AmountDirect":2000,"MainTitle":"【全景云南】昆明+大理+丽江+香格里拉+西双版纳5飞8日跟团游","LineProperty":1,"LineId":18069,"LineProType":1,"AK":"16042BB76F5B160E13C994DD22E6A839","RouteTitle":"武汉 - 昆明"},{"LeavePortCityId":"53","AmountDirect":2699,"MainTitle":"【超值特惠】三亚双飞5日自由行","LineProperty":3,"LineId":6969,"LineProType":1,"AK":"4E4937605246C2397546FA68F27AF207","RouteTitle":"北京 - 海口"}]},{"date":"2015-12-15","logs":0,"product":[{"LeavePortCityId":"53","AmountDirect":1838,"MainTitle":"【醉美雪景】哈尔滨+亚布力滑雪+雪乡+吉林雾淞卧去动回5日跟团游","LineProperty":1,"LineId":19578,"LineProType":1,"AK":"F8ED60A8FC6B3C5313C994DD22E6A839","RouteTitle":"北京 - 长春"},{"LeavePortCityId":"53","AmountDirect":2699,"MainTitle":"【超值特惠】三亚双飞5日自由行","LineProperty":3,"LineId":6969,"LineProType":1,"AK":"4E4937605246C2397546FA68F27AF207","RouteTitle":"北京 - 海口"}]},{"date":"2015-12-16","logs":0,"product":[{"LeavePortCityId":"321","AmountDirect":2199,"MainTitle":"【升级1晚5星】西安+华山+郑州+洛阳+开封卧动5日跟团游","LineProperty":1,"LineId":2925,"LineProType":1,"AK":"72D3568877FBA5B07546FA68F27AF207","RouteTitle":"上海 - 西安"},{"LeavePortCityId":"53","AmountDirect":2699,"MainTitle":"【超值特惠】三亚双飞5日自由行","LineProperty":3,"LineId":6969,"LineProType":1,"AK":"4E4937605246C2397546FA68F27AF207","RouteTitle":"北京 - 海口"}]},{"date":"2015-12-17","logs":0,"product":[]},{"date":"2015-12-18","logs":0,"product":[]},{"date":"2015-12-19","logs":0,"product":[]},{"date":"2015-12-20","logs":0,"product":[]},{"date":"2015-12-21","logs":0,"product":[]},{"date":"2015-12-22","logs":0,"product":[]},{"date":"2015-12-23","logs":0,"product":[]},{"date":"2015-12-24","logs":0,"product":[]},{"date":"2015-12-25","logs":0,"product":[]},{"date":"2015-12-26","logs":0,"product":[]},{"date":"2015-12-27","logs":0,"product":[]}]};
            var $calendarHtml = $(template("CalendarTmpl", calData)).appendTo("#calendarHtml");
/*        }
    });*/
}
//根据当前的<td>和数据填充悬浮框
function renderHoverBox($this) {
    var date = $this.attr("attr-date");
    var strHtml = "";
    var len = calData.priceInfoList.length;

    for (var i = 0; i < len; i++) {
        if (calData.priceInfoList[i].date == date) {
            var proLen = parseInt(calData.priceInfoList[i].product.length) > 4 ? 4 : calData.priceInfoList[i].product.length;
            for (var j = 0; j < proLen;j++){
                strHtml = strHtml + getHoverBoxProduct(calData.priceInfoList[i].product[j]);
            }
            $(".calHoverBox ul").html(strHtml);
            return;
        }
    }
}
//拼接hoverBox中产品
function getHoverBoxProduct(obj) {
    var str = "";
    var lineStyle = obj.LineProperty ==1?"跟团游":"自由行";
    str =   '<li>'+
                '<a href=#' + ' target="_blank">'+
                    '<div class="calLeftCont">'+
                        '<span>'+obj.MainTitle + '</span>'+
                        '<span>'+obj.RouteTitle + '&nbsp;'+ lineStyle +'</span>'+
                    '</div>'+
                    '<span class="calRightCont">￥<em>'+obj.AmountDirect+'</em><i>起</i>'+
                    '</span>'+
                '</a>'+
            '</li>';
    return str;
}
//判断日历呈现单月或者双月
function calendarMonth() {
    var now = new Date();
    var date = now.getDate();
    var month = now.getMonth()+1;
    var result = month;
    var log = date > 15 ? 1 : 0;//为1时为双月，0为单月；
    monLog = log;
    if(log == 1){
        result = result.toString() + ',' + (month == 12 ? 1 : month + 1).toString();
    }
    return result;
}
//初始化日历月份
function initMonths() {
    var mon = calendarMonth();
    if (monLog == 1) {
        var firstMon = parseInt(mon.split(",")[0]);
        var secMon = parseInt(mon.split(",")[1]);
        $(".calMonths ").css({ "display": "block" });
        $(".oneMonth ").css({ "display": "none" });
        $(".calMonths .month").eq(0).find("span").text(firstMon + "月");
        $(".calMonths .month").eq(1).find("span").text(secMon + "月");
    } else if (monLog == 0) {
        $(".calMonths ").css({ "display": "none" });
        $(".oneMonth ").css({ "display": "block" });
        $(".nextMonth ").css({ "background-position": "0px -16px" });
        $(".oneMonth").find("span").text(mon + "月");
    }
}