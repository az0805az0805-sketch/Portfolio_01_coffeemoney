const urlParams = new URLSearchParams(window.location.search);
const targetId = parseInt(urlParams.get('id'));

// 2. ページ読み込み時に既存のデータをフォームにセットする処理
document.addEventListener('DOMContentLoaded', () => {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    // 【修正】該当し、かつ論理削除されていないカテゴリーを探す
    const category = categories.find(cat => cat.id === targetId && cat.isDeleted !== true);

    if (category) {
        // フォームの各入力欄に現在の値をセット
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-budget').value = category.budget || 0;
    } else {
        alert('指定されたカテゴリーが見つかりません。');
        window.location.href = './index.html';
    }
});

// 3. 更新ボタンが押された時の上書き保存処理
function updateCategory(event) {
    event.preventDefault(); // サーバーへの送信をキャンセル

    const nameInput = document.getElementById('category-name').value.trim();
    const budgetInput = parseInt(document.getElementById('category-budget').value) || 0;

    if (!nameInput) {
        alert('カテゴリー名を入力してください。');
        return;
    }

    let categories = JSON.parse(localStorage.getItem('categories')) || [];

    // 該当するカテゴリーのデータを書き換える
    categories = categories.map(cat => {
        if (cat.id === targetId) {
            return {
                id: cat.id,
                name: nameInput,
                budget: budgetInput,
                isDeleted: cat.isDeleted || false // 既存のフラグを維持
            };
        }
        return cat;
    });

    // localStorageに上書き保存
    localStorage.setItem('categories', JSON.stringify(categories));

    // 保存が終わったら自動でホーム画面に戻る
    window.location.href = './index.html';
}

// 【新規追加】4. 削除ボタンが押された時の論理削除・連動削除処理
function deleteCategory(event) {
    event.preventDefault();

    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let items = JSON.parse(localStorage.getItem('items')) || [];

    // 現在のカテゴリー名を取得
    const currentCat = categories.find(cat => cat.id === targetId);
    if (!currentCat) return;

    // 【要件5】このカテゴリーに紐づいている有効なアイテムを抽出
    const linkedItems = items.filter(item => item.categoryId === targetId && item.isDeleted !== true);

    // アラートメッセージの作成
    let confirmMsg = `カテゴリー「${currentCat.name}」を削除しますか？`;
    if (linkedItems.length > 0) {
        // 【要件5】紐づくアイテムも削除される旨のアラート表示
        confirmMsg = `⚠️警告: このカテゴリーを削除すると、紐づいている以下のアイテム (${linkedItems.length}件) も一緒に削除されます。よろしいですか？\n\n` +
            linkedItems.map(i => `・${i.name}`).join('\n');
    }

    // ユーザーがOKを押した場合のみ削除を実行
    if (confirm(confirmMsg)) {
        // カテゴリーの論理削除（isDeletedをtrueにする）
        categories = categories.map(cat => {
            if (cat.id === targetId) {
                return { ...cat, isDeleted: true };
            }
            return cat;
        });

        // 【要件5】紐づくアイテムも同時に論理削除
        items = items.map(item => {
            if (item.categoryId === targetId) {
                return { ...item, isDeleted: true };
            }
            return item;
        });

        // localStorageに結果を保存
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('items', JSON.stringify(items));

        alert('カテゴリーと紐づくアイテムを削除しました。');
        window.location.href = './index.html';
    }
}
