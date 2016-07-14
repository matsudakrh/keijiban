;( function () {
    
    var postForm = document.getElementById('postForm');
    var tweet = postForm.tweet;
    var btn = postForm.btn;
    var passPattern = new RegExp('/[^A-Z|a-z|0-9|!-/:-@≠\[-`{-~]+/');




    tweet.addEventListener( 'keyup', function () {
        console.log(event.keyCode);
        if ( tweet.value.length > 140 ) {
            // btn.style.background = '#f00';
            // btn.style.color = '#fff';
            btn.setAttribute( 'disabled', 'disabled' );
            btn.classList.add('disabled-btn');
        } else {
            // btn.style.background = '#fff';
            // btn.style.color = '#000';
            btn.removeAttribute( 'disabled' );
            btn.classList.remove('disabled-btn');
        }
    });

    postForm.addEventListener( 'submit', function () {

        if ( tweet.value.length > 140 ||
            tweet.value == '' ) {
            event.preventDefault();
            console.log('Error!');
        }
        
    });

})();