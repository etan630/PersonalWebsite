const posts = require('./content/writing.json');
const photography = require('./content/photography.json');
const kitchenPhotos = require('./content/cooking-baking.json');

const chapters = [
    { label: 'Cover', path: '/', view: 'index', description: 'The personal journal and portfolio of Erin Tan.' },
    { label: 'About', path: '/about', view: 'about' },
    { label: 'Projects', path: '/projects', view: 'projects' },
    {
        label: 'Cooking & Baking', tabLabel: 'Kitchen', path: '/cooking-baking', view: 'gallery',
        photos: kitchenPhotos, galleryNote: 'From my kitchen'
    },
    {
        label: 'Photography', path: '/photography', view: 'photography',
        photos: photography
    },
    { label: 'Writing', path: '/writing', view: 'writing' },
    { label: 'Résumé', path: '/resume', view: 'resume' },
    { label: 'Contact', path: '/contact', view: 'contact' }
];

const entries = [...posts].sort((first, second) => second.date.localeCompare(first.date));
const slugs = new Set();
for (const entry of entries) {
    if (typeof entry.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || slugs.has(entry.slug)) {
        throw new Error(`Invalid or duplicate writing entry slug: ${entry.slug}`);
    }
    slugs.add(entry.slug);
}

const writingChapter = chapters.find(chapter => chapter.path === '/writing');
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' });

function pageLocals(chapter, entry) {
    const index = chapters.indexOf(chapter);
    const label = entry?.title || chapter.label;

    return {
        chapter,
        chapters,
        entry,
        entries,
        formatDate: date => dateFormat.format(new Date(date)),
        title: index === 0 ? 'Erin Tan · Personal Journal' : `${label} · Erin Tan`,
        description: entry?.summary || chapter.description || `${label} in Erin Tan’s personal journal.`,
        previous: entry ? writingChapter : chapters[index - 1],
        next: entry ? undefined : chapters[index + 1],
        position: `${String(index + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`
    };
}

module.exports = { chapters, entries, writingChapter, pageLocals };
