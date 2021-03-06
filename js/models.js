'use strict';

const BASE_URL = 'https://hack-or-snooze-v3.herokuapp.com';

/******************************************************************************
 * Story: a single story in the system
 */

class Story {
    /** Make instance of Story from data object about story:
     *   - {title, author, url, username, storyId, createdAt}
     */

    constructor({ storyId, title, author, url, username, createdAt, favorite }) {
        this.storyId = storyId;
        this.title = title;
        this.author = author;
        this.url = url;
        this.username = username;
        this.createdAt = createdAt;
        //added line below on 07/19/21

        //added 8/3/21
        this.favorite = favorite;
    }

    /** Parses hostname out of URL and returns it. Huh? */

    getHostName() {
        //DONE TODO: UNIMPLEMENTED: complete this function!
        /* Assign parser to new url, then returns host */
        let parser = new URL(this.url);
        return parser.host;

        // const parser = new URL(this.url);
        // return parser.host;

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
        //moved this to line 275 -> this.favorites = favorites.map(s => new Story(s));
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


    // }

    async addStory(user, { title, author, url }) {
        const response = await axios({
            method: 'POST',
            url: `${BASE_URL}/stories`,
            data: { token: user.loginToken, story: { title, author, url } },
        });
        console.log(response.data);
        let newStory = new Story(response.data.story);
        // this.stories.push(newStory);
        this.stories.unshift(newStory);
        // user.ownStories.unshift(newStory);
        return newStory;

    }


    async deleteStory(storyId, currentUser) {
        const response = await axios({
            method: 'DELETE',
            // url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
            url: `${BASE_URL}/stories/${storyId}`,
            data: { token: currentUser.loginToken },
            // data: { token: this.loginToken },
            message: 'Favorite Deleted Successfully!'
        });
        /* using 'this.stories' to reference the stories object. Then, by using filter(story => ...) to filter for strict equality. 
        If storyIds do match, will pop last element in the array
        Note: articulate this explanation for a clearer understanding*/

        /*filter out story ID for deletion */
        this.stories = this.stories.filter(story => story.storyId === story.storyId);
        currentUser.ownStories.pop(response.data.story);
        currentUser.favorites = currentUser.favorites(story => storyId === story.storyId);
        currentUser.favorites.pop(response.data.story);
    }
}

// async editStory(storyId) {
//     const response = await axios({
//         method: 'PATCH',
//         url: `{BASE_URL}/stories/${storyId}`,
//         data: { token: currentUser.loginToken, story: { title, author, url } }
//     });
//     this.stories.filter(story => story.storyId === story.storyId);
//     currentUser.ownStories.append(response.data.story)
// }

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

        return new User({
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

        return new User({
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
                    token
                },
            });

            let { user } = response.data;

            return new User({
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


    // async addFavorite(username, storyId) {
    //   const response = await axios({
    //     message: 'Favorite added successfully!',
    //     method: 'POST',
    //     url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
    //     data: { token: user.tokenLogin, story: { author, createdAt, storyId, title, updatedAt, url, username } },
    //   });
    //   let addedNewFavorite = new Favorites(response.data.user);
    //   return addedNewFavorite;
    // }

    //This fxn allows logged in users to add a favorite story -- calls on API to add fav
    async addFavorite(storyId) {
        await axios({
            method: 'POST',
            url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
            data: { token: this.loginToken },
        });
        storyId.favorite = true;
        // this.favorites = favorites.map(s => new Story(s));
        this.favorites.push(story);
        console.log('Story added', this.status, this.response, this.favorites);
    }

    async deleteFavorite(storyId) {
        await axios({
            method: 'DELETE',
            url: `${BASE_URL}/users/${username}/favorites/${storyId}`,
            data: { token: this.loginToken }
        });
        storyId.favorite = false;
        this.favorites = favorites.map(s => new Story(s));
        console.log('Story deleted', this.status, this.favorites);
    }
}
//Solutions
// async addOrRemoveFavorite(story) {
//     const method = newState === "add" ? "POST" : "DELETE";
//     const token = user.loginToken;
//     await axios({
//         url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
//         method: method,
//         data: { token },
//     });
// }