# WildRoutes - _Readme_

# Before you start developing

## 1. Install Docker Desktop.

## 2. Have an ide.

## 3. Have an internet browser.

## 4. Create a .env file in the root folder

- Copy the .env details we shared in the discord.
  - We need the .env files for our firebase DB to work.

# Make sure you have node 20 running locally.

```bash
nvm install 20
npm install
```

Now you should have all the local dependencies built you can proceed with the below commands.

# Starting and stopping the docker containers

- First make sure docker is running.
- Building the docker container and running it.

  - ```bash
    docker compose up --build
    ```

- ## _ALWAYS run this command when you are done working or docker will eat your battery._

  - ```bash
    docker compose down
    ```

# TODO List:

## Database, Queries, Search Optimization, Insertions and Deletions

- [x] Set up front-end and back-end Firestore
- [ ] Build functions for friend lookup - can't be only exact match, needs to have partial match as well, with best match at the top
- [ ] Ensure firestore.rules is set up properly for all neccessary queries and insertions
- [ ] Ensure any functions needed for the post login User profile creation stage are created (e.g. setUsername, setProfilePic, setName, setAge
- [ ] Add wishlisted hike attribute to the

## Typedefs / Collection Definitions

- [ ] Add wishlist array attribute to User for storing hikeId's

## Hike Page

- [ ] Add dropdown menu with contextual actions to the Hike page for Administrators that sets a STATUS: field in the hike entity (closed for winter, open, bear in area, under repair, etc.)
- [ ] Think of any admin only actions we can add (anywhere in the project)
- [ ] Add context menu for user to set 'time/date completed'

## Friends Page

- [x] Add friend removal to User Profile page
- [x] Add search bar to 'friends' page
- [ ] Add 'wishlist' and 'you've hiked it' notes/icons to friends hikes

## Login Page

- [ ] Complete 'forgot password' logic
- [x] Include "No such email exists with our registered accounts" for any emails that aren't linked to an account
- [ ] Complete 'login with google' logic
- [ ] Add user detail entry form for new users (DOB, age, location, etc)
- [x] Ensure error handling for each case

## User Settings Page

- [ ] delete user.
  - [ ] deletes all Friendships associated with user.
  - [ ] deletes all wishlisted hikes by user
  - [ ] deletes all completed hikes by a user
- [ ] Change username

## Admin Page - reachable via user settings.

- [ ] Add hike.
- [ ] Delete User.
- [ ] Blacklist user email.
- [ ] Hikes modifiable via admin.
- [ ] Status field for hikes.
  - [ ] Allow Admins to change status via page button.
