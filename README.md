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
- [X] Set up front-end and back-end Firestore

- [ ] Add dropdown menu with contextual actions to the Hike page for Administrators that sets a STATUS: field in the hike entity (closed for winter, open, bear in area, under repair, etc.)
- [ ] Think of any admin only actions we can add

## Friends Page
- [ ] Add friend removal to User Profile page
- [ ] Add search bar to 'friends' page
- [ ] Add 'wishlist' and 'you've hiked it' notes/icons to friends hikes

## Login Page
- [ ] Add administrator priveledged login
- [ ] Complete 'forgot password' logic
- [ ] Include "No such email exists with our registered accounts" for any emails that aren't linked to an account
- [ ] Complete 'login with google' logic
- [ ] Add user detail entry form for new users (username check and handling to ensure it is unique, DOB, age, location, etc)
- [ ] Ensure error handling for each case
