/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getBlogById } from "../services/blogService";

export default function Blog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadBlog = async () => {
      try {
        setLoading(true);
        const response = await getBlogById(id);
        setBlog(response.data);
      } catch (err) {
        console.error("Error loading blog:", err);
        setError("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBlog();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen font-sans">
        <Header />
        <div
          className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[50vh]"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <Loader2
            size={48}
            className="animate-spin"
            style={{ color: "rgba(64, 145, 108, 1)" }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  // Error or not found state
  if (error || !blog) {
    return (
      <div className="min-h-screen font-sans">
        <Header />
        <div
          className="container mx-auto px-4 py-20 text-center"
          style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
        >
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: "rgba(49, 87, 44, 1)" }}
          >
            {error || "Bài viết không tồn tại"}
          </h1>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-lg font-medium hover:underline"
            style={{ color: "rgba(64, 145, 108, 1)" }}
          >
            <ArrowLeft size={20} />
            Quay lại danh sách bài viết
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans scroll-smooth">
      <Header />
      <main
        className="pt-20 md:pt-24"
        style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
      >
        {/* Blog Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            {/* Back Button */}
            <div className="mb-8">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-sm md:text-base font-medium hover:opacity-70 transition-opacity"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                <ArrowLeft size={20} />
                <span>Quay lại danh sách bài viết</span>
              </Link>
            </div>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Title */}
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                {blog.title}
              </h1>

              {/* Date */}
              <p
                className="text-sm md:text-base mb-8 opacity-70"
                style={{ color: "rgba(49, 87, 44, 0.8)" }}
              >
                Ngày đăng:{" "}
                {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
              </p>

              {/* Featured Image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl mb-8">
                <img
                  src={blog.img}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.src = "/team.png";
                  }}
                />
              </div>

              {/* Content - Render HTML từ Tiptap editor */}
              <div
                className="prose prose-lg max-w-none text-base md:text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </motion.article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
