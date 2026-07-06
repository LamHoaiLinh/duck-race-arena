# Mint Duck Race Arena - Fairplay Jump Pad Edition

Game đua vịt casual chạy trực tiếp trên trình duyệt bằng HTML5, CSS3, JavaScript thuần và Canvas API.

## Điểm mới trong bản này

- Kết quả cuối ghi theo **Hạng 1, Hạng 2, Hạng 3**.
- Nếu có 2 người cùng thắng thì hiển thị dạng: **Hạng 1: Tên A, Tên B**; người tiếp theo là **Hạng 2**.
- Bỏ đường hầm/đường tắt xấu, thay bằng **bệ bật nhảy** trên từng lane.
- Mỗi người chơi có đúng **1 bệ bật nhảy riêng**, vị trí random mỗi ván để bảo đảm fair play.
- Bệ bật nhảy cho lợi thế khác nhau theo chỉ số ẩn: `burst`, `courage`, `luck`, `stability`.
- Vấp té có đá trên lane và tay đua khựng lại khoảng 1 giây.
- Gió xuôi tăng nhẹ, không buff quá lộ.
- Gió ngược/lốc xoáy/gió/đá/bật nhảy có hiệu ứng rõ trên đường chạy tối thiểu khoảng 2 giây.
- Bình luận trực tiếp giữ tối thiểu khoảng 2.2 giây để người chơi đọc kịp.
- Sự kiện chính phát sinh chậm hơn, khoảng 2.8 đến 4.8 giây/lần.

## Cấu trúc file

```text
index.html
styles.css
script.js
assets/
  animals/
  maps/
  icons/
README.md
```

## Cách chỉnh thông số nhanh

Mở `script.js`, tìm `GAME_CONFIG`:

- `eventMinGap`, `eventMaxGap`: khoảng cách giữa các sự kiện.
- `commentMinVisibleMs`: thời gian giữ bình luận.
- `bubbleMinTime`: thời gian giữ bubble trên đầu tay đua.
- `visualMinTime`: thời gian giữ hiệu ứng gió, lốc, đá, bật nhảy.
- `tieRate`: xác suất 2 người đồng hạng nhất.
- `rampMinGain`, `rampMaxGain`: độ xa tối thiểu/tối đa của bệ bật nhảy.

## Cách upload lên GitHub Pages

1. Giải nén file ZIP.
2. Vào GitHub và mở repository của game.
3. Upload toàn bộ file/folder bên trong thư mục giải nén lên repository.
4. Bảo đảm `index.html`, `styles.css`, `script.js`, `README.md`, `assets/` nằm ngay thư mục gốc repository.
5. Vào `Settings > Pages`.
6. Source chọn `Deploy from a branch`.
7. Branch chọn `main`, folder chọn `/root`.
8. Bấm `Save`.
9. Chờ 1-3 phút, sau đó mở link GitHub Pages.
10. Nếu vẫn thấy bản cũ, bấm `Ctrl + F5` hoặc mở bằng tab ẩn danh để tránh cache.

## Lưu ý khi thay asset thật

Bản này đang vẽ hiệu ứng bằng Canvas nên không bắt buộc phải có ảnh PNG. Sau này có thể thay emoji con vật bằng PNG trong `assets/animals/` và sửa hàm `drawRacerToken()` trong `script.js`.
