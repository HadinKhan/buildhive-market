export const blogDetailStyles = `
  .blog-root .detail-hero {
    position: relative;
    padding: 140px 24px 60px;
    overflow: hidden;
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  }

  .blog-root .detail-hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .blog-root .back-btn {
    position: absolute;
    top: 102px;
    left: 32px;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 54px;
    padding: 0 22px;
    background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
    border: 1px solid rgba(167, 139, 250, 0.44);
    border-radius: 16px;
    color: #f5f3ff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 58, 237, 0.22);
  }

  .blog-root .back-btn:hover {
    transform: translateY(-2px);
    border-color: rgba(196, 181, 253, 0.68);
    background: #211830;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
  }

  .blog-root .detail-category {
    display: inline-block;
    padding: 0 0 5px;
    background: transparent;
    border: 0;
    border-bottom: 2px solid rgba(139, 92, 246, 0.45);
    color: #d9ccff;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 24px;
  }

  .blog-root .detail-hero-content .detail-title {
    max-width: 100%;
    margin: 0 auto 30px;
    font-size: clamp(2.2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    color: #f8fafc;
    line-height: 1.15;
    letter-spacing: 0;
  }

  .blog-root .detail-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .blog-root .detail-meta span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #64748b;
  }

  .blog-root .detail-author {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
  }

  .blog-root .detail-author .author-avatar {
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

  .blog-root .detail-author.author-blue .author-avatar { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
  .blog-root .detail-author.author-purple .author-avatar { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
  .blog-root .detail-author.author-green .author-avatar { background: linear-gradient(135deg, #10b981, #06b6d4); }
  .blog-root .detail-author.author-orange .author-avatar { background: linear-gradient(135deg, #f59e0b, #ef4444); }

  .blog-root .detail-author .author-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: #f8fafc;
    text-align: left;
    margin: 0;
  }

  .blog-root .detail-author .author-info p {
    font-size: 12px;
    color: #64748b;
    text-align: left;
    margin: 0;
  }

  .blog-root .detail-hero-image {
    position: relative;
    z-index: 2;
    max-width: 1000px;
    margin: 40px auto 0;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(139, 92, 246, 0.15);
  }

  .blog-root .detail-hero-image img {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: cover;
    display: block;
  }

  .blog-root .article-body {
    max-width: 720px;
    margin: 0 auto;
    padding: 60px 24px;
  }

  .blog-root .article-body p {
    font-size: 17px;
    line-height: 1.8;
    color: #94a3b8;
    margin-bottom: 24px;
    text-align: justify;
    text-justify: inter-word;
  }

  .blog-root .article-body h2 {
    font-size: 28px;
    font-weight: 700;
    color: #f8fafc;
    margin: 48px 0 20px;
    line-height: 1.3;
  }

  .blog-root .article-body h3 {
    font-size: 22px;
    font-weight: 600;
    color: #e2e8f0;
    margin: 36px 0 16px;
    line-height: 1.3;
  }

  .blog-root .article-body figure {
    margin: 40px 0;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .blog-root .article-body figure img {
    width: 100%;
    height: auto;
    display: block;
  }

  .blog-root .article-body figcaption {
    padding: 12px 16px;
    font-size: 13px;
    color: #64748b;
    background: rgba(15, 23, 42, 0.8);
    text-align: center;
  }

  .blog-root .article-body ul {
    margin: 24px 0;
    padding: 0;
    list-style: none;
  }

  .blog-root .article-body ul li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    font-size: 16px;
    color: #94a3b8;
    line-height: 1.6;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .blog-root .article-body ul li:last-child {
    border-bottom: none;
  }

  .blog-root .article-body .list-check {
    width: 20px;
    height: 20px;
    color: #10b981;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .blog-root .tip-box {
    margin: 32px 0;
    padding: 24px;
    background: rgba(245, 158, 11, 0.06);
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 16px;
  }

  .blog-root .tip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .blog-root .tip-icon {
    width: 20px;
    height: 20px;
    color: #f59e0b;
  }

  .blog-root .tip-box strong {
    color: #f59e0b;
    font-size: 15px;
  }

  .blog-root .tip-box p {
    margin: 0;
    font-size: 15px;
    color: #94a3b8;
  }

  .blog-root .table-wrap {
    margin: 32px 0;
    border-radius: 16px;
    overflow-x: auto;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .blog-root .table-wrap table {
    width: 100%;
    min-width: 560px;
    border-collapse: collapse;
    font-size: 14px;
  }

  .blog-root .table-wrap th {
    background: rgba(139, 92, 246, 0.1);
    padding: 14px 16px;
    text-align: left;
    font-weight: 600;
    color: #e2e8f0;
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  }

  .blog-root .table-wrap td {
    padding: 12px 16px;
    color: #94a3b8;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .blog-root .table-wrap tr:last-child td {
    border-bottom: none;
  }

  .blog-root .article-tags-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .blog-root .share-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .blog-root .share-bar span {
    font-size: 14px;
    color: #64748b;
  }

  .blog-root .share-btn {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 54px;
    padding: 0 28px;
    background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
    border: 1px solid rgba(167, 139, 250, 0.44);
    border-radius: 16px;
    color: #f5f3ff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 58, 237, 0.22);
  }

  .blog-root .share-btn,
  .blog-root .share-btn svg,
  .blog-root .share-btn .btn-label {
    color: #ffffff;
    stroke: #ffffff;
  }

  .blog-root .share-btn:hover {
    transform: translateY(-2px);
    border-color: rgba(196, 181, 253, 0.68);
    background: #211830;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
  }

  @media (max-width: 768px) {
    .blog-root .detail-hero {
      padding: 120px 20px 40px;
    }
    .blog-root .back-btn {
      top: 86px;
      left: 20px;
      min-height: 48px;
      padding: 0 16px;
      font-size: 14px;
    }
    .blog-root .detail-category {
      margin-top: 44px;
    }
    .blog-root .article-body {
      padding: 40px 20px;
    }
    .blog-root .article-body h2 {
      font-size: 22px;
    }
    .blog-root .article-body h3 {
      font-size: 18px;
    }
    .blog-root .article-body p {
      font-size: 16px;
    }
    .blog-root .detail-meta {
      gap: 8px;
    }
    .blog-root .detail-meta .meta-dot {
      display: none;
    }
    .blog-root .share-bar {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;
