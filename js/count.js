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

// テスト用モックデータ（★論理削除用のフラグを追加・定義）
const defaultCategories = [
    { id: 1, name: 'コーヒー', budget: 10000, isDeleted: false },
    { id: 2, name: 'お菓子', budget: 5000, isDeleted: false }
];
const defaultItems = [
    { id: 101, categoryId: 1, name: 'スタバ', price: 600, isDeleted: false },
    { id: 102, categoryId: 1, name: 'コンビニ缶コーヒー', price: 150, isDeleted: false },
    { id: 201, categoryId: 2, name: 'ポテトチップス', price: 160, isDeleted: false }
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

    // 【修正】現在のカテゴリーを取得。さらに論理削除されていないかチェック
    const currentCategory = categories.find(cat => cat.id === currentCategoryId);

    // カテゴリーが存在しない、または論理削除されている場合はエラー表示をしてトップに戻す
    if (!currentCategory || currentCategory.isDeleted === true) {
        alert('指定されたカテゴリーは削除されたか、存在しません。');
        window.location.href = './home.html';
        return;
    }

    document.getElementById('category-title').textContent = `${currentCategory.name} Count`;
    document.getElementById('add-item-link').href = `./item-add.html?categoryId=${currentCategoryId}`;
    document.getElementById('detail-link').href = `./records.html?categoryId=${currentCategoryId}`;

    // 合計金額と残高の計算
    // ※過去の集計（records）は、アイテムやカテゴリーが削除されていても金額計算に含める必要があるため、
    // recordsのフィルター条件はそのまま（categoryIdの合致のみ）維持します。
    const currentRecords = records.filter(rec => rec.categoryId === currentCategoryId);
    const total = currentRecords.reduce((sum, rec) => sum + rec.price, 0);

    document.getElementById('monthly-total').textContent = total;
    document.getElementById('balance').textContent = currentCategory.budget - total;

    // アイテムリストの描画
    const itemListContainer = document.getElementById('item-list');
    itemListContainer.innerHTML = '';

    // 【修正】このカテゴリーに属し、かつ「論理削除されていない(isDeleted !== true)」アイテムだけを抽出
    const filteredItems = items.filter(item => item.categoryId === currentCategoryId && item.isDeleted !== true);

    // 表示できるアイテムがない場合の案内
    if (filteredItems.length === 0) {
        itemListContainer.innerHTML = '<p style="color:#888; text-align:center;">登録されているアイテムがありません。</p>';
    }

    filteredItems.forEach(item => {
        const wrapper = document.createElement('div');
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
