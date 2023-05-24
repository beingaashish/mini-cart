import productData from '../assets/products.json';
import { formatCurrency } from './util.js';

const PRODUCT_IMG_URL = 'https://dummyimage.com/420x260/';
const productTemplate = document.querySelector('#product-template');
const productsContainer = document.querySelector('.products-container');


export function initiateStore () {
  productData.forEach( product => renderProducts(product) );
}

function renderProducts(product) {
  const productTemplateClone = productTemplate.content.cloneNode(true);

  productTemplateClone.querySelector('[data-image]').src = `${PRODUCT_IMG_URL}${product.imageColor}/${product.imageColor}`;
  productTemplateClone.querySelector('[data-category]').innerText = product.category;
  productTemplateClone.querySelector('[data-name]').innerText = product.name;
  productTemplateClone.querySelector('[data-price]').innerText = formatCurrency(parseInt(product.priceCents));
  productTemplateClone.querySelector('[data-product]').id = product.id;

  productsContainer.appendChild(productTemplateClone);
}
