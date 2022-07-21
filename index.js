const TelegramApi = require('node-telegram-bot-api');
const token = '5384880922:AAGY7Xnv0RlaD2IuBTZkDWCs-REMWscTk5o';
const bot = new TelegramApi(token, {polling: true});
const imageSearch = require('image-search-google');
const download = require('image-downloader');
const fs = require('fs');
const cron = require('node-cron');

// базовые команды
bot.setMyCommands([
    {command: '/start', description: 'Запуск бота'}
])

function randPosition(max) {
    return Math.floor(Math.random() * max);
}

bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start' || text === '/start s') {
        const client = new imageSearch('ffeb8f3554ef89179', 'AIzaSyC36DzU-UZZGyp1cro1rr13Y2em_ZFgDuA');
        const options = {page:1};
        const phraseList = [' красивая пышная грудь ', ' красивая женская грудь ', ' голая женская грудь ', ' красивые большие титьки '];

        sendImage();

        // отправка каждый час
        // TODO проверка на время 09.00 - 18.00
        let sendMessageTask = cron.schedule('0 */1 * * *', () => {
            sendImage();
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