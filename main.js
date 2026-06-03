    // ── Hero Slideshow ──
    (function () {
      const slides = document.querySelectorAll('.hero-slide');
      if (!slides.length) return;
      let current = 0;
      setInterval(function () {
        slides[current].classList.remove('hero-slide--active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('hero-slide--active');
      }, 5000);
    })();

    // ── Next Event Carousel ──
    (function () {
      const slides  = document.querySelectorAll('.ne-slide');
      const dots    = document.querySelectorAll('.ne-dot');
      const btnPrev = document.getElementById('nePrev');
      const btnNext = document.getElementById('neNext');
      if (!slides.length) return;

      let current = 0;
      let timer   = null;

      function goTo(idx) {
        slides[current].classList.remove('ne-slide--active');
        dots[current].classList.remove('ne-dot--active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('ne-slide--active');
        dots[current].classList.add('ne-dot--active');
      }

      function startAuto() { timer = setInterval(() => goTo(current + 1), 4500); }
      function resetAuto()  { clearInterval(timer); startAuto(); }

      if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
      if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
      dots.forEach(dot => dot.addEventListener('click', () => { goTo(+dot.dataset.idx); resetAuto(); }));

      const wrap = document.getElementById('neCarousel');
      if (wrap) {
        let startX = 0;
        wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        wrap.addEventListener('touchend',   e => {
          const dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
        });
      }
      startAuto();
    })();

    // ── Video Modal ──
    (function () {
      const modal    = document.getElementById('neModal');
      const openBtn  = document.getElementById('neVideoBtn');
      const closeBtn = document.getElementById('neModalClose');
      const backdrop = document.getElementById('neModalBackdrop');
      const video    = document.getElementById('neVideo');
      if (!modal || !openBtn) return;

      function openModal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (video) video.play();
      }
      function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (video) { video.pause(); video.currentTime = 0; }
      }

      openBtn.addEventListener('click', openModal);
      if (closeBtn)  closeBtn.addEventListener('click', closeModal);
      if (backdrop)  backdrop.addEventListener('click', closeModal);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    })();

    // ── Supabase client ──
    const SUPABASE_URL = 'https://jozukjlqhbhhjklpkvza.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvenVramxxaGJoaGprbHBrdnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNDI5NTYsImV4cCI6MjA5MTYxODk1Nn0.ntnf9U9zWhM3sLqYcJ50nV4P5fUAfwofHIoIbY-6pSs';

    let supabaseClient = null;
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // ── NAV scroll effect ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ── Hamburger / mobile drawer ──
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobileDrawer');
    hamburger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      drawer.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.mob-link').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // ── Scroll reveal ──
    const observer = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 60);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ── Portfolio filters ──
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.portfolio-item').forEach(item => {
          const show = f === 'all' || item.dataset.cat === f;
          item.style.display = show ? '' : 'none';
        });
      });
    });

    // ── Contact form ──
    document.getElementById('contactSubmit').addEventListener('click', async () => {
      const name    = document.getElementById('c-name').value.trim();
      const email   = document.getElementById('c-email').value.trim();
      const phone   = document.getElementById('c-phone').value.trim();
      const service = document.getElementById('c-service').value;
      const message = document.getElementById('c-msg').value.trim();

      if (!name || !email) { alert('Please fill in your name and email.'); return; }
      if (!message) { alert('Please tell us about your vision.'); return; }

      const btn = document.getElementById('contactSubmit');
      document.getElementById('contactBtnText').style.display = 'none';
      document.getElementById('contactSpinner').style.display = 'inline';
      btn.disabled = true;

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, service, message })
        });
        if (res.ok) {
          btn.style.display = 'none';
          document.getElementById('contactSuccess').style.display = 'block';
          document.getElementById('c-name').value    = '';
          document.getElementById('c-email').value   = '';
          document.getElementById('c-phone').value   = '';
          document.getElementById('c-service').value = '';
          document.getElementById('c-msg').value     = '';
        } else { throw new Error('Server error'); }
      } catch (err) {
        document.getElementById('contactBtnText').style.display = 'inline';
        document.getElementById('contactSpinner').style.display = 'none';
        btn.disabled = false;
        document.getElementById('contactError').style.display = 'block';
      }
    });

    // ── Load reviews (3 most recent + real average from all) ──
    async function loadReviews() {
      const loading     = document.getElementById('reviewsLoading');
      const list        = document.getElementById('reviewsList');
      const scoreBanner = document.getElementById('scoreBanner');
      if (!supabaseClient) { if (loading) loading.textContent = 'Reviews coming soon.'; return; }

      try {
        const { data: allData } = await supabaseClient.from('reviews').select('rating');
        const { data, error }   = await supabaseClient
          .from('reviews').select('*')
          .order('created_at', { ascending: false }).limit(3);

        if (error) throw error;
        if (loading) loading.style.display = 'none';

        if (!data || data.length === 0) {
          if (list) list.innerHTML = '<p style="color:var(--warm-gray);font-size:.85rem;text-align:center;padding:24px 0">Be the first to leave a review!</p>';
          return;
        }

        const totalCount = allData ? allData.length : data.length;
        const avgSource  = allData && allData.length ? allData : data;
        const avg = avgSource.reduce((s, r) => s + r.rating, 0) / avgSource.length;

        if (document.getElementById('avgScore'))   document.getElementById('avgScore').textContent   = avg.toFixed(1);
        if (document.getElementById('avgStars'))   document.getElementById('avgStars').innerHTML     = renderStars(Math.round(avg));
        if (document.getElementById('scoreCount')) document.getElementById('scoreCount').textContent = `Based on ${totalCount} review${totalCount !== 1 ? 's' : ''}`;
        if (scoreBanner) scoreBanner.style.display = 'flex';

        if (list) list.innerHTML = data.map(r => `
          <div class="review-card">
            <div class="review-top">
              <div class="review-info">
                <div class="review-name">${escHtml(r.reviewer_name)}</div>
                <div class="review-event">Event: ${escHtml(r.event_name)}</div>
              </div>
              <div class="review-stars">${renderStarsHtml(r.rating)}</div>
            </div>
            ${r.comment ? `<div class="review-comment">"${escHtml(r.comment)}"</div>` : ''}
            <div class="review-date">${formatDate(r.created_at)}</div>
          </div>
        `).join('');

      } catch (err) {
        console.error(err);
        if (loading) loading.textContent = 'Could not load reviews.';
      }
    }

    function renderStars(n)     { return Array.from({length:5},(_,i)=>`<span class="score-star">${i<n?'★':'☆'}</span>`).join(''); }
    function renderStarsHtml(n) { return Array.from({length:5},(_,i)=>`<span class="review-star ${i<n?'filled':'empty'}">${i<n?'★':'☆'}</span>`).join(''); }
    function escHtml(str)       { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
    function formatDate(iso)    { return new Date(iso).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}); }

    loadReviews();
