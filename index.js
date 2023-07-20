import { menuArray } from "./data.js";

const itemContainer = document.getElementById('item-container')
const orderContainer = document.getElementById('order-container')
const order = document.getElementById('order')
const modal = document.getElementById('modal')
const modalCover = document.getElementById('modal-cover')
const orderForm = document.getElementById('order-form')

const orderList = []

function renderMenu() {
    let menuHtml = ``
    menuArray.map((item) => {
        const ingredients = item.ingredients
            .map((ingredient) => ` ${ingredient}`)
        const price = (Math.round(item.price * 100) / 100).toFixed(2)
        menuHtml += `
            <div class="item">
                <img class="item-image" src="${item.image}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <div class="item-ingredients">${ingredients}</div>
                    <p>${item.description}</p>
                </div>
                <div class="item-info-price">
                    <p>$${price}</p>
                    <div data-add="${item.id}" class="btn btn-add-item"><i class="fa-solid fa-plus fa-xs"></i></div>
                </div>
            </div>
        `
    })
    itemContainer.innerHTML = menuHtml
}
renderMenu()

document.addEventListener('click', (e) => {
    if (e.target.dataset.add) {
        addItem(e.target.dataset.add)
    }
    if (e.target.dataset.delete) {
        deleteItem(e.target.dataset.delete)
    }
    if (e.target.id === 'btn-complete-order') {
        console.log('complete')
        displayModal()
    }
    if (e.target.id === 'btn-complete-order') {
        console.log('complete')
        displayModal()
    }
    if (e.target.id === 'modal-close-btn') {
        closeModal()
    }
    if (e.target.id === 'modal-cover') {
        closeModal()
    }
})

function addItem(itemId) {
    console.log('add')
    orderList.push(itemId)
    renderOrder()
}

function deleteItem(itemId) {
    const targetItem = orderList
        .filter((item) => item == itemId)[0]
    const position = orderList.indexOf(targetItem)
    orderList.splice(position, 1)
    orderList.length < 1 ?
        orderContainer.style.display = 'none' :
        renderOrder()
}

function displayModal() {
    modal.style.display = 'block'
    modalCover.style.display = 'block'
}

function closeModal() {
    modal.style.display = 'none'
    modalCover.style.display = 'none'
}

function roundPrice(price) {
    const roundedPrice = (Math.round(price * 100) / 100).toFixed(2)
    return roundedPrice
}

function renderOrder() {
    orderContainer.style.display = 'block'
    let orderHtml = `<h2>Your order</h2>`
    let subTotal = ``
    let tax = ``
    let total = ``
    orderList.map((itemId) => {
        menuArray.find((item) => {
            //const price = (Math.round(item.price * 100) / 100).toFixed(2)
            const price = roundPrice(item.price)
            if (item.id == itemId) {
                subTotal = Number(subTotal) + Number(price)
                orderHtml += `
                    <div class="order-item">
                        <h4>${item.name}</h4>
                        <div id="delete"><i data-delete="${item.id}" class="fa-solid fa-trash-can"></i></div>
                        <p>$${price}</p>
                    </div>
                `
            }
        })
    })
    subTotal = roundPrice(subTotal)
    tax = roundPrice((subTotal * .09))
    total = roundPrice(Number(subTotal) + Number(tax))
    orderHtml += `
        <hr>
        <div class="order-item">
            <h4>Subtotal</h4>
            <p>$${subTotal}</p>
        </div>
        <div class="order-item">
            <h4>Tax</h4>
            <p>$${tax}</p>
        </div>
        <div class="order-item mb highlight">
            <h4>Total</h4>
            <p>$${total}</p>
        </div>
        <button id="btn-complete-order" class="btn btn-complete-order">Complete order</button>
    `
    order.innerHTML = orderHtml
}

orderForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const fullName = e.target.fullName.value;
    const name = fullName.split(' ')[0]
    closeModal()
    thankYou(name)
})

function thankYou(name) {
    let thanksHtml = `
        <div class="thank-you">
            <h2>Thank you, ${name}!</h2>
            <h4>The following order is on the way:</h4>
        `

    const count = {}; // Create an object to store the count of each element in the orderList array

    orderList.forEach((itemId) => {
        menuArray.find((item) => {
            if (item.id == itemId) {
                count[item.name] = (count[item.name] || 0) + 1; // Increment the count for each item
                console.log(count)
            }
        });
    });

    // Create the thanksHtml with the item names and their respective counts
    Object.keys(count).forEach((itemName) => {
        thanksHtml += `<p>${itemName} (${count[itemName]})</p>`;
    });

    thanksHtml += `
        </div>
        `

    orderContainer.innerHTML = thanksHtml

}
