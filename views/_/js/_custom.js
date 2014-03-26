/*
    Init
*/

$(document).ready(function() {
    contactFilter();
    color();
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

$("form").on("submit",function() {
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
            huajiachi : '华家池'
        }
    }

    selected = new Object();
    var type;


    //Establish arrays
    field.each(function() {
        // console.log($(this).val());
        type = $(this).parents(".filterbox").attr("id");
        // console.log(type);
        selected[type] = Array();
    });

    //Insert property to array
    field.each(function() {
        type = $(this).parents(".filterbox").attr("id");
        selected[type].push($(this).val());
    });

    var flag = false;
    var personId;
    var properties = Array("sex", "grade", "group", "campus");
    var property;

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
                    value = selected[property][index];

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