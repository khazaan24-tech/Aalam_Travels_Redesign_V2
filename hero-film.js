// The poster paints first. Download the muted film only after the page is ready.
const heroFilm=document.querySelector('#hero-video'),heroFilmButton=document.querySelector('#hero-video-toggle');
let filmUserPaused=false,filmVisible=true,filmLoaded=false,filmReady=false;
const filmSaveData=Boolean(navigator.connection?.saveData);
function filmButtonState(){const stopped=heroFilm.paused;heroFilmButton.setAttribute('aria-pressed',String(stopped));heroFilmButton.setAttribute('aria-label',stopped?'Play background video':'Pause background video');heroFilmButton.innerHTML=stopped?'▷ <span>Play film</span>':'Ⅱ <span>Pause film</span>';}
async function playHeroFilm(manual=false){
 if(!manual&&(!filmReady||filmUserPaused||reducedMotion.matches||filmSaveData||!filmVisible||document.hidden))return;
 if(manual)heroFilm.classList.add('manual-play'); if(!filmLoaded){heroFilm.querySelector('source').src=heroFilm.querySelector('source').dataset.src;heroFilm.load();filmLoaded=true;}
 heroFilm.muted=true;
 try{await heroFilm.play();heroFilm.classList.add('is-playing');}catch{heroFilm.classList.remove('is-playing');}
 filmButtonState();
}
heroFilmButton.addEventListener('click',()=>{if(heroFilm.paused){filmUserPaused=false;playHeroFilm(true);}else{filmUserPaused=true;heroFilm.pause();filmButtonState();}});
heroFilm.addEventListener('play',filmButtonState);heroFilm.addEventListener('pause',filmButtonState);heroFilm.addEventListener('error',()=>{heroFilm.classList.remove('is-playing');filmButtonState();});
const filmObserver=new IntersectionObserver(entries=>{filmVisible=entries[0].isIntersecting;if(!filmVisible){heroFilm.pause();filmButtonState();}else playHeroFilm();},{threshold:.08});filmObserver.observe(document.querySelector('.hero'));
document.addEventListener('visibilitychange',()=>{if(document.hidden){heroFilm.pause();filmButtonState();}else playHeroFilm();});
reducedMotion.addEventListener('change',event=>{if(event.matches){heroFilm.pause();heroFilm.classList.remove('is-playing');filmButtonState();}else playHeroFilm();});
function scheduleFilm(){if('requestIdleCallback' in window)requestIdleCallback(()=>{filmReady=true;playHeroFilm();},{timeout:1800});else setTimeout(()=>{filmReady=true;playHeroFilm();},900);}
if(document.readyState==='complete')scheduleFilm();else window.addEventListener('load',scheduleFilm,{once:true});
filmButtonState();

