/**
 * Section Banner block — the blue rounded O2 section header.
 * Field rows (model order): 0 title, 1 text (richtext), 2 image + imageAlt.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const fields = [...block.querySelectorAll(':scope > div')];
  const title = fields[0]?.textContent?.trim() || '';
  const textDiv = fields[1];
  const picture = fields[2]?.querySelector('picture, img');

  block.textContent = '';

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
  block.appendChild(content);

  if (picture) {
    const media = document.createElement('div');
    media.className = 'section-banner__media';
    media.appendChild(picture);
    block.appendChild(media);
  }
}
