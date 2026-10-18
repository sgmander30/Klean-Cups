(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ---------- storage (falls back to memory when the browser blocks it) ----------
  var mem = {};
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return key in mem ? mem[key] : fallback; }
  }
  function save(key, val) {
    mem[key] = val;
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* memory only */ }
  }

  // ---------- helpers ----------
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: S.currency });
  function fmt(n) { return money.format(n); }
  function round2(n) { return Math.round(n * 100) / 100; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function product(id) { return S.products.filter(function (p) { return p.id === id; })[0]; }
  function sizesFor(p) { return p.fixedSize ? [p.fixedSize] : S.sizes; }
  function sizeFor(p, sizeId) { return sizesFor(p).filter(function (s) { return s.id === sizeId; })[0] || sizesFor(p)[0]; }

  // ---------- brand name ----------
  function applyBrand() {
    $$("[data-brand]").forEach(function (el) { el.textContent = S.brandName; });
    document.title = S.brandName + " · Hold the Plastic";
  }

  // ---------- the box (CSS version of the packaging) ----------
  function cupIcon() {
    return '<svg class="pkg-cup" viewBox="0 0 40 40" aria-hidden="true"><path d="M9 11h22l-3 22a3 3 0 0 1-3 2.6H15A3 3 0 0 1 12 33Z" fill="#fff"/><ellipse cx="20" cy="11" rx="11" ry="3.4" fill="#151313"/><path d="M33 4l1.2 3.3L37.5 8.5l-3.3 1.2L33 13l-1.2-3.3L28.5 8.5l3.3-1.2Z" fill="#fff"/></svg>';
  }
  function boxHTML(p, size) {
    var pods = size ? size.pods : 12;
    if (p.bundle) {
      return '<div class="pkg-stack">' + p.bundle.map(function (id) { return boxHTML(product(id)); }).join("") + "</div>";
    }
    return '<div class="pkg" style="--roast:' + p.color + '">' +
      '<div class="pkg-in">' +
        '<div class="pkg-brand"><span>' + esc(S.brandName) + "</span></div>" +
        '<div class="pkg-mark"><span class="pkg-script">Hold the</span><span class="pkg-word">PLASTIC</span><i class="pkg-strike"></i></div>' +
        '<div class="pkg-tag">One coffee. Nothing else.</div>' +
        '<div class="pkg-row">' +
          '<span class="pkg-coin"><b>' + Math.min(pods, 12) + "</b><small>PODS</small></span>" +
          '<span class="pkg-diamond">' + cupIcon() + "<em>" + esc(p.name) + "</em></span>" +
          '<span class="pkg-coin"><b>0</b><small>PLASTIC</small></span>' +
        "</div>" +
        '<div class="pkg-foot"><span>FOR KEURIG® BREWERS</span><span>12 PODS</span></div>' +
      "</div></div>";
  }
  function intensityHTML(n) {
    if (!n) return "";
    var dots = "";
    for (var i = 1; i <= 5; i++) dots += '<i class="' + (i <= n ? "on" : "") + '"></i>';
    return '<span class="intensity" aria-label="Intensity ' + n + ' of 5"><span>Intensity</span>' + dots + "</span>";
  }

  // ---------- lineup / menu ----------
  function priceHTML(n) {
    var parts = n.toFixed(2).split(".");
    return '<sup>$</sup>' + parts[0] + "<sup>" + parts[1] + "</sup>";
  }
  function cardPrice(p, s) {
    return '<span class="tile-price">' + priceHTML(s.price) + '</span><span class="tile-perpod">' + fmt(s.price / s.pods) + " per pod</span>";
  }
  // Retail-style tile: packshot, brand line, name, size chips, price, Buy now.
  function cardHTML(p) {
    var sizes = sizesFor(p);
    return '<article class="tile" data-tile="' + p.id + '" style="--roast:' + p.color + '">' +
      '<a class="tile-img" href="#product-' + p.id + '"><img src="' + p.packshot + '" alt="' + esc(p.name) + ' box and pod" loading="lazy"></a>' +
      '<p class="tile-brand">' + esc(S.brandName) + "</p>" +
      '<h3 class="tile-name"><a href="#product-' + p.id + '">' + esc(p.name) + "</a></h3>" +
      '<div class="chips" role="group" aria-label="Pack size">' + sizes.map(function (s, i) {
        return '<button type="button" class="chip' + (i === 0 ? " on" : "") + '" data-chip="' + s.id + '" aria-pressed="' + (i === 0) + '">' + s.pods + " ct.</button>";
      }).join("") + "</div>" +
      '<div class="tile-pricing">' + cardPrice(p, sizes[0]) + "</div>" +
      '<button class="btn-buy" type="button" data-buy="' + p.id + '">Buy now</button>' +
    "</article>";
  }
  function renderNews() {
    if (!S.news) return;
    var html = S.news.map(function (n) {
      return '<a class="news-card" href="' + esc(n.url) + '" target="_blank" rel="noopener">' +
        '<span class="news-img" data-outlet="' + esc(n.outlet) + '"><img src="' + esc(n.image) + '" alt="" loading="lazy" referrerpolicy="no-referrer"></span>' +
        '<span class="news-meta"><b>' + esc(n.kind) + "</b> " + esc(n.outlet) + " · " + esc(n.date) + "</span>" +
        '<span class="news-title">' + esc(n.title) + "</span>" +
        '<span class="news-go">Read article ↗</span>' +
      "</a>";
    }).join("");
    $$("[data-news]").forEach(function (root) { root.innerHTML = html; });
    // If an outlet blocks its preview image, show the outlet name instead of a broken image.
    $$(".news-img img").forEach(function (img) {
      img.addEventListener("error", function () { img.parentNode.classList.add("no-img"); img.remove(); });
    });
  }
  function renderLineups() {
    var singles = S.products.filter(function (p) { return !p.bundle; });
    $("#home-lineup").innerHTML = singles.map(cardHTML).join("");
    $("#shop-lineup").innerHTML = S.products.map(cardHTML).join("");
    $("#menu-list").innerHTML = S.products.map(function (p) {
      return sizesFor(p).map(function (s) {
        return '<li><a href="#product-' + p.id + '"><span class="menu-item">' + esc(p.name) + " <small>" + s.pods + " pods</small></span>" +
          '<span class="menu-dots" aria-hidden="true"></span><span class="menu-price">' + fmt(s.price) + "</span></a></li>";
      }).join("");
    }).join("");
  }

  // ---------- cart ----------
  var cart = load("kc_cart", []);
  function lineKey(l) { return [l.id, l.size, l.plan, l.freq].join("|"); }
  function unitPrice(l) {
    var base = sizeFor(product(l.id), l.size).price;
    return l.plan === "sub" ? round2(base * (1 - S.subscribeDiscount)) : base;
  }
  // Newsletter 10% applies to one-time items only; subscriptions already get their own 10%, so the two never stack.
  function joined() { return !!load("kc_newsletter", null); }
  function totals(method) {
    var sub = round2(cart.reduce(function (t, l) { return t + unitPrice(l) * l.qty; }, 0));
    var compare = round2(cart.reduce(function (t, l) { return t + sizeFor(product(l.id), l.size).price * l.qty; }, 0));
    var once = cart.reduce(function (t, l) { return l.plan === "sub" ? t : t + unitPrice(l) * l.qty; }, 0);
    var nl = joined() ? round2(once * S.newsletterDiscount) : 0;
    var m = S.shipping[method || "standard"];
    var ship = cart.length === 0 ? 0 : (method === "express" ? m.price : (sub - nl >= S.freeShippingMin ? 0 : m.price));
    return { subtotal: sub, savings: round2(compare - sub), newsletter: nl, shipping: ship, total: round2(sub - nl + ship) };
  }
  function nlRow(t) {
    return t.newsletter > 0 ? '<div class="save"><dt>Newsletter 10% off</dt><dd>−' + fmt(t.newsletter) + "</dd></div>" : "";
  }
  function count() { return cart.reduce(function (t, l) { return t + l.qty; }, 0); }
  function commit() {
    cart = cart.filter(function (l) { return l.qty > 0 && product(l.id); });
    save("kc_cart", cart);
    var c = count();
    var badge = $("#cart-count");
    badge.textContent = c;
    badge.classList.toggle("has", c > 0);
  }
  function addToCart(line) {
    var existing = cart.filter(function (l) { return lineKey(l) === lineKey(line); })[0];
    if (existing) existing.qty = Math.min(existing.qty + line.qty, 20);
    else cart.push(line);
    commit();
    var p = product(line.id);
    toast(esc(p.name) + " added to your cart. <a href=\"#cart\">View cart</a>");
    var badge = $("#cart-count");
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  }
  function lineDesc(l) {
    var p = product(l.id), s = sizeFor(p, l.size);
    var d = s.pods + " pods (" + s.label + ")";
    if (l.plan === "sub") d += " · Subscribe, every " + l.freq + " weeks";
    return d;
  }

  function renderCart() {
    var root = $("#cart-body");
    if (!cart.length) {
      root.innerHTML = '<div class="empty"><p>Your cart is empty. The coffee is not.</p><a class="btn btn-red" href="#shop">See the menu</a></div>';
      return;
    }
    var t = totals("standard");
    var left = round2(S.freeShippingMin - (t.subtotal - t.newsletter));
    var pct = Math.min(100, Math.round((t.subtotal - t.newsletter) / S.freeShippingMin * 100));
    root.innerHTML =
      '<div class="cart-grid">' +
        '<ul class="cart-lines">' + cart.map(function (l, i) {
          var p = product(l.id);
          return '<li class="cart-line">' +
            '<a class="cart-thumb" href="#product-' + p.id + '">' + boxHTML(p) + "</a>" +
            '<div class="cart-info"><h3>' + esc(p.name) + "</h3><p>" + esc(lineDesc(l)) + "</p>" +
              '<div class="qty" role="group" aria-label="Quantity">' +
                '<button type="button" data-dec="' + i + '" aria-label="One fewer">−</button>' +
                "<span>" + l.qty + "</span>" +
                '<button type="button" data-inc="' + i + '" aria-label="One more">+</button>' +
              "</div>" +
              '<button class="link-btn" type="button" data-remove="' + i + '">Remove</button>' +
            "</div>" +
            '<div class="cart-price">' + fmt(unitPrice(l) * l.qty) + "</div>" +
          "</li>";
        }).join("") + "</ul>" +
        '<aside class="summary">' +
          '<div class="ship-meter"><p>' + (left > 0 ? "You're " + fmt(left) + " away from free shipping." : "You've got free shipping.") + "</p>" +
            '<div class="meter"><i style="width:' + pct + '%"></i></div></div>' +
          '<dl class="sum">' +
            "<div><dt>Subtotal</dt><dd>" + fmt(t.subtotal) + "</dd></div>" +
            (t.savings > 0 ? '<div class="save"><dt>Subscription savings (included)</dt><dd>−' + fmt(t.savings) + "</dd></div>" : "") +
            nlRow(t) +
            "<div><dt>Shipping</dt><dd>" + (t.shipping ? fmt(t.shipping) : "Free") + "</dd></div>" +
            '<div class="sum-total"><dt>Total</dt><dd>' + fmt(t.total) + "</dd></div>" +
          "</dl>" +
          '<a class="btn btn-red btn-block" href="#checkout">Check out</a>' +
          '<a class="link-btn center" href="#shop">Keep shopping</a>' +
        "</aside>" +
      "</div>";
  }

  // ---------- what it's made of ----------
  function podDiagram() {
    // Exploded pod: 1 lid, 2 filter, 3 cup. Numbers match the parts list.
    return '<svg class="pod-diagram" viewBox="0 0 220 300" role="img" aria-label="Exploded view of the pod: lid, filter and cup">' +
      '<ellipse cx="110" cy="40" rx="62" ry="14" fill="#F6EFE3" stroke="#C8242A" stroke-width="2"/>' +
      '<ellipse cx="110" cy="40" rx="50" ry="10" fill="none" stroke="#C8242A" stroke-width="1"/>' +
      '<path d="M66 92 Q110 84 154 92 L130 168 Q110 176 90 168 Z" fill="#EADCC3" stroke="#8A7A66" stroke-width="1.5"/>' +
      '<path d="M76 104 Q110 98 144 104 M84 128 Q110 123 136 128 M92 150 Q110 146 128 150" fill="none" stroke="#B8A68C" stroke-width="1"/>' +
      '<path d="M52 200 L168 200 L154 286 Q110 296 66 286 Z" fill="#E3D6C2" stroke="#8A7A66" stroke-width="1.5"/>' +
      '<ellipse cx="110" cy="200" rx="58" ry="12" fill="#D5C4AA" stroke="#8A7A66" stroke-width="1.5"/>' +
      '<g font-family="Oswald, Arial Narrow, sans-serif" font-size="14" font-weight="600" text-anchor="middle">' +
        '<circle cx="196" cy="40" r="12" fill="#C8242A"/><text x="196" y="45" fill="#fff">1</text>' +
        '<circle cx="196" cy="128" r="12" fill="#C8242A"/><text x="196" y="133" fill="#fff">2</text>' +
        '<circle cx="196" cy="244" r="12" fill="#C8242A"/><text x="196" y="249" fill="#fff">3</text>' +
      "</g>" +
      '<path d="M174 40 H184 M150 128 H184 M162 244 H184" stroke="#C8242A" stroke-width="1.5"/>' +
    "</svg>";
  }
  function madeOfHTML() {
    if (!S.materials) return "";
    return '<section class="made-of" aria-labelledby="made-of-title">' +
      '<div class="made-of-head"><p class="eyebrow">Every pod, every roast</p><h2 id="made-of-title">What it\'s made of</h2>' +
        '<p class="made-of-note">' + esc(S.materialsNote) + "</p></div>" +
      '<div class="made-of-body">' + podDiagram() +
        '<ol class="parts">' + S.materials.map(function (m, i) {
          return '<li' + (i > 2 ? ' class="extra"' : "") + '><span class="part-name">' + esc(m.part) + "</span>" +
            '<span class="part-mat">' + esc(m.material) + "</span><span class=\"part-detail\">" + esc(m.detail) + "</span></li>";
        }).join("") + "</ol>" +
      "</div>" +
      (S.certifications && S.certifications.length ?
        '<div class="certs"><h3>Certifications we\'re working toward</h3><ul>' + S.certifications.map(function (c) {
          return '<li><span class="cert-seal" aria-hidden="true"></span><span><b>' + esc(c.name) + "</b><small>" + esc(c.by) + '</small></span><em>' + esc(c.status) + "</em></li>";
        }).join("") + "</ul></div>" : "") +
    "</section>";
  }

  // ---------- product page ----------
  function renderProduct(id) {
    var p = product(id);
    if (!p) { location.hash = "#shop"; return; }
    var sizes = sizesFor(p);
    var root = $("#pdp");
    root.style.setProperty("--roast", p.color);
    root.innerHTML =
      '<div class="pdp-top">' +
      '<div class="pdp-media">' +
        '<div class="pdp-shot"><img src="' + p.packshot + '" alt="' + esc(p.name) + ' box and pod"></div>' +
        (p.photo ? '<figure class="pdp-photo frame"><img src="' + p.photo + '" alt="" loading="lazy"></figure>' : "") +
      "</div>" +
      '<form class="pdp-info" id="pdp-form">' +
        '<p class="eyebrow">Plastic-free pods · 12 per box</p>' +
        "<h1>" + esc(p.name) + "</h1>" +
        intensityHTML(p.intensity) +
        '<p class="pdp-notes">' + esc(p.notes) + "</p>" +
        '<p class="pdp-blurb">' + esc(p.blurb) + "</p>" +
        '<p class="pdp-price" id="pdp-price"></p>' +
        (sizes.length > 1 ?
          '<fieldset class="opt-group"><legend>Size</legend><div class="pills">' + sizes.map(function (s, i) {
            return '<label class="pill"><input type="radio" name="size" value="' + s.id + '"' + (i === 0 ? " checked" : "") + "><span>" + s.pods + " pods<small>" + fmt(s.price) + " · " + fmt(s.price / s.pods) + "/pod</small></span></label>";
          }).join("") + "</div></fieldset>"
          : '<input type="hidden" name="size" value="' + sizes[0].id + '">') +
        '<fieldset class="opt-group"><legend>How often</legend>' +
          '<label class="plan"><input type="radio" name="plan" value="once" checked><span><b>One-time purchase</b></span></label>' +
          '<label class="plan"><input type="radio" name="plan" value="sub"><span><b>Subscribe and save ' + Math.round(S.subscribeDiscount * 100) + '%</b><small>Skip or cancel anytime</small></span></label>' +
          '<div class="freq" id="freq" hidden><label for="freq-select">Deliver every</label><select id="freq-select" name="freq"><option value="2">2 weeks</option><option value="4" selected>4 weeks</option><option value="6">6 weeks</option></select></div>' +
        "</fieldset>" +
        '<div class="buy-row">' +
          '<div class="qty" role="group" aria-label="Quantity"><button type="button" data-pdp-dec aria-label="One fewer">−</button><span id="pdp-qty">1</span><button type="button" data-pdp-inc aria-label="One more">+</button></div>' +
          '<button class="btn btn-red grow" type="submit">Add to cart</button>' +
        "</div>" +
        '<ul class="pdp-facts"><li><b>Ingredients</b> Coffee. That\'s it.</li><li><b>Fits</b> Keurig® K-Cup® pod brewers</li><li><b>Plastic</b> None. Not in the pod, lid or filter.</li></ul>' +
      "</form>" +
      "</div>" +
      madeOfHTML();

    var form = $("#pdp-form"), qty = 1;
    function update() {
      var s = sizeFor(p, form.size.value);
      var sub = form.plan.value === "sub";
      var price = sub ? round2(s.price * (1 - S.subscribeDiscount)) : s.price;
      $("#pdp-price").innerHTML = fmt(price * qty) + (sub ? ' <s>' + fmt(s.price * qty) + "</s>" : "");
      $("#freq").hidden = !sub;
      $("#pdp-qty").textContent = qty;
    }
    form.addEventListener("change", update);
    form.addEventListener("click", function (e) {
      if (e.target.closest("[data-pdp-inc]")) { qty = Math.min(qty + 1, 20); update(); }
      if (e.target.closest("[data-pdp-dec]")) { qty = Math.max(qty - 1, 1); update(); }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var sub = form.plan.value === "sub";
      addToCart({ id: p.id, size: form.size.value, plan: sub ? "sub" : "once", freq: sub ? form.freq.value : "", qty: qty });
    });
    update();
  }

  // ---------- checkout ----------
  function summaryHTML(lines, t) {
    return '<h2>Order summary</h2><ul class="sum-lines">' + lines.map(function (l) {
      var p = product(l.id);
      return '<li><span class="sum-thumb">' + boxHTML(p) + '<b>' + l.qty + "</b></span><span class=\"sum-name\">" + esc(p.name) + "<small>" + esc(lineDesc(l)) + "</small></span><span>" + fmt(unitPrice(l) * l.qty) + "</span></li>";
    }).join("") + "</ul>" +
      '<dl class="sum">' +
        "<div><dt>Subtotal</dt><dd>" + fmt(t.subtotal) + "</dd></div>" +
        (t.savings > 0 ? '<div class="save"><dt>Subscription savings (included)</dt><dd>−' + fmt(t.savings) + "</dd></div>" : "") +
        nlRow(t) +
        "<div><dt>Shipping</dt><dd>Calculated at payment</dd></div>" +
        '<div class="sum-total"><dt>Total before shipping</dt><dd>' + fmt(t.total - t.shipping) + "</dd></div>" +
      "</dl>";
  }

  function renderCheckout() {
    if (!cart.length) { location.hash = "#cart"; return; }
    $("#checkout-summary").innerHTML = summaryHTML(cart, totals("standard"));
    var nl = load("kc_newsletter", null), em = $("#email");
    if (nl && !em.value) em.value = nl.email;
  }

  function validate(form) {
    var errs = [];
    function bad(id, msg) { var el = $("#" + id); el.setAttribute("aria-invalid", "true"); errs.push({ el: el, msg: msg }); }
    $$("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
    ["first", "last"].forEach(function (id) { if (!$("#" + id).value.trim()) bad(id, "Fill in your first and last name."); });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim())) bad("email", "Enter a valid email address, like you@example.com.");
    return errs;
  }

  function orderId() {
    var n = Math.floor(100000 + Math.random() * 900000);
    return "KC-" + n;
  }

  // "Continue to payment" doesn't take payment yet: it sends the pre-order to Formspree and thanks the customer.
  function placeOrder(e) {
    e.preventDefault();
    var form = e.target, errBox = $("#form-error");
    var errs = validate(form);
    if (errs.length) {
      errBox.textContent = errs[0].msg + (errs.length > 1 ? " (" + errs.length + " fields need attention.)" : "");
      errBox.hidden = false;
      errs[0].el.focus();
      return;
    }
    errBox.hidden = true;

    var t = totals("standard");
    var order = {
      id: orderId(),
      placedAt: new Date().toISOString(),
      email: $("#email").value.trim(),
      first: $("#first").value.trim(),
      last: $("#last").value.trim(),
      news: $("#news").checked,
      lines: cart.map(function (l) { return { id: l.id, size: l.size, plan: l.plan, freq: l.freq, qty: l.qty }; }),
      totals: t
    };

    var payload = {
      _subject: "New " + S.brandName + " pre-order " + order.id,
      order_id: order.id,
      name: order.first + " " + order.last,
      email: order.email,
      marketing_opt_in: order.news ? "yes" : "no",
      items: order.lines.map(function (l) { return l.qty + " × " + product(l.id).name + ", " + lineDesc(l) + " @ " + fmt(unitPrice(l)); }).join("\n"),
      has_subscription: order.lines.some(function (l) { return l.plan === "sub"; }) ? "yes" : "no",
      subtotal: fmt(t.subtotal),
      newsletter_discount: t.newsletter > 0 ? "−" + fmt(t.newsletter) : "none",
      total_before_shipping: fmt(t.total - t.shipping),
      placed_at: order.placedAt
    };

    var btn = $("#place-order"), label = btn.textContent;
    btn.disabled = true; btn.textContent = "One moment…";

    function done() {
      save("kc_last_order", order);
      cart = []; commit();
      form.reset();
      btn.disabled = false; btn.textContent = label;
      location.hash = "#confirmation";
    }

    if (!S.formspreeEndpoint) {
      if (window.console) console.info("[checkout] No Formspree endpoint set in js/config.js, so this pre-order was not sent anywhere.", payload);
      setTimeout(done, 700);
      return;
    }
    fetch(S.formspreeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("status " + res.status);
      done();
    }).catch(function () {
      btn.disabled = false; btn.textContent = label;
      errBox.textContent = "We couldn't save your pre-order just now. Check your connection and try again.";
      errBox.hidden = false;
    });
  }

  function renderConfirmation() {
    var o = load("kc_last_order", null);
    var root = $("#ticket");
    if (!o) {
      root.innerHTML = '<div class="empty"><p>No recent pre-order to show.</p><a class="btn btn-red" href="#shop">See the menu</a></div>';
      return;
    }
    root.innerHTML =
      '<div class="ticket-head"><p class="ticket-kicker">You\'re in!</p>' +
        "<h1>Thank you for joining the pre&#8209;order, " + esc(o.first) + ".</h1>" +
        '<p class="ticket-no">Pre-order <b>' + esc(o.id) + "</b></p></div>" +
      '<p class="ticket-note">' + esc(S.confirmationNote) + " We'll write to <b>" + esc(o.email) + "</b>.</p>" +
      '<ul class="ticket-lines">' + o.lines.map(function (l) {
        return "<li><span>" + l.qty + " × " + esc(product(l.id).name) + "<small>" + esc(lineDesc(l)) + "</small></span><span>" + fmt(unitPrice(l) * l.qty) + "</span></li>";
      }).join("") + "</ul>" +
      '<dl class="sum">' +
        "<div><dt>Subtotal</dt><dd>" + fmt(o.totals.subtotal) + "</dd></div>" +
        (o.totals.savings > 0 ? '<div class="save"><dt>Subscription savings (included)</dt><dd>−' + fmt(o.totals.savings) + "</dd></div>" : "") +
        nlRow(o.totals) +
        '<div class="sum-total"><dt>Total before shipping</dt><dd>' + fmt(o.totals.total - o.totals.shipping) + "</dd></div>" +
      "</dl>" +
      '<p class="ticket-thanks">Thanks for holding the plastic.</p>' +
      '<a class="btn btn-red" href="#home">Back to the counter</a>';
  }

  // ---------- toast ----------
  var toastTimer;
  function toast(html) {
    var el = $("#toast");
    el.innerHTML = html;
    el.hidden = false;
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); setTimeout(function () { el.hidden = true; }, 300); }, 3500);
  }

  // ---------- newsletter pop-up ----------
  // Shows once after a short delay (or on exit intent on desktop); never again once dismissed or joined.
  var popupShown = false;
  function popupState() { try { return localStorage.getItem("kc_popup"); } catch (e) { return "dismissed"; } }
  function setPopupState(v) { try { localStorage.setItem("kc_popup", v); } catch (e) {} }
  function popupAllowed() {
    var h = location.hash;
    return !popupShown && !popupState() && !joined() && h !== "#checkout" && h !== "#confirmation";
  }
  function openPopup() {
    if (!popupAllowed()) return;
    popupShown = true;
    var el = $("#nl-popup");
    el.hidden = false;
    document.body.classList.add("modal-open");
    setTimeout(function () { $("#nl-email").focus(); }, 50);
  }
  function closePopup() {
    var el = $("#nl-popup");
    if (el.hidden) return;
    if (!popupState()) setPopupState("dismissed");
    el.hidden = true;
    document.body.classList.remove("modal-open");
  }
  function joinNewsletter(e) {
    e.preventDefault();
    var input = $("#nl-email"), err = $("#nl-error"), email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = "Enter a valid email address, like you@example.com.";
      err.hidden = false; input.setAttribute("aria-invalid", "true"); input.focus();
      return;
    }
    err.hidden = true;
    var payload = {
      _subject: "New " + S.brandName + " newsletter sign-up",
      email: email,
      type: "newsletter",
      discount: "10% off one-time items",
      page: location.hash || "#home",
      signed_up_at: new Date().toISOString()
    };
    var btn = $("#nl-submit"), label = btn.textContent;
    btn.disabled = true; btn.textContent = "One moment…";
    function done() {
      save("kc_newsletter", { email: email, at: payload.signed_up_at });
      setPopupState("joined");
      btn.disabled = false; btn.textContent = label;
      $("#nl-form").hidden = true;
      $("#nl-done").hidden = false;
      commit();
      if (location.hash === "#cart") renderCart();
      if (location.hash === "#checkout") renderCheckout();
    }
    if (!S.formspreeEndpoint) {
      if (window.console) console.info("[newsletter] No Formspree endpoint set in js/config.js, so this sign-up was not sent anywhere.", payload);
      setTimeout(done, 500);
      return;
    }
    fetch(S.formspreeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("status " + res.status);
      done();
    }).catch(function () {
      btn.disabled = false; btn.textContent = label;
      err.textContent = "We couldn't sign you up just now. Check your connection and try again.";
      err.hidden = false;
    });
  }
  function initPopup() {
    $("#nl-form").addEventListener("submit", joinNewsletter);
    $$("[data-nl-close]").forEach(function (b) { b.addEventListener("click", closePopup); });
    $("#nl-popup").addEventListener("click", function (e) { if (e.target === e.currentTarget) closePopup(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePopup(); });
    if (!popupAllowed()) return;
    setTimeout(openPopup, S.newsletterDelayMs);
    document.documentElement.addEventListener("mouseleave", function (e) { if (e.clientY <= 0) openPopup(); });
  }

  // ---------- router ----------
  function route() {
    var h = (location.hash || "#home").slice(1) || "home";
    var view = h, arg = null;
    if (h.indexOf("product-") === 0) { view = "product"; arg = h.slice(8); }
    if (!$('[data-view="' + view + '"]')) view = "home";
    $$(".view").forEach(function (v) { v.hidden = v.getAttribute("data-view") !== view; });
    $$(".nav a").forEach(function (a) {
      var target = a.getAttribute("href").slice(1);
      a.classList.toggle("active", target === view || (view === "product" && target === "shop"));
    });
    if (view === "product") renderProduct(arg);
    if (view === "cart") renderCart();
    if (view === "checkout") renderCheckout();
    if (view === "confirmation") renderConfirmation();
    window.scrollTo(0, 0);
  }

  // ---------- events ----------
  document.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-chip]");
    if (chip) {
      var tile = chip.closest("[data-tile]"), tp = product(tile.getAttribute("data-tile"));
      $$(".chip", tile).forEach(function (c) { var on = c === chip; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); });
      $(".tile-pricing", tile).innerHTML = cardPrice(tp, sizeFor(tp, chip.getAttribute("data-chip")));
      return;
    }
    var buy = e.target.closest("[data-buy]");
    if (buy) {
      var bt = buy.closest("[data-tile]"), bp = product(buy.getAttribute("data-buy")), on = $(".chip.on", bt);
      addToCart({ id: bp.id, size: on ? on.getAttribute("data-chip") : sizesFor(bp)[0].id, plan: "once", freq: "", qty: 1 });
      location.hash = "#cart";
      return;
    }
    var inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), rm = e.target.closest("[data-remove]");
    if (inc) { cart[+inc.getAttribute("data-inc")].qty = Math.min(cart[+inc.getAttribute("data-inc")].qty + 1, 20); commit(); renderCart(); }
    if (dec) { cart[+dec.getAttribute("data-dec")].qty -= 1; commit(); renderCart(); }
    if (rm) { cart[+rm.getAttribute("data-remove")].qty = 0; commit(); renderCart(); }
  });

  document.addEventListener("input", function (e) {
    if (e.target.hasAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid");
  });

  // ---------- init ----------
  $("#checkout-form").addEventListener("submit", placeOrder);
  applyBrand();
  renderLineups();
  renderNews();
  commit();
  window.addEventListener("hashchange", route);
  route();
  initPopup();
})();
