# Christian Mapili — Personal IT Portfolio

A responsive, frontend-only portfolio for Christian Israel S. Mapili, a third-year BSIT student at Northeastern College. Built with semantic HTML, CSS, and vanilla JavaScript. No package installation, build step, backend, or credentials are required.

## Run locally

From this checkout:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open port 8000 in your own browser. The site can also be opened directly via `index.html`. All local asset paths are relative and work under a GitHub Pages repository subpath. DM Sans and Manrope are optional Google Fonts; system fonts are used when offline or blocked.

## Structure

- `index.html`: six sections, navigation, contact links, and preview dialog
- `styles.css`: theme tokens, responsive layouts, focus styles, reduced-motion support
- `data.js`: project copy, objectives, certificate categories, and 12 provisional certificate records
- `script.js`: mobile navigation, active links, certificate filters, previews, reveal effects
- `assets/images/`: favicon and future genuine profile/project images
- `assets/certificates/`: future genuine certificate images

## Update the content

Edit `data.js` for certificates and project objectives. Edit `index.html` for personal introduction, about copy, skills, and contact information. Theme colors and font choices are CSS custom properties at the start of `styles.css`.

### Add real certificates

1. Compare each provisional title and issuer in `data.js` against the original record, correcting it as needed.
2. Put a web-friendly image (PNG, JPG, WebP, or SVG) in `assets/certificates/`. Choose short, lowercase, hyphenated names. Check for personal details before making files public.
3. Set the matching record’s `image` to its relative path, for example `assets/certificates/computer-systems-servicing.jpg`.
4. Set `imageAlt` to a concise description of the actual certificate. Add `date` only when known, using an actual `YYYY-MM-DD` date; otherwise leave it `null`.
5. Reload the page. The image and preview action appear automatically. Missing images hide their preview action. The modal supports Escape, close button, backdrop dismissal, focus containment, and focus restoration.

No certificate artwork or verification badges are generated. A missing `image` shows a text record without a preview button. The in-progress cybersecurity course is deliberately separate from certificate records. Do not move it into the gallery unless completion is confirmed.

### Add a real profile photo

Put the genuine photo in `assets/images/profile.jpg`. Replace the `.monogram` element in `index.html` with:

```html
<img
  class="profile-photo"
  src="assets/images/profile.jpg"
  alt="Christian Israel S. Mapili"
  width="600"
  height="600"
/>
```

Add this CSS, adjusting crop position to suit the photo:

```css
.profile-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.portrait-frame:has(.profile-photo)::after {
  display: none;
}
.portrait-frame:has(.profile-photo) .portrait-top,
.portrait-frame:has(.profile-photo) .portrait-bottom {
  background: #0b131fcc;
  border-radius: 4px;
  padding: 6px;
}
```

Keep the initials until a real photo is available. To add a genuine ETDMS screenshot, replace the content of `.project-visual` with an image and accurate caption, removing the concept placeholder caption. Do not imply that planned objectives are completed.

## Validation

There is no build process. Check JavaScript syntax with:

```sh
node --check data.js
node --check script.js
```

Browser checks should cover desktop, tablet, and mobile widths; all provider filters (12 / 1 / 4 / 4 / 2 / 1 records); menu open/close and Escape; keyboard navigation; reduced motion; working anchors, email, and GitHub links; and horizontal overflow. Preview behavior can be checked after adding a real image. Do not publish test fixtures as credentials.

## Publish to GitHub Pages — after your review

Nothing is deployed automatically. Review the content and provisional certificate titles first.

1. Commit the site files and push them to `main` on `ezryheneral/my-portfolio` after approving the work.
2. In the GitHub repository, open **Settings → Pages**.
3. Select **Deploy from a branch**, choose **main** and **/ (root)**, and save.
4. Wait for GitHub’s Pages deployment to finish, then open the URL GitHub provides and recheck navigation and assets.

No workflow, build tooling, custom domain, or secret is needed for this static site.

### Implementation verification

Verified in headless Chromium with Playwright:

- All six sections, anchor targets, email/GitHub destinations, and all six provider filters.
- No horizontal overflow at 320, 390, 760, 768, 1024, and 1440 pixels; desktop and mobile screenshots visually inspected.
- Mobile menu open, link selection, Escape dismissal, and active navigation state.
- Preview focus containment/restoration, Escape, close-button and backdrop dismissal, optional dates, and missing-image fallbacks. Temporary browser-only test fixtures were used; no certificate images were added.
- Reduced-motion behavior, keyboard skip link, and no JavaScript runtime errors.
- axe-core WCAG A/AA automated checks at desktop/mobile sizes and with the mobile menu and preview open: zero detected violations. Automated checks do not replace a full manual accessibility audit.
- Relative assets and interactions under `/my-portfolio/`, JavaScript syntax, unique HTML IDs, and whitespace checks.

Test tools were installed outside the checkout and are not site dependencies. Real certificate contents, dates, and titles still require review against the original records.
