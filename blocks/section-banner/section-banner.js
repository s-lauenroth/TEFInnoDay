/**
 * Section Banner block — the blue rounded O2 section header, with an optional
 * background image, a foreground image (e.g. transparent product thumbnails)
 * and a brand-filter tab row below it.
 * Field rows (model order):
 *   0 title
 *   1 text
 *   2 tabs (comma-separated)
 *   3 image + imageAlt (foreground; optional)
 *   4 bgImage (background; optional, last — falls back to the blue bubble gradient)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const fields = [...block.querySelectorAll(':scope > div')];
  const title = fields[0]?.textContent?.trim() || '';
  const textDiv = fields[1];
  const tabs = (fields[2]?.textContent?.trim() || '')
    .split(',').map((t) => t.trim()).filter(Boolean);
  const fgPic = fields[3]?.querySelector('picture, img');
  const bgPic = fields[4]?.querySelector('picture, img');

  block.textContent = '';

  const bar = document.createElement('div');
  bar.className = 'section-banner__bar';
  if (bgPic) {
    bar.classList.add('section-banner__bar--custombg');
    bgPic.classList.add('section-banner__bg');
    bar.appendChild(bgPic);
  }

  const content = document.createElement('div');
  content.className = 'section-banner__content';
  if (title) {
    const heading = document.createElement('h2');
    heading.className = 'section-banner__title';
    heading.textContent = title;
    content.appendChild(heading);
  }
  if (textDiv && textDiv.textContent.trim()) {
    textDiv.className = 'section-banner__text';
    content.appendChild(textDiv);
  }
  bar.appendChild(content);

  if (fgPic) {
    const media = document.createElement('div');
    media.className = 'section-banner__media';
    media.appendChild(fgPic);
    bar.appendChild(media);
  }
  block.appendChild(bar);

  if (tabs.length) {
    const tabBar = document.createElement('div');
    tabBar.className = 'section-banner__tabs';
    tabs.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `section-banner__tab${i === 0 ? ' is-active' : ''}`;
      btn.textContent = label;
      tabBar.appendChild(btn);
    });
    block.appendChild(tabBar);
  }
}
