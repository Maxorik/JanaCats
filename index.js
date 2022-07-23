const TelegramApi = require('node-telegram-bot-api');
const token = '5384880922:AAGY7Xnv0RlaD2IuBTZkDWCs-REMWscTk5o';
const bot = new TelegramApi(token, {polling: true});
const imageSearch = require('image-search-google');
const download = require('image-downloader');
const fs = require('fs');
const cron = require('node-cron');
const axios = require('axios');

// базовые команды
bot.setMyCommands([
    {command: '/start', description: 'Запуск бота'}
]);

function randPosition(max) {
    return Math.floor(Math.random() * max);
}

bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start' || text === '/start s') {
        const client = new imageSearch('ffeb8f3554ef89179', 'AIzaSyC36DzU-UZZGyp1cro1rr13Y2em_ZFgDuA');
        const options = {page:1};
        let phraseList;

        // получаем словарь запросов
        axios.get('https://somedata-e3056-default-rtdb.firebaseio.com/jana_phrases.json')
        .then(res => {
            let list = res.data,
                key = Object.keys(list)[0];
            phraseList = list[key].phraseList;
        }).then(() => {
            sendImage();
        })

        // отправка каждый час
        let sendMessageTask = cron.schedule('0 */1 * * *', () => {
            let today = new Date();
            if(today.getHours() > 2 && today.getHours() < 11) {
                sendImage();
            }
        });

        try { sendMessageTask.stop(); } catch (e) {}
        sendMessageTask.start();

        // отправка картинки
        function sendImage() {
            let phraseSearch = phraseList[randPosition(phraseList.length)];

            // поиск картинки
            client.search(phraseSearch, options)
                .then(images => {
                    const options1 = {
                        url: images[randPosition(images.length)].url,
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
    }
});