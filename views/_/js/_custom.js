/*
    Active nav list
*/

$("#main").each( function () {
    $(".navbar-nav #list-main").addClass("active");
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

        for (var pIndex in properties){
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

                    if (dict[property][value] === $(this).text() || $(this).text() === ""){
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

// $("input[name=search]").keyup(function() {
//     if (event.keyCode == 13) {
//         $("button[name=searchSubmit]").click();
//     }
// });

$("input[name=search]").keyup(function() {
    var keyword = $("input[name=search]").val();
    var keyReg = new RegExp(keyword, "i");
    var flag = false;

    $("table.main-table > tbody > tr").each(function() {
        flag = false;
        $(this).children().each(function() {
            if (keyReg.test($(this).text())) {
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
    Changebox
*/

function changeBox( ObjectId ) {

    var person = [];
    var property;
    var properties = ["sid", "sex", "major", "grade", "campus", "enrollTime", "group", "nickname", "longNumber", "shortNumber", "email", "qq"];

    $("#" + ObjectId).each( function() {
        // console.log("hello");
        // console.log($(this));
        person.name = $(this).find(".modal-title").text();
        for (var pIndex in properties) {
            // console.log(properties[property]);
            property = properties[pIndex];
            person[property] = $(this).find("td[name=" + property + "]").text();
        }
    });

    $("#changeBox").each( function() {
        // console.log(person);
        $(this).find("input[name=_id]").val(ObjectId);
        $(this).find(".modal-title").text(person.name);
        for (var pIndex in properties) {
            // console.log(properties[property]);
            property = properties[pIndex];
            $(this).find("[name=" + property + "]").val(person[property]);
        }
        $(this).modal('toggle');
    });

}

$("button[name=update]").on("click", function() {
    $("#changeBox form").submit();
});

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
    Namecard Change
*/

$(".nameCard button[name=change]").on('click', function(){
    $(this).parents(".nameCard").modal("hide");
    var ObjectId = $(this).attr("data-id");
    /*function callChangeBox() {
        changeBox(ObjectId);
    }
    setTimeout("callChangeBox()", 500);*/
    var foo = function() {changeBox(ObjectId);};
    setTimeout(foo, 600);
});

/*
$(".nameCard button[name=change]").on("click", function() {
    var ObjectId = $(this).attr("data-id");
    // $(this).parents(".nameCard").modal("hide");
    $(this).parents(".nameCard").find("button[name=close]").click( function () {
        // changeBox(ObjectId);
    });
    $(this).parents(".nameCard").find("button[name=close]").on("click", function() {
        changeBox(ObjectId);
    })

    // changeBox(ObjectId);
});
*/

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

//Only visiable in main page
$("#main").each( function() {
    $("#navExport").removeClass("hidden");
} );

/*
    Init
*/

$(document).ready(function() {
    contactFilter();
    color();
    firstLogin();
});