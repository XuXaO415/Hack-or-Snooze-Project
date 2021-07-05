'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  showStoriesOnPage();
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

  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };
  //    token: currentUser.loginToken,

  await storyList.addStory(currentUser, storyId);

  console.log(e, storyData, 'story added');

  // From solution
  // let story = storyList.addStory(currentUser, storyData);
  // const story = generateStoryMarkup(story);
  // $allStoriesList.prepend($story);
  // $submitForm.slideUp("slow");
  // $submitForm.trigger("reset");

};

$submitForm.on('submit', addNewStory);

// async function deleteStory(e) {
//   console.debug('deleteStory');
//   const $closestLi = $(evt.target).closest("li");
//   const storyId = $closestLi.attr("id");

//   await storyList.removeStory(currentUser, storyId);

//   // re-generate story list
//   await putUserStoriesOnPage();

// }


/*  jquery:4059 Uncaught ReferenceError: getAndShowStoriesOnStart is not defined
    at HTMLDocument.start (main.js:34) */


/* This is in the wrong section -- add this in later  */
// async function addFavorite(username, storyId) {
//   const response = await axios({
//     message: 'Favorite added successfully!',
//     method: 'POST',
//     url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
//     data: { token: user.tokenLogin, story: { author, createdAt, storyId, title, updatedAt, url, username } },
//   });
//   let addedNewFavorite = new Favorites(response.data.user);
//   return addedNewFavorite;
// }

// async function addFavUnfav(e) {
//   console.debug('addFavUnfav', e);
// }

/* Show logged in users favorite stories  */
//from solutions
async function showStoriesOnPage() {
  console.debug('showStoriesOnPage');
  $ownStories.empty();
  if (currentUser in $ownStories !== 0) {
    //debugger;
    $ownStories.append(`<h5>No Stories add yet!</h5>`);
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}


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


// function putAddedStoriesOnPage() {
//   console.debug('putAddedStoriesOnPage');

//   $allStoriesList.empty();

//   // loop through all of our stories and generate HTML for them
//   for (let story of currentUser.ownStories) {
//     console.log(story)
//     const $story = generateStoryMarkup(story);
//     if (checkIfStoryFavorited(story.storyId)) {
//       $story.find('input').prop('checked', 'true')
//       console.debug($story);
//     }

//     $allStoriesList.append($story);
//     $story.append(`<button type="submit">delete</button>`) //adds delete button in UI for each story
//     $allStoriesList.append($story);
//   }
//   if (currentUser.ownStories.length === 0) {
//     $allStoriesList.append("You have 0 added stories!");
//   }
//   $allStoriesList.attr('data-last-call', 'added-stories'); //tracks most recent filter call
//   $allStoriesList.show();
// }
