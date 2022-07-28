// вспомогательные функции

// получить дату в удобном виде
function getDate(date) {
    let d = date;
    d = [
        '0' + d.getDate(),
        '0' + (d.getMonth() + 1),
        '' + d.getFullYear(),
        '0' + d.getHours(),
        '0' + d.getMinutes()
    ].map(component => component.slice(-2));

    return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
}

// случайное число до максимума
function randPosition(max) {
    return Math.floor(Math.random() * max);
}

module.exports = { getDate, randPosition };