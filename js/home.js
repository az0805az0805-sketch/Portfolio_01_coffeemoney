// js/home.js

// 初期データに論理削除フラグ（isDeleted: false）を追加
const defaultCategories = [
    { id: 1, name: 'コーヒー', budget: 10000, isDeleted: false },
    { id: 2, name: 'お菓子', budget: 5000, isDeleted: false },
    { id: 3, name: 'コンビニ弁当', budget: 15000, isDeleted: false }
];

// localStorageからデータを取得、なければ初期データを保存
if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
}

// カテゴリー一覧を描画
function renderCategories() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const container = document.getElementById('category-list');

    if (!container) return;
    container.innerHTML = ''; // 一度中身をクリア

    // 【論理削除対応】削除されていないカテゴリーのみに絞り込む
    const activeCategories = categories.filter(cat => cat.isDeleted !== true);

    // 有効なカテゴリーがない場合のメッセージ表示
    if (activeCategories.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; margin: 40px 0;">登録されているカテゴリーがありません。</p>';
        return;
    }

    // CSSのスタイル定義に合わせて動的に要素を生成
    activeCategories.forEach(cat => {
        // 1. 外枠（ラッパー）を作成し、PC用のCSSクラス「category-row」を適用
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'category-row';

        // 2. 内部構造を組み立て（CSSのクラス名と完全に一致させます）
        itemWrapper.innerHTML = `
	        <a href="./count.html?categoryId=${cat.id}" class="category-link">
	            <img src="./icons/coffee_chilled_cup.png" alt="icon" class="category-icon">
	            <span class="category-name">${escapeHtml(cat.name)}</span>
	        </a>
	        <div class="action-buttons" style="display: flex; gap: 8px; z-index: 2;">
	            <a href="./edit-category.html?id=${cat.id}" class="edit-button" style="padding: 6px 12px; background: #3498db; color: white; border-radius: 4px; text-decoration: none; font-size: 0.85rem; font-weight: bold;">編集</a>
	            <button type="button" class="delete-button" onclick="deleteCategory(${cat.id})" style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: bold;">削除</button>
	        </div>
	    `;

        // 3. 行全体（itemWrapper）をクリックしたとき、中のaタグのリンク先へジャンプさせる制御を追加
        itemWrapper.addEventListener('click', (e) => {
            // クリックされたのが「編集」ボタンや「削除」ボタン、またはその中身の場合はジャンプさせない
            if (e.target.closest('.action-buttons')) {
                return;
            }
            // それ以外の行全体（余白など）が押された場合はリンク先へ遷移
            window.location.href = `./count.html?categoryId=${cat.id}`;
        });

        container.appendChild(itemWrapper);
    });

}

// 要件5を満たす論理削除・連動削除処理
function deleteCategory(id) {
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let items = JSON.parse(localStorage.getItem('items')) || [];

    const currentCat = categories.find(cat => cat.id === id);
    if (!currentCat) return;

    // 紐づいている有効なアイテムを抽出
    const linkedItems = items.filter(item => item.categoryId === id && item.isDeleted !== true);

    let confirmMsg = `カテゴリー「${currentCat.name}」を削除しますか？`;
    if (linkedItems.length > 0) {
        confirmMsg = `⚠️警告: このカテゴリーを削除すると、紐づいている以下のアイテム (${linkedItems.length}件) も一緒に削除されます。よろしいですか？\n\n` +
            linkedItems.map(i => `・${i.name}`).join('\n');
    }

    if (confirm(confirmMsg)) {
        // カテゴリーの論理削除
        categories = categories.map(cat => {
            if (cat.id === id) return { ...cat, isDeleted: true };
            return cat;
        });

        // 紐づくアイテムも同時に論理削除
        items = items.map(item => {
            if (item.categoryId === id) return { ...item, isDeleted: true };
            return item;
        });

        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('items', JSON.stringify(items));

        alert('カテゴリーと紐づくアイテムを削除しました。');
        renderCategories(); // 画面を再描画
    }
}

// XSS対策
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', renderCategories);
