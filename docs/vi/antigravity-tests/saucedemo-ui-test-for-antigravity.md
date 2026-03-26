# Test UI — Sauce Demo (file chạy bằng Google Antigravity)

Trang mục tiêu cố định: **[Sauce Demo](https://www.saucedemo.com/)** — shop demo dùng để luyện automation/UI test.

**Mục đích file này:** bạn copy **mục “Prompt giao cho Antigravity”** (cuối file) vào Antigravity; agent dùng **browser-in-the-loop** để thực hiện, chụp màn hình, tóm tắt pass/fail. Bạn vẫn **đối chiếu artifact** với bảng testcase bên dưới (human gate).

---

## 1. Môi trường & dữ liệu test

| Mục | Giá trị |
|-----|---------|
| URL | `https://www.saucedemo.com/` |
| User hợp lệ | `standard_user` / `secret_sauce` |
| User bị khóa | `locked_out_user` / `secret_sauce` |
| User sai mật khẩu | `standard_user` / `wrong_password` |

**Lưu ý:** Không dùng tài khoản cá nhân; đây là site demo công khai.

---

## 2. Tiêu chí chung (Definition of Done cho phiên test)

- Mỗi TC: ghi **Pass** hoặc **Fail**; nếu Fail thì có **bước tái hiện** + **ảnh màn hình** (nếu agent hỗ trợ).
- Không coi “agent báo Pass” là đủ cho sign-off production — đây là bài **luyện / smoke**.

---

## 3. Test case chi tiết

### TC-01 — Đăng nhập thành công và vào danh sách sản phẩm

| Field | Nội dung |
|-------|----------|
| Mục tiêu | Xác nhận login đúng user mở được trang inventory |
| Bước | 1. Mở URL. 2. Nhập `standard_user` / `secret_sauce`. 3. Bấm Login. |
| Kỳ vọng | URL chứa `inventory.html`; thấy tiêu đề kiểu “Products”; có danh sách item (ví dụ “Sauce Labs Backpack”). |

### TC-02 — Đăng nhập thất bại (sai mật khẩu)

| Field | Nội dung |
|-------|----------|
| Mục tiêu | Hệ thống từ chối và hiển thị lỗi rõ ràng |
| Bước | 1. Mở URL. 2. Nhập `standard_user` / `wrong_password`. 3. Bấm Login. |
| Kỳ vọng | Vẫn ở trang login; có thông báo lỗi (Epic sadface / invalid credentials — đúng theo UI thực tế). |

### TC-03 — User bị khóa (locked out)

| Field | Nội dung |
|-------|----------|
| Mục tiêu | Không vào được inventory |
| Bước | 1. Mở URL. 2. Nhập `locked_out_user` / `secret_sauce`. 3. Bấm Login. |
| Kỳ vọng | Không chuyển sang inventory; có message báo user locked out. |

### TC-04 — Sort sản phẩm (inventory)

| Field | Nội dung |
|-------|----------|
| Tiền điều kiện | Đã login TC-01 thành công |
| Bước | Trên trang inventory, mở dropdown sort (Name A-Z hoặc Price low to high), chọn một option. |
| Kỳ vọng | Thứ tự hiển thị thay đổi theo lựa chọn (quan sát được ít nhất 2 item đầu khác thứ tự hoặc đúng logic sort). |

### TC-05 — Thêm sản phẩm vào giỏ và mở giỏ

| Field | Nội dung |
|-------|----------|
| Tiền điều kiện | Đã login; đang ở inventory |
| Bước | 1. Bấm “Add to cart” cho 1 sản phẩm. 2. Bấm icon giỏ hàng. |
| Kỳ vọng | Trang cart hiển thị đúng sản phẩm đã thêm; số lượng badge giỏ (nếu có) khớp. |

---

## 4. Prompt giao cho Antigravity (copy toàn khối)

Dán nguyên khối dưới đây vào Antigravity (chỉnh ngôn ngữ UI nếu site đổi text).

```text
Bạn là agent test UI. Dùng trình duyệt tích hợp (browser-in-the-loop).

Mục tiêu: Thực hiện bộ kiểm thử sau trên https://www.saucedemo.com/ và báo cáo kết quả.

Dữ liệu test:
- User OK: standard_user / secret_sauce
- User locked: locked_out_user / secret_sauce
- Sai MK: standard_user / wrong_password

Thực hiện lần lượt:

TC-01 Đăng nhập thành công
- Login standard_user / secret_sauce
- Pass nếu: vào trang inventory (URL có inventory), thấy "Products" và ít nhất một sản phẩm ví dụ Sauce Labs Backpack

TC-02 Sai mật khẩu
- Login standard_user / wrong_password
- Pass nếu: không vào inventory, có thông báo lỗi đăng nhập

TC-03 Locked out
- Login locked_out_user / secret_sauce
- Pass nếu: không vào inventory, có message locked out

TC-04 Sort (sau khi TC-01 xong, cùng session nếu có thể; nếu session reset thì login lại)
- Chọn một option sort từ dropdown trên inventory
- Pass nếu: thứ tự sản phẩm thay đổi hợp lý theo option (mô tả ngắn 2 item đầu)

TC-05 Giỏ hàng
- Add to cart 1 item, mở trang cart
- Pass nếu: cart hiển thị đúng item

Yêu cầu đầu ra:
1. Bảng kết quả: TC | Pass/Fail | Ghi chú ngắn
2. Với mỗi TC Fail: bước tái hiện cụ thể
3. Chụp screenshot các bước quan trọng (login success, error message, cart) nếu công cụ cho phép
4. Nếu không chắc Pass/Fail, ghi "Cần xác nhận thủ công" và nêu lý do

Không dùng dữ liệu production; chỉ site demo trên.
```

---

## 5. Checklist sau khi agent chạy xong

- [ ] Đối chiếu từng TC với bảng mục 3  
- [ ] Tự mở lại 1 TC quan trọng (ví dụ TC-01) để xác minh  
- [ ] Nếu báo cáo bug: gửi kèm artifact (screenshot + bước) theo template team  

---

## Tham khảo

- Hướng dẫn tổng quát Antigravity + UI: [antigravity-ui-testing-guide.md](../antigravity-ui-testing-guide.md)
