/**
 * 
 */const urlParams = new URLSearchParams(window.location.search);
const currentCategoryId = parseInt(urlParams.get('categoryId')) || 1;

document.addEventListener('DOMContentLoaded', () => {
    // 「戻る」ボタンのリンク先を自動設定
    const backLink = document.getElementById('back-link');
    if (backLink) {
        backLink.href = `./count.html?categoryId=${currentCategoryId}`;
    }

    // 「年」と「月」のセレクトボックスに選択肢を自動生成
    setupYearAndMonthOptions();
});

// 2. セレクトボックスの選択肢（年・月）を動的に組み立てる関数
function setupYearAndMonthOptions() {
    const yearSelect = document.getElementById('year-select');
    const monthSelect = document.getElementById('month-select');

    const currentYear = new Date().getFullYear();

    // 今年から過去3年分（例: 2026, 2025, 2024）の選択肢を作る
    yearSelect.innerHTML = '';
    for (let y = currentYear;y >= currentYear - 2;y--) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }

    // 1月〜12月の選択肢を作る
    monthSelect.innerHTML = '';
    for (let m = 1;m <= 12;m++) {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m;

        // 今の月を初期選択状態にする
        if (m === (new Date().getMonth() + 1)) {
            option.selected = true;
        }

        monthSelect.appendChild(option);
    }
}

// 3. 表示ボタンが押された時の遷移処理
function goToMonthlyRecords(event) {
    event.preventDefault(); // サーバーへの通常送信をキャンセル

    const selectedYear = document.getElementById('year-select').value;
    const selectedMonth = document.getElementById('month-select').value;

    // 選択された「年」「月」「カテゴリーID」をパラメータに乗せて、履歴画面（records.html）にジャンプ
    window.location.href = `./records.html?categoryId=${currentCategoryId}&year=${selectedYear}&month=${selectedMonth}`;
}