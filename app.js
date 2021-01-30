const cards = document.getElementById('cards')  // iTens existentes no api.json
const items = document.getElementById('items')  // Itens no carro
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded' , () => {
    fetchData()
    // Guarda os valores para poder atualizar o navegador **
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnMaisMenos(e)
})


const fetchData = async () => {
    try {
        const res = await fetch('api.json')  // busca as informações trocar por banco de dadaos
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
} 

const pintarCards = data => {
    //console.log(data)
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = e => {
    //console.log(e.target)
    //console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
   // console.log(objeto)   // aqui tem todos os dados
    const producto  = {
        id: objeto.querySelector('.btn-dark').dataset.id,    //Estou pegando o id do botão preto
        title: objeto.querySelector('h5').textContent,        //Titulo do produto 
        precio: objeto.querySelector('p').textContent,       // Pega o preço
        cantidad: 1     // vai precisar crescer ou diminuir na rotina abaixo
    }
        //Verifica o carro de compras se tem o produto
    if(carrito.hasOwnProperty(producto.id)) { 
        // Se ja tiver vai somar 1
        producto.cantidad = carrito[producto.id].cantidad +1
    }
        //  Uma Matrix
    carrito[producto.id] = {...producto}   // estou colocando o produto dentro do carro de compras
    pintarCarrito()  // chama a função de baixo cada vez que incerimos um novo item
}
// Linha completa do item de pedido
const pintarCarrito = () => {
    //console.log(carrito)
    items.innerHTML = '' // Se houver um igual somente incrementa o quantidade
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title       //  All porque ha variso td no template então pega-se o primeiro 
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad// Calcula o valor total do item 
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id             // os botões de mais e menos 
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
    //  ** complemento para guardar o valor 
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    //if(Object.keys(carrito.length === 0)){
    //    footer.innerHTML = '<th scope="row" colspan="5">Pedido está vazio, começe o pedido!</th>'
    //    return
    //}
            // somar matrix
    const ncantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nprecio = Object.values(carrito).reduce((acc,{cantidad, precio}) => acc + cantidad * precio,0)
    // Preparando a soma de quantidades de a soma dos totais dos items
    templateFooter.querySelector('.quant-total').texteContent = ncantidad
    templateFooter.querySelector('span').textContent = nprecio
    //console.log(ncantidad)
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    // Limpa pedido 
    const btnvaciar = document.getElementById('vaciar-carrito')
    btnvaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnMaisMenos = e => {
    //console.log(e.target)
    // Aumentar
    if(e.target.classList.contains('btn-info')) {
        console.log(carrito[e.target.dataset.id])
       // carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()

}
