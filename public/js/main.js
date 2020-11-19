$(function() {
    if($('textarea#ta').length) {
        CKEDITOR.replace('ta')
    }

    $('a.deletion').on('click', () => {
        if (!confirm('confirm deletion'))
        return false
    })

})