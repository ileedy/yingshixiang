// State
let cart = (()=>{try{const raw=localStorage.getItem('cart');return raw?JSON.parse(raw):[];}catch(e){return[];}})();
let currentOrderType = 'dine-in';
let selectedCoupon = null;
let currentDish = null;
let modalQty = 1;
let sendCodeCountdown = 0;
let sendCodeTimer = null;

function saveCart(){try{localStorage.setItem('cart',JSON.stringify(cart));}catch(e){}}

// Dish data
const dishes = [
  {id:1,name:'招牌牛肉面',price:26,desc:'招牌必点，鲜嫩牛肉配秘制浇头',cat:0,img:'../image/dish-signature-beef.jpg'},
  {id:2,name:'酸辣肥肠面',price:28,desc:'酸辣开胃，肥肠处理干净',cat:0,img:'../image/dish-spicy-intestine.jpg'},
  {id:3,name:'红烧牛肉面',price:24,desc:'经典红烧，浓郁入味',cat:0,img:'../image/dish-braised-beef.jpg'},
  {id:4,name:'蕃茄牛腩面',price:22,desc:'新鲜番茄炖牛腩，酸甜可口',cat:0,img:'../image/dish-tomato-beef.jpg'},
  {id:5,name:'香辣鸡丁面',price:20,desc:'鸡丁鲜嫩，香辣过瘾',cat:1,img:'../image/dish-spicy-chicken.jpg'},
  {id:6,name:'老坛酸菜鱼面',price:32,desc:'老坛酸菜，鱼片鲜嫩',cat:1,img:'../image/dish-sour-fish.jpg'},
  {id:7,name:'葱油拌面',price:14,desc:'葱香四溢，简单美味',cat:1,img:'../image/dish-scallion-oil.jpg'},
  {id:8,name:'担担面',price:16,desc:'正宗川味，麻辣鲜香',cat:1,img:'../image/dish-dandan-noodle.jpg'},
  {id:9,name:'重庆小面',price:15,desc:'地道重庆味，麻辣爽口',cat:1,img:'../image/dish-shrimp-wonton.jpg'},
  {id:10,name:'红烧排骨饭',price:28,desc:'排骨软烂入味，米饭管够',cat:2,img:'../image/dish-chicken-rice.jpg'},
  {id:11,name:'宫保鸡丁饭',price:25,desc:'经典川菜，酸甜辣口',cat:2,img:'../image/dish-mushroom-rice.jpg'},
  {id:12,name:'麻婆豆腐饭',price:20,desc:'麻辣鲜香，下饭神器',cat:2,img:'../image/dish-spicy-tofu.jpg'},
  {id:13,name:'口水鸡饭',price:22,desc:'红油飘香，鸡肉滑嫩',cat:2,img:'../image/dish-pork-rice.jpg'},
  {id:14,name:'凉拌黄瓜',price:8,desc:'清脆爽口，开胃小菜',cat:3,img:'../image/dish-cold-cucumber.jpg'},
  {id:15,name:'红油抄手',price:12,desc:'皮薄馅大，红油香辣',cat:3,img:'../image/dish-scallion-oil.jpg'},
  {id:16,name:'糖醋排骨',price:18,desc:'外酥里嫩，酸甜适口',cat:3,img:'../image/dish-signature-beef.jpg'},
  {id:17,name:'冰红茶',price:8,desc:'冰爽解辣',cat:4,img:'../image/dish-iced-plum.jpg'},
  {id:18,name:'柠檬水',price:6,desc:'新鲜柠檬，清凉解渴',cat:4,img:'../image/dish-soy-milk.jpg'},
  {id:19,name:'绿豆汤',price:6,desc:'清热解暑',cat:4,img:'../image/dish-egg-drop-soup.jpg'},
  {id:20,name:'招牌面+冰红茶套餐',price:30,desc:'招牌牛肉面配冰红茶，省¥4',cat:5,img:'../image/dish-combo-set.jpg'},
  {id:21,name:'酸菜鱼面+绿豆汤',price:35,desc:'老坛酸菜鱼面配绿豆汤',cat:5,img:'../image/dish-combo-set.jpg'},
];

// Orders data
const orders = [
  {id:'YSX20260628002',store:'万象城店',status:'pending',type:'dine-in',time:'2026-06-28 11:45',items:['招牌牛肉面'],count:1,total:26,code:'A-087'},
  {id:'YSX20260628001',store:'万象城店',status:'preparing',type:'dine-in',time:'2026-06-28 11:30',items:['酸辣肥肠面','冰红茶'],count:2,total:36,code:'A-086'},
  {id:'YSX20260627003',store:'万象城店',status:'ready',type:'delivery',time:'2026-06-27 12:15',items:['红烧牛肉面','凉拌黄瓜'],count:2,total:32,code:'',addr:'天府大道888号'},
  {id:'YSX20260627002',store:'万象城店',status:'done',type:'pickup',time:'2026-06-27 11:00',items:['蕃茄牛腩面'],count:1,total:22,code:'A-085'},
  {id:'YSX20260626001',store:'万象城店',status:'done',type:'dine-in',time:'2026-06-26 12:30',items:['担担面','香辣鸡丁面','绿豆汤'],count:3,total:41,code:'A-083'},
];

// Functions
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1500);
}

function navigateTo(pageId){
  const isInHtmlDir = window.location.pathname.includes('/html/');
  const h = isInHtmlDir ? '' : 'html/';
  const up = isInHtmlDir ? '../' : '';
  const map={'page-home':up+'index.html','page-menu':h+'menu.html','page-confirm':h+'confirm.html','page-success':h+'success.html','page-orders':h+'orders.html','page-order-detail':h+'order-detail.html','page-profile':h+'profile.html','page-messages':h+'messages.html','page-trace':h+'trace.html','page-points-mall':h+'points-mall.html','page-recharge':h+'recharge.html','page-coupons':h+'coupons.html','page-address':h+'address.html','page-child':h+'child.html','page-about':h+'about.html','page-feedback':h+'feedback.html','page-settings':h+'settings.html','page-login':h+'login.html'};
  window.location.href=map[pageId]||'index.html';
}

function navTo(pageId,el){
  navigateTo(pageId);
}

function getDishExtra(id){
  const map={
    1:{sales:856,rating:4.9,tag:'招牌',tagColor:'linear-gradient(135deg,#f73b20,#ff6b35)'},
    2:{sales:523,rating:4.7,tag:'热销',tagColor:'linear-gradient(135deg,#ff8f00,#ffd700)'},
    3:{sales:742,rating:4.8,tag:'',tagColor:''},
    4:{sales:389,rating:4.6,tag:'',tagColor:''},
    5:{sales:612,rating:4.7,tag:'',tagColor:''},
    6:{sales:934,rating:4.9,tag:'人气',tagColor:'linear-gradient(135deg,#f73b20,#ff6b35)'},
    7:{sales:445,rating:4.5,tag:'',tagColor:''},
    8:{sales:567,rating:4.6,tag:'',tagColor:''},
    9:{sales:378,rating:4.5,tag:'',tagColor:''},
    10:{sales:298,rating:4.4,tag:'',tagColor:''},
    11:{sales:412,rating:4.6,tag:'',tagColor:''},
    12:{sales:356,rating:4.5,tag:'',tagColor:''},
    13:{sales:289,rating:4.4,tag:'',tagColor:''},
    14:{sales:678,rating:4.8,tag:'',tagColor:''},
    15:{sales:445,rating:4.6,tag:'',tagColor:''},
    16:{sales:312,rating:4.5,tag:'',tagColor:''},
    17:{sales:567,rating:4.7,tag:'',tagColor:''},
    18:{sales:823,rating:4.8,tag:'',tagColor:''},
    19:{sales:445,rating:4.6,tag:'',tagColor:''},
    20:{sales:234,rating:4.5,tag:'套餐',tagColor:'linear-gradient(135deg,#477ee9,#2196f3)'},
    21:{sales:189,rating:4.4,tag:'套餐',tagColor:'linear-gradient(135deg,#477ee9,#2196f3)'}
  };
  return map[id]||{sales:0,rating:4.5,tag:'',tagColor:''};
}

function getCartQty(id){
  const item=cart.find(c=>c.id===id);
  return item?item.qty:0;
}

function updateDishQty(id,delta){
  const d=dishes.find(x=>x.id===id);if(!d)return;
  const existing=cart.find(c=>c.id===id);
  if(existing){
    existing.qty=Math.max(0,existing.qty+delta);
    if(existing.qty===0){
      cart=cart.filter(c=>c.id!==id);
    }
  }else if(delta>0){
    cart.push({id:d.id,name:d.name,price:d.price,qty:delta,img:d.img});
  }
  updateCart();
  const activeIdx=Array.from(document.querySelectorAll('.menu-sb-i')).findIndex(s=>s.classList.contains('active'));
  if(activeIdx>=0 && typeof renderDishes==='function') renderDishes(activeIdx);
}

function addToCart(id){
  const d=dishes.find(x=>x.id===id);if(!d)return;
  const existing=cart.find(c=>c.id===id);
  if(existing)existing.qty++;else cart.push({id:d.id,name:d.name,price:d.price,qty:1,img:d.img});
  updateCart();showToast('已加入购物车');
  const activeIdx=Array.from(document.querySelectorAll('.menu-sb-i')).findIndex(s=>s.classList.contains('active'));
  if(activeIdx>=0 && typeof renderDishes==='function') renderDishes(activeIdx);
}

function updateCart(){
  const bar=document.getElementById('cartBar');
  if(!bar)return;
  const count=cart.reduce((s,c)=>s+c.qty,0);
  const total=cart.reduce((s,c)=>s+c.price*c.qty,0);
  bar.classList.toggle('vis',count>0);
  const cnt=document.getElementById('cartBarCount');
  if(cnt){cnt.style.display=count>0?'flex':'none';cnt.textContent=count;}
  const priceEl=document.getElementById('cartBarPrice');
  if(priceEl)priceEl.textContent='¥'+total.toFixed(2);
  saveCart();
}

function openCart(){
  if(cart.length===0){showToast('购物车为空');return;}
  document.getElementById('cartOverlay').classList.add('active');
  document.getElementById('cartSidebar').classList.add('active');
  document.body.style.overflow='hidden';
  if(typeof renderCartSidebar==='function') renderCartSidebar();
}

function closeCart(){
  document.getElementById('cartOverlay').classList.remove('active');
  document.getElementById('cartSidebar').classList.remove('active');
  document.body.style.overflow='';
}

function renderCartSidebar(){
  const list=document.getElementById('cartItemsList');
  if(!list)return;
  const total=cart.reduce((s,c)=>s+c.price*c.qty,0);
  list.innerHTML=cart.map((c,i)=>`
    <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(0,0,0,.04);align-items:center">
      <div style="width:56px;height:56px;border-radius:12px;overflow:hidden;flex-shrink:0;box-shadow:0 2px 6px rgba(0,0,0,.08)"><img src="${c.img}" style="width:100%;height:100%;object-fit:cover" alt="${c.name}"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:600;color:var(--color-brandwood);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
        <div style="font-size:15px;color:var(--color-coral-flame);font-weight:700;margin-top:6px">¥${c.price}</div>
      </div>
      <div class="qty-s"><button class="qty-b" onclick="changeCartQty(${i},-1)">-</button><span class="qty-n">${c.qty}</span><button class="qty-b" onclick="changeCartQty(${i},1)">+</button></div>
    </div>
  `).join('');
  const totalEl=document.getElementById('cartSidebarTotal');
  if(totalEl)totalEl.textContent='¥'+total.toFixed(2);
}

function changeCartQty(idx,d){
  cart[idx].qty=Math.max(1,cart[idx].qty+d);
  renderCartSidebar();updateCart();
}

function clearCart(){cart=[];updateCart();closeCart();}

const dishImgMap={
  '招牌牛肉面':'../image/dish-signature-beef.jpg',
  '酸辣肥肠面':'../image/dish-spicy-intestine.jpg',
  '红烧牛肉面':'../image/dish-braised-beef.jpg',
  '蕃茄牛腩面':'../image/dish-tomato-beef.jpg',
  '香辣鸡丁面':'../image/dish-spicy-chicken.jpg',
  '老坛酸菜鱼面':'../image/dish-sour-fish.jpg',
  '葱油拌面':'../image/dish-scallion-oil.jpg',
  '担担面':'../image/dish-dandan-noodle.jpg',
  '重庆小面':'../image/dish-shrimp-wonton.jpg',
  '红烧排骨饭':'../image/dish-chicken-rice.jpg',
  '宫保鸡丁饭':'../image/dish-mushroom-rice.jpg',
  '麻婆豆腐饭':'../image/dish-spicy-tofu.jpg',
  '口水鸡饭':'../image/dish-pork-rice.jpg',
  '凉拌黄瓜':'../image/dish-cold-cucumber.jpg',
  '红油抄手':'../image/dish-scallion-oil.jpg',
  '糖醋排骨':'../image/dish-signature-beef.jpg',
  '冰红茶':'../image/dish-iced-plum.jpg',
  '柠檬水':'../image/dish-soy-milk.jpg',
  '绿豆汤':'../image/dish-egg-drop-soup.jpg',
};

const typeStyleMap={
  'dine-in':{text:'堂食',bg:'rgba(52,199,113,.08)',color:'var(--color-mint-action)',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-mint-action)" stroke-width="2.5"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>'},
  'pickup':{text:'自提',bg:'rgba(71,126,233,.08)',color:'var(--color-cobalt-pulse)',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-cobalt-pulse)" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>'},
  'delivery':{text:'外卖',bg:'rgba(251,45,84,.08)',color:'var(--color-magenta-spark)',icon:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-magenta-spark)" stroke-width="2.5"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 3 22 8 22 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>'}
};

function selectRadio(el){
  const parent=el.parentElement;
  parent.querySelectorAll('.radio-i').forEach(r=>r.classList.remove('sel'));
  el.classList.add('sel');
}

function sendCode(){
  if(sendCodeCountdown>0)return;
  sendCodeCountdown=60;
  const btn=document.getElementById('sendCodeBtn');
  if(!btn)return;
  btn.textContent=sendCodeCountdown+'s';
  btn.style.opacity='0.5';
  sendCodeTimer=setInterval(()=>{
    sendCodeCountdown--;
    if(sendCodeCountdown<=0){clearInterval(sendCodeTimer);btn.textContent='获取验证码';btn.style.opacity='1';}
    else btn.textContent=sendCodeCountdown+'s';
  },1000);
  showToast('验证码已发送');
}

function doLogin(){showToast('登录成功');navigateTo('page-profile');}
function reorder(){showToast('已加入购物车');navigateTo('page-menu');}
function goToCheckout(){
  if(cart.length===0){showToast('购物车为空');return;}
  saveCart();
  navigateTo('page-confirm');
}

// Auto scroll to top on page load
window.addEventListener('DOMContentLoaded',()=>{window.scrollTo(0,0);});

function startOrder(type){
  currentOrderType=type||'dine-in';
  saveCart();
  navigateTo('page-menu');
}
function goToCategory(cat){
  window.location.href='html/menu.html?cat='+cat;
}
