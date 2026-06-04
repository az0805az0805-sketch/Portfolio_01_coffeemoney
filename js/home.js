const defaultCategories = [
    { id: 1, name: 'コーヒー' },
    { id: 2, name: 'お菓子' },
    { id: 3, name: 'コンビニ弁当' }
];

// localStorageからデータを取得、なければ初期データを保存
if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
}

// 画面にカテゴリー一覧を描画する関数
function renderCategories() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const container = document.getElementById('category-list');

    if (!container) return;
    container.innerHTML = '';

    categories.forEach(cat => {
        const row = document.createElement('div');
        row.className = 'category-row';

        row.innerHTML = `
			<a href="./count.html?categoryId=${cat.id}" class="category-link">
				<img src="./icons/coffee_chilled_cup.png" alt="coffee" class="category-icon">
				<span class="category-name">${escapeHtml(cat.name)}</span>
			</a>
			<div class="category-actions">
				<!-- 更新ボタン -->
				<a href="./edit-category.html?id=${cat.id}" class="edit-button">カテゴリーを編集</a>

				<!-- CSSの「.category-actions form」というルールを活かすためformタグを配置 -->
				<form onsubmit="event.preventDefault();">
					<button type="button" class="delete-button" onclick="deleteCategory(${cat.id})">削除</button>
				</form>
			</div>
		`;
        container.appendChild(row);
    });
}

// 削除処理を行う関数
function deleteCategory(id) {
    const result = confirm('このカテゴリーを削除すると関連アイテムも消えます。削除しますか？');
    if (!result) return;

    let categories = JSON.parse(localStorage.getItem('categories'));
    categories = categories.filter(cat => cat.id !== id);

    localStorage.setItem('categories', JSON.stringify(categories));
    renderCategories(); // 画面を再描画
}

// セキュリティ対策（XSS防止用のエスケープ関数）
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', renderCategories);