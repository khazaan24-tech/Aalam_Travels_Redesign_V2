// Flyer families stay together; package prices and add-ons retain their original meaning.
const destinationMetadata={
 'al-aqsa':[35.23,31.78,'MIDDLE EAST','culture','Golden domes, ancient streets and sacred landmarks.'],
 'morocco':[-5.26,35.17,'NORTH AFRICA','culture','Medinas, mountain towns and the colours of Morocco.'],
 'spain-portugal':[-9.14,38.72,'EUROPE','culture','Iberian cities, royal palaces and Mediterranean heritage.'],
 'european-jewel':[2.35,48.86,'EUROPE','culture','Landmark cities and alpine landscapes across Europe.'],
 'china':[116.40,39.90,'EAST ASIA','culture','Imperial landmarks, ancient wonders and modern cities.'],
 'vietnam':[107.04,20.91,'SOUTHEAST ASIA','nature','Emerald bays, lantern-lit streets and vibrant cities.'],
 'usa-east-west':[-74.00,40.71,'NORTH AMERICA','culture','America’s cities, national landmarks and coast-to-coast discoveries.'],
 'egypt-nile-cruise':[32.64,25.69,'NORTH AFRICA','culture','Ancient temples, pyramids and a journey along the Nile.'],
 'eastern-europe':[14.44,50.08,'EUROPE','culture','Historic squares, river cruises and Central European cities.'],
 'dream-cruise':[103.82,1.35,'SOUTHEAST ASIA','nature','Singapore and Phuket with a three-night cruise escape.'],
 'kyrgyzstan-tajikistan':[74.57,42.87,'CENTRAL ASIA','nature','Mountain lakes, dramatic gorges and Silk Road landscapes.'],
 'japan':[139.69,35.68,'EAST ASIA','culture','City discoveries, timeless temples and the scenery around Mount Fuji.'],
 'scandinavia':[5.32,60.39,'NORTHERN EUROPE','nature','Nordic capitals, fjords and five-country discoveries.'],
 'tunisia':[10.35,36.87,'NORTH AFRICA','culture','Mediterranean villages, Roman ruins and Sahara landscapes.'],
 'australia-new-zealand':[151.21,-33.87,'OCEANIA','nature','Harbour cities, alpine scenery and remarkable natural wonders.'],
 'brazil-peru-mexico':[-43.21,-22.95,'LATIN AMERICA','culture','Rio’s skyline, Inca heritage and Mexico’s historic cities.'],
 'georgia':[44.79,41.72,'CAUCASUS','culture','Old-town balconies, mountain roads and Georgian heritage.'],
 'azerbaijan':[49.87,40.41,'CAUCASUS','culture','Baku’s old city, modern skyline and the landscapes of Gabala.'],
 'balkans':[18.09,42.65,'SOUTHEAST EUROPE','culture','Adriatic coastlines and historic cities across the Balkans.'],
 'kazakhstan-uzbekistan':[66.98,39.65,'CENTRAL ASIA','culture','Silk Road architecture, turquoise tiles and mountain landscapes.'],
 'turkiye':[28.98,41.01,'EUROPE / ASIA','culture','Ottoman heritage, Istanbul’s landmarks and Cappadocia’s landscapes.'],
 'south-korea':[126.98,37.57,'EAST ASIA','culture','Palace courtyards, traditional villages and vibrant Korean cities.' ]
};
const money=value=>'LKR '+value.toLocaleString('en-US');
const escapeText=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const optionDate=(source,variant)=>Object.hasOwn(variant,'departures')?variant.departures:source.departures;
function offerMarkup(source,variant){
 const dates=optionDate(source,variant);
 return `<li><strong>${escapeText(variant.name)} · ${variant.days?variant.days+' days':'+'+variant.additional_days+' days'}</strong><span>${variant.supplement_lkr?'+ '+money(variant.supplement_lkr)+' supplement':money(variant.price_lkr)+(variant.price_qualifier?' '+variant.price_qualifier:'')}</span><small>${variant.supplement_lkr?'Optional extension; applies to the Al Aqsa package.':dates.length?escapeText(dates.join(' / '))+(dates[0]==='Weekly sailings'?' · confirm schedule':' · year unspecified'):'Departure not separately printed'}</small></li>`;
}
window.tourItems=window.flyerCatalogue.tours.map(source=>{
 const [lon,lat,region,type,intro]=destinationMetadata[source.id],first=source.variants[0];
 const full=source.variants.filter(v=>v.price_lkr),lengths=full.map(v=>v.days),dates=optionDate(source,first);
 return {id:source.id,name:source.name,lon,lat,region,type,intro,source,variants:source.variants,
  img:(source.id==='turkiye'?'turkey':source.id)+'-generated.jpg',
  days:(Math.min(...lengths)===Math.max(...lengths)?first.days:Math.min(...lengths)+'–'+Math.max(...lengths))+' days',
  route:source.highlights.join(' · '),date:dates.length?dates.join(' / '):'Not published',price:money(first.price_lkr),fromFlyer:true,
  cardPrice:(full.length>1?'From ':'')+money(Math.min(...full.map(v=>v.price_lkr)))+(first.price_qualifier?' '+first.price_qualifier:''),
  details:'<h3>Advertised package options</h3><ul class="package-list">'+source.variants.map(v=>offerMarkup(source,v)).join('')+'</ul><h3>Highlights from the supplied flyer</h3><ul>'+source.highlights.map(h=>'<li>'+escapeText(h)+'</li>').join('')+'</ul><p>'+escapeText(source.board||'Board basis is not stated in the flyer.')+'</p>'+(source.notes?'<h3>Details to confirm</h3><ul>'+source.notes.map(n=>'<li>'+escapeText(n)+'</li>').join('')+'</ul>':'')+'<p>Flyer contact: '+escapeText(source.contact||window.flyerCatalogue.main_contact)+'. Confirm departure year, availability, price basis and exact inclusions before booking.</p>'
 };
});
window.tourItems.push({id:'bali',name:'Bali',lon:115.22,lat:-8.65,region:'SOUTHEAST ASIA',type:'nature',img:'bali-generated.jpg',days:'6 days',date:'Not published',price:'LKR 465,000',cardPrice:'LKR 465,000',intro:'Make room for an island escape and a change of pace.',route:'Bali · Indonesia',fromFlyer:false,details:'<h3>Your island escape</h3><p>Bali is retained from the original website catalogue, separately from the supplied flyers. Six days · LKR 465,000 reference price. Departure, current quote and itinerary require confirmation.</p>'});
window.tourItems.forEach(tour=>{tour.palette=window.destinationPalettes?.[tour.img.replace('-generated.jpg','')];});
