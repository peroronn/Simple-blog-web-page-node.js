### CM2040 Database Networks and the Web ###

 To get started:

* Run ```npm install``` from the project directory to install all the node packages.

* Run ```npm run build-db``` to create the database on Mac or Linux 
or run ```npm run build-db-win``` to create the database on Windows

* If you can't run ```npm run build-db``` or ```npm run build-db-win```,
    Go to package.json file and -
    1. If you use Mac or Linux, please remove Line 8 & 9-
        "build-db-win": "sqlite3 database.db < db_schema.sql",
        "clean-db-win": "del database.db",
    2. IF you use Windows, please remove Line 10 & 11 -
        "build-db": "cat db_schema.sql | sqlite3 database.db #build anew database from the sql file",
        "clean-db": "rm database.db #remove the old database".

* Run ```npm run start``` to start serving the web app (Access via http://localhost:3000)

You can also run: 
```npm run clean-db``` to delete the database on Mac or Linux before rebuilding it for a fresh start
```npm run clean-db-win``` to delete the database on Windows before rebuilding it for a fresh start

###
I insatall ```npm install date-fns``` for date format to make the date look better.
###

###
For, author page, you need to register first to go to author page or use username "admin" and password "admin" to go to author page.

Because I add extension on author blog page that can create and delete.
Editing author blog page = article setting page.
I didn't change the article setting page to author blog editing page because of request.
###

