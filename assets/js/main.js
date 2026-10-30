/* Club.House — core interactions */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

  /* --- Private inbox route (never rendered as text) --- */
  function addr(){var a=['d2Vid29y','a3NhMUBn','bWFpbC5j','b20='];return atob(a.join(''));}
  $$('[data-mail]').forEach(function(el){
    el.setAttribute('href','#contact');
    el.addEventListener('click',function(e){
      e.preventDefault();
      var subj=el.getAttribute('data-subject')||'Club.House inquiry';
      window.location.href='mai'+'lto:'+addr()+'?subject='+encodeURIComponent(subj);
    });
  });

  /* --- Theme --- */
  var root=document.documentElement;
  var saved=store.get('ch-theme');
  if(saved){root.setAttribute('data-theme',saved)}
  var tbtn=$('#themeToggle');
  function setIcon(){if(tbtn)tbtn.textContent=root.getAttribute('data-theme')==='dark'?'☀':'☾'}
  setIcon();
  if(tbtn)tbtn.addEventListener('click',function(){var n=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',n);store.set('ch-theme',n);setIcon()});

  /* --- Mobile menu --- */
  var burger=$('#burger'),menu=$('#menu');
  if(burger&&menu)burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});

  /* --- Active link --- */
  var here=location.pathname.split('/').pop()||'index.html';
  $$('#menu a').forEach(function(a){if(a.getAttribute('href')===here)a.setAttribute('aria-current','page')});

  /* --- Reveal on scroll --- */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    $$('.reveal').forEach(function(el){io.observe(el)});
  }else{$$('.reveal').forEach(function(el){el.classList.add('in')})}

  /* --- Counters --- */
  $$('[data-count]').forEach(function(el){
    var end=parseInt(el.getAttribute('data-count'),10),suf=el.getAttribute('data-suffix')||'',t=0;
    var step=function(){t+=Math.ceil(end/40);if(t>=end){el.textContent=end.toLocaleString()+suf}else{el.textContent=t.toLocaleString()+suf;requestAnimationFrame(step)}};
    if('IntersectionObserver' in window){var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){step();o.disconnect()}});o.observe(el)}else step();
  });

  /* --- Back to top --- */
  var tt=$('#toTop');
  if(tt){window.addEventListener('scroll',function(){tt.classList.toggle('show',window.scrollY>700)},{passive:true});tt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})})}

  /* --- Cookie notice --- */
  var ck=$('#cookie');
  if(ck&&!store.get('ch-consent')){setTimeout(function(){ck.classList.add('show')},900)}
  $$('[data-consent]').forEach(function(b){b.addEventListener('click',function(){store.set('ch-consent',b.getAttribute('data-consent'));ck.classList.remove('show');if(b.getAttribute('data-consent')==='essential'){(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}})});

  /* --- YouTube lite facade --- */
  $$('.video[data-yt]').forEach(function(v){
    var id=v.getAttribute('data-yt');
    v.innerHTML='<img loading="lazy" alt="'+(v.getAttribute('data-title')||'Video')+'" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><div class="play"><span>▶</span></div>';
    v.addEventListener('click',function(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+(v.getAttribute('data-title')||'Video')+'" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>'},{once:true});
  });

  /* --- Multi-step forms --- */
  $$('form[data-steps]').forEach(function(f){
    var steps=$$('.fstep',f),bars=$$('.steps span',f),i=0;
    function show(n){steps.forEach(function(s,k){s.classList.toggle('on',k===n)});bars.forEach(function(b,k){b.classList.toggle('on',k<=n)});i=n}
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){
      var req=$$('[required]',steps[i]),ok=true;
      req.forEach(function(r){if(!r.checkValidity()){ok=false;r.reportValidity()}});
      if(ok)show(Math.min(i+1,steps.length-1));
    })});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){show(Math.max(i-1,0))})});
    show(0);
  });

  /* --- Amount picker (support page) --- */
  $$('.amounts').forEach(function(g){
    var target=document.getElementById(g.getAttribute('data-target'));
    $$('button',g).forEach(function(b){b.addEventListener('click',function(){$$('button',g).forEach(function(x){x.classList.remove('on')});b.classList.add('on');if(target)target.value=b.getAttribute('data-v')})});
  });
  $$('.toggle').forEach(function(g){
    var target=document.getElementById(g.getAttribute('data-target'));
    $$('button',g).forEach(function(b){b.addEventListener('click',function(){$$('button',g).forEach(function(x){x.classList.remove('on')});b.classList.add('on');if(target)target.value=b.getAttribute('data-v')})});
  });

  /* --- Form submission (hidden inbox via FormSubmit AJAX) --- */
  $$('form[data-form]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=$('.form-msg',f)||f.appendChild(Object.assign(document.createElement('div'),{className:'form-msg'}));
      if(f.querySelector('.hp input')&&f.querySelector('.hp input').value){return}
      var data=new FormData(f),obj={};
      data.forEach(function(v,k){if(k==='_honey')return;obj[k]=obj[k]?obj[k]+', '+v:v});
      obj._subject='[Club.House] '+(f.getAttribute('data-form')||'Form')+' — '+(obj.name||obj.club_name||'New submission');
      obj._template='table';obj._captcha='false';obj.page=location.href;
      var btn=f.querySelector('[type=submit]');if(btn){btn.disabled=true;btn.dataset.t=btn.textContent;btn.textContent='Sending…'}
      fetch('https://formsubmit.co/ajax/'+addr(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(obj)})
      .then(function(r){return r.json()}).then(function(){
        msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Thank you! Your submission was received. We reply within 1–2 business days.';f.reset();
        if(window.gtag)gtag('event','generate_lead',{form:f.getAttribute('data-form')});
      }).catch(function(){
        msg.className='form-msg err';msg.innerHTML='Network hiccup. <a href="#" id="fbm">Send via your email app instead</a>.';
        var l=document.getElementById('fbm');if(l)l.addEventListener('click',function(ev){ev.preventDefault();var body=Object.keys(obj).map(function(k){return k+': '+obj[k]}).join('\n');location.href='mai'+'lto:'+addr()+'?subject='+encodeURIComponent(obj._subject)+'&body='+encodeURIComponent(body)});
      }).finally(function(){if(btn){btn.disabled=false;btn.textContent=btn.dataset.t}});
    });
  });

  /* --- Countdown --- */
  $$('[data-countdown]').forEach(function(el){
    var end=new Date(el.getAttribute('data-countdown')).getTime();
    function tick(){var d=Math.max(0,end-Date.now()),s=Math.floor(d/1000);
      el.innerHTML=['Days','Hours','Mins','Secs'].map(function(l,k){var v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60][k];return '<div><b>'+v+'</b><small>'+l+'</small></div>'}).join('')}
    tick();setInterval(tick,1000);
  });

  /* --- Year --- */
  $$('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
})();
