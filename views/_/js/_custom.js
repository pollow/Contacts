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