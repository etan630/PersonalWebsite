const fs = require('node:fs/promises');
const path = require('node:path');
const ejs = require('ejs');
const { chapters, entries, writingChapter, pageLocals } = require('./journal');

const output = path.join(__dirname, 'dist');

async function render(route, chapter, entry) {
    const view = entry ? 'entry' : chapter.view;
    const folder = path.join(output, route);
    const html = await ejs.renderFile(path.join(__dirname, 'views', `${view}.ejs`), pageLocals(chapter, entry));
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(path.join(folder, 'index.html'), html);
}

async function build() {
    await fs.rm(output, { recursive: true, force: true });
    await fs.cp(path.join(__dirname, 'public'), output, {
        recursive: true,
        filter: source => path.basename(source) !== '.DS_Store'
    });

    for (const chapter of chapters) {
        await render(chapter.path, chapter);
    }
    for (const entry of entries) {
        await render(`/writing/${entry.slug}`, writingChapter, entry);
    }

    console.log(`Built ${chapters.length + entries.length} journal pages in dist/.`);
}

build().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
