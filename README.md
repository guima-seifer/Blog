# Blog
Within the scope of the Web Engineering curricular unit it's asked for the development of a Blog (with the respective Backoffice, WordPressesque)

### Prerequisites

What things you need to install the software and how to install them

Install Node.js via package manager, find yours here:
```
https://nodejs.org/en/download/package-manager
```

Install MongoDB
```
https://docs.mongodb.com/manual/installation/
```
For local testing, start daemon command:
````
sudo service mongod start
````
Install Heroku toolbelt
```
https://devcenter.heroku.com/articles/heroku-cli
```
After install heroku make sure you already have a .git setup and execute:
```
heroku login
```
and

```
heroku git:remote -a agile-citadel-50919
```
agile-citadel-500919 comes from the following command 
```
heroku create
```

### Installing

Download the repo to a folder and execute the following command:
```
$ sudo npm install
```
### Commits
Heroku push:
```
git push heroku master
```

## Authors

* **Fernando Guimarães** - [guima-seifer](https://github.com/guima-seifer)
* **Hélder Veloso** - [hrafaelveloso](https://github.com/hrafaelveloso)
* **Luís Ferreira** - [LuisFFFerreira](https://github.com/LuisFFFerreira)

### TODO
Connect-flash express-session alerts not working in '/', '/posts';
Categories, users, settings CRUDs;
Blog frontend;

See also the list of [contributors](https://github.com/guima-seifer/Blog/contributors) who participated in this project.
