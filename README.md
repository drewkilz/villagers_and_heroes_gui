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

Digital Ocean (Deployment)
--------------------------
The application is currently deployed on Digital Ocean.

Original deployment was done via:
    
    # SSH into the droplet on Digital Ocean
    ssh -i /Users/drewkilz/.ssh/id_rsa_do root@159.65.108.26
    
    # Switch to the vnh user
    su vnh
    
    # install npm - had to do one at a time as there were errors when trying to install all at once
    sudo apt update
    sudo apt install nodejs
    sudo apt install npm
    
    # Change to home directory
    cd ~

    # git clone our repo
    git clone https://github.com/drewkilz/villagers_and_heroes_gui.git
    cd villagers_and_heroes_gui
    
    # Add some environment variables (update with production values)
    cp .env .env.production
    vi .env.production
    
    # allows access to the local update store
    sudo chown -R $USER:$(id -gn $USER) /home/vnh/.config
    
    # build the GUI
    sudo npm install npm@latest
    npm run build
    
    # Configure nginx to proxy requests - the API will already be setup so just need to add the section containing
    #  location /
    sudo vi /etc/nginx/sites-available/villagers_and_heroes
    
        server {
            ...
    
            location / {
                root /home/vnh/villagers_and_heroes_gui/dist;
                try_files $uri $uri/ /index.html;
            }
            
            ...
        }
    
    sudo nginx -t
    sudo systemctl restart nginx
    
Useful commands on the server:
    
    # Log files
    sudo less /var/log/nginx/error.log: checks the Nginx error logs.
    sudo less /var/log/nginx/access.log: checks the Nginx access logs.
    sudo journalctl -f -u nginx: checks the Nginx process logs.

    # Reboot the machine
    sudo reboot

    # nginx commands
    sudo systemctl stop nginx
    sudo systemctl start nginx
    sudo systemctl restart nginx
    sudo systemctl reload nginx  # Reloads without dropping connections - useful for configuration changes, for example
    sudo systemctl disable nginx  # To disable automatic startup when server boots
    sudo systemctl enable nginx  # Re-enable automatic startup
    
    # nginx files
    /var/www/html: The actual web content, which by default only consists of the default Nginx page you saw earlier, is served out of the /var/www/html directory. This can be changed by altering Nginx configuration files.
    /etc/nginx: The Nginx configuration directory. All of the Nginx configuration files reside here.
    /etc/nginx/nginx.conf: The main Nginx configuration file. This can be modified to make changes to the Nginx global configuration.
    /etc/nginx/sites-available/: The directory where per-site server blocks can be stored. Nginx will not use the configuration files found in this directory unless they are linked to the sites-enabled directory. Typically, all server block configuration is done in this directory, and then enabled by linking to the other directory.
    /etc/nginx/sites-enabled/: The directory where enabled per-site server blocks are stored. Typically, these are created by linking to configuration files found in the sites-available directory.
    /etc/nginx/snippets: This directory contains configuration fragments that can be included elsewhere in the Nginx configuration. Potentially repeatable configuration segments are good candidates for refactoring into snippets.
    /var/log/nginx/access.log: Every request to your web server is recorded in this log file unless Nginx is configured to do otherwise.
    /var/log/nginx/error.log: Any Nginx errors will be recorded in this log.

When a change is made, to update the server:

    ./bin/update.sh

Server Maintenance:
    
    # Every now and again you'll need to update the npm packages to remove security vulnerabilities
    npm audit
    npm audit fix   # may require sudo access, depending on the fix
