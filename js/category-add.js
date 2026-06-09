/**
 * カテゴリー新規追加処理
 */
function saveCategory(event) {
    // 1. フォームの標準のページ移動（サーバーへの送信）を止める
    event.preventDefault();

    // 2. 入力された値を取得
    const nameInput = document.getElementById('category-name').value.trim();
    const budgetInput = parseInt(document.getElementById('category-budget').value) || 0;

    if (!nameInput) {
        alert('カテゴリー名を入力してください。');
        return;
    }

    // 3. 現在localStorageに入っているカテゴリーデータを読み込む
    let categories = [];
    if (localStorage.getItem('categories')) {
        categories = JSON.parse(localStorage.getItem('categories'));
    }

    // 4. 重複しない新しいIDを生成（現在の最大のID + 1）
    const nextId = categories.length > 0
        ? Math.max(...categories.map(cat => cat.id)) + 1
        : 1;

    // 5. 新しいカテゴリーオブジェクトを作って配列に追加
    // 【修正】論理削除の判定が正しく動くよう、初期値として false を明示的に追加します
    const newCategory = {
        id: nextId,
        name: nameInput,
        budget: budgetInput,
        isDeleted: false
    };
    categories.push(newCategory);

    // 6. localStorageに上書き保存
    localStorage.setItem('categories', JSON.stringify(categories));

    // 保存が終わったら自動でホーム画面に戻る
    window.location.href = './index.html';
}
