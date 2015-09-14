#WICit: Where to Shop with WIC

### The California deployment of WICit is live!
#### Check it out at [findwic.com](http://findwic.com)!
---
### Development Environment Setup
#### OS X
  1 [Install node.js and NPM (Node Package Manager)](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
  
  2 Install grunt command-line on your machine: `sudo npm install -g grunt-cli`
  
  3 [Fork the repository and setup a local clone](https://help.github.com/articles/fork-a-repo)
  
  4 Move into your local wicit directory: `cd <yourdirectory>/wicit`
  
  5 Install server-side dependencies: `npm install`
  
  6 [Register your development application](http://dev.socrata.com/register) to receive a data portal API token.
  
  7 [Setup a Mapbox map](https://www.mapbox.com/help/creating-new-map/) to use in your development environment.
  
  8 Copy the `.env.dist` file to a file called `.env`, and update the `MAPBOX_ID`, `MAPBOX_TOKEN`, and `API_TOKEN` parameters in that file with your Mapbox map ID, Mapbox API token, and data portal API token.
  
  9 Start the development server: `grunt dev`
  
  10 [Try it out](http://localhost:3000)
	
#### Windows
1. [Install: Git](http://git-scm.com/download)
2. [Install: Node & NPM](http://nodejs.org/)
3. [Install: Python 2.x.x](https://www.python.org/downloads/)
	- Version 3 of Python is not supported by nodegyp so make sure to install version 2.x.x.
4. [Install: Visual Studio Community (with Update 4)](http://www.visualstudio.com/downloads/download-visual-studio-vs)
	- Visual Studio Express for Windows Desktop should also work, but if you want a full IDE, go with the Community edition
5. From a command prompt, install the Grunt Command Line Interface: `npm install -g grunt-cli`
6. Follow the OS X instructions above from step 4

### Deployment
#### Digital Ocean
Wicit is ready to be [deployed on Digital Ocean using Dokku](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-dokku-application) (wicit doesn't use a database right now, so you don't have to worry about that part). Just be sure to use `dokku config:set <appname> VAR=value` to add the settings present in your local `.env` file to your deployment environment.

###License
WICit is free software, and may be redistributed under the MIT-LICENSE.
