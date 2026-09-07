import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
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
      text-decoration: none; display: inline-flex; align-items: center;
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
      text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
    }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255,94,26,0.55); }
    .btn-outline {
      background: transparent; color: var(--white);
      border: 1.5px solid rgba(255,255,255,0.25);
      padding: 14px 30px; border-radius: 10px;
      font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.95rem;
      cursor: pointer; transition: all 0.25s;
      text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
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
  <img
    src="/logo.png"
    alt="3D Design Develop Deploy logo"
    width={size}
    height={size}
    style={{ width: size, height: size, minWidth: size, objectFit: "contain" }}
  />
);

/* ─── NAV ─────────────────────────────────────────────────── */
const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Process", path: "/process" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <Link to="/" className="nav-logo">
          <LogoImg size={36} />
          <span>3D³</span>
        </Link>
        <ul className="nav-links">
          {navLinks.map((l) => (
            <li key={l.label}>
              <Link to={l.path} className={location.pathname === l.path ? "active" : ""}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <Link to="/contact" className="nav-cta">Get Started →</Link>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((l) => (
          <Link key={l.label} to={l.path}>{l.label}</Link>
        ))}
        <Link to="/contact" className="btn-primary" style={{ marginTop: 8, textAlign: "center", textDecoration: "none" }}>Get Started →</Link>
      </div>
    </>
  );
};

/* ─── HOME PAGE ───────────────────────────────────────────── */
const HomePage = () => (
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
            <Link to="/contact" className="btn-primary">Get Started Free →</Link>
            <Link to="/services" className="btn-outline">Explore Services</Link>
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
            <Link
              to="/services"
              style={{ marginTop: 20, display: "inline-block", background: "none", border: "none", color: s.color, fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", fontFamily: "Syne, sans-serif", padding: 0, textDecoration: "none" }}
            >
              Learn more →
            </Link>
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
        <Link to="/contact" className="btn-primary">Book Free Consultation</Link>
        <Link to="/services" className="btn-outline">View All Services</Link>
      </div>
    </div>
  </div>
);

/* ─── ABOUT PAGE ──────────────────────────────────────────── */
const AboutPage = () => (
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
          <Link to="/contact" className="btn-primary">Work With Us →</Link>
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
        <Link to="/contact" className="btn-primary">Start a Conversation</Link>
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

/* ─── SERVICE DETAIL PAGES ────────────────────────────────── */
export const SERVICE_PAGES = [
  {
    slug: "ui-ux-design",
    icon: "🎨",
    title: "UI/UX Design Services",
    tagline: "Interfaces people enjoy using — and businesses can measure.",
    metaDescription: "UI/UX design services: user research, wireframes, interactive prototypes, and accessibility-first design systems, handed off ready to build.",
    benefits: ["User research & personas", "Wireframes & interactive prototypes", "Design system creation", "Accessibility-first (WCAG 2.1)", "Handoff-ready Figma files"],
    cases: ["SaaS dashboards", "Mobile apps", "E-commerce storefronts", "Admin portals"],
    body: [
      { type: "p", text: "Good UI/UX design isn't about making things look polished — it's about removing every point of friction between a user and the outcome they came for. We design interfaces the same way we build software: research first, iterate fast, and validate with real users before a single line of production code depends on the layout." },
      { type: "h2", text: "What's included" },
      { type: "list", items: ["User research & personas", "Wireframes & interactive prototypes", "Design system creation", "Accessibility-first design (WCAG 2.1)", "Handoff-ready Figma files with documented components"] },
      { type: "h2", text: "How we run a design engagement" },
      { type: "p", text: "We start with lightweight research — competitive analysis, existing user feedback, and a handful of stakeholder interviews — before any pixels move. From there we go straight to interactive prototypes rather than static mockups, because clickable flows surface usability problems that static screens hide. Every design ships with a token-based design system (color, spacing, type) so engineering can build it without guesswork, and so future screens stay consistent without a designer re-reviewing every one." },
      { type: "h2", text: "Who this is for" },
      { type: "p", text: "Teams shipping a new product who want to validate the experience before investing in a full build, and teams with an existing product where usability — not features — is the thing holding back conversion or retention. Common engagements: SaaS dashboards, mobile apps, e-commerce storefronts, and internal admin portals." },
      { type: "h2", text: "Common questions" },
      { type: "h3", text: "Do we get the actual Figma files, or just a walkthrough?" },
      { type: "p", text: "You get full ownership of the Figma project, organized as a documented design system component library — not a flat set of screens." },
      { type: "h3", text: "Is this just visual design, or do you do research too?" },
      { type: "p", text: "Research is built into every engagement by default — personas, competitive analysis, and usability testing with real target users, not just visual polish." },
      { type: "h3", text: "How long does a typical UI/UX engagement take?" },
      { type: "p", text: "A focused product redesign is usually 3-5 weeks; a full design system for a larger platform runs 6-8 weeks. See our Pricing page for starting ranges." },
    ],
    faqs: [
      { q: "Do we get the actual Figma files, or just a walkthrough?", a: "You get full ownership of the Figma project, organized as a documented design system component library — not a flat set of screens." },
      { q: "Is this just visual design, or do you do research too?", a: "Research is built into every engagement by default — personas, competitive analysis, and usability testing with real target users, not just visual polish." },
      { q: "How long does a typical UI/UX engagement take?", a: "A focused product redesign is usually 3-5 weeks; a full design system for a larger platform runs 6-8 weeks." },
    ],
  },
  {
    slug: "web-development",
    icon: "🌐",
    title: "Web Development Services",
    tagline: "Fast, SEO-ready web applications built on modern stacks.",
    metaDescription: "Web development services: React, Next.js, and Node.js applications built for performance, SEO, and scale — from landing pages to full platforms.",
    benefits: ["React / Next.js / Vue frontends", "Node.js, Python, Go backends", "REST & GraphQL APIs", "CMS integration (Sanity, Contentful)", "Performance & Core Web Vitals"],
    cases: ["SaaS platforms", "Company websites", "Marketplaces", "Progressive Web Apps"],
    body: [
      { type: "p", text: "A website that looks right in a demo and a web application that holds up under real traffic, real SEO requirements, and real feature growth are two different engineering problems. We build for the second one from day one — the same architecture decisions that make a site fast to ship also make it fast to load and easy for search engines to crawl." },
      { type: "h2", text: "What's included" },
      { type: "list", items: ["React / Next.js / Vue frontends", "Node.js, Python, or Go backends", "REST & GraphQL API design", "CMS integration (Sanity, Contentful, or headless WordPress)", "Performance tuning against Core Web Vitals"] },
      { type: "h2", text: "How we build" },
      { type: "p", text: "Every project starts with the same non-negotiables regardless of stack: server-rendered or prerendered pages for anything that needs to be indexed (we don't ship pure client-side SPAs for content that matters for search — we learned that lesson rebuilding our own site), CI from the first commit, and a performance budget that's checked in review, not discovered after launch. Backend architecture is chosen based on your team's existing skills and hosting constraints, not our preference." },
      { type: "h2", text: "Who this is for" },
      { type: "p", text: "Startups building a first product, companies replacing an aging or unmaintainable codebase, and teams that need a marketing site and application to share design language and infrastructure instead of living as two disconnected projects." },
      { type: "h2", text: "Common questions" },
      { type: "h3", text: "Can you take over an existing codebase instead of starting fresh?" },
      { type: "p", text: "Yes — most of our engagements start with a codebase audit, and a rewrite is only recommended when it's genuinely cheaper than incremental improvement." },
      { type: "h3", text: "Do you handle SEO as part of development, or is that separate?" },
      { type: "p", text: "It's built in by default: server rendering or static generation for indexable pages, structured data, sitemaps, and Core Web Vitals are part of the base build, not an add-on." },
      { type: "h3", text: "What if we need mobile apps alongside the web app?" },
      { type: "p", text: "We pair this with our Mobile App Development service and share API and auth layers across both, rather than building two disconnected backends." },
    ],
    faqs: [
      { q: "Can you take over an existing codebase instead of starting fresh?", a: "Yes — most engagements start with a codebase audit, and a rewrite is only recommended when it's genuinely cheaper than incremental improvement." },
      { q: "Do you handle SEO as part of development, or is that separate?", a: "It's built in by default: server rendering or static generation for indexable pages, structured data, sitemaps, and Core Web Vitals are part of the base build." },
      { q: "What if we need mobile apps alongside the web app?", a: "We pair this with our Mobile App Development service and share API and auth layers across both." },
    ],
  },
  {
    slug: "mobile-app-development",
    icon: "📱",
    title: "Mobile App Development Services",
    tagline: "Cross-platform and native apps that feel like native apps.",
    metaDescription: "Mobile app development services: React Native and Flutter apps for iOS and Android, with app store submission and backend API support.",
    benefits: ["React Native / Flutter", "iOS & Android deployment", "Push notifications & offline support", "App Store optimization", "In-app analytics"],
    cases: ["Consumer apps", "Enterprise mobile tools", "IoT dashboards", "Healthcare apps"],
    body: [
      { type: "p", text: "Most mobile apps don't need two separate native codebases — but some genuinely do. We help you make that call honestly before writing code, then build for it, rather than defaulting to whichever framework is fastest for us to staff." },
      { type: "h2", text: "What's included" },
      { type: "list", items: ["React Native or Flutter cross-platform builds", "iOS & Android store deployment", "Push notifications & offline-first support", "App Store / Play Store optimization", "In-app analytics and crash reporting"] },
      { type: "h2", text: "How we decide cross-platform vs. native" },
      { type: "p", text: "Cross-platform (React Native or Flutter) is the right default for most product apps — a single codebase, faster iteration, and performance that's indistinguishable from native for typical CRUD and content apps. We recommend fully native (Swift/Kotlin) only when an app is genuinely graphics- or hardware-intensive — real-time camera processing, complex animations, or deep OS-level integrations where the cross-platform bridge becomes the bottleneck." },
      { type: "h2", text: "Who this is for" },
      { type: "p", text: "Consumer apps needing to launch on both platforms simultaneously, enterprise teams building internal field-service or logistics tools, and IoT products that need a companion dashboard app." },
      { type: "h2", text: "Common questions" },
      { type: "h3", text: "React Native, Flutter, or native — which do you recommend?" },
      { type: "p", text: "React Native or Flutter for the large majority of product apps; native only when the app is genuinely hardware- or graphics-intensive. We'll tell you honestly if native isn't worth the extra cost for your case." },
      { type: "h3", text: "Do you handle App Store and Play Store submission?" },
      { type: "p", text: "Yes, including store listing optimization, screenshots, and handling review rejections — submission is part of the engagement, not a separate handoff." },
      { type: "h3", text: "Do you also build the backend, or just the app?" },
      { type: "p", text: "Both, typically — we pair this with Web Development for the API layer so the mobile app and any web dashboard share the same backend and auth." },
    ],
    faqs: [
      { q: "React Native, Flutter, or native — which do you recommend?", a: "React Native or Flutter for the large majority of product apps; native only when the app is genuinely hardware- or graphics-intensive." },
      { q: "Do you handle App Store and Play Store submission?", a: "Yes, including store listing optimization, screenshots, and handling review rejections." },
      { q: "Do you also build the backend, or just the app?", a: "Both, typically — paired with our Web Development service so the mobile app and any web dashboard share the same backend and auth." },
    ],
  },
  {
    slug: "devops-cicd",
    icon: "🔁",
    title: "DevOps & CI/CD Services",
    tagline: "From commit to production in minutes — not deployment day dread.",
    metaDescription: "DevOps & CI/CD services: automated pipelines, blue/green and canary deployments, and secrets management for GitHub Actions and Azure DevOps.",
    benefits: ["GitHub Actions / Azure DevOps pipelines", "Automated testing & security scanning", "Blue/green & canary deployments", "Rollback mechanisms", "Secrets management (Vault, AWS SSM)"],
    cases: ["Startup MVP pipelines", "Enterprise release trains", "Monorepo setups", "Multi-environment workflows"],
    body: [
      { type: "p", text: "If deploying your app is still a manual checklist someone runs on a Friday afternoon with their fingers crossed, that's the problem we're brought in to solve most often. A good CI/CD pipeline turns deployment from an event into a non-event." },
      { type: "h2", text: "What's included" },
      { type: "list", items: ["GitHub Actions or Azure DevOps pipeline design", "Automated testing & security scanning in the pipeline", "Blue/green and canary deployment strategies", "Rollback mechanisms that actually get tested", "Secrets management (Vault, AWS SSM, or OIDC federation)"] },
      { type: "h2", text: "How we design a pipeline" },
      { type: "p", text: "We build pipelines around one rule: a deploy that fails should fail loud and fail fast, and rolling back should be a button, not an incident. That means automated tests and security scanning gate every merge, deploys use blue/green or canary rollout for anything user-facing, and secrets never live as static credentials in the CI config — we default to short-lived, dynamically issued credentials." },
      { type: "h2", text: "Who this is for" },
      { type: "p", text: "Startups that need a first real pipeline instead of manual deploys, and larger teams whose existing pipeline has become a bottleneck — slow, flaky, or missing the safety nets that stop a bad deploy from becoming an incident." },
      { type: "h2", text: "Common questions" },
      { type: "h3", text: "Can you set this up without downtime on our existing repo?" },
      { type: "p", text: "Yes — pipelines are built and validated against a staging branch before they touch production deploys, so there's no cutover risk to your current release process." },
      { type: "h3", text: "Do you support GitLab or other CI platforms besides GitHub Actions and Azure DevOps?" },
      { type: "p", text: "Those two are our default recommendation, but the same design principles apply to GitLab CI, CircleCI, or Jenkins if that's your existing platform." },
      { type: "h3", text: "Is secrets management part of this, or a separate service?" },
      { type: "p", text: "It's included by default — every pipeline we build eliminates long-lived static credentials in favor of short-lived, dynamically issued tokens." },
    ],
    faqs: [
      { q: "Can you set this up without downtime on our existing repo?", a: "Yes — pipelines are built and validated against a staging branch before they touch production deploys." },
      { q: "Do you support platforms besides GitHub Actions and Azure DevOps?", a: "Those are our default recommendation, but the same principles apply to GitLab CI, CircleCI, or Jenkins." },
      { q: "Is secrets management part of this, or a separate service?", a: "It's included by default — every pipeline eliminates long-lived static credentials in favor of short-lived, dynamically issued tokens." },
    ],
  },
  {
    slug: "cloud-infrastructure",
    icon: "☁️",
    title: "Cloud Infrastructure Services (AWS / Azure / GCP)",
    tagline: "Well-architected infrastructure, not just a server and a prayer.",
    metaDescription: "Cloud infrastructure services on AWS, Azure, and GCP: Terraform IaC, high availability architecture, cost optimization, and cloud migration.",
    benefits: ["Terraform Infrastructure as Code", "Multi-region, HA architecture", "Cost optimization & FinOps", "Compliance & security posture", "Cloud migration & modernization"],
    cases: ["Cloud-native greenfield builds", "On-prem to cloud migration", "Disaster recovery setup", "Cost optimization audits"],
    body: [
      { type: "p", text: "Cloud infrastructure that works in a demo and infrastructure that survives a traffic spike, a region outage, or a compliance audit are built differently from the start. We design against the Well-Architected pillars — reliability, security, cost, operations, and performance — as defaults, not a checklist applied after something breaks." },
      { type: "h2", text: "What's included" },
      { type: "list", items: ["Terraform Infrastructure as Code, version-controlled and peer-reviewed", "Multi-region, high-availability architecture", "Cost optimization & FinOps review", "Compliance and security posture (encryption, least-privilege IAM, private networking)", "Cloud migration and modernization from on-prem or another provider"] },
      { type: "h2", text: "How we approach a build" },
      { type: "p", text: "Everything is defined as code from the first resource — no manual console changes that drift from what's documented. We size for your actual traffic and growth projections rather than defaulting to the largest instance type, and every architecture includes a documented disaster recovery posture with real RTO/RPO targets, not just \"we have backups.\"" },
      { type: "h2", text: "Who this is for" },
      { type: "p", text: "Greenfield products that want to get infrastructure right from the first deploy, and existing teams migrating off on-prem infrastructure or consolidating a sprawling, manually-managed cloud account into something reproducible and auditable." },
      { type: "h2", text: "Common questions" },
      { type: "h3", text: "Which cloud provider do you recommend?" },
      { type: "p", text: "It depends on your team's existing tooling, compliance requirements, and where your users are — we'll give you a direct recommendation after understanding your constraints, not a default answer." },
      { type: "h3", text: "Can you migrate us from on-prem or another cloud provider?" },
      { type: "p", text: "Yes — migration engagements start with a full inventory and dependency map before any cutover plan is written." },
      { type: "h3", text: "Do you do cost audits for infrastructure we already have?" },
      { type: "p", text: "Yes, standalone cost optimization audits are available without a full infrastructure rebuild — many clients start there." },
    ],
    faqs: [
      { q: "Which cloud provider do you recommend?", a: "It depends on your team's existing tooling, compliance requirements, and user location — we give a direct recommendation after understanding your constraints." },
      { q: "Can you migrate us from on-prem or another cloud provider?", a: "Yes — migration engagements start with a full inventory and dependency map before any cutover plan is written." },
      { q: "Do you do cost audits for infrastructure we already have?", a: "Yes, standalone cost optimization audits are available without a full infrastructure rebuild." },
    ],
  },
  {
    slug: "kubernetes-containerization",
    icon: "🐳",
    title: "Kubernetes & Containerization Services",
    tagline: "Production-grade clusters — not just kubectl apply and hope.",
    metaDescription: "Kubernetes and containerization services: EKS, AKS, and GKE cluster setup, Helm charts, service mesh, and autoscaling for production workloads.",
    benefits: ["EKS / AKS / GKE cluster setup", "Helm chart authoring", "Service mesh (Istio/Linkerd)", "Pod autoscaling (HPA/KEDA)", "cert-manager & Ingress NGINX"],
    cases: ["Microservices orchestration", "Multi-tenant SaaS platforms", "Batch processing workloads", "ML model serving"],
    body: [
      { type: "p", text: "Kubernetes is easy to get running and genuinely hard to run well — the gap between a cluster that works in a demo and one that survives a node failure, a bad deploy, and a security review is where most of our engineering time actually goes." },
      { type: "h2", text: "What's included" },
      { type: "list", items: ["EKS, AKS, or GKE cluster setup and hardening", "Helm chart authoring for your workloads", "Service mesh setup (Istio or Linkerd) where warranted", "Pod autoscaling (HPA and KEDA for event-driven workloads)", "cert-manager and Ingress NGINX configuration"] },
      { type: "h2", text: "How we build a cluster" },
      { type: "p", text: "We scope RBAC per-namespace and per-workload from the first deploy, set resource requests before touching autoscaling, and treat PodDisruptionBudgets and readiness probes as required, not optional. Every cluster ships with an observability stack (Prometheus + Grafana at minimum) wired in from day one, and an upgrade strategy that's been rehearsed, not improvised at the next Kubernetes release." },
      { type: "h2", text: "Who this is for" },
      { type: "p", text: "Teams running real microservices that have outgrown a single VM or App Service, multi-tenant SaaS platforms that need workload isolation, and teams running batch or ML workloads that benefit from Kubernetes' scheduling and autoscaling rather than fixed compute." },
      { type: "h2", text: "Common questions" },
      { type: "h3", text: "Is Kubernetes overkill for us?" },
      { type: "p", text: "Often, yes — and we'll tell you that directly during scoping. If your workload is a handful of services with predictable load, a simpler platform (App Service, ECS, Cloud Run) is usually the right call. Kubernetes earns its complexity at real microservice or multi-tenant scale." },
      { type: "h3", text: "Do you support all three major managed Kubernetes services?" },
      { type: "p", text: "Yes — EKS, AKS, and GKE, chosen based on where your other infrastructure already lives rather than a default preference." },
      { type: "h3", text: "Do you provide ongoing support after the cluster is live?" },
      { type: "p", text: "Yes, through our Monitoring & Observability service and ongoing retainer support — a cluster we hand off with no ongoing relationship isn't how we scope these engagements." },
    ],
    faqs: [
      { q: "Is Kubernetes overkill for us?", a: "Often, yes — for predictable, small-scale workloads a simpler platform (App Service, ECS, Cloud Run) is usually the right call. Kubernetes earns its complexity at real microservice or multi-tenant scale." },
      { q: "Do you support all three major managed Kubernetes services?", a: "Yes — EKS, AKS, and GKE, chosen based on where your other infrastructure already lives." },
      { q: "Do you provide ongoing support after the cluster is live?", a: "Yes, through our Monitoring & Observability service and ongoing retainer support." },
    ],
  },
  {
    slug: "product-design-strategy",
    icon: "📐",
    title: "Product Design & Strategy Services",
    tagline: "Product design that bridges business goals with user needs.",
    metaDescription: "Product design and strategy services: roadmapping, competitive analysis, and rapid prototyping — from concept map to clickable, testable prototype.",
    benefits: ["Product roadmapping", "Jobs-to-be-done framework", "Competitive analysis", "Rapid prototyping", "Usability testing"],
    cases: ["MVP definition", "Feature prioritization", "Rebrand & redesign", "B2B SaaS products"],
    body: [
      { type: "p", text: "Most product decisions that go wrong don't fail because of bad execution — they fail because the wrong thing got built well. Product strategy is the layer that sits before design and engineering, making sure the roadmap reflects what users actually need and what the business can actually sustain, not just what's loudest in the last stakeholder meeting." },
      { type: "h2", text: "What's included" },
      { type: "list", items: ["Product roadmapping", "Jobs-to-be-done framework for feature prioritization", "Competitive analysis", "Rapid prototyping", "Usability testing with target users"] },
      { type: "h2", text: "How we approach product strategy" },
      { type: "p", text: "We use a jobs-to-be-done lens rather than a feature wishlist: what is the user actually trying to accomplish, and what's the smallest thing we can build and test that accomplishes it. Competitive analysis isn't a slide deck exercise — it directly informs what to deliberately not build, which is usually more valuable than the list of what to build. Every strategy engagement ends in a testable prototype, not just a roadmap document that nobody revisits." },
      { type: "h2", text: "Who this is for" },
      { type: "p", text: "Founders defining an MVP who need to cut scope with confidence instead of guessing, product teams debating a rebrand or redesign who need outside perspective, and B2B SaaS teams whose roadmap has become a backlog of every customer request rather than a coherent strategy." },
      { type: "h2", text: "Common questions" },
      { type: "h3", text: "Is this the same as UI/UX design?" },
      { type: "p", text: "It's the layer before it — strategy and prioritization first, then our UI/UX Design service handles the interface itself. Many engagements combine both, but they're scoped separately because strategy work is often needed even when the interface itself doesn't need to change." },
      { type: "h3", text: "Do you help decide what NOT to build?" },
      { type: "p", text: "That's usually the most valuable part of the engagement — a clear, defensible list of what's deliberately out of scope for v1 is often worth more than the feature list itself." },
      { type: "h3", text: "What does the final deliverable look like?" },
      { type: "p", text: "A prioritized roadmap, competitive analysis, and a clickable prototype validated with real target users — not just a strategy document." },
    ],
    faqs: [
      { q: "Is this the same as UI/UX design?", a: "It's the layer before it — strategy and prioritization first, then our UI/UX Design service handles the interface itself." },
      { q: "Do you help decide what NOT to build?", a: "Yes — a clear, defensible list of what's deliberately out of scope for v1 is often the most valuable part of the engagement." },
      { q: "What does the final deliverable look like?", a: "A prioritized roadmap, competitive analysis, and a clickable prototype validated with real target users." },
    ],
  },
  {
    slug: "monitoring-observability",
    icon: "📊",
    title: "Monitoring & Observability Services",
    tagline: "Full-stack observability so you're never flying blind.",
    metaDescription: "Monitoring and observability services: Prometheus and Grafana dashboards, log aggregation, distributed tracing, and on-call alerting for production systems.",
    benefits: ["Prometheus & Grafana stack", "Log aggregation (Loki, ELK)", "Distributed tracing (Jaeger/Tempo)", "Uptime & SSL monitoring", "On-call alerting (PagerDuty, OpsGenie)"],
    cases: ["Production incident reduction", "SLA reporting", "Performance optimization", "Cost anomaly detection"],
    body: [
      { type: "p", text: "The teams that get paged at 3am and know exactly what's wrong within minutes aren't lucky — they invested in observability before the incident, not during it. We build monitoring as a first-class part of infrastructure, not a dashboard bolted on after the first outage." },
      { type: "h2", text: "What's included" },
      { type: "list", items: ["Prometheus & Grafana stack setup", "Log aggregation (Loki or the ELK stack)", "Distributed tracing (Jaeger or Tempo)", "Uptime and SSL certificate monitoring", "On-call alerting (PagerDuty or OpsGenie) with real runbooks"] },
      { type: "h2", text: "How we design observability" },
      { type: "p", text: "We instrument the three pillars — metrics, logs, and traces — together, because an incident that only has logs or only has metrics takes far longer to diagnose than one with all three correlated. Alerts are written against symptoms users would notice (elevated error rate, degraded latency) rather than raw infrastructure metrics that page someone for a CPU spike nobody needs to act on. Every alert ships with a runbook, because an alert with no next step just trains people to ignore pages." },
      { type: "h2", text: "Who this is for" },
      { type: "p", text: "Teams that have had a production incident take too long to diagnose, teams with SLA commitments that need real reporting instead of a spreadsheet, and anyone whose cloud bill has an unexplained spike they can't currently trace to a cause." },
      { type: "h2", text: "Common questions" },
      { type: "h3", text: "We already have some monitoring — can you build on top of it?" },
      { type: "p", text: "Usually yes — most engagements start by auditing existing dashboards and alerts, keeping what works, and filling the actual gaps rather than ripping out and replacing everything." },
      { type: "h3", text: "Do you set up on-call rotations too, or just the tooling?" },
      { type: "p", text: "We configure the alerting and escalation policies in your on-call platform; how you staff the rotation itself is your call, but we'll advise on structuring it sanely." },
      { type: "h3", text: "Can this help explain unexpected cloud cost spikes?" },
      { type: "p", text: "Yes — cost anomaly detection is one of the more common reasons teams bring us in, often paired with our Cloud Infrastructure service for the fix once the cause is found." },
    ],
    faqs: [
      { q: "We already have some monitoring — can you build on top of it?", a: "Usually yes — engagements start by auditing existing dashboards and alerts, keeping what works, and filling the actual gaps." },
      { q: "Do you set up on-call rotations too, or just the tooling?", a: "We configure alerting and escalation policies in your on-call platform; staffing the rotation is your call, but we'll advise on structuring it." },
      { q: "Can this help explain unexpected cloud cost spikes?", a: "Yes — cost anomaly detection is a common reason teams bring us in, often paired with our Cloud Infrastructure service for the fix." },
    ],
  },
];

const SERVICE_SLUG_BY_TITLE = {
  "UI/UX Design": "ui-ux-design",
  "Product Design & Strategy": "product-design-strategy",
  "Web Development": "web-development",
  "Mobile App Development": "mobile-app-development",
  "DevOps & CI/CD": "devops-cicd",
  "Cloud Infrastructure (AWS / Azure / GCP)": "cloud-infrastructure",
  "Kubernetes & Containerization": "kubernetes-containerization",
  "Monitoring & Observability": "monitoring-observability",
};

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const service = SERVICE_PAGES.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="page" style={{ paddingTop: 70 }}>
        <section>
          <h1 className="section-title">Service not found</h1>
          <p className="section-sub">This service page may have been moved or removed.</p>
          <Link to="/services" className="btn-primary" style={{ display: "inline-flex", marginTop: 16 }}>← Back to Services</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 70 }}>
      <article>
        <section style={{ paddingBottom: 0 }}>
          <Link to="/services" style={{ color: "var(--orange)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>← Back to Services</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20 }}>
            <div className="card-icon" style={{ margin: 0 }}>{service.icon}</div>
            <h1 className="section-title" style={{ maxWidth: 780, margin: 0 }}>{service.title}</h1>
          </div>
          <p className="section-sub">{service.tagline}</p>
        </section>
        <section style={{ maxWidth: 780 }}>
          {service.body.map(renderBlock)}
        </section>
        <div className="cta-band">
          <h2>Ready to talk <span style={{ color: "var(--orange)" }}>{service.title.replace(" Services", "")}?</span></h2>
          <p>Book a free scope call — we'll map this to your actual requirements, no generic proposal.</p>
          <div className="cta-band-actions">
            <Link to="/contact" className="btn-primary">Book Free Scope Call</Link>
          </div>
        </div>
      </article>
    </div>
  );
};

const ServicesPage = () => (
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
              {SERVICE_SLUG_BY_TITLE[s.title] && (
                <Link to={`/services/${SERVICE_SLUG_BY_TITLE[s.title]}`} style={{ display: "inline-block", marginTop: 20, color: "var(--orange)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
                  Learn more →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    ))}

    <div className="cta-band">
      <h2>Not sure what you need?<br /><span style={{ color: "var(--orange)" }}>Let's figure it out together.</span></h2>
      <p>Book a free 30-min scope call. We'll map the right services to your goals.</p>
      <div className="cta-band-actions">
        <Link to="/contact" className="btn-primary">Book Free Scope Call</Link>
      </div>
    </div>
  </div>
);

/* ─── PROCESS PAGE ────────────────────────────────────────── */
const ProcessPage = () => (
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
        <Link to="/contact" className="btn-primary">Start the Process</Link>
      </div>
    </div>
  </div>
);

/* ─── BLOG PAGE ───────────────────────────────────────────── */
export const BLOG_POSTS = [
  {
    slug: "kubernetes-production-lessons",
    tag: "DevOps", icon: "🐳",
    title: "Kubernetes in Production: 10 Things We Wish We Knew Earlier",
    excerpt: "Hard-won lessons from running 20+ K8s clusters in production — from RBAC gotchas to HPA tuning.",
    author: "3D³ Team", date: "Apr 28, 2026", read: "8 min read",
    body: [
      { type: "p", text: "Running a handful of Kubernetes clusters in a workshop is nothing like running twenty of them across client environments with real traffic, real on-call rotations, and real 2am pages. Here are the lessons that cost us the most time to learn — so you don't have to relearn them the hard way." },
      { type: "h3", text: "1. RBAC will bite you before networking does" },
      { type: "p", text: "Most teams over-invest in NetworkPolicy tuning early and under-invest in RBAC. In practice, the incidents that actually hurt come from over-permissioned service accounts — a CI pipeline with cluster-admin, a debugging pod left with a token that can read every Secret in the namespace. Scope roles per-namespace and per-workload from day one; retrofitting RBAC onto a live cluster is miserable." },
      { type: "h3", text: "2. Set resource requests before you ever touch autoscaling" },
      { type: "p", text: "The Horizontal Pod Autoscaler and cluster autoscaler are only as good as the requests/limits you feed them. We've seen HPA configs that looked perfect on paper thrash uselessly because requests were left at defaults. Get requests right first — based on actual observed usage, not guesses — then layer autoscaling on top." },
      { type: "h3", text: "3. Liveness probes without readiness probes cause cascading restarts" },
      { type: "p", text: "A liveness probe that fires during a slow dependency call will kill and restart a perfectly healthy pod, often making an already-degraded service worse. Always pair liveness with a readiness probe, and make liveness checks dumb and cheap — they should only catch true deadlocks, not slowness." },
      { type: "h3", text: "4. PodDisruptionBudgets save you during node upgrades, not just deploys" },
      { type: "p", text: "Teams usually add PDBs to protect against rolling deploys and forget they're just as critical during node drains for cluster upgrades or spot-instance reclamation. No PDB means an upgrade can take your whole service down at once instead of gradually." },
      { type: "h3", text: "5. etcd performance is your ceiling, not compute" },
      { type: "p", text: "Clusters that feel sluggish are rarely CPU-starved — they're usually waiting on etcd. Watch etcd disk latency and object counts (especially Events and CRDs) before you reach for bigger node pools." },
      { type: "h3", text: "6. Namespace-per-environment beats cluster-per-environment until it doesn't" },
      { type: "p", text: "Separate clusters per environment cost more but buy real isolation — a noisy-neighbor incident or a bad CRD install in staging can't touch production. We move teams to cluster-per-environment the moment compliance or blast-radius requirements show up; before that, namespaces are fine." },
      { type: "h3", text: "7. HPA on custom metrics needs a metrics pipeline you actually trust" },
      { type: "p", text: "Scaling on CPU is easy. Scaling on queue depth or request latency requires a metrics pipeline (usually Prometheus + an adapter) that itself needs to be highly available — if your metrics source flaps, your autoscaler flaps with it." },
      { type: "h3", text: "8. Image pull policy and registry rate limits will surprise you at the worst time" },
      { type: "p", text: "`imagePullPolicy: Always` on every deploy across a large node pool can hit registry rate limits during a mass rollout or node replacement event. Pin digests where you can and understand your registry's throttling behavior before you scale past a few dozen nodes." },
      { type: "h3", text: "9. Observability has to include the control plane, not just workloads" },
      { type: "p", text: "It's easy to instrument application pods and forget the control plane itself — API server latency, scheduler queue depth, controller-manager errors. When something feels globally slow, that's usually where the answer is." },
      { type: "h3", text: "10. Your upgrade strategy is a design decision, not an afterthought" },
      { type: "p", text: "Decide up front whether you're doing in-place minor upgrades, blue-green cluster replacement, or something in between — and rehearse it in a non-production cluster. The teams that get burned are the ones treating the first real upgrade as the rehearsal." },
      { type: "p", text: "None of this is exotic — it's just what breaks first when a cluster goes from a demo to a system other people depend on. If you're heading into that transition, our Kubernetes & Containerization service page has the checklist we actually run engagements against." },
    ],
  },
  {
    slug: "saas-dashboard-design-system",
    tag: "Design", icon: "🎨",
    title: "Why Your SaaS Dashboard Needs a Design System (Not Just Figma Screens)",
    excerpt: "The difference between a component library and a design system — and why it matters at scale.",
    author: "3D³ Team", date: "Apr 15, 2026", read: "6 min read",
    body: [
      { type: "p", text: "Almost every SaaS product we're brought in to redesign has the same starting point: a beautiful set of Figma screens, and an engineering team quietly rebuilding the same button component slightly differently on every page. That gap — between what design ships and what a design system actually is — is where most product consistency problems live." },
      { type: "h2", text: "A component library is not a design system" },
      { type: "p", text: "A component library is an inventory: buttons, inputs, cards, modals. A design system is the set of rules that decides when each of those gets used, what states they support, and how they compose — spacing scales, type hierarchy, color tokens tied to meaning (not just hex values), and accessibility baked in at the component level rather than patched on per screen." },
      { type: "h2", text: "Where teams feel the pain first" },
      { type: "p", text: "It's rarely the homepage that reveals the gap — it's the fortieth settings page, built by the third engineer to touch that part of the app, none of whom talked to each other. Suddenly there are four slightly different dropdown styles, three different error-state patterns, and a support queue full of 'this looks broken' tickets that are really consistency bugs." },
      { type: "h2", text: "Tokens are the part everyone skips" },
      { type: "p", text: "Color tokens, spacing tokens, and type tokens are the least glamorous part of a design system and the highest-leverage. When 'danger' is a token instead of a hardcoded red hex value, a rebrand or a dark-mode launch is a config change instead of a multi-sprint migration. We've seen six-week rebrand timelines shrink to three days once tokens existed." },
      { type: "h2", text: "Documentation is the product, not a byproduct" },
      { type: "p", text: "A design system that lives only in Figma with no engineering-facing documentation degrades within two quarters — engineers under deadline pressure will always reach for the fastest path, which is copy-pasting an existing component and tweaking it. Usage guidelines, do/don't examples, and accessibility notes need to live next to the code, not in a separate design tool nobody outside design opens." },
      { type: "h2", text: "When it's worth the investment" },
      { type: "p", text: "If you're a five-screen MVP, skip this — use an existing library like shadcn or MUI and move fast. The inflection point is usually around 15-20 screens or your second designer/engineer pair working on the UI in parallel. That's when inconsistency starts compounding faster than any team can manually catch it in review." },
      { type: "p", text: "We build design systems as part of our UI/UX & Product Design engagements specifically so the tokens and components ship in lockstep with the engineering build — not as a separate deliverable that goes stale the day after handoff." },
    ],
  },
  {
    slug: "terraform-vs-pulumi-2026",
    tag: "Cloud", icon: "☁️",
    title: "Terraform vs. Pulumi in 2026: Which IaC Tool Should You Choose?",
    excerpt: "An honest comparison from engineers who've used both in production environments.",
    author: "3D³ Team", date: "Mar 30, 2026", read: "10 min read",
    body: [
      { type: "p", text: "We run both Terraform and Pulumi in production across different client environments, and the honest answer to 'which is better' is: it depends on your team's existing skills and how much you value HCL's constraints versus a general-purpose language's flexibility. Here's how we actually decide." },
      { type: "h2", text: "State management: functionally similar, operationally different" },
      { type: "p", text: "Both tools track infrastructure state and support remote backends with locking. Terraform's state format and CLI (plan/apply) are more battle-tested and better understood by a wider hiring pool. Pulumi's state model is conceptually the same but its debugging tools around drift detection have caught up meaningfully in the last two years." },
      { type: "h2", text: "The real differentiator: HCL vs. a real programming language" },
      { type: "p", text: "Terraform's HCL is declarative and intentionally limited — that's a feature, not a bug, for teams who want infrastructure code to be readable by anyone, including auditors and less senior engineers. Pulumi lets you write infrastructure in TypeScript, Python, or Go, which means real loops, real conditionals, and real unit tests — powerful, but it also means an engineer can write infrastructure code that's clever in ways that make it harder for the next person to reason about." },
      { type: "h2", text: "Module ecosystem still favors Terraform" },
      { type: "p", text: "The Terraform Registry has a significantly larger set of mature, community-maintained modules for common patterns (VPC setups, EKS clusters, RDS instances) than Pulumi's package ecosystem. For teams building on well-trodden cloud patterns, that maturity gap saves real engineering time." },
      { type: "h2", text: "Where Pulumi wins outright" },
      { type: "p", text: "If your infrastructure logic needs genuine computation — dynamically generating dozens of near-identical resources based on a config file, sharing validation logic between your app code and your infra code, or writing real unit tests for infrastructure logic — Pulumi's use of a general-purpose language is a legitimate advantage that HCL's `for_each` and `dynamic` blocks can only approximate." },
      { type: "h2", text: "Our actual recommendation" },
      { type: "p", text: "Default to Terraform. Its constraints are usually a feature for team-wide consistency, its hiring pool is larger, and its module ecosystem will save you time on standard cloud patterns. Reach for Pulumi specifically when your infrastructure requirements are genuinely programmatic — multi-tenant platforms generating per-customer infrastructure, or teams that want infra and app code sharing a language and test suite. Don't choose Pulumi just because TypeScript feels more familiar than HCL; that preference alone isn't worth giving up the ecosystem maturity." },
      { type: "p", text: "We help teams design and implement both — see our DevOps, Cloud & Kubernetes services if you're weighing this decision for an upcoming build." },
    ],
  },
  {
    slug: "api-design-mistakes",
    tag: "Development", icon: "⚡",
    title: "The API Design Decisions That Will Haunt You in 18 Months",
    excerpt: "Avoid these common REST API mistakes before they become breaking changes your clients hate.",
    author: "3D³ Team", date: "Mar 12, 2026", read: "7 min read",
    body: [
      { type: "p", text: "Most API design mistakes don't hurt on day one — they hurt eighteen months later, when you have real external consumers and every 'fix' is now a breaking change. Here are the decisions we see teams regret most, almost always too late to cheaply undo." },
      { type: "h3", text: "Returning bare arrays instead of enveloped responses" },
      { type: "p", text: "`GET /users` returning a raw JSON array seems clean until you need to add pagination metadata, a total count, or a cursor — and now every client parsing a top-level array breaks. Envelope your list responses from day one: `{ data: [...], meta: { total, cursor } }` costs nothing early and saves a breaking version bump later." },
      { type: "h3", text: "No API versioning strategy at all" },
      { type: "p", text: "'We'll version it when we need to' means you'll be retrofitting version headers or URL prefixes onto live traffic with real consumers who didn't sign up for a migration. Decide your versioning approach — URL path, header, or content negotiation — before your first external consumer, even if v1 is the only version that will ever exist." },
      { type: "h3", text: "Leaking database schema directly into response shapes" },
      { type: "p", text: "Serializing your ORM models directly is fast to build and creates a permanent coupling between your database schema and your public contract. A column rename that should take ten minutes now requires a deprecation cycle because it's technically a breaking API change." },
      { type: "h3", text: "Inconsistent error shapes across endpoints" },
      { type: "p", text: "If `/orders` returns `{ error: \"message\" }` and `/users` returns `{ errors: [{ code, detail }] }`, every client integration has to special-case error handling per endpoint. Pick one error envelope shape — ideally following an existing convention like RFC 7807 — and enforce it at the framework level so individual endpoints can't drift." },
      { type: "h3", text: "Synchronous endpoints for what should be async operations" },
      { type: "p", text: "Long-running operations (report generation, bulk imports, video processing) forced into a synchronous request/response cycle eventually hit timeout walls as data volume grows. Model these as async from the start — return a job ID and a status endpoint — even if the first implementation just does the work inline before responding." },
      { type: "h3", text: "No rate-limit headers or documented limits" },
      { type: "p", text: "Silently throttling or rejecting requests without `X-RateLimit-*` headers means every integrator finds your limits by hitting them in production, usually during their busiest traffic period. Publish limits and surface them in headers from the first external release." },
      { type: "p", text: "The common thread: almost none of these cost meaningfully more time to do right the first time. They cost real time — and real client goodwill — to fix after the API has external consumers depending on the shape you shipped. If you're scoping a new API, our Web, API & Mobile Dev team can review the contract before it ships, not after." },
    ],
  },
  {
    slug: "secrets-management-cicd",
    tag: "DevOps", icon: "🔒",
    title: "Secrets Management: The Right Way to Handle Credentials in CI/CD",
    excerpt: "A deep dive into Vault, AWS SSM, and GitHub OIDC — and when to use each.",
    author: "3D³ Team", date: "Feb 28, 2026", read: "9 min read",
    body: [
      { type: "p", text: "Long-lived static credentials sitting in CI environment variables are still, by far, the most common secrets-management mistake we find during security reviews — and they're also the easiest to fix. Here's how we think about picking the right approach for a given pipeline." },
      { type: "h2", text: "The baseline: stop storing long-lived credentials at all" },
      { type: "p", text: "The single highest-leverage change most teams can make is eliminating long-lived static credentials from CI entirely in favor of short-lived, dynamically issued tokens scoped to exactly what a given job needs. Everything below is a variation on that theme." },
      { type: "h2", text: "GitHub Actions OIDC: the right default for cloud deploys" },
      { type: "p", text: "If your CI runs in GitHub Actions and deploys to AWS, Azure, or GCP, OIDC federation should be your default. Instead of storing a static cloud credential as a repo secret, your workflow exchanges a short-lived OIDC token for temporary cloud credentials scoped to a specific role, with no long-lived secret to leak, rotate, or accidentally log." },
      { type: "h2", text: "AWS SSM Parameter Store / Secrets Manager: for application runtime secrets" },
      { type: "p", text: "For secrets your running application needs — database passwords, third-party API keys — SSM Parameter Store (with SecureString) or Secrets Manager are the right call when you're already AWS-native. Secrets Manager adds automatic rotation for supported services (RDS, in particular) which SSM doesn't natively provide." },
      { type: "h2", text: "HashiCorp Vault: for multi-cloud or dynamic-secret requirements" },
      { type: "p", text: "Vault earns its operational complexity when you need dynamic secrets — database credentials generated per-request with automatic expiry, not static passwords rotated on a schedule — or when you're managing secrets across multiple clouds and don't want per-provider tooling. For a single-cloud shop, Vault's operational overhead often isn't worth it over native tooling." },
      { type: "h2", text: "The mistake we see even security-conscious teams make" },
      { type: "p", text: "Teams that get the initial setup right — OIDC, Secrets Manager, Vault, whatever fits — often forget to close the loop on old credentials. A migration to short-lived tokens that leaves the previous static credential active 'just in case' isn't a completed migration; it's an active vulnerability with a false sense of security layered on top." },
      { type: "h2", text: "A practical checklist" },
      { type: "list", items: [
        "No static cloud credentials in CI — use OIDC federation wherever the CI platform supports it",
        "Runtime application secrets live in a managed secret store, never in environment files committed to a repo",
        "Every secret has an owner and a rotation policy, even if rotation is manual",
        "Old credentials are actually revoked, not just replaced, once a migration ships",
        "CI logs are audited for accidental secret exposure — most leaks happen via debug output, not the secret store itself",
      ] },
      { type: "p", text: "We build this into every CI/CD pipeline we set up as part of our DevOps & CI/CD engagements — it's cheaper to design in from the first pipeline than to retrofit once a hundred jobs already depend on the old pattern." },
    ],
  },
  {
    slug: "idea-to-mvp-six-weeks",
    tag: "Startup", icon: "🚀",
    title: "From Idea to MVP in 6 Weeks: Our Actual Process",
    excerpt: "The exact playbook we use to take a product brief to a production deployment in six weeks.",
    author: "3D³ Team", date: "Feb 10, 2026", read: "12 min read",
    body: [
      { type: "p", text: "Six weeks from a product brief to a production deployment sounds aggressive until you see the breakdown. It's not about moving fast and breaking things — it's about ruthlessly scoping what actually needs to exist for a real first version, and refusing to let the wrong things eat the timeline." },
      { type: "h2", text: "Week 1: Discovery and scope-cutting" },
      { type: "p", text: "The first week is spent doing less than founders expect — mostly saying no. We map the core user journey that has to work end-to-end, and explicitly list every feature that sounds important but isn't required to validate the core hypothesis. This list becomes the v1.1 backlog, not the MVP scope." },
      { type: "h2", text: "Week 2: Design system and architecture in parallel" },
      { type: "p", text: "Design and engineering start simultaneously, not sequentially. Design produces a lightweight token set and the core screens; engineering stands up the architecture — auth, database schema, CI/CD skeleton, hosting — so that by week 3, design handoff doesn't stall waiting for infrastructure to exist." },
      { type: "h2", text: "Weeks 3–4: Core build" },
      { type: "p", text: "This is where most of the calendar goes, and it's deliberately unglamorous: the core user journey, built end-to-end, with real data and real auth from day one — never a mocked-data prototype that gets rebuilt later. Daily standups catch scope drift before it costs a sprint." },
      { type: "h2", text: "Week 5: Hardening, not new features" },
      { type: "p", text: "Week 5 is a hard rule, not a suggestion: no new features. Error states, empty states, loading states, basic monitoring, and a first pass of real user testing with 5-10 target users. This is the week that determines whether launch week is calm or chaotic." },
      { type: "h2", text: "Week 6: Deploy, monitor, hand off" },
      { type: "p", text: "Production deployment with observability already wired in — not bolted on after something breaks — plus a short handoff period where the founding team can ship their own small changes with support on standby. An MVP that the founder can't safely iterate on alone isn't actually done." },
      { type: "h2", text: "What makes six weeks realistic instead of a sales pitch" },
      { type: "p", text: "The honest answer: ruthless scope discipline in week 1, and refusing to let 'nice to have' features regain their spot on the board once cut. Almost every MVP timeline that blows past its estimate does so because scope crept back in during weeks 3-4, not because the engineering was slower than expected." },
      { type: "p", text: "If you're scoping a build like this, our Process page walks through the full delivery framework, and our Pricing page has the starting ranges for engagements at this scope." },
    ],
  },
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
        {BLOG_POSTS.map((p) => (
          <Link to={`/blog/${p.slug}`} className="card blog-card" key={p.slug} style={{ padding: 0, textDecoration: "none", color: "inherit" }}>
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
          </Link>
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

/* ─── BLOG POST PAGE ──────────────────────────────────────── */
const renderBlock = (block, i) => {
  if (block.type === "h2") return <h2 key={i} style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.4rem", margin: "36px 0 14px" }}>{block.text}</h2>;
  if (block.type === "h3") return <h3 key={i} style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1.15rem", margin: "28px 0 10px" }}>{block.text}</h3>;
  if (block.type === "list") {
    return (
      <ul key={i} style={{ margin: "0 0 18px", paddingLeft: 22, color: "var(--grey-300)", lineHeight: 1.8 }}>
        {block.items.map((item, j) => <li key={j}>{item}</li>)}
      </ul>
    );
  }
  return <p key={i} style={{ margin: "0 0 18px", color: "var(--grey-300)", lineHeight: 1.8, fontSize: "1.02rem" }}>{block.text}</p>;
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="page" style={{ paddingTop: 70 }}>
        <section>
          <h1 className="section-title">Post not found</h1>
          <p className="section-sub">This article may have been moved or removed.</p>
          <Link to="/blog" className="btn-primary" style={{ display: "inline-flex", marginTop: 16 }}>← Back to Blog</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 70 }}>
      <article>
        <section style={{ paddingBottom: 0 }}>
          <Link to="/blog" style={{ color: "var(--orange)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>← Back to Blog</Link>
          <div className="section-label" style={{ marginTop: 20 }}>{post.tag}</div>
          <h1 className="section-title" style={{ maxWidth: 780 }}>{post.title}</h1>
          <div className="blog-meta" style={{ marginTop: 16 }}>
            <span>{post.author}</span>
            <span>📅 {post.date}</span>
            <span>⏱ {post.read}</span>
          </div>
        </section>
        <section style={{ maxWidth: 780 }}>
          {post.body.map(renderBlock)}
        </section>
        <div className="cta-band">
          <h2>Ready to build something <span style={{ color: "var(--orange)" }}>exceptional?</span></h2>
          <p>Tell us about your project — we'll respond within 24 hours.</p>
          <div className="cta-band-actions">
            <Link to="/contact" className="btn-primary">Start a Conversation</Link>
          </div>
        </div>
      </article>
    </div>
  );
};

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
              <a href="https://calendly.com/skmathuria19/30min" target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ width: "100%", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>Book on Calendly →</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─── CASE STUDIES PAGE ───────────────────────────────────── */
const caseStudies = [
  {
    icon: "💳", tag: "FinTech", company: "FinStack",
    title: "From idea to production in 6 weeks",
    challenge: "FinStack needed a production-ready platform fast, without stitching together separate agencies for design, development, and DevOps.",
    solution: "3D³ ran design, development, and deployment as one team — Figma to Kubernetes cluster, with weekly demos throughout.",
    result: "Launched in 6 weeks. DevOps automation now saves 40+ engineering hours every month.",
    quote: "The DevOps setup alone saved us 40+ hours every month. Absolute professionals.",
    person: "Arjun Mehta, CEO"
  },
  {
    icon: "🛒", tag: "E-Commerce", company: "CloudRetail",
    title: "Zero-downtime Kubernetes migration",
    challenge: "CloudRetail's infrastructure couldn't handle traffic spikes, and monitoring was minimal.",
    solution: "Migrated to a Kubernetes-native architecture with full observability (Prometheus + Grafana) and autoscaling.",
    result: "Zero downtime during migration. Infrastructure costs dropped 35% afterward.",
    quote: "Zero downtime, full monitoring, and our infra costs dropped by 35%.",
    person: "Sarah Williams, CTO"
  },
  {
    icon: "🎓", tag: "EdTech", company: "EdTechPro",
    title: "Design-to-launch, 3 weeks ahead of schedule",
    challenge: "EdTechPro needed a polished, investor-ready product experience under a tight fundraising deadline.",
    solution: "Ran design and development in parallel sprints with continuous stakeholder review.",
    result: "Shipped 3 weeks ahead of schedule with a launch-ready, investor-facing product.",
    quote: "The design work was stunning, but what really impressed us was how quickly they shipped.",
    person: "Priya Nair, Founder"
  },
];

const CaseStudiesPage = () => (
  <div className="page" style={{ paddingTop: 70 }}>
    <section>
      <div className="section-label">Case Studies</div>
      <h1 className="section-title">Real projects.<br /><span style={{ color: "var(--orange)" }}>Real results.</span></h1>
      <p className="section-sub">A closer look at how we've taken products from idea to production.</p>
    </section>
    {caseStudies.map((c) => (
      <section key={c.company} style={{ paddingTop: 0, paddingBottom: 60 }}>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="card-icon" style={{ margin: 0, width: 56, height: 56, fontSize: "1.8rem" }}>{c.icon}</div>
            <div>
              <div className="service-badge" style={{ marginBottom: 6 }}>{c.tag}</div>
              <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.4rem" }}>{c.company} — {c.title}</h2>
            </div>
          </div>
          <div className="grid-3" style={{ marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--grey-500)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Challenge</div>
              <p style={{ fontSize: "0.9rem", color: "var(--grey-300)", lineHeight: 1.65 }}>{c.challenge}</p>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--grey-500)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Solution</div>
              <p style={{ fontSize: "0.9rem", color: "var(--grey-300)", lineHeight: 1.65 }}>{c.solution}</p>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--orange)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Result</div>
              <p style={{ fontSize: "0.9rem", color: "var(--grey-300)", lineHeight: 1.65 }}>{c.result}</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: 20, fontStyle: "italic", color: "var(--grey-300)", fontSize: "0.92rem" }}>
            "{c.quote}" <span style={{ fontStyle: "normal", color: "var(--grey-500)" }}>— {c.person}</span>
          </div>
        </div>
      </section>
    ))}
    <div className="cta-band">
      <h2>Want results like <span style={{ color: "var(--orange)" }}>these?</span></h2>
      <p>Let's talk about what you're building.</p>
      <div className="cta-band-actions">
        <Link to="/contact" className="btn-primary">Start a Conversation</Link>
      </div>
    </div>
  </div>
);

/* ─── DOCUMENTATION PAGE ──────────────────────────────────── */
export const FAQ_ITEMS = [
  { q: "What's included in a typical engagement?", a: "Depending on scope: discovery & design, full-stack development, CI/CD pipeline setup, cloud infrastructure, and post-launch monitoring. See our Process page for the full breakdown." },
  { q: "What tech stack do you use?", a: "React/Next.js/Vue on the frontend, Node.js/Python/Go on the backend, Kubernetes on AWS/Azure/GCP for infrastructure, and Terraform for IaC. We adapt to your existing stack when needed." },
  { q: "Do you provide post-launch support?", a: "Yes — every engagement includes a support window post-launch, and ongoing retainers are available for continued feature work and monitoring." },
  { q: "How do I report an issue or get help?", a: "Email support@3dstack.in or use the contact form — we respond within 24 hours." },
  { q: "Where can I find pricing details?", a: "See our Pricing page for starting ranges, or book a free strategy call for a custom quote." },
  { q: "Do you sign NDAs before scoping calls?", a: "Yes, on request — just mention it when you book your call or reach out via the contact form." },
];

const DocumentationPage = () => (
  <div className="page" style={{ paddingTop: 70 }}>
    <section>
      <div className="section-label">Documentation</div>
      <h1 className="section-title">How we work,<br /><span style={{ color: "var(--orange)" }}>answered.</span></h1>
      <p className="section-sub">Common questions about engagements, tech stack, and support. Don't see yours — just ask.</p>
    </section>
    <section style={{ paddingTop: 0 }}>
      <div className="grid-2">
        {FAQ_ITEMS.map((d) => (
          <div className="card" key={d.q}>
            <h3 style={{ marginBottom: 10 }}>{d.q}</h3>
            <p>{d.a}</p>
          </div>
        ))}
      </div>
    </section>
    <div className="cta-band">
      <h2>Still have <span style={{ color: "var(--orange)" }}>questions?</span></h2>
      <p>Send us a message — we typically respond within 24 hours.</p>
      <div className="cta-band-actions">
        <Link to="/contact" className="btn-primary">Ask Us Anything</Link>
      </div>
    </div>
  </div>
);

/* ─── PRICING PAGE ────────────────────────────────────────── */
const pricingTiers = [
  {
    name: "Starter", tagline: "For MVPs and single-service engagements", priceNote: "Starting at $5,000",
    features: ["One core service — Design, Develop, or Deploy", "Dedicated project lead", "Weekly progress updates", "2-week delivery sprints", "30 days post-launch support"],
  },
  {
    name: "Growth", tagline: "For full end-to-end product builds", priceNote: "Starting at $15,000", featured: true,
    features: ["Design + Development + Deployment", "Dedicated 2–3 person team", "Daily standups & shared Slack channel", "CI/CD pipeline & cloud infra included", "90 days post-launch support"],
  },
  {
    name: "Enterprise", tagline: "For scale-ups and complex platforms", priceNote: "Custom pricing",
    features: ["Full 3D³ team across all services", "Dedicated DevOps & SRE support", "Multi-region, HA architecture", "Compliance & security audits", "Ongoing SLA-backed support"],
  },
];

const PricingPage = () => (
  <div className="page" style={{ paddingTop: 70 }}>
    <section>
      <div className="section-label">Pricing</div>
      <h1 className="section-title">Simple starting points.<br /><span style={{ color: "var(--orange)" }}>Custom-scoped delivery.</span></h1>
      <p className="section-sub">Every engagement is scoped individually based on complexity, timeline, and team size. These are starting ranges — book a free call for an exact quote.</p>
    </section>
    <section style={{ paddingTop: 0 }}>
      <div className="grid-3">
        {pricingTiers.map((t) => (
          <div
            className="card"
            key={t.name}
            style={t.featured ? { borderColor: "var(--orange)", boxShadow: "0 0 0 1px var(--orange)" } : undefined}
          >
            {t.featured && <div className="service-badge" style={{ background: "rgba(255,94,26,0.15)", color: "var(--orange)" }}>Most Popular</div>}
            <h3 style={{ fontSize: "1.3rem", marginTop: t.featured ? 8 : 0 }}>{t.name}</h3>
            <p style={{ marginBottom: 16 }}>{t.tagline}</p>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.6rem", color: "var(--white)", marginBottom: 20 }}>{t.priceNote}</div>
            <ul className="benefit-list" style={{ marginBottom: 24 }}>
              {t.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Link to="/contact" className={t.featured ? "btn-primary" : "btn-outline"} style={{ width: "100%" }}>Get a Custom Quote →</Link>
          </div>
        ))}
      </div>
    </section>
    <div className="cta-band">
      <h2>Not sure which tier <span style={{ color: "var(--orange)" }}>fits?</span></h2>
      <p>Book a free 30-min scope call and we'll recommend the right starting point.</p>
      <div className="cta-band-actions">
        <Link to="/contact" className="btn-primary">Book Free Scope Call</Link>
      </div>
    </div>
  </div>
);

/* ─── STATUS PAGE ─────────────────────────────────────────── */
const systems = [
  { name: "Website (3dstack.in)", status: "Operational" },
  { name: "Contact Form / Lead Pipeline", status: "Operational" },
  { name: "Client Deployment Pipelines", status: "Operational" },
  { name: "Monitoring & Alerting", status: "Operational" },
];

const StatusPage = () => (
  <div className="page" style={{ paddingTop: 70 }}>
    <section>
      <div className="section-label">Status</div>
      <h1 className="section-title">System status</h1>
      <p className="section-sub">Current status of 3D³ systems and client-facing infrastructure.</p>
    </section>
    <section style={{ paddingTop: 0 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {systems.map((s, i) => (
          <div
            key={s.name}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 28px", borderBottom: i < systems.length - 1 ? "1px solid var(--card-border)" : "none",
            }}
          >
            <span style={{ fontWeight: 600 }}>{s.name}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#3DDC84", fontSize: "0.88rem", fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3DDC84", display: "inline-block" }} />
              {s.status}
            </span>
          </div>
        ))}
      </div>
      <p style={{ color: "var(--grey-500)", fontSize: "0.82rem", marginTop: 20 }}>
        This status page is manually maintained, not auto-generated from live monitoring. For real-time incident updates on your specific project, contact your project lead or support@3dstack.in.
      </p>
    </section>
  </div>
);

/* ─── FOOTER ──────────────────────────────────────────────── */
const footerColumns = [
  {
    title: "Services", links: [
      { label: "UI/UX Design", path: "/services/ui-ux-design" },
      { label: "Web Development", path: "/services/web-development" },
      { label: "Mobile Apps", path: "/services/mobile-app-development" },
      { label: "DevOps & CI/CD", path: "/services/devops-cicd" },
      { label: "Cloud Infrastructure", path: "/services/cloud-infrastructure" },
      { label: "Kubernetes", path: "/services/kubernetes-containerization" },
    ]
  },
  {
    title: "Company", links: [
      { label: "About Us", path: "/about" },
      { label: "Process", path: "/process" },
      { label: "Blog", path: "/blog" },
      { label: "Contact", path: "/contact" },
    ]
  },
  {
    title: "Resources", links: [
      { label: "Case Studies", path: "/case-studies" },
      { label: "Documentation", path: "/documentation" },
      { label: "Pricing", path: "/pricing" },
      { label: "Status Page", path: "/status" },
    ]
  },
];

const Footer = () => (
  <footer>
    <div className="footer-grid">
      <div className="footer-brand">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <LogoImg size={32} />
          <span style={{ fontFamily: "Syne", fontWeight: 800, background: "linear-gradient(135deg, var(--orange), var(--blue-sky))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3D Design Develop Deploy</span>
        </div>
        <p>End-to-end digital solutions — from idea to deployment. One team, zero hand-offs, complete ownership.</p>
        <div className="social-links" style={{ marginTop: 20 }}>
          {[
            { icon: "📷", label: "Instagram", url: "https://www.instagram.com/3dstack.in?igsh=MTZldmJwYnlueXJ0cg==&utm_source=ig_contact_invite" },
            { icon: "@", label: "Threads", url: "https://www.threads.com/@3dstack.in" },
            { icon: "▶", label: "YouTube", url: "https://www.youtube.com/@3DStack" },
            { icon: "in", label: "LinkedIn", url: "https://www.linkedin.com/in/3dstack/" },
            { icon: "𝕏", label: "Twitter", url: "https://x.com/3d_stack" },
            { icon: "Ⓜ", label: "Medium", url: "https://medium.com/@3dstack" },
            { icon: "🐙", label: "GitHub", url: "https://github.com/3DStackIn" },
          ].map((s) => (
            <a
              className="social-link"
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
      {footerColumns.map((col) => (
        <div className="footer-col" key={col.title}>
          <h4>{col.title}</h4>
          {col.links.map((l) => (
            <Link key={l.label} to={l.path}>{l.label}</Link>
          ))}
        </div>
      ))}
    </div>
    <div className="footer-bottom">
      <p>© 2026 3D Design Develop Deploy. All rights reserved.</p>
      <p style={{ color: "var(--grey-500)" }}>Built by 3D³ · Privacy Policy · Terms of Service</p>
    </div>
  </footer>
);

/* ─── PAGE META (per-route title & description) ──────────── */
export const PAGE_META = {
  "/": {
    title: "3D Design Develop Deploy — Design, Development & DevOps Agency",
    description: "One partner for design, development, DevOps, and cloud. We turn your vision into a scalable, production-ready product — fast, clean, and future-proof.",
  },
  "/about": {
    title: "About Us | 3D Design Develop Deploy",
    description: "3D³ is an end-to-end technology partner for design, development, and deployment — one team, zero hand-offs, complete ownership.",
  },
  "/services": {
    title: "Services | 3D Design Develop Deploy",
    description: "UI/UX design, web & mobile development, DevOps, cloud infrastructure, and Kubernetes — modular services for every stage of your product.",
  },
  "/process": {
    title: "Our Process | 3D Design Develop Deploy",
    description: "A battle-tested 4-phase delivery framework: requirements & design, development, testing & QA, deployment & monitoring.",
  },
  "/blog": {
    title: "Blog | 3D Design Develop Deploy",
    description: "Insights on DevOps, cloud infrastructure, design systems, and shipping software — real lessons from the trenches.",
  },
  "/contact": {
    title: "Contact Us | 3D Design Develop Deploy",
    description: "Tell us about your project. We'll respond within 24 hours with a clear next step.",
  },
  "/case-studies": {
    title: "Case Studies | 3D Design Develop Deploy",
    description: "Real projects, real results — how we've taken products from idea to production for FinTech, E-Commerce, and EdTech clients.",
  },
  "/documentation": {
    title: "Documentation | 3D Design Develop Deploy",
    description: "Answers to common questions about engagements, tech stack, support, and pricing.",
  },
  "/pricing": {
    title: "Pricing | 3D Design Develop Deploy",
    description: "Simple starting price tiers for design, development, and deployment engagements — Starter, Growth, and Enterprise.",
  },
  "/status": {
    title: "System Status | 3D Design Develop Deploy",
    description: "Current operational status of 3D³ systems and client-facing infrastructure.",
  },
};

BLOG_POSTS.forEach((post) => {
  PAGE_META[`/blog/${post.slug}`] = {
    title: `${post.title} | 3D³ Blog`,
    description: post.excerpt,
  };
});

SERVICE_PAGES.forEach((service) => {
  PAGE_META[`/services/${service.slug}`] = {
    title: `${service.title} | 3D³`,
    description: service.metaDescription,
  };
});

const SITE_URL = "https://3dstack.in";

const setMetaTag = (selector, attr, attrValue, content) => {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const RouteEffects = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const meta = PAGE_META[location.pathname] || PAGE_META["/"];
    const canonicalUrl = `${SITE_URL}${location.pathname === "/" ? "" : location.pathname}`;

    document.title = meta.title;
    setMetaTag('meta[name="description"]', "name", "description", meta.description);
    setMetaTag('meta[property="og:title"]', "property", "og:title", meta.title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", meta.description);
    setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", meta.description);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
  }, [location.pathname]);

  return null;
};

/* ─── APP SHELL (router-agnostic — used for client hydration and static prerendering) ── */
export const AppShell = () => (
  <>
    <GlobalStyle />
    <RouteEffects />
    <Nav />
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
  </>
);

/* ─── APP ─────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
