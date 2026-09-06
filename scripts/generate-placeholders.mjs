import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dirname, "..");
const publicDir = join(root, "public");

function svgCard({
  width,
  height,
  title,
  subtitle = "Venu Daily Vlogs",
  badge = "DEMO",
  from = "#F97316",
  to = "#EA580C",
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${width * 0.85}" cy="${height * 0.18}" r="${Math.min(width, height) * 0.22}" fill="#fff7ed" fill-opacity="0.18"/>
  <circle cx="${width * 0.12}" cy="${height * 0.82}" r="${Math.min(width, height) * 0.16}" fill="#fff7ed" fill-opacity="0.14"/>
  <rect x="48" y="48" rx="28" width="${Math.min(140, width * 0.22)}" height="46" fill="#fff7ed"/>
  <text x="68" y="79" font-family="Georgia, serif" font-size="20" fill="#EA580C">${badge}</text>
  <text x="56" y="${height * 0.58}" font-family="Georgia, serif" font-size="${Math.round(Math.min(width, height) * 0.07)}" fill="#fff7ed">${title}</text>
  <text x="56" y="${height * 0.58 + 48}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="28" fill="#ffedd5">${subtitle}</text>
</svg>`;
}

const images = [
  {
    path: "images/placeholder.jpg",
    width: 1200,
    height: 800,
    title: "Recipe coming soon",
    from: "#FDBA74",
    to: "#F97316",
  },
  {
    path: "images/og/default-og.jpg",
    width: 1200,
    height: 630,
    title: "Venu Daily Vlogs",
    subtitle: "Food • Family • Lifestyle",
    from: "#EA580C",
    to: "#C2410C",
  },
  {
    path: "images/recipes/simple-chicken-fry.jpg",
    width: 1200,
    height: 900,
    title: "Simple Chicken Fry",
    from: "#FB923C",
    to: "#C2410C",
  },
  {
    path: "images/recipes/chicken-curry.jpg",
    width: 1200,
    height: 900,
    title: "Chicken Curry",
    from: "#F97316",
    to: "#9A3412",
  },
  {
    path: "images/recipes/mutton-curry.jpg",
    width: 1200,
    height: 900,
    title: "Mutton Curry",
    from: "#EA580C",
    to: "#7C2D12",
  },
  {
    path: "images/recipes/vegetable-pulao.jpg",
    width: 1200,
    height: 900,
    title: "Vegetable Pulao",
    from: "#F59E0B",
    to: "#B45309",
  },
  {
    path: "images/recipes/masala-dosa.jpg",
    width: 1200,
    height: 900,
    title: "Masala Dosa",
    from: "#FBBF24",
    to: "#D97706",
  },
  {
    path: "images/recipes/banana-halwa.jpg",
    width: 1200,
    height: 900,
    title: "Banana Halwa",
    from: "#F59E0B",
    to: "#92400E",
  },
  {
    path: "images/recipes/draft-weekend-snack.jpg",
    width: 1200,
    height: 900,
    title: "Draft Snack",
    from: "#A8A29E",
    to: "#57534E",
  },
  {
    path: "images/vlogs/family-day.jpg",
    width: 1280,
    height: 720,
    title: "Family Day",
    from: "#FB923C",
    to: "#EA580C",
  },
  {
    path: "images/vlogs/weekend-cooking.jpg",
    width: 1280,
    height: 720,
    title: "Weekend Cooking",
    from: "#F97316",
    to: "#C2410C",
  },
  {
    path: "images/vlogs/hyderabad-walk.jpg",
    width: 1280,
    height: 720,
    title: "Hyderabad Walk",
    from: "#FB7185",
    to: "#EA580C",
  },
  {
    path: "images/shorts/onion-tadka.jpg",
    width: 720,
    height: 1280,
    title: "Onion Tadka",
    from: "#F97316",
    to: "#9A3412",
  },
  {
    path: "images/shorts/evening-chai.jpg",
    width: 720,
    height: 1280,
    title: "Evening Chai",
    from: "#D97706",
    to: "#7C2D12",
  },
  {
    path: "images/shorts/morning-kitchen.jpg",
    width: 720,
    height: 1280,
    title: "Morning Kitchen",
    from: "#FB923C",
    to: "#C2410C",
  },
];

await Promise.all(
  images.map(async (image) => {
    const absolute = join(publicDir, image.path);
    await mkdir(dirname(absolute), { recursive: true });
    const svg = svgCard(image);
    const jpeg = await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer();
    await writeFile(absolute, jpeg);

    if (image.path.endsWith("placeholder.jpg") || image.path.endsWith("default-og.jpg")) {
      const webpPath = absolute.replace(/\.jpg$/, ".webp");
      await sharp(jpeg).webp({ quality: 80 }).toFile(webpPath);
    }
  }),
);

await mkdir(join(publicDir, "images/brand"), { recursive: true });
await mkdir(join(publicDir, "images/profile"), { recursive: true });
await mkdir(join(publicDir, "images/qr"), { recursive: true });

await writeFile(
  join(publicDir, "images/profile/.gitkeep"),
  "Add venu.jpg here.\n",
);
await writeFile(
  join(publicDir, "images/qr/.gitkeep"),
  "Add youtube-subscribe.png here if you want a QR code.\n",
);

console.log(`Generated ${images.length} placeholder images.`);
