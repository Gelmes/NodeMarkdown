const express   = require('express');
const fs        = require('fs');
const path      = require('path');
const cheerio   = require('cheerio');
const hljs      = require('highlight.js'); // https://highlightjs.org/
const md        = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str) {
        try {
            return hljs.highlightAuto(str).value;
        } catch (__) {}
        return ''; // use external default escaping
    }
});

const app = express();
const port = 80;
const markdownTemplate = 'markdown.html';
const markdownFolder = 'markdown';
const mainPage = 'index.html';

app.use(express.static('public'));

function getMarkdownPages(){
    let pages = fs.readdirSync(markdownFolder);
    let list = "";
    for(let i = 0; i < pages.length; i++){
        page = path.parse(pages[i]);
        if(page.ext == ".md"){
            list += '<li><a href="';
            list += page.base;
            list += '">'
            list += page.name;
            list += '</a></li>';
        }
    }
    return list;
}

function getMainPage(req, res){
    var html = fs.readFileSync(__dirname + "/" + mainPage, 'utf8');
    var $ = cheerio.load(html);
    var pages = getMarkdownPages();
    $('body').append(pages);
    res.send($.html());
}

app.get('/', getMainPage);
app.get('/index.html', getMainPage);


app.get('/:file', function(req, res) {
    var html = fs.readFileSync(__dirname + "/" + markdownTemplate, 'utf8');
    var markdown = fs.readFileSync(__dirname + "/" + markdownFolder + "/" + req.params.file, 'utf8');
    var $ = cheerio.load(html);
    var render = md.render(markdown);
    $('body').append(render);
    res.send($.html());
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})