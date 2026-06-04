/**
 * 
 */
const urlParams = new URLSearchParams(window.location.search);
const currentCategoryId = parseInt(urlParams.get('categoryId')) || 1;

// 2. ページ読み込み時に初期化と画面描画
document.addEventListener('DOMContentLoaded', () => {
    // 各移動ボタンのリンク先を自動設定
    document.getElementById('month-select-link').href = `./month-select.html?categoryId=${currentCategoryId}`;
    document.getElementById('back-link').href = `./count.html?categoryId=${currentCategoryId}`;

    renderRecordsPage();
});

// 3. 画面全体のデータを描画する関数
function renderRecordsPage() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const records = JSON.parse(localStorage.getItem('records')) || [];

    // 現在のカテゴリーと予算を取得
    const currentCategory = categories.find(cat => cat.id === currentCategoryId) || { name: '不明', budget: 0 };

    // このカテゴリーに紐づくレコードだけを抽出（新しい順に並び替え）
    const currentRecords = records
        .filter(rec => rec.categoryId === currentCategoryId)
        .sort((a, b) => b.id - a.id);

    // テーブルの中身を組み立て
    const tbody = document.getElementById('record-tbody');
    const emptyRow = document.getElementById('empty-row');
    tbody.innerHTML = '';

    if (currentRecords.length === 0) {
        emptyRow.style.display = 'table-row';
    } else {
        emptyRow.style.display = 'none';

        currentRecords.forEach(rec => {
            // アイテム名を取得
            const item = items.find(i => i.id === rec.itemId) || { name: '不明なアイテム' };

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(rec.date)}</td>
                <td>${escapeHtml(item.name)}</td>
                <td class="amount">${rec.price.toLocaleString()} 円</td>
                <td>
                    <button type="button" class="delete-button" onclick="deleteRecord(${rec.id})">削除</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 計算（合計金額・予算・残高）
    const total = currentRecords.reduce((sum, rec) => sum + rec.price, 0);
    const balance = currentCategory.budget - total;

    document.getElementById('monthly-total').textContent = total.toLocaleString();
    document.getElementById('budget').textContent = currentCategory.budget.toLocaleString();
    document.getElementById('balance').textContent = balance.toLocaleString();
}

// 4. 個別の削除ボタンが押された時の処理
function deleteRecord(recordId) {

    let records = JSON.parse(localStorage.getItem('records')) || [];
    records = records.filter(rec => rec.id !== recordId);

    localStorage.setItem('records', JSON.stringify(records));

    renderRecordsPage();
}

function formatDate(dateStr) {
    if (!dateStr) return '不明';
    if (dateStr.includes('-')) return dateStr.split('T')[0]; // ISO 8601形式対策
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}