/* jshint jquery: true, browser: true */
var DOMGenerator = function(item) {
  var ax = $("<div />", {
    id : item._id,
    class : (item.sex == "男" ) ? "maleNameWrap" : "femaleNameWrap"
  });
  var nameTag = $("<div />", { class: "nameTag", text: item.name });
  var leftInfo = $("<div class=leftInfo />").prepend([
    $("<div />").prepend([
      $("<span  />", {class: 'listTag', text: "性别"}),
      $("<span />", {text: item.sex})
    ]),
    $("<div />").prepend([
      $("<span />", {class: 'listTag', text: "常用ID"}),
      $("<span />", {text: item.id})
    ]),
    $("<div />").prepend([
      $("<span />", {class: 'listTag', text: "联系方式"}),
      $("<span />", {text: item.contact})
    ]),
    $("<div />").prepend([
      $("<span />", {class: 'listTag', text: "SNS"}),
      $("<span />", {text: "SNS"})
    ])
  ]);
  var rightInfo = $("<div class=rightInfo />").prepend([
    $("<div />").prepend([
      $("<span />", {class: 'listTag', text: "专业"}),
      $("<span />", {text: item.major})
    ]),
    $("<div />").prepend([
      $("<span />", {class: 'listTag', text: "校区"}),
      $("<span />", {text: "校区"})
    ]),
    $("<div />").prepend([
      $("<span />", {class: 'listTag', text: "QQ"}),
      $("<span />", {text: item.QQ})
    ]),
    $("<div />").prepend([
      $("<span />", {class: 'listTag', text: "邮箱"}),
      $("<span />", {text: "email"})
    ])
  ]);
  var group = $("<div />", {
    text: item.group,
    class: (item.sex == "男") ? "maleGroup" : "femaleGroup"
  });

  ax.prepend([nameTag, leftInfo, rightInfo, group]);

  $("body").append(ax);
};

var listContacts = function( contacts ) {
  contacts.forEach(DOMGenerator);
};

$(document).ready(function() {
  var c;
  $.getJSON("/api/list", function(data) {
    listContacts(data);
    c = data;
  });
  $("input.search").keyup(function() {
    if( $(this).val() !== null ) {

      var reg = new RegExp($(this).val(),'i');
      var result = $.grep(c, function(item) {
        var str = JSON.stringify(item).replace(/\"/g, '');
        return str.match(reg);
      });
      var result_id = Array();
      console.log(typeof result_id);
      result.forEach(function(item) { result_id.push(item._id); });
      console.log(typeof result_id);
      $(".maleNameWrap, .femaleNameWrap").each( function() {
        if ( result_id.indexOf( $(this).attr('id') ) != -1 ) $(this).slideDown();
        else $(this).slideUp();
      });

    } else $(".maleNameWrap, .femaleNameWrap").each( function() {
        $(this).slideDown();
      });
  });
});
