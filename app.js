const express = require('express');
const path = require('node:path');
const { chapters, entries, writingChapter, pageLocals } = require('./journal');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

for (const chapter of chapters) {
    app.get(chapter.path, (req, res) => res.render(chapter.view, pageLocals(chapter)));
}

app.get('/writing/:slug', (req, res, next) => {
    const entry = entries.find(post => post.slug === req.params.slug);
    if (!entry) return next();

    res.render('entry', pageLocals(writingChapter, entry));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Journal open at http://localhost:${port}`);
});
