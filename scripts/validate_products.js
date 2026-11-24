const fs = require('fs');
const prods = JSON.parse(fs.readFileSync('products.json', 'utf8'));
console.log('Total products:', prods.length);
prods.forEach((p, idx) => {
  const imgPath = p.image || p.img || p.image_url;
  const imgExists = fs.existsSync(imgPath);
  console.log((idx + 1) + '. [' + p.id + '] ' + p.name + ' - Price: ₹' + p.price + ' - Img: ' + imgPath + ' (Exists: ' + imgExists + ') - Variants: ' + (p.variants ? p.variants.length : 0));
});
