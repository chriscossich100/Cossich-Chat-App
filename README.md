# Welcome to my Chat App

  

Welcome to my simple chat application built using React. This simple app allows you to chat with other users and create chat rooms

  

## Getting Started

This app should start to work in just a few steps:

  

### `npm install`

In order to use this application, the first that needs to be done is run the command: npm install

  

### `npm start`

Once you have npm installed in the application you can run the command `npm start`. This is sufficient to run basic part of the app.

  

### Backend

This app relies heavily on the backend ([backend repository available](https://github.com/chriscossich100/chat-app-backend))

In my case, I decided to use Django as my backend. If, you decide to try out the backend code i provided, you can simply follow the instructions on that repo to officially start using this application. 

Once you have your backend code ready or if you're using the repo I provided the next step would be to configure the local environments for either development or production:

  

### Configuring .env files:

since I want to use different api urls for either dev or production, The frontend uses environment variables.

However, the environment variable configured here should only be the development one, as the production environment variable will be configured through the host provider.

  

### `npm install env-cmd`
**If you don't plan on using Environment Variables you can skip this part || You can simply run the backend code just make sure to change all the links to the server name. Ex: localhost:8000**
One way to utilize environment variables is to install env-cmd. this can be done with the command `npm install env-cmd`. Once you have this, you can create a .env file for development.

This can be done by setting a file inside the main directory folder and naming it ".env.dev". Once that is created, create the variable `REACT_APP_DB` and set it equal to the name of your localhost backend. Ex:  The .env.dev file should look something like this: `REACT_APP_DB=http://localhost:8000`. 

**AN IMPORTANT NOTE: **
When using Enviornment variables, React requires that the initial variable have the part "REACT_APP" 

As mentioned already, if we're going to use enviornment variables to decide which link will be used for dev or production, the production env variable can be set with your host provider. In this case,
the application is hosted by Vercel. They allow you to easily set the enviornment variable from there. Just make sure, if using vercel, to state that this environment variable is for production.
Set the name to REACT_APP_DB and the variable name to the production backend url.
  
  
### `"start": "env-cmd -f .env.dev react-scripts start`
Once you have the .env.dev file set up, in the package.json file, `"start": "react-scripts start"` to `"start": "env-cmd -f .env.dev react-scripts start"

Finally, if you plan on creating your own repository on github, make sure to create a .gitignore file and add the .env.dev file to it.

With this set up, your environment variable will contain the link info to the backend. 