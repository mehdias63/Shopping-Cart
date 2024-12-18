import { productsData } from './products.js'

const cartBtn = document.querySelector('.cart-btn')
const cartModal = document.querySelector('.cart')
const backDrop = document.querySelector('.backdrop')
const closeModal = document.querySelector('.cart-item-confirm')
const productsDOM = document.querySelector('.products-center')
const cartTotal = document.querySelector('.cart-total')
const cartItems = document.querySelector('.cart-items')
const cartContent = document.querySelector('.cart-content')
const clearCart = document.querySelector('.clear-cart')

let cart = []
let buttonsDOM = []
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
     add to cart
   </button>
 </div>`
			productsDOM.innerHTML = result
		})
	}
	getAddToCartBtns() {
		const addToCartBtns = [
			...document.querySelectorAll('.add-to-cart'),
		]
		buttonsDOM = addToCartBtns
		addToCartBtns.forEach(btn => {
			const id = btn.dataset.id
			const isInCart = cart.find(p => p.id === parseInt(id))
			if (isInCart) {
				btn.innerText = 'In Cart'
				btn.disabled = true
			}
			btn.addEventListener('click', event => {
				event.target.innerText = 'In Cart'
				event.target.disabled = true
				const addedProduct = {
					...Storage.getProduct(id),
					quantity: 1,
				}

				cart = [...cart, addedProduct]
				Storage.saveCart(cart)
				this.setCartValue(cart)
				this.addCartItem(addedProduct)
			})
		})
	}
	setCartValue(cart) {
		let tempCartItem = 0
		const totalPrice = cart.reduce((acc, curr) => {
			tempCartItem += curr.quantity
			return acc + curr.quantity * curr.price
		}, 0)
		cartTotal.innerText = `total price : ${totalPrice.toFixed(2)} $`
		cartItems.innerText = tempCartItem
	}
	addCartItem(cartItem) {
		const div = document.createElement('div')
		div.classList.add('cart-item')
		div.innerHTML = `<img class="cart-item-img" src=${cartItem.imageUrl} />
<div class="cart-item-desc">
  <h4>${cartItem.title}</h4>
  <h5>$ ${cartItem.price}</h5>
</div>
<div class="cart-item-conteoller">
  <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
  <p>${cartItem.quantity}</p>
  <i class="fas fa-chevron-down" data-id=${cartItem.id}></i></div>
	<i class="far fa-trash-alt" data-id=${cartItem.id}></i>`
		cartContent.appendChild(div)
	}
	setupApp() {
		cart = Storage.getCart() || []
		cart.forEach(cartItem => this.addCartItem(cartItem))
		this.setCartValue(cart)
	}
	cartLogic() {
		clearCart.addEventListener('click', () => {
			this.clearCart()
		})
	}
	clearCart() {
		cart.forEach(cItem => this.removeItem(cItem.id))
		while (cartContent.children.length) {
			cartContent.removeChild(cartContent.children[0])
		}
		closeModalFunction()
	}
	removeItem(id) {
		cart = cart.filter(cItem => cItem.id !== id)
		this.setCartValue(cart)
		Storage.saveCart(cart)
		this.getSingleButton()
	}
	getSingleButton() {
		const button = buttonsDOM.find(
			btn => parseInt(btn.dataset.id) === parseInt(id),
		)
		button.innerText = 'add to cart'
		buttonsDOM.disabled = false
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
	static getCart() {
		return JSON.parse(localStorage.getItem('cart'))
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const products = new Products()
	const productsData = products.getProducts()
	const ui = new UI()
	ui.setupApp()
	ui.cartLogic()
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
