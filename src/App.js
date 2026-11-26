const {useState,useEffect,useRef}=window.React;
const h=window.React.createElement;
const weddingDate=new Date('2027-01-04T11:30:00+05:30');
const maps='https://maps.google.com/?q=11.700448,75.693810';
function Lace({bottom=false,className=''}){return h('img',{src:'assets/lace-trim.webp',alt:'','aria-hidden':true,className:'lace-trim '+(bottom?'bottom ':'')+className})}
function Bow({className=''}){return h('svg',{viewBox:'0 0 300 90',fill:'none',className:'bow '+className,'aria-hidden':true},h('g',{stroke:'currentColor',strokeWidth:'.8'},h('path',{d:'M148 34C117-12 64 1 100 28C118 40 141 36 149 35C127 6 83 7 102 23C118 35 140 36 149 35ZM152 34C183-12 236 1 200 28C182 40 159 36 151 35C173 6 217 7 198 23C182 35 160 36 151 35ZM147 37C130 61 115 58 94 59C70 59 76 89 52 77C28 63 40 44 22 42M145 38C129 69 107 61 93 64C78 68 79 96 54 80M154 37C170 61 185 58 206 59C230 59 224 89 248 77C272 63 260 44 278 42M156 38C171 69 193 61 207 64C222 68 221 96 246 80'}),h('ellipse',{cx:150,cy:35,rx:6,ry:5}))) }
function Rings(){return h('svg',{viewBox:'0 0 100 70',className:'rings',fill:'none','aria-hidden':true},h('g',{stroke:'currentColor',strokeWidth:'1.1'},h('ellipse',{cx:36,cy:40,rx:26,ry:16,transform:'rotate(-20 36 40)'}),h('ellipse',{cx:36,cy:38,rx:26,ry:16,transform:'rotate(-20 36 38)'}),h('ellipse',{cx:65,cy:39,rx:17,ry:25,transform:'rotate(-30 65 39)'}),h('path',{d:'m59 12 4-7 9-1 5 7-8 9zM63 5l6 15 3-16M59 12h18'}))) }
function Reveal({children,className='',as='div'}){
 const ref=useRef(null);
 useEffect(()=>{
  const node=ref.current;
  if(!node||!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  node.classList.add('reveal-ready');
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}});
  },{threshold:.08,rootMargin:'0px 0px -36px 0px'});
  observer.observe(node);return()=>observer.disconnect();
 },[]);
 const motion=className.includes('family-bride')?'from-left':className.includes('family-groom')?'from-right':className.includes('venue-frame')?'venue':className.includes('countdown-content')?'countdown':className.includes('occasion-inner')?'ceremony':'rise';
 return h(as,{ref,className:'reveal '+className,'data-motion':motion},children);
}
function useScrollDepth(enabled){
 useEffect(()=>{
  if(!enabled||!('IntersectionObserver' in window))return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches)return;
  const sections=[...document.querySelectorAll('.hero,.countdown-section,.occasion,.regards,footer')];
  const active=new Set();let frame=0,stopped=false;
  const update=()=>{
   frame=0;if(stopped)return;
   const height=window.innerHeight;
   const positions=[...active].map(node=>{const rect=node.getBoundingClientRect();return[node,Math.max(-1,Math.min(1,(rect.top+rect.height/2-height/2)/height))]});
   positions.forEach(([node,position])=>node.style.setProperty('--scene-shift',(position*18).toFixed(2)+'px'));
  };
  const schedule=()=>{if(!frame&&!stopped)frame=requestAnimationFrame(update)};
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)active.add(entry.target);else active.delete(entry.target)});schedule()});
  sections.forEach(node=>observer.observe(node));
  const stopMotion=()=>{stopped=preference.matches;sections.forEach(node=>node.style.removeProperty('--scene-shift'));if(!stopped)schedule()};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  preference.addEventListener('change',stopMotion);
  return()=>{stopped=true;observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);preference.removeEventListener('change',stopMotion);sections.forEach(node=>node.style.removeProperty('--scene-shift'))};
 },[enabled]);
}
function Countdown(){const [now,setNow]=useState(Date.now());useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);const seconds=Math.max(0,Math.floor((+weddingDate-now)/1000));const parts=[['days',Math.floor(seconds/86400)],['hours',Math.floor(seconds%86400/3600)],['minutes',Math.floor(seconds%3600/60)],['seconds',seconds%60]];return h('div',{className:'clock','aria-label':'Countdown to 4 January 2027 at 11:30 AM Indian Standard Time'},parts.map(([label,value])=>h('div',{key:label},h('strong',{key:value,className:'count-digit'},String(value).padStart(2,'0')),h('span',null,label))))}
function VideoIntro({onFinish,onStart}){
 const video=useRef(null),timer=useRef(null);const [playing,setPlaying]=useState(false),[leaving,setLeaving]=useState(false),[error,setError]=useState('');
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const finish=()=>{if(leaving)return;setLeaving(true);timer.current=setTimeout(onFinish,650)};
 const play=async()=>{if(!video.current)return;setError('');onStart();try{await video.current.play();setPlaying(true)}catch{setError('Tap again to play the invitation.')}};
 return h('div',{className:'video-intro '+(leaving?'leaving':''),'aria-label':'Wedding invitation opening'},
 h('video',{ref:video,src:'https://res.cloudinary.com/tumpcp7i/video/upload/v1794516112/nadiya-zyan/opening-20261113.mp4',poster:'https://res.cloudinary.com/tumpcp7i/video/upload/so_0/v1794516112/nadiya-zyan/opening-20261113.jpg',preload:'auto',playsInline:true,muted:true,onEnded:finish,onError:()=>setError('The opening could not load. Please reload and try again.'),'aria-label':'Animated lace wedding envelope'}),
 !playing&&h('button',{className:'video-start',onClick:play,'aria-label':'Open wedding invitation'},h('span',{className:'tap-seal','aria-hidden':true}),h('span',{className:'video-caption'},'Touch the seal to open',h('small',null,'ZYAN & NADIYA · 4 JANUARY 2027'))),
 error&&h('p',{className:'video-error',role:'status'},error));
}
function App(){const [opened,setOpened]=useState(false);useScrollDepth(opened);const mainRef=useRef(null),music=useRef(null);
 const [musicPlaying,setMusicPlaying]=useState(false),[musicStarted,setMusicStarted]=useState(false),[shareStatus,setShareStatus]=useState('');
 const startMusic=()=>{setMusicStarted(true);music.current?.play().catch(()=>setMusicPlaying(false))};
 const toggleMusic=()=>{if(!music.current)return;if(music.current.paused)startMusic();else music.current.pause()};
 const share=async()=>{const url=window.location.origin+window.location.pathname;const text='Assalamu Alaikum 🤍\n\nWith the blessings of our families, we joyfully invite you to celebrate our wedding.\n\nMohammed Zyan & Dr Nadiya Banu\n4 January 2027 · Nikah at 11:30 AM IST\nSafa Palace (HO), Narippatta, Kozhikode\n\nYour presence and duas would mean so much to us. Open our invitation for all the details.';try{if(navigator.share){await navigator.share({title:'Zyan & Nadiya — Wedding Invitation',text,url})}else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text+'\n\n'+url);setShareStatus('Invitation message and link copied.')}else{window.location.href='https://wa.me/?text='+encodeURIComponent(text+'\n\n'+url)}}catch(error){if(error.name!=='AbortError')setShareStatus('Please copy the website link to share your invitation.')}};

 useEffect(()=>{document.body.style.overflow=opened?'':'hidden';if(mainRef.current)mainRef.current.inert=!opened;return()=>document.body.style.overflow=''},[opened]);
 const finish=()=>{window.scrollTo({top:0,behavior:'instant'});setOpened(true);setTimeout(()=>mainRef.current?.querySelector('a')?.focus({preventScroll:true}),50)};
 const replay=()=>{window.scrollTo({top:0,behavior:'instant'});setOpened(false)};
 return h('div',{className:'wedding-site'},h('audio',{ref:music,src:'https://res.cloudinary.com/tumpcp7i/video/upload/v1794516106/nadiya-zyan/invitation-music-20261113.mp3',loop:true,preload:'auto',onPlay:()=>setMusicPlaying(true),onPause:()=>setMusicPlaying(false)}),
 musicStarted&&h('button',{className:'music-toggle',onClick:toggleMusic,'aria-label':musicPlaying?'Turn music off':'Turn music on','aria-pressed':musicPlaying,title:musicPlaying?'Turn music off':'Turn music on'},musicPlaying?'♫':'♪',h('span',{className:'music-state'},musicPlaying?'ON':'OFF')),
 !opened&&h(VideoIntro,{onFinish:finish,onStart:startMusic}),
h('main',{ref:mainRef,id:'invitation',className:opened?'unsealed':''},
h('section',{className:'hero'},h('div',{className:'hero-lace'},h('div',{className:'lace-glints','aria-hidden':true},[0,1,2,3,4].map(i=>h('i',{key:i,style:{'--glint':i}})))),h('div',{className:'hero-inner'},h('p',{className:'arabic',lang:'ar',dir:'rtl'},'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'),h('p',{className:'micro translation'},'In the name of Allah, the Most Beneficent, the Most Merciful'),h('p',{className:'hero-kicker'},'Mohammed Thareeq &',h('br'),'Fathima Roshnara'),h('p',{className:'invitation-line'},'With great joy and gratitude to Allah Almighty, we request the honor of your presence at the wedding of our beloved son'),h('h1',{className:'couple-names'},h('span',null,'Mohammed Zyan'),h('i',null,'&'),h('span',null,h('small',null,'Dr '),'Nadiya Banu')),Bow({}),h('p',{className:'hero-date'},'Monday, 4 January 2027'),h('p',{className:'hero-location'},'Narippatta, Kozhikode'),h('a',{href:'#celebration',className:'discover'},'SCROLL TO DISCOVER'))),
h('section',{id:'celebration',className:'welcome'},h(Reveal,null,h('p',{className:'small-caps'},'A new chapter, together'),h('h2',null,'With hearts full of love'),h('p',null,'We request the pleasure of your company as we celebrate our Nikah and begin this new chapter surrounded by our loved ones.'))),
h('section',{className:'burgundy countdown-section'},h(Lace,{}),h(Reveal,{className:'countdown-content'},h(Bow,{}),h('h2',null,'Counting the moments'),h(Countdown,{}),h('p',{className:'countdown-footnote'},'Until our forever begins'),h(Bow,{className:'flipped'})),h(Lace,{bottom:true})),
h('section',{className:'family-section'},h(Reveal,null,h('p',{className:'small-caps'},'Two hearts. Two families.'),h('h2',null,'With their blessings')),h(Reveal,{className:'family-frame family-groom'},h('div',{className:'frame-monogram'},'Z'),h('p',{className:'small-caps'},'THE GROOM'),h('h3',null,'Mohammed Zyan'),h('p',{className:'relation'},'Son of'),h('p',null,'Mohammed Thareeq &',h('br'),'Fathima Roshnara'),h('p',{className:'relation'},'Grandson of'),h('p',null,'Late Eng O.V Mohammed &',h('br'),'Late T.C Abdul Majeed'),h('p',{className:'home-address'},'Rahma (HO), Thana, Kannur')),h('div',{className:'between-families'},h(Bow,{})),h(Reveal,{className:'family-frame family-bride'},h('div',{className:'frame-monogram'},'N'),h('p',{className:'small-caps'},'THE BRIDE'),h('h3',null,h('small',null,'Dr. '),'Nadiya Banu'),h('p',{className:'relation'},'Daughter of'),h('p',null,'Nazeer Ahmad & Naseera Komath'),h('p',{className:'relation'},'Granddaughter of'),h('p',null,'Late Ammad Haji &',h('br'),'Late Ayishu Chevittuparemmal'),h('p',null,'Mohamed Haji Komath &',h('br'),'Ayshu Komath'))),
h('section',{className:'burgundy occasion'},h(Lace,{}),h(Reveal,{className:'occasion-inner'},h(Rings,{}),h('p',{className:'small-caps'},'Save the date'),h('h2',null,'The Nikah'),h('div',{className:'date-block'},h('span',null,'MONDAY'),h('strong',null,'04'),h('span',null,'JANUARY 2027')),h('p',{className:'time'},'11:30 in the morning'),h('p',{className:'micro'},'INDIAN STANDARD TIME'),h('a',{className:'pill light',href:'wedding.ics',download:true},'ADD TO CALENDAR')),h(Lace,{bottom:true})),
h('section',{className:'venue-section'},h(Reveal,null,h('p',{className:'small-caps'},'Where we come together'),h('h2',null,'The celebration')),h(Reveal,{className:'venue-frame'},h('div',{className:'frame-monogram'},h('svg',{width:24,height:30,viewBox:'0 0 24 30',fill:'none','aria-hidden':true},h('path',{d:'M12 28S2 16 2 11a10 10 0 0 1 20 0c0 5-10 17-10 17Z',stroke:'currentColor'}),h('circle',{cx:12,cy:11,r:3,stroke:'currentColor'}))),h('h3',null,'Safa Palace'),h('p',{className:'house'},'(HO)'),h('p',null,'Chevittuparammal, Narippatta',h('br'),'Kozhikode, Kerala'),h('p',{className:'venue-note'},'We look forward to welcoming you.'),h('a',{href:maps,target:'_blank',rel:'noopener noreferrer',className:'pill'},'FIND THE VENUE'))),
h('section',{className:'regards'},h(Lace,{}),h(Reveal,null,h('p',{className:'small-caps'},'With regards'),h('h3',{className:'regards-couple'},'Mohammed Zyan',h('br'),'Dr Nadiya Banu'),h('p',{className:'small-caps'},'With Love'),h('h3',null,'Mohammed Thareeq',h('br'),'Fathima Roshnara',h('br'),'Mohammed Izan',h('br'),'Mohammed Ishan'),h('p',{className:'family-signoff'},'Kadalakaran Family',h('br'),'& Pallickalagath Family'))),
h('footer',null,h(Lace,{}),h(Reveal,null,h(Rings,{}),h('h2',null,'We can’t wait to',h('br'),'celebrate with you.'),h('p',{className:'with-love'},'With love,'),h('p',{className:'footer-names'},'Zyan ',h('i',null,'&'),' Nadiya'),h('p',{className:'footer-date'},'4 January 2027'),h('button',{className:'pill share-invitation',onClick:share},'SHARE INVITATION'),h('p',{className:'share-status',role:'status'},shareStatus),h('button',{className:'replay',onClick:replay},'View the envelope again ↺')))))}
window.ReactDOM.createRoot(document.getElementById('root')).render(h(App));

