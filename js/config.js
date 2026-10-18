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
  formspreeEndpoint: "https://formspree.io/f/xjygzbla",

  // Shown on the "Thank you for joining the pre-order" page.
  confirmationNote: "Nothing has been charged. We'll email you before your pods ship.",

  currency: "USD",
  freeShippingMin: 35,
  shipping: {
    standard: { label: "Standard", detail: "5 to 7 business days", price: 5.95 },
    express: { label: "Express", detail: "2 to 3 business days", price: 12.95 }
  },
  subscribeDiscount: 0.10, // 10% off subscription orders
  newsletterDiscount: 0.10, // 10% off one-time items after a newsletter sign-up (does not stack with subscribe)
  newsletterDelayMs: 3000, // pop-up delay; it also opens on exit intent on desktop

  // Pack sizes and prices for the single-roast boxes.
  sizes: [
    { id: "12", pods: 12, boxes: 1, price: 25.32, label: "1 box" },
    { id: "36", pods: 36, boxes: 3, price: 69.84, label: "3 boxes" }
  ],

  // "In the news" cards on the Why no plastic page. Images load from each outlet's own preview image.
  news: [
    { kind: "News", outlet: "TIME", date: "Nov 2025", title: "What Happens to the Plastic in Single-Serve Coffee Pods?",
      url: "https://time.com/7331064/coffee-pods-plastic/",
      image: "https://static.time.com/v3/assets/bltea6093859af6183b/bltf8b1aacf055ab056/6998cb45e1ba00c88898e13f/Coffee-pods.png?branch=production&width=1200&quality=75&auto=webp&crop=16:9" },
    { kind: "News", outlet: "Fresh Cup", date: "Nov 2025", title: "New Research Shows Coffee Pods May Release Microplastics Into Your Cup",
      url: "https://freshcup.com/new-research-shows-coffee-pods-may-release-microplastics-into-your-cup/",
      image: "https://freshcup.com/wp-content/uploads/2025/11/zack-xavier-z0QpU0v31Ms-unsplash-1-scaled.jpg" },
    { kind: "News", outlet: "Daily Coffee News", date: "Sep 2025", title: "Microplastics Are Elevated in Hot Coffee in To-Go Cups, Study Finds",
      url: "https://dailycoffeenews.com/2025/09/04/microplastics-are-elevated-in-hot-coffee-in-to-go-cups-study-finds",
      image: "https://dailycoffeenews.com/wp-content/uploads/2025/09/coffee-cups.jpg" },
    { kind: "News", outlet: "National Geographic", date: "Feb 2025", title: "Alarming levels of microplastics found in human brains",
      url: "https://www.nationalgeographic.com/science/article/microplastic-human-brain-health",
      image: "https://i.natgeofe.com/n/c834bf54-e85e-42f7-a9f2-385f8d605168/F0372732-Brain_blood_vessels_CT_scan_16x9.jpg?w=1200" },
    { kind: "Study", outlet: "Nature Medicine", date: "Feb 2025", title: "Bioaccumulation of microplastics in decedent human brains",
      url: "https://www.nature.com/articles/s41591-024-03453-1",
      image: "https://media.springernature.com/m685/springer-static/image/art%3A10.1038%2Fs41591-024-03453-1/MediaObjects/41591_2024_3453_Fig1_HTML.png" },
    { kind: "News", outlet: "Science News", date: "Apr 2024", title: "A new study has linked microplastics to heart attacks and strokes. Here’s what we know",
      url: "https://www.sciencenews.org/article/microplastics-nanoplastics-heart-attacks-strokes-health",
      image: "https://www.sciencenews.org/wp-content/uploads/sites/2/2024/03/031824_MR_microplastics_feat.jpg" }
  ],

  // "What it's made of" on every product page. Draft spec: confirm with the co-packer before launch.
  materials: [
    { part: "Lid", material: "Uncoated paper lid", detail: "Sealed to the cup with a plant-starch adhesive. No foil and no plastic laminate." },
    { part: "Filter", material: "Unbleached plant-fiber paper", detail: "Wood pulp and abaca (banana-plant) fiber, with no plastic fibers to heat-seal it." },
    { part: "Cup", material: "Molded plant fiber", detail: "Pressed from bamboo and sugarcane pulp. No plastic lining and no PFAS \"forever chemical\" coatings." },
    { part: "Coffee", material: "100% arabica", detail: "Ground fresh and packed with nothing added." },
    { part: "Box", material: "Recycled paperboard", detail: "Printed with plant-based inks. Recycle it with your paper." }
  ],
  materialsNote: "No plastic of any kind, and that includes \"plant-based\" bioplastics like PLA. PLA is still plastic, so it isn't in our pods.",

  products: [
    {
      id: "dark", packshot: "assets/img/packshot-dark.jpg", name: "Dark Roast", color: "#C8242A", intensity: 4,
      notes: "Cocoa, toasted walnut, a little smoke.",
      blurb: "The one that wakes the whole house. Bold and low in acid, built for a big mug and a splash of cream.",
      photo: "assets/img/kpod.jpg"
    },
    {
      id: "medium", packshot: "assets/img/packshot-medium.jpg", name: "Medium Roast", color: "#1F4FA8", intensity: 3,
      notes: "Brown sugar, milk chocolate, a clean finish.",
      blurb: "The everyday cup. Smooth enough to drink black, sturdy enough for a second refill."
    },
    {
      id: "decaf", packshot: "assets/img/packshot-decaf.jpg", name: "Decaf", color: "#1E6B45", intensity: 2,
      notes: "Caramel and cocoa, without the buzz.",
      blurb: "All of the ritual, none of the 9 p.m. regret. Full flavor for the afternoon and after dinner."
    },
    {
      id: "sampler", packshot: "assets/img/packshot-sampler.jpg", name: "Diner Sampler", color: "#151313", intensity: 0, bundle: ["dark", "medium", "decaf"],
      notes: "One box of each roast. 36 pods.",
      blurb: "Can't pick? Get all three roasts and find your house cup.",
      photo: "assets/img/brew.jpg",
      fixedSize: { id: "36", pods: 36, boxes: 3, price: 69.84, label: "3 boxes, one of each" }
    }
  ]
};
