# Mint Duck Race Arena

Web game dua vit chay truc tiep tren trinh duyet bang HTML5, CSS3, JavaScript thuan va Canvas API.

## Dac diem ban sua loi

- Giao dien mint green gon hon, khong con badge chu lon de bi de len noi dung.
- Duong dua xanh tim tach lan rieng, so lan tu sinh theo so nguoi choi tu 2 den 12.
- Moi tay dua co chi so an: baseSpeed, burst, stability, luck, courage.
- Su kien dien ra cham hon: moi 2 den 4 giay moi phat sinh mot su kien lon.
- Binh luan ticker giu toi thieu khoang 2 giay de nguoi choi doc kip.
- Bubble tren duong dua giu toi thieu khoang 1 giay.
- Nguoi cham vach dich moi duoc tinh ket qua.
- Voi van 15 giay, engine gan pacing de it nhat nguoi hang nhat cham dich truoc khi het thoi gian.
- Co 15% kha nang hai nguoi ve dich gan nhu dong thoi, toi da 2 nguoi.
- Co rubber-band nhe, khong buff qua lo cho mot nguoi.
- 20% thoi gian cuoi tang xac suat finalSprint.
- Khong dung backend, database, localStorage. Reload trang la reset.

## Cau truc file

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

## Cach chay

Mo truc tiep file `index.html` bang trinh duyet hoac upload len GitHub Pages/Render Static Site.

## Cach upload len GitHub Pages

1. Giai nen file ZIP.
2. Tao repository moi tren GitHub, vi du `duck-race-arena`.
3. Vao repository, chon **Add file** > **Upload files**.
4. Keo toan bo file va thu muc ben trong folder da giai nen len GitHub.
5. Bam **Commit changes**.
6. Vao **Settings** > **Pages**.
7. Muc **Build and deployment**, chon **Deploy from a branch**.
8. Chon branch `main`, folder `/root`, bam **Save**.
9. Doi GitHub tao link dang `https://ten-tai-khoan.github.io/duck-race-arena/`.

Luu y: `index.html` phai nam ngay o thu muc goc repository. Khong upload nguyen folder boc ngoai lam cho `index.html` nam long ben trong mot thu muc con.

## Cach deploy Render Static Site

1. Dua source code len GitHub.
2. Vao Render, chon **New** > **Static Site**.
3. Ket noi repository.
4. Build Command de trong.
5. Publish Directory nhap `.`.
6. Deploy.

## Cach chinh thong so game

Mo `script.js`, tim cac vung sau:

- `GAME_CONFIG`: thoi gian su kien, so nguoi choi, ty le dong hang.
- `ANIMAL_DATA`: danh sach con vat.
- `MAP_DATA`: mau duong dua, do kho cua cua, rui ro duong tat.
- `EVENT_COMMENTS`: cau binh luan truc tiep.
- `RaceEngine`: module logic dua.

