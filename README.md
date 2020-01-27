# About this Site
This site is an online tool to be able to easily and remotely play Fiasco with your friends. The motivation for this site came from a desire to play the game with a couple friends of mine, but we all lived too far away to get together. If you are unfamiliar with Fiasco, check out this [link](https://bullypulpitgames.com/games/fiasco/ "Learn More about Fiasco").

# Stack

* Front-End
  * React
* Back-End
  * Node/Express
  * express-sessions
  * Socket.io
  
This site is bootstrapped with Create-React-App.

# Site Walkthrough

Due to the site still being a WIP, there are many many styling changes that I wish to make. Once those are completed, this section of the README will be updated with a walkthrough.

# File Outline

* /server
  * /controllers
    * `/gameController.js`
      * This is where most of the servers util functions are stored. Currently, they are all deprecated except for `getRandomUrl`. That function generates a random number between the ranges of 65-90 or 97-122, and converts it to its appropriate ascii character. This is used to generate a random url that a given game will be hosted at.
  * /model
    * `/SocketResponse.js`
      * This class is purely to standardize what server responses for Socket.io look like, so as to provide a consistent api that the application can rely on.
    * `/Game.js`
      * This is where the majority of the game logic is held. By creating a game class, we will be able to create new Games quickly and easily which is necessary for the site's desired functionality. The class keeps track of the game url, the number of players allowed in the game, the locations of each die, and the currently connected players. It's important to note that a cookie is created for each user who connects to the site which contains a random ID. This is used to identify who is connected to what room.
  * /`index.js`

# Contact
Reach out to mykenzierogers@gmail.com with any questions.
