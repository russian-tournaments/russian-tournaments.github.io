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
    $.ajax({type:'POST',data:{rid:'lol',ajax:f,data:data}}).done(function(txt){
        $('#'+f).html(txt);
        tips();
        mtime();
    });
}
function live_score(mid,e) {
    $.ajax({type:'POST',data:{rid:'lol',ajax:'live_score',data:{'mid':mid}}}).done(function(txt){
        var data = jQuery.parseJSON(txt);
        $(e).html(data.score);
    });
    return false;
}