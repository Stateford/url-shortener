$(document).ready(function() {
    $('#submit').click(function() {
        
        // remove short url class
//        $('.output').removeClass('hidden');
        
        // grab form value
        var original = $('.original').val();
        
        // check for valid entry
        if(original == '') {
            alert('incorrect value');
        } else {
            //if entry is valid
            $.post("http://localhost:8080/new/", {
                original_url: original
            }, function(data) {
                console.log(data);
            });
        }
        
    });
});