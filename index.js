const express = require("express"); // подключаем фреймворк express
const cors = require('cors');

const app = express(); // создаём переменную с подключенным константой express (фреймворк)
app.use(express.json()); // обработчик express'а, чтобы он указывал на погрешности в работе кода.

const { DataTypes } = require("sequelize") // импортируем объект DataTypes из sequelize, для того чтобы создать в целом схему таблиц БД
                                           // То есть те же самые атрибуты и кортежи

const PORT = 3080 // В целом это порт даст прослушку сервера (ну или иначе контакт)
const {Sequelize} = require("sequelize"); // Включение модуля Sequelize класса, для работы


const sequelize = new Sequelize( // Здесь основа для работы с postgres, то есть он будет требовать соединения с БД.
    "datauser", // сама база данных
    "postgres", // юзернейм пользователя
    "0000", // пароль
    {
        dialect: "postgres", // диалект языка sql, для работы с БД
        host: "localhost", // адрес компа, на котором подключен интернет
        port: "" // порт БД postgres
    }
)

const User = sequelize.define("users", { // Здесь суть проста, тут мы создаём таблицу users и его атрибуты id, login, passwd, role
                                                 // через метод define мы и создаём эту прелесть
                                                // type: DataTypes.*тип данных*, эта строчка создаёт атрибуты через DataTypes
                                                // в параметрах где есть true или false даёт разрешение в создании атрибутов
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, // primaryKey - первичный ключ, autoIncrement: true - значения в ключей генерируются автоматом
                                                                          // как я правильно понял autoIncrement даёт сразу кортеж записать - 
    login: {type: DataTypes.STRING, unique: true}, // unique: true - уникальное поле или иначе не даёт дубликацию логина если вдруг повтор
    passwd: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "User"}, //  defaultValue: "текст" - задаёт сразу кортеж без доп. усилии
})

app.get("/", (req,res) => {
    res.send("<h1>Test</h1>");
})

app.get("/FIO", (req,res) => {
    res.send("<h1>Иванов В.С</h1>");
})

app.post("/Create_datauser", async (res, req) => {
    const {id, login, passwd, role} = req.body;
    const type = await User.create({id, login, passwd, role});
    res.send("Data Created")
})

app.delete("/Delete_User/Delete_ID/:Delete_ID", (res, req) => { // Вызов запроса на удаление таблицы
    const {id} = req.params;
    let Delete_ID = Number(req.params.Delete_ID)
    const type = User.destroy({where: {id: Delete_ID}});
    res.send("Data deleted")
})

async function start() { // после запуска, в консоль выдаётся запись о том что сервер запущен
    app.listen(PORT, () => {
        console.log(`http//localhost:${PORT}`)
    })
}

sequelize.authenticate(); // проверка запуска
sequelize.sync(); // Метод создающий Таблицу
start(); // Запуск функции