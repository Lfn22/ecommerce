// PRODUTOS
const products = [
  { id:1, nome:"Camiseta", preco:49.9, img:"images/camiseta.jpg", badge:"Novo" },
  { id:2, nome:"Caneca", preco:19.9, img:"images/caneca.jpg" },
  { id:3, nome:"Boné", preco:29.9, img:"images/bone.jpg", badge:"Promoção" },
  { id:4, nome:"Mochila", preco:89.9, img:"images/mochila.jpg" },
  { id:5, nome:"Camiseta Estampada", preco:59.9, img:"images/camisaestampada.jpg", badge:"Novo" },
  { id:6, nome:"Tênis", preco:199.9, img:"images/tenis.jpg" },
  { id:7, nome:"Fone de Ouvido", preco:149.9, img:"images/fone.jpg", badge:"Promoção" },
  { id:8, nome:"Jaqueta", preco:249.9, img:"images/jaqueta.jpg" }
];

// CARRINHO
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discount = 0;

// ELEMENTOS
const productsContainer = document.getElementById("products");
const cartBtn = document.getElementById("cart-btn");
const cartAside = document.getElementById("cart");
const closeCartBtn = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const couponInput = document.getElementById("coupon");
const applyCouponBtn = document.getElementById("apply-coupon");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const filterButtons = document.querySelectorAll("#filters button");

// RENDER PRODUTOS
function renderProducts(lista){
  productsContainer.innerHTML = "";
  lista.forEach(p=>{
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.img}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p class="price">R$ ${p.preco.toFixed(2)}</p>
      <button onclick="addToCart(${p.id})">Adicionar ao Carrinho</button>
      ${p.badge?`<span class="badge">${p.badge}</span>`:""}
    `;
    productsContainer.appendChild(div);
  });
}

// RENDER CARRINHO
function updateCart(){
  cartItems.innerHTML = "";
  let total=0;
  cart.forEach((item,index)=>{
    const li=document.createElement("li");
    li.innerHTML = `
      ${item.nome} - R$ ${item.preco.toFixed(2)}
      <div>
        <button onclick="decreaseQuantity(${index})">➖</button>
        <span>${item.quantity||1}</span>
        <button onclick="increaseQuantity(${index})">➕</button>
        <button onclick="removeFromCart(${index})">❌</button>
      </div>
    `;
    cartItems.appendChild(li);
    total += (item.preco*(item.quantity||1));
  });
  total -= discount;
  cartCount.textContent = cart.length;
  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
  localStorage.setItem("cart",JSON.stringify(cart));
}

// ADICIONAR AO CARRINHO
function addToCart(id){
  const product = products.find(p=>p.id===id);
  const existing = cart.find(item=>item.id===id);
  if(existing){ existing.quantity=(existing.quantity||1)+1; }
  else{ product.quantity=1; cart.push(product); }
  updateCart();
}

// REMOVER / QUANTIDADE
function removeFromCart(index){ cart.splice(index,1); updateCart(); }
function increaseQuantity(index){ cart[index].quantity++; updateCart(); }
function decreaseQuantity(index){ if(cart[index].quantity>1){ cart[index].quantity--; }else{ removeFromCart(index); } updateCart(); }

// CUPOM
applyCouponBtn.addEventListener("click",()=>{
  const code=couponInput.value.trim().toUpperCase();
  if(code==="PROMO10"){ discount=10; alert("Cupom aplicado: R$10 de desconto!"); }
  else{ discount=0; alert("Cupom inválido!"); }
  updateCart();
});

// ABRIR / FECHAR CARRINHO COM BLOQUEIO SCROLL
function openCart(){ cartAside.classList.add("open"); document.body.style.overflow="hidden"; }
function closeCart(){ cartAside.classList.remove("open"); document.body.style.overflow="auto"; }
cartBtn.addEventListener("click",()=>{ openCart(); });
closeCartBtn.addEventListener("click",()=>{ closeCart(); });

// CHECKOUT
checkoutBtn.addEventListener("click",()=>{
  if(cart.length===0){ alert("Seu carrinho está vazio!"); }
  else{ alert("Compra finalizada com sucesso!"); cart=[]; discount=0; updateCart(); closeCart(); }
});

// BUSCA / FILTRO / ORDENACAO
searchInput.addEventListener("input",()=>{
  const termo=searchInput.value.toLowerCase();
  renderProducts(products.filter(p=>p.nome.toLowerCase().includes(termo)));
});

sortSelect.addEventListener("change",()=>{
  let sorted=[...products];
  if(sortSelect.value==="asc") sorted.sort((a,b)=>a.preco-b.preco);
  else if(sortSelect.value==="desc") sorted.sort((a,b)=>b.preco-a.preco);
  renderProducts(sorted);
});

filterButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const filtro=btn.dataset.filter;
    if(filtro==="all") renderProducts(products);
    else renderProducts(products.filter(p=>p.badge===filtro));
  });
});

// RENDER INICIAL
renderProducts(products);
updateCart();
