/**
 * 
 */
/**
 * 
 */
const urlParams = new URLSearchParams(window.location.search);
const targetId = parseInt(urlParams.get('id'));

// 2. ページ読み込み時に既存のデータをフォームにセットする処理
document.addEventListener('DOMContentLoaded', () => {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    // 該当するカテゴリーを探す
    const category = categories.find(cat => cat.id === targetId);

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
                budget: budgetInput
            };
        }
        return cat;
    });

    // localStorageに上書き保存
    localStorage.setItem('categories', JSON.stringify(categories));


    // 保存が終わったら自動でホーム画面に戻る
    window.location.href = './index.html';
}