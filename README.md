# Mint Duck Race Arena

Web game casual chay truc tiep tren trinh duyet, khong backend, khong database, khong dang nhap, khong luu du lieu. Moi van dua chi ton tai trong RAM cua trinh duyet. Reload trang la reset toan bo.

## Cau truc file

```txt
mint-duck-race-arena/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── animals/
│   ├── maps/
│   └── icons/
└── README.md
```

## Tinh nang da co

- HTML5, CSS3, JavaScript thuan, Canvas API.
- Giao dien mint green cao cap, vui, sach, bo goc lon.
- Desktop: duong dua o giua/ben trai, bang xep hang ben phai.
- Man hinh nho: tu dong xep doc, khong tran chu.
- Nhap 2 den 12 nguoi choi, moi dong 1 nguoi.
- Nut mau nhanh 3 nguoi, 5 nguoi, 8 nguoi.
- 5 map duong dua co vong bau duc, doan hep va nhanh tat.
- Moi tay dua co chi so an: baseSpeed, burst, stability, luck, courage.
- Su kien dua: gio nguoc, gio xuoi, vap nhe, truot cua, bi chan duong, chen lan, du bam, but toc, re tat, thoat hiem, ket nhanh hep.
- Bang xep hang realtime, co animation khi doi thu hang.
- Bubble su co hien gan con vat tren canvas.
- Vet motion nho khi but toc.
- Khung binh luan truc tiep dang ticker the thao.
- Man ket qua top 1, top 2, top 3.
- Confetti nhe khi ket thuc van.

## Chay truc tiep

Chi can mo file `index.html` bang trinh duyet. Khong can cai Node, khong can npm, khong can backend.

## Cach thay asset that sau nay

Thu muc `assets/animals/` da co placeholder SVG. Anh co the thay bang PNG/SVG that, giu dung ten file de game tu nap:

```txt
assets/animals/duck.svg
assets/animals/turtle.svg
assets/animals/rabbit.svg
assets/animals/frog.svg
...
```

Neu khong co file asset, game van tu fallback sang emoji tren canvas.

## Huong dan upload GitHub Pages bang giao dien web

1. Giai nen file ZIP nay.
2. Vao GitHub va tao repository moi, vi du: `mint-duck-race-arena`.
3. Trong repository, bam **Add file** > **Upload files**.
4. Keo tha toan bo file va thu muc ben trong folder da giai nen len GitHub. Luu y: `index.html` phai nam ngay o thu muc goc repository, khong nam long trong mot folder con.
5. Bam **Commit changes**.
6. Vao tab **Settings** cua repository.
7. Vao muc **Pages**.
8. Tai **Build and deployment**, chon **Deploy from a branch**.
9. Chon branch `main`, folder `/root`, bam **Save**.
10. Doi GitHub cap link Pages. Link thuong co dang:

```txt
https://ten-tai-khoan.github.io/mint-duck-race-arena/
```

## Huong dan deploy Render Static Site neu can

1. Day code len GitHub truoc.
2. Vao Render > New > Static Site.
3. Chon repository `mint-duck-race-arena`.
4. Build command: de trong.
5. Publish directory: `.`
6. Bam Create Static Site.

## Ghi chu van hanh

- Game khong co backend nen khong luu ket qua.
- Reload trang la reset van dua.
- Neu them nhieu anh PNG nang, nen toi uu kich thuoc anh de canvas khong bi giat.
- De chinh do gay can, mo `script.js` va sua bien `CONFIG` o dau file.
