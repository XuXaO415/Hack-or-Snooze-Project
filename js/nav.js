'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
    console.debug('navAllStories', evt);
    hidePageComponents();
    showStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
    console.debug('navLoginClick', evt);
    //Displays login & signup form
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
}

$navLogin.on('click', navLoginClick);


/** When user clicks on navbar submit link, user will be rerouted to submit page */
/** this function is connected to stories.js-- will later call the .addStory method */
//Named this fxn from schematics updateNavOnLogin will later be used to updateUIOnUserLogin
function updateNavOnLogin() {
    console.debug('updateNavOnLogin');
    //What will be displayed on page when user logs in
    showStoriesOnPage();
    $loginForm.show();
    $signupForm.show();
    $loginForm.hide();
    $signupForm.hide();
    // $navFavorites.show();
}


/* Write a function in nav.js that is called when users click that navbar link. 
Look at the other function names in that file that do similar things and pick something descriptive and similar. */
function userNavSubmit(evt) {
    console.debug('userNavSubmit', evt);
    hidePageComponents();
    $allStoriesList.show();
    $submitForm.show();
}
$navUserProfile.on("click", "#nav-all", userNavSubmit);

function navSubmitStoryClick(evt) {
    console.debug("navSubmitStoryClick", evt);
    hidePageComponents();
    $allStoriesList.show();
    $submitForm.show();
}

$navSubmitStory.on("click",
    navSubmitStoryClick);

/** Show favorite stories on click on "favorites" */

function navFavoritesClick(evt) {
    console.debug("navFavoritesClick", evt);
    hidePageComponents();
    showStoriesOnPage();
    // $navFavorites.show()
    // $allStoriesList.show();

    // $showFavStories.show();
    // $navFavorites.show();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

/** Show My Stories on clicking "my stories" */

function navMyStories(evt) {
    console.debug("navMyStories", evt);
    hidePageComponents();
    // showStoriesOnPage();
    $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
    console.debug("navLoginClick", evt);
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Hide everything but profile on click on "profile" */

function navProfileClick(evt) {
    console.debug("navProfileClick", evt);
    hidePageComponents();
    $navUserProfile.show();
}

$navUserProfile.on("click", navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
    console.debug("updateNavOnLogin");
    $(".main-nav-links").show();
    $navLogin.hide();
    $navLogOut.show();
    //Added line below
    // $loginForm.hide();
    // $signupForm.hide();
    $navUserProfile.text(`${currentUser.username}`).show();
}