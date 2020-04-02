var token;

function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    let id_token = googleUser.getAuthResponse().id_token;

    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var settings = {
        url: "/google",
        method: "POST",
        timeout: 0,
        contentType: "application/x-www-form-urlencoded",
        data: {idtoken: id_token}
      };
      
      $.ajax(settings).done( async function(res) {
        localStorage.setItem('token', res.token);
      })
      .fail(function(err) {
        localStorage.setItem('token', 'XXXXXXXXXXXXXXX');
      })

}

function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}