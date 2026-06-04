const defaultCategories = [
    { id: 1, name: 'コーヒー' },
    { id: 2, name: 'お菓子' },
    { id: 3, name: 'コンビニ弁当' }
];

// localStorageからデータを取得、なければ初期データを保存
if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
}

// カテゴリー一覧を描画
function renderCategories() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const container = document.getElementById('category-list');
    const template = document.getElementById('category-template');

    if (!container || !template) return;
    container.innerHTML = '';

    categories.forEach(cat => {
        const clone = template.content.cloneNode(true);

        // 各要素を埋め込む
        clone.querySelector('.category-link').href = `./count.html?categoryId=${cat.id}`;
        clone.querySelector('.category-icon').src = `./icons/coffee_chilled_cup.png`;
        clone.querySelector('.category-name').textContent = escapeHtml(cat.name);

        clone.querySelector('.edit-button').href = `./edit-category.html?id=${cat.id}`;
        clone.querySelector('.delete-button').onclick = () => deleteCategory(cat.id);

        container.appendChild(clone);
    });
}

// 削除処理
function deleteCategory(id) {
    const result = confirm('このカテゴリーを削除すると関連アイテムも消えます。削除しますか？');
    if (!result) return;

    let categories = JSON.parse(localStorage.getItem('categories'));
    categories = categories.filter(cat => cat.id !== id);

    localStorage.setItem('categories', JSON.stringify(categories));
    renderCategories();
}

// XSS対策
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', renderCategories);
