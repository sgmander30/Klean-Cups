/*
 * Site settings. Edit this file to rename the brand, connect Formspree,
 * or change prices. Nothing else needs to change.
 */
window.SITE = {
  // Placeholder name. Changing it here updates every page, the boxes and the order emails.
  // (The kitchen photo has the name printed on the box, so swap that image too when the name is final.)
  brandName: "Klean Cups",

  // Paste your Formspree form endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
  // While it is empty, checkout still works end to end but no order is sent anywhere.
  formspreeEndpoint: "",

  // Shown on the checkout page above the card fields, and on the confirmation page.
  // Card details are never sent to Formspree or anywhere else.
  paymentNotice: "Payments aren't switched on yet, so your card will not be charged. Card details stay in your browser and are never sent.",
  confirmationNote: "Nothing has been charged. We'll email you to confirm before anything ships.",

  currency: "USD",
  freeShippingMin: 35,
  shipping: {
    standard: { label: "Standard", detail: "5 to 7 business days", price: 5.95 },
    express: { label: "Express", detail: "2 to 3 business days", price: 12.95 }
  },
  subscribeDiscount: 0.10, // 10% off subscription orders

  // Pack sizes and prices for the single-roast boxes.
  sizes: [
    { id: "12", pods: 12, boxes: 1, price: 25.32, label: "1 box" },
    { id: "36", pods: 36, boxes: 3, price: 69.84, label: "3 boxes" }
  ],

  products: [
    {
      id: "dark", name: "Dark Roast", color: "#C8242A", intensity: 4,
      notes: "Cocoa, toasted walnut, a little smoke.",
      blurb: "The one that wakes the whole house. Bold and low in acid, built for a big mug and a splash of cream.",
      photo: "assets/img/kpod.jpg"
    },
    {
      id: "medium", name: "Medium Roast", color: "#1F4FA8", intensity: 3,
      notes: "Brown sugar, milk chocolate, a clean finish.",
      blurb: "The everyday cup. Smooth enough to drink black, sturdy enough for a second refill.",
      photo: "assets/img/brew.jpg"
    },
    {
      id: "decaf", name: "Decaf", color: "#1E6B45", intensity: 2,
      notes: "Caramel and cocoa, without the buzz.",
      blurb: "All of the ritual, none of the 9 p.m. regret. Full flavor for the afternoon and after dinner.",
      photo: "assets/img/brew.jpg"
    },
    {
      id: "sampler", name: "Diner Sampler", color: "#151313", intensity: 0, bundle: ["dark", "medium", "decaf"],
      notes: "One box of each roast. 36 pods.",
      blurb: "Can't pick? Get all three roasts and find your house cup.",
      photo: "assets/img/brew.jpg",
      fixedSize: { id: "36", pods: 36, boxes: 3, price: 69.84, label: "3 boxes, one of each" }
    }
  ]
};
