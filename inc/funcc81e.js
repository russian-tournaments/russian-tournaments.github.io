function sform(name) {
    var rid = $('form[name='+name+']').attr('action');
    block($('form[name='+name+']'),0.4);
    $.ajax({type:'POST',data:{rid:rid,ajax:name,data:form_data(name)}}).done(function(txt) {
		block($('form[name='+name+']'),1.0);
		var data = jQuery.parseJSON(txt);
		if (data && form_error(name,data.err)) {
    		$('html, body').animate({
                scrollTop: $('#ferr').offset().top - 100
            }, 500);
    		return false;
		}
		if (data.callback) return window[data.callback](data);
		else if (data.url) window.location.href = data.url;
		else if (data.wms) wms('',data.wms);
		else wmsc();
	});
}
function form_data(name) {
    var data = {};
    var n = 0;
    var k = '';
    var v = '';
    $('form[name='+name+'] .input').each(function(){
        n = $(this).attr('rel')-0;
        k = $(this).attr('name');
        if ($(this).prop('type') == 'checkbox') {
            v = ($(this).prop('checked') ? $(this).val() : 0);
            if (!v) return;
        }
        else if ($(this).prop('type') == 'radio') {
            v = ($(this).prop('checked') ? $(this).val() : 0);
            if (!v) return;
        }
        else {
            if ($(this).hasClass('tiny')) {
                v = tinyMCE.get(k).getContent()
            }
            else {
                v = $(this).val();
            }
        }
        if (n > 0) {
            if (!data[n]) data[n] = {};
            if (data[n][k]) {
                if (typeof data[n][k] == 'string') data[n][k] = [data[n][k]];
                data[n][k].push(v);
            }
            else {
                data[n][k] = v;    
            }
        }
        else {
            if (data[k]) {
                if (typeof data[k] == 'string') data[k] = [data[k]];
                data[k].push(v);
            }
            else {
                data[k] = v;    
            }
        }
    });
    if ($('#captcha').html()) {
        data['captcha'] = grecaptcha.getResponse();
    }
    return data;
}
function form_error(name, err) {
    $('form[name='+name+'] div').removeClass('has-error');
    $('form[name='+name+']').find('p.help-block').remove();
    if (!err) return false;
    var j = 0;
    for(var i in err) {
        $('form[name='+name+'] div[rel="'+i+'"]').addClass('has-error').append('<p'+(j==0 ? ' id="ferr"' : '')+' class="help-block">'+err[i]+'</p>');
        $('form[name='+name+'] div[rel="'+i+'"] .input').shake();
        j = 1;
    }
    return true;
}
function block(e, k) {
    $(e).css('opacity',k);
}

function nst() {
    return false;
} 

function wms(title, text) {
    var txt = '';
    if (title != '') txt += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title">'+(title != '' ? title : 'game-tournaments.com')+'</h4></div>';
    txt += '<div class="modal-body">'+text+'</div>';
    $('#wms .modal-content').html(txt);
    $('#wms').modal();
}
function wmsc() {
    $('#wms .modal-content').html('');
    $('#wms').modal('hide');
}

function tips() {
    $('.odtip').tooltip();
}

function forecasts_pages(id,game_id,s) {
    $.ajax({type:'POST',data:{rid:'bets',ajax:'block_forecasts',data:{'id':id,'game_id':game_id,'s':s}}}).done(function(txt){
        $('#block_forecasts').html(txt);
        $('.oop').click(function() {
            $(this).siblings('.openme').toggleClass('meopen');
            $(this).toggleClass('active');
        });
        $('.btxt').on('contextmenu', function(e){
            e.preventDefault();
        });
    });
}
function subscribe(id,mid) {
    $.ajax({type:'POST',data:{rid:'bets',ajax:'subscribe',data:{'id':id,'mid':mid}}}).done(function(txt){
        var data = jQuery.parseJSON(txt);
        if (data.err) {
            if (mid) $('#frc'+id).html(data.err);
            else $('#data_end').html(data.err);
        }
        else {
            if (mid) {
                if (data.team && data.team != '//') {
                    data.team = '<span class="userbet"><b>'+data.team+'</b></span>';
                    $('#frct'+id).html(data.team);
                }
                $('#frc'+id).html(data.txt);
            }
            else $('#data_end').html(data.txt);
        }
    });
}

function my_bet_p(id,k) {
    $('form[name="my_bet_add"] input[name="k"]').val(k);
    $('form[name="my_bet_add"] input[name="team"]').val(id);
    $('#tid_name').html($('#t'+id).html());
}
function my_bet_add(data) {
    $('#matches tr[rel='+data.mid+'] span.teamname').removeClass('userbet');
    $('#matches tr[rel='+data.mid+'] span.teamname[rel='+data.team+']').addClass('userbet');
    wmsc();
}
function my_bet_del(mid) {
    $.ajax({type:'POST',data:{rid:'bets',ajax:'my_bet_del',data:{'mid':mid}}}).done(function(txt){
        if (txt) form_error('my_bet_add', {'bet':txt});
        else {
            $('#matches tr[rel='+mid+'] span.teamname').removeClass('userbet');
            wmsc();
        }
    });
}

function comments(data) {
    if ($('#comments .nomsg')) $('#comments .nomsg').remove();
    for(i in data.data) {
        var txt = '<li>';
        txt += '<div class="com-b">';
        txt += '<span class="uavatar"><img src="/media/user/_60/'+(data.data[i].logo ? data.data[i].logo : 'no.jpg')+'" class="img-circle"></span>';
        txt += '<div class="com-bc">';
        txt += '<div class="com-autor"><b>'+data.data[i].nick+'</b> • <time>'+data.data[i].data+'</time></div>';
        txt += '<div class="com-body">'+data.data[i].txt+'</div>';
        txt += '</div></div></li>';
        $('#comments').append(txt);
    }
    $('form[name=comment] textarea').val('');
}

function predictions(type,title) {
    if ($('#filter_current').length) {
        $('#filter_current input[name=type]').val(type);
        var s = $('#filter_current input[name=s]').val();
        match_pages('current',s);
    }
    if ($('#filter_past').length) {
        $('#filter_past input[name=type]').val(type);
        var s = $('#filter_past input[name=s]').val();
        match_pages('past',s);
    }
    $('#matches span[rel=bet_title]').html(title);
}
function score(mid,e) {
    $.ajax({type:'POST',data:{rid:'match',ajax:'score',data:{'mid':mid}}}).done(function(txt){
        $(e).html(txt).addClass('rshow');
    });
    return false;
}
function show_score(e,val) {
    if (val) {
        var txt = $(e).attr('data-score');
        $(e).addClass('rshow');
    }
    else {
        var txt = $(e).attr('data-txt');
        $(e).removeClass('rshow');
    }
    var time = $(e).attr('data-time');
    $(e).html(txt);
    if (time != '') {
        var mid = $(e).attr('data-mid');
        $('#live_time_'+mid).html('<b></b> '+time);
    }
    return false;
}
function scores(id,val) {
    $('#filter_'+id+' input[name=score]').val((val ? 1 : 0));
    var s = $('#filter_'+id+' input[name=s]').val();
    match_pages(id,s);
}
function show_scores(id,val) {
    $('#filter_'+id+' input[name=score]').val((val ? 1 : 0));
    var s = $('#filter_'+id+' input[name=s]').val();
    $('#block_matches_'+id+' span.tresult').each(function(){
        show_score(this,val);
    });
}

function stream_lang(lang) {
    $('#langs a').removeClass('active');
    $('#langs a[rel='+lang+']').addClass('active');
    index_stream(lang);
}
function stream_lang_new(lang, title) {
    $('#langs a').removeClass('active');
    $('#langs a[rel='+lang+']').addClass('active');
    $('#current_stream_lang').html(title);
    index_stream(lang);
}
function index_stream(lang) {
    var id = $('#srteamslider').attr('rel');
    if (!lang) var lang = $('#langs a.active').attr('rel');
    $.ajax({type:'POST',data:{rid:'match',ajax:'block_stream',data:{'id':id,'lang':lang,'sig_stream':sig_stream}}}).done(function(txt){
        var data = jQuery.parseJSON(txt);
        var txt = '';
        if (data.stream != null) {
	        for(var i in data.stream) {
	            txt += '<li rel="'+data.stream[i].site+'" data-original-title="'+data.stream[i].eng+'" data-original-sub="'+data.stream[i].sub+'" data-sid="'+data.stream[i].id+'" data-id="'+data.stream[i].mid+'" class="odtip streamselect'+(data.stream[i].live > 0 ? ' livebut' : '')+'"'+(lang && lang != data.stream[i].lang ? ' style="display:none"' : '')+'><div class="streamli">';
	            txt += '<div class="spic"><div class="slang">'+data.stream[i].lang+'</div><div class="speople">'+data.stream[i].viewers+'</div><img class="simg" src="'+data.stream[i].logo+'"></div>';
	            txt += '<div class="sinfo"><u>'+data.stream[i].title+'</u></div>';
	            txt += '</div><div class="sich"><input type="checkbox"></div></li>';
	        }
	        $('#index_stream').html(txt);
	        stream_current();
        }
        sig_stream = data.sig_stream;
        
        /*txt = '';
        var kol = 0;
        for(var i in data.stream) {
            kol = ($('#kol-stream'+data.stream[i].id).length ? $('#kol-stream'+data.stream[i].id).html() : 0);
            txt += '<li><div class="r_act"><span class="badge" id="kol-stream'+data.stream[i].id+'">'+kol+'</span></div><a href="javascript:;" onclick="chat_select(\'stream\','+data.stream[i].id+',\''+data.stream[i].title+'\')"><i class="fa fa-fw fa-comments-o"></i> '+data.stream[i].title+'</a></li>';
        }
        $('#chat_rooms').html(txt);*/
        
        /*txt_self = '';
        txt_invite = '';
        if (data.chat.length > 0) {
            var kol = 0;
            for(var i in data.chat) {
                kol = ($('#kol-room'+data.chat[i].id).length ? $('#kol-room'+data.chat[i].id).html() : 0);
                if (data.chat[i].is_accept == 1) txt_self += '<li id="cr'+data.chat[i].id+'"><div class="r_act"><span class="badge" id="kol-room'+data.chat[i].id+'">'+kol+'</span> <a class="badge" href="javascript:;" onclick="chat_join('+data.chat[i].id+',0)"><i class="fa fa-minus"></i></a></div><a href="javascript:;" onclick="chat_select(\'room\','+data.chat[i].id+',\''+data.chat[i].title+'\')"><i class="fa fa-fw fa-comments-o"></i> '+data.chat[i].title+'</a></li>';
                else txt_invite += '<li id="cr'+data.chat[i].id+'"><div class="r_act"><a class="badge" href="javascript:;" onclick="chat_join('+data.chat[i].id+',1)"><i class="fa fa-plus"></i></a> <a class="badge" href="javascript:;" onclick="chat_join('+data.chat[i].id+',0)"><i class="fa fa-minus"></i></a></div><a href="javascript:;" onclick="chat_select(\'room\','+data.chat[i].id+',\''+data.chat[i].title+'\')"><i class="fa fa-fw fa-comments-o"></i> '+data.chat[i].title+'</a></li>';
            }
        }
        if (txt_self) {
            $('#chat_self ul').html(txt_self);
            $('#chat_self').show();
        }
        else {
            $('#chat_self ul').html('');
            $('#chat_self').hide();
        }
        if (txt_invite) {
            $('#chat_invite ul').html(txt_invite);
            $('#chat_invite').show();
        }
        else {
            $('#chat_invite ul').html('');
            $('#chat_invite').hide();
        }*/
        
        tips();
    });
}
function stream_current() {
    $('#mainstream [rel=stream]').each(function(){
        var main = $(this).attr('title');
        var site = $(this).attr('site');
        console.log('current',main);
        //console.log('chat',chat_id);
        $('#index_stream li[rel='+site+'][data-original-title='+main+']').addClass('active');
        $('#index_stream li[rel='+site+'][data-original-title='+main+'] input').prop('checked',true);
        if (socket && socket.readyState == 1) {
            var mid = $('#index_stream li[rel='+site+'][data-original-title='+main+']').attr('data-id')-0;
            if (mid != match_id) {
                set_match(mid);
                match_id = mid;
            }
        }
    });
}

function mfilter(f,eng) {
    $('#filter input').each(function(){
        if ($(this).attr('name') == f) {
            $(this).val(eng);
        }
    });
    $('#filter').submit();
}

var page_match = 0;
var i_stream = '';
function startsocket() {
    var host = 'ws://95.85.36.52:8000/';
    try {
		socket = new WebSocket(host);
		//console.log('start',socket);
		socket.onmessage = function(msg) { 
            if (msg.data) {
                var data = jQuery.parseJSON(msg.data);
                if (data.sys) console.log(data.sys.key,data.sys.val);
                if (!page_match && data.stream != undefined) {
	            	console.log('sstreams', data.stream);
	            	var lang = $('#langs a.active').attr('rel');
	            	var txt = '';
	            	for(var i in data.stream) {
			            txt += '<li rel="'+data.stream[i].site+'" data-original-title="'+data.stream[i].eng+'" data-original-sub="'+data.stream[i].sub+'" data-sid="'+data.stream[i].id+'" data-id="'+data.stream[i].mid+'" class="odtip streamselect'+(data.stream[i].live > 0 ? ' livebut' : '')+'"'+(lang && lang != data.stream[i].lang ? ' style="display:none"' : '')+'><div class="streamli">';
			            txt += '<div class="spic"><div class="slang">'+data.stream[i].lang+'</div><div class="speople">'+data.stream[i].viewers+'</div><img class="simg" src="'+data.stream[i].logo+'"></div>';
			            txt += '<div class="sinfo"><u>'+data.stream[i].status+'</u></div>';
			            txt += '</div><div class="sich"><input type="checkbox"></div></li>';
			        }
			        $('#index_stream').html(txt);
			        stream_current();
			    }
                if (data.live != undefined) {
                    matches = data.live;
                }
                if (data.stat != undefined) {
                    match_stat(data.stat);
                }
                /*if (data.chat) {
                    match_chat(data.chat);
                }
                if (data.user_list) {
                    chat_users_list(data.user_list);
                }*/
                ttips();
            }
        };
        socket.onopen = function(msg) { 
            console.log('open',msg);
            socket.send('{"game_id":"'+game_id+'"}');
            if (match_id > 0) set_match(match_id);
            if (!page_match && i_stream) clearInterval(i_stream);
            socket.send('{"mid":"'+match_id+'"}');//,"chat":"'+chat_id+'","user_id":"'+user_id+'","user_nick":"'+user_nick+'","user_color":"'+user_color+'"
        };
        socket.onclose = function(){
            console.log('close','close');
            match_id = 0;
            setTimeout(function(){startsocket()}, 5000);
            if (!i_stream) i_stream = setInterval(index_stream, 60000);
        };
    }
	catch(ex) {}
}

function mtime() {
    $('#matches span[rel=mtime]').each(function(){
        var a = new Date(($(this).attr('time')-0+tz)*1000);
        var time = ('0' + a.getUTCDate()).slice(-2) + ' ' + months[a.getUTCMonth()] + ', ' + ('0' + a.getUTCHours()).slice(-2) + ':' + ('0' + a.getUTCMinutes()).slice(-2);
        $(this).html(time);
    });
}

$(document).ready(function() {
	
	if ($('#wms .modal-content').html() != '') {
        wms('', $('#wms .modal-content').html());
    }
    
    $('#cliker').click(function(){
        if ($('#srteamslider').is(':visible')) $('#srteamslider').hide();
        else $('#srteamslider').show();
    });

	tips();
	
	$('#menu-toggle').click(function() {
		$('#wrapper').toggleClass('toggled');
		$(this).toggleClass('active');
	});
	
	$('.mob-sub-opener').click(function() {
		$(this).toggleClass('active');
		$(this).siblings('ul.sidebar-sub-nav').toggleClass('showit');
	});
	
	if ($('#srteamslider').length) {
        stream_current();
        $('#stream-toggle').click(function() {
    		$('#srteamslider').toggleClass('toggled_stream');
    		$(this).toggleClass('active');
    	});
    	i_stream = setInterval(index_stream, 60000);
        $('#index_stream').on('click', '.streamli', function(event) {
            var eng = $(this).parent().attr('data-original-title');
            var sub = $(this).parent().attr('data-original-sub');
            var site = $(this).parent().attr('rel');
            var url = '';
            $('#index_stream input:checked').each(function(){
        		$(this).prop('checked',false);
    		});
            $('#index_stream li.streamselect').removeClass('active');
    		$(this).parent().addClass('active');
    		$(this).parent().find('input').prop('checked',true);
    		if (site == 'dailymotion') url = 'http://www.dailymotion.com/embed/video/'+eng;
    		else if (site == 'hitbox') url = 'http://www.hitbox.tv/embed/'+eng;
    		else if (site == 'youtube') url = '//www.youtube.com/embed/'+sub;
    		else if (site == 'majorleaguegaming') url = 'http://www.majorleaguegaming.com/player/embed/'+eng;
    		else if (site == 'azubu') url = 'http://embed.azubu.tv/'+eng;
    		else if (site == 'dingit') url = 'http://www.dingit.tv/embed/'+eng;
    		else if (site == 'huomao') url = 'http://www.huomao.com/outplayer/index/'+eng;
    		else if (site == 'douyu') url = 'https://staticlive.douyucdn.cn/common/share/play.swf?room_id='+sub;
    		else url = 'http://player.twitch.tv/?channel='+eng;
    		//else $('#mainstream').html('<object rel="stream" title="'+eng+'" type="application/x-shockwave-flash" height="100%" width="100%" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+eng+'" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+eng+'&auto_play=true&start_volume=100" /></object>');
    		$('#mainstream').html('<iframe rel="stream" site="'+site+'" title="'+eng+'" allowfullscreen frameborder="0" width="100%" height="100%" src="'+url+'"></iframe>');
    		match_id = $(this).parent().attr('data-id')-0;
            set_match(match_id);
            /*chat_id = $(this).parent().attr('data-sid')-0;
            chat_last = 0;
            $('#chat').html('');*/
        	if (socket && socket.readyState == 1) {
                socket.send('{"mid":'+match_id+'}');//,"chat":'+chat_id+'
            }
        });
        $('#index_stream').on('click', '.streamselect input', function(event) {
            $('#index_stream li.streamselect').removeClass('active');
            var s = [];
    		var d = [];
    		var u = [];
    		var site_type = '';
    		$('#index_stream input:checked').each(function(){
        		site_type = $(this).parent().parent().attr('rel');
        		if (site_type == 'douyu' || site_type == 'youtube') s.push($(this).parent().parent().attr('data-original-sub'));
        		else s.push($(this).parent().parent().attr('data-original-title'));
        		u.push(site_type);
        		$(this).parent().parent().addClass('active');
    		});
    		$('#mainstream [rel=stream]').each(function(){
        		d.push($(this).attr('title'));
        	});
        	for(var i=0; i<d.length; i++) {
        	    if (s.indexOf(d[i]) == -1) {
            	    $('#mainstream [title='+d[i]+']').remove();
        	    }
            }
    		if (s.length > 1) {
        		if (s.length == 2) var r = 2;
                else var r = Math.ceil(s.length/2);
                var h = 100/r;
                for(var i=0; i<s.length; i++) {
            	    if ($('#mainstream [title='+s[i]+']').length) {
                        $('#mainstream [title='+s[i]+']').css({'height':h+'%','width':'49%'});
            	    }
        		    else {
                        var url = '';
                        if (u[i] == 'dailymotion') url = 'http://www.dailymotion.com/embed/video/'+s[i];
                        else if (u[i] == 'hitbox') url = 'http://www.hitbox.tv/embed/'+s[i];
                        else if (u[i] == 'youtube') url = '//www.youtube.com/embed/'+s[i];
                        else if (u[i] == 'majorleaguegaming') url = 'http://www.majorleaguegaming.com/player/embed/'+s[i];
                        else if (u[i] == 'azubu') url = 'http://embed.azubu.tv/'+s[i];
                        else if (u[i] == 'dingit') url = 'http://www.dingit.tv/embed/'+s[i];
                        else if (u[i] == 'huomao') url = 'http://www.huomao.com/outplayer/index/'+s[i];
                        else if (u[i] == 'douyu') url = 'https://staticlive.douyucdn.cn/common/share/play.swf?room_id='+s[i];
                        else url = 'http://player.twitch.tv/?channel='+s[i];
                        //else $('#mainstream').append('<object rel="stream" title="'+s[i]+'" type="application/x-shockwave-flash" height="'+h+'%" width="49%" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+s[i]+'" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+s[i]+'&auto_play=true&start_volume='+(i > 0 ? 0 : 100)+'" /></object>');
                        $('#mainstream').append('<iframe rel="stream" site="'+u[i]+'" title="'+s[i]+'" allowfullscreen frameborder="0" width="49%" height="'+h+'%" scrolling="no" src="'+url+'"></iframe>');
                    }
                }
            }
            else if (s.length > 0) {
                if ($('#mainstream [title='+s[0]+']').length) {
                    $('#mainstream [title='+s[0]+']').css({'height':'100%','width':'100%'});
                }
                else {
            	    var url = '';
            	    if (u[0] == 'dailymotion') url = 'http://www.dailymotion.com/embed/video/'+s[0];
            	    else if (u[0] == 'hitbox') url = 'http://www.hitbox.tv/embed/'+s[0];
                    else if (u[0] == 'youtube') url = '//www.youtube.com/embed/'+s[0];
                    else if (u[0] == 'majorleaguegaming') url = 'http://www.majorleaguegaming.com/player/embed/'+s[0];
                    else if (u[0] == 'azubu') url = 'http://embed.azubu.tv/'+s[0];
                    else if (u[0] == 'dingit') url = 'http://www.dingit.tv/embed/'+s[0];
                    else if (u[0] == 'huomao') url = 'http://www.huomao.com/outplayer/index/'+s[0];
                    else if (u[0] == 'douyu') url = 'https://staticlive.douyucdn.cn/common/share/play.swf?room_id='+s[0];
                    else url = 'http://player.twitch.tv/?channel='+s[0];
                    //else $('#mainstream').html('<object rel="stream" title="'+s[0]+'" type="application/x-shockwave-flash" height="100%" width="100%" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel='+s[0]+'" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel='+s[0]+'&auto_play=true&start_volume=100" /></object>');
                    $('#mainstream').html('<iframe rel="stream" site="'+u[0]+'" title="'+s[0]+'" allowfullscreen frameborder="0" width="100%" height="100%" scrolling="no" src="'+url+'"></iframe>');
                }
            }
            else {
                $('#mainstream').html('<div class="white_noize"><div class="nostream"><i class="fa fa-frown-o"></i></div></div>');
            }
        });
	}
    $.fn.shake = function () {
        var pos;
        return this.each(function () {
            pos = $(this).css('position');
            if (!pos || pos === 'static') {
                $(this).css('position', 'relative');
            }
            for (var x = 1; x <= 3; x++) {
                $(this).animate({left: -2}, 17).animate({left: 2}, 34).animate({left: 0}, 17);
            }
        });
    };
});