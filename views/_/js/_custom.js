/*
    Active nav list
*/

$("#main .navbar-nav #list-main").addClass("active");

/*
    Color main-table
*/

function color() {
    var count = 0;
    $(".main-table > tbody > tr").each(function() {
        $(this).removeClass('strip');
        if (!($(this).hasClass("hidden") || $(this).hasClass("filterHidden") )) {
            // console.log(count);
            if (count++ % 2) {
                $(this).addClass('strip');
            }
        }
    });
}


/*
    Remove the '@' in the username
*/

$("button[name=loginSubmit]").on("click",function(event) {

    event.preventDefault();

    var form = $(this).parents('form');
    var nameField = form.find("input[name=username]");
    var name = nameField.val();
    var index = name.indexOf('@');
    if (index !== -1){
        name = name.substring(0, index);
    }

    nameField.val(name.toLowerCase());

    form.submit();
});

/*
    Contact filter
*/

function contactFilter() {
    // Handle no filter condition
    if ($('#checkAll').hasClass('active')) {
        $("table.basic-table > tbody").each(function() {
            var personId = $(this).parents(".nameCard").attr("id");
            $('tr[data-target=#' + personId + ']').removeClass('filterHidden');
        });
        return;
    }

    // Handle filter conditions
    var field = $("input:checked");

    var dict = {
        sex : {
            male : '男',
            female : '女',
            unknown : ''
        },
        grade : {
            one : '大一',
            two : '大二',
            three : '大三',
            four : '大四',
            master : '研究生',
            work : '工作',
            unknown : ''
        },
        group : {
            TG : 'TG',
            OG : 'OG',
            CG : 'CG',
            PG : 'PG',
            unknown : ''
        },
        campus : {
            zijingang : '紫金港',
            yuquan : '玉泉',
            xixi : '西溪',
            huajiachi : '华家池',
            zhijiang : '之江',
            unknown : ''
        }
    };

    var selected = {};
    var type;
    var flag = false;
    var personId;
    var properties = ["sex", "grade", "group", "campus"];
    var property;

    for (var index in properties) {
        property = properties[index];
        selected[property] = [];
    }

    //Insert property to array
    field.each(function() {
        type = $(this).parents(".filterbox").attr("id");
        selected[type].push($(this).val());
    });

    // Examine each field. If the property doesn't match anything in any group, then hide it.

    $("table.basic-table > tbody").each(function() {
        //$(this) is someone's nameCard

        personId = $(this).parents(".nameCard").attr("id");

        var flag = properties.all(function(property) {
            var myProperty = $(this).find("td[name=" + property + "]").text();

            return selected[property].some(function(elem) {
                return elem === myProperty;
            });
        });

       //If not meet the filter, hide it
        if (!flag) {
            $("tr[data-target=#" + personId + "]").addClass('filterHidden');
        } else {
            $("tr[data-target=#" + personId + "]").removeClass('filterHidden');
        }

    });
}

$(":checkbox").on("click", function() {

    // Clear the searchBox first
    var searchBox = $("input[name=search]").val();
    if (searchBox) {
        $("input[name=search]").val("");
    }

    if ($('input:checkbox:not(:checked)').length === 0) {
      $('#checkAll').addClass('active');
    } else {
      $("#checkAll").removeClass("active");
    }

    contactFilter();
    color();
});


$("#checkAll").on("click", function() {
    $(this).addClass("active");
    $(":checkbox").each(function() {
        $(this).prop("checked", 'true');
    });

    contactFilter();
    color();
});

/*
    Search box
*/

// $("input[name=search]").keyup(function() {
//     if (event.keyCode == 13) {
//         $("button[name=searchSubmit]").click();
//     }
// });

$("input[name=search]").keyup(function() {
    var keyword = $("input[name=search]").val();
    var keyReg = new RegExp(keyword, "i");

    $("table.main-table > tbody > tr").each(function() {
        var flag = $(this).children().some(function(elem) {
            return keyReg.test($(elem).text());
        });
        if (!flag) {
            $(this).addClass('hidden');
        } else {
            $(this).removeClass('hidden');
        }
    });

    color();
});

/*
    Name tooltip
*/

$(".author").tooltip();

/*
    Changebox
*/

function changeBox(ObjectId) {

    var properties = ["sid", "sex", "major", "grade", "campus", "enrollTime", "group", "nickname", "longNumber", "shortNumber", "email", "qq"];

    var myProperty = $("#" + ObjectId);
    var changeBox = $("#changeBox");

    changeBox.find("input[name=_id]").val(ObjectId);
    changeBox.find(".modal-title").text(myProperty.find(".modal-title").text());
    properties.forEach(function(property) {
        changeBox.find("[name=" + property + "]").val(myProperty.find("td[name=" + property + "]").text());
    });

    changeBox.modal('toggle');
}

$("button[name=update]").on("click", function() {
    $("#changeBox form").submit();
});

/*
    Handle first login
*/

function firstLogin () {
    changeBox($("#flag").text());
}

/*
    Namecard Change
*/

$(".nameCard button[name=change]").on('click', function(){
    $(this).parents(".nameCard").modal("hide");
    var ObjectId = $(this).attr("data-id");
    var foo = function() {changeBox(ObjectId);};
    setTimeout(foo, 600);
});

/*
    Export
*/

$("#csv, #xlsx, #xls").on("click", function() {
    // console.log("hello");
    var form = $("form#export");
    var index = 0;
    var str = '<input name = "type" value = "' + $(this).attr("id") + '">';
    form.append(str);
    // console.log(form);
    // console.log($(this).attr("id"));
    $(".main-table tbody tr").each( function() {
        if (!($(this).hasClass("hidden") || $(this).hasClass("filterHidden"))) {
            var objectId = $(this).attr("data-id");
            var str = '<input name = "' + index + '" value = "' + objectId + '">';
            index++;
            form.append(str);
        }
    });
    form.submit();
    form.find("input").remove();
});

// Only visiable in main page
$("#main #navExport").removeClass("hidden");

/*
    Init
*/

$(document).ready(function() {
    contactFilter();
    color();
    firstLogin();
});
