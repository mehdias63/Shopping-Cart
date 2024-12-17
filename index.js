import { productsData } from './products.js'

const cartBtn = document.querySelector('.cart-btn')
const cartModal = document.querySelector('.cart')
const backDrop = document.querySelector('.backdrop')
const closeModal = document.querySelector('.cart-item-confirm')
const productsDOM = document.querySelector('.products-center')
const addToCartBtn = document.querySelector('.add-to-cart')

let cart = []
class Products {
	getProducts() {
		return productsData
	}
}

class UI {
	displayProducts(products) {
		let result = ''
		products.forEach(item => {
			result += `<div class="product">
   <div class="img-container">
     <img src=${item.imageUrl} class="product-img" />
   </div>
   <div class="product-desc">
     <p class="product-price">$ ${item.price}</p>
     <p class="product-title">${item.title}</p>
   </div>
   <button class="btn add-to-cart" data-id=${item.id}>
     <i class="fas fa-shopping-cart"></i>
     add to cart
   </button>
 </div>`
			productsDOM.innerHTML = result
		})
	}
	getAddToCartBtns() {
		const addToCartBtns = document.querySelectorAll('.add-to-cart')
		const buttons = [...addToCartBtns]
		// baraye tabdile node be array az in kode bala estefade mikonim

		buttons.forEach(btn => {
			const id = btn.dataset.id
			const isInCart = cart.find(p => p.id === id)
			if (isInCart) {
				btn.innerText = 'In Cart'
				btn.disabled = true
			}
			btn.addEventListener('click', event => {
				event.target.innerText = 'In Cart'
				event.target.disabled = true
				const addedProduct = Storage.getProduct(id)

				cart = [...cart, { ...addedProduct, quantity: 1 }]
				Storage.saveCart(cart)
			})
		})
	}
}

class Storage {
	static saveProducts(products) {
		localStorage.setItem('products', JSON.stringify(products))
	}
	static getProduct(id) {
		const prod = JSON.parse(localStorage.getItem('products'))
		return prod.find(p => p.id === parseInt(id))
	}
	static saveCart(cart) {
		localStorage.setItem('cart', JSON.stringify(cart))
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const products = new Products()
	const productsData = products.getProducts()
	const ui = new UI()
	ui.displayProducts(productsData)
	ui.getAddToCartBtns()
	Storage.saveProducts(productsData)
})

function showModalFunction() {
	backDrop.style.display = 'block'
	cartModal.style.opacity = '1'
	cartModal.style.top = '20%'
}

function closeModalFunction() {
	backDrop.style.display = 'none'
	cartModal.style.opacity = '0'
	cartModal.style.top = '-100%'
}

cartBtn.addEventListener('click', showModalFunction)
closeModal.addEventListener('click', closeModalFunction)
backDrop.addEventListener('click', closeModalFunction)
