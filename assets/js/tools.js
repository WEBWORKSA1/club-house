/* Club.House — free organizer tools */
(function(){
  'use strict';
  var $=function(s){return document.querySelector(s)};
  var money=function(n,c){return (c||'$')+(Math.round(n*100)/100).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})};

  /* 1. Dues calculator */
  var dues=$('#duesForm');
  if(dues){var calc=function(){
    var g=function(id){return parseFloat($('#'+id).value)||0};
    var cur=$('#d_cur').value;
    var annual=g('d_venue')*12+g('d_events')+g('d_insurance')+g('d_software')*12+g('d_misc');
    var reserve=annual*(g('d_reserve')/100);
    var members=Math.max(1,g('d_members'));
    var paying=members*(1-g('d_dropout')/100);
    var per=(annual+reserve)/Math.max(1,paying);
    $('#d_out').innerHTML='<div class="out-big">'+money(per,cur)+' / member / year</div>'+
      '<p>≈ '+money(per/12,cur)+' per month · '+money(per/4,cur)+' per quarter</p>'+
      '<p class="muted">Annual budget '+money(annual,cur)+' + '+money(reserve,cur)+' reserve, spread across ~'+Math.round(paying)+' paying members.</p>';
  };dues.addEventListener('input',calc);calc();}

  /* 2. Meeting agenda generator */
  var ag=$('#agendaForm');
  if(ag){ag.addEventListener('submit',function(e){e.preventDefault();
    var name=$('#a_name').value||'Our Club',date=$('#a_date').value||'TBD',start=$('#a_time').value||'19:00',len=parseInt($('#a_len').value,10)||60;
    var items=$('#a_items').value.split('\n').filter(Boolean);
    var blocks=[['Welcome & introductions',0.08],['Approve last minutes',0.05],['Officer & treasurer reports',0.12]];
    var main=0.55/Math.max(1,items.length);
    items.forEach(function(it){blocks.push([it,main])});
    blocks.push(['New business & open floor',0.12],['Announcements & next meeting',0.05],['Adjourn',0.03]);
    var p=start.split(':'),t=parseInt(p[0],10)*60+parseInt(p[1],10);
    var out=name.toUpperCase()+' — MEETING AGENDA\nDate: '+date+'   Start: '+start+'   Length: '+len+' min\n\n';
    blocks.forEach(function(b,i){var m=Math.max(2,Math.round(b[1]*len));var hh=('0'+Math.floor(t/60)%24).slice(-2),mm=('0'+t%60).slice(-2);out+=(i+1)+'. ['+hh+':'+mm+'] '+b[0]+' ('+m+' min)\n';t+=m});
    $('#a_out').textContent=out;$('#a_copy').classList.remove('hidden');
  });
  $('#a_copy').addEventListener('click',function(){navigator.clipboard&&navigator.clipboard.writeText($('#a_out').textContent);this.textContent='Copied ✓'});}

  /* 3. Club name generator */
  var ng=$('#nameForm');
  if(ng){var pre=['The','Weekend','Midnight','Downtown','Northside','Golden','Open','Second','Little','Grand','Lantern','Copper','Velvet','Riverside','Hilltop','Wild','Quiet','Brave'];
    var suf=['Society','Collective','Circle','Guild','League','Club','Crew','Assembly','Union','Lodge','Social','Syndicate','Table','House','Fellowship','Network'];
    var gen=function(){var k=($('#n_key').value||'Readers').trim();var w=k.charAt(0).toUpperCase()+k.slice(1);var out=[];
      for(var i=0;i<9;i++){var a=pre[Math.floor(Math.random()*pre.length)],b=suf[Math.floor(Math.random()*suf.length)];
        var forms=[a+' '+w+' '+b,w+' '+b,a+' '+w,w+' & Co. '+b,'The '+w+' '+b+' of '+($('#n_city').value||'Our Town')];out.push(forms[i%forms.length].replace('The The','The'))}
      $('#n_out').innerHTML=out.map(function(n){return '<span class="tag" style="font-size:.95rem;padding:8px 14px">'+n.replace(/</g,'')+'</span>'}).join('')};
    ng.addEventListener('submit',function(e){e.preventDefault();gen()});}

  /* 4. Event budget & ticket price planner */
  var ev=$('#eventForm');
  if(ev){var ecalc=function(){var g=function(id){return parseFloat($('#'+id).value)||0};
    var cost=g('e_venue')+g('e_food')*g('e_att')+g('e_av')+g('e_prizes')+g('e_marketing');
    var sponsor=g('e_sponsor');var net=Math.max(0,cost-sponsor);var target=g('e_profit');
    var price=(net+target)/Math.max(1,g('e_att'));
    $('#e_out').innerHTML='<div class="out-big">'+money(price)+' per ticket</div><p>Total cost '+money(cost)+' − sponsorship '+money(sponsor)+' + profit goal '+money(target)+'.</p><p class="muted">Break-even ticket (no profit): '+money(net/Math.max(1,g('e_att')))+'</p>'};
    ev.addEventListener('input',ecalc);ecalc();}

  /* 5. Bylaws starter generator */
  var by=$('#bylawsForm');
  if(by){by.addEventListener('submit',function(e){e.preventDefault();
    var v=function(id){return $('#'+id).value||'____'};
    var t='BYLAWS OF '+v('b_name').toUpperCase()+'\n\nARTICLE I — NAME\nThis organization shall be known as '+v('b_name')+' (the "Club").\n\nARTICLE II — PURPOSE\nThe purpose of the Club is to '+v('b_purpose')+'.\n\nARTICLE III — MEMBERSHIP\nMembership is open to '+v('b_who')+'. Members in good standing have paid current dues of '+v('b_dues')+' and may vote at general meetings.\n\nARTICLE IV — OFFICERS\nThe officers are President, Vice-President, Secretary and Treasurer, elected for '+v('b_term')+' terms at the annual general meeting by a simple majority of members present.\n\nARTICLE V — MEETINGS\nGeneral meetings are held '+v('b_freq')+'. A quorum is '+v('b_quorum')+' of voting members.\n\nARTICLE VI — FINANCES\nThe Treasurer keeps accurate records, reports at each meeting, and two officers must approve any expense above '+v('b_limit')+'.\n\nARTICLE VII — CONDUCT\nAll members agree to the Club code of conduct. The officers may suspend a member for serious breaches after giving the member a chance to respond.\n\nARTICLE VIII — AMENDMENTS\nThese bylaws may be amended by a two-thirds vote at a general meeting, provided notice of the amendment was given at least 14 days in advance.\n\nARTICLE IX — DISSOLUTION\nIf the Club dissolves, remaining funds will be donated to '+v('b_dissolve')+'.\n\nAdopted on: ____________   Signed: ____________ (President)  ____________ (Secretary)\n\n[Template only — not legal advice. Check local requirements before adopting.]';
    $('#b_out').textContent=t;$('#b_copy').classList.remove('hidden');
  });$('#b_copy').addEventListener('click',function(){navigator.clipboard&&navigator.clipboard.writeText($('#b_out').textContent);this.textContent='Copied ✓'});}

  /* 6. Start-a-club checklist with progress */
  var cl=document.querySelectorAll('.checklist input');
  if(cl.length){var key='ch-checklist';var saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
    var upd=function(){var done=0;cl.forEach(function(c){if(c.checked)done++});var p=Math.round(done/cl.length*100);$('#cl_bar').style.width=p+'%';$('#cl_pct').textContent=p+'% complete ('+done+'/'+cl.length+')'};
    cl.forEach(function(c,i){c.checked=!!saved[i];c.addEventListener('change',function(){saved[i]=c.checked;try{localStorage.setItem(key,JSON.stringify(saved))}catch(e){}upd()})});upd();}

  /* 7. Club finder filter */
  var cf=$('#finderSearch');
  if(cf){var cards=document.querySelectorAll('[data-cat]');var pills=document.querySelectorAll('#finderPills button');var active='all';
    var run=function(){var q=cf.value.toLowerCase();var shown=0;cards.forEach(function(c){var ok=(active==='all'||c.getAttribute('data-cat').indexOf(active)>-1)&&c.textContent.toLowerCase().indexOf(q)>-1;c.classList.toggle('hidden',!ok);if(ok)shown++});$('#finderCount').textContent=shown+' result'+(shown===1?'':'s')};
    pills.forEach(function(p){p.addEventListener('click',function(){pills.forEach(function(x){x.classList.remove('on')});p.classList.add('on');active=p.getAttribute('data-f');run()})});
    cf.addEventListener('input',run);
    var qs=new URLSearchParams(location.search).get('q');if(qs){cf.value=qs}run();}

  /* 8. Club-match quiz */
  var qz=$('#quizForm');
  if(qz){qz.addEventListener('submit',function(e){e.preventDefault();
    var a=new FormData(qz);var score={active:0,mind:0,social:0,create:0,impact:0,career:0};
    a.forEach(function(v){v.split(',').forEach(function(k){if(score[k]!==undefined)score[k]++})});
    var map={active:['Running, cycling or hiking club','find-a-club.html?q=run'],mind:['Book, chess or debate club','find-a-club.html?q=book'],social:['Supper, board-game or social club','find-a-club.html?q=game'],create:['Photography, crafts or makers club','find-a-club.html?q=photo'],impact:['Volunteer or service club','find-a-club.html?q=volunteer'],career:['Speaking, founders or professional club','find-a-club.html?q=speak']};
    var best=Object.keys(score).sort(function(x,y){return score[y]-score[x]})[0];
    $('#quizOut').innerHTML='<div class="result"><span class="out-big">'+map[best][0]+'</span><p>That\'s your strongest match. <a href="'+map[best][1]+'">See where to find one →</a></p></div>';
  });}
})();
