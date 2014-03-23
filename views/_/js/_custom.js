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