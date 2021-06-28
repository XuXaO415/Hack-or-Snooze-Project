'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.story) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
//The code below waa from 06/22. I forgot where I left off so I just started anew.
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

async function addNewStory(e) {
  console.debug('addNewStory', e)
  e.preventDefault();

  /* To create a new story The fields are: username, title, author, and url and token are required.
  -->token, currentUser.loginToken
  (currentUser.username); remove parenthesis */
  //jQuery method -> .val() returns the value of the value attribute to the 1st mathched element
  const username = currentUser; //Uncaught (in promise) TypeError: Cannot read property 'username' of undefined
  const title = $('#story-title').val();
  const author = $('#story-author').val();
  const url = $('#story-url').val();
  let storyData = {
    username, title, author, url
  };
  //    token: currentUser.loginToken,
  console.log(e, storyData, 'story added');

  // From solution
  //let story = storyList.addNewStory(currentUser, storyData);
  //const story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
};


$submitForm.on('submit', addNewStory);



/*  jquery:4059 Uncaught ReferenceError: getAndShowStoriesOnStart is not defined
    at HTMLDocument.start (main.js:34) */


