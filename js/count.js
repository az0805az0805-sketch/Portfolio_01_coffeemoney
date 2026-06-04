function updateTime() {
    const now = new Date();
    const formatted =
        now.getFullYear() + "/" +
        String(now.getMonth() + 1).padStart(2, '0') + "/" +
        String(now.getDate()).padStart(2, '0') + " " +
        String(now.getHours()).padStart(2, '0') + ":" +
        String(now.getMinutes()).padStart(2, '0') + ":" +
        String(now.getSeconds()).padStart(2, '0');

    document.getElementById("now").textContent = formatted;
}

setInterval(updateTime, 1000);
updateTime();

// 1. URLから「categoryId」を取得
const urlParams = new URLSearchParams(window.location.search);
const currentCategoryId = parseInt(urlParams.get('categoryId')) || 1;

// テスト用モックデータ
const defaultCategories = [
    { id: 1, name: 'コーヒー', budget: 10000 },
    { id: 2, name: 'お菓子', budget: 5000 }
];
const defaultItems = [
    { id: 101, categoryId: 1, name: 'スタバ', price: 600 },
    { id: 102, categoryId: 1, name: 'コンビニ缶コーヒー', price: 150 },
    { id: 201, categoryId: 2, name: 'ポテトチップス', price: 160 }
];

// localStorageの初期化
if (!localStorage.getItem('categories')) localStorage.setItem('categories', JSON.stringify(defaultCategories));
if (!localStorage.getItem('items')) localStorage.setItem('items', JSON.stringify(defaultItems));
if (!localStorage.getItem('records')) localStorage.setItem('records', JSON.stringify([]));

// 画面の描画処理
function renderPage() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const items = JSON.parse(localStorage.getItem('items'));
    const records = JSON.parse(localStorage.getItem('records'));

    const currentCategory = categories.find(cat => cat.id === currentCategoryId) || { name: '不明', budget: 0 };

    document.getElementById('category-title').textContent = `${currentCategory.name} Count`;
    document.getElementById('add-item-link').href = `./item-add.html?categoryId=${currentCategoryId}`;
    document.getElementById('detail-link').href = `./records.html?categoryId=${currentCategoryId}`;

    // 合計金額と残高の計算
    const currentRecords = records.filter(rec => rec.categoryId === currentCategoryId);
    const total = currentRecords.reduce((sum, rec) => sum + rec.price, 0);

    document.getElementById('monthly-total').textContent = total;
    document.getElementById('balance').textContent = currentCategory.budget - total;

    // アイテムリストの描画
    const itemListContainer = document.getElementById('item-list');
    itemListContainer.innerHTML = '';

    const filteredItems = items.filter(item => item.categoryId === currentCategoryId);
    filteredItems.forEach(item => {
        const wrapper = document.createElement('div');
        // ★HTML内の style="..." を完全に削除し、新しく定義したCSSクラスに変更しました
        wrapper.innerHTML = `
			<div class="item-wrapper">
				<button type="button" class="item-button" onclick="addRecord(${item.id}, ${item.price})">
					${escapeHtml(item.name)}
				</button>
				<a href="./edit-item.html?id=${item.id}&categoryId=${currentCategoryId}" class="edit-button">編集</a>
			</div>
		`;
        itemListContainer.appendChild(wrapper);
    });
}

// カウント加算処理
function addRecord(itemId, price) {
    const records = JSON.parse(localStorage.getItem('records'));

    records.push({
        id: Date.now(),
        categoryId: currentCategoryId,
        itemId: itemId,
        price: price,
        date: new Date().toISOString()
    });
    localStorage.setItem('records', JSON.stringify(records));

    renderPage();
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', renderPage);