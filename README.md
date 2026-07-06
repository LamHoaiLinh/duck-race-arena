# Mint Duck Race Arena - Circuit Edition
Ban cap nhat nay da sua cac diem anh yeu cau:
- KQ cuoc dua hien theo dang `Hang 1`, `Hang 2`, `Hang 3`, co xu ly dong hang Hang 1.
- Vấp đá khựng lại thật khoảng 1 giây, gió xuôi tăng nhẹ, gió ngược/lốc/đá có hiệu ứng nhìn rõ và giữ tối thiểu hơn 2 giây.
- Bo shortcut duong ham, thay bang be bat nhay. Moi nguoi co 1 be rieng, random rải rác, nhung van fair play.
- Them tuy chon nhan vat: tu dong, chon rieng tung nguoi, hoac ap cho tat ca.
- Su dung bo asset nhan vat anh gui va tao them 4 frame chay cho moi nhan vat.
- Lam lai he thong map thanh cac map uon eo, them 10 map moi thay vi chi co oval.

## Cấu trúc
- `index.html`: giao dien.
- `styles.css`: style.
- `script.js`: logic game + ve canvas.
- `assets/animals/`: 16 nhan vat, moi nhan vat co `thumb.png` va `frame1..4.png`.

## Cách chạy
- Mo `index.html` bang trinh duyet.
- Hoac deploy len GitHub Pages / Vercel / Netlify dang static site.

- Da bo badge ky thuat RAM only/Reload = Reset.
- Da them bien mui ten chi huong chay ben le duong dua.
- Da thu nho va can giua sprite de nhan vat hien full body tren duong dua thay vi bi crop sat.

- Da sua hien thi nhan vat tren duong dua: sprite nho hon, full body de khong con bi che nhau chi con 1 phan co the.

- Ban cuoi da thay renderer nhan vat tren duong dua bang vector full-body, khong con phu thuoc frame crop sat mat.
- Da xoa han badge RAM only / Reload = Reset khoi giao dien.

- Da giam khung/hien thi nhan vat tren duong dua xuong xap xi mot nua de tranh che nhau; kich thuoc hien thi thuc te nho hon ro ret (gan muc ~128x128 tinh theo y tuong anh yeu cau).

- Da doi hien thi tay dua tren duong dua ve dung bo asset nhan vat da chon, khong con tat ca bi ve thanh cung mot kieu vit vector.
- Da tang kich thuoc nhan vat len muc vua phai de de nhin hon nhung khong che nhau qua muc.
- Da sua vach dich thanh 1 duong ke duy nhat.

- Da sua huong bien mui ten: mui ten gio se chi dung theo chieu chay thuc te cua duong dua, khong con co bien chi nguoc chieu.

- Da tang kich thuoc nhan vat tren duong dua len xap xi gap doi so voi ban truoc de de theo doi hon.
- Da zoom khung duong dua sat vao hon bang cach giam padding quanh map, giup quan sat gay can hon.

- Da tang them kich thuoc nhan vat hien thi tren duong dua de de nhin hon ro ret so voi ban truoc.
