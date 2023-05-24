export function formatCurrency( number ) {

  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseInt(number)/ 100) ;
}

export function globalEventListener( el, event, callback ) {
  return el.addEventListener( event, callback );
}