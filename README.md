# Mint Duck Race Arena

Web game tĩnh chạy trực tiếp trên trình duyệt bằng HTML5, CSS3, JavaScript thuần và Canvas API.

## Điểm chính

- Không backend.
- Không database.
- Không đăng nhập.
- Không localStorage.
- Trạng thái ván đua chỉ nằm trong RAM trình duyệt. Reload trang là reset.
- Mỗi người chơi được xếp một làn riêng như sân điền kinh.
- Số làn sinh tự động theo số người chơi, tối thiểu 2 và tối đa 12.
- Màu đường đua lấy theo ảnh mẫu: xanh tím `#6F71B0`, viền đậm `#3A3761`, vạch trắng `#EAECF8`.
- Có logic race engine gồm chỉ số ẩn, sự kiện 2-4 giây/lần, đường tắt, cản nhau, slipstream, rubber-band nhẹ, final sprint và xác suất 15% có tối đa 2 người cán đích đồng thời.

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

## Cách chạy

Mở trực tiếp file `index.html` bằng trình duyệt Chrome, Edge hoặc Firefox.

## Cách deploy GitHub Pages

1. Giải nén file ZIP.
2. Vào GitHub và tạo repository mới, ví dụ `mint-duck-race-arena`.
3. Bấm `Add file` > `Upload files`.
4. Kéo toàn bộ file và thư mục sau khi giải nén lên repository. Lưu ý `index.html` phải nằm ngay thư mục gốc repository, không để lồng trong thư mục con.
5. Bấm `Commit changes`.
6. Vào `Settings` > `Pages`.
7. Ở `Build and deployment`, chọn `Deploy from a branch`.
8. Chọn branch `main`, folder `/root`, rồi bấm `Save`.
9. Đợi GitHub cấp link dạng `https://ten-tai-khoan.github.io/ten-repository/`.

## Cách deploy Render Static Site

1. Đưa toàn bộ mã nguồn lên GitHub repository.
2. Vào Render, chọn `New` > `Static Site`.
3. Kết nối repository vừa tạo.
4. Build Command: để trống.
5. Publish Directory: nhập `.`.
6. Bấm `Create Static Site`.

## Chỉnh thông số game

Mở `script.js` và chỉnh các vùng sau:

- `ANIMAL_DATA`: danh sách con vật, emoji, màu đại diện.
- `MAP_DATA`: dữ liệu map, đường tắt, đoạn hẹp, đoạn cua, độ rủi ro.
- `EVENT_COMMENTS`: câu bình luận tiếng Việt cho từng sự kiện.
- `createHiddenStats()`: cách sinh chỉ số ẩn.
- `getRubberBandMultiplier()`: mức cân bằng để không bỏ xa quá sớm.
- `triggerRaceEvent()`: trọng số sự kiện.

## Thay asset thật

Hiện game đang dùng emoji/placeholder để nhẹ và dễ chạy. Sau này có thể thay bằng PNG trong `assets/animals/`. Khi thay thật, nên preload ảnh trong `script.js` trước khi vẽ Canvas để tránh giật khung hình.
