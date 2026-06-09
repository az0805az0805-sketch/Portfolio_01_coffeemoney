// js/records.js

const urlParams = new URLSearchParams(window.location.search);
const currentCategoryId = parseInt(urlParams.get('categoryId')) || 1;

// URLから年月のパラメータを取得（なければ現在の現在の年月をデフォルトにする）
const currentYear = parseInt(urlParams.get('year')) || new Date().getFullYear();
const currentMonth = parseInt(urlParams.get('month')) || (new Date().getMonth() + 1);

// 2. ページ読み込み時に初期化と画面描画
document.addEventListener('DOMContentLoaded', () => {
    // 各移動ボタンのリンク先を自動設定
    document.getElementById('month-select-link').href = `./month-select.html?categoryId=${currentCategoryId}`;
    document.getElementById('back-link').href = `./count.html?categoryId=${currentCategoryId}`;

    // 【追加・修正】見出しを選択された年月に書き換える
    const pageTitle = document.getElementById('page-title') || document.querySelector('h2');
    if (pageTitle) {
        pageTitle.textContent = `${currentYear}年${currentMonth}月 の詳細`;
    }

    renderRecordsPage();
});

// 3. 画面全体のデータを描画する関数
function renderRecordsPage() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const records = JSON.parse(localStorage.getItem('records')) || [];

    // 現在のカテゴリーと予算を取得
    const currentCategory = categories.find(cat => cat.id === currentCategoryId) || { name: '不明', budget: 0 };

    // このカテゴリーに紐づき、かつ「選択された年月」に合致するレコードだけを抽出
    const currentRecords = records
        .filter(rec => {
            if (rec.categoryId !== currentCategoryId) return false;

            const recDate = new Date(rec.date);
            const recYear = recDate.getFullYear();
            const recMonth = recDate.getMonth() + 1;

            return recYear === currentYear && recMonth === currentMonth;
        })
        .sort((a, b) => b.id - a.id); // 新しい順に並び替え

    // テーブルの中身を組み立て
    const tbody = document.getElementById('record-tbody');
    const emptyRow = document.getElementById('empty-row');
    tbody.innerHTML = '';

    if (currentRecords.length === 0) {
        emptyRow.style.display = 'table-row';
    } else {
        emptyRow.style.display = 'none';

        currentRecords.forEach(rec => {
            const item = items.find(i => i.id === rec.itemId) || { name: '削除済みアイテム' };

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

    // 計算（選択された月の合計金額・予算・残高）
    const total = currentRecords.reduce((sum, rec) => sum + rec.price, 0);
    const balance = currentCategory.budget - total;

    document.getElementById('monthly-total').textContent = total.toLocaleString();
    document.getElementById('budget').textContent = currentCategory.budget.toLocaleString();
    document.getElementById('balance').textContent = balance.toLocaleString();
}

// 4. 個別の削除ボタンが押された時の処理
function deleteRecord(recordId) {
    if (confirm('この支出履歴を削除しますか？')) {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        records = records.filter(rec => rec.id !== recordId);

        localStorage.setItem('records', JSON.stringify(records));
        renderRecordsPage();
    }
}

// 簡易的な日付フォーマット関数
function formatDate(dateStr) {
    if (!dateStr) return '不明';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

// XSS対策
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
