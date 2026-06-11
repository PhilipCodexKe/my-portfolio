import { blogPosts } from "../data";

function BlogPage() {
  return (
    <main>
      <section className="portfolio-hero">
        <span className="pill-badge">Blog</span>
        <h1>Design Journal</h1>
        <p>
          Insights, ideas, and stories from the journey of crafting
          thoughtful digital experiences
        </p>
      </section>
      <section className="container" style={{ paddingTop: 0 }}>
        <div className="blog-grid-new">
          {blogPosts.map((post, i) => {
            const img = post.img;
            return (
              <div key={i} className="blog-card-new">
                <div className="blog-card-img-wrapper">
                  <img
                    src={img}
                    alt={post.title}
                    className="blog-card-img"
                    loading="lazy"
                  />
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="blog-category-pill">
                      {post.category}
                    </span>
                    <span className="blog-date">{post.date}</span>
                  </div>
                  <h3 className="blog-card-title">{post.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default BlogPage;
