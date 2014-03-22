/*
    Remove the '@' in the username
*/$("form").on("submit",function(){var e=$(this).find("input[name=username]"),t=e.val(),n=t.indexOf("@");if(n!==-1){t=t.substring(0,n);e.val(t)}});