// Mersha site interactions: fixed header, top-dropdown mobile nav, reveal, gallery filter + lightbox, contact validation.
(function(){
  var header=document.querySelector('.header');
  function onScroll(){ if(header) header.classList.toggle('scrolled', window.scrollY>8); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  var toggle=document.querySelector('.menu-toggle');
  var panel=document.querySelector('.mobile-panel');
  if(toggle&&panel){
    toggle.addEventListener('click', function(){
      var open=panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open?'true':'false');
      toggle.textContent=open?'✕':'☰';
    });
    panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ panel.classList.remove('open'); toggle.textContent='☰'; toggle.setAttribute('aria-expanded','false'); }); });
    // Auto-close mobile menu when resized to desktop (fixed header shows desktop nav there)
    window.addEventListener('resize', function(){
      if(window.innerWidth>1020 && panel.classList.contains('open')){
        panel.classList.remove('open'); toggle.textContent='☰'; toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
  },{threshold:.12}):null;
  document.querySelectorAll('.reveal').forEach(function(el){ if(io) io.observe(el); else el.classList.add('visible'); });

  // Gallery filter
  var fbtns=document.querySelectorAll('.filters button');
  var items=document.querySelectorAll('.g-item');
  fbtns.forEach(function(b){
    b.addEventListener('click', function(){
      fbtns.forEach(function(x){x.classList.remove('active');});
      b.classList.add('active');
      var f=b.getAttribute('data-filter');
      items.forEach(function(it){
        var show=(f==='all'||it.getAttribute('data-cat')===f);
        it.style.display=show?'':'none';
      });
    });
  });

  // Lightbox
  var lb=document.querySelector('.lightbox');
  var lbImg=lb?lb.querySelector('img'):null;
  var lbCap=lb?lb.querySelector('.cap'):null;
  items.forEach(function(it){
    it.addEventListener('click', function(){
      var img=it.querySelector('img');
      if(!lb||!img) return;
      lbImg.src=img.src; lbImg.alt=img.alt;
      if(lbCap) lbCap.textContent=img.alt||'';
      lb.classList.add('open'); document.body.style.overflow='hidden';
    });
  });
  function closeLb(){ if(lb){lb.classList.remove('open'); document.body.style.overflow='';} }
  if(lb){
    lb.addEventListener('click', function(e){ if(e.target===lb||e.target.classList.contains('close')) closeLb(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLb(); });
  }

  // Contact form: validates, then opens email app with prefilled enquiry (no backend needed)
  var form=document.getElementById('consult-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok=true;
      function check(id, fn){
        var wrap=document.getElementById('f-'+id);
        var input=document.getElementById(id);
        var valid=input&&fn(input.value.trim());
        if(wrap) wrap.classList.toggle('invalid', !valid);
        if(!valid) ok=false;
        return valid;
      }
      check('name', function(v){return v.length>=2;});
      check('phone', function(v){return /^[+\d][\d\s-]{5,18}$/.test(v);});
      check('email', function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);});
      check('message', function(v){return v.length>=10;});
      var status=document.getElementById('form-status');
      if(!ok){ if(status){status.textContent='Please correct the highlighted fields.'; status.style.color='#b42318';} return; }
      var gv=function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
      var subject='New enquiry (website): '+gv('service')+' — '+gv('name');
      var dFiles=((document.getElementById('drawing')||{}).files||[]).length;
      var body='Name: '+gv('name')+'\nCompany: '+gv('company')+'\nPhone: '+gv('phone')+'\nEmail: '+gv('email')+'\nService: '+gv('service')+'\nMaterial: '+gv('material')+'\nQuantity: '+gv('quantity')+'\nDelivery date: '+gv('delivery')+'\n\nRequirement:\n'+gv('message')+'\n\n(Drawing files selected: '+dFiles+' — please attach them in your email app)';
      window.location.href='mailto:meraj@mershauae.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      if(status){status.textContent='Opening your email app with the enquiry addressed to meraj@mershauae.com — attach your drawing file before sending. You can also WhatsApp us on +971562620651.'; status.style.color='#0b5cad';}
    });
  }
  document.getElementById('year') && (document.getElementById('year').textContent=new Date().getFullYear());
})();
