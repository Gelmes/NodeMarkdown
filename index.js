const express = require('express');
const fs = require('fs');
const cheerio = require('cheerio');
const app = express();
var hljs = require('highlight.js'); // https://highlightjs.org/
var md = require('markdown-it')({
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

const port = 80;
const markdownTemplate = '/public/markdown.html';
const markdownFolder = '/markdown/';

app.use(express.static('public'));

app.get('/:file', function(req, res) {
    var html = fs.readFileSync(__dirname + markdownTemplate, 'utf8');
    var markup = fs.readFileSync(__dirname + markdownFolder + req.params.file, 'utf8');
    var $ = cheerio.load(html);
    var render = md.render(markup);
    $('body').append(render);
    res.send($.html());
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})