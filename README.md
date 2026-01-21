# Frontend Cây Gia Phả (Family Tree)

Dự án frontend hiển thị cây gia phả tương tác, được xây dựng với **React**, **TypeScript**, **Vite** và **React Flow**.

## 🌟 Tính năng chính

- **Trực quan hóa**: Hiển thị cây gia phả 3-4 thế hệ vớ bố cục tự động (Dagre).
- **Tương tác Roadmap**:
  - **Mở rộng / Thu gọn**: Bấm nút `+/-` để ẩn hiện nhánh con.
  - **Zoom / Pan**: Kéo thả và phóng to thu nhỏ mượt mà.
- **Chi tiết Thành viên**:
  - **Desktop**: Panel thông tin trượt từ phải sang.
  - **Mobile**: Bottom sheet trượt từ dưới lên, hỗ trợ chạm vuốt.
- **Tìm kiếm**: Tìm nhanh thành viên theo tên và tự động di chuyển tới vị trí node.
- **Giao diện**: Hiện đại, màu sắc trang nhã (Xanh/Be), responsive hoàn toàn.

## 🚀 Cài đặt và Chạy

Yêu cầu: Node.js (phiên bản 18+ khuyến nghị).

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Chạy server phát triển (Local)**:
   ```bash
   npm run dev
   ```
   Truy cập: `http://localhost:5173`

3. **Build cho production**:
   ```bash
   npm run build
   ```

## 📂 Cấu trúc thư mục

- `src/components/Tree`: Chứa `FamilyTree` (logic chính) và `FamilyNode` (giao diện từng node).
- `src/components/UI`: Các thành phần giao diện phụ (`SearchBar`, `MemberDetailPanel`).
- `src/store`: Quản lý state global với Zustand.
- `src/utils`: Các hàm tiện ích xử lý logic cây và tính toán layout.
- `src/data`: Dữ liệu giả lập (Mock data).

## 🛠 Công nghệ sử dụng

- **Vite**: Build tool siêu tốc.
- **React Flow**: Thư viện lõi để vẽ cây và xử lý tương tác không gian.
- **TailwindCSS**: Styling utility-first.
- **Zustand**: Quản lý State đơn giản và hiệu quả.
- **Framer Motion**: Animation mượt mà cho UI.
