const express = require('express');
const path = require('path');
const parser = require('body-parser');
const fs = require('fs');
var data = JSON.parse(fs.readFileSync(path.join(__dirname, './data.json')));

const writeData = (data) => {
    fs.writeFileSync(path.join(__dirname, './data.json'),
        JSON.stringify(data, null, 3), 'utf8')
};
const app = express();

//menampilkan view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//menampilkan body-parser
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

//menampilkan jalur statis
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { data: data });
});

//menampilkan add
app.get('/add', (req, res) => {
    res.render('add', { title: 'add Data' })
})

app.post('/add', (req, res) => {
    let id = data.length + 1;
    data.push({
        id: id, string: req.body.string, integer: req.body.integer, float: req.body.float,
        date: req.body.date, boolean: req.body.boolean
    });
    writeData(data);
    res.redirect('/');
});

//menampilkan edit
app.get('/edit/:id', (req, res) => {
    let id = req.params.id
    var index = 0;
    for (let b = 0; b < data.length; b++) {
        if (data[b].id == id) {
            index = b + 1;
            break;

        }

    } res.render('edit', { title: 'Edit Data', item: data[index] });
})

app.post('/edit/:id', (req, res) => {
    let id = req.params.id
    const { string, integer, float, date, boolean } = req.body;
    var index = 0;
    for (let a = 0; a < data.length; a++) {
        if (data[a].id == id) {
            index = a + 1;
            break;

        }
    }
    data[index].string = string;
    data[index].integer = integer;
    data[index].float = float;
    data[index].date = date;
    data[index].boolean = boolean;
    writeData(data);
    res.redirect('/');
})

//menanmpilkan delete
app.get('/delete/:id', (req, res) => {
    let deleteID = req.params.id
    data.splice(deleteID, 1);
    fs.writeFileSync('data.json', JSON.stringify(data, null, 3));
    res.redirect('/');
})
app.listen(3000, () => {
    console.log('web ini sedang berjalan');
});