const nodeMailer = require('nodemailer');
const DB = require("./database");

let transporter = nodeMailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 587,
    secure: false,
    auth: {
        user: "",
        pass: ""
    }
});

async function sendOrderToEmail({email, name, surname, middleName, number}, order) {
    if(
        !(/^[\w\.]+@[\w]+\.[a-z]{2,4}$/i.test(email))
        || !(/^[\+]?[0-9]{11}$/i.test(number))
        || !name
        || !surname
        || !middleName
        || !number
        || !Object.keys(order).length
    ) { return "error" }

    let gameList = await DB.getBasketGames({id: Object.keys(order).join(",")});
    const sumPrice = gameList.reduce((sum, item) => sum + item.price * order[item.id], 0);
    let stringOrderMessage = "";
    for (const game of gameList) {
        stringOrderMessage += `<li>${game.title} - ${game.price} руб. — ${order[game.id]} шт.</li>`;
    }

    let result = await transporter.sendMail({
        from: '"GameBoyShop" <sema.kraevoy@yandex.ru>',
        to: email,
        subject: "Order",
        html: `Здравствуйте, ${name} ${middleName}!<br>
               Ваш заказ оформлен:<br>
               <ul>${stringOrderMessage}</ul><br>
               <b>Итого: </b>${sumPrice} руб.<br><br>
               Ваши реквизиты:<br>
               ФИО: ${surname} ${name} ${middleName}<br>
               Номер телефона: ${number}`
    });

    console.log(result);
    return "done"
}

module.exports = sendOrderToEmail;