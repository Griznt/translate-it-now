# translateit

Simple app for translate text from loaded file and then save it in the txt file.
Each translated sentence will be located after source sentence.
In the end you can save translated results in to a file.

Yandex Translate API engine used http://translate.yandex.ru/.

You can get YANDEX_API_KEY here: https://translate.yandex.ru/developers/keys It's have limits, but free.

### .env

You need add recieved YANDEX_API_KEY in your .env file: `YANDEX_API_KEY=trnsl.1.1....`

![alt text](https://preview.ibb.co/ffmdzz/translateit.jpg)

### demo: https://translateitnow.herokuapp.com/

App worked with React.js and Express.js

### running

`npm start` for local-starting web part of app

### building

`npm run build` for building web app

### run server

`npm run start-server` for starting up server (default on port 3000). Runs the builded web part and provides API support for text translation requests;
