'use strict';

const BASE_URL = 'https://hack-or-snooze-v3.herokuapp.com';

/******************************************************************************
 * Story: a single story in the system
 */

class Story {
  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // UNIMPLEMENTED: complete this function!
    let parser = new URL(BASE_URL);
    return parser.hostname;
  }
}

/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?  Instances method modify data.
    //So, the static keyword is a static method or property for a class.
    //These methods/properties cannot be called on instances of a class, instead they're called on the class itself.
    //So in this case, this (static) method makes the most sense to use because we are calling directly on the class (User)

    // query the /stories endpoint (no auth required)
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/stories`,
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance -- create a new story --> Token Required. The data fields are:
   *  username, title, author, and url
   */

  /** 
  'token': 'YOUR_TOKEN_HERE', \
  'story': { \
    'author': 'Matt Lane', \
    'title': 'The best story ever', \
    'url': 'http://google.com' \
  } \
}"; */

  // var body = "{ \
  //   'user': { \
  //     'username': 'test', \
  //     'password': 'password' \
  //   } \

  //user, newStory


  /* Response body from hack or snooze */

  // }

  async addStory(user, { title, author, url }) {
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/stories`,
      data: { token: user.loginToken, story: { title, author, url } },
    });
    console.log(response.data);
    let newStory = new Story(response.data.story);
    return newStory;

  }


  async removeStory(storyId) {
    //storyId = auto generated ID to reference story docs in routes
    //need token to link to user -- user is the one who can remove story
    //const token = user.loginToken;
    //console.log(token);

    const response = await axios({
      method: 'DELETE',
      message: 'Story deleted successfully',
      url: `${BASE_URL}/stories/${storyId}`,
      data: {
        token: user.loginToken, story: { author, createdAt, storyId, title, updatedAt, url, username }
      },
    });
    //console.log(response.data);
    console.log(message);
    let deleteStory = delete Story(response.data);
    return deleteStory;
  }
}

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({ username, name, createdAt, favorites = [], ownStories = [] }, token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: 'POST',
      data: {
        user: {
          username,
          password,
          name,
        },
      },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

     * - username: an existing user's username
     * - password: an existing user's password
     */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: 'POST',
      data: {
        user: {
          username,
          password,
        },
      },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: 'GET',
        params: {
          token,
        },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error('loginViaStoredCredentials failed', err);
      return null;
    }
  }


  async addFavorite(username, storyId) {
    const response = await axios({
      message: 'Favorite added successfully!',
      method: 'POST',
      url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
      data: { token: user.tokenLogin, story: { author, createdAt, storyId, title, updatedAt, url, username } },
    });
    let addedNewFavorite = new Favorites(response.data.user);
    return addedNewFavorite;
  }

}