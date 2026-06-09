const urlParams = new URLSearchParams(window.location.search);
const targetId = parseInt(urlParams.get('id'));
const currentCategoryId = parseInt(urlParams.get('categoryId')) || 1;

// 2. ページ読み込み時に既存のデータをフォームにセットする処理
document.addEventListener('DOMContentLoaded', () => {
    // 「戻る」ボタンのリンク先を現在のカウント画面（ID付き）に設定
    const backLink = document.getElementById('back-link');
    if (backLink) backLink.href = `./count.html?categoryId=${currentCategoryId}`;

    const items = JSON.parse(localStorage.getItem('items')) || [];
    // 【修正】該当し、かつ論理削除されていないアイテムを探す
    const item = items.find(i => i.id === targetId && i.isDeleted !== true);

    if (item) {
        // フォームの各入力欄に現在の値をセット
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price').value = item.price || 0;
    } else {
        alert('指定されたアイテムが見つかりません。');
        window.location.href = `./count.html?categoryId=${currentCategoryId}`;
    }
});

// 3. 更新ボタンが押された時の上書き保存処理
function updateItem(event) {
    event.preventDefault(); // サーバーへの送信をキャンセル

    const nameInput = document.getElementById('item-name').value.trim();
    const priceInput = parseInt(document.getElementById('item-price').value) || 0;

    if (!nameInput) {
        alert('アイテム名を入力してください。');
        return;
    }

    let items = JSON.parse(localStorage.getItem('items')) || [];

    // 該当するアイテムのデータを書き換える
    items = items.map(item => {
        if (item.id === targetId) {
            return {
                id: item.id,
                categoryId: currentCategoryId,
                name: nameInput,
                price: priceInput,
                isDeleted: item.isDeleted || false // 既存のフラグ状態を維持
            };
        }
        return item;
    });

    // localStorageに上書き保存
    localStorage.setItem('items', JSON.stringify(items));

    // 保存が終わったら自動で元のカウント画面に戻る
    window.location.href = `./count.html?categoryId=${currentCategoryId}`;
}

// 4. 削除ボタンが押された時の消去（論理削除）処理
function removeItem(event) {
    event.preventDefault(); // サーバーへの送信をキャンセル

    let items = JSON.parse(localStorage.getItem('items')) || [];

    // 現在のアイテム名を取得
    const currentItem = items.find(item => item.id === targetId);
    if (!currentItem) return;

    
    if (confirm(`アイテム「${currentItem.name}」を削除しますか？`)) {
        // 【修正】配列から物理削除するのではなく、フラグを true に書き換える
        items = items.map(item => {
            if (item.id === targetId) {
                return { ...item, isDeleted: true };
            }
            return item;
        });

        // localStorageに上書き保存
        localStorage.setItem('items', JSON.stringify(items));

        alert('アイテムを削除しました。');
        // 削除が終わったら自動で元のカウント画面に戻る
        window.location.href = `./count.html?categoryId=${currentCategoryId}`;
    }
}
