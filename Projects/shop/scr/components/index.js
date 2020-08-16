const imgURL = 'https://raw.githubusercontent.com/aleksSwen/static/master/img/'

let CLOTHES = [
    'Mango T-Shirt',
    'Apple T-Shirt',
    'Avocado T-Shirt',
    'Banana T-Shirt',
    'Grapefruit T-Shirt',
    'Grapes T-Shirt',
    'Kiwi T-Shirt',
    'Lime T-Shirt'
];
let PRICE = [ 52, 53, 56, 57, 124, 59, 55, 23];

function getArrayOfObjects() {
    let local = [];

    for (let i = 0; i < CLOTHES.length; i++) {
        local.push({
            productCloth: CLOTHES[i],
            productPrice: PRICE[i],
            productImg: `${imgURL}main_index_img_${i + 1}.png`,
            productId: 'prod_' + i
        })
    }
    return local;
}

let catalog = {
    container: null,
    items: [],
    init() {
        this.container = document.querySelector('#catalog');
        this._fillCatalog();
        this._render();
    },
    _fillCatalog() {
        this.items = getArrayOfObjects();
    },
    _render() {
        let htmlStr = '';
        this.items.forEach(item => {
            htmlStr += createItemTemplate(item);
        })
        this.container.innerHTML = htmlStr;
    }
}

function createItemTemplate(item) {
    return `<div class="product">
           <a href="#"><img class="product__img" src="${item.productImg}" alt="product"></a>
           <div class="product__content">
                <a href="#" class="product__name">${item.productCloth}</a>
                <div class="product__price">${item.productPrice}$</div>
                <img class="product__star" src="img/product__star.png" alt="star">
           </div>
           <a href="#" class="product__add">Add to Cart</a>
           </div>`
}

catalog.init();
