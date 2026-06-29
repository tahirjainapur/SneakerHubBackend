const fs = require('fs');
let html = fs.readFileSync('e:/Ecommerce/index.html', 'utf-8');

html = html.replace(/<div class="product-options">[\s\S]*?<\/div>[\s\S]*?<button class="btn btn-cart add-to-cart" data-name="([^"]+)" data-price="([^"]+)">[\s\S]*?<\/button>/g, '<button class="btn btn-primary view-details-btn" data-name="$1" data-price="$2" style="width: 100%; margin-top: 1rem;">View Details</button>');

fs.writeFileSync('e:/Ecommerce/index.html', html);
console.log('Updated index.html');
