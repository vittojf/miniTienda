const badge = document.querySelector('.badge');
const comprar = document.getElementById('comprar');
const carritoItems = document.getElementById('carritoItems');
const footer = document.getElementById('footer');
const productos = document.getElementById('productos');
const templateFooter = document.querySelector('#template-pie').content;
const templateItems = document.querySelector('#template-items').content;
const templateCarrito = document.querySelector('#template-carrito').content;
const fragment = new DocumentFragment();
let array = [];
let cantidad= [];
let carrito ={};



document.addEventListener('DOMContentLoaded',()=>{
  fetchData();
 if(localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito();
  }
})



productos.addEventListener('click',e =>{
    addCarrito(e);
  })

carritoItems.addEventListener('click', e =>{
    accion(e);
})

comprar.addEventListener('click',e=>{
  btnComprar();
})



const btnComprar= ()=>{


    if(Object.keys(carrito).length === 0){
    } 
    Object.values(carrito).forEach(e=>{
      array.push(JSON.stringify(e.title+' = '+e.cantidad))
    

    })
const nCantidad = Object.values(carrito).reduce((acc,{cantidad})=>acc+cantidad,0)
const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio})=>acc+cantidad*precio,0)
localStorage.removeItem('carrito');
    window.location=`https://api.whatsapp.com/send?phone=584241223373&text=Hola+soy++estos+son+los+articulos+que+escogí+para+comprar+mediante+tu+pagina%3A%0A%0A${array.toString()}%3A%0A%0Acantidad+de+Productos%3A${nCantidad}+%2C%0ATotal%3A${nPrecio}+%0A`;

     

}




const fetchData = async() =>{
    try{
        const res= await fetch('obj.json');
        const data = await res.json();
       pintarProd(data)
        //console.log(data)
    }catch(error){
      console.log(error);
    }
  }


//funciones
const pintarProd= data =>{
  data.forEach(i  => {
      templateItems.querySelector('h5').textContent = i.title;
      templateItems.querySelector('p').textContent = i.precio;
      templateItems.querySelector('img').setAttribute('src',i.thumbnailUrl);
      templateItems.querySelector('.btn-dark').dataset.id=i.id;
      const clone = templateItems.cloneNode(true);
      fragment.appendChild(clone);
  });
  productos.appendChild(fragment)
  }



  const addCarrito = e =>{
    if(  e.target.classList.contains('btn-dark')){
    setCarrito(e.target.parentElement)
    }
    e.stopPropagation();
    }


//luego almacena todos los datos en un nuevo objeto para remplazarlo con otro llamado Carrito y ademas de 
// agregar una condicion que si le da varias veces el producto se sumará
const setCarrito = obj =>{
    const producto ={
        id:obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        precio: obj.querySelector('p').textContent,
        cantidad:1
      }
    
    if(carrito.hasOwnProperty(producto.id)){
      producto.cantidad =carrito[producto.id].cantidad + 1;
    }
    
    //adquiere la informacion es decir. copia el objeto de producto y lo manda al objeto carrito
    carrito[producto.id] = {...producto};
    pintarCarrito()
}


//primero pasa a agregar al carrito agregandole una condicion si seleccionó el boton de comprar


//y por ultimo el dato se pintará en el carrito
const pintarCarrito = () =>{
carritoItems.innerHTML = '';
Object.values(carrito).forEach(producto=>{
  templateCarrito.querySelector('th').textContent = producto.id;
  templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
  templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
  templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
  templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
  templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;
  const clone = templateCarrito.cloneNode(true);
  fragment.appendChild(clone);


})
carritoItems.appendChild(fragment);
const nCantidad = Object.values(carrito).reduce((acc,{cantidad})=>acc+cantidad,0)

if(nCantidad === 0){
  badge.textContent='';
}else{

    badge.textContent = nCantidad;

}


pintarFooter();
localStorage.setItem('carrito', JSON.stringify(carrito));

}



const pintarFooter = () =>{
    footer.innerHTML='';
    if(Object.keys(carrito).length === 0){
      footer.innerHTML =`
      <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
      `
      return
    }
  
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad})=>acc+cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio})=>acc+cantidad*precio,0)
  
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent= nPrecio;
    const clone = templateFooter.cloneNode(true);
  
    fragment.appendChild(clone);
  
    footer.appendChild(fragment);
  
    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click',() =>{
      carrito={};
      pintarCarrito();
    })
  
  }




const accion = e =>{
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = {...producto};
        pintarCarrito();
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if(producto.cantidad===0){

            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }
    e.stopPropagation();
}
