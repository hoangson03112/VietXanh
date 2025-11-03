# 🔐 PHÂN QUYỀN HỆ THỐNG FRONTEND - VIETXANH

## 📋 **TỔNG QUAN**

Hệ thống phân quyền Frontend đã được implement với:
- ✅ **AuthContext** - Quản lý state authentication
- ✅ **ProtectedRoute** - Component bảo vệ routes
- ✅ **AdminRoute** - Component bảo vệ routes admin
- ✅ **Role-based Access Control** - Phân quyền dựa trên role

---

## 🏗️ **KIẾN TRÚC**

### 1. **AuthContext** (`src/context/AuthContext.jsx`)

```javascript
{
  user: {
    name: "Tên user",
    email: "email@example.com",
    role: "admin" | "user",  // ← Role quan trọng
    token: "jwt_token"
  },
  login: (userData) => void,
  logout: () => void,
  loading: boolean,
  isAuthenticated: boolean
}
```

**Chức năng:**
- ✅ Lưu user info vào `localStorage`
- ✅ Auto-load user khi refresh page
- ✅ Cung cấp `user.role` để phân quyền
- ✅ Loading state khi đang kiểm tra auth

---

### 2. **ProtectedRoute** (`src/components/ProtectedRoute.jsx`)

```jsx
<ProtectedRoute requireAdmin={false}>
  <YourComponent />
</ProtectedRoute>
```

**Logic:**
1. **Loading State** → Hiển thị loading spinner
2. **Not Authenticated** → Redirect to `/login`
3. **Require Admin + Not Admin** → Hiển thị "Access Denied" page
4. **Valid User** → Render children

**Props:**
- `children`: Component cần bảo vệ
- `requireAdmin`: Boolean - Yêu cầu quyền admin (default: false)

---

### 3. **AdminRoute** (`src/components/ProtectedRoute.jsx`)

```jsx
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```

**Shorthand cho:**
```jsx
<ProtectedRoute requireAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

---

## 🛣️ **ROUTES CONFIGURATION**

### **App.jsx - Current Setup:**

```jsx
<Routes>
  {/* ✅ Protected Admin Routes */}
  <Route 
    path="/admin" 
    element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    } 
  />
  
  {/* ✅ Public Routes */}
  <Route path="/home" element={<Home />} />
  <Route path="/products" element={<Products />} />
  <Route path="/login" element={<Login />} />
  {/* ... */}
</Routes>
```

---

## 👥 **PHÂN QUYỀN CHI TIẾT**

### **User Roles:**

| Role    | Mô tả           | Quyền truy cập                          |
|---------|-----------------|----------------------------------------|
| `admin` | Quản trị viên   | Tất cả trang + Admin Panel             |
| `user`  | Người dùng      | Tất cả trang công khai (không vào admin) |
| `null`  | Chưa đăng nhập  | Chỉ public pages + login/register      |

---

### **Routes Access Matrix:**

| Route           | Public | User | Admin | Protected By      |
|-----------------|--------|------|-------|-------------------|
| `/home`         | ✅     | ✅   | ✅    | None              |
| `/products`     | ✅     | ✅   | ✅    | None              |
| `/product/:id`  | ✅     | ✅   | ✅    | None              |
| `/blogs`        | ✅     | ✅   | ✅    | None              |
| `/cart`         | ✅     | ✅   | ✅    | None              |
| `/login`        | ✅     | ✅   | ✅    | None              |
| `/register`     | ✅     | ✅   | ✅    | None              |
| `/admin`        | ❌     | ❌   | ✅    | **AdminRoute**    |
| `/admin/products`| ❌    | ❌   | ✅    | **AdminRoute**    |

---

## 🎯 **FLOWS**

### **Flow 1: User chưa đăng nhập cố truy cập Admin**

```
User → /admin
  ↓
AdminRoute kiểm tra user
  ↓
user = null
  ↓
Navigate to /login (với state: { from: '/admin' })
  ↓
User login thành công
  ↓
Redirect to /admin (nếu role = 'admin')
hoặc /home (nếu role = 'user')
```

---

### **Flow 2: User thường cố truy cập Admin**

```
User (role='user') → /admin
  ↓
AdminRoute kiểm tra user
  ↓
user.role !== 'admin'
  ↓
Hiển thị "Access Denied" page
  ↓
Options:
  - Quay lại trang trước
  - Về trang chủ
```

---

### **Flow 3: Admin login thành công**

```
Admin login → loginAPI()
  ↓
Response: { user: { role: 'admin' }, token: '...' }
  ↓
AuthContext.login(userData)
  ↓
localStorage.setItem('user', userData)
  ↓
Navigate to /admin
  ↓
AdminRoute cho phép truy cập
  ↓
Hiển thị AdminDashboard
```

---

## 💻 **IMPLEMENTATION**

### **1. Bảo vệ route mới:**

```jsx
// Trong App.jsx
<Route 
  path="/admin/blogs" 
  element={
    <AdminRoute>
      <AdminBlogs />
    </AdminRoute>
  } 
/>
```

---

### **2. Kiểm tra role trong component:**

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <AdminFeature />;
  }
  
  return <NormalFeature />;
}
```

---

### **3. Hiển thị menu dựa trên role:**

```jsx
// Header.jsx - ĐANG SỬ DỤNG
{user?.role === 'admin' && (
  <Link to="/admin">
    <Settings size={16} />
    <span>Quản Trị Viên</span>
  </Link>
)}
```

---

## 🎨 **UI/UX**

### **Loading State:**
- Hiển thị spinner khi đang check authentication
- Tránh flash content khi redirect

### **Access Denied Page:**
- Icon cảnh báo rõ ràng (ShieldAlert)
- Message thân thiện
- 2 options: "Quay lại" hoặc "Về trang chủ"
- Responsive design

---

## 🔒 **SECURITY CONSIDERATIONS**

### ✅ **Đã implement:**
1. **Client-side protection** - ProtectedRoute ngăn truy cập UI
2. **Token-based auth** - JWT token lưu trong localStorage
3. **Role validation** - Kiểm tra `user.role` trước khi cho phép
4. **Redirect handling** - Lưu `from` path để redirect sau login

### ⚠️ **Cần cải thiện:**

1. **Backend validation** (QUAN TRỌNG NHẤT)
   ```javascript
   // Backend phải validate mọi API call
   // Không tin tưởng client-side hoàn toàn
   if (req.user.role !== 'admin') {
     return res.status(403).json({ message: 'Forbidden' });
   }
   ```

2. **Token refresh mechanism**
   - Implement refresh token
   - Auto-refresh khi token sắp hết hạn

3. **Secure token storage**
   - Xem xét dùng httpOnly cookies thay vì localStorage
   - Implement XSS protection

4. **API interceptor**
   - Tự động thêm token vào mọi request
   - Handle 401/403 errors globally

---

## 📊 **KIỂM TRA PHÂN QUYỀN**

### **Test Case 1: User chưa login vào Admin**
```
✅ Status: PASS
- Redirect to /login
- Lưu intended path
- Login thành công → redirect về /admin (nếu admin)
```

### **Test Case 2: User thường vào Admin**
```
✅ Status: PASS
- Hiển thị "Access Denied"
- Không thể truy cập AdminDashboard
- Có option quay lại/về home
```

### **Test Case 3: Admin login**
```
✅ Status: PASS
- Login thành công
- Redirect to /admin
- Hiển thị full admin panel
- Header có menu "Quản Trị Viên"
```

### **Test Case 4: Refresh page khi đã login**
```
✅ Status: PASS
- User data load từ localStorage
- Không bị logout
- Giữ nguyên role và permissions
```

---

## 🐛 **KNOWN ISSUES & LIMITATIONS**

### ⚠️ **Issue 1: LocalStorage không an toàn tuyệt đối**
**Impact:** Token có thể bị đánh cắp qua XSS
**Mitigation:** 
- Validate mọi input
- Sanitize data trước khi render
- Xem xét dùng httpOnly cookies

### ⚠️ **Issue 2: Client-side protection có thể bypass**
**Impact:** User có thể dùng DevTools để fake role
**Mitigation:**
- ✅ Backend PHẢI validate mọi request
- ✅ Không tin tưởng client-side data

### ⚠️ **Issue 3: Token không có expiry handling**
**Impact:** Token hết hạn → User bị stuck
**Solution:**
- Implement token refresh
- Handle 401 errors globally
- Auto-logout khi token invalid

---

## 🚀 **ROADMAP CẢI TIẾN**

### **Phase 1: Security Enhancement** (High Priority)
- [ ] Implement API interceptor với auto token inject
- [ ] Add token refresh mechanism
- [ ] Handle 401/403 globally
- [ ] Add CSRF protection

### **Phase 2: Better UX**
- [ ] Remember me functionality
- [ ] Session timeout warning
- [ ] Persistent cart/data khi logout
- [ ] Better error messages

### **Phase 3: Advanced Features**
- [ ] Multi-factor authentication
- [ ] Role hierarchy (super-admin, moderator, etc.)
- [ ] Permission-based access (không chỉ role)
- [ ] Audit logs cho admin actions

---

## 📝 **USAGE EXAMPLES**

### **Example 1: Thêm Protected Route**

```jsx
// App.jsx
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  } 
/>
```

### **Example 2: Conditional Rendering**

```jsx
// AnyComponent.jsx
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const { user } = useAuth();
  
  return (
    <div>
      <h3>{product.name}</h3>
      {user?.role === 'admin' && (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
}
```

### **Example 3: Programmatic Navigation**

```jsx
// Login.jsx
const handleSubmit = async (e) => {
  const response = await loginAPI(formData);
  login(response.data);
  
  // Redirect dựa trên role
  if (response.data.user.role === 'admin') {
    navigate('/admin');
  } else {
    navigate('/home');
  }
};
```

---

## ✅ **CHECKLIST**

- [x] AuthContext setup
- [x] ProtectedRoute component
- [x] AdminRoute component
- [x] Routes protected in App.jsx
- [x] Role-based menu in Header
- [x] Login/Register lưu role
- [x] Access Denied page
- [x] Loading states
- [ ] Backend API protection (QUAN TRỌNG!)
- [ ] Token refresh mechanism
- [ ] Error handling improvements
- [ ] Security audit

---

## 📞 **SUMMARY**

### **✅ Đã hoàn thành:**
- Phân quyền cơ bản với role `admin` và `user`
- Protected routes cho admin panel
- UI/UX cho access denied
- Integration với AuthContext

### **⚠️ Cần làm tiếp:**
- **Backend validation** (CRITICAL!)
- Token refresh
- Better error handling
- Security enhancements

---

**Version:** 1.0
**Last Updated:** 2025-11-03
**Status:** ✅ Beta - Cần review security
