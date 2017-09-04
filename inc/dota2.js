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
    $.ajax({type:'POST',data:{rid:'dota2',ajax:f,data:data}}).done(function(txt){
        $('#'+f).html(txt);
        tips();
        if ($('#scrorecur').prop('checked') == true) show_scores('current',1);
        if ($('#scrorepast').prop('checked') == true) show_scores('past',1);
        mtime();
    });
}

function live_score(mid,e) {
    $.ajax({type:'POST',data:{rid:'dota2',ajax:'live_score',data:{'mid':mid}}}).done(function(txt){
        var data = jQuery.parseJSON(txt);
        $(e).html(data.score);
        $('#live_time_'+mid).html('<b></b> '+data.time);
    });
    return false;
}
function live_build(mid) {
    $.ajax({type:'POST',data:{rid:'dota2',ajax:'live_build',data:{'mid':mid}}}).done(function(txt){
        wms('Статус башен и бараков',txt);
    });
}