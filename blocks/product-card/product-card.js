/**
 * Product Card block — O2 product tile carousel.
 *
 * Container block: each direct child <div> is one product item whose field rows
 * (in model order) are:
 *   0 image + imageAlt   (foreground product image — ideally a transparent PNG)
 *   1 energyBadge        (energy-efficiency letter, e.g. "A")
 *   2 promoPill          (highlight pill, e.g. "0,- € Anschlusspreis")
 *   3 title
 *   4 features           (richtext bullet list)
 *   5 pricePrefix        ("nur")
 *   6 price              ("67,49 €")
 *   7 priceSuffix        ("monatlich")
 *   8 ctaLabel
 *   9 ctaLink
 *   10 bgImage           (background image behind the product; optional, last)
 *
 * With a bgImage the foreground image is shown contained (transparent product on
 * the background); without one it fills the tile (works with baked-in-background
 * teaser images).
 *
 * @param {Element} block
 */
function buildPrice(pricePrefix, price, priceSuffix) {
  const wrap = document.createElement('div');
  wrap.className = 'product-card__price';
  const match = price.match(/^(\D*)(\d+)(.*)$/);
  const lead = match ? match[1] : '';
  const euros = match ? match[2] : price;
  const rest = match ? match[3].trim() : '';
  const prefixHtml = pricePrefix ? `<span class="product-card__price-label">${pricePrefix}</span>` : '';
  const centsHtml = rest ? `<span class="product-card__price-cents">${rest}</span>` : '';
  const suffixHtml = priceSuffix ? `<span class="product-card__price-suffix">${priceSuffix}</span>` : '';
  wrap.innerHTML = `${prefixHtml}<span class="product-card__price-amount">${lead}<span class="product-card__price-euros">${euros}</span>${centsHtml}</span>${suffixHtml}`;
  return wrap;
}

function buildCard(item) {
  const fields = [...item.querySelectorAll(':scope > div')];
  const text = (i) => fields[i]?.textContent?.trim() || '';
  const fgPic = fields[0]?.querySelector('picture, img');
  const energyBadge = text(1);
  const promoPill = text(2);
  const title = text(3);
  const featuresDiv = fields[4];
  const pricePrefix = text(5);
  const price = text(6);
  const priceSuffix = text(7);
  const ctaLabel = text(8);
  const ctaLink = fields[9]?.querySelector('a')?.getAttribute('href') || text(9);
  const bgPic = fields[10]?.querySelector('picture, img');

  item.className = 'product-card__item';
  item.textContent = '';

  const media = document.createElement('div');
  media.className = 'product-card__media';
  if (bgPic) {
    media.classList.add('product-card__media--custombg');
    bgPic.classList.add('product-card__bg');
    media.appendChild(bgPic);
  }
  if (fgPic) {
    fgPic.classList.add('product-card__fg');
    media.appendChild(fgPic);
  }
  if (energyBadge) {
    const badge = document.createElement('span');
    badge.className = 'product-card__energy';
    badge.textContent = energyBadge;
    media.appendChild(badge);
  }
  item.appendChild(media);

  const body = document.createElement('div');
  body.className = 'product-card__body';
  if (promoPill) {
    const pill = document.createElement('span');
    pill.className = 'product-card__pill';
    pill.textContent = promoPill;
    body.appendChild(pill);
  }
  if (title) {
    const heading = document.createElement('h3');
    heading.className = 'product-card__title';
    heading.textContent = title;
    body.appendChild(heading);
  }
  if (featuresDiv && featuresDiv.textContent.trim()) {
    featuresDiv.className = 'product-card__features';
    body.appendChild(featuresDiv);
  }
  if (price) body.appendChild(buildPrice(pricePrefix, price, priceSuffix));
  if (ctaLabel && ctaLink) {
    const anchor = document.createElement('a');
    anchor.className = 'product-card__cta';
    anchor.href = ctaLink;
    anchor.textContent = ctaLabel;
    body.appendChild(anchor);
  }
  item.appendChild(body);
}

/* Scroll the track to a clamped target with native smooth scrolling. */
function scrollTrack(el, to) {
  const max = el.scrollWidth - el.clientWidth;
  const target = Math.max(0, Math.min(to, max));
  el.scrollTo({ left: target, behavior: 'smooth' });
}

export default function decorate(block) {
  const items = [...block.querySelectorAll(':scope > div')];
  items.forEach(buildCard);

  // Wrap items in a scrollable track with prev/next arrows.
  const track = document.createElement('div');
  track.className = 'product-card__track';
  items.forEach((item) => track.appendChild(item));

  const makeNav = (dir) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `product-card__nav product-card__nav--${dir}`;
    btn.setAttribute('aria-label', dir === 'prev' ? 'Vorherige' : 'Nächste');
    btn.addEventListener('click', () => {
      const card = track.querySelector('.product-card__item');
      const step = card ? card.getBoundingClientRect().width + 24 : 300;
      scrollTrack(track, track.scrollLeft + (dir === 'prev' ? -step : step));
    });
    return btn;
  };

  const prev = makeNav('prev');
  const next = makeNav('next');

  const updateNav = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    prev.disabled = track.scrollLeft <= 0;
    next.disabled = track.scrollLeft >= maxScroll;
    const overflowing = track.scrollWidth > track.clientWidth + 2;
    block.classList.toggle('product-card--static', !overflowing);
  };
  track.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);

  block.textContent = '';
  block.append(prev, track, next);
  requestAnimationFrame(updateNav);
}
