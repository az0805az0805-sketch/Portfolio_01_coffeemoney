/**
 * アイテム新規追加処理
 */
const urlParams = new URLSearchParams(window.location.search);
const currentCategoryId = parseInt(urlParams.get('categoryId')) || 1;

// 2. ページ読み込み時に「戻る」ボタンのリンク先とhiddenフィールドにIDをセットする
document.addEventListener('DOMContentLoaded', () => {
    // フォーム内の隠しフィールドにカテゴリーIDをセット
    const categoryIdInput = document.getElementById('category-id');
    if (categoryIdInput) categoryIdInput.value = currentCategoryId;

    // 元のカウント画面にIDを引き継いで戻るように「戻る」ボタンのURLを設定
    const backLink = document.getElementById('back-link');
    if (backLink) backLink.href = `./count.html?categoryId=${currentCategoryId}`;
});

// 3. 追加ボタンが押された時の保存処理
function saveItem(event) {
    event.preventDefault(); // サーバーへの通常送信をキャンセル

    const nameInput = document.getElementById('item-name').value.trim();
    const priceInput = parseInt(document.getElementById('item-price').value) || 0;

    if (!nameInput) {
        alert('アイテム名を入力してください。');
        return;
    }

    // 現在のアイテム一覧をlocalStorageから読み込む
    let items = JSON.parse(localStorage.getItem('items')) || [];

    // 重複しない新しいアイテムIDを生成（最大のID + 1）
    const nextId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 101;

    // 新しいアイテムオブジェクトを作成（現在のカテゴリーIDと紐付ける）
    const newItem = {
        id: nextId,
        categoryId: currentCategoryId,
        name: nameInput,
        price: priceInput,
        isDeleted: false
    };

    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));

    // 保存が終わったら、IDを引き継いで元のカウント画面に自動で戻る
    window.location.href = `./count.html?categoryId=${currentCategoryId}`;
}
