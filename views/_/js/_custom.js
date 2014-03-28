/*
    Init
*/

$(document).ready(function() {
    contactFilter();
    color();
    firstLogin();
});

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

$("#index form").on("submit",function() {
    var $nameField = $(this).find("input[name=username]");
    var $name = $nameField.val();
    var $index = $name.indexOf('@');
    if ($index !== -1){
        $name = $name.substring(0, $index);
        $nameField.val($name);
    }
});

/*
    Contact filter
*/

function contactFilter() {
    var field = $("input:checked");

    var dict = {
        sex : {
            male : '男',
            female : '女'
        },
        grade : {
            one : '大一',
            two : '大二',
            three : '大三',
            four : '大四',
            master : '研究生',
            work : '工作'
        },
        group : {
            TG : 'TG',
            OG : 'OG',
            CG : 'CG',
            PG : 'PG'
        },
        campus : {
            zijingang : '紫金港',
            yuquan : '玉泉',
            xixi : '西溪',
            huajiachi : '华家池',
            zhijiang : '之江'
        }
    }

    var selected = new Object();
    var type;
    var flag = false;
    var personId;
    var properties = Array("sex", "grade", "group", "campus");
    var property;

    for (index in properties) {
        property = properties[index];
        selected[property] = Array();
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

        for (pIndex in properties){
            flag = false;
            property = properties[pIndex];
            // console.log(property);

            // console.log($(this).find("td[name=" + property + "]").text());

            $(this).find("td[name=" + property + "]").each(function() {
                // console.log("hello");

                //Now you get the right cell, check if its value is selected

                for (var index = 0; index < selected[property].length; index++){
                    var value = selected[property][index];

                    // console.log(value);
                    // console.log(dict[property][value]);

                    if (dict[property][value] == $(this).text() || $(this).text() == ""){
                        flag = true;
                    }
                }
            });
            //If the whole group meet nothing, break out
            if (!flag){
                break;
            }
        }

        //If not meet the filter, hide it
        if (!flag){
            $("tr[data-target=#" + personId + "]").addClass('filterHidden');
        } else {
            $("tr[data-target=#" + personId + "]").removeClass('filterHidden');
        }

    });
}

$(":checkbox").on("click", function() {

    //Clear the searchBox first
    var searchBox = $("input[name=search]").val();
    if (searchBox) {
        $("input[name=search]").val("");
        $("button[name=searchSubmit]").click();
    }

    contactFilter();
    color();

    $("#checkAll").removeClass("active");
});


$("#checkAll").on("click", function() {
    // console.log("hello");
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

$("input[name=search]").keyup(function() {
    if (event.keyCode == 13) {
        $("button[name=searchSubmit]").click();
    }
});

$("button[name=searchSubmit]").on("click", function() {
    var keyword = $("input[name=search]").val();

    var flag = false;

    $("table.main-table > tbody > tr").each(function(index) {
        flag = false;
        $(this).children().each(function() {
            if ($(this).text().indexOf(keyword) != -1) {
                flag = true;
            }
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
    Handle first login
*/

function firstLogin () {
    $("#flag").each( function() {
        // console.log($(this).text());
        changeBox($(this).text());
    });
}

/*
    Changebox
*/

function changeBox( ObjectId ) {

    var person = new Array();
    var property;
    var properties = Array("sex", "major", "grade", "campus", "group", "nickname", "longNumber", "shortNumber", "email", "qq");

    $("#" + ObjectId).each( function() {
        // console.log("hello");
        // console.log($(this));
        person['name'] = $(this).find(".modal-title").text();
        for (var pIndex in properties) {
            // console.log(properties[property]);
            property = properties[pIndex];
            person[property] = $(this).find("td[name=" + property + "]").text();
        }
    });

    $("#changeBox").each( function() {
        // console.log(person);
        $(this).find("input[name=_id]").val(ObjectId);
        $(this).find(".modal-title").text(person['name']);
        for (var pIndex in properties) {
            // console.log(properties[property]);
            property = properties[pIndex];
            $(this).find("[name=" + property + "]").val(person[property]);
        }
        $(this).modal("show");
    });

}

$("button[name=update]").on("click", function() {
    console.log($("#changeBox form"));
    $("#changeBox form").submit();
});

/*
    Namecard Change
*/

$(".nameCard button[name=change]").on("click", function() {
    var ObjectId = $(this).attr("data-id");
    $(this).parents(".nameCard").modal("hide");
    changeBox(ObjectId);
});

/*
    Export
*/

$("#csv, #xlsx").on("click", function() {
    console.log("hello");
    var form = $("form#export");
    var index = 0;
    var str = '<input name = "type" value = "' + $(this).attr("id") + '">';
    form.append(str);
    // console.log(form);
    // console.log($(this).attr("id"));
    $(".main-table tbody tr").each( function() {
        var objectId = $(this).attr("data-id");
        var str = '<input name = "' + index + '" value = "' + objectId + '">';
        form.append(str);
    });
    form.submit();
});

