/**
 * Promo Banner block — wide O2 promo band (image + headline + price + CTA).
 * Field rows (model order):
 *   0 image + imageAlt
 *   1 title
 *   2 text (richtext)
 *   3 price       ("14,99 €")
 *   4 priceSuffix ("mtl.")
 *   5 ctaLabel
 *   6 ctaLink
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const fields = [...block.querySelectorAll(':scope > div')];
  const picture = fields[0]?.querySelector('picture, img');
  const title = fields[1]?.textContent?.trim() || '';
  const textDiv = fields[2];
  const price = fields[3]?.textContent?.trim() || '';
  const priceSuffix = fields[4]?.textContent?.trim() || '';
  const ctaLabel = fields[5]?.textContent?.trim() || '';
  const ctaLink = fields[6]?.querySelector('a')?.getAttribute('href') || fields[6]?.textContent?.trim() || '';

  block.textContent = '';

  const content = document.createElement('div');
  content.className = 'promo-banner__content';
  if (title) {
    const heading = document.createElement('h2');
    heading.className = 'promo-banner__title';
    heading.textContent = title;
    content.appendChild(heading);
  }
  if (textDiv && textDiv.textContent.trim()) {
    textDiv.className = 'promo-banner__text';
    content.appendChild(textDiv);
  }
  if (price) {
    const priceEl = document.createElement('div');
    priceEl.className = 'promo-banner__price';
    const match = price.match(/^(\D*)(\d+)(.*)$/);
    const lead = match ? match[1] : '';
    const euros = match ? match[2] : price;
    const rest = match ? match[3].trim() : '';
    priceEl.innerHTML = `<span class="promo-banner__price-amount">${lead}<span class="promo-banner__price-euros">${euros}</span>${rest ? `<span class="promo-banner__price-cents">${rest}</span>` : ''}</span>${priceSuffix ? `<span class="promo-banner__price-suffix">${priceSuffix}</span>` : ''}`;
    content.appendChild(priceEl);
  }
  if (ctaLabel && ctaLink) {
    const anchor = document.createElement('a');
    anchor.className = 'button promo-banner__cta';
    anchor.href = ctaLink;
    anchor.textContent = ctaLabel;
    content.appendChild(anchor);
  }

  if (picture) {
    const media = document.createElement('div');
    media.className = 'promo-banner__media';
    media.appendChild(picture);
    block.appendChild(media);
  }
  block.appendChild(content);
}
