# R & A

網站：https://rogeryangct.github.io/travel-itineraries/

純文字旅遊網站，按國家 → 行程 → 每日安排閱讀。沒有圖片、外部字型、套件、資料庫或付費 API。發布檔只有 `index.html` 和 `.nojekyll`；所有國家與行程由同一個模板產生。

## 本版範圍

- 波士尼亞：2026/9/9–9/10 Sarajevo，加上 9/11 跨境出發。
- 蒙特內哥羅：2026/9/11 Piva–Šavnik–Žabljak 抵達段；未聲稱包含 9/12–9/14。
- 原 34 篇景點導覽、時間表、地圖、費用、備案及來源完整保留。內容查核仍是 2026/9/8；網站設計更新不代表旅行資訊重新查核。
- 搜尋、國家頁、行程頁採網址 `#` 路由，可直接分享。舊版 `#d9`、`#guide-assassination` 等連結會跳到新行程的對應段落。

## 新增一個國家及行程

1. 複製 `source/templates/country.json` 的物件，填完後加入 `source/catalog.json` 的 `countries` 陣列。已存在的國家不必重加。
2. 複製 `source/templates/trip-entry.json` 的物件，填完後加入 catalog 的 `trips` 陣列。
3. 複製 `source/templates/trip-detail.json` 到 `source/content/你的行程代號.json`，逐日填入詳細內容；把 trip-entry 的 `content` 指向該檔案。
4. 國家與行程 id 使用小寫英數加連字號，不要更換既有 id（會影響收藏與分享網址）。跨國行程在 `countries` 填多個國家 id，內容不必重複。
5. 行程 entry 的 days 與 detail 的 days，id、日期、順序需一致。每個 stop id 必須唯一。所有連結填完整 HTTPS；Google Maps 可用經緯度 query。
6. 在電腦執行 `python3 build.py`。它會產生新的 `index.html`，自動更新國家目錄、行程頁與搜尋。
7. 上傳新版 `index.html` 到 GitHub 的 main 根目錄，保留 `.nojekyll`。source、build.py 和 README 也建議一併提交，以保存日後可修改的模板。
8. 到 Actions 確認 pages build and deployment 成功，再打開公開網址。

如果由 AI 協助，可以直接要求：「沿用 travel-itineraries 的 source/templates，新增某國某日期行程。保留現有國家與內容、補充官方來源、重建 index.html。」不需要自己寫 HTML。

未填完的模板不會出現在網站，只有 catalog 內登記的國家與行程才會發布。把「待確認」寫清楚，不要填造假的完成內容。公開網站不要放護照、訂房確認碼、門鎖密碼或私人文件。

## 內容標準

每份行程應有每日時段、移動時間、費用幣別與單位、Google Maps、景點背景與史實／傳說區分、官方來源、查核日期、預約、雨天備案、延誤刪減門檻。舊天氣快照不等於即時預報。匯率、費用與營業變更須再查核。

## 個人資料與離線

收藏、勾選和筆記存在 localStorage，僅限目前瀏覽器與網址來源，不會上傳、不會隨網站連結分享，不保證永久存在。更换裝置或清除瀏覽器前請在旅行工具匯出 JSON；還原會合併收藏並覆蓋同名筆記和勾選。離線檔與公開站是不同儲存來源，可用備份移轉。

下載整站 HTML 不含個人資料；用支援 JavaScript 的瀏覽器開啟可閱讀文字。Google Maps、外部來源與導航仍需網路；iPhone 的檔案預覽可能不執行 JavaScript，可改用列印／PDF 保存。沒有宣稱離線導航或背景自動更新。

## 網站結構

`source/catalog.json`：國家、行程目錄、日期及準備清單。

`source/content/`：現有完整導覽 HTML 及未來各份結構化 JSON。

`source/site.css`、`source/app.js`、`source/shell.html`：共同外觀、功能和首頁殼。

`build.py`：只用 Python 標準函式庫，將所有內容編譯成單一 HTML。

## 功能參考

- [Wanderlog 官方 app 說明](https://play.google.com/store/apps/details?id=com.wanderlog.android)：按日安排、地圖、備註、預算。
- [TripIt 官方 app 說明](https://play.google.com/store/apps/details?id=com.tripit)：集中查閱行程、分享與離線存取。

本站保留適合文字行程的功能，不含預訂、同步、共同編輯或即時交通追蹤。

## 已確認的維護偏好

後續由助理完成各國內容整理、編譯、GitHub 上傳與部署驗證；使用者不需要手動上傳。品牌僅 R & A（Roger and Amber），國家名稱顯示英文但中文仍可搜尋。固定頂部功能列的「今天」依各行程／日期所在地時區比對；唯一符合時直接跳轉、多份時列出選項、無符合時顯示空白狀態。跨時區新行程可在 day 或 trip 設定 timeZone，否則使用第一國家時區。

行程內工具列僅保留日期選單；搜尋在全站頂部。

最新介面：行程頂部僅保留日期選單；已移除副標題、頂部查核提示、大字／列印按鍵、出發清單與筆記面板。既有個人備份資料保留，內容中的來源與查核日期保留。PDF 可使用瀏覽器列印。

## 已定版的共用模板

目前行程版面已保存為 R & A itinerary v1，規格見 `source/templates/README.md`，設定見 `source/templates/template.json`。未來新增各國行程均沿用這份模板，由助理完成填寫、查核、編譯與上傳，不需要使用者手動維護。
