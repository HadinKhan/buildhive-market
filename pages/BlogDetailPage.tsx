import React, { useEffect, useRef, useState } from "react";
import { Icons } from "../components/Icons";
import { blogPageStyles } from "../src/styles/blogPageStyles";
import { blogDetailStyles } from "../src/styles/blogDetailStyles";
import { blogDetailData } from "../src/data/blogDetailData";

interface BlogDetailPageProps {
  postId: string;
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  postId,
  onNavigate,
  onBack,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const countedPostRef = useRef<string | null>(null);
  const post = blogDetailData.posts[postId];
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealNodes = root.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("active");
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    revealNodes.forEach((node) => observer.observe(node));

    const heroReveals = root.querySelectorAll<HTMLElement>(".detail-hero .reveal");
    const timers = Array.from(heroReveals, (element: HTMLElement, index) =>
      window.setTimeout(() => element.classList.add("active"), 200 + index * 150)
    );

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [postId]);

  useEffect(() => {
    if (!post || countedPostRef.current === postId) return;

    countedPostRef.current = postId;
    const storageKey = `buildhive-blog-views-${postId}`;
    const currentViews = Number(window.localStorage.getItem(storageKey) || "0");
    const nextViews = currentViews + 1;

    window.localStorage.setItem(storageKey, String(nextViews));
    setViewCount(nextViews);
  }, [post, postId]);

  if (!post) {
    return (
      <div>
        <style>{blogPageStyles + blogDetailStyles}</style>
        <div className="blog-root" style={{ padding: "120px 24px", textAlign: "center" }}>
          <h2 style={{ color: "#f8fafc" }}>Article not found</h2>
          <button className="btn-primary" onClick={onBack} style={{ marginTop: "24px" }}>
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const relatedPosts = blogDetailData.relatedPosts
    .filter((relatedPost) => relatedPost.category === post.category && relatedPost.id !== postId)
    .slice(0, 3);

  return (
    <div ref={rootRef}>
      <style>{blogPageStyles + blogDetailStyles}</style>

      <div className="blog-root">
        <section className="detail-hero">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-grid"></div>

          <button className="back-btn hero-primary-button reveal" onClick={onBack}>
            <Icons.ArrowLeft className="h-[16px] w-[16px]" />
            <span className="btn-label">Back to Blog</span>
          </button>

          <div className="detail-hero-content">
            <div className="detail-category reveal stagger-1">{post.category}</div>

            <h1 className="detail-title reveal stagger-2">{post.title}</h1>

            <div className="detail-meta reveal stagger-3">
              <span>
                <Icons.Calendar className="h-[14px] w-[14px]" />
                {post.date}
              </span>
              <span className="meta-dot">.</span>
              <span>
                <Icons.Clock className="h-[14px] w-[14px]" />
                {post.readTime}
              </span>
              <span className="meta-dot">.</span>
              <span>
                <Icons.Eye className="h-[14px] w-[14px]" />
                {viewCount.toLocaleString()}
              </span>
            </div>

            <div className={`detail-author reveal stagger-4 author-${post.author.tone}`}>
              <div className="author-avatar">{post.author.initials}</div>
              <div className="author-info">
                <h4>{post.author.name}</h4>
                <p>{post.author.role}</p>
              </div>
            </div>
          </div>

          <div className="detail-hero-image reveal stagger-5">
            <img src={post.image} alt={post.title} loading="eager" />
          </div>
        </section>

        <article className="article-body">
          {post.content.map((block, index) => {
            const staggerClass = `reveal stagger-${(index % 6) + 1}`;

            switch (block.type) {
              case "paragraph":
                return (
                  <p key={index} className={staggerClass}>
                    {block.text}
                  </p>
                );
              case "heading":
                return (
                  <h2 key={index} className={staggerClass}>
                    {block.text}
                  </h2>
                );
              case "subheading":
                return (
                  <h3 key={index} className={staggerClass}>
                    {block.text}
                  </h3>
                );
              case "image":
                return (
                  <figure key={index} className={staggerClass}>
                    <img src={block.src} alt={block.caption || ""} loading="lazy" />
                    {block.caption && <figcaption>{block.caption}</figcaption>}
                  </figure>
                );
              case "list":
                return (
                  <ul key={index} className={staggerClass}>
                    {block.items.map((item) => (
                      <li key={item}>
                        <Icons.Check className="list-check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              case "tip":
                return (
                  <div key={index} className={`tip-box ${staggerClass}`}>
                    <div className="tip-header">
                      <Icons.Lightbulb className="tip-icon" />
                      <strong>{block.title || "Pro Tip"}</strong>
                    </div>
                    <p>{block.text}</p>
                  </div>
                );
              case "table":
                return (
                  <div key={index} className={`table-wrap ${staggerClass}`}>
                    <table>
                      <thead>
                        <tr>
                          {block.headers.map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              default:
                return null;
            }
          })}

          <div className="article-tags-footer reveal">
            {post.tags.map((tag) => (
              <span key={tag} className="article-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="share-bar reveal">
            <span>Share this article:</span>
            <button
              className="share-btn hero-primary-button"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
            >
              <Icons.Link className="h-[16px] w-[16px]" />
              <span className="btn-label">Copy Link</span>
            </button>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="section">
            <div className="section-header reveal">
              <span className="section-label">Related</span>
              <h2 className="section-title">You May Also Like</h2>
            </div>

            <div className="articles-grid">
              {relatedPosts.map((relatedPost, index) => (
                <article
                  key={relatedPost.id}
                  className={`article-card reveal stagger-${(index % 6) + 1}`}
                  onClick={() => onNavigate(`blog/${relatedPost.id}`)}
                >
                  <div className="article-image">
                    <img src={relatedPost.image} alt={relatedPost.title} loading="lazy" />
                    <div className="article-image-overlay">
                      <span className="article-category">{relatedPost.category}</span>
                    </div>
                  </div>
                  <div className="article-content">
                    <div className="article-meta">
                      <span>
                        <Icons.Calendar className="h-[12px] w-[12px]" />
                        {relatedPost.date}
                      </span>
                      <span>
                        <Icons.Clock className="h-[12px] w-[12px]" />
                        {relatedPost.readTime}
                      </span>
                    </div>
                    <h3>{relatedPost.title}</h3>
                    <p>{relatedPost.excerpt}</p>
                    <div className="article-footer">
                      <span className="article-read-btn">
                        <span>Read</span>
                        <Icons.ArrowRight className="h-[14px] w-[14px]" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="cta-section">
          <div className="cta-grid"></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="reveal">
              Ready to Build
              <br />
              Smarter?
            </h2>
            <p className="reveal stagger-1">
              Join thousands of construction professionals who trust BuildHive for quality
              materials, expert insights, and seamless collaboration.
            </p>
            <div
              className="reveal stagger-2"
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button className="btn-primary hero-primary-button" onClick={() => onNavigate("products")}>
                <span className="btn-label">Browse Products</span>
                <Icons.ArrowRight className="h-[18px] w-[18px]" />
              </button>
              <button className="btn-secondary" onClick={() => onNavigate("contact")}>
                <span className="btn-label">Contact Sales</span>
                <Icons.Mail className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
