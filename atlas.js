// A local Natural Earth atlas: no tile service, API key or runtime map dependency.
const atlasCountries={
 'al-aqsa':['ISR','JOR'],'morocco':['MAR'],'spain-portugal':['ESP','PRT','MAR'],
 'european-jewel':['ITA','AUT','LIE','CHE','DEU','NLD','BEL','FRA','VAT'],
 'china':['CHN'],'vietnam':['VNM'],'usa-east-west':['USA'],'egypt-nile-cruise':['EGY'],
 'eastern-europe':['CZE','DEU','AUT','HUN','SVK'],'dream-cruise':['SGP','THA'],
 'kyrgyzstan-tajikistan':['KGZ','TJK'],'japan':['JPN'],'scandinavia':['DNK','NOR','SWE','FIN','EST'],
 'tunisia':['TUN'],'australia-new-zealand':['AUS','NZL'],'brazil-peru-mexico':['BRA','PER','MEX'],
 'georgia':['GEO'],'azerbaijan':['AZE'],'balkans':['HRV','BIH','MNE','ALB','MKD','GRC','BGR','ROU'],
 'kazakhstan-uzbekistan':['KAZ','UZB'],'turkiye':['TUR'],'south-korea':['KOR'],'bali':['IDN']
};
const atlasContinents=[
 ['Asia',['al-aqsa','china','vietnam','dream-cruise','kyrgyzstan-tajikistan','japan','georgia','azerbaijan','kazakhstan-uzbekistan','turkiye','south-korea','bali']],
 ['Europe',['spain-portugal','european-jewel','eastern-europe','scandinavia','balkans']],
 ['Africa',['morocco','egypt-nile-cruise','tunisia']],
 ['N. America',['usa-east-west']],['S. America',['brazil-peru-mexico']],['Oceania',['australia-new-zealand']]
];
const atlasNS='http://www.w3.org/2000/svg';
function atlasEl(tag,attributes){const el=document.createElementNS(atlasNS,tag);for(const [key,value] of Object.entries(attributes))el.setAttribute(key,value);return el;}
function project(lon,lat){return{x:22+(lon+180)/360*956,y:30+(85-lat)/150*430};}
const atlasLand=document.querySelector('#land'),atlasRoutes=document.querySelector('#routes'),atlasPins=document.querySelector('#map-pins');
const countryLookup=new Map();
tours.forEach((tour,i)=>(atlasCountries[tour.id]||[]).forEach(code=>{if(!countryLookup.has(code))countryLookup.set(code,[]);countryLookup.get(code).push(i);}));
const countryChoices=document.querySelector('#country-choices'),atlasCanvas=document.querySelector('#map-canvas');
const tourRow=(tour,i,variantIndex=null)=>{const variant=variantIndex===null?null:tour.variants?.filter(v=>v.price_lkr)[variantIndex],name=variant?.name||tour.name,img=name==='Mexico'?'mexico-generated.jpg':name==='New Zealand'?'new-zealand-generated.jpg':tour.img;return `<button class="continent-tour" data-map-index="${i}" data-variant-index="${variantIndex??0}" aria-pressed="false"><img src="${base+img}" width="48" height="48" alt="" loading="lazy"><span><strong>${escapeText(name)}</strong><small>${escapeText(variant?variant.days+' days':tour.days)} · ${variant?money(variant.price_lkr):tour.variants?.filter(v=>v.price_lkr).length>1?'Package options':escapeText(tour.price)}</small></span><b aria-hidden="true">↗</b></button>`;};
function activateRow(button){button.addEventListener('pointerenter',()=>selectMap(Number(button.dataset.mapIndex),Number(button.dataset.variantIndex||0)));button.addEventListener('focus',()=>selectMap(Number(button.dataset.mapIndex),Number(button.dataset.variantIndex||0)));button.addEventListener('click',()=>{selectMap(Number(button.dataset.mapIndex),Number(button.dataset.variantIndex||0));button.closest('.continent-group')?.classList.remove('open');button.closest('.continent-group')?.querySelector('.continent-trigger').setAttribute('aria-expanded','false');const returnFocus=button.closest('.continent-group')?.querySelector('.continent-trigger')||destinationPins[Number(button.dataset.mapIndex)];countryChoices.hidden=true;returnFocus?.focus({preventScroll:true});});}
const continentNav=document.querySelector('#continent-nav');
atlasContinents.forEach(([continent,ids],index)=>{
 const group=document.createElement('div');group.className='continent-group';
 const extraOptions=continent==='N. America'?[[tours.findIndex(t=>t.id==='brazil-peru-mexico'),2]]:continent==='Oceania'?[[tours.findIndex(t=>t.id==='australia-new-zealand'),1],[tours.findIndex(t=>t.id==='australia-new-zealand'),2]]:[];
 group.innerHTML=`<button class="continent-trigger" aria-expanded="false" aria-controls="continent-${index}">${continent}<span aria-hidden="true">⌄</span></button><div class="continent-menu" id="continent-${index}"><p>${continent==='N. America'?'North America':continent==='S. America'?'South America':continent} <span>${ids.length} journeys</span></p>${ids.map(id=>{const i=tours.findIndex(t=>t.id===id);return tourRow(tours[i],i);}).join('')}</div>`;
 group.querySelector('.continent-menu').insertAdjacentHTML('beforeend',extraOptions.map(([i,v])=>tourRow(tours[i],i,v)).join(''));
 group.querySelector('.continent-menu>p span').textContent=(ids.length+extraOptions.length)+' journeys';
 const trigger=group.querySelector('.continent-trigger');
 const setOpen=open=>{continentNav.querySelectorAll('.continent-group').forEach(other=>{if(open&&other!==group){other.classList.remove('open');other.querySelector('.continent-trigger').setAttribute('aria-expanded','false');}});group.classList.toggle('open',open);trigger.setAttribute('aria-expanded',String(open));};
 group.addEventListener('pointerenter',()=>setOpen(true));group.addEventListener('pointerleave',()=>{if(!group.contains(document.activeElement))setOpen(false);});
 trigger.addEventListener('click',()=>setOpen(true));
 trigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(true);group.querySelector('.continent-tour').focus();}if(e.key==='Escape'){setOpen(false);trigger.focus();}});
 group.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);trigger.focus();}});
 group.addEventListener('focusout',e=>{if(!group.contains(e.relatedTarget))setOpen(false);});
 group.querySelectorAll('.continent-tour').forEach(activateRow);continentNav.append(group);
});
document.addEventListener('pointerdown',e=>{if(!continentNav.contains(e.target)){continentNav.querySelectorAll('.continent-group').forEach(g=>{g.classList.remove('open');g.querySelector('.continent-trigger').setAttribute('aria-expanded','false');});}if(!countryChoices.contains(e.target))countryChoices.hidden=true;});
window.worldCountries.forEach(country=>{
 const candidates=countryLookup.get(country.iso)||[];
 const path=atlasEl('path',{d:country.path,class:'atlas-country'+(candidates.length?' has-tours':''),'data-country':country.iso,'fill-rule':'evenodd'});
 const title=atlasEl('title',{});title.textContent=country.name+(candidates.length?' · Explore tours':'');path.append(title);
 if(candidates.length){
  path.setAttribute('role','button');path.setAttribute('tabindex','0');path.setAttribute('aria-label','Explore '+country.name+' tours');
  const reveal=event=>{
   const standaloneVariant=country.iso==='MEX'||country.iso==='NZL'?2:country.iso==='AUS'?1:null;
   if(!candidates.includes(mapIndex)||standaloneVariant!==null)selectMap(candidates[0],standaloneVariant);
   if(candidates.length<2){countryChoices.hidden=true;return;}
   const box=atlasCanvas.getBoundingClientRect(),rect=path.getBoundingClientRect();
   const x=event?.clientX||rect.left+rect.width/2,y=event?.clientY||rect.top+rect.height/2;
   countryChoices.innerHTML=`<p>${escapeText(country.name)} <span>Choose a journey</span></p>`+candidates.map(i=>tourRow(tours[i],i)).join('');
   countryChoices.style.left=Math.max(8,Math.min(x-box.left-30,box.width-280))+'px';
   countryChoices.style.top=Math.max(8,Math.min(y-box.top+8,box.height-210))+'px';
   countryChoices.hidden=false;countryChoices.querySelectorAll('button').forEach(activateRow);
  };
  path.addEventListener('pointerenter',reveal);path.addEventListener('click',reveal);path.addEventListener('focus',()=>reveal());
  path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();reveal();}if(e.key==='Escape')countryChoices.hidden=true;});
 }
 atlasLand.append(path);
});
const atlasOrigin=project(79.86,6.93);
const activeRoute=atlasEl('path',{class:'atlas-route',fill:'none'}),routeSpark=atlasEl('circle',{class:'atlas-spark',r:'3.4'});
routeSpark.setAttribute('cx',atlasOrigin.x);routeSpark.setAttribute('cy',atlasOrigin.y);atlasRoutes.append(activeRoute,routeSpark);
const destinationPins=tours.map((tour,i)=>{
 const point=project(tour.lon,tour.lat),pin=atlasEl('g',{class:'atlas-pin',transform:`translate(${point.x},${point.y})`,role:'button',tabindex:'0','aria-label':'Preview '+tour.name,'aria-pressed':'false','data-map-index':i});
 pin.append(atlasEl('circle',{r:10,class:'pin-hit'}),atlasEl('circle',{r:5.5,class:'atlas-pin-ring'}),atlasEl('circle',{r:2.6,class:'atlas-pin-core'}));
 const label=atlasEl('text',{x:tour.lon>130?-12:12,y:-10,'text-anchor':tour.lon>130?'end':'start',class:'atlas-pin-label'});label.textContent=tour.name;pin.append(label);atlasPins.append(pin);
 pin.addEventListener('pointerenter',()=>selectMap(i));pin.addEventListener('focus',()=>selectMap(i));pin.addEventListener('click',()=>selectMap(i));pin.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectMap(i);}});
 return pin;
});
const home=atlasEl('g',{transform:`translate(${atlasOrigin.x},${atlasOrigin.y})`,class:'atlas-home'});home.append(atlasEl('circle',{r:7,class:'atlas-home-halo'}),atlasEl('circle',{r:3.5,class:'atlas-home-core'}));const homeText=atlasEl('text',{x:0,y:20,'text-anchor':'middle'});homeText.textContent='COLOMBO';home.append(homeText);atlasPins.append(home);
let mapIndex=-1,selectedVariant=0;
const packageSelect=document.querySelector('#map-package');
function selectedPlace(tour,variant){return variant?.name==='New Zealand'?{lon:174.76,lat:-36.85,img:'new-zealand-generated.jpg',codes:['NZL']}:variant?.name==='Mexico'?{lon:-99.13,lat:19.43,img:'mexico-generated.jpg',codes:['MEX']}:variant?.name==='Australia'?{...tour,codes:['AUS']}:variant?.name==='Brazil & Peru'?{...tour,codes:['BRA','PER']}:tour.id==='spain-portugal'&&selectedVariant===0?{...tour,codes:['ESP','PRT']}:tour;}
function showMapOffer(){
 const tour=tours[mapIndex],variant=tour.variants?.filter(v=>v.price_lkr)[selectedVariant],place=selectedPlace(tour,variant),dates=variant?optionDate(tour.source,variant):[];
 document.querySelector('#map-name').textContent=['Mexico','Australia','New Zealand','Brazil & Peru'].includes(variant?.name)?variant.name:tour.name;
 const image=document.querySelector('#map-photo');image.src=base+place.img;image.alt=(variant?.name||tour.name)+' illustrative destination scenery';
 document.querySelector('#map-image-tag').textContent=place===tour?tour.name:variant?.name||tour.name;
 document.querySelector('#map-date').textContent=variant?(dates.length?dates.join(' / '):'Ask for dates'):'Ask for dates';
 document.querySelector('#map-price').textContent=variant?variant.price_lkr.toLocaleString('en-US')+(variant.price_qualifier?' '+variant.price_qualifier:''):tour.price.replace('LKR ','');
 document.querySelector('#map-region').textContent=tour.region+' · '+(variant?variant.days+' DAYS':tour.days.toUpperCase());
 document.querySelector('#map-description-text').textContent=tour.intro;
 const rawHighlights=tour.source?.highlights||['Bali · Indonesia'];
 const highlights=(variant?.name==='New Zealand'?['Auckland','Rotorua','Queenstown','Milford Sound']:variant?.name==='Australia'?['Melbourne','Sydney','Gold Coast']:variant?.name==='Mexico'?['Mexico City','Guadalajara','Guanajuato']:rawHighlights.map(item=>item.split(':')[0].split('(')[0].trim())).slice(0,4);
 document.querySelector('#map-highlights').innerHTML=highlights.map(item=>'<span>'+escapeText(item)+'</span>').join('');
 document.querySelector('#map-board').textContent=tour.source?.board||'';
 document.querySelector('.departure-block dt').textContent=tour.fromFlyer?(dates[0]==='Weekly sailings'?'Sailing schedule':'Departure · year unspecified'):'Departure date';
 document.querySelector('.price-block dt').textContent=tour.fromFlyer?'Advertised price · LKR':'Reference price · LKR';
 document.querySelector('.map-warning').textContent=tour.source?.notes?.some(n=>/mapping|applicability|subset/i.test(n))?'Confirm the departure and itinerary for your package.':'Confirm current dates, availability and price basis.';
 const codes=place.codes||atlasCountries[tour.id]||[];
 atlasLand.querySelectorAll('path').forEach(path=>path.classList.toggle('selected-country',codes.includes(path.dataset.country)));
 const end=project(place.lon,place.lat),arc=35+Math.abs(atlasOrigin.x-end.x)*.16;
 activeRoute.setAttribute('d',`M ${atlasOrigin.x} ${atlasOrigin.y} Q ${(atlasOrigin.x+end.x)/2} ${Math.min(atlasOrigin.y,end.y)-arc} ${end.x} ${end.y}`);
 const pin=destinationPins[mapIndex];pin.setAttribute('transform',`translate(${end.x},${end.y})`);pin.querySelector('text').textContent=place===tour?tour.name:variant?.name||tour.name;
 const palette=window.destinationPalettes?.[place.img.replace('-generated.jpg','')];if(palette){const panel=document.querySelector('.map-tour');panel.style.setProperty('--glow-primary',palette[0]);panel.style.setProperty('--glow-secondary',palette[1]);}
}
function selectMap(index,variantIndex=null){
 if(index<0||index>=tours.length)return;
 if(mapIndex!==index){mapIndex=index;selectedVariant=0;const tour=tours[index];
  document.querySelector('#map-name').textContent=tour.name;
  packageSelect.innerHTML=tour.variants?tour.variants.filter(v=>v.price_lkr).map((v,i)=>`<option value="${i}">${escapeText(v.name)} · ${v.days} days</option>`).join(''):'<option>Bali · 6 days</option>';
  packageSelect.closest('label').hidden=packageSelect.options.length<2;
  const supplement=tour.variants?.find(v=>v.supplement_lkr);document.querySelector('#map-addon').hidden=!supplement;document.querySelector('#map-addon').textContent=supplement?'Optional Egypt extension · +5 days · +LKR 395,000':'';
  showMapOffer();
 }
 if(variantIndex!==null&&selectedVariant!==variantIndex){selectedVariant=variantIndex;packageSelect.value=String(variantIndex);showMapOffer();}
 document.querySelectorAll('[data-map-index]').forEach(control=>{const active=Number(control.dataset.mapIndex)===index&&(!control.classList.contains('continent-tour')||Number(control.dataset.variantIndex)===selectedVariant);control.classList.toggle('active',active);control.setAttribute('aria-pressed',String(active));});
 grid.querySelectorAll('.tour-card').forEach(card=>card.classList.toggle('map-selected',card.querySelector('[data-tour]').dataset.tour===tours[index].name));
}
packageSelect.addEventListener('change',()=>{selectedVariant=Number(packageSelect.value);showMapOffer();selectMap(mapIndex,selectedVariant);});
grid.addEventListener('pointerover',event=>{const card=event.target.closest('.tour-card');if(card)selectMap(tours.findIndex(t=>t.name===card.querySelector('[data-tour]').dataset.tour),0);});
grid.addEventListener('focusin',event=>{const card=event.target.closest('.tour-card');if(card)selectMap(tours.findIndex(t=>t.name===card.querySelector('[data-tour]').dataset.tour),0);});
document.querySelector('#map-inquire').addEventListener('click',()=>{const tour=tours[mapIndex],variant=tour.variants?.filter(v=>v.price_lkr)[selectedVariant];choose(variant&&variant.name!==tour.name?tour.name+' — '+variant.name:tour.name);});
document.querySelector('#map-details').addEventListener('click',event=>openTour(tours[mapIndex],event.currentTarget));
selectMap(tours.findIndex(t=>t.id==='japan'));
// Zoom and pan preserve the selected geographic point and country outlines.
const svg=document.querySelector('#world-map');let zoom=1,panX=0,panY=0,drag=null;
function applyViewport(){document.querySelector('#atlas-geography').setAttribute('transform',`translate(${500*(1-zoom)+panX},${260*(1-zoom)+panY}) scale(${zoom})`);}
function changeZoom(factor){zoom=Math.min(3,Math.max(1,zoom*factor));if(zoom===1)panX=panY=0;applyViewport();countryChoices.hidden=true;}
document.querySelector('#map-zoom-in').addEventListener('click',()=>changeZoom(1.3));document.querySelector('#map-zoom-out').addEventListener('click',()=>changeZoom(1/1.3));document.querySelector('#map-reset').addEventListener('click',()=>{zoom=1;panX=panY=0;applyViewport();});
svg.addEventListener('pointerdown',event=>{if(zoom===1||event.target.closest('[role="button"]'))return;drag={x:event.clientX,y:event.clientY,panX,panY};svg.setPointerCapture(event.pointerId);});
svg.addEventListener('pointermove',event=>{if(!drag)return;const scale=1000/svg.getBoundingClientRect().width;panX=drag.panX+(event.clientX-drag.x)*scale;panY=drag.panY+(event.clientY-drag.y)*scale;applyViewport();});
svg.addEventListener('pointerup',()=>drag=null);svg.addEventListener('pointercancel',()=>drag=null);
let mapPaused=reducedMotion.matches,atlasFrame=0,atlasElapsed=0,atlasLast=0;
const motionButton=document.querySelector('#motion-toggle');
function mapMotionState(){motionButton.setAttribute('aria-pressed',String(mapPaused));motionButton.textContent=mapPaused?'▷ Play motion':'Ⅱ Pause motion';document.querySelector('.map-shell').classList.toggle('atlas-paused',mapPaused);}
function animateAtlas(time){if(!mapPaused&&!document.hidden){if(atlasLast)atlasElapsed+=Math.min(time-atlasLast,80);const length=activeRoute.getTotalLength(),point=activeRoute.getPointAtLength((atlasElapsed%5000)/5000*length);routeSpark.setAttribute('cx',point.x);routeSpark.setAttribute('cy',point.y);}atlasLast=time;atlasFrame=requestAnimationFrame(animateAtlas);}
motionButton.addEventListener('click',()=>{mapPaused=!mapPaused;mapMotionState();});reducedMotion.addEventListener('change',event=>{mapPaused=event.matches;mapMotionState();});mapMotionState();atlasFrame=requestAnimationFrame(animateAtlas);window.addEventListener('pagehide',()=>cancelAnimationFrame(atlasFrame));


countryChoices.addEventListener('keydown',event=>{if(event.key==='Escape'){countryChoices.hidden=true;destinationPins[mapIndex]?.focus({preventScroll:true});}});




