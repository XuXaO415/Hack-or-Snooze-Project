'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
    console.debug('navAllStories', evt);
    hidePageComponents();
    putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
    console.debug('navLoginClick', evt);
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When user clicks on navbar submit link, user will be rerouted to submit page */
/** this function is connected to stories.js-- will later call the .addStory method */
//Named this fxn from schematics updateNavOnLogin will later be used to updateUIOnUserLogin
function updateNavOnLogin(evt) {
    console.debug('updateNavOnLogin', evt);
    //What will be displayed on the page after user click evt
    putStoriesOnPage();
    $loginForm.show();
    $signupForm.show();
    $loginForm.hide();
    $signupForm.hide();

}


