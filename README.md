# Erin Tan’s journal

Run `npm install` and `npm start` to open the site at http://localhost:3000. Run `npm run build` to create a static site in `dist/` for hosting at the root of a domain.

## Add photographs

Place the image in `public/` and add a record to `content/photography.json` for Photography or `content/cooking-baking.json` for Cooking & Baking. Use its site path for `src`, the visible title for `caption`, and a short visual description for `alt`. Each gallery displays photos in file order.

Use the optional `excerpt` field to write about a photo. It appears beside the expanded image on wider screens and below it on smaller screens. Use `\n\n` between paragraphs. The Japanese Tea Garden record already has an empty `excerpt` field ready to fill in.

## Publish a journal entry

Add an object to the array in `content/writing.json`. Entries appear newest first. Use a unique slug with lowercase letters, digits, and hyphens. The slug becomes the last part of the link, for example `/writing/a-new-entry`.

```json
{
  "slug": "a-new-entry",
  "title": "A new entry",
  "date": "2026-11-17",
  "summary": "A short description for the writing archive.",
  "paragraphs": ["The first paragraph.", "The second paragraph."]
}
```

Restart the server after editing a content file, or rebuild `dist/` for static hosting.
