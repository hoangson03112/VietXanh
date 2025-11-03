/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  toggleProductFeatured,
} from "../../services/adminService";
import ConfirmModal from "../../components/ConfirmModal";
import Toast from "../../components/Toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Confirm Modal States
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "warning",
    icon: "warning",
    title: "",
    message: "",
    onConfirm: null,
  });

  // Toast States
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Load products from API
  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await getAdminProducts();
      
      if (response.success) {
        console.log("✅ Products loaded:", response.data);
        setProducts(response.data);
      }
    } catch (error) {
      console.error("❌ Error loading products:", error);
      alert("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Thêm files mới vào danh sách hiện tại
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    
    // Generate preview URLs cho files mới
    const newUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newUrls]);
  };

  // Remove image from preview
  const handleRemoveImage = (index) => {
    const urlToRemove = imagePreview[index];
    
    // Revoke URL nếu là blob (ảnh mới upload)
    if (urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
      
      // Tìm index trong imageFiles tương ứng
      // Đếm số blob URLs trước index này
      const blobsBefore = imagePreview.slice(0, index).filter(url => url.startsWith('blob:')).length;
      const newFiles = imageFiles.filter((_, i) => i !== blobsBefore);
      setImageFiles(newFiles);
    }
    // Nếu là URL từ server, chỉ cần remove khỏi preview
    
    // Remove từ preview array
    const newPreview = imagePreview.filter((_, i) => i !== index);
    setImagePreview(newPreview);
  };

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      imagePreview.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreview]);

  // Handle Create
  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      name: "",
      description: "",
      price: "",
    });
    setImageFiles([]);
    setImagePreview([]);
    setShowModal(true);
  };

  // Handle Edit
  const handleEdit = (product) => {
    setModalMode("edit");
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setImageFiles([]);
    // Set preview từ ảnh hiện tại (từ server)
    setImagePreview(product.images || []);
    setShowModal(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    setConfirmModal({
      isOpen: true,
      type: "danger",
      icon: "delete",
      title: "Xóa sản phẩm",
      message: "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.",
      onConfirm: async () => {
        setLoading(true);
        try {
          const response = await deleteProduct(id);
          
          if (response.success) {
            showToast("Xóa sản phẩm thành công!", "success");
            loadProducts();
          }
        } catch (error) {
          console.error("❌ Error deleting product:", error);
          showToast("Không thể xóa sản phẩm", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle Toggle Status (Bật/Tắt hiển thị)
  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? "ẩn" : "hiển thị";
    const actionPast = currentStatus ? "ẩn" : "hiển thị";
    
    // Tìm sản phẩm để kiểm tra trạng thái featured
    const product = products.find(p => p._id === id);
    const willLoseFeatured = currentStatus && product?.isFeatured;
    
    setConfirmModal({
      isOpen: true,
      type: currentStatus ? "warning" : "info",
      icon: currentStatus ? "hide" : "show",
      title: currentStatus ? "Ẩn sản phẩm" : "Hiển thị sản phẩm",
      message: currentStatus 
        ? (willLoseFeatured 
            ? "⚠️ Sản phẩm này đang được đánh dấu NỔI BẬT trên trang chủ.\n\nKhi ẨN sản phẩm, nó sẽ tự động bị BỎ khỏi danh sách nổi bật và không hiển thị cho khách hàng.\n\nBạn có chắc chắn muốn tiếp tục?"
            : "Sản phẩm sẽ bị ẩn khỏi trang chủ và không hiển thị cho khách hàng. Bạn có muốn tiếp tục?")
        : "Sản phẩm sẽ được hiển thị trở lại trên trang chủ cho khách hàng. Bạn có muốn tiếp tục?",
      onConfirm: async () => {
        setLoading(true);
        try {
          const response = await toggleProductStatus(id);
          
          if (response.success) {
            console.log('✅ Product status toggled:', response.data.isActive);
            
            // Hiển thị thông báo đặc biệt nếu sản phẩm bị mất featured
            if (willLoseFeatured) {
              showToast(`Đã ${actionPast} sản phẩm và bỏ khỏi danh sách nổi bật!`, "warning");
            } else {
              showToast(`Đã ${actionPast} sản phẩm thành công!`, "success");
            }
            
            loadProducts();
          }
        } catch (error) {
          console.error("❌ Error toggling product status:", error);
          showToast("Không thể thay đổi trạng thái sản phẩm", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle Toggle Featured Status
  const handleToggleFeatured = async (id, currentFeatured) => {
    const action = currentFeatured ? "bỏ nổi bật" : "đánh dấu nổi bật";
    
    // Tìm sản phẩm để kiểm tra trạng thái active
    const product = products.find(p => p._id === id);
    
    // Nếu sản phẩm đang ẨN, không cho phép đánh dấu featured
    if (!currentFeatured && !product?.isActive) {
      showToast("⚠️ Không thể đánh dấu nổi bật sản phẩm đang ẨN. Vui lòng HIỂN THỊ sản phẩm trước!", "error");
      return;
    }
    
    setConfirmModal({
      isOpen: true,
      type: currentFeatured ? "warning" : "success",
      icon: currentFeatured ? "warning" : "success",
      title: currentFeatured ? "Bỏ sản phẩm nổi bật" : "Đánh dấu nổi bật",
      message: currentFeatured 
        ? "Sản phẩm sẽ không còn hiển thị ở mục sản phẩm nổi bật trên trang chủ."
        : "✨ Sản phẩm sẽ được hiển thị ở mục nổi bật trên trang chủ (tối đa 4 sản phẩm).\n\nLưu ý: Chỉ sản phẩm đang HIỂN THỊ mới có thể được đánh dấu nổi bật.",
      onConfirm: async () => {
        setLoading(true);
        try {
          const response = await toggleProductFeatured(id);
          
          if (response.success) {
            console.log('✅ Product featured toggled:', response.data.isFeatured);
            showToast(`Đã ${action} sản phẩm thành công!`, "success");
            loadProducts();
          }
        } catch (error) {
          console.error("❌ Error toggling featured:", error);
          const errorMsg = error.response?.data?.message || "Không thể thay đổi trạng thái nổi bật";
          
          // Hiển thị thông báo lỗi user-friendly
          if (errorMsg.includes("inactive")) {
            showToast("⚠️ Không thể đánh dấu nổi bật sản phẩm đang ẨN!", "error");
          } else if (errorMsg.includes("Maximum 4")) {
            showToast("⚠️ Đã đủ 4 sản phẩm nổi bật! Vui lòng bỏ đánh dấu sản phẩm khác trước.", "error");
          } else {
            showToast(errorMsg, "error");
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Phân biệt giữa ảnh cũ (từ server) và ảnh mới (blob URLs)
      const existingImages = imagePreview.filter(url => !url.startsWith('blob:'));
      const newImageFiles = imageFiles;

      // Kiểm tra phải có ít nhất 1 ảnh khi tạo mới
      if (modalMode === "create" && imagePreview.length === 0) {
        showToast("Vui lòng thêm ít nhất 1 hình ảnh sản phẩm", "warning");
        setLoading(false);
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
      };

      console.log('💾 Saving product:', productData);
      console.log('📸 New images:', newImageFiles.length);
      console.log('🖼️ Existing images:', existingImages.length);

      let response;
      if (modalMode === "create") {
        // Tạo mới: Gửi data + files ảnh
        response = await createProduct(productData, newImageFiles);
      } else {
        // Cập nhật: Gửi data + files ảnh mới + URLs ảnh cũ
        response = await updateProduct(currentProduct._id, productData, newImageFiles, existingImages);
      }

      if (response.success) {
        console.log('✅ Product saved successfully');
        showToast(
          modalMode === "create" ? "Thêm sản phẩm thành công!" : "Cập nhật sản phẩm thành công!",
          "success"
        );
        setShowModal(false);
        loadProducts(); // Reload list
        
        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
        });
        setImageFiles([]);
        setImagePreview([]);
      }
    } catch (error) {
      console.error("❌ Error saving product:", error);
      showToast(error.message || "Không thể lưu sản phẩm. Vui lòng thử lại!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "rgba(255, 244, 228, 1)" }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
            >
              <Package size={28} className="text-white" />
            </div>
            <div>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              >
                QUẢN LÝ SẢN PHẨM
              </h1>
              <p
                className="text-sm md:text-base mt-1"
                style={{ color: "rgba(49, 87, 44, 0.7)" }}
              >
                Thêm, sửa, xóa và quản lý tất cả sản phẩm
              </p>
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full md:max-w-md relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(49, 87, 44, 0.5)" }}
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: "rgba(64, 145, 108, 0.3)",
                  color: "rgba(49, 87, 44, 1)",
                }}
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Thêm sản phẩm</span>
                <span className="sm:hidden">Thêm</span>
              </button>
            </div>
          </div>

          {/* Stats */}
        </motion.div>

        {/* Products Table/Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "rgba(64, 145, 108, 1)" }}></div>
                <p className="text-gray-600">Đang tải sản phẩm...</p>
              </div>
            ) : (
            <table className="w-full">
              <thead style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-center text-white font-bold text-sm">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={product.images?.[0] || "/product1.png"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 font-bold"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    >
                      {product.name}
                    </td>
                    <td
                      className="px-6 py-4 text-sm max-w-xs truncate"
                      style={{ color: "rgba(49, 87, 44, 0.7)" }}
                    >
                      {product.description}
                    </td>
                    <td
                      className="px-6 py-4 font-bold"
                      style={{ color: "rgba(64, 145, 108, 1)" }}
                    >
                      {product.price.toLocaleString()} VNĐ
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(product._id, product.isActive)}
                          className="p-2 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                          style={{ 
                            backgroundColor: product.isActive 
                              ? "rgba(64, 145, 108, 0.1)" 
                              : "rgba(255, 152, 0, 0.1)" 
                          }}
                          title={product.isActive ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
                        >
                          {product.isActive ? (
                            <Eye size={18} style={{ color: "rgba(64, 145, 108, 1)" }} />
                          ) : (
                            <EyeOff size={18} style={{ color: "rgba(255, 152, 0, 1)" }} />
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                          disabled={!product.isActive && !product.isFeatured}
                          className="p-2 rounded-lg transition-transform relative group"
                          style={{ 
                            backgroundColor: product.isFeatured 
                              ? "rgba(255, 193, 7, 0.2)" 
                              : !product.isActive 
                                ? "rgba(200, 200, 200, 0.1)"
                                : "rgba(158, 158, 158, 0.1)",
                            cursor: (!product.isActive && !product.isFeatured) ? "not-allowed" : "pointer",
                            opacity: (!product.isActive && !product.isFeatured) ? 0.5 : 1
                          }}
                          title={
                            !product.isActive && !product.isFeatured
                              ? "Vui lòng HIỂN THỊ sản phẩm trước khi đánh dấu nổi bật"
                              : product.isFeatured 
                                ? "Bỏ nổi bật" 
                                : "Đánh dấu nổi bật"
                          }
                        >
                          <Star 
                            size={18} 
                            fill={product.isFeatured ? "rgba(255, 193, 7, 1)" : "none"}
                            style={{ 
                              color: product.isFeatured 
                                ? "rgba(255, 193, 7, 1)" 
                                : !product.isActive 
                                  ? "rgba(180, 180, 180, 1)"
                                  : "rgba(158, 158, 158, 1)" 
                            }} 
                          />
                          {!product.isActive && !product.isFeatured && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: "rgba(64, 145, 108, 0.1)" }}
                        >
                          <Edit2
                            size={18}
                            style={{ color: "rgba(64, 145, 108, 1)" }}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: "rgba(244, 67, 54, 0.1)" }}
                        >
                          <Trash2 size={18} style={{ color: "#F44336" }} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {loading ? (
              <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "rgba(64, 145, 108, 1)" }}></div>
                <p className="text-gray-600">Đang tải sản phẩm...</p>
              </div>
            ) : (
              <>
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-2 rounded-2xl p-4"
                style={{ borderColor: "rgba(64, 145, 108, 0.2)" }}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={product.images?.[0] || "/product1.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="font-bold text-lg"
                        style={{ color: "rgba(49, 87, 44, 1)" }}
                      >
                        {product.name}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: product.isActive
                            ? "rgba(64, 145, 108, 0.15)"
                            : "rgba(255, 152, 0, 0.15)",
                          color: product.isActive
                            ? "rgba(64, 145, 108, 1)"
                            : "rgba(255, 152, 0, 1)",
                        }}
                      >
                        {product.isActive ? "Hiển thị" : "Đã ẩn"}
                      </span>
                    </div>
                    <p
                      className="text-sm mb-2"
                      style={{ color: "rgba(49, 87, 44, 0.7)" }}
                    >
                      {product.description}
                    </p>
                    <div className="mb-2">
                      <span
                        className="font-bold"
                        style={{ color: "rgba(64, 145, 108, 1)" }}
                      >
                        {product.price.toLocaleString()} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleToggleStatus(product._id, product.isActive)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-white transition-all hover:scale-105 cursor-pointer"
                    style={{ 
                      backgroundColor: product.isActive 
                        ? "rgba(64, 145, 108, 1)" 
                        : "rgba(255, 152, 0, 1)" 
                    }}
                  >
                    {product.isActive ? (
                      <>
                        <Eye size={16} />
                        Hiển thị
                      </>
                    ) : (
                      <>
                        <EyeOff size={16} />
                        Đã ẩn
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                    disabled={!product.isActive && !product.isFeatured}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold transition-all relative"
                    style={{ 
                      backgroundColor: product.isFeatured 
                        ? "rgba(255, 193, 7, 1)" 
                        : !product.isActive
                          ? "rgba(200, 200, 200, 0.3)"
                          : "rgba(158, 158, 158, 0.3)",
                      color: product.isFeatured 
                        ? "white" 
                        : !product.isActive
                          ? "rgba(150, 150, 150, 1)"
                          : "rgba(97, 97, 97, 1)",
                      cursor: (!product.isActive && !product.isFeatured) ? "not-allowed" : "pointer",
                      opacity: (!product.isActive && !product.isFeatured) ? 0.5 : 1
                    }}
                    title={
                      !product.isActive && !product.isFeatured
                        ? "Vui lòng HIỂN THỊ sản phẩm trước"
                        : undefined
                    }
                  >
                    <Star 
                      size={16} 
                      fill={product.isFeatured ? "white" : "none"}
                    />
                    {product.isFeatured ? "Nổi bật" : "Đánh dấu"}
                    {!product.isActive && !product.isFeatured && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-white transition-all hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}
                  >
                    <Edit2 size={16} />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-white transition-all hover:scale-105 cursor-pointer"
                    style={{ backgroundColor: "#F44336" }}
                  >
                    <Trash2 size={16} />
                    Xóa
                  </button>
                </div>
              </motion.div>
            ))}
              </>
            )}
          </div>

          {/* Empty State */}
          {!loading && paginatedProducts.length === 0 && (
            <div className="py-16 text-center">
              <Package
                size={64}
                className="mx-auto mb-4 opacity-30"
                style={{ color: "rgba(49, 87, 44, 1)" }}
              />
              <p
                className="text-xl font-medium"
                style={{ color: "rgba(49, 87, 44, 0.6)" }}
              >
                Không tìm thấy sản phẩm nào
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p
                  className="text-sm"
                  style={{ color: "rgba(49, 87, 44, 0.7)" }}
                >
                  Hiển thị {startIndex + 1} -{" "}
                  {Math.min(startIndex + itemsPerPage, filteredProducts.length)}{" "}
                  trong tổng số {filteredProducts.length} sản phẩm
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: "rgba(64, 145, 108, 0.1)" }}
                  >
                    <ChevronLeft
                      size={20}
                      style={{ color: "rgba(64, 145, 108, 1)" }}
                    />
                  </button>
                  <span
                    className="px-4 py-2 rounded-lg font-bold"
                    style={{
                      backgroundColor: "rgba(64, 145, 108, 0.1)",
                      color: "rgba(49, 87, 44, 1)",
                    }}
                  >
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: "rgba(64, 145, 108, 0.1)" }}
                  >
                    <ChevronRight
                      size={20}
                      style={{ color: "rgba(64, 145, 108, 1)" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="sticky top-0 px-8 py-6 flex items-center justify-between shadow-md z-10"
              style={{ 
                background: "linear-gradient(135deg, rgba(64, 145, 108, 1) 0%, rgba(49, 87, 44, 1) 100%)"
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Package size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {modalMode === "create" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
                  </h2>
                  <p className="text-white/80 text-sm mt-0.5">
                    {modalMode === "create" ? "Điền thông tin sản phẩm bên dưới" : "Cập nhật thông tin sản phẩm"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2.5 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300 cursor-pointer"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Product Name */}
              <div>
                <label
                  className="flex items-center gap-2 mb-3 font-bold text-sm"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}></div>
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Túi vải canvas thân thiện môi trường"
                  className="w-full px-5 py-3.5 rounded-2xl border-2 focus:outline-none focus:border-[rgba(64,145,108,1)] focus:shadow-lg transition-all"
                  style={{
                    borderColor: "rgba(64, 145, 108, 0.2)",
                    color: "rgba(49, 87, 44, 1)",
                    backgroundColor: "rgba(255, 244, 228, 0.3)",
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  className="flex items-center gap-2 mb-3 font-bold text-sm"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}></div>
                  Mô tả sản phẩm *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về sản phẩm, chất liệu, kích thước, ưu điểm..."
                  rows="4"
                  className="w-full px-5 py-3.5 rounded-2xl border-2 focus:outline-none focus:border-[rgba(64,145,108,1)] focus:shadow-lg transition-all resize-none"
                  style={{
                    borderColor: "rgba(64, 145, 108, 0.2)",
                    color: "rgba(49, 87, 44, 1)",
                    backgroundColor: "rgba(255, 244, 228, 0.3)",
                  }}
                />
              </div>

              {/* Price */}
              <div>
                <label
                  className="flex items-center gap-2 mb-3 font-bold text-sm"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}></div>
                  Giá bán (VNĐ) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="100000"
                    className="w-full px-5 py-3.5 rounded-2xl border-2 focus:outline-none focus:border-[rgba(64,145,108,1)] focus:shadow-lg transition-all"
                    style={{
                      borderColor: "rgba(64, 145, 108, 0.2)",
                      color: "rgba(49, 87, 44, 1)",
                      backgroundColor: "rgba(255, 244, 228, 0.3)",
                    }}
                  />
                  {formData.price && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: "rgba(64, 145, 108, 1)" }}>
                      {parseFloat(formData.price).toLocaleString()} ₫
                    </div>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label
                  className="flex items-center gap-2 mb-3 font-bold text-sm"
                  style={{ color: "rgba(49, 87, 44, 1)" }}
                >
                  <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}></div>
                  Hình ảnh sản phẩm {modalMode === "create" && imagePreview.length === 0 ? "*" : "(tùy chọn)"}
                </label>
                <div 
                  className="relative border-2 border-dashed rounded-2xl p-6 transition-all hover:border-[rgba(64,145,108,0.6)] cursor-pointer"
                  style={{
                    borderColor: "rgba(64, 145, 108, 0.3)",
                    backgroundColor: "rgba(255, 244, 228, 0.3)",
                  }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    required={modalMode === "create" && imagePreview.length === 0}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(64, 145, 108, 0.1)" }}>
                      <Plus size={32} style={{ color: "rgba(64, 145, 108, 1)" }} />
                    </div>
                    <p className="font-bold mb-1" style={{ color: "rgba(49, 87, 44, 1)" }}>
                      Nhấn để chọn ảnh
                    </p>
                    <p className="text-xs" style={{ color: "rgba(49, 87, 44, 0.6)" }}>
                      Có thể chọn nhiều ảnh cùng lúc • PNG, JPG, WEBP
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-current mt-1.5" style={{ color: "rgba(64, 145, 108, 1)" }}></div>
                  <p className="text-xs flex-1" style={{ color: "rgba(49, 87, 44, 0.7)" }}>
                    Ảnh đầu tiên sẽ là <strong>ảnh đại diện chính</strong> của sản phẩm. Bạn có thể kéo thả để sắp xếp lại thứ tự.
                  </p>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview.length > 0 && (
                <div className="rounded-2xl p-5" style={{ backgroundColor: "rgba(255, 244, 228, 0.5)", border: "2px solid rgba(64, 145, 108, 0.2)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <label
                      className="flex items-center gap-2 font-bold text-sm"
                      style={{ color: "rgba(49, 87, 44, 1)" }}
                    >
                      <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}></div>
                      Xem trước hình ảnh ({imagePreview.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        imagePreview.forEach(url => {
                          if (url.startsWith('blob:')) URL.revokeObjectURL(url);
                        });
                        setImageFiles([]);
                        setImagePreview([]);
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105 cursor-pointer"
                      style={{ 
                        color: "#F44336",
                        backgroundColor: "rgba(244, 67, 54, 0.1)"
                      }}
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreview.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-md border-2 border-transparent group-hover:border-[rgba(64,145,108,1)] transition-all">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                        </div>
                        
                        {/* Badge ảnh chính */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-lg" style={{ backgroundColor: "rgba(64, 145, 108, 1)" }}>
                            Ảnh chính
                          </div>
                        )}
                        
                        {/* Số thứ tự */}
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg" style={{ backgroundColor: "rgba(49, 87, 44, 0.8)" }}>
                          {index + 1}
                        </div>
                        
                        {/* Nút xóa */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                          className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg cursor-pointer"
                          style={{ backgroundColor: "#F44336" }}
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Nút thêm ảnh */}
                    <button
                      type="button"
                      onClick={() => document.getElementById('fileInput').click()}
                      className="w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:border-[rgba(64,145,108,1)] hover:bg-white cursor-pointer"
                      style={{ 
                        borderColor: "rgba(64, 145, 108, 0.3)",
                        backgroundColor: "rgba(255, 255, 255, 0.5)"
                      }}
                    >
                      <Plus size={24} style={{ color: "rgba(64, 145, 108, 1)" }} />
                      <span className="text-xs font-bold" style={{ color: "rgba(49, 87, 44, 0.7)" }}>
                        Thêm ảnh
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl border-2 font-bold transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                  style={{
                    borderColor: "rgba(64, 145, 108, 1)",
                    color: "rgba(64, 145, 108, 1)",
                    backgroundColor: "white",
                  }}
                >
                  <X size={20} className="inline mr-2" />
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ 
                    background: loading ? "rgba(64, 145, 108, 0.5)" : "linear-gradient(135deg, rgba(64, 145, 108, 1) 0%, rgba(49, 87, 44, 1) 100%)"
                  }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {modalMode === "create" ? "Thêm sản phẩm" : "Lưu thay đổi"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        icon={confirmModal.icon}
        confirmText="Xác nhận"
        cancelText="Hủy bỏ"
      />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}

