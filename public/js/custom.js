/*
    Init
*/function color(){var e=0;$(".main-table > tbody > tr").each(function(){$(this).removeClass("strip");!$(this).hasClass("hidden")&&!$(this).hasClass("filterHidden")&&e++%2&&$(this).addClass("strip")})}function contactFilter(){var e=$("input:checked"),t={sex:{male:"男",female:"女"},grade:{one:"大一",two:"大二",three:"大三",four:"大四",master:"研究生",work:"工作"},group:{TG:"TG",OG:"OG",CG:"CG",PG:"PG"},campus:{zijingang:"紫金港",yuquan:"玉泉",xixi:"西溪",huajiachi:"华家池"}};selected=new Object;var n,r=!1,i,s=Array("sex","grade","group","campus"),o;for(index in s){o=s[index];selected[o]=Array()}e.each(function(){n=$(this).parents(".filterbox").attr("id");selected[n].push($(this).val())});$("table.basic-table > tbody").each(function(){i=$(this).parents(".nameCard").attr("id");for(pIndex in s){r=!1;o=s[pIndex];$(this).find("td[name="+o+"]").each(function(){for(var e=0;e<selected[o].length;e++){value=selected[o][e];if(t[o][value]==$(this).text()||$(this).text()=="")r=!0}});if(!r)break}r?$("tr[data-target=#"+i+"]").removeClass("filterHidden"):$("tr[data-target=#"+i+"]").addClass("filterHidden")})}$(document).ready(function(){contactFilter();color()});$("form").on("submit",function(){var e=$(this).find("input[name=username]"),t=e.val(),n=t.indexOf("@");if(n!==-1){t=t.substring(0,n);e.val(t)}});$(":checkbox").on("click",function(){var e=$("input[name=search]").val();if(e){$("input[name=search]").val("");$("button[name=searchSubmit]").click()}contactFilter();color();$("#checkAll").removeClass("active")});$("#checkAll").on("click",function(){$(this).addClass("active");$(":checkbox").each(function(){$(this).prop("checked","true")});contactFilter();color()});$("input[name=search]").keyup(function(){event.keyCode==13&&$("button[name=searchSubmit]").click()});$("button[name=searchSubmit]").on("click",function(){var e=$("input[name=search]").val(),t=!1;$("table.main-table > tbody > tr").each(function(n){t=!1;$(this).children().each(function(){$(this).text().indexOf(e)!=-1&&(t=!0)});t?$(this).removeClass("hidden"):$(this).addClass("hidden")});color()});$(".author").tooltip();