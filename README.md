#WICit: Where to Shop with WIC

### This README has recently changed! <br /> Be sure to register for a data portal API token (step 6) and set up a Mapbox map for your development environment (step 7).

### The California deployment of WICit is live! <br /> Check it out at [findwic.com](http://findwic.com)!

###Setup (Mac)
  1 [Install node.js and NPM (Node Package Manager)](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
  
  2 Install grunt command-line on your machine: `sudo npm install -g grunt-cli`

  3 Install the SASS compiler gem: `gem install sass`
  
  4 [Fork the repository and setup a local clone](https://help.github.com/articles/fork-a-repo)
  
  5 Move into your local wicit directory: `cd <yourdirectory>/wicit`
  
  6 Install server-side dependencies: `npm install`
  
  7 [Register your development application](http://dev.socrata.com/register) to receive a data portal API token.
  
  8 [Setup a Mapbox map](https://www.mapbox.com/help/creating-new-map/) to use in your development environment.
  
  9 Copy the `.env.dist` file to a file called `.env`, and update the `MAPBOX_ID`, `MAPBOX_TOKEN`, and `API_TOKEN` parameters in that file with your Mapbox map ID, Mapbox API token, and data portal API token.
  
  10 Start the development server: `grunt dev`
  
  11 [Try it out](http://localhost:3000)

###License
WICit is free software, and may be redistributed under the MIT-LICENSE.
