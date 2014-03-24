/*
    Color main-table
*/

function color() {
    var count = 0;
    $(".main-table > tbody > tr").each(function() {
        $(this).removeClass('strip');
        if (!$(this).hasClass("hidden")) {
            console.log(count);
            if (count++ % 2) {
                $(this).addClass('strip');
            }
        }
    });
}

$(document).ready(function() {
    color();
});

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
/*
$(":checkbox").on("click", function() {
    var $field = $("input:checked");
    var $filterArr = new Array();
    $field.each(function(){
        //alert($(this).val());
        $filterArr.push($(this).val());
    });
    for(var index = 0; index < $filterArr.length; index++){
        
    }
});
*/

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
    // console.log(keyword);

    var flag = false;

    $("table.main-table > tbody > tr").each(function(index) {
        flag = false;
        $(this).children().each(function() {

            // console.log($(this).text());
            // console.log($(this).text().indexOf(keyword));
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