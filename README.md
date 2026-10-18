# Klean Cups website

A static storefront (plain HTML, CSS and JavaScript, no build step) with a working purchase flow: home, shop, product pages, cart, checkout and order confirmation. Pages switch by URL hash (`#shop`, `#product-dark`, `#cart`, `#checkout`, `#confirmation`), so it runs from any static host.

## Files

- `index.html`: every page of the site
- `css/style.css`: all styling
- `js/config.js`: **the file you edit** (brand name, Formspree endpoint, prices, roasts, shipping)
- `js/app.js`: cart, product options, checkout and confirmation logic
- `assets/`: photos, white-background packshots for each product, the logo (`img/logo.svg`, `img/favicon.svg`) and a short muted video loop
- `tools/build_preview.py`: rebuilds the one-file preview used for the Claude Artifact

## Connect Formspree

Connected: `formspreeEndpoint` in `js/config.js` is set to `https://formspree.io/f/xjygzbla`. To use a different form, paste its endpoint there.

Each placed order is then posted to Formspree with: order ID, email, name, shipping address, phone, marketing opt-in, line items, whether it includes a subscription, shipping method, subtotal, shipping, total, card brand and time. Card number, expiry and security code are never sent. While the endpoint is empty, checkout still completes and logs the order to the browser console instead.

## Rename the brand

Change `brandName` in `js/config.js`. It updates the header, footer, boxes, page title and the Formspree email subject. The kitchen photo (`assets/img/hero-kitchen.jpg`) and the pod photo (`assets/img/kpod.jpg`) have "Klean Cups" printed on the packaging, so replace those images when the name is final.

## Run or deploy

- Locally: `python3 -m http.server` in this folder, then open http://localhost:8000.
- Live: drag this folder onto Netlify Drop, or push it to GitHub Pages, Cloudflare Pages or Vercel. No server is needed.

## Placeholders to settle before launch

- Prices ($25.32 per 12-pod box at $2.11/pod, $69.84 for 36 at $1.94/pod), shipping rates, the 10% subscription discount.
- Tasting notes and intensity for each roast.
- Material and compatibility copy ("zero plastic in the pod, lid or filter", "fits Keurig K-Cup pod brewers") should match the final pod spec. The "What it's made of" parts list (`materials` in `js/config.js`) is a draft spec.
- Payment notice on checkout and the confirmation note both say no card is charged. Edit `paymentNotice` and `confirmationNote` when real payments are added.
