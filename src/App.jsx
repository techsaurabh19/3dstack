import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --orange: #FF5E1A;
      --orange-lt: #FF7A3D;
      --blue-sky: #4DB8FF;
      --blue-mid: #2D7FFF;
      --blue-deep: #1A3A6B;
      --navy: #0D1B35;
      --navy-soft: #122040;
      --white: #FFFFFF;
      --grey-100: #F4F6FA;
      --grey-300: #C8D0E0;
      --grey-500: #8896B3;
      --text: #0D1B35;
      --card-bg: rgba(255,255,255,0.06);
      --card-border: rgba(77,184,255,0.18);
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--navy);
      color: var(--white);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    h1,h2,h3,h4,h5 { font-family: 'Syne', sans-serif; }

    /* ── scrollbar ── */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--navy); }
    ::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 4px; }

    /* ── nav ── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 999;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 5vw; height: 70px;
      transition: background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;
    }
    nav.scrolled {
      background: rgba(13,27,53,0.92);
      backdrop-filter: blur(18px);
      box-shadow: 0 2px 30px rgba(0,0,0,0.4);
    }
    .nav-logo {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none; color: var(--white);
    }
    .nav-logo img { width: 36px; height: 36px; object-fit: contain; }
    .nav-logo span {
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem;
      background: linear-gradient(135deg, var(--orange), var(--blue-sky));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }
    .nav-links { display: flex; gap: 32px; list-style: none; }
    .nav-links a {
      color: var(--grey-300); text-decoration: none; font-size: 0.88rem;
      font-weight: 500; letter-spacing: 0.02em; transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--white); }
    .nav-links a.active { color: var(--orange); }
    .nav-cta {
      background: var(--orange); color: #fff; border: none; cursor: pointer;
      padding: 10px 22px; border-radius: 8px; font-family: 'Syne', sans-serif;
      font-weight: 700; font-size: 0.85rem; letter-spacing: 0.03em;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,94,26,0.45); }
    .hamburger {
      display: none; flex-direction: column; gap: 5px; cursor: pointer;
      background: none; border: none; padding: 4px;
    }
    .hamburger span { display: block; width: 24px; height: 2px; background: var(--white); border-radius: 2px; transition: all 0.3s; }
    .mobile-menu {
      display: none; position: fixed; top: 70px; left: 0; right: 0;
      background: rgba(13,27,53,0.97); backdrop-filter: blur(20px);
      padding: 24px 5vw 32px; flex-direction: column; gap: 20px;
      border-top: 1px solid var(--card-border); z-index: 998;
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu a {
      color: var(--grey-300); text-decoration: none; font-size: 1.1rem;
      font-weight: 500; padding: 8px 0; border-bottom: 1px solid var(--card-border);
    }

    /* ── section base ── */
    section { padding: 100px 5vw; }
    .section-label {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,94,26,0.12); border: 1px solid rgba(255,94,26,0.3);
      color: var(--orange); padding: 6px 14px; border-radius: 999px;
      font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; margin-bottom: 20px;
    }
    .section-label::before { content: ''; width: 6px; height: 6px; background: var(--orange); border-radius: 50%; }
    .section-title {
      font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.15;
      letter-spacing: -0.03em; margin-bottom: 16px;
    }
    .section-sub {
      font-size: 1.05rem; color: var(--grey-500); line-height: 1.7; max-width: 560px;
    }

    /* ── hero ── */
    .hero {
      min-height: 100vh; display: flex; align-items: center;
      position: relative; overflow: hidden; padding-top: 120px;
    }
    .hero-bg {
      position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse 70% 60% at 70% 40%, rgba(45,127,255,0.18) 0%, transparent 70%),
                  radial-gradient(ellipse 40% 40% at 20% 80%, rgba(255,94,26,0.12) 0%, transparent 60%);
    }
    .hero-grid {
      position: absolute; inset: 0; pointer-events: none;
      background-image: linear-gradient(rgba(77,184,255,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(77,184,255,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1200px; width: 100%; margin: 0 auto; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,94,26,0.1); border: 1px solid rgba(255,94,26,0.3);
      padding: 8px 16px; border-radius: 999px; margin-bottom: 28px;
      font-size: 0.78rem; font-weight: 700; color: var(--orange-lt);
      letter-spacing: 0.08em; text-transform: uppercase;
    }
    .hero-badge-dot { width: 7px; height: 7px; background: var(--orange); border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
    .hero h1 {
      font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800; line-height: 1.1;
      letter-spacing: -0.04em; margin-bottom: 24px;
    }
    .hero h1 .accent {
      background: linear-gradient(135deg, var(--orange), var(--blue-sky));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-sub { font-size: 1.1rem; color: var(--grey-300); line-height: 1.75; margin-bottom: 40px; max-width: 520px; }
    .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
    .btn-primary {
      background: linear-gradient(135deg, var(--orange), #FF3A00);
      color: #fff; padding: 14px 30px; border-radius: 10px; border: none;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem;
      cursor: pointer; transition: all 0.25s; letter-spacing: 0.02em;
      box-shadow: 0 4px 20px rgba(255,94,26,0.4);
    }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255,94,26,0.55); }
    .btn-outline {
      background: transparent; color: var(--white);
      border: 1.5px solid rgba(255,255,255,0.25);
      padding: 14px 30px; border-radius: 10px;
      font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.95rem;
      cursor: pointer; transition: all 0.25s;
    }
    .btn-outline:hover { border-color: var(--blue-sky); color: var(--blue-sky); transform: translateY(-3px); }
    .hero-stats { display: flex; gap: 40px; margin-top: 52px; padding-top: 40px; border-top: 1px solid var(--card-border); }
    .stat-val { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: var(--white); }
    .stat-label { font-size: 0.8rem; color: var(--grey-500); margin-top: 2px; }
    .hero-visual { display: flex; justify-content: center; align-items: center; position: relative; }
    .hero-logo-wrap {
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(45,127,255,0.12), transparent 70%);
      display: flex; align-items: center; justify-content: center;
      animation: float 5s ease-in-out infinite;
    }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
    .hero-logo-wrap img { width: 200px; filter: drop-shadow(0 20px 60px rgba(45,127,255,0.4)); }
    .orb {
      position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none;
    }
    .orb-1 { width: 160px; height: 160px; background: rgba(255,94,26,0.25); top: 10%; right: 5%; }
    .orb-2 { width: 120px; height: 120px; background: rgba(77,184,255,0.2); bottom: 10%; left: 5%; }

    /* ── cards ── */
    .card {
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 16px; padding: 28px; transition: all 0.3s;
      backdrop-filter: blur(10px);
    }
    .card:hover { transform: translateY(-6px); border-color: rgba(255,94,26,0.35); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
    .card-icon {
      width: 48px; height: 48px; border-radius: 12px;
      background: linear-gradient(135deg, rgba(255,94,26,0.2), rgba(45,127,255,0.2));
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; margin-bottom: 18px;
      border: 1px solid rgba(255,94,26,0.2);
    }
    .card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; }
    .card p { font-size: 0.9rem; color: var(--grey-500); line-height: 1.65; }

    /* ── grid layouts ── */
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .section-head { margin-bottom: 60px; }

    /* ── process ── */
    .process-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; position: relative; margin-top: 60px; }
    .process-steps::before {
      content: ''; position: absolute; top: 32px; left: 12.5%; right: 12.5%; height: 2px;
      background: linear-gradient(90deg, var(--orange), var(--blue-sky));
    }
    .process-step { text-align: center; padding: 0 16px; }
    .step-num {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, var(--orange), var(--blue-mid));
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem;
      margin: 0 auto 20px; position: relative; z-index: 1;
      box-shadow: 0 0 0 6px var(--navy), 0 0 0 8px rgba(255,94,26,0.3);
    }
    .step-icon { font-size: 1.5rem; margin-bottom: 12px; }
    .process-step h3 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
    .process-step p { font-size: 0.84rem; color: var(--grey-500); line-height: 1.6; }

    /* ── services ── */
    .service-card { position: relative; overflow: hidden; }
    .service-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--orange), var(--blue-sky));
      opacity: 0; transition: opacity 0.3s;
    }
    .service-card:hover::before { opacity: 1; }
    .service-badge {
      display: inline-block; background: rgba(45,127,255,0.15); color: var(--blue-sky);
      padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;
      letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 14px;
    }
    .benefit-list { list-style: none; margin-top: 16px; display: flex; flex-direction: column; gap: 8px; }
    .benefit-list li { font-size: 0.85rem; color: var(--grey-300); display: flex; align-items: flex-start; gap: 8px; }
    .benefit-list li::before { content: '✓'; color: var(--orange); font-weight: 700; flex-shrink: 0; }

    /* ── testimonials ── */
    .testimonial-card {
      background: var(--card-bg); border: 1px solid var(--card-border);
      border-radius: 16px; padding: 32px; position: relative;
    }
    .testimonial-card::before { content: '"'; position: absolute; top: 16px; right: 24px; font-size: 5rem; color: var(--orange); opacity: 0.15; font-family: Georgia, serif; line-height: 1; }
    .stars { color: #FFB800; font-size: 0.85rem; margin-bottom: 14px; }
    .testimonial-card p { font-size: 0.95rem; color: var(--grey-300); line-height: 1.7; margin-bottom: 24px; font-style: italic; }
    .testi-author { display: flex; align-items: center; gap: 12px; }
    .avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, var(--orange), var(--blue-mid));
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1rem;
    }
    .author-name { font-weight: 700; font-size: 0.9rem; }
    .author-role { font-size: 0.78rem; color: var(--grey-500); }

    /* ── about ── */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
    .about-visual {
      position: relative; display: flex; justify-content: center;
    }
    .about-card-float {
      position: absolute; background: rgba(13,27,53,0.9); border: 1px solid var(--card-border);
      border-radius: 12px; padding: 14px 18px; backdrop-filter: blur(12px);
    }
    .mission-card {
      background: linear-gradient(135deg, rgba(255,94,26,0.1), rgba(45,127,255,0.1));
      border: 1px solid var(--card-border); border-radius: 16px; padding: 28px;
      margin-top: 24px;
    }
    .mission-card h4 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
    .mission-card p { font-size: 0.9rem; color: var(--grey-300); line-height: 1.65; }

    /* ── contact ── */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
    .contact-form { display: flex; flex-direction: column; gap: 18px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-size: 0.82rem; font-weight: 600; color: var(--grey-300); letter-spacing: 0.04em; }
    .form-group input, .form-group textarea, .form-group select {
      background: rgba(255,255,255,0.05); border: 1px solid var(--card-border);
      color: var(--white); padding: 12px 16px; border-radius: 10px;
      font-family: 'DM Sans', sans-serif; font-size: 0.92rem;
      transition: border-color 0.2s; outline: none;
    }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
      border-color: var(--blue-sky); box-shadow: 0 0 0 3px rgba(77,184,255,0.1);
    }
    .form-group textarea { min-height: 140px; resize: vertical; }
    .form-group select option { background: var(--navy-soft); }
    .contact-info { display: flex; flex-direction: column; gap: 24px; }
    .info-item { display: flex; align-items: flex-start; gap: 16px; }
    .info-icon {
      width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
      background: rgba(255,94,26,0.12); border: 1px solid rgba(255,94,26,0.25);
      display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
    }
    .info-label { font-size: 0.78rem; color: var(--grey-500); margin-bottom: 4px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
    .info-val { font-size: 0.95rem; color: var(--white); font-weight: 500; }

    /* ── blog ── */
    .blog-card { display: flex; flex-direction: column; }
    .blog-img {
      width: 100%; height: 180px; border-radius: 12px 12px 0 0; object-fit: cover;
      background: linear-gradient(135deg, rgba(45,127,255,0.2), rgba(255,94,26,0.2));
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; border-bottom: 1px solid var(--card-border);
    }
    .blog-body { padding: 22px; flex: 1; display: flex; flex-direction: column; }
    .blog-tag {
      display: inline-block; background: rgba(77,184,255,0.12); color: var(--blue-sky);
      padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 12px;
    }
    .blog-body h3 { font-size: 1rem; font-weight: 700; margin-bottom: 10px; line-height: 1.4; }
    .blog-body p { font-size: 0.85rem; color: var(--grey-500); line-height: 1.6; flex: 1; }
    .blog-meta { margin-top: 16px; font-size: 0.78rem; color: var(--grey-500); display: flex; gap: 12px; align-items: center; }
    .blog-card .card { padding: 0; overflow: hidden; }

    /* ── CTA band ── */
    .cta-band {
      margin: 0 5vw 80px; border-radius: 24px;
      background: linear-gradient(135deg, #1A3A6B 0%, #0D1B35 50%, rgba(255,94,26,0.15) 100%);
      border: 1px solid rgba(77,184,255,0.2);
      padding: 80px 60px; text-align: center; position: relative; overflow: hidden;
    }
    .cta-band::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(45,127,255,0.15), transparent);
    }
    .cta-band h2 { font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 16px; position: relative; }
    .cta-band p { color: var(--grey-300); margin-bottom: 36px; position: relative; font-size: 1.05rem; }
    .cta-band-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }

    /* ── footer ── */
    footer {
      border-top: 1px solid var(--card-border); padding: 60px 5vw 32px;
      background: rgba(0,0,0,0.3);
    }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 48px; }
    .footer-brand p { color: var(--grey-500); font-size: 0.88rem; line-height: 1.7; margin-top: 14px; max-width: 280px; }
    .footer-col h4 { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--grey-300); margin-bottom: 16px; }
    .footer-col a { display: block; color: var(--grey-500); text-decoration: none; font-size: 0.88rem; margin-bottom: 10px; transition: color 0.2s; }
    .footer-col a:hover { color: var(--orange); }
    .footer-bottom { border-top: 1px solid var(--card-border); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }
    .footer-bottom p { color: var(--grey-500); font-size: 0.8rem; }
    .social-links { display: flex; gap: 12px; }
    .social-link {
      width: 36px; height: 36px; border-radius: 8px;
      background: var(--card-bg); border: 1px solid var(--card-border);
      display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
      cursor: pointer; transition: all 0.2s; text-decoration: none; color: var(--white);
    }
    .social-link:hover { background: var(--orange); border-color: var(--orange); transform: translateY(-3px); }

    /* ── why choose us ── */
    .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center; }
    .why-feature { display: flex; align-items: flex-start; gap: 16px; padding: 20px; border-radius: 12px; transition: background 0.2s; }
    .why-feature:hover { background: var(--card-bg); }
    .why-icon { font-size: 1.6rem; flex-shrink: 0; margin-top: 2px; }
    .why-feature h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; }
    .why-feature p { font-size: 0.85rem; color: var(--grey-500); line-height: 1.6; }

    /* ── tech logos ── */
    .tech-row {
      display: flex; flex-wrap: wrap; gap: 12px; margin-top: 40px;
    }
    .tech-chip {
      background: var(--card-bg); border: 1px solid var(--card-border);
      padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; color: var(--grey-300);
      display: flex; align-items: center; gap: 6px;
    }

    /* ── page transitions ── */
    .page { animation: fadeUp 0.45s ease; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

    /* ── responsive ── */
    @media(max-width:1024px) {
      .grid-3 { grid-template-columns: repeat(2,1fr); }
      .grid-4 { grid-template-columns: repeat(2,1fr); }
      .process-steps { grid-template-columns: repeat(2,1fr); gap: 32px; }
      .process-steps::before { display: none; }
      .footer-grid { grid-template-columns: 1fr 1fr; }
      .hero-inner { grid-template-columns: 1fr; text-align: center; }
      .hero-visual { display: none; }
      .hero-sub { max-width: 100%; }
      .hero-actions { justify-content: center; }
      .hero-stats { justify-content: center; }
    }
    @media(max-width:768px) {
      .nav-links, .nav-cta { display: none; }
      .hamburger { display: flex; }
      section { padding: 70px 5vw; }
      .grid-2, .grid-3, .about-grid, .contact-grid, .why-grid { grid-template-columns: 1fr; }
      .grid-4 { grid-template-columns: 1fr; }
      .footer-grid { grid-template-columns: 1fr; }
      .cta-band { padding: 48px 28px; margin: 0 4vw 60px; }
      .footer-bottom { flex-direction: column; gap: 16px; }
      .process-steps { grid-template-columns: 1fr; }
    }
    @media(max-width:480px) {
      .hero h1 { font-size: 2.2rem; }
      .hero-stats { flex-wrap: wrap; gap: 24px; }
    }
  `}</style>
);

/* ─── LOGO (text wordmark) ─── */
const LogoImg = ({ size = 36 }) => (
  <span
    aria-label="3D Design Develop Deploy Logo"
    style={{
      width: size,
      height: size,
      minWidth: size,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Syne', sans-serif",
      fontWeight: 800,
      fontSize: size * 0.42,
      color: "#fff",
      background: "linear-gradient(135deg, var(--orange), var(--blue-sky))",
    }}
  >
    3D
  </span>
);

/* ─── NAV ─────────────────────────────────────────────────── */
const Nav = ({ page, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Home", "About", "Services", "Process", "Blog", "Contact"];

  const go = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo" onClick={() => go("Home")} style={{ cursor: "pointer" }}>
          <LogoImg size={36} />
          <span>3D³</span>
        </div>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l}>
              <a className={page === l ? "active" : ""} onClick={() => go(l)} style={{ cursor: "pointer" }}>{l}</a>
            </li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => go("Contact")}>Get Started →</button>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {links.map((l) => (
          <a key={l} onClick={() => go(l)} style={{ cursor: "pointer" }}>{l}</a>
        ))}
        <button className="btn-primary" onClick={() => go("Contact")} style={{ marginTop: 8 }}>Get Started →</button>
      </div>
    </>
  );
};

/* ─── HOME PAGE ───────────────────────────────────────────── */
const HomePage = ({ setPage }) => (
  <div className="page">
    {/* HERO */}
    <section className="hero">
      <div className="hero-bg" /><div className="hero-grid" />
      <div className="hero-inner">
        <div>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            End-to-End Digital Solutions
          </div>
          <h1>
            From Idea to<br />
            <span className="accent">Deployment —</span><br />
            We Build Everything
          </h1>
          <p className="hero-sub">
            One partner for design, development, DevOps, and cloud. We turn your vision
            into a scalable, production-ready product — fast, clean, and future-proof.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setPage("Contact")}>Get Started Free →</button>
            <button className="btn-outline" onClick={() => setPage("Services")}>Explore Services</button>
          </div>
          <div className="hero-stats">
            {[["50+", "Projects Delivered"], ["3x", "Faster Deployment"], ["99.9%", "Uptime SLA"], ["24/7", "Monitoring"]].map(([v, l]) => (
              <div key={l}>
                <div className="stat-val">{v}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="orb orb-1" /><div className="orb orb-2" />
          <div className="hero-logo-wrap"><LogoImg size={200} /></div>
        </div>
      </div>
    </section>

    {/* SERVICES OVERVIEW */}
    <section style={{ paddingTop: 0 }}>
      <div className="section-head">
        <div className="section-label">What We Do</div>
        <h2 className="section-title">The Full Stack — <span style={{ color: "var(--orange)" }}>Design. Build. Scale.</span></h2>
        <p className="section-sub">From pixel-perfect UI to Kubernetes clusters — one team, zero hand-offs, complete ownership.</p>
      </div>
      <div className="grid-3">
        {[
          { icon: "🎨", cat: "Design", title: "UI/UX & Product Design", desc: "Wireframes, prototypes, and pixel-perfect interfaces that convert visitors into customers.", color: "#FF5E1A" },
          { icon: "⚙️", cat: "Develop", title: "Web, API & Mobile Dev", desc: "Scalable backends, responsive frontends, and cross-platform apps built with modern stacks.", color: "#2D7FFF" },
          { icon: "🚀", cat: "Deploy", title: "DevOps, Cloud & Kubernetes", desc: "CI/CD pipelines, containerized workloads, Terraform IaC, and 24/7 monitoring on AWS/Azure/GCP.", color: "#4DB8FF" },
        ].map((s) => (
          <div className="card service-card" key={s.title}>
            <div className="service-badge">{s.cat}</div>
            <div className="card-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <button
              onClick={() => setPage("Services")}
              style={{ marginTop: 20, background: "none", border: "none", color: s.color, fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", fontFamily: "Syne, sans-serif", padding: 0 }}
            >
              Learn more →
            </button>
          </div>
        ))}
      </div>
    </section>

    {/* WHY CHOOSE US */}
    <section style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
      <div className="why-grid">
        <div>
          <div className="section-label">Why Us</div>
          <h2 className="section-title">Why 100+ teams choose <span style={{ color: "var(--orange)" }}>3D³</span></h2>
          <p className="section-sub">We're not just a vendor — we're an embedded tech partner obsessed with your outcome.</p>
          <div className="tech-row">
            {["React", "Node.js", "Kubernetes", "Terraform", "AWS", "Azure", "Docker", "Prometheus", "GitHub Actions"].map((t) => (
              <div className="tech-chip" key={t}>⚡ {t}</div>
            ))}
          </div>
        </div>
        <div>
          {[
            { icon: "🏎️", title: "Speed Without Sacrifice", desc: "We ship fast without cutting corners. Our DevOps pipelines reduce time-to-production by 60%." },
            { icon: "🔒", title: "Security-First by Default", desc: "Trivy scanning, secrets management, RBAC, and compliance baked into every pipeline." },
            { icon: "📈", title: "Built to Scale", desc: "Kubernetes-native architecture. Auto-scaling. Multi-region. Ready for 10x growth on day one." },
            { icon: "🤝", title: "True Partnership", desc: "Transparent communication, weekly reports, dedicated Slack channel. Always in the loop." },
          ].map((f) => (
            <div className="why-feature" key={f.title}>
              <div className="why-icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* PROCESS PREVIEW */}
    <section>
      <div className="section-head" style={{ textAlign: "center" }}>
        <div className="section-label" style={{ margin: "0 auto 20px" }}>Our Process</div>
        <h2 className="section-title">How We Work</h2>
        <p className="section-sub" style={{ margin: "0 auto" }}>A proven 4-step framework that delivers results, every time.</p>
      </div>
      <div className="process-steps">
        {[
          { n: "01", icon: "📋", title: "Requirements & Design", desc: "Deep discovery, wireframes, and design systems before a single line of code." },
          { n: "02", icon: "💻", title: "Development", desc: "Agile sprints, daily standups, clean code, and rigorous code reviews." },
          { n: "03", icon: "🧪", title: "Testing & QA", desc: "Unit tests, integration tests, security audits, and performance benchmarks." },
          { n: "04", icon: "🚀", title: "Deploy & Monitor", desc: "Zero-downtime deployments, full observability stack, and ongoing support." },
        ].map((s) => (
          <div className="process-step" key={s.n}>
            <div className="step-num">{s.n}</div>
            <div className="step-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section style={{ paddingTop: 0 }}>
      <div className="section-head">
        <div className="section-label">Testimonials</div>
        <h2 className="section-title">Clients Love the Results</h2>
      </div>
      <div className="grid-3">
        {[
          { text: "3D³ took our product from idea to production in 6 weeks. The DevOps setup alone saved us 40+ hours every month. Absolute professionals.", name: "Arjun Mehta", role: "CEO, FinStack", init: "AM" },
          { text: "Our Kubernetes migration was seamless. Zero downtime, full monitoring, and our infra costs dropped by 35%. Highly recommended.", name: "Sarah Williams", role: "CTO, CloudRetail", init: "SW" },
          { text: "The design work was stunning, but what really impressed us was how quickly they shipped. We launched 3 weeks ahead of schedule.", name: "Priya Nair", role: "Founder, EdTechPro", init: "PN" },
        ].map((t) => (
          <div className="testimonial-card" key={t.name}>
            <div className="stars">★★★★★</div>
            <p>"{t.text}"</p>
            <div className="testi-author">
              <div className="avatar">{t.init}</div>
              <div>
                <div className="author-name">{t.name}</div>
                <div className="author-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA BAND */}
    <div className="cta-band">
      <h2>Ready to Build Something <span style={{ color: "var(--orange)" }}>Exceptional?</span></h2>
      <p>Book a free 30-minute strategy call. No pressure, just clarity on what's possible.</p>
      <div className="cta-band-actions">
        <button className="btn-primary" onClick={() => setPage("Contact")}>Book Free Consultation</button>
        <button className="btn-outline" onClick={() => setPage("Services")}>View All Services</button>
      </div>
    </div>
  </div>
);

/* ─── ABOUT PAGE ──────────────────────────────────────────── */
const AboutPage = ({ setPage }) => (
  <div className="page" style={{ paddingTop: 70 }}>
    <section>
      <div className="about-grid">
        <div>
          <div className="section-label">Our Story</div>
          <h1 className="section-title">Built by engineers.<br /><span style={{ color: "var(--orange)" }}>Obsessed with outcomes.</span></h1>
          <p style={{ color: "var(--grey-300)", lineHeight: 1.75, marginBottom: 20 }}>
            3D Design Develop Deploy was born out of a simple frustration: too many startups were spending months
            juggling 3 different agencies for design, development, and DevOps — only to get something that
            didn't hold together.
          </p>
          <p style={{ color: "var(--grey-500)", lineHeight: 1.75, marginBottom: 32 }}>
            We built 3D³ to change that. One team. One vision. End-to-end ownership from the first wireframe
            to the production Kubernetes cluster. We've shipped products for startups, scale-ups, and enterprises
            across FinTech, EdTech, HealthTech, and SaaS.
          </p>
          <button className="btn-primary" onClick={() => setPage("Contact")}>Work With Us →</button>
        </div>
        <div className="about-visual">
          <div style={{
            width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,127,255,0.15), transparent 70%)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <LogoImg size={200} />
          </div>
        </div>
      </div>
    </section>

    <section style={{ paddingTop: 0 }}>
      <div className="grid-3">
        {[
          { icon: "🎯", title: "Mission", desc: "To be the most reliable end-to-end technology partner for businesses — delivering quality, speed, and scale in every engagement." },
          { icon: "🔭", title: "Vision", desc: "A world where any founder, anywhere, can bring world-class software to market without navigating a fragmented tech ecosystem." },
          { icon: "💡", title: "Philosophy", desc: "We believe great software is 30% code and 70% thinking. We invest heavily in understanding your problem before writing a single line." },
        ].map((m) => (
          <div className="card" key={m.title}>
            <div className="card-icon">{m.icon}</div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section style={{ paddingTop: 0 }}>
      <div className="section-label">The Founder Mindset</div>
      <h2 className="section-title">We think like <span style={{ color: "var(--orange)" }}>founders,</span><br />not just developers</h2>
      <div className="grid-2" style={{ marginTop: 40 }}>
        {[
          { icon: "⚡", title: "Ship fast, iterate faster", desc: "We believe in getting to market quickly and refining based on real user feedback — not perfecting in isolation for months." },
          { icon: "📊", title: "Metrics over opinions", desc: "Every technical decision is backed by data. We set up observability from day one so you always know what's working." },
          { icon: "🔄", title: "Automation over manual work", desc: "If it's done more than once, we automate it. CI/CD, testing, scaling, monitoring — all on autopilot." },
          { icon: "🌍", title: "Global-grade infrastructure", desc: "We build for scale from day one. Multi-region, fault-tolerant, cost-optimized cloud infrastructure that grows with you." },
        ].map((f) => (
          <div className="why-feature card" key={f.title}>
            <div className="why-icon">{f.icon}</div>
            <div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <div className="cta-band">
      <h2>Join <span style={{ color: "var(--orange)" }}>50+ companies</span> who shipped with us</h2>
      <p>Let's talk about your project. No commitment, just a conversation.</p>
      <div className="cta-band-actions">
        <button className="btn-primary" onClick={() => setPage("Contact")}>Start a Conversation</button>
      </div>
    </div>
  </div>
);

/* ─── SERVICES PAGE ───────────────────────────────────────── */
const services = [
  {
    icon: "🎨", cat: "Design", title: "UI/UX Design",
    desc: "We craft interfaces that users love and businesses need — grounded in research, refined through iteration.",
    benefits: ["User research & personas", "Wireframes & interactive prototypes", "Design system creation", "Accessibility-first (WCAG 2.1)", "Handoff-ready Figma files"],
    cases: ["SaaS dashboards", "Mobile apps", "E-commerce storefronts", "Admin portals"]
  },
  {
    icon: "📐", cat: "Design", title: "Product Design & Strategy",
    desc: "Product design that bridges business goals with user needs — from concept map to clickable prototype.",
    benefits: ["Product roadmapping", "Jobs-to-be-done framework", "Competitive analysis", "Rapid prototyping", "Usability testing"],
    cases: ["MVP definition", "Feature prioritization", "Rebrand & redesign", "B2B SaaS products"]
  },
  {
    icon: "🌐", cat: "Develop", title: "Web Development",
    desc: "Fast, SEO-optimized, scalable web applications built on modern stacks — from landing pages to complex platforms.",
    benefits: ["React / Next.js / Vue frontends", "Node.js, Python, Go backends", "REST & GraphQL APIs", "CMS integration (Sanity, Contentful)", "Performance & Core Web Vitals"],
    cases: ["SaaS platforms", "Company websites", "Marketplaces", "Progressive Web Apps"]
  },
  {
    icon: "📱", cat: "Develop", title: "Mobile App Development",
    desc: "Cross-platform and native mobile apps that deliver native performance and seamless user experience.",
    benefits: ["React Native / Flutter", "iOS & Android deployment", "Push notifications & offline support", "App Store optimization", "In-app analytics"],
    cases: ["Consumer apps", "Enterprise mobile tools", "IoT dashboards", "Healthcare apps"]
  },
  {
    icon: "🔁", cat: "Deploy", title: "DevOps & CI/CD",
    desc: "Automated pipelines that take code from commit to production in minutes — not days. Zero manual deployments.",
    benefits: ["GitHub Actions / Azure DevOps pipelines", "Automated testing & security scanning", "Blue/green & canary deployments", "Rollback mechanisms", "Secrets management (Vault, AWS SSM)"],
    cases: ["Startup MVP pipelines", "Enterprise release trains", "Monorepo setups", "Multi-environment workflows"]
  },
  {
    icon: "☁️", cat: "Deploy", title: "Cloud Infrastructure (AWS / Azure / GCP)",
    desc: "Well-architected cloud infrastructure designed for reliability, cost-efficiency, and global scale.",
    benefits: ["Terraform Infrastructure as Code", "Multi-region, HA architecture", "Cost optimization & FinOps", "Compliance & security posture", "Cloud migration & modernization"],
    cases: ["Cloud-native greenfield builds", "On-prem to cloud migration", "Disaster recovery setup", "Cost optimization audits"]
  },
  {
    icon: "🐳", cat: "Deploy", title: "Kubernetes & Containerization",
    desc: "Production-grade Kubernetes clusters — from node provisioning to RBAC, Ingress, and HPA configuration.",
    benefits: ["EKS / AKS / GKE cluster setup", "Helm chart authoring", "Service mesh (Istio/Linkerd)", "Pod autoscaling (HPA/KEDA)", "cert-manager & Ingress NGINX"],
    cases: ["Microservices orchestration", "Multi-tenant SaaS platforms", "Batch processing workloads", "ML model serving"]
  },
  {
    icon: "📊", cat: "Deploy", title: "Monitoring & Observability",
    desc: "Full-stack observability with real-time alerting, dashboards, and SLO tracking — so you're never flying blind.",
    benefits: ["Prometheus & Grafana stack", "Log aggregation (Loki, ELK)", "Distributed tracing (Jaeger/Tempo)", "Uptime & SSL monitoring", "On-call alerting (PagerDuty, OpsGenie)"],
    cases: ["Production incident reduction", "SLA reporting", "Performance optimization", "Cost anomaly detection"]
  },
];

const ServicesPage = ({ setPage }) => (
  <div className="page" style={{ paddingTop: 70 }}>
    <section>
      <div className="section-label">Services</div>
      <h1 className="section-title">Everything you need.<br /><span style={{ color: "var(--orange)" }}>Nothing you don't.</span></h1>
      <p className="section-sub">Modular services that work standalone or as a complete end-to-end engagement. You pick the scope.</p>
    </section>

    {["Design", "Develop", "Deploy"].map((cat) => (
      <section key={cat} style={{ paddingTop: 0, paddingBottom: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, var(--orange), var(--blue-mid))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
            {cat === "Design" ? "🎨" : cat === "Develop" ? "⚙️" : "🚀"}
          </div>
          <h2 style={{ fontSize: "1.6rem", fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}>{cat}</h2>
        </div>
        <div className="grid-2">
          {services.filter((s) => s.cat === cat).map((s) => (
            <div className="card service-card" key={s.title}>
              <div className="service-badge">{s.cat}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className="card-icon" style={{ margin: 0 }}>{s.icon}</div>
                <h3 style={{ margin: 0 }}>{s.title}</h3>
              </div>
              <p style={{ marginBottom: 20 }}>{s.desc}</p>
              <ul className="benefit-list">
                {s.benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--grey-500)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Use Cases</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {s.cases.map((c) => (
                    <span key={c} style={{ background: "rgba(77,184,255,0.08)", border: "1px solid rgba(77,184,255,0.15)", color: "var(--blue-sky)", padding: "4px 10px", borderRadius: 6, fontSize: "0.75rem" }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}

    <div className="cta-band">
      <h2>Not sure what you need?<br /><span style={{ color: "var(--orange)" }}>Let's figure it out together.</span></h2>
      <p>Book a free 30-min scope call. We'll map the right services to your goals.</p>
      <div className="cta-band-actions">
        <button className="btn-primary" onClick={() => setPage("Contact")}>Book Free Scope Call</button>
      </div>
    </div>
  </div>
);

/* ─── PROCESS PAGE ────────────────────────────────────────── */
const ProcessPage = ({ setPage }) => (
  <div className="page" style={{ paddingTop: 70 }}>
    <section>
      <div className="section-label">How We Work</div>
      <h1 className="section-title">The 3D³ Delivery<br /><span style={{ color: "var(--orange)" }}>Framework</span></h1>
      <p className="section-sub">A battle-tested process refined across 50+ projects. Predictable, transparent, and built for results.</p>
    </section>

    {[
      {
        n: "01", icon: "📋", title: "Requirements & Design",
        subtitle: "Weeks 1–2",
        desc: "We start by deeply understanding your business, users, and goals — before touching any tools. This phase prevents expensive pivots later.",
        steps: ["Stakeholder interviews & goal alignment", "User research & competitive analysis", "Information architecture & user flows", "Low-fidelity wireframes → high-fidelity mockups", "Interactive prototype & design review", "Design system & component library setup"],
        output: "Figma design files, User flow diagrams, Design system, Project scope document"
      },
      {
        n: "02", icon: "💻", title: "Development",
        subtitle: "Weeks 3–8",
        desc: "Two-week Agile sprints with daily updates, weekly demos, and a shared Notion board. You see progress every single day.",
        steps: ["Repository & project scaffolding", "Backend API & database design", "Frontend component development", "Third-party integrations (payments, auth, etc.)", "Weekly sprint demos & feedback cycles", "Code reviews & documentation"],
        output: "Working application, API documentation, Test suite, Deployment-ready codebase"
      },
      {
        n: "03", icon: "🧪", title: "Testing & QA",
        subtitle: "Weeks 7–9",
        desc: "Nothing ships without passing our rigorous QA process. We automate what can be automated and manually verify what matters most.",
        steps: ["Unit & integration test coverage (>80%)", "End-to-end testing (Playwright/Cypress)", "Performance testing & load simulation", "Security scanning (OWASP, Trivy, Snyk)", "Cross-browser & device compatibility", "User acceptance testing (UAT)"],
        output: "QA report, Security audit, Performance benchmarks, Bug-free release candidate"
      },
      {
        n: "04", icon: "🚀", title: "Deployment & Monitoring",
        subtitle: "Week 10+",
        desc: "Zero-downtime deployment with a full observability stack. After launch, we stay on to ensure everything runs smoothly.",
        steps: ["Infrastructure provisioning (Terraform)", "Kubernetes cluster configuration & RBAC", "CI/CD pipeline activation & smoke tests", "Prometheus + Grafana dashboards live", "DNS, SSL, and CDN configuration", "24/7 alerting & runbook documentation"],
        output: "Production deployment, Monitoring dashboards, Alert policies, Runbooks, Handoff documentation"
      },
    ].map((phase, i) => (
      <section key={phase.n} style={{ paddingTop: 0, paddingBottom: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <div style={{ ...(i % 2 === 1 ? { order: 2 } : {}) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div className="step-num" style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--orange), var(--blue-mid))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0 }}>{phase.n}</div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--orange)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{phase.subtitle}</div>
                <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.02em" }}>{phase.title}</h2>
              </div>
            </div>
            <p style={{ color: "var(--grey-300)", lineHeight: 1.75, marginBottom: 24 }}>{phase.desc}</p>
            <ul className="benefit-list">
              {phase.steps.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="card" style={{ ...(i % 2 === 1 ? { order: 1 } : {}) }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>{phase.icon}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--grey-500)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Deliverables</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {phase.output.split(", ").map((d) => (
                <span key={d} style={{ background: "rgba(255,94,26,0.08)", border: "1px solid rgba(255,94,26,0.2)", color: "var(--orange-lt)", padding: "6px 12px", borderRadius: 8, fontSize: "0.8rem" }}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    ))}

    <div className="cta-band">
      <h2>Ready to start <span style={{ color: "var(--orange)" }}>Step 01?</span></h2>
      <p>Book your requirements session today. It's free, focused, and sets the foundation for everything.</p>
      <div className="cta-band-actions">
        <button className="btn-primary" onClick={() => setPage("Contact")}>Start the Process</button>
      </div>
    </div>
  </div>
);

/* ─── BLOG PAGE ───────────────────────────────────────────── */
const posts = [
  { tag: "DevOps", icon: "🐳", title: "Kubernetes in Production: 10 Things We Wish We Knew Earlier", excerpt: "Hard-won lessons from running 20+ K8s clusters in production — from RBAC gotchas to HPA tuning.", author: "3D³ Team", date: "Apr 28, 2026", read: "8 min read" },
  { tag: "Design", icon: "🎨", title: "Why Your SaaS Dashboard Needs a Design System (Not Just Figma Screens)", excerpt: "The difference between a component library and a design system — and why it matters at scale.", author: "3D³ Team", date: "Apr 15, 2026", read: "6 min read" },
  { tag: "Cloud", icon: "☁️", title: "Terraform vs. Pulumi in 2026: Which IaC Tool Should You Choose?", excerpt: "An honest comparison from engineers who've used both in production environments.", author: "3D³ Team", date: "Mar 30, 2026", read: "10 min read" },
  { tag: "Development", icon: "⚡", title: "The API Design Decisions That Will Haunt You in 18 Months", excerpt: "Avoid these common REST API mistakes before they become breaking changes your clients hate.", author: "3D³ Team", date: "Mar 12, 2026", read: "7 min read" },
  { tag: "DevOps", icon: "🔒", title: "Secrets Management: The Right Way to Handle Credentials in CI/CD", excerpt: "A deep dive into Vault, AWS SSM, and GitHub OIDC — and when to use each.", author: "3D³ Team", date: "Feb 28, 2026", read: "9 min read" },
  { tag: "Startup", icon: "🚀", title: "From Idea to MVP in 6 Weeks: Our Actual Process", excerpt: "The exact playbook we use to take a product brief to a production deployment in six weeks.", author: "3D³ Team", date: "Feb 10, 2026", read: "12 min read" },
];

const BlogPage = () => (
  <div className="page" style={{ paddingTop: 70 }}>
    <section>
      <div className="section-label">Blog</div>
      <h1 className="section-title">Insights from the<br /><span style={{ color: "var(--orange)" }}>trenches</span></h1>
      <p className="section-sub">Real lessons from shipping software, scaling infrastructure, and building products people love.</p>
    </section>
    <section style={{ paddingTop: 0 }}>
      <div className="grid-3">
        {posts.map((p) => (
          <div className="card blog-card" key={p.title} style={{ padding: 0, cursor: "pointer" }}>
            <div className="blog-img">{p.icon}</div>
            <div className="blog-body">
              <span className="blog-tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <div className="blog-meta">
                <span>📅 {p.date}</span>
                <span>⏱ {p.read}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <p style={{ color: "var(--grey-500)", marginBottom: 20 }}>More articles coming every week. Subscribe to get notified.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <input type="email" placeholder="your@email.com" style={{ padding: "12px 20px", borderRadius: 10, border: "1px solid var(--card-border)", background: "rgba(255,255,255,0.05)", color: "var(--white)", fontFamily: "DM Sans", fontSize: "0.9rem", minWidth: 280, outline: "none" }} />
          <button className="btn-primary">Subscribe →</button>
        </div>
      </div>
    </section>
  </div>
);

/* ─── CONTACT PAGE ────────────────────────────────────────── */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mkjweoqd";

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", service: "", budget: "", message: "" });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.target),
      });
      if (res.ok) setSubmitted(true);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ paddingTop: 70 }}>
      <section>
        <div className="section-label">Contact</div>
        <h1 className="section-title">Let's build something<br /><span style={{ color: "var(--orange)" }}>remarkable together</span></h1>
        <p className="section-sub">Tell us about your project. We'll respond within 24 hours with a clear next step.</p>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="contact-grid">
          <div>
            {submitted ? (
              <div className="card" style={{ textAlign: "center", padding: 48 }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
                <h3 style={{ marginBottom: 12, fontSize: "1.3rem" }}>Message Sent!</h3>
                <p style={{ color: "var(--grey-300)" }}>We'll get back to you within 24 hours. Looking forward to building something great together.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="contact-form">
                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input name="name" value={form.name} onChange={handle} placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handle} placeholder="you@company.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Service Needed</label>
                  <select name="service" value={form.service} onChange={handle}>
                    <option value="">Select a service...</option>
                    <option>UI/UX Design</option>
                    <option>Web Development</option>
                    <option>Mobile App</option>
                    <option>DevOps & CI/CD</option>
                    <option>Cloud Infrastructure</option>
                    <option>Kubernetes Setup</option>
                    <option>Full End-to-End Project</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Project Budget</label>
                  <select name="budget" value={form.budget} onChange={handle}>
                    <option value="">Select budget range...</option>
                    <option>Under $5,000</option>
                    <option>$5,000 – $15,000</option>
                    <option>$15,000 – $50,000</option>
                    <option>$50,000+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tell us about your project *</label>
                  <textarea name="message" value={form.message} onChange={handle} placeholder="What are you building? What's the timeline? Any specific requirements?" required />
                </div>
                {error && (
                  <p style={{ color: "var(--orange)", fontSize: "0.85rem" }}>
                    Something went wrong sending your message. Please try again or email support@3dstack.in directly.
                  </p>
                )}
                <button className="btn-primary" type="submit" disabled={submitting} style={{ width: "100%", padding: "16px", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
                  {submitting ? "Sending…" : "Send Message & Start Project →"}
                </button>
              </form>
            )}
          </div>

          <div className="contact-info">
            {[
              { icon: "📧", label: "Email Us", val: "support@3dstack.in" },
              { icon: "💬", label: "WhatsApp", val: "+91 94600 36031" },
              { icon: "📍", label: "Headquarters", val: "Jaipur, India · Remote-first worldwide" },
              { icon: "⏰", label: "Response Time", val: "24×7 · Always available" },
            ].map((i) => (
              <div className="info-item" key={i.label}>
                <div className="info-icon">{i.icon}</div>
                <div>
                  <div className="info-label">{i.label}</div>
                  <div className="info-val">{i.val}</div>
                </div>
              </div>
            ))}

            <div className="card" style={{ marginTop: 8 }}>
              <h3 style={{ marginBottom: 16, fontSize: "1rem" }}>🗓 Book a Free Strategy Call</h3>
              <p style={{ marginBottom: 20 }}>30 minutes. No fluff. We'll map your idea to a delivery plan.</p>
              <button className="btn-outline" style={{ width: "100%" }}>Book on Calendly →</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─── FOOTER ──────────────────────────────────────────────── */
const Footer = ({ setPage }) => (
  <footer>
    <div className="footer-grid">
      <div className="footer-brand">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <LogoImg size={32} />
          <span style={{ fontFamily: "Syne", fontWeight: 800, background: "linear-gradient(135deg, var(--orange), var(--blue-sky))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3D Design Develop Deploy</span>
        </div>
        <p>End-to-end digital solutions — from idea to deployment. One team, zero hand-offs, complete ownership.</p>
        <div className="social-links" style={{ marginTop: 20 }}>
          {["𝕏", "in", "🐙", "▶"].map((s) => <a className="social-link" key={s}>{s}</a>)}
        </div>
      </div>
      {[
        { title: "Services", links: ["UI/UX Design", "Web Development", "Mobile Apps", "DevOps & CI/CD", "Cloud Infrastructure", "Kubernetes"] },
        { title: "Company", links: ["About Us", "Process", "Blog", "Contact"] },
        { title: "Resources", links: ["Case Studies", "Documentation", "Pricing", "Status Page"] },
      ].map((col) => (
        <div className="footer-col" key={col.title}>
          <h4>{col.title}</h4>
          {col.links.map((l) => <a key={l} onClick={() => { setPage(l === "About Us" ? "About" : l === "Process" ? "Process" : l === "Blog" ? "Blog" : l === "Contact" ? "Contact" : "Services"); window.scrollTo(0,0); }} style={{ cursor: "pointer" }}>{l}</a>)}
        </div>
      ))}
    </div>
    <div className="footer-bottom">
      <p>© 2026 3D Design Develop Deploy. All rights reserved.</p>
      <p style={{ color: "var(--grey-500)" }}>Built by 3D³ · Privacy Policy · Terms of Service</p>
    </div>
  </footer>
);

/* ─── APP ─────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("Home");

  const renderPage = () => {
    switch (page) {
      case "Home":    return <HomePage setPage={setPage} />;
      case "About":   return <AboutPage setPage={setPage} />;
      case "Services":return <ServicesPage setPage={setPage} />;
      case "Process": return <ProcessPage setPage={setPage} />;
      case "Blog":    return <BlogPage />;
      case "Contact": return <ContactPage />;
      default:        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <Nav page={page} setPage={setPage} />
      <main>{renderPage()}</main>
      <Footer setPage={setPage} />
    </>
  );
}
