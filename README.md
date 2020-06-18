Villagers and Heroes GUI
========================

A GUI for the utility tools pertaining to the game Villagers and Heroes

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

Heroku
------
Heroku (www.heroku.com) is used for hosting the application.
- Create the application in Heroku

        $ heroku login
        $ heroku git:remote -a vnh-gui
        $ heroku git:remote -a vnh-gui
        $ heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static
        $ git push heroku master

- Open the application in a browser (just a shortcut)
        
        $ heroku open

- Viewing logs

        $ heroku logs --tail

- List information about the dynos used

        $ heroku ps
        
- Run locally (CTRL+C to kill)

        $ heroku local

- Upload latest changes to Heroku
    - NOTE: I have updated the configuration on Heroku to automatically deploy when changes are checked in to master, so no need to use the below command anymore

            $ git push heroku master

- Configuration variables
    - Variables can be set on the heroku application that will then be available as environment variables. To list the
    current configuration:
    
            $ heroku config
    
    - To set the configuration variable "TIMES" to "2":
    
            $ heroku config:set TIMES=2

- Bash
    - Connects to the bash prompt on the Heroku server for running commands
        
            $ heroku run bash
