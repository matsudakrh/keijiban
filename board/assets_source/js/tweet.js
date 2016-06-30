;( function () {
    
    var postForm = document.getElementById('postForm');
    
    postForm.addEventListener( 'submit', function () {

        if (
            postForm.tweet.value.length > 140 ||
            postForm.tweet.value == '' ||
            postForm.name.value == '' ) {
            event.preventDefault();
            console.log('Error!');
        }
        
    });

})();