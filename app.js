const base='assets/';
const demoBarObserver=new ResizeObserver(entries=>{document.documentElement.style.setProperty('--demo-bar-height',entries[0].target.getBoundingClientRect().height+'px');});demoBarObserver.observe(document.querySelector('.demo-bar'));
const tours=window.tourItems;
const grid=document.querySelector('#tour-grid');let filter='all';
function render(){const q=document.querySelector('#search').value.toLowerCase().trim();const visible=tours.filter(t=>(filter==='all'||t.type===filter)&&(t.name+' '+t.route).toLowerCase().includes(q));grid.innerHTML=visible.map(t=>`<article class="tour-card"><img src="${base+t.img}" alt="${t.name} illustrative destination scenery" width="480" height="600" loading="lazy"><div class="card-meta">${t.days.toUpperCase()} · ${t.type==='culture'?'CULTURE':'NATURE'}</div><h3>${t.name}</h3><p>${t.intro}</p><button class="card-button" data-tour="${t.name}">Explore journey <span aria-hidden="true">↗</span></button></article>`).join('');document.querySelector('#empty').hidden=visible.length!==0;document.querySelector('#count').textContent=visible.length+' journeys shown';decorateCards();}
render();document.querySelector('#search').addEventListener('input',render);
document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('.chip').forEach(c=>{c.classList.toggle('active',c===b);c.setAttribute('aria-pressed',String(c===b));});render();}));
document.querySelector('#theme').addEventListener('change',e=>document.body.dataset.theme=e.target.value);
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
const dialog=document.querySelector('#tour-dialog');let currentTour,previousFocus;
function openTour(tour,trigger){currentTour=tour;previousFocus=trigger;document.querySelector('#dialog-title').textContent=tour.name;document.querySelector('#dialog-meta').textContent=tour.days+' / '+tour.region;document.querySelector('#dialog-intro').textContent=tour.intro;document.querySelector('#dialog-photo').src=base+tour.img;document.querySelector('#dialog-photo').alt=tour.name+' destination illustration';document.querySelector('#detail-content').innerHTML=tour.details;dialog.showModal();dialog.scrollTop=0;}
grid.addEventListener('click',e=>{const b=e.target.closest('[data-tour]');if(b)openTour(tours.find(t=>t.name===b.dataset.tour),b);});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>previousFocus?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function choose(name){document.querySelector('#destination').value=name;document.querySelector('#prepared').hidden=true;document.querySelector('#inquiry').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('#destination').focus({preventScroll:true});}
document.querySelector('#detail-inquire').addEventListener('click',()=>{dialog.close();choose(currentTour.name);});
const form=document.querySelector('#inquiry-form');const monthInput=form.elements.month;const now=new Date();monthInput.min=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
form.addEventListener('input',()=>{document.querySelector('#prepared').hidden=true;});
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const month=data.get('month');if(month<monthInput.min){monthInput.setCustomValidity('Choose this month or a future month.');monthInput.reportValidity();return;}const msg=`Hello Aalam Travels, I’d like to discuss a trip.\n\nDestination: ${data.get('destination')}\nPreferred month: ${month}\nTravellers: ${data.get('travellers')}\nTotal group budget (LKR): ${data.get('budget')}\nPlanning stage: ${data.get('readiness')}\nTravel style: ${data.get('style')}\nAdditional notes: ${data.get('notes')||'None'}\n\nPlease confirm current departures, availability, inclusions and the full quote.`;document.querySelector('#message').textContent=msg;document.querySelector('#email-draft').href='mailto:info@aalamtravels.com?subject='+encodeURIComponent('Tour inquiry: '+data.get('destination'))+'&body='+encodeURIComponent(msg);const prepared=document.querySelector('#prepared');prepared.hidden=false;document.querySelector('#copy-status').textContent='';prepared.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});});
monthInput.addEventListener('input',()=>monthInput.setCustomValidity(''));
document.querySelector('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#message').textContent);document.querySelector('#copy-status').textContent='Copied. Review the message before sending it yourself.';}catch{document.querySelector('#copy-status').textContent='Select and copy the message above. Clipboard access is unavailable in this browser.';}});

function decorateCards(){grid.querySelectorAll('.tour-card').forEach((card,i)=>{
 card.style.setProperty('--delay',Math.min(i,3)*.07+'s');
 const tour=tours.find(t=>t.name===card.querySelector('[data-tour]').dataset.tour);
 card.dataset.glow=tour.img.replace('-generated.jpg','');
 if(tour.palette){card.style.setProperty('--glow-primary',tour.palette[0]);card.style.setProperty('--glow-secondary',tour.palette[1]);}
 card.querySelector('.tour-offer')?.remove();const offer=document.createElement('div');offer.className='tour-offer';
 offer.innerHTML=`<strong>${tour.cardPrice}</strong><small>${tour.fromFlyer?'Flyer offer · confirm price basis and availability':'Website reference · current quote to confirm'}</small>`;
 if(tour.source){offer.innerHTML+='<ul class="package-list card-packages">'+tour.variants.map(v=>offerMarkup(tour.source,v)).join('')+'</ul>';}
 else{offer.innerHTML+='<small>Departure: to be confirmed</small>';}
 card.querySelector('.card-button').before(offer);
});}



const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');

// Count the founding year once, when it enters view. The accessible year stays fixed.
const yearCounter=document.querySelector('[data-year-count]');
let yearFrame=0,yearStarted=false;
function finishYearCount(){cancelAnimationFrame(yearFrame);yearCounter.textContent='1991';}
const yearObserver=new IntersectionObserver(entries=>{
  if(yearStarted||!entries.some(entry=>entry.isIntersecting))return;
  yearStarted=true;yearObserver.disconnect();
  if(reducedMotion.matches)return finishYearCount();
  const start=performance.now(),duration=1800;
  function tick(now){
    const progress=Math.min((now-start)/duration,1);
    yearCounter.textContent=String(Math.round(1991*(1-Math.pow(1-progress,3))));
    if(progress<1)yearFrame=requestAnimationFrame(tick);else finishYearCount();
  }
  yearCounter.textContent='0';yearFrame=requestAnimationFrame(tick);
},{threshold:.5});
yearObserver.observe(yearCounter);
reducedMotion.addEventListener('change',event=>{if(event.matches&&yearStarted)finishYearCount();});
window.addEventListener('pagehide',()=>cancelAnimationFrame(yearFrame));


