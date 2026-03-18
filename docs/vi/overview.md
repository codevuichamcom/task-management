# Hệ Thống Thực Hành QA – Tổng Quan

Chào mừng bạn đến với hệ thống thực hành QA.

Dự án này mô phỏng một hệ thống backend thực tế, trong đó yêu cầu, tài liệu và phần triển khai có thể không hoàn toàn nhất quán với nhau.

Mục tiêu của bạn là:
- Hiểu rõ hành vi của hệ thống
- Kiểm tra chức năng API
- Xác minh tính nhất quán của dữ liệu
- Phát hiện và báo cáo các vấn đề

---

## 📌 Phạm Vi

Đây là một Hệ thống Quản lý Công việc đơn giản với các module sau:

- Xác thực người dùng (đăng ký, đăng nhập)
- Quản lý dự án
- Quản lý công việc (task)

---

## 📚 Tài Liệu Có Sẵn

Bạn được cung cấp các tài liệu sau:

### 1. Đặc Tả API
👉 Xem: `./api-spec.md`

Bao gồm:
- Danh sách các endpoint
- Ví dụ về request và response
- Hành vi mong đợi của hệ thống

### 2. Jira Tickets
👉 Xem: `./jira-tickets.md`

Bao gồm:
- Mô tả tính năng
- Yêu cầu nghiệp vụ
- Các trường hợp sử dụng

### 3. Swagger UI
👉 Truy cập: `http://localhost:3000/api-docs`

Bao gồm:
- Giao diện thử nghiệm API tương tác
- Schema request/response
- Hỗ trợ xác thực Bearer token

---

## 🧪 Nhiệm Vụ Của Bạn

Với vai trò kỹ sư QA, bạn cần:

1. Đọc Jira tickets để hiểu yêu cầu
2. Sử dụng đặc tả API để khám phá các endpoint
3. Kiểm tra API bằng Postman hoặc công cụ tương tự
4. Xác minh dữ liệu trực tiếp trong cơ sở dữ liệu (PostgreSQL)
5. Phát hiện các sự không nhất quán, lỗi hoặc hành vi ngoài mong đợi
6. Viết báo cáo lỗi rõ ràng và có thể tái hiện

---

## ⚠️ Lưu Ý Quan Trọng

- Không phải tất cả tài liệu đều đảm bảo chính xác hoặc đầy đủ
- Một số hành vi của hệ thống có thể khác với tài liệu mô tả
- Bạn có thể cần đối chiếu nhiều nguồn để xác định hành vi mong đợi

---

## 🎯 Mục Tiêu

Mục đích của bài tập này là mô phỏng công việc QA thực tế, trong đó:
- Yêu cầu có thể không rõ ràng hoặc chưa đầy đủ
- Tài liệu có thể lỗi thời hoặc không nhất quán
- Hệ thống có thể chứa các lỗi tiềm ẩn

Hãy tập trung vào:
- Tư duy phản biện
- Kiểm tra cẩn thận
- Giao tiếp rõ ràng và chuyên nghiệp

---

Chúc bạn thành công! 🚀
