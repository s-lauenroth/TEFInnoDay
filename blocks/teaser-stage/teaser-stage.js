/**
 * Teaser Stage block — the O2 homepage hero stage.
 *
 * Renders a full-width branded stage: gradient/brand background, a product
 * image, an optional pill badge, a headline + subtitle (richtext), a structured
 * price block ("nur 37,49 € monatlich") and a CTA button.
 *
 * Values are read by their data-aue-prop in the Universal Editor, so dialog
 * field order does not matter there. On publish (no data-aue attributes) we fall
 * back to the positional index, which MUST match the model field order:
 *   0  image + imageAlt   (asset + alt)
 *   1  text               (richtext — headline + subtitle)
 *   2  badge              (pill text above the headline)
 *   3  priceprefix        (small label, e.g. "nur")
 *   4  price              (amount, e.g. "37,49 €")
 *   5  pricesuffix        (small label, e.g. "monatlich")
 *   6  ctalabel           (CTA button label)
 *   7  ctalink            (CTA button link)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const childDivs = [...block.querySelectorAll(':scope > div')];
  const assetDiv = childDivs[0];
  const textDiv = childDivs[1];

  const readProp = (prop, index) => {
    const authored = block.querySelector(`:scope > div [data-aue-prop="${prop}"]`);
    if (authored) return authored.textContent.trim();
    return childDivs[index]?.querySelector('div')?.textContent?.trim() || '';
  };

  const badgeText = readProp('badge', 2);
  const pricePrefix = readProp('priceprefix', 3);
  const priceValue = readProp('price', 4);
  const priceSuffix = readProp('pricesuffix', 5);
  const ctaLabel = readProp('ctalabel', 6);

  // CTA link (aem-content) renders as an <a>; find it among the config rows.
  const ctaLinkDiv = childDivs.slice(2).find((d) => d.querySelector('a')) || childDivs[7];
  const ctaLink = ctaLinkDiv?.querySelector('a')?.getAttribute('href')
    || childDivs[7]?.querySelector('div')?.textContent?.trim()
    || '';

  // --- Media column ---
  if (assetDiv) {
    assetDiv.classList.add('teaser-stage__media');
    const pic = assetDiv.querySelector('picture, img');
    if (!pic) assetDiv.classList.add('teaser-stage__media--empty');
  }

  // --- Content column ---
  if (textDiv) {
    textDiv.classList.add('teaser-stage__content');

    // Badge pill above the headline.
    if (badgeText) {
      const badgeEl = document.createElement('span');
      badgeEl.className = 'teaser-stage__badge';
      badgeEl.textContent = badgeText;
      textDiv.prepend(badgeEl);
    }

    // Footer row: price block + CTA.
    const footer = document.createElement('div');
    footer.className = 'teaser-stage__footer';

    if (priceValue) {
      const price = document.createElement('div');
      price.className = 'teaser-stage__price';
      // Split "37,49 €" → big euros + small cents/currency for the O2 look.
      const match = priceValue.match(/^(\d+)(.*)$/);
      const euros = match ? match[1] : priceValue;
      const rest = match ? match[2].trim() : '';
      const labelHtml = pricePrefix ? `<span class="teaser-stage__price-label">${pricePrefix}</span>` : '';
      const centsHtml = rest ? `<span class="teaser-stage__price-cents">${rest}</span>` : '';
      const suffixHtml = priceSuffix ? `<span class="teaser-stage__price-suffix">${priceSuffix}</span>` : '';
      price.innerHTML = `${labelHtml}<span class="teaser-stage__price-amount"><span class="teaser-stage__price-euros">${euros}</span>${centsHtml}</span>${suffixHtml}`;
      footer.appendChild(price);
    }

    if (ctaLabel && ctaLink) {
      const anchor = document.createElement('a');
      anchor.className = 'button teaser-stage__cta';
      anchor.href = ctaLink;
      anchor.title = ctaLabel;
      anchor.textContent = ctaLabel;
      footer.appendChild(anchor);
    }

    if (footer.childElementCount > 0) textDiv.appendChild(footer);
  }

  // --- Hide all configuration-only rows (everything after asset + text) ---
  childDivs.forEach((div, index) => {
    if (index > 1 && div) div.style.display = 'none';
  });
}
