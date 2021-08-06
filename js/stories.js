'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
    console.debug('getAndShowStoriesOnStart');
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();

    showStoriesOnPage();
}
/******************************************************************** 
/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * from solutions: showDelete
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
    // console.debug('generateStoryMarkup');
    // console.debug("generateStoryMarkup", story);

    const hostName = story.getHostName();
    return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


/******************************************************************** */
/** Make delete button HTML for story */

function getDeleteBtnHTML() {
    return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

// function deleteStory() {
//     console.debug('deleteStory');
//     const $closestLi = document.querySelector('li:last-child');
//     $closestLi.parentElement.remove.child($closestLi);
//     const storyId = $closestLi.attr('id');
//     // await storyList.removeStory(currentUser, storyId);
//     // await showUsersStoriesOnPage();
// }
// $ownStories.on('click', '.trash-can',
//     deleteStory);

async function deleteStory() {
    console.debug('deleteStory');
    const $closestLi = $(evt.target).closest('li');
    const storyId = $closestLi.attr('id');
    await storyList.deleteStory(currentUser, storyId);
    await showUsersStoriesOnPage();
}
/******************************************************************** */

/** Make favorite/not-favorite star for story */

function getStarHTML(story, user) {
    console.debug(getStartHTML);
    const isFavorite = user.isFavorite(story);
    const starType = isFavorite ? "fas" : "far";
    return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}
/******************************************************************** */

/** Gets list of stories from server, generates their HTML, and puts on page. */

function showStoriesOnPage() {
    console.debug('showStoriesOnPage');
    $allStoriesList.empty();

    // loop through all of our stories and generate HTML for them

    for (let story of storyList.stories) {
        const $story = generateStoryMarkup(story);
        $allStoriesList.append($story);
    }

    $allStoriesList.show();
}
//The code below was from 06/22. I forgot where I left off so I just started anew.
/* Write a fxn that retrieves data from form and then puts that new
story on the page */
// async function addNewStory(evt) {
//   console.debug('addNewStory', evt);
//   $allStoriesList.empty();
//this evt method prevents the browser's default behavior for events
//In this case, we are preventing the form from automatically submitting when btn is clicked
//This gives us a chance to fetch the API
//evt.preventDefault();
//}

function showFavStoriesOnPage() {
    console.debug('showFavStoriesOnPage');
    $allStoriesList.empty();
    let userFav = storyList.stories.filter(story => story.favorite);
    //iterates thru' story in userFav
    for (let story of userFav) {
        const $story = generateStoryMarkup(story);
        //appends to story list
        $allStoriesList.append($story);
    }
    $allStoriesList.show()
}

/******************************************************************** */
async function addNewStory(e) {
    console.debug('addNewStory');
    e.preventDefault();

    /* To create a new story The fields are: username, title, author, and url and token are required.
    -->token, currentUser.loginToken
    (currentUser.username); remove parenthesis */
    //jQuery method -> .val() returns the value of the value attribute to the 1st mathched element
    // const username = currentUser; //Uncaught (in promise) TypeError: Cannot read property 'username' of undefined
    // const title = $('#story-title').val();
    // const author = $('#story-author').val();
    // const url = $('#story-url').val();
    // let storyData = {
    //   username, title, author, url
    // };

    const title = $("#story-title").val();
    const url = $("#story-url").val();
    const author = $("#story-author").val();
    const username = currentUser.username;

    const storyData = { title, url, author, username };
    //added this code on 07/19/21
    const story = await storyList.addStory(currentUser, storyData);

    const storyMarkup = generateStoryMarkup(story);
    $allStoriesList.prepend(storyMarkup);
    // $submitForm.slideUp("slow");
    // $submitForm.trigger("reset");

    console.log(e, storyData, 'story added');

    // From solution
    // let story = storyList.addStory(currentUser, storyData);

};

$submitForm.on('submit', addNewStory);


/******************************************************************** */
//From solutions

async function showFavStories(e) {
    console.debug('showFavStories');

    const $tgt = $(e.target);
    const $closestLi = $tgt.closest("li");
    const storyId = $closestLi.attr("id");
    const story = storyList.stories.find(s => s.storyId === storyId);

    // see if the item is already favored (checking by presence of star)
    if ($tgt.hasClass("fas")) {
        // currently a favorite: remove from user's fav list and change star
        await currentUser.removeFavorite(story);
        $tgt.closest("i").toggleClass("fas far");
    } else {
        // currently not a favorite: do the opposite
        await currentUser.addFavorite(story);
        $tgt.closest("i").toggleClass("fas far");
    }
}

$storiesLists.on("click", ".star", showFavStories);


/******************************************************************** */
/* Show logged in user's favorite stories  */
//from solutions
async function showUsersStoriesOnPage() {
    console.debug('showUsersStoriesOnPage');
    // $ownStories.empty();
    // if (currentUser in $ownStories !== 0) {
    //     //debugger;
    //     $ownStories.append(`<h5>No Stories add yet!</h5>`);
    // } else {
    //     for (let story of currentUser.ownStories) {
    //         let $story = generateStoryMarkup(story, true);
    //         $ownStories.append($story);
    //     }
    // }
    // $ownStories.show();
    $favoriteStories.empty();
    if (currentUser.favorite.length === 0) {
        $favoriteStories.append("<h5>No favorites added!</h5>");
    } else {
        for (let story of currentUser.favorite) {
            const $story = generateStoryMarkup(story);
            $favoriteStories.append($story);
        }
    }
    $favoriteStories.show();
}


/******************************************************************** */