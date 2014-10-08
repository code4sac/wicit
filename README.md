#WICit: Where to Shop with WIC

### The California deployment of WICit is live! Check it out at [findwic.com](http://findwic.com)!

###Setup (Mac)
  - [Install node.js and NPM (Node Package Manager)](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
  - Install grunt command-line on your machine: `sudo npm install -g grunt-cli`
  - [Fork the repository and setup a local clone](https://help.github.com/articles/fork-a-repo)
  - Move into your local wicit directory: `cd <yourdirectory>/wicit`
  - Install server-side dependencies: `npm install`
  - [Setup a Mapbox map](https://www.mapbox.com/help/creating-new-map/) to use in your development environment.
  - Copy the `.env.dist` file to a file called `.env`, and update the `MAPBOX_ID` and `MAPBOX_TOKEN` parameters in that file with your Mapbox map ID and API token.
  - Start the development server: `grunt dev`
  - [Try it out](http://localhost:3000)

###License
WICit is free software, and may be redistributed under the MIT-LICENSE.
