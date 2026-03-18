# JIRA Tickets — Hệ Thống Quản Lý Công Việc

**Dự án:** TMS
**Sprint:** 1
**Chú thích trạng thái:** To Do | In Progress | Done | Blocked

---

## TASK-001 — Đăng Ký Người Dùng

**Loại:** Story
**Độ ưu tiên:** Cao
**Trạng thái:** Done

**Mô tả:**
Là người dùng mới, tôi muốn đăng ký tài khoản để có thể truy cập hệ thống quản lý công việc.

**Tiêu chí chấp nhận:**
- Người dùng có thể gửi email và mật khẩu để tạo tài khoản
- Email phải là duy nhất trong hệ thống; đăng ký trùng lặp sẽ trả về lỗi
- Mật khẩu được lưu trữ an toàn (đã mã hóa, không bao giờ lưu dạng plaintext)
- Đăng ký thành công trả về id, email và role của người dùng vừa tạo
- Role mặc định là USER nếu không chỉ định
- Mật khẩu phải có ít nhất 6 ký tự

**Ghi chú:**
- Tài khoản Admin có thể được tạo bằng cách truyền `role: "ADMIN"` trong request body
- Không yêu cầu xác minh email trong sprint này

---

## TASK-002 — Đăng Nhập Người Dùng

**Loại:** Story
**Độ ưu tiên:** Cao
**Trạng thái:** Done

**Mô tả:**
Là người dùng đã đăng ký, tôi muốn đăng nhập bằng email và mật khẩu để nhận token xác thực.

**Tiêu chí chấp nhận:**
- Người dùng gửi email và mật khẩu
- Trả về JWT token khi thành công
- Trả về 401 nếu thông tin đăng nhập không hợp lệ
- Token phải sử dụng được cho tất cả các endpoint được bảo vệ

**Ghi chú:**
- Token hết hạn sau 24 giờ
- Cấu trúc response phải tuân theo định dạng xác thực chuẩn của dự án

---

## TASK-003 — Tạo Dự Án

**Loại:** Story
**Độ ưu tiên:** Cao
**Trạng thái:** Done

**Mô tả:**
Là người dùng đã xác thực, tôi muốn tạo một dự án để tổ chức các công việc của mình.

**Tiêu chí chấp nhận:**
- Người dùng đã xác thực có thể POST đến /projects với tên dự án
- Người tạo tự động trở thành chủ sở hữu dự án
- Response bao gồm đối tượng dự án đầy đủ gồm id, name, ownerId và createdAt

**Ghi chú:**
- Tên dự án không được để trống

---

## TASK-004 — Danh Sách Dự Án

**Loại:** Story
**Độ ưu tiên:** Cao
**Trạng thái:** Done

**Mô tả:**
Là người dùng, tôi muốn xem danh sách dự án để điều hướng đến dự án phù hợp.

**Tiêu chí chấp nhận:**
- Người dùng đã xác thực có thể GET /projects
- Người dùng chỉ nhìn thấy các dự án của chính họ
- Response là một mảng các đối tượng dự án

**Ghi chú:**
- Chỉ trả về dự án mà người dùng hiện tại là chủ sở hữu

---

## TASK-005 — Cập Nhật Dự Án

**Loại:** Story
**Độ ưu tiên:** Trung bình
**Trạng thái:** Done

**Mô tả:**
Là chủ sở hữu dự án, tôi muốn đổi tên dự án của mình.

**Tiêu chí chấp nhận:**
- Người dùng đã xác thực có thể PATCH /projects/:id với tên mới
- Trả về 404 nếu dự án không tồn tại
- Trả về đối tượng dự án đã được cập nhật

**Ghi chú:**
- Chỉ chủ sở hữu mới được phép cập nhật tên dự án

---

## TASK-006 — Xóa Dự Án

**Loại:** Story
**Độ ưu tiên:** Trung bình
**Trạng thái:** Done

**Mô tả:**
Là chủ sở hữu dự án, tôi muốn xóa một dự án mà tôi không còn cần nữa.

**Tiêu chí chấp nhận:**
- Người dùng đã xác thực có thể DELETE /projects/:id
- Trả về `{ "message": "deleted" }` khi thành công
- Trả về 404 nếu dự án không tồn tại
- Khi xóa dự án, tất cả task thuộc dự án đó cũng phải bị xóa theo

**Ghi chú:**
- Chỉ chủ sở hữu mới được phép xóa dự án

---

## TASK-007 — Tạo Task

**Loại:** Story
**Độ ưu tiên:** Cao
**Trạng thái:** Done

**Mô tả:**
Là người dùng, tôi muốn tạo một task trong một dự án.

**Tiêu chí chấp nhận:**
- Người dùng đã xác thực có thể POST đến /tasks
- Task phải thuộc một dự án hợp lệ (projectId bắt buộc)
- Task có thể được giao tùy chọn cho một người dùng (assigneeId)
- Trạng thái mặc định là TODO nếu không cung cấp
- Response bao gồm đối tượng task đầy đủ

**Ghi chú:**
- Xác thực dữ liệu đầu vào trước khi lưu — các trường bắt buộc phải được kiểm tra

---

## TASK-008 — Danh Sách Task

**Loại:** Story
**Độ ưu tiên:** Cao
**Trạng thái:** Done

**Mô tả:**
Là người dùng, tôi muốn xem danh sách task để biết công việc cần làm.

**Tiêu chí chấp nhận:**
- Người dùng đã xác thực có thể GET /tasks
- Kết quả bao gồm thông tin dự án và người được giao liên quan
- Task có thể được lọc theo dự án và trạng thái
- Kết quả được phân trang

**Ghi chú:**
- Bộ lọc trạng thái phải khớp chính xác với giá trị enum (không phải tìm kiếm một phần)
- Thông số phân trang cần được xác nhận thêm

---

## TASK-009 — Phân Trang Kết Quả Task

**Loại:** Task
**Độ ưu tiên:** Trung bình
**Trạng thái:** Done

**Mô tả:**
Kết quả danh sách task cần được phân trang để tránh trả về quá nhiều dữ liệu cùng lúc.

**Tiêu chí chấp nhận:**
- GET /tasks chấp nhận tham số `page` và `limit`
- Response bao gồm object `meta` với các trường `page`, `limit` và `total`
- Kích thước trang mặc định là 10

**Ghi chú:**
- Phân trang phải nhất quán — page 1 phải trả về tập kết quả đầu tiên
- Công thức offset chưa được ghi lại cụ thể; developer tự triển khai theo chuẩn thông thường

---

## TASK-010 — Lọc Task Theo Trạng Thái

**Loại:** Task
**Độ ưu tiên:** Trung bình
**Trạng thái:** Done

**Mô tả:**
Người dùng cần có khả năng lọc danh sách task theo giá trị trạng thái.

**Tiêu chí chấp nhận:**
- GET /tasks chấp nhận tham số query để lọc theo trạng thái
- Lọc theo `TODO` chỉ trả về các task có trạng thái TODO
- Lọc theo `IN_PROGRESS` chỉ trả về các task có trạng thái IN_PROGRESS
- Lọc theo `DONE` chỉ trả về các task có trạng thái DONE
- Bộ lọc phải khớp chính xác — không chấp nhận kết quả khớp một phần

**Ghi chú:**
- Tên tham số query là `status`
- Phân biệt chữ hoa chữ thường không bắt buộc

---

## TASK-011 — Cập Nhật Task

**Loại:** Story
**Độ ưu tiên:** Cao
**Trạng thái:** Done

**Mô tả:**
Là người dùng, tôi muốn cập nhật tiêu đề, mô tả, trạng thái hoặc người được giao của một task.

**Tiêu chí chấp nhận:**
- Người dùng đã xác thực có thể PATCH /tasks/:id
- Có thể cập nhật bất kỳ tổ hợp nào của title, description, status, assigneeId
- Trả về đối tượng task đã được cập nhật

**Ghi chú:**
- Xác thực trạng thái: status phải là một trong các giá trị enum hợp lệ
- Chỉ thành viên dự án liên quan mới được phép cập nhật task

---

## TASK-012 — Quy Trình Trạng Thái Task

**Loại:** Task
**Độ ưu tiên:** Trung bình
**Trạng thái:** Done

**Mô tả:**
Xác định và thực thi các chuyển đổi trạng thái hợp lệ của task.

**Tiêu chí chấp nhận:**
- Task bắt đầu ở trạng thái TODO theo mặc định
- Trạng thái có thể được thay đổi bởi người dùng có quyền
- Đặt trạng thái thành IN_PROGRESS phải cập nhật task thành IN_PROGRESS một cách chính xác
- Đặt trạng thái thành DONE phải cập nhật task thành DONE một cách chính xác
- Task ở trạng thái DONE không thể chuyển ngược về TODO

**Ghi chú:**
- Logic cập nhật phải áp dụng chính xác trạng thái được cung cấp trong request

---

## TASK-013 — Xóa Task

**Loại:** Story
**Độ ưu tiên:** Trung bình
**Trạng thái:** Done

**Mô tả:**
Là người dùng, tôi muốn xóa một task không còn liên quan nữa.

**Tiêu chí chấp nhận:**
- Người dùng đã xác thực có thể DELETE /tasks/:id
- Trả về `{ "message": "deleted" }` khi thành công
- Trả về 404 nếu task không tồn tại

**Ghi chú:**
- Quy tắc phân quyền cho việc xóa task chưa được định nghĩa rõ ràng — áp dụng giá trị mặc định hợp lý
- Việc xóa task là vĩnh viễn

---
