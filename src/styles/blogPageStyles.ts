export const blogPageStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  .blog-root {
    background: #0a0a0f;
    color: #e2e8f0;
    min-height: 100vh;
    overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  /* ===== ANIMATIONS ===== */
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
  }

  @keyframes shimmer {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  /* ===== HERO SECTION ===== */
  .blog-root .hero {
    position: relative;
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 24px 80px;
    overflow: hidden;
  }

  .blog-root .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  }

  .blog-root .hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    animation: float 8s ease-in-out infinite;
  }

  .blog-root .hero-orb-1 {
    width: 400px;
    height: 400px;
    background: #8b5cf6;
    top: -100px;
    left: -100px;
  }

  .blog-root .hero-orb-2 {
    width: 300px;
    height: 300px;
    background: #06b6d4;
    bottom: -80px;
    right: -80px;
    animation-delay: -3s;
  }

  .blog-root .hero-orb-3 {
    width: 200px;
    height: 200px;
    background: #f59e0b;
    top: 40%;
    left: 60%;
    animation-delay: -5s;
    opacity: 0.2;
  }

  .blog-root .hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    text-align: center;
  }

  .blog-root .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 0 5px;
    background: transparent;
    border: 0;
    border-bottom: 2px solid rgba(139, 92, 246, 0.45);
    font-size: 13px;
    font-weight: 700;
    color: #d9ccff;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 24px;
  }

  .blog-root .hero h1 {
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 20px;
    color: #f8fafc;
  }

  .blog-root .gradient-text {
    background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .blog-root .hero > .hero-content > p {
    font-size: 18px;
    color: #94a3b8;
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto 32px;
  }

  /* ===== SEARCH ===== */
  .blog-root .search-container {
    max-width: 560px;
    margin: 0 auto 40px;
  }

  .blog-root .search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    padding: 4px;
    transition: all 0.3s ease;
    backdrop-filter: blur(12px);
  }

  .blog-root .search-wrapper:focus-within {
    border-color: rgba(139, 92, 246, 0.5);
  }

  .blog-root .search-icon {
    width: 20px;
    height: 20px;
    color: #64748b;
    margin-left: 16px;
    flex-shrink: 0;
  }

  .blog-root .search-input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 14px 16px;
    color: #e2e8f0;
    font-size: 15px;
    outline: none;
  }

  .blog-root .search-input::placeholder {
    color: #475569;
  }

  .blog-root .search-clear {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 8px;
    margin-right: 8px;
    border-radius: 8px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .blog-root .search-clear:hover {
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.05);
  }

  /* ===== HERO STATS ===== */
  .blog-root .hero-stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    margin-top: 40px;
  }

  .blog-root .stat-item h3 {
    font-size: 32px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 4px;
  }

  .blog-root .stat-item p {
    font-size: 14px;
    color: #64748b;
  }

  /* ===== SECTIONS ===== */
  .blog-root .section {
    padding: 80px 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .blog-root .section-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .blog-root .section-label {
    display: inline-block;
    padding: 0 0 5px;
    background: transparent;
    border: 0;
    border-bottom: 2px solid rgba(139, 92, 246, 0.45);
    font-size: 13px;
    font-weight: 700;
    color: #d9ccff;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }

  .blog-root .section-title {
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 12px;
  }

  .blog-root .section-subtitle {
    font-size: 16px;
    color: #64748b;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ===== FEATURED ARTICLE ===== */
  .blog-root .featured-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.4s ease;
  }

  .blog-root .featured-card:hover {
    border-color: rgba(139, 92, 246, 0.3);
    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.1);
    transform: translateY(-4px);
  }

  .blog-root .featured-image {
    position: relative;
    overflow: hidden;
    min-height: 400px;
  }

  .blog-root .featured-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  .blog-root .featured-card:hover .featured-image img {
    transform: scale(1.05);
  }

  .blog-root .featured-overlay {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .blog-root .featured-category {
    padding: 6px 14px;
    background: rgba(139, 92, 246, 0.9);
    color: white;
    font-size: 12px;
    font-weight: 600;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .blog-root .featured-content {
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .blog-root .featured-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
  }

  .blog-root .featured-meta span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
  }

  .blog-root .featured-content h2 {
    font-size: 28px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 16px;
    line-height: 1.3;
  }

  .blog-root .featured-content > p {
    font-size: 15px;
    color: #94a3b8;
    line-height: 1.7;
    margin-bottom: 20px;
  }

  .blog-root .featured-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .blog-root .featured-tag {
    padding: 4px 12px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 100px;
    font-size: 12px;
    color: #a78bfa;
  }

  .blog-root .featured-author {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .blog-root .author-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
  }

  .blog-root .author-avatar.blue { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
  .blog-root .author-avatar.purple { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
  .blog-root .author-avatar.green { background: linear-gradient(135deg, #10b981, #06b6d4); }
  .blog-root .author-avatar.orange { background: linear-gradient(135deg, #f59e0b, #ef4444); }

  .blog-root .author-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: #f8fafc;
  }

  .blog-root .author-info p {
    font-size: 12px;
    color: #64748b;
  }

  .blog-root .featured-btn {
    margin-left: auto;
  }

  /* ===== CATEGORY FILTER ===== */
  .blog-root .category-filter {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 24px;
  }

  .blog-root .category-pill {
    padding: 10px 24px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 100px;
    color: #94a3b8;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .blog-root .category-pill:hover {
    border-color: rgba(139, 92, 246, 0.3);
    color: #e2e8f0;
    background: rgba(139, 92, 246, 0.08);
  }

  .blog-root .category-pill.active {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  }

  /* ===== ARTICLES GRID ===== */
  .blog-root .articles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .blog-root .article-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s ease;
    cursor: pointer;
  }

  .blog-root .article-card:hover {
    border-color: rgba(139, 92, 246, 0.25);
    box-shadow: 0 12px 40px rgba(139, 92, 246, 0.08);
    transform: translateY(-6px);
  }

  .blog-root .article-image {
    position: relative;
    overflow: hidden;
    height: 200px;
  }

  .blog-root .article-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .blog-root .article-card:hover .article-image img {
    transform: scale(1.08);
  }

  .blog-root .article-image-overlay {
    position: absolute;
    top: 12px;
    left: 12px;
  }

  .blog-root .article-category {
    padding: 4px 12px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    color: white;
    font-size: 11px;
    font-weight: 600;
    border-radius: 100px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .blog-root .article-content {
    padding: 20px;
  }

  .blog-root .article-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
  }

  .blog-root .article-meta span {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #64748b;
  }

  .blog-root .article-content h3 {
    font-size: 17px;
    font-weight: 600;
    color: #f8fafc;
    margin-bottom: 10px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-root .article-content > p {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 14px;
    text-align: justify;
    text-justify: inter-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-root .article-tags {
    display: flex;
    gap: 6px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .blog-root .article-tag {
    padding: 3px 10px;
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: 100px;
    font-size: 11px;
    color: #a78bfa;
  }

  .blog-root .article-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .blog-root .article-author {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .blog-root .author-avatar-small {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    color: white;
  }

  .blog-root .author-avatar-small.blue { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
  .blog-root .author-avatar-small.purple { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
  .blog-root .author-avatar-small.green { background: linear-gradient(135deg, #10b981, #06b6d4); }
  .blog-root .author-avatar-small.orange { background: linear-gradient(135deg, #f59e0b, #ef4444); }

  .blog-root .article-author span {
    font-size: 13px;
    color: #94a3b8;
  }

  .blog-root .article-read-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: #a78bfa;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .blog-root .article-read-btn:hover {
    color: #c4b5fd;
    gap: 8px;
  }

  /* ===== LOAD MORE ===== */
  .blog-root .load-more-container {
    display: flex;
    justify-content: center;
    margin-top: 48px;
  }

  .blog-root .load-more-btn {
    padding: 14px 32px;
  }

  /* ===== EMPTY STATE ===== */
  .blog-root .empty-state {
    text-align: center;
    padding: 80px 24px;
  }

  .blog-root .empty-state h3 {
    font-size: 20px;
    font-weight: 600;
    color: #f8fafc;
    margin: 16px 0 8px;
  }

  .blog-root .empty-state p {
    font-size: 15px;
    color: #64748b;
  }

  /* ===== RESOURCES SECTION ===== */
  .blog-root .resources-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .blog-root .resource-card {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 24px;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    transition: all 0.4s ease;
  }

  .blog-root .resource-card:hover {
    border-color: rgba(139, 92, 246, 0.2);
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.06);
    transform: translateY(-3px);
  }

  .blog-root .resource-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .blog-root .resource-icon svg {
    width: 24px;
    height: 24px;
    color: white;
  }

  .blog-root .resource-icon.blue { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
  .blog-root .resource-icon.purple { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
  .blog-root .resource-icon.green { background: linear-gradient(135deg, #10b981, #06b6d4); }
  .blog-root .resource-icon.orange { background: linear-gradient(135deg, #f59e0b, #ef4444); }

  .blog-root .resource-content {
    flex: 1;
  }

  .blog-root .resource-type {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #a78bfa;
    margin-bottom: 6px;
    display: block;
  }

  .blog-root .resource-content h3 {
    font-size: 16px;
    font-weight: 600;
    color: #f8fafc;
    margin-bottom: 6px;
  }

  .blog-root .resource-content > p {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .blog-root .resource-meta {
    display: flex;
    gap: 16px;
  }

  .blog-root .resource-meta span {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #64748b;
  }

  .blog-root .resource-download-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 12px;
    color: #a78bfa;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    flex-shrink: 0;
  }

  .blog-root .resource-download-btn:hover {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border-color: transparent;
    color: white;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
  }

  /* ===== NEWSLETTER SECTION ===== */
  .blog-root .newsletter-section {
    position: relative;
    padding: 100px 24px;
    margin: 0 24px 80px;
    border-radius: 32px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1));
    border: 1px solid rgba(139, 92, 246, 0.2);
  }

  .blog-root .newsletter-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .blog-root .newsletter-content {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 560px;
    margin: 0 auto;
  }

  .blog-root .newsletter-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: white;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
  }

  .blog-root .newsletter-content h2 {
    font-size: 32px;
    font-weight: 700;
    color: #f8fafc;
    margin-bottom: 12px;
  }

  .blog-root .newsletter-content > p {
    font-size: 16px;
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 32px;
  }

  .blog-root .newsletter-form {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .blog-root .newsletter-input-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
  }

  .blog-root .newsletter-input-icon {
    position: absolute;
    left: 16px;
    width: 18px;
    height: 18px;
    color: #64748b;
  }

  .blog-root .newsletter-input {
    width: 100%;
    padding: 14px 16px 14px 44px;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    color: #e2e8f0;
    font-size: 15px;
    outline: none;
    transition: all 0.3s;
  }

  .blog-root .newsletter-input:focus {
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
  }

  .blog-root .newsletter-input::placeholder {
    color: #475569;
  }

  .blog-root .newsletter-btn {
    padding: 14px 28px;
    white-space: nowrap;
  }

  .blog-root .newsletter-trust {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    color: #64748b;
  }

  .blog-root .trust-check {
    color: #10b981;
    font-weight: 600;
  }

  /* ===== TOPICS SECTION ===== */
  .blog-root .topics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .blog-root .topic-card {
    padding: 28px 20px;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.4s ease;
  }

  .blog-root .topic-card:hover {
    border-color: rgba(139, 92, 246, 0.25);
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.08);
    transform: translateY(-4px);
  }

  .blog-root .topic-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .blog-root .topic-icon svg {
    width: 26px;
    height: 26px;
    color: white;
  }

  .blog-root .topic-icon.blue { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
  .blog-root .topic-icon.purple { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
  .blog-root .topic-icon.green { background: linear-gradient(135deg, #10b981, #06b6d4); }
  .blog-root .topic-icon.orange { background: linear-gradient(135deg, #f59e0b, #ef4444); }

  .blog-root .topic-card h3 {
    font-size: 16px;
    font-weight: 600;
    color: #f8fafc;
    margin-bottom: 4px;
  }

  .blog-root .topic-card p {
    font-size: 13px;
    color: #64748b;
  }

  /* ===== CTA SECTION ===== */
  .blog-root .cta-section {
    position: relative;
    padding: 100px 24px;
    text-align: center;
    overflow: hidden;
    margin-bottom: 0;
  }

  .blog-root .cta-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .blog-root .cta-section h2 {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    color: #f8fafc;
    margin-bottom: 16px;
    position: relative;
  }

  .blog-root .cta-section > div > p {
    font-size: 18px;
    color: #94a3b8;
    max-width: 520px;
    margin: 0 auto 32px;
    line-height: 1.6;
    position: relative;
  }

  /* ===== BUTTONS ===== */
  .blog-root .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border: none;
    border-radius: 14px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  }

  .blog-root .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
  }

  .blog-root .hero-primary-button {
    min-height: 54px;
    padding: 0 28px;
    background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
    color: #f5f3ff;
    border: 1px solid rgba(167, 139, 250, 0.44);
    border-radius: 16px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 58, 237, 0.22);
  }

  .blog-root .hero-primary-button::before,
  .blog-root .hero-primary-button::after {
    display: none;
  }

  .blog-root .hero-primary-button:hover {
    transform: translateY(-2px);
    border-color: rgba(196, 181, 253, 0.68);
    background: #211830;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
  }

  .blog-root .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    color: #e2e8f0;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .blog-root .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .blog-root .btn-label {
    display: inline;
  }

  /* ===== REVEAL ANIMATIONS ===== */
  .blog-root .reveal,
  .blog-root .reveal-left,
  .blog-root .reveal-right,
  .blog-root .reveal-scale {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .blog-root .reveal-left {
    transform: translateX(-40px);
  }

  .blog-root .reveal-right {
    transform: translateX(40px);
  }

  .blog-root .reveal-scale {
    transform: scale(0.9) translateY(20px);
  }

  .blog-root .reveal.active,
  .blog-root .reveal-left.active,
  .blog-root .reveal-right.active,
  .blog-root .reveal-scale.active {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1);
  }

  .blog-root .stagger-1 { transition-delay: 0.1s; }
  .blog-root .stagger-2 { transition-delay: 0.2s; }
  .blog-root .stagger-3 { transition-delay: 0.3s; }
  .blog-root .stagger-4 { transition-delay: 0.4s; }
  .blog-root .stagger-5 { transition-delay: 0.5s; }
  .blog-root .stagger-6 { transition-delay: 0.6s; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 1024px) {
    .blog-root .featured-card {
      grid-template-columns: 1fr;
    }
    .blog-root .featured-image {
      min-height: 280px;
    }
    .blog-root .articles-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .blog-root .resources-grid {
      grid-template-columns: 1fr;
    }
    .blog-root .topics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .blog-root .hero {
      min-height: auto;
      padding: 100px 20px 60px;
    }
    .blog-root .hero-stats {
      gap: 24px;
    }
    .blog-root .stat-item h3 {
      font-size: 24px;
    }
    .blog-root .articles-grid {
      grid-template-columns: 1fr;
    }
    .blog-root .topics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .blog-root .newsletter-form {
      flex-direction: column;
    }
    .blog-root .featured-content {
      padding: 28px;
    }
    .blog-root .section {
      padding: 60px 20px;
    }
    .blog-root .resource-card {
      flex-direction: column;
      gap: 16px;
    }
    .blog-root .resource-download-btn {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .blog-root .hero-stats {
      flex-direction: column;
      gap: 20px;
    }
    .blog-root .topics-grid {
      grid-template-columns: 1fr;
    }
    .blog-root .category-filter {
      gap: 8px;
    }
    .blog-root .category-pill {
      padding: 8px 16px;
      font-size: 13px;
    }
    .blog-root .featured-author {
      flex-wrap: wrap;
      gap: 12px;
    }
    .blog-root .featured-btn {
      margin-left: 0;
      width: 100%;
      margin-top: 8px;
    }
  }
`;
