/*
    Init
*/function color(){var e=0;$(".main-table > tbody > tr").each(function(){$(this).removeClass("strip");!$(this).hasClass("hidden")&&!$(this).hasClass("filterHidden")&&e++%2&&$(this).addClass("strip")})}function contactFilter(){var e=$("input:checked"),t={sex:{male:"男",female:"女"},grade:{one:"大一",two:"大二",three:"大三",four:"大四",master:"研究生",work:"工作"},group:{TG:"TG",OG:"OG",CG:"CG",PG:"PG"},campus:{zijingang:"紫金港",yuquan:"玉泉",xixi:"西溪",huajiachi:"华家池",zhijiang:"之江"}},n=new Object,r,i=!1,s,o=Array("sex","grade","group","campus"),u;for(index in o){u=o[index];n[u]=Array()}e.each(function(){r=$(this).parents(".filterbox").attr("id");n[r].push($(this).val())});$("table.basic-table > tbody").each(function(){s=$(this).parents(".nameCard").attr("id");for(pIndex in o){i=!1;u=o[pIndex];$(this).find("td[name="+u+"]").each(function(){for(var e=0;e<n[u].length;e++){var r=n[u][e];if(t[u][r]==$(this).text()||$(this).text()=="")i=!0}});if(!i)break}i?$("tr[data-target=#"+s+"]").removeClass("filterHidden"):$("tr[data-target=#"+s+"]").addClass("filterHidden")})}function firstLogin(){$("#flag").each(function(){changeBox($(this).text())})}function changeBox(e){var t=new Array,n,r=Array("sex","major","grade","campus","group","nickname","longNumber","shortNumber","email","qq");$("#"+e).each(function(){t.name=$(this).find(".modal-title").text();for(var e in r){n=r[e];t[n]=$(this).find("td[name="+n+"]").text()}});$("#changeBox").each(function(){$(this).find("input[name=_id]").val(e);$(this).find(".modal-title").text(t.name);for(var i in r){n=r[i];$(this).find("[name="+n+"]").val(t[n])}$(this).modal("show")})}$(document).ready(function(){contactFilter();color();firstLogin()});$("#index form").on("submit",function(){var e=$(this).find("input[name=username]"),t=e.val(),n=t.indexOf("@");if(n!==-1){t=t.substring(0,n);e.val(t)}});$(":checkbox").on("click",function(){var e=$("input[name=search]").val();if(e){$("input[name=search]").val("");$("button[name=searchSubmit]").click()}contactFilter();color();$("#checkAll").removeClass("active")});$("#checkAll").on("click",function(){$(this).addClass("active");$(":checkbox").each(function(){$(this).prop("checked","true")});contactFilter();color()});$("input[name=search]").keyup(function(){event.keyCode==13&&$("button[name=searchSubmit]").click()});$("button[name=searchSubmit]").on("click",function(){var e=$("input[name=search]").val(),t=!1;$("table.main-table > tbody > tr").each(function(n){t=!1;$(this).children().each(function(){$(this).text().indexOf(e)!=-1&&(t=!0)});t?$(this).removeClass("hidden"):$(this).addClass("hidden")});color()});$(".author").tooltip();$("button[name=update]").on("click",function(){console.log($("#changeBox form"));$("#changeBox form").submit()});$(".nameCard button[name=change]").on("click",function(){var e=$(this).attr("data-id");$(this).parents(".nameCard").modal("hide");changeBox(e)});$("#csv, #xlsx").on("click",function(){console.log("hello");var e=$("form#export"),t=0,n='<input name = "type" value = "'+$(this).attr("id")+'">';e.append(n);$(".main-table tbody tr").each(function(){var n=$(this).attr("data-id"),r='<input name = "'+t+'" value = "'+n+'">';t++;e.append(r)});e.submit()});