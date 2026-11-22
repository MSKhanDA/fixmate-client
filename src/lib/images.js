// Unsplash photos (free Unsplash License) used for static sections.
const u = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMAGES = {
  hero: u("1550041473-d296a3a8a18a", 1400),
  heroSide: u("1581090466144-8ed89ea98b25", 700),
  about: u("1581166397057-235af2b3c6dd", 1200),
  aboutWork: u("1721333089073-215a56fd710c", 1000),
};

export const CATEGORY_IMAGES = {
  Smartphone: u("1639776738932-956082f0b704", 600),
  "Laptop & PC": u("1721332154191-ba5f1534266e", 600),
  AC: u("1770838773417-08b18661c62f", 600),
  Refrigerator: u("1721613877687-c9099b698faa", 600),
  TV: u("1567690187548-f07b1d7bf5a9", 600),
  "Washing Machine": u("1626806819282-2c1dc01a5e0c", 600),
  Electrical: u("1682345262055-8f95f3c513ea", 600),
};
