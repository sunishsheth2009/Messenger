var ajaxURL = "http://www.jgog.in/jIM/ajax";

$("#home").bind("pagecreate", function ()
{
  if (!sessionStorage.id || sessionStorage.id=="") 
  {
  	setLogin();
  }
  if (sessionStorage.id>0) getMessages();
  
  $(this).find("div:jqmData(role=header) a#refresh").bind("click", function(event)
  {
    getConnected();
  });
});

$("#chats").bind("pagecreate", function ()
{
	getMessages();
	if (!sessionStorage.id) setLogin();
	
  $(this).find("div:jqmData(role='header') a#home")
            .bind("click", function (event)
  {
    $.mobile.changePage($("#home"), { transition: "flow" });
  });
  
  $(this).find("div:jqmData(role='header') a#clear").bind("click", function (event)
  {
    var $content = $("#chats div:jqmData(role='content')");
    var $ul = $content.find("ul");
    $ul.html("");
  });
});

$("#login, #msg").bind("dialogcreate", function()
{
  $(this).find("div:jqmData(role=header) a").hide();
});

function setLogin()
{
  $.mobile.changePage($("#login"), { transition: "flow" });
  $("#login a.ok").bind("click", function (event)
  {
    var login = $("#login input").val();
    login = $.trim(login);
    if(login)
    {
    
		
$.getJSON(ajaxURL+'/set_login.php?login='+login+'&callback=?', 
		function(data){
			sessionStorage.id = data.id;
			$.mobile.changePage($("#home"));
			getMessages();
			getConnected();
		});
    }
  });
}

function getConnected()
{
  var $content = $("#home div:jqmData(role=content)");
  $content.html("");
	$.getJSON(ajaxURL+'/get_connected.php?id='+sessionStorage.id+'&callback=?', 
		function(data){
				var $members = data.members;
				console.log(data.members.length);
				if($members.length == 0) 
				$content.append("<p class=info> Nobody connected! </p>");
		       else 
		      {
		        $content.append ("<p class=info1> Connected members </p>");
		        $content.append ("<ul></ul>");
		        var $ul = $content.find("ul");
		        $.each(data.members, function(i,item){
		          var id = item.id;
		          var login = item.login;
		          $ul.append("<li id=\""+id+"\"><a>" + login + "</a></li>");
		          var $li = $ul.find("li").last ();
		          $li.bind("vclick", function (event)
		          {
		            prepareMessage (id, login);
		          });
		        });
		        $ul.listview();
		      }

		});
}

function prepareMessage(id, login)
{
  $("#msg div:jqmData(role=header) h1").text(login);
  $("#msg input").val("");
  $.mobile.changePage ($("#msg"), { transition: "pop" });
  console.log(login);
  $("#msg div:jqmData(role=content) a.ok").unbind().bind("click", function (event)
  {
    var txt = $("#msg input").val ();
    txt = $.trim (txt);
    if (!txt) $("#msg").dialog("close");
    else sendMessage (txt, id, login);
  });
}

function sendMessage(txt, id, login)
{
	$.ajax(
	{ 
    url : ajaxURL+"/send_message.php", 
    data : { from : sessionStorage.id, to : id, txt : txt }
    }); 
  
  $.mobile.changePage ($("#chats"));
  
  var $content = $("#chats div:jqmData(role=content)");
  var $ul = $content.find ("ul");
  var html = "";
  html += "<li>";
  html +=   "<a>";
  html +=     "<img src=images/send.png />";
  html +=     "<h1>" + login + "</h1>";
  html +=     "<p>" + txt + "</p>";
  html +=   "</a>";
  html += "</li>";
  $ul.prepend (html);
  $ul.listview ("refresh");
  
  var $li = $ul.find ("li").first();
  $li.bind ("vclick", function (event)
  {
  console.log(login);
    prepareMessage (id, login);
  });
    
}


function getMessages()
{
  var $content = $("#chats div:jqmData(role=content)");
  var $ul = $content.find("ul");
  jsonMessages($ul);
  setInterval(function(){jsonMessages($ul)}, 5000);
}


function jsonMessages($ul){
	
	var request = $.ajax({		
	  url: ajaxURL+"/get_messages.php?to="+sessionStorage.id+'&callback=?',
	  dataType: "jsonp"
	});
	
	request.done(function(data) { 
		var $messages = data.messages;
			if ($messages.length)
		      {
		          if ($.mobile.activePage.attr ("id") != "msg") 
		            $.mobile.changePage ($("#chats"));
		          
		          $.each($messages, function(i,$message){
		            var id = $message.from_id;
		            var login = $message.from;
		            var txt = $message.txt;
		            
		            var html = "";
		            html += "<li>";
		            html +=   "<a>";
		            html +=     "<img src=images/receive.png />";
		            html +=     "<h1>" + login + "</h1>";
		            html +=     "<p>" + txt + "</p>";
		            html +=   "</a>";
		            html += "</li>";
		            $ul.prepend (html);
		            $ul.listview ("refresh");
		            
		            var $li = $ul.find ("li").first ();
		            $li.bind ("vclick", function (event)
		            {
		              prepareMessage (id, login);
		            }); // .bind
		          }); // .each
		    } //if
		    else
		    {
			    
		    }
	});
	
	request.fail(function(data) { 
		console.log(data);
		alert("Failed to get messages!"); 	
	});
	
}
