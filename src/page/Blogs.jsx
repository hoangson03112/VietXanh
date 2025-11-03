/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { ChevronsDown, Loader2 } from "lucide-react";
import { getBlogs } from "../services/blogService";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(6);

  // Load blogs from API
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const response = await getBlogs();
        // API trả về blogs có isActive = true
        setBlogs(response.data || []);
      } catch (err) {
        console.error("Error loading blogs:", err);
        setError("Không thể tải danh sách bài viết");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  const displayedBlogs = blogs.slice(0, displayCount);
  const hasMore = displayCount < blogs.length;
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main>
        {/* Hero Section */}
        <section
          style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
          className="pt-20 md:pt-24 text-white min-h-[60vh] md:min-h-[75vh] overflow-hidden relative"
        >
          <div className="container mx-auto max-w-9xl px-4 md:px-6 lg:px-3 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[calc(60vh-5rem)] md:min-h-[calc(75vh-6rem)] relative py-8 md:py-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-span-1 lg:col-span-6 z-10 text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
                BÀI VIẾT
              </h1>
              <p className=" md:text-xl opacity-90 leading-relaxed mb-6 md:mb-10 px-4 sm:px-0">
                Nơi chia sẻ kiến thức, mẹo sống xanh và xu hướng tiêu dùng bền
                vững. Cùng Việt Xanh khám phá cách bảo vệ môi trường từ những
                hành động nhỏ mỗi ngày.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block absolute bottom-0 right-0"
              style={{ width: "75%", height: "calc(100% - 6rem)" }}
            >
              <div className="h-full flex items-end justify-end">
                <img
                  src="/team.png"
                  alt="Team"
                  className="h-auto object-bottom"
                  style={{
                    width: "140%",
                    maxHeight: "100%",
                    marginRight: "-25%",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog List Section */}
        <section
          className="py-16 md:py-24"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <p
              className="font-bold text-sm md:text-base lg:text-lg uppercase tracking-widest"
              style={{
                color: "rgba(49, 87, 44, 1)",
                letterSpacing: "0.2em",
              }}
            >
              VIET XANH
            </p>
            <h2
              className=" text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 uppercase tracking-wide"
              style={{ color: "rgba(49, 87, 44, 1)" }}
            >
              DANH SÁCH BÀI VIẾT
            </h2>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 
                  size={48} 
                  className="animate-spin" 
                  style={{ color: "rgba(64, 145, 108, 1)" }}
                />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg font-medium">{error}</p>
              </div>
            )}

            {/* Blog Grid */}
            {!loading && !error && (
              <>
                <div className="my-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                  {displayedBlogs.map((blog, index) => (
                    <Link to={`/blog/${blog._id}`} key={blog._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        className="flex flex-col h-full cursor-pointer transition-transform duration-300 hover:-translate-y-2"
                      >
                        {/* Image */}
                        <div className="overflow-hidden rounded-2xl mb-6 shadow-lg">
                          <img
                            src={blog.img}
                            alt={blog.title}
                            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                            onError={(e) => {
                              e.target.src = "/team.png";
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1">
                          <h3
                            className="text-xl md:text-2xl font-bold mb-4 leading-tight"
                            style={{ color: "rgba(49, 87, 44, 1)" }}
                          >
                            {blog.title}
                          </h3>
                          <p
                            className="text-sm md:text-base leading-relaxed font-medium opacity-90 line-clamp-3"
                            style={{ color: "rgba(49, 87, 44, 0.8)" }}
                            dangerouslySetInnerHTML={{
                              __html: blog.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                            }}
                          />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center mt-12">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="flex items-center justify-center gap-3 px-10 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform cursor-pointer"
                      style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                    >
                      XEM THÊM
                      <ChevronsDown size={22} className="animate-bounce" />
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {displayedBlogs.length === 0 && (
                  <div className="text-center py-20">
                    <p 
                      className="text-xl font-medium"
                      style={{ color: "rgba(49, 87, 44, 0.6)" }}
                    >
                      Chưa có bài viết nào
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
