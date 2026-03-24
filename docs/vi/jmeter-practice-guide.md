# Hướng dẫn thực hành JMeter với project task-management

Tài liệu này đi cùng bộ file mẫu đã được thêm sẵn trong repo để bạn có thể:

- mở `JMeter`
- chạy một bài test thật trên project này
- hiểu mình đang chỉnh gì và chỉnh ở đâu

Nếu bạn chưa đọc phần lý thuyết trước, xem thêm:

- [Bộ tổng ôn JMeter](./jmeter-review-guide.md)

---

## 1. Bộ file đã có sẵn trong repo

Bạn đã có sẵn 2 file thực hành:

- `jmeter/task-management-login-tasks.jmx`
- `jmeter/users.csv`

### Vai trò của từng file

`task-management-login-tasks.jmx`

- là `Test Plan` mẫu
- chứa flow `login -> extract token -> GET /tasks`

`users.csv`

- chứa nhiều account test
- để các thread không phải dùng chung một user

---

## 2. Trước khi chạy cần chuẩn bị gì

Bạn cần:

- `Docker` hoặc môi trường chạy được project
- `Apache JMeter`
- project đang chạy ở `http://localhost:3000`

### Cách chạy project

Từ thư mục gốc repo:

```bash
docker-compose up --build
```

Khi hệ thống chạy xong, API sẽ có ở:

```text
http://localhost:3000
```

---

## 3. Mở file JMeter mẫu

Trong `JMeter`:

1. chọn `File -> Open`
2. mở file `jmeter/task-management-login-tasks.jmx`

Sau khi mở, bạn sẽ thấy đại ý cấu trúc như sau:

```text
Test Plan
  -> Thread Group
      -> CSV Users
      -> HTTP Request Defaults
      -> Default JSON Headers
      -> POST /auth/login
          -> Extract JWT Token
          -> Login under 5000ms
      -> GET /tasks?page=1&limit=5&status=TODO
          -> Auth Header
          -> Tasks under 800ms
      -> View Results Tree
      -> Summary Report
      -> Aggregate Report
```

---

## 4. File mẫu này đang làm gì

Flow hiện tại là:

```text
Mỗi user ảo:
  -> lấy email/password từ users.csv
  -> POST /auth/login
  -> extract field $.token
  -> gắn token vào header Authorization
  -> GET /tasks?page=1&limit=5&status=TODO
```

Nói ngắn gọn:

- request đầu để lấy token
- request sau dùng token đó để gọi API protected

Đây là flow rất phù hợp để luyện `JMeter` vì nó sát hệ thống thật.

---

## 5. Cấu hình mặc định trong file mẫu

Hiện tại file `.jmx` được set ở mức nhẹ để bạn debug trước.

| Thành phần | Giá trị mặc định |
|---|---|
| `Threads` | `10` |
| `Ramp-Up` | `10 giây` |
| `Loop Count` | `3` |
| `Protocol` | `http` |
| `Host` | `localhost` |
| `Port` | `3000` |
| `Tasks path` | `/tasks?page=1&limit=5&status=TODO` |

### Ý nghĩa

- `10` user ảo
- tăng dần trong `10` giây
- mỗi user lặp flow `3` lần

Đây là mức đủ an toàn để kiểm tra script trước khi tăng tải.

---

## 6. Chạy lần đầu như thế nào

Hãy chạy theo thứ tự này:

### Bước 1

Đảm bảo API đang chạy.

### Bước 2

Mở `View Results Tree`.

Mục tiêu:

- xem từng request có thành công không
- xem token có được lấy đúng không

### Bước 3

Nhấn `Start`.

### Bước 4

Kiểm tra:

- `POST /auth/login` có ra `200` không
- `GET /tasks` có ra `200` không
- response của login có token không
- request tasks có gửi header `Authorization` không

### Bước 5

Sau khi flow chạy đúng, mới nhìn `Summary Report` và `Aggregate Report`.

---

## 7. Nếu muốn chạy đúng kiểu smoke test

Hãy giữ gần như mặc định:

- `Threads = 10`
- `Ramp-Up = 10`
- `Loop = 3`

Mục tiêu của bài smoke test:

- script đúng
- login đúng
- token đúng
- không bị `401`
- không bị lỗi cấu hình

Ở bước này, đừng cố ép tải lớn.

---

## 8. Nếu muốn nâng thành load test cơ bản

Bạn có thể sửa `Thread Group` thành:

| Trường | Gợi ý |
|---|---|
| `Number of Threads` | `50` |
| `Ramp-Up Period` | `60` |
| `Loop Count` | `10` hoặc dùng scheduler |

### Mục tiêu

- đo `P95`
- xem `GET /tasks` có giữ được dưới ngưỡng mong muốn không
- xem `Error %` có còn bằng `0` không

### Nếu muốn chạy ổn định lâu hơn

Bật `Scheduler` và set:

- duration `600` giây

Hiểu là:

- chạy liên tục khoảng `10 phút`

---

## 9. Nếu muốn đổi endpoint cần test

Trong file mẫu đang có biến:

- `tasks_path`

Hiện mặc định là:

```text
/tasks?page=1&limit=5&status=TODO
```

Bạn có thể đổi thành:

```text
/tasks?page=1&limit=10
```

hoặc:

```text
/projects
```

Nếu đổi sang endpoint protected khác, logic chung vẫn giữ nguyên:

- login
- lấy token
- gọi endpoint có auth

---

## 10. Nếu muốn thêm request mới

Ví dụ muốn test thêm `GET /projects`.

Làm như sau:

1. copy request `GET /tasks`
2. đổi tên thành `GET /projects`
3. đổi path thành `/projects`
4. giữ nguyên `Auth Header`

### Vì sao cách này tiện

Vì bạn không phải dựng lại phần login hay token extraction từ đầu.

---

## 11. users.csv hoạt động thế nào

File:

```text
jmeter/users.csv
```

Nội dung hiện tại:

```csv
email,password
alice@test.com,Alice123!
bob@test.com,Bob123!
charlie@test.com,Charlie123!
admin@test.com,Admin123!
```

Trong login request, body đang dùng:

```json
{
  "email": "${email}",
  "password": "${password}"
}
```

Tức là:

- mỗi lần chạy, JMeter sẽ lấy dữ liệu từ CSV
- rồi thay vào body request

### Khi nào cần sửa file này

- khi bạn đổi seed data
- khi thêm account mới
- khi muốn nhiều user test hơn

---

## 12. Cách đọc kết quả của file mẫu

Sau khi chạy, hãy đọc theo thứ tự này:

### 1. View Results Tree

Dùng để debug.

Bạn cần check:

- login có thành công không
- token extract có đúng không
- tasks request có bị `401` không

### 2. Summary Report

Dùng để xem nhanh:

- số sample
- average
- min
- max
- error %
- throughput

### 3. Aggregate Report

Dùng để đọc kỹ hơn, đặc biệt là:

- `90% Line`
- `95% Line`
- `99% Line`

Nếu mục tiêu là:

```text
P95 <= 800ms
```

thì đây là nơi rất đáng xem.

---

## 13. Kết quả thế nào thì coi là ổn

Với bài sample này, tối thiểu bạn nên mong đợi:

- `POST /auth/login` thành công
- `GET /tasks` thành công
- `Error % = 0`
- không có `401`

Nếu chạy load test cơ bản, bạn có thể tự đặt KPI như:

- `GET /tasks P95 <= 800ms`

Khi đó, kết luận sẽ rõ hơn:

- đạt KPI
- hay không đạt KPI

---

## 14. Các lỗi bạn có thể gặp ngay lần đầu

## Lỗi 1: Connection refused

Nguyên nhân thường là:

- API chưa chạy
- sai port

Cách xử lý:

- kiểm tra `docker-compose up --build`
- kiểm tra `host`, `port` trong `Test Plan`

## Lỗi 2: Login ra 401

Nguyên nhân thường là:

- sai password trong `users.csv`
- seed data chưa đúng

Cách xử lý:

- đối chiếu lại account trong README

## Lỗi 3: GET /tasks ra 401

Nguyên nhân thường là:

- token chưa extract đúng
- header `Authorization` chưa gắn đúng

Cách xử lý:

- xem response login trong `View Results Tree`
- kiểm tra biến `${token}`

## Lỗi 4: File CSV không đọc được

Nguyên nhân thường là:

- mở `.jmx` từ nơi khác
- đường dẫn file CSV bị sai

Cách xử lý:

- giữ `users.csv` cùng thư mục với file `.jmx`
- hoặc đổi `filename` trong `CSV Data Set Config` sang đường dẫn đúng

---

## 15. Bài tập thực hành nên làm tiếp

Sau khi chạy được file mẫu, bạn nên tự làm thêm 4 bài:

### Bài 1

Đổi `tasks_path` thành:

```text
/tasks?page=1&limit=10
```

Rồi so sánh kết quả với `limit=5`.

### Bài 2

Copy request `GET /tasks` để tạo `GET /projects`.

So sánh:

- average
- P95
- throughput

### Bài 3

Tăng `Threads` từ `10` lên `50`.

Quan sát:

- response time tăng bao nhiêu
- có lỗi phát sinh hay không

### Bài 4

Bật `Scheduler` và chạy `10 phút`.

Quan sát:

- error có tăng dần không
- response time có xấu dần không

---

## 16. Cách nói về bài test này trong phỏng vấn

Bạn có thể nói ngắn gọn:

```text
Em đã dựng một JMeter test plan cho flow login và gọi API protected.
Script dùng CSV Data Set Config để đọc nhiều account, sau đó dùng JSON Extractor lấy JWT token từ login response.
Tiếp theo em dùng token đó để gọi GET /tasks và đọc kết quả ở Summary Report, Aggregate Report.
Khi đánh giá, em ưu tiên nhìn Error %, P95 và Throughput.
```

Đây là câu trả lời khá gọn nhưng đủ cho thấy bạn hiểu và đã từng làm thật.

---

## 17. Gợi ý nâng cấp bộ file này sau này

Nếu muốn nâng bộ thực hành lên thêm một mức, bạn có thể:

- thêm request `GET /projects`
- thêm `POST /projects`
- thêm `PATCH /tasks/:id`
- thêm `Response Assertion` cho status code
- tách thành 2 thread group: `smoke` và `load`
- xuất kết quả ra file `.jtl`

---

## 18. Kết luận

Bộ file hiện tại đủ để bạn:

- mở JMeter lên và chạy ngay
- hiểu flow auth trong performance test
- luyện `CSV Data Set Config`
- luyện `JSON Extractor`
- đọc `Summary Report` và `Aggregate Report`

Nếu bạn muốn, bước tiếp theo mình có thể làm tiếp:

1. thêm một file `.jmx` thứ hai cho `GET /projects`,
2. thêm một file `.jmx` kiểu stress test,
3. hoặc nâng file hiện tại thành bộ có `Response Assertion` chi tiết hơn.
