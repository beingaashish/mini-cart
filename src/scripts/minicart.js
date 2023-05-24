import { globalEventListener } from "./util.js";
import productData from '../assets/products.json';
import { formatCurrency } from "./util.js";


const miniCartToggleButton = document.querySelector('[data-minicart-toggle-button]');
const minCartWrapper = document.querySelector('[data-minicart-wrapper');
const miniCartProducts = document.querySelector('[data-minicart-products]');
const MINI_CART_SESSION_KEY = 'MINI_CART_SESSION_KEY';

const minCartProductImgUrl = 'https://dummyimage.com/210x130/';
const productTemplate = document.querySelector('#mincart-product-template');
const productsContainer = document.querySelector( '.products-container' );
let   miniCartItems = loadCartItems();

if ( miniCartItems != undefined && miniCartItems.length > 0 ) {

  miniCartItems.forEach( item => {
    let product = productData.find( product => product.id == item.id );
    addToCart(product);
    updateCartItems(item);
  } );
  updateCartTotal();

}

export function initiateMiniStore() {

  if ( miniCartItems.length != 0 ) {
    miniCartToggleButton.classList.remove('invisible');
    minCartWrapper.classList.remove('invisible');
  } else {
    minCartWrapper.classList.add('invisible');
    miniCartToggleButton.classList.add('invisible');
  }
}

miniCartToggleButton.addEventListener('click', function () {
  minCartWrapper.classList.toggle('invisible');
});

globalEventListener( productsContainer, 'click', function( e ) {
  if ( ! e.target.matches( '[data-add-to-cart]' ) ) return;

  if ( miniCartToggleButton.classList.contains( 'invisible' ) ) miniCartToggleButton.classList.remove('invisible');

  let productId     = parseInt(e.target.closest('[data-product]').id);
  let productInCart = miniCartItems.find( product => product.id == productId);

  if ( productInCart == undefined ) {
    let product = productData.find(el => el.id === productId);

    miniCartItems.push({ id: productId, quantity: 1, price: product.priceCents });
    addToCart(product);
    updateCartTotal();
  } else {
      productInCart.quantity++;
      updateCartItems( productInCart );
      updateCartTotal();
  }

  // Update session storage.
  sessionStorage.setItem(MINI_CART_SESSION_KEY, JSON.stringify(miniCartItems) );
} );

globalEventListener( minCartWrapper, 'click', function ( e ) {
  if (e.target.matches('[data-remove-from-cart-button]')) {
    let mainItem = e.target.closest('[data-product]');
    let itemId = mainItem.getAttribute('data-product')

    // Update miniCartItems
    miniCartItems = miniCartItems.filter( el => el.id != itemId );

    if ( miniCartItems.length == 0 ) {
      initiateMiniStore();
    }

    // Update display.
    mainItem.remove();
    updateCartTotal();

    // Update session storage.
    sessionStorage.setItem(MINI_CART_SESSION_KEY, JSON.stringify(miniCartItems));
  }
} );

function addToCart(product) {
  const productTemplateClone = productTemplate.content.cloneNode(true);

  productTemplateClone.querySelector('[data-image]').src = `${minCartProductImgUrl}${product.imageColor}/${product.imageColor}`;
  productTemplateClone.querySelector('[data-name]').innerText = product.name;
  productTemplateClone.querySelector('[data-price]').innerText = formatCurrency(parseInt(product.priceCents));
  productTemplateClone.querySelector('[data-product]').dataset.product = product.id;

  miniCartProducts.appendChild(productTemplateClone);
}

function updateCartItems( productInCart ) {
  // Update quantity.
  miniCartProducts.querySelector(`[data-product='${productInCart.id}'] [data-product-quantity]`).innerText ='x' + productInCart.quantity;

  // Update price.
  miniCartProducts.querySelector(`[data-product='${productInCart.id}'] [data-price]`).innerText = formatCurrency(productInCart.price * productInCart.quantity);

}

function updateCartTotal() {
  // Update total.
  let miniCartTotal = miniCartItems.reduce((acc, currVal) => acc + currVal.price * currVal.quantity, 0);
  minCartWrapper.querySelector('[data-cart-total]').innerText = formatCurrency(miniCartTotal) || '$0.00';

  // Update number of items in cart toggle button.
  const minicartProductsNum = document.querySelector('[data-minicart-product-no');

  minicartProductsNum.innerText = miniCartItems.length;

}

function loadCartItems() {
  let cartItems = JSON.parse(sessionStorage.getItem(MINI_CART_SESSION_KEY));

  if ( cartItems == undefined ) {
    return [];
  } else {
    return cartItems;
  }
}