function match_pages(id,s) {
    if (s == 0) s = $('#filter_'+id+' input[name=s]').val();
    else $('#filter_'+id+' input[name=s]').val(s);
    var f = 'block_matches_'+id;
    var data = {'s':s};
    if ($('#filter').length) {
        $('#filter input').each(function(){
            if ($(this).val()) {
                var n = $(this).attr('name');
                if (n) data[n] = $(this).val();
            }
        });
    }
    $('#filter_'+id+' input').each(function(){
        if ($(this).val()) {
            var n = $(this).attr('name');
            if (n) {
                data[n] = $(this).val();
            }
        }
    });
    $.ajax({type:'POST',data:{rid:'hearthstone',ajax:f,data:data}}).done(function(txt){
        $('#'+f).html(txt);
        tips();
        mtime();
    });
}
function match_upd() {
    if ($('#block_matches_current').length) match_pages('current',0);
    if ($('#block_matches_past').length) match_pages('past',0);
}

$(document).ready(function() {
    $('.tournament').on('keyup', function(){
        block($('#tournament'),0.4);
        $.ajax({type:'POST',data:{rid:'match',ajax:'tournament',data:{'game_id':755,'title':$(this).val()}}}).done(function(txt){
            var data = jQuery.parseJSON(txt);
            $('#tournament').addClass('open');
            $('#tournament ul').html('');
            if (data.length == 0) $('#tournament ul').append('<li class="dropdown-header">Подходящих турниров не найдено</li>');
            else {
                $('#tournament ul').append('<li class="dropdown-header">Выбери турнир</li>');
                for(var i in data) {
                    $('#tournament ul').append('<li><a href="javascript:;" onClick="mfilter(\'tid\','+i+');">'+data[i]+'</a></li>');
                }
            }
            block($('#tournament'),1.0);
        });
    });
    $('.team').on('keyup', function(){
        block($('#team'),0.4);
        $.ajax({type:'POST',data:{rid:'match',ajax:'team',data:{'game_id':755,'title':$(this).val()}}}).done(function(txt){
            var data = jQuery.parseJSON(txt);
            $('#team').addClass('open');
            $('#team ul').html('');
            if (data.length == 0) $('#team ul').append('<li class="dropdown-header">Подходящих команд не найдено</li>');
            else {
                $('#team ul').append('<li class="dropdown-header">Выбери команду</li>');
                for(var i in data) {
                    $('#team ul').append('<li><a href="javascript:;" onClick="mfilter(\'team\','+i+');">'+data[i]+'</a></li>');
                }
            }
            block($('#team'),1.0);
        });
    });
    $('.player').on('keyup', function(){
        block($('#player'),0.4);
        $.ajax({type:'POST',data:{rid:'match',ajax:'player',data:{'game_id':755,'title':$(this).val()}}}).done(function(txt){
            var data = jQuery.parseJSON(txt);
            $('#player').addClass('open');
            $('#player ul').html('');
            if (data.length == 0) $('#player ul').append('<li class="dropdown-header">Подходящих игроков не найдено</li>');
            else {
                $('#player ul').append('<li class="dropdown-header">Выбери игрока</li>');
                for(var i in data) {
                    $('#player ul').append('<li><a href="javascript:;" onClick="mfilter(\'player\','+i+');">'+data[i]+'</a></li>');
                }
            }
            block($('#player'),1.0);
        });
    });
});