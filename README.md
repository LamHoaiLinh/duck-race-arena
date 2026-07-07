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

- Da tang kich thuoc nhan vat hien thi tren duong dua len xap xi gap doi so voi ban truoc theo yeu cau cuoi cung.

- Da sua lai ban cap nhat truoc de dam bao nhan vat hien thi on dinh tren duong dua.
- Van giu do nghieng nhe khi om cua va cu bat nhay muot hon, nhung toi uu theo huong an toan hon de tranh mat nhan vat.

- Ban sua loi console: bo sung normalizeAngle/lerpAngle/easeOutCubic va config animation bi thieu, de nhan vat hien lai sau khi bam bat dau.
- Da giu hieu ung nghieng than khi om cua va bat nhay muot hon nhung dam bao khong mat nhan vat.

- Da sua huong xoay sprite de tranh hien tuong nhan vat bi lat nguoc/chong dit len troi khi vao doan dao chieu.
- Da lam sach sprite, loai bo lop dom dom/checkerboard quanh nhan vat bang cach loc alpha thap.

- Da xu ly lai asset de xoa background o vuong/checkerboard con sot xung quanh nhan vat.
- Da doi cong thuc huong sprite: nhan vat se lat ngang khi chay nguoc huong, nhung van giu than dung nguoi, tranh bi chong nguoc.


## Ghi chu cap nhat asset tu file anh gui
- Da thay asset nv01 va nv03 theo dung thu muc anh gui.
- File anh gui co thu muc nv04, trong khi anh noi can asset thu tu 6. Em da dua thu muc nv04 do vao slot nv06 de khop voi yeu cau 1, 3, 6.
- Tat ca PNG da duoc chuan hoa ve kich thuoc canvas 320x320, ten file dung mau frame1.png den frame4.png va thumb.png.
- Da loc lai nen o vuong/checkerboard va cac dom nen bi sot khi cat anh.
- Da sua logic xoay/lật: khi nhan vat chay nguoc huong thi lat ngang sprite, khong xoay nguoc 180 do.

## GitHub Pages deploy-safe note
This package includes `.nojekyll` so GitHub Pages serves static assets directly and does not try to process the site through Jekyll.

- Da cap nhat lai bo nhan vat NV06 theo file anh gui, chuan hoa ve dung bo frame1-4 va thumb, dong thoi can giua tren canvas 320x320 de game hien thi on dinh.

- Da cap nhat hang loat asset nhan vat theo bo 'sprite sheet.zip' anh gui.
- Cac bo nv01-nv05, nv07-nv15 da duoc chuan hoa ve cung canvas 320x320, can giua va cung baseline de giam hien tuong chop/nhay khi chay.
- NV06 duoc giu theo bo anh gui rieng truoc do.
- Engine da duoc doi sang 5 frame/chuky de doc du bo sprite moi.
