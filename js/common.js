// State
let cart = [];
let currentOrderType = 'dine-in';
let selectedCoupon = null;
let currentDish = null;
let modalQty = 1;
let bannerIdx = 0;
let bannerTimer = null;
let sendCodeCountdown = 0;
let sendCodeTimer = null;

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

// Banner
function goToBanner(idx){
  bannerIdx=idx;
  document.getElementById('bannerTrack').style.transform='translateX(-'+idx*100+'%)';
  document.querySelectorAll('.b-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
}
function autoSlide(){
  bannerTimer=setInterval(()=>{bannerIdx=(bannerIdx+1)%3;goToBanner(bannerIdx)},3000);
}
autoSlide();

// Hero Banner Carousel
const heroSlides=[
  {tag:'营业中 · 新鲜现做',title:'一碗好面<br/>温暖一座城',sub:'拒绝预制 · 匠心手作 · 食材可溯源'},
  {tag:'手工拉面 · 现场制作',title:'匠心手作<br/>每碗都是艺术',sub:'传承百年的拉面工艺 · 当日面粉当日用'},
  {tag:'夜市限定 · 晚间特惠',title:'烟火人间<br/>深夜食堂',sub:'红灯笼下的一碗热面 · 温暖每个夜晚'}
];
let heroIdx=0,heroTimer=null;
function goToHeroSlide(idx){
  heroIdx=idx;
  document.getElementById('heroTrack').style.transform='translateX(-'+idx*100+'%)';
  document.querySelectorAll('.hero-dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
  // Update text with fade
  const t=document.getElementById('heroTitle'),s=document.getElementById('heroSub'),g=document.getElementById('heroTag');
  t.style.opacity='0';s.style.opacity='0';g.style.opacity='0';
  setTimeout(()=>{
    g.textContent=heroSlides[idx].tag;
    t.innerHTML=heroSlides[idx].title;
    s.textContent=heroSlides[idx].sub;
    t.style.opacity='1';s.style.opacity='1';g.style.opacity='1';
  },300);
}
function autoHeroSlide(){
  heroTimer=setInterval(()=>{heroIdx=(heroIdx+1)%3;goToHeroSlide(heroIdx)},4500);
}
autoHeroSlide();

// Menu
function switchCategory(idx){
  document.querySelectorAll('.menu-sb-i').forEach((s,i)=>s.classList.toggle('active',i===idx));
  renderDishes(idx);
}

// Dish extra data (sales, rating, tag)
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
  // Re-render current category to show qty change
  const activeIdx=Array.from(document.querySelectorAll('.menu-sb-i')).findIndex(s=>s.classList.contains('active'));
  if(activeIdx>=0) renderDishes(activeIdx);
}

function renderDishes(catIdx){
  const c=document.getElementById('menuContent');
  const filtered=dishes.filter(d=>d.cat===catIdx);
  const promos=[
    {icon:'M13 2L3 14h9l-1 8 10-12h-9l1-8z',title:'限时特惠',sub:'每日10:00开抢 低至5折',bg:'linear-gradient(135deg,#fff5f0,#ffe0d3)',btn:'去抢购'},
    {icon:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',title:'招牌推荐',sub:'本店招牌 好评率99%',bg:'linear-gradient(135deg,#fff5f0,#ffe0d3)',btn:'查看'},
    {icon:'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z',title:'满30减5',sub:'满50减10 满80减18',bg:'linear-gradient(135deg,#fff5f0,#ffe0d3)',btn:'领券'},
    {icon:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',title:'搭配推荐',sub:'点面加小菜 更划算',bg:'linear-gradient(135deg,#fff5f0,#ffe0d3)',btn:'去看看'},
    {icon:'M22 12h-4l-3 9L9 3l-3 9H2',title:'清凉一夏',sub:'饮品第二杯半价',bg:'linear-gradient(135deg,#fff5f0,#ffe0d3)',btn:'选购'},
    {icon:'M2 7v14a2 2 0 002 2h16a2 2 0 002-2V7M2 7l10-5 10 5',title:'超值套餐',sub:'套餐立省5元起',bg:'linear-gradient(135deg,#fff5f0,#ffe0d3)',btn:'选购'}
  ];
  const p=promos[catIdx];
  const promoHtml=`
    <div style="margin:12px 12px 0;padding:14px 18px;background:${p.bg};border-radius:18px;display:flex;align-items:center;gap:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.04)" onclick="showToast('${p.title}')">
      <div style="flex-shrink:0;width:40px;height:40px;border-radius:12px;background:var(--color-coral-flame);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(247,59,32,.25)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="${p.icon}"/></svg>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:15px;font-weight:700;color:#333">${p.title}</div>
        <div style="font-size:12px;color:#999;margin-top:3px">${p.sub}</div>
      </div>
      <div style="padding:6px 16px;background:#fff;color:var(--color-coral-flame);font-size:13px;font-weight:600;border-radius:20px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.06)">${p.btn}</div>
    </div>
  `;
  c.innerHTML=promoHtml+filtered.map(d=>{
    const extra=getDishExtra(d.id);
    const qty=getCartQty(d.id);
    const tagHtml=extra.tag?`<div class="dc-tag" style="background:${extra.tagColor}">${extra.tag}</div>`:'';
    const qtyHtml=qty>0
      ?`<div class="dc-qty"><button class="dc-qty-b" onclick="event.stopPropagation();updateDishQty(${d.id},-1)">-</button><span class="dc-qty-n">${qty}</span><button class="dc-qty-b" onclick="event.stopPropagation();updateDishQty(${d.id},1)">+</button></div>`
      :`<button class="dc-add" onclick="event.stopPropagation();updateDishQty(${d.id},1)">+</button>`;
    return`
    <div class="dc">
      <div class="dc-img" onclick="openDish(${d.id})">${tagHtml}<img src="${d.img}" style="width:100%;height:100%;object-fit:cover;border-radius:14px" alt="${d.name}"></div>
      <div class="dc-info">
        <div>
          <div class="dc-nm">${d.name}</div>
          <div class="dc-ds">${d.desc}</div>
          <div class="dc-meta">
            <span class="dc-star">&#9733; ${extra.rating}</span>
            <span>·</span>
            <span>月售 ${extra.sales}</span>
          </div>
        </div>
        <div class="dc-bt">
          <span class="dc-pr">¥${d.price}<small>起</small></span>
          ${qtyHtml}
        </div>
      </div>
    </div>
  `}).join('');
}
renderDishes(0);

// Dish detail modal
function openDish(id){
  currentDish=dishes.find(d=>d.id===id);if(!currentDish)return;
  modalQty=1;
  document.getElementById('modalQty').textContent='1';
  document.getElementById('dishModalHeroImg').src=currentDish.img;
  document.getElementById('dishModalHeroImg').alt=currentDish.name;
  document.getElementById('dishModalStickyImg').src=currentDish.img;
  document.getElementById('dishModalStickyImg').alt=currentDish.name;
  document.getElementById('dishModalName').textContent=currentDish.name;
  document.getElementById('dishModalDesc').textContent=currentDish.desc;
  document.getElementById('dishModalPrice').textContent='¥'+currentDish.price;
  document.getElementById('dishModalStickyName').textContent=currentDish.name;
  document.getElementById('dishModalStickyPrice').textContent='¥'+currentDish.price;
  const scrollEl=document.getElementById('dishModalScroll');
  scrollEl.scrollTop=0;
  const bs=document.getElementById('dishModal');
  bs.classList.remove('scrolled');
  bs.classList.add('active');
  document.getElementById('dishOv').classList.add('active');
  scrollEl.onscroll=function(){
    if(scrollEl.scrollTop>180){
      bs.classList.add('scrolled');
    }else{
      bs.classList.remove('scrolled');
    }
  };
}
function closeDishModal(){
  const bs=document.getElementById('dishModal');
  bs.classList.remove('active','scrolled');
  document.getElementById('dishOv').classList.remove('active');
  document.getElementById('dishModalScroll').onscroll=null;
}
function changeModalQty(d){
  modalQty=Math.max(1,modalQty+d);
  document.getElementById('modalQty').textContent=modalQty;
}
function addToCartFromModal(){
  if(!currentDish)return;
  const existing=cart.find(c=>c.id===currentDish.id);
  if(existing)existing.qty+=modalQty;else cart.push({id:currentDish.id,name:currentDish.name,price:currentDish.price,qty:modalQty,img:currentDish.img});
  closeDishModal();
  updateCart();showToast('已加入购物车');
}

// Cart
function addToCart(id){
  const d=dishes.find(x=>x.id===id);if(!d)return;
  const existing=cart.find(c=>c.id===id);
  if(existing)existing.qty++;else cart.push({id:d.id,name:d.name,price:d.price,qty:1,img:d.img});
  updateCart();showToast('已加入购物车');
}

function updateCart(){
  const bar=document.getElementById('cartBar');
  const count=cart.reduce((s,c)=>s+c.qty,0);
  const total=cart.reduce((s,c)=>s+c.price*c.qty,0);
  bar.classList.toggle('vis',count>0);
  const cnt=document.getElementById('cartBarCount');
  cnt.style.display=count>0?'flex':'none';cnt.textContent=count;
  document.getElementById('cartBarPrice').textContent='¥'+total.toFixed(2);
}

// Kitchen camera live time
function updateCamTime(){
  const el=document.getElementById('camTime');
  if(!el)return;
  const now=new Date();
  const h=String(now.getHours()).padStart(2,'0');
  const m=String(now.getMinutes()).padStart(2,'0');
  const s=String(now.getSeconds()).padStart(2,'0');
  el.textContent=h+':'+m+':'+s;
}
setInterval(updateCamTime,1000);
updateCamTime();

function openCart(){
  if(cart.length===0){showToast('购物车为空');return;}
  document.getElementById('cartOverlay').classList.add('active');
  document.getElementById('cartSidebar').classList.add('active');
  renderCartSidebar();
}

function closeCart(){
  document.getElementById('cartOverlay').classList.remove('active');
  document.getElementById('cartSidebar').classList.remove('active');
}

function renderCartSidebar(){
  const list=document.getElementById('cartItemsList');
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
  document.getElementById('cartSidebarTotal').textContent='¥'+total.toFixed(2);
}

function changeCartQty(idx,d){
  cart[idx].qty=Math.max(1,cart[idx].qty+d);
  renderCartSidebar();updateCart();
}

function clearCart(){cart=[];updateCart();closeCart();}

// Start order
function startOrder(type){
  currentOrderType=type;
  navigateTo('page-menu');
  const tabs=document.querySelectorAll('#orderTypeTabs .tab-p');
  tabs.forEach(t=>{t.classList.toggle('active',t.dataset.type===type);});
  switchOrderTypeUI(type);
}

// Go to menu page and switch to specific category
function goToCategory(idx){
  navigateTo('page-menu');
  currentCat=idx;
  renderDishes();
  // Scroll to active category tab
  const catEl=document.querySelectorAll('#catTabs .ct')[idx];
  if(catEl)catEl.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}

// Order type
function switchOrderType(el,type){
  document.querySelectorAll('#orderTypeTabs .tab-p').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  currentOrderType=type;
  switchOrderTypeUI(type);
  updateConfirmPage();
}

function switchOrderTypeUI(type){
  document.getElementById('pickupTimeSection').style.display=type==='pickup'?'block':'none';
  document.getElementById('deliveryAddrSection').style.display=type==='delivery'?'block':'none';
  document.getElementById('tableNumberSection').style.display=type==='dine-in'?'block':'none';
}

// Table selection
let selectedTable='A1';
function selectTable(el){
  document.querySelectorAll('#tableNumberGrid .table-num').forEach(t=>{
    t.classList.remove('active');
    t.style.background='#f5f5f5';t.style.color='#666';t.style.borderColor='transparent';t.style.fontWeight='500';
  });
  el.classList.add('active');
  el.style.background='var(--color-sunset-fade)';el.style.color='var(--color-coral-flame)';el.style.borderColor='rgba(247,59,32,.2)';el.style.fontWeight='600';
  selectedTable=el.textContent;
}

// Tableware count
let tablewareCount=1;
function changeTableware(d){
  tablewareCount=Math.max(0,Math.min(10,tablewareCount+d));
  document.getElementById('tablewareCount').textContent=tablewareCount;
}

// Checkout
function goToCheckout(){
  if(cart.length===0){showToast('请先选择商品');return;}
  closeCart();
  renderConfirmOrder();
  navigateTo('page-confirm');
}

function renderConfirmOrder(){
  const el=document.getElementById('confirmOrderItems');
  if(cart.length===0){
    el.innerHTML='<div style="text-align:center;padding:32px 0;color:#ccc"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5" style="margin:0 auto 8px;display:block"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><div style="font-size:13px">请先选择商品</div></div>';
  }else{
    const totalQty=cart.reduce((s,c)=>s+c.qty,0);
    el.innerHTML=cart.map(c=>{
      const img=dishImgMap[c.name]||'../image/dish-signature-beef.jpg';
      const specs=c.specs&&c.specs.length?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">'+c.specs.map(s=>'<span style="font-size:11px;color:var(--color-coral-flame);background:rgba(247,59,32,.06);padding:1px 6px;border-radius:4px">'+s+'</span>').join('')+'</div>':'';
      return '<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid rgba(0,0,0,.04)"><img src="'+img+'" style="width:56px;height:56px;border-radius:10px;object-fit:cover;flex-shrink:0" alt="'+c.name+'"><div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="font-size:14px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+c.name+'</div><span style="font-size:14px;font-weight:600;flex-shrink:0;margin-left:8px">¥'+(c.price*c.qty)+'</span></div>'+specs+'<div style="font-size:12px;color:#999;margin-top:4px">¥'+c.price+' x '+c.qty+'</div></div></div>';
    }).join('');
  }
  const subtotal=cart.reduce((s,c)=>s+c.price*c.qty,0);
  const totalQty=cart.reduce((s,c)=>s+c.qty,0);
  let disc=0;
  if(selectedCoupon)disc=selectedCoupon.amount;
  const packFee=cart.length>0?2:0;
  const deliveryFee=currentOrderType==='delivery'?5:0;
  const total=Math.max(0,subtotal+packFee+deliveryFee-disc);
  document.getElementById('confirmSubtotal').textContent='¥'+subtotal;
  document.getElementById('confirmPackRow').style.display=cart.length>0?'flex':'none';
  document.getElementById('confirmDelRow').style.display=currentOrderType==='delivery'?'flex':'none';
  document.getElementById('confirmDiscRow').style.display=disc>0?'flex':'none';
  document.getElementById('confirmDisc').textContent='-¥'+disc;
  document.getElementById('confirmTotal').textContent='¥'+total.toFixed(0);
  document.getElementById('confirmTotalBottom').textContent='¥'+total.toFixed(0);
  document.getElementById('confirmItemCount').textContent='共'+totalQty+'件';
  document.getElementById('submitOrderBtn').textContent='提交订单 ¥'+total.toFixed(0);
}

function updateConfirmPage(){renderConfirmOrder();}

// Submit order
function submitOrder(){
  if(cart.length===0){showToast('购物车为空');return;}
  navigateTo('page-success');
  document.getElementById('successPickup').style.display=(currentOrderType==='dine-in'||currentOrderType==='pickup')?'block':'none';
  document.getElementById('successDelivery').style.display=currentOrderType==='delivery'?'block':'none';
  cart=[];updateCart();selectedCoupon=null;
}

// Orders
function switchOrderTab(el){
  document.querySelectorAll('.ord-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  const st=el.dataset.st;
  renderOrders(st);
}

// Dish name to image mapping for order cards
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

function renderOrders(filter){
  const list=document.getElementById('ordersList');
  const filtered=filter==='all'?orders:orders.filter(o=>o.status===filter);
  if(filtered.length===0){
    list.innerHTML='<div style="text-align:center;padding:80px 24px 60px"><div style="width:120px;height:120px;border-radius:50%;background:var(--color-sunset-fade);margin:0 auto 20px;display:flex;align-items:center;justify-content:center"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div style="font-size:16px;font-weight:600;color:#bbb;margin-bottom:6px">暂无订单</div><div style="font-size:13px;color:#ccc">快去下一单吧～</div></div>';
    return;
  }
  const statusMap={
    pending:{text:'待支付',color:'var(--color-magenta-spark)',bg:'rgba(251,45,84,.08)'},
    preparing:{text:'待制作',color:'var(--color-coral-flame)',bg:'rgba(247,59,32,.08)'},
    ready:{text:'待取餐',color:'var(--color-cobalt-pulse)',bg:'rgba(71,126,233,.08)'},
    done:{text:'已完成',color:'var(--color-mint-action)',bg:'rgba(52,199,113,.08)'}
  };
  list.innerHTML=filtered.map(o=>{
    const st=statusMap[o.status];
    const tp=typeStyleMap[o.type];
    const imgSrc=dishImgMap[o.items[0]]||'../image/dish-signature-beef.jpg';
    return `
    <div class="oc" onclick="navigateTo('page-order-detail')" style="cursor:pointer;padding:0;border-radius:16px;overflow:hidden;margin:0 16px 16px">
      <!-- Card Header -->
      <div style="padding:14px 16px 10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(0,0,0,.03)">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;gap:3px;font-size:11px;font-weight:600;padding:3px 8px;border-radius:20px;background:${tp.bg};color:${tp.color}">${tp.icon}<span>${tp.text}</span></div>
          <span style="font-size:13px;color:#999">${o.time}</span>
        </div>
        <span style="font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;background:${st.bg};color:${st.color}">${st.text}</span>
      </div>
      <!-- Card Body -->
      <div style="padding:14px 16px;display:flex;gap:12px;align-items:center">
        <div style="width:64px;height:64px;border-radius:12px;overflow:hidden;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.08)"><img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover" alt="菜品"></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600;color:var(--color-brandwood);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.items.join('、')}</div>
          <div style="font-size:12px;color:#bbb;margin-top:4px">共${o.count}件商品</div>
          ${o.code?'<div style="font-size:13px;color:var(--color-coral-flame);font-weight:600;margin-top:6px;display:flex;align-items:center;gap:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-coral-flame)" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>取餐码 '+o.code+'</div>':''}
          ${o.addr?'<div style="font-size:12px;color:#999;margin-top:6px;display:flex;align-items:center;gap:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>'+o.addr+'</div>':''}
        </div>
      </div>
      <!-- Card Footer -->
      <div style="padding:10px 16px 14px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(0,0,0,.03)">
        <div><span style="font-size:12px;color:#999">实付</span> <span style="font-size:18px;font-weight:700;color:var(--color-coral-flame)">¥${o.total}</span></div>
        <div style="display:flex;gap:8px">
          ${o.status==='pending'?`<button class="btn-o btn-s" style="border-radius:10px;padding:6px 14px;font-size:13px" onclick="event.stopPropagation();showToast('去支付')">去支付</button><button class="btn-o btn-s" style="border-color:#eee;color:#bbb;border-radius:10px;padding:6px 14px;font-size:13px" onclick="event.stopPropagation();showToast('取消订单')">取消</button>`:''}
          ${o.status==='preparing'?`<button class="btn-o btn-s" style="border-radius:10px;padding:6px 14px;font-size:13px" onclick="event.stopPropagation();showToast('已催单')">催单</button>`:''}
          ${o.status==='ready'&&o.type==='delivery'?`<button class="btn-o btn-s" style="border-radius:10px;padding:6px 14px;font-size:13px" onclick="event.stopPropagation();showToast('查看配送进度')">查看配送</button>`:''}
          ${o.status==='ready'&&o.type!=='delivery'?`<button class="btn-o btn-s" style="border-radius:10px;padding:6px 14px;font-size:13px" onclick="event.stopPropagation();showToast('已取餐')">确认取餐</button>`:''}
          ${o.status==='done'?`<button class="btn-o btn-s" style="border-radius:10px;padding:6px 14px;font-size:13px" onclick="event.stopPropagation();showToast('评价')">评价</button><button class="btn-f btn-s" style="border-radius:10px;padding:6px 14px;font-size:13px" onclick="event.stopPropagation();reorder()">再来一单</button>`:''}
        </div>
      </div>
    </div>
  `}).join('');
}
renderOrders('all');

// Coupon sheet
function openCouponSheet(){document.getElementById('couponSheet').classList.add('active');}
function closeCouponSheet(){document.getElementById('couponSheet').classList.remove('active');}
function selectCoupon(amount,name){
  selectedCoupon={amount,name};
  document.getElementById('selCouponText').textContent='-'+name;
  closeCouponSheet();renderConfirmOrder();
}

// Coupon popup
setTimeout(()=>{
  const homePage=document.getElementById('page-home');
  if(homePage && homePage.classList.contains('active')){
    document.getElementById('couponPopup').classList.add('active');
  }
},800);
function closeCouponPopup(){document.getElementById('couponPopup').classList.remove('active');}
function claimCoupon(btn){
  const txt=document.getElementById('cpBtnText');
  if(txt.textContent.includes('已领取')){closeCouponPopup();return;}
  txt.textContent='领取中...';
  btn.style.background='linear-gradient(135deg,#ccc,#ddd)';
  btn.style.boxShadow='none';
  btn.style.cursor='wait';
  setTimeout(()=>{
    btn.style.background='linear-gradient(135deg,#22c55e,#16a34a)';
    btn.style.boxShadow='0 6px 20px rgba(34,197,94,.35)';
    txt.textContent='领取成功';
    btn.style.cursor='pointer';
    setTimeout(()=>{closeCouponPopup();},600);
  },800);
}

// Misc UI
function selectRadio(el){
  const parent=el.parentElement;
  parent.querySelectorAll('.radio-i').forEach(r=>r.classList.remove('sel'));
  el.classList.add('sel');
}

function selectPickupTime(el){selectRadio(el);}

function toggleChildMeal(){
  const box=document.getElementById('childMealBox');
  box.classList.toggle('ck');
  box.querySelector('svg').style.display=box.classList.contains('ck')?'block':'none';
}

function selectRecharge(el,amt){
  document.querySelectorAll('.rch-c').forEach(c=>c.classList.remove('sel'));
  el.classList.add('sel');
}

function switchCouponTab(el,type){
  document.querySelectorAll('#page-coupons .tab-p').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  const list=document.getElementById('couponList');
  if(type==='expired'){
    list.innerHTML=`
      <div class="cpn-c"><div class="cpn-l" style="background:#bbb"><div class="cpn-amt">¥3</div><div class="cpn-cond">满15可用</div></div><div class="cpn-r"><div class="cpn-nm" style="color:#999">满15减3</div><div class="cpn-exp">2026-05-31已过期</div></div><div class="cpn-act"><span class="cpn-btn used">已过期</span></div></div>
      <div class="cpn-c"><div class="cpn-l" style="background:#bbb"><div class="cpn-amt">¥10</div><div class="cpn-cond">满40可用</div></div><div class="cpn-r"><div class="cpn-nm" style="color:#999">满40减10</div><div class="cpn-exp">2026-06-01已过期</div></div><div class="cpn-act"><span class="cpn-btn used">已过期</span></div></div>
    `;
  } else {
    list.innerHTML=`
      <div class="cpn-c"><div class="cpn-l" style="background:var(--gradient-coral-flame)"><div class="cpn-amt">¥5</div><div class="cpn-cond">满20可用</div></div><div class="cpn-r"><div class="cpn-nm">满20减5优惠券</div><div class="cpn-ds">全场通用</div><div class="cpn-exp">2026-07-15到期</div></div><div class="cpn-act"><span class="cpn-btn">去使用</span></div></div>
      <div class="cpn-c"><div class="cpn-l" style="background:linear-gradient(135deg,#ff9800,#f57c00)"><div class="cpn-amt">¥8</div><div class="cpn-cond">满30可用</div></div><div class="cpn-r"><div class="cpn-nm">满30减8优惠券</div><div class="cpn-ds">全场通用</div><div class="cpn-exp">2026-07-31到期</div></div><div class="cpn-act"><span class="cpn-btn">去使用</span></div></div>
      <div class="cpn-c"><div class="cpn-l" style="background:linear-gradient(135deg,#9c27b0,#7b1fa2)"><div class="cpn-amt">¥15</div><div class="cpn-cond">满50可用</div></div><div class="cpn-r"><div class="cpn-nm">满50减15优惠券</div><div class="cpn-ds">限招牌面食</div><div class="cpn-exp">2026-08-15到期</div></div><div class="cpn-act"><span class="cpn-btn">去使用</span></div></div>
    `;
  }
}

function toggleAddrForm(){
  const f=document.getElementById('addrFormSec');
  f.style.display=f.style.display==='none'?'block':'none';
}

function selectGender(el){selectRadio(el);}

function toggleAgreement(){
  const box=document.getElementById('agrBox');
  box.classList.toggle('ck');
  box.querySelector('svg').style.display=box.classList.contains('ck')?'block':'none';
}

function sendCode(){
  if(sendCodeCountdown>0)return;
  sendCodeCountdown=60;
  const btn=document.getElementById('sendCodeBtn');
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