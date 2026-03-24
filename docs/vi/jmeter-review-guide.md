# Bộ tổng ôn JMeter dễ hiểu cho Tester

Tài liệu này được viết để bạn ôn nhanh `JMeter` theo kiểu:

- hiểu đúng bản chất
- nhớ được các thành phần chính
- biết cách dựng bài test cơ bản
- biết đọc kết quả
- áp dụng ngay vào project `task-management`

Nếu bạn từng thấy `JMeter` rối vì quá nhiều thành phần như `Thread Group`, `Sampler`, `Listener`, `Assertion`, tài liệu này sẽ gom lại thành một bức tranh đơn giản.

---

## 1. JMeter là gì

Hiểu ngắn gọn:

- `JMeter` là công cụ gửi rất nhiều request theo kịch bản bạn định nghĩa sẵn
- mục tiêu là xem hệ thống có đáp ứng tốt khi nhiều người dùng cùng thao tác hay không

Nó thường được dùng để:

- đo thời gian phản hồi của API
- kiểm tra hệ thống chịu được bao nhiêu tải
- phát hiện lỗi khi số lượng request tăng lên
- theo dõi các chỉ số như `Average`, `P95`, `Throughput`, `Error %`

### Hình dung cực nhanh

```text
Người dùng thật
   -> đăng nhập
   -> lấy token
   -> gọi API lấy danh sách task
   -> cập nhật task

JMeter
   -> giả lập hàng chục / hàng trăm user làm việc đó cùng lúc
   -> đo thời gian phản hồi
   -> đếm số request thành công / thất bại
   -> tổng hợp báo cáo
```

---

## 2. Khi nào dùng JMeter

Bạn dùng `JMeter` khi muốn trả lời các câu hỏi như:

- Nếu có `50` user cùng gọi `GET /tasks` thì API còn nhanh không?
- Nếu tăng lên `200` user thì hệ thống bắt đầu chậm ở mức nào?
- API có còn giữ `P95 <= 800ms` như JD mong muốn không?
- Khi tải cao thì có phát sinh `401`, `403`, `500`, timeout hay không?

### Không nên hiểu nhầm

`JMeter` không tự nói cho bạn biết bug nằm ở đâu.

Nó chỉ cho bạn thấy:

- hệ thống nhanh hay chậm
- tỷ lệ lỗi có tăng hay không
- ngưỡng tải nào bắt đầu có vấn đề

Sau đó bạn mới dùng log, DB, monitoring, hoặc trao đổi với dev để tìm nguyên nhân.

---

## 3. 4 loại test rất hay bị nhầm

## 3.1 Load Test

Kiểm tra hệ thống dưới mức tải bình thường hoặc kỳ vọng.

Ví dụ:

- giả lập `50` user cùng xem danh sách task trong `10 phút`

Mục tiêu:

- xem hệ thống có chạy ổn ở mức tải dự kiến hay không

## 3.2 Stress Test

Đẩy tải lên cao hơn mức bình thường để tìm giới hạn.

Ví dụ:

- tăng dần từ `50 -> 100 -> 200 -> 400` user

Mục tiêu:

- xem khi nào response time tăng mạnh
- khi nào lỗi bắt đầu xuất hiện
- hệ thống gãy kiểu gì khi quá tải

## 3.3 Spike Test

Tải tăng đột ngột trong thời gian ngắn.

Ví dụ:

- từ `20` user nhảy lên `200` user trong vài giây

Mục tiêu:

- xem hệ thống có bị sốc tải hay không

## 3.4 Soak Test

Giữ tải ổn định trong thời gian dài.

Ví dụ:

- `80` user chạy liên tục trong `2 giờ`

Mục tiêu:

- tìm memory leak
- tìm việc tài nguyên bị tăng dần theo thời gian

### Mẹo nhớ nhanh

- `Load`: tải bình thường
- `Stress`: ép quá sức
- `Spike`: tăng sốc
- `Soak`: ngâm lâu

---

## 4. Các chỉ số quan trọng nhất

Bạn không cần nhớ mọi thứ trong report. Hãy nhớ chắc các chỉ số này.

| Chỉ số | Ý nghĩa dễ hiểu | Khi đọc nên nghĩ gì |
|---|---|---|
| `Response Time` | 1 request mất bao lâu để nhận phản hồi | càng thấp càng tốt |
| `Average` | thời gian phản hồi trung bình | dễ nhìn nhưng chưa đủ |
| `P95` | 95% request có thời gian phản hồi nhỏ hơn hoặc bằng giá trị này | quan trọng hơn average |
| `Error %` | phần trăm request lỗi | phải rất thấp, lý tưởng là `0%` trong bài test ổn định |
| `Throughput` | số request xử lý được trong một đơn vị thời gian | càng cao càng tốt nếu response time vẫn ổn |
| `Latency` | thời gian chờ trước khi có dữ liệu phản hồi đầu tiên | giúp hiểu độ trễ mạng / server |

## Vì sao `P95` quan trọng hơn `Average`

Ví dụ có `100` request:

- `95` request chạy trong `400ms`
- `5` request chạy trong `5000ms`

Lúc này:

- `Average` có thể vẫn nhìn "không quá tệ"
- nhưng trải nghiệm người dùng thật vẫn xấu vì có một nhóm request rất chậm

Nên trong performance testing, `P95` thường đáng tin hơn `Average`.

### Mẹo nhớ nhanh

`P95 = nhìn phần đông người dùng đang trải nghiệm gì`

---

## 5. Cấu trúc JMeter theo cách dễ nhớ

Nếu nhìn giao diện `JMeter` lần đầu, bạn có thể nhớ nó như sau:

```text
Test Plan
  -> Thread Group
      -> HTTP Request Defaults
      -> HTTP Header Manager
      -> CSV Data Set Config
      -> Sampler (HTTP Request)
      -> Post-Processor
      -> Assertion
      -> Listener
```

## 5.1 Test Plan

Là "bản thiết kế tổng" của bài test.

Bạn có thể hiểu nó là:

- toàn bộ kịch bản performance test
- nơi chứa mọi cấu hình và bước chạy

## 5.2 Thread Group

Đây là phần cực kỳ quan trọng.

Nó quyết định:

- có bao nhiêu user ảo
- tăng user lên trong bao lâu
- test chạy bao lâu hoặc lặp bao nhiêu lần

Ba thông số hay gặp:

- `Number of Threads`: số user ảo
- `Ramp-Up Period`: thời gian để tăng đủ số user
- `Loop Count`: mỗi user lặp lại kịch bản bao nhiêu lần

### Ví dụ

- `50 threads`
- `ramp-up 100 seconds`

Hiểu là:

- trong `100 giây`, JMeter tăng dần đến đủ `50` user
- trung bình khoảng `2 giây` thêm `1` user

## 5.3 Sampler

`Sampler` là hành động mà user thực hiện.

Trong test API, thường dùng:

- `HTTP Request`

Ví dụ:

- `POST /auth/login`
- `GET /tasks`
- `PATCH /tasks/:id`

## 5.4 Config Element

Là nơi chứa cấu hình dùng chung.

Hay gặp nhất:

- `HTTP Request Defaults`: set host, port, protocol
- `HTTP Header Manager`: set `Content-Type`, `Authorization`
- `CSV Data Set Config`: đọc dữ liệu test từ file CSV

## 5.5 Post-Processor

Dùng để lấy dữ liệu từ response ra để dùng tiếp.

Ví dụ:

- login xong lấy `token`
- lưu token vào biến
- request sau dùng `Bearer ${token}`

Hay gặp:

- `JSON Extractor`

## 5.6 Assertion

Dùng để kiểm tra response có đúng hay không.

Ví dụ:

- status code phải là `200`
- response phải có field `access_token`
- response time phải nhỏ hơn một ngưỡng nào đó

Nếu không có assertion, bạn có thể bắn được rất nhiều request nhưng lại không chắc response có đúng hay không.

## 5.7 Listener

Là nơi xem kết quả.

Hay gặp:

- `View Results Tree`
- `Summary Report`
- `Aggregate Report`

### Mẹo nhớ bằng một câu

- `Thread Group`: bao nhiêu user chạy
- `Sampler`: user làm gì
- `Config`: cấu hình dùng chung
- `Post-Processor`: lấy dữ liệu từ response
- `Assertion`: kiểm tra đúng sai
- `Listener`: xem kết quả

---

## 6. Flow chuẩn của một bài test API bằng JMeter

Đây là flow bạn nên nhớ nhất.

```text
1. Chọn kịch bản cần test
2. Xác định số user, ramp-up, thời gian chạy
3. Chuẩn bị test data
4. Dựng request trong JMeter
5. Nếu có login thì extract token
6. Gắn assertion để kiểm tra response
7. Chạy test
8. Đọc P95, error %, throughput
9. Kết luận pass/fail theo KPI
```

### Nếu chỉ nhớ 1 câu

`Chuẩn bị đúng dữ liệu + dựng đúng flow + đọc đúng P95`

---

## 7. Áp vào project task-management này như thế nào

Project hiện tại đủ tốt để bạn ôn `JMeter` ở mức cơ bản đến khá thực hành.

Lý do:

- có API thật để gọi
- có login lấy JWT
- có endpoint protected
- có filter, pagination
- có seed data
- có nhiều user để mô phỏng vai trò khác nhau

Tham khảo thêm:

- [API spec](./api-spec.md)
- [Jira tickets](./jira-tickets.md)

## 7.1 Endpoint phù hợp để luyện

| Mục tiêu luyện | Endpoint |
|---|---|
| Login lấy token | `POST /auth/login` |
| Gọi API protected | `GET /projects` |
| Test list có filter/pagination | `GET /tasks?page=1&limit=5&statusFilter=TODO` |
| Test ghi dữ liệu | `POST /projects`, `POST /tasks` |
| Test cập nhật | `PATCH /tasks/:id` |

## 7.2 Seed users có thể dùng

| Email | Password |
|---|---|
| `admin@test.com` | `Admin123!` |
| `alice@test.com` | `Alice123!` |
| `bob@test.com` | `Bob123!` |
| `charlie@test.com` | `Charlie123!` |

## 7.3 Flow thực tế nên dựng

```text
User ảo
  -> POST /auth/login
  -> extract token
  -> GET /tasks?page=1&limit=5
  -> GET /projects
  -> PATCH /tasks/:id    (nếu muốn test update)
```

---

## 8. Cách dựng Test Plan đầu tiên

Đây là bài tập nhập môn rất hợp với project này.

## Mục tiêu

- giả lập nhiều user đăng nhập
- sau đó gọi `GET /tasks`
- đo `P95`, `Average`, `Error %`

## Các bước

### Bước 1: Tạo Test Plan

Tạo:

- `Test Plan`
- `Thread Group`

### Bước 2: Cấu hình Thread Group

Ví dụ cấu hình ban đầu:

| Trường | Giá trị gợi ý |
|---|---|
| `Number of Threads` | `20` |
| `Ramp-Up Period` | `20` |
| `Loop Count` | `5` |

Hiểu là:

- `20` user ảo
- tăng dần trong `20` giây
- mỗi user lặp `5` lần

### Bước 3: Thêm HTTP Request Defaults

Ví dụ:

| Trường | Giá trị |
|---|---|
| Protocol | `http` |
| Server Name | `localhost` |
| Port Number | `3000` |

### Bước 4: Thêm HTTP Header Manager

Thêm:

- `Content-Type: application/json`

### Bước 5: Tạo request login

Tên request:

- `POST Login`

Method:

- `POST`

Path:

- `/auth/login`

Body:

```json
{
  "email": "alice@test.com",
  "password": "Alice123!"
}
```

### Bước 6: Extract token

Thêm `JSON Extractor` vào request login:

| Trường | Giá trị |
|---|---|
| Names of created variables | `token` |
| JSON Path Expressions | `$.access_token` |

### Bước 7: Tạo request lấy task list

Tên request:

- `GET Tasks`

Method:

- `GET`

Path:

- `/tasks?page=1&limit=5`

Trong `HTTP Header Manager` của request này thêm:

- `Authorization: Bearer ${token}`

### Bước 8: Thêm Assertion

Cho request login:

- response code phải là `200`
- response phải chứa `access_token`

Cho request `GET /tasks`:

- response code phải là `200`

### Bước 9: Thêm Listener

Ban đầu nên dùng:

- `View Results Tree`
- `Summary Report`
- `Aggregate Report`

### Bước 10: Chạy thử nhỏ trước

Đừng chạy lớn ngay.

Hãy test trước với:

- `2 threads`
- `ramp-up 2`
- `loop 1`

Mục tiêu:

- xác nhận flow đúng
- token lấy đúng
- header đúng
- response không lỗi

Sau khi flow đúng rồi mới tăng tải.

---

## 9. 3 kịch bản ôn tập rất hợp với project này

## Kịch bản 1: Smoke Performance

Mục tiêu:

- kiểm tra nhanh hệ thống có chịu được tải nhẹ không

Gợi ý:

| Thành phần | Giá trị |
|---|---|
| User ảo | `10` |
| Ramp-up | `10 giây` |
| Duration hoặc Loop | `3-5 phút` hoặc loop nhỏ |
| API chính | `POST /auth/login`, `GET /tasks` |

Pass nếu:

- `Error % = 0`
- response time ổn định
- không có `401` do token lỗi

## Kịch bản 2: Load Test cơ bản

Mục tiêu:

- đo xem API list có còn ổn dưới tải vừa phải không

Gợi ý:

| Thành phần | Giá trị |
|---|---|
| User ảo | `50` |
| Ramp-up | `50-100 giây` |
| Thời gian chạy | `10-15 phút` |
| API chính | `GET /tasks?page=1&limit=5&statusFilter=TODO` |
| KPI ví dụ | `P95 <= 800ms`, `Error % = 0` |

Điểm cần quan sát:

- `P95` có vượt ngưỡng không
- `Average` và `P95` có chênh nhau quá nhiều không
- throughput có ổn định không

## Kịch bản 3: Stress Test

Mục tiêu:

- tìm ngưỡng bắt đầu chậm hoặc lỗi

Gợi ý:

```text
Round 1:  50 users
Round 2: 100 users
Round 3: 200 users
Round 4: 300 users
```

Ở mỗi round, ghi lại:

- `P95`
- `Error %`
- loại lỗi xuất hiện
- CPU / RAM nếu có theo dõi

Kết luận nên trả lời được:

- hệ thống bắt đầu bất ổn từ mức nào
- lỗi xuất hiện trước hay response time tăng mạnh trước

---

## 10. CSV Data Set Config dùng khi nào

Nếu bạn chỉ test bằng 1 user cố định, bài test sẽ kém thực tế.

Khi muốn nhiều user đăng nhập song song bằng nhiều tài khoản khác nhau, hãy dùng `CSV Data Set Config`.

Ví dụ file `users.csv`:

```csv
email,password
alice@test.com,Alice123!
bob@test.com,Bob123!
charlie@test.com,Charlie123!
admin@test.com,Admin123!
```

Sau đó trong login body:

```json
{
  "email": "${email}",
  "password": "${password}"
}
```

### Lợi ích

- tránh việc tất cả thread dùng chung 1 account
- bài test giống người dùng thật hơn
- dễ thay test data

---

## 11. JSON Extractor là gì và vì sao rất quan trọng

Rất nhiều bài test API fail không phải vì server yếu, mà vì script sai flow.

Ví dụ:

- login trả token
- nhưng bạn không extract được token
- request sau gửi `Authorization: Bearer `
- kết quả toàn `401`

Lúc này:

- bài test không còn ý nghĩa performance
- vì bạn đang test lỗi script, không phải test server

### Flow đúng

```text
POST /auth/login
  -> response có access_token
  -> JSON Extractor lấy $.access_token
  -> lưu vào biến ${token}
  -> request sau dùng Authorization: Bearer ${token}
```

### Đây là lỗi rất hay gặp

- JSON path sai
- tên biến sai
- header `Authorization` viết sai
- request protected chạy trước khi login thành công

---

## 12. Assertion: vì sao phải có

Nếu chỉ nhìn request "có response trả về", bạn rất dễ bị đánh lừa.

Ví dụ:

- API trả `500`
- JMeter vẫn ghi nhận đã có response time

Nếu không có assertion, bạn có thể nhìn thấy report có số đẹp nhưng thực ra response toàn lỗi.

### Tối thiểu nên có

Cho `POST /auth/login`:

- kiểm tra status code `200`
- kiểm tra response có key `token`

Cho `GET /tasks`:

- kiểm tra status code `200`

Cho bài test có KPI chặt hơn:

- thêm assertion response time

---

## 13. Cách đọc kết quả mà không bị ngợp

Khi mở `Aggregate Report`, đừng nhìn tất cả cột cùng lúc.

Hãy đọc theo thứ tự này:

### 1. Error %

Nếu `Error %` cao:

- dừng lại
- xem loại lỗi là gì
- chưa nên bàn chuyện hệ thống nhanh hay chậm

Vì bài test đang có lỗi chức năng hoặc lỗi script.

### 2. P95

Đây là chỉ số nên nhìn tiếp theo.

So với KPI:

- nếu KPI là `P95 <= 800ms`
- mà report ra `P95 = 1200ms`
- thì bài test fail theo KPI

### 3. Average

Dùng để tham khảo.

Nếu:

- `Average` thấp
- nhưng `P95` cao

thì nghĩa là:

- đa số request ổn
- nhưng vẫn có nhóm request chậm đáng kể

### 4. Throughput

Giúp biết hệ thống xử lý được bao nhiêu request trong khoảng thời gian đó.

Nên đọc cùng với `Response Time`.

Vì:

- throughput cao chưa chắc tốt nếu error tăng
- throughput cao chưa chắc tốt nếu P95 tăng mạnh

---

## 14. Ví dụ đọc report rất nhanh

Giả sử bạn có kết quả như sau:

| API | Average | P95 | Error % | Throughput |
|---|---|---|---|---|
| `POST /auth/login` | `220ms` | `480ms` | `0%` | `15 req/s` |
| `GET /tasks` | `420ms` | `760ms` | `0%` | `28 req/s` |

Kết luận ngắn gọn:

- bài test ổn
- chưa thấy lỗi
- `GET /tasks` chậm hơn login nhưng vẫn đạt KPI `P95 <= 800ms`

Ví dụ xấu hơn:

| API | Average | P95 | Error % | Throughput |
|---|---|---|---|---|
| `GET /tasks` | `550ms` | `1700ms` | `6%` | `31 req/s` |

Kết luận:

- bài test không đạt
- có cả vấn đề về tốc độ lẫn độ ổn định
- cần xem log, DB, query, auth flow, và tài nguyên hệ thống

---

## 15. Các lỗi rất hay gặp khi mới học JMeter

| Lỗi | Biểu hiện | Cách nghĩ đúng |
|---|---|---|
| Chạy tải lớn ngay từ đầu | lỗi loạn, không biết sai ở đâu | luôn chạy nhỏ trước |
| Không có assertion | report có số nhưng không biết response đúng hay sai | phải check status code / body |
| Không extract token đúng | request protected toàn `401` | kiểm tra `JSON Extractor` và header |
| Dùng 1 account cho mọi thread | bài test không thực tế | dùng CSV với nhiều account |
| Chỉ nhìn average | bỏ sót request chậm | nhìn `P95` trước |
| Không ghi rõ KPI | chạy xong không biết pass hay fail | đặt ngưỡng trước khi chạy |

---

## 16. Cách trình bày kết quả như một tester

Sau khi chạy test, đừng chỉ nói:

- "API hơi chậm"

Hãy nói kiểu có số liệu:

```text
Load test GET /tasks với 50 users, ramp-up 60 giây, chạy 10 phút.
Kết quả:
- Error % = 0
- Average = 430ms
- P95 = 780ms
- Throughput = 26 req/s

Kết luận:
API đạt KPI P95 <= 800ms trong mức tải kiểm thử hiện tại.
```

Hoặc:

```text
Stress test GET /tasks tại mức 200 users cho thấy hệ thống bắt đầu bất ổn.
Kết quả:
- Error % = 4.8%
- P95 = 2100ms

Kết luận:
Mức 200 users vượt ngưỡng chịu tải hiện tại của hệ thống.
```

Đây chính là kiểu nói chuyện mà interviewer và lead dễ tin hơn.

---

## 17. Mẫu checklist trước khi chạy test

Trước mỗi bài test, tự check:

- API có đang chạy ổn không
- DB đã seed data chưa
- account login còn dùng được không
- KPI đã xác định chưa
- test data đã rõ chưa
- script đã chạy nhỏ thành công chưa
- token extract đúng chưa
- assertion đã có chưa
- listener dùng để debug hay để report

### Mẹo thực tế

`View Results Tree` rất tiện khi debug, nhưng không nên lạm dụng khi chạy tải lớn vì nó tốn tài nguyên.

---

## 18. 10 câu phỏng vấn JMeter rất dễ gặp

## Câu 1: JMeter dùng để làm gì

Trả lời ngắn:

`JMeter` dùng để giả lập nhiều request theo kịch bản nhằm đo hiệu năng, độ ổn định và khả năng chịu tải của hệ thống.

## Câu 2: Load test khác stress test thế nào

Trả lời ngắn:

- `Load test` kiểm tra ở mức tải dự kiến
- `Stress test` ép vượt ngưỡng để tìm giới hạn

## Câu 3: Vì sao phải nhìn P95 thay vì chỉ nhìn average

Trả lời ngắn:

Vì `Average` có thể che mất một nhóm request rất chậm, còn `P95` phản ánh trải nghiệm của phần lớn người dùng thực tế tốt hơn.

## Câu 4: Thread Group là gì

Trả lời ngắn:

Là nơi cấu hình số user ảo, ramp-up và số lần lặp hoặc thời gian chạy.

## Câu 5: Sampler là gì

Trả lời ngắn:

Là hành động user thực hiện, ví dụ một `HTTP Request`.

## Câu 6: JSON Extractor dùng để làm gì

Trả lời ngắn:

Dùng để lấy dữ liệu từ response JSON, ví dụ lấy token sau khi login để dùng ở request tiếp theo.

## Câu 7: Tại sao phải có assertion

Trả lời ngắn:

Để đảm bảo request không chỉ "có response" mà còn đúng về status code, body hoặc response time.

## Câu 8: Throughput là gì

Trả lời ngắn:

Là số request hệ thống xử lý được trong một đơn vị thời gian.

## Câu 9: Khi error tăng, nên làm gì trước

Trả lời ngắn:

Phải xem loại lỗi là gì, tách lỗi do script với lỗi do hệ thống, rồi mới kết luận về performance.

## Câu 10: Với project này bạn sẽ test API nào trước

Trả lời ngắn:

Tôi sẽ bắt đầu từ `POST /auth/login` và `GET /tasks`, vì đây là flow dễ dựng, có auth, có dữ liệu seed, và phản ánh rõ trải nghiệm người dùng cơ bản.

---

## 19. Khung trả lời phỏng vấn 30 giây về JMeter

Nếu bị hỏi nhanh, bạn có thể trả lời:

```text
Em dùng JMeter để thực hiện load test và stress test cho API.
Thông thường em dựng flow đăng nhập, extract token bằng JSON Extractor,
sau đó gọi các API protected, gắn assertion để kiểm tra response code và body.
Khi đọc kết quả, em ưu tiên nhìn Error %, P95 và Throughput,
không chỉ nhìn Average.
Nếu có KPI như P95 <= 800ms thì em kết luận pass/fail theo KPI đó.
```

---

## 20. Cheat sheet nhớ nhanh trước phỏng vấn

```text
JMeter = giả lập tải

Load test  = tải bình thường
Stress test = ép quá ngưỡng
P95 = trải nghiệm của 95% request

Thread Group = số user + ramp-up + loop
Sampler = request
Config = cấu hình dùng chung
JSON Extractor = lấy token
Assertion = check đúng sai
Listener = xem kết quả

Đọc report:
1. Error %
2. P95
3. Average
4. Throughput
```

---

## 21. Nếu muốn ôn đúng trọng tâm cho project này

Bạn nên luyện theo thứ tự:

1. Hiểu `load`, `stress`, `P95`
2. Dựng flow `login -> extract token -> GET /tasks`
3. Thêm `CSV Data Set Config` với nhiều account
4. Chạy smoke test nhỏ
5. Chạy load test `50 users`
6. Đọc report và tập kết luận bằng số liệu

Nếu làm chắc 6 bước này, bạn đã đủ tự tin để nói về `JMeter` trong phỏng vấn tester ở mức tốt.

---

## 22. Kết luận

Với project `task-management`, bạn hoàn toàn có thể dùng để tổng ôn `JMeter` ở mức:

- hiểu khái niệm
- biết dựng test plan cơ bản
- biết test flow có auth
- biết đọc `P95`, `Error %`, `Throughput`
- biết trình bày kết quả như một tester

Tài liệu và file thực hành đi kèm trong repo:

- [Hướng dẫn thực hành JMeter](./jmeter-practice-guide.md)
- `jmeter/task-management-login-tasks.jmx`
- `jmeter/users.csv`

Nếu muốn đi xa hơn sau bộ hiện tại, hướng mở rộng hợp lý là:

- thêm file `.jmx` thứ hai cho endpoint khác
- chạy thử thật với `docker-compose up`
- so sánh kết quả giữa `GET /tasks` và `POST /auth/login`
