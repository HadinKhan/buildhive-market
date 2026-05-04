import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Icons } from "../components/Icons";
import { blogPageStyles } from "../src/styles/blogPageStyles";
import { blogPageData } from "../src/data/blogPageData";

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const INITIAL_VISIBLE = 6;
  const targetPostId = new URLSearchParams(location.search).get("post");

  const filteredPosts = blogPageData.posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = filteredPosts.length > INITIAL_VISIBLE;
  const allVisible = visibleCount >= filteredPosts.length;

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

    const heroReveals = root.querySelectorAll<HTMLElement>(".hero .reveal");
    const timers: number[] = [];
    heroReveals.forEach((el, index) => {
      const id = window.setTimeout(() => {
        el.classList.add("active");
      }, 200 + index * 150);
      timers.push(id);
    });

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (!targetPostId) return;

    const targetIndex = blogPageData.posts.findIndex((post) => post.id === targetPostId);
    if (targetIndex === -1) return;

    setActiveCategory("All");
    setSearchQuery("");
    setVisibleCount(Math.max(INITIAL_VISIBLE, Math.ceil((targetIndex + 1) / INITIAL_VISIBLE) * INITIAL_VISIBLE));
  }, [targetPostId]);

  useEffect(() => {
    if (!targetPostId) return;

    const timerId = window.setTimeout(() => {
      const targetCard = rootRef.current?.querySelector<HTMLElement>(
        `[data-post-id="${targetPostId}"]`
      );

      targetCard?.scrollIntoView({ behavior: "smooth", block: "center" });
      targetCard?.classList.add("active");
    }, 120);

    return () => window.clearTimeout(timerId);
  }, [targetPostId, visiblePosts]);

  const handleLoadMore = () => {
    if (allVisible) {
      setVisibleCount(INITIAL_VISIBLE);
      return;
    }

    setVisibleCount((prev) => prev + INITIAL_VISIBLE);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_VISIBLE);
  };

  const getTopicCount = (topicName: string) => {
    const normalizedTopic = topicName.toLowerCase();

    return blogPageData.posts.filter((post) => {
      const searchableText = [post.category, post.title, post.excerpt, ...post.tags]
        .join(" ")
        .toLowerCase();

      if (normalizedTopic === "costing") {
        return searchableText.includes("cost");
      }

      return searchableText.includes(normalizedTopic);
    }).length;
  };

  return (
    <div ref={rootRef}>
      <style>{blogPageStyles}</style>

      <div className="blog-root">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid"></div>

          <div className="hero-content">
            <div className="hero-badge reveal">
              <Icons.Book className="h-[16px] w-[16px]" />
              Blog & Resources
            </div>

            <h1 className="reveal stagger-1">
              Insights for
              <br />
              <span className="gradient-text">Builders</span>
            </h1>

            <p className="reveal stagger-2">
              Expert guides, industry news, and actionable insights to help 
              construction professionals make smarter decisions and build better projects.
            </p>

            {/* Search Bar */}
            <div className="search-container reveal stagger-3">
              <div className="search-wrapper">
                <Icons.Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search articles, guides, and resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button 
                    className="search-clear" 
                    onClick={() => setSearchQuery("")}
                  >
                    <Icons.Close className="h-[16px] w-[16px]" />
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="hero-stats reveal stagger-4">
              <div className="stat-item">
                <h3>{blogPageData.stats.totalArticles}</h3>
                <p>Articles</p>
              </div>
              <div className="stat-item">
                <h3>{blogPageData.stats.monthlyReaders}</h3>
                <p>Monthly Readers</p>
              </div>
              <div className="stat-item">
                <h3>{blogPageData.stats.expertContributors}</h3>
                <p>Expert Contributors</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="section">
          <div className="category-filter reveal">
            {blogPageData.categories.map((category) => (
              <button
                key={category}
                className={`category-pill ${activeCategory === category ? "active" : ""}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="section">
          <div className="section-header reveal">
            <span className="section-label">Latest</span>
            <h2 className="section-title">
              {activeCategory === "All" ? "All Articles" : `${activeCategory} Articles`}
            </h2>
            <p className="section-subtitle">
              {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found
            </p>
          </div>

          {visiblePosts.length > 0 ? (
            <div className="articles-grid">
              {visiblePosts.map((post, index) => (
                <article 
                  key={post.id} 
                  data-post-id={post.id}
                  className={`article-card reveal stagger-${(index % 6) + 1}`}
                  onClick={() => onNavigate(`blog/${post.id}`)}
                >
                  <div className="article-image">
                    <img src={post.image} alt={post.title} loading="lazy" />
                    <div className="article-image-overlay">
                      <span className="article-category">{post.category}</span>
                    </div>
                  </div>
                  <div className="article-content">
                    <div className="article-meta">
                      <span className="article-date">
                        <Icons.Calendar className="h-[12px] w-[12px]" />
                        {post.date}
                      </span>
                      <span className="article-readtime">
                        <Icons.Clock className="h-[12px] w-[12px]" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="article-tags">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="article-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="article-footer">
                      <div className="article-author">
                        <div className={`author-avatar-small ${post.author.tone}`}>
                          {post.author.initials}
                        </div>
                        <span>{post.author.name}</span>
                      </div>
                      <button className="article-read-btn" onClick={(event) => {
                        event.stopPropagation();
                        onNavigate(`blog/${post.id}`);
                      }}>
                        <span>Read</span>
                        <Icons.ArrowRight className="h-[14px] w-[14px]" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state reveal">
              <Icons.Search className="h-[48px] w-[48px]" style={{ color: "#64748b" }} />
              <h3>No articles found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          )}

          {hasMorePosts && (
            <div className="load-more-container reveal">
              <button className="btn-secondary load-more-btn" onClick={handleLoadMore}>
                <span className="btn-label">{allVisible ? "Show Less" : "Load More Articles"}</span>
                {allVisible ? (
                  <Icons.ChevronUp className="h-[18px] w-[18px]" />
                ) : (
                  <Icons.ChevronDown className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>
          )}
        </section>

        {/* Topics Section */}
        <section className="section">
          <div className="section-header reveal">
            <span className="section-label">Explore</span>
            <h2 className="section-title">Popular Topics</h2>
          </div>

          <div className="topics-grid">
            {blogPageData.topics.map((topic, index) => {
              const IconComp = topic.icon;
              const count = getTopicCount(topic.name);
              return (
                <div 
                  key={topic.name} 
                  className={`topic-card reveal stagger-${index + 1}`}
                  onClick={() => handleCategoryChange(topic.name)}
                >
                  <div className={`topic-icon ${topic.tone}`}>
                    <IconComp />
                  </div>
                  <h3>{topic.name}</h3>
                  <p>{count} articles</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-grid"></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="reveal">
              Ready to Build
              <br />
              Smarter?
            </h2>
            <p className="reveal stagger-1">
              Join thousands of construction professionals who trust BuildHive 
              for quality materials, expert insights, and seamless collaboration.
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
