const TelegramApi = require('node-telegram-bot-api');
const token = '5384880922:AAGY7Xnv0RlaD2IuBTZkDWCs-REMWscTk5o';
const bot = new TelegramApi(token, {polling: true});
const imageSearch = require('image-search-google');
const download = require('image-downloader');
const fs = require('fs');

// базовые команды
bot.setMyCommands([
    {command: '/start', description: 'Запуск бота'},
    {command: '/cats', description: 'Секретная опция :3'},
])

bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/cats') {
        const client = new imageSearch('ffeb8f3554ef89179', 'AIzaSyC36DzU-UZZGyp1cro1rr13Y2em_ZFgDuA');
        const options = {page:1};

        // поиск картинки
        client.search('Красивая большая грудь', options)
            .then(images => {
                let imgPos = Math.floor(Math.random() * images.length);
                const options1 = {
                    url: images[imgPos].url,
                    dest: '../../img',
                };

                // скачиваем картинку, выдаем боту и удаляем с сервера
                download.image(options1)
                    .then(({ filename }) => {
                        bot.sendPhoto(chatId, filename).then(()=>{
                            fs.unlink(filename, err => {
                                if(err) throw err;
                            });
                        })
                    })
                    .catch((err) => console.error(err));
            })
            .catch(error => console.log(error));
    }

    if(text === '/start' || text === '/start s') {
        bot.sendMessage(chatId, `${msg.from.first_name}, привет! \nвыбирай в опциях "/cats"`)
    }
});