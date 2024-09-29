let correctAnswer = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let maxQuestions = 5;
let answerCount = 0;
let isAnswering = false;
let minNumber;
let maxNumber;

function startQuiz() {
  loadQuizState(); // クッキーから状態を読み込む

  // ユーザーが入力した最小値と最大値を取得
  minNumber = parseInt(document.getElementById("min-number").value, 10);
  maxNumber = parseInt(document.getElementById("max-number").value, 10);

  if (isNaN(minNumber) || isNaN(maxNumber) || minNumber >= maxNumber) {
    alert("有効な最小値と最大値を入力してください。");
    return;
  }

  // 初めて開始する場合のみリセット
  if (answerCount === 0) {
    answerCount = 0;
    totalQuestions = 0; // 初期化
    correctAnswers = 0; // 初期化
  }

  $("#start-button").css("display", "none");
  $("#continue-message").css("display", "none");
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("answer-count").textContent = answerCount; // カウンターをリセット
  document.getElementById("result").textContent = ""; // 結果エリアをクリア
  playQuiz(); // 引数を渡さずに初回のクイズを生成
}

function playQuiz() {
  // 引数は必要ない
  if (totalQuestions < maxQuestions) {
    isAnswering = true;

    // 指定範囲でのランダムな数字を3つ生成
    const numbers = [];
    correctAnswer =
      Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    numbers.push(correctAnswer);

    while (numbers.length < 3) {
      const number =
        Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      if (!numbers.includes(number)) {
        numbers.push(number);
      }
    }

    // 数字をシャッフル
    numbers.sort(() => Math.random() - 0.5);

    // クイズを表示
    const quizContent = document.getElementById("quiz-content");
    quizContent.innerHTML = ""; // クイズ内容をリセット
    numbers.forEach((number) => {
      const option = document.createElement("div");
      option.className = "option";
      option.textContent = number;
      option.addEventListener("click", () => {
        if (isAnswering) {
          isAnswering = false;
          checkAnswer(number === correctAnswer);
        }
      });
      quizContent.appendChild(option);
    });

    // 正しい答えを音声で読み上げる
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(correctAnswer.toString());
      utterance.lang = "es-ES";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("このブラウザは音声合成APIをサポートしていません。");
    }

    // 結果表示をリセット
    document.getElementById("result").textContent = "";
  } else {
    // クイズが5回終了したら正答率を表示
    displayScore();
  }
}

function checkAnswer(isCorrect) {
  const result = document.getElementById("result");
  totalQuestions++;
  answerCount++;
  document.getElementById("answer-count").textContent = answerCount;

  if (isCorrect) {
    correctAnswers++;
    result.textContent = "¡Correcto! 🎉";
    result.className = "correct";
  } else {
    result.textContent = "Incorrecto. 😢";
    result.className = "incorrect";
  }

  // クッキーに現在の状態を保存
  saveQuizState();

  // 次の問題を表示
  if (totalQuestions < maxQuestions) {
    setTimeout(() => {
      playQuiz();
    }, 2000);
  } else {
    // 正答率を表示
    setTimeout(displayScore, 2000);
  }
}

function displayScore() {
  //正答率を計算して表示
  const score = (correctAnswers / maxQuestions) * 100;
  const result = document.getElementById("result");
  result.textContent = `クイズ終了！正答率は ${score}% です。`;
  result.className = "score";

  //「次の質問」ボタンを「最初から」に変更
  const nextButton = document.getElementById("next-button");
  nextButton.textContent = "最初から";
  nextButton.onclick = restartQuiz;
}

function nextQuestion() {
  playQuiz(); // 次のクイズを生成
}

function replayQuiz() {
  if ("speechSynthesis" in window && correctAnswer !== 0) {
    // 現在の答えの音声を再生成して再生
    const newUtterance = new SpeechSynthesisUtterance(correctAnswer.toString());
    newUtterance.lang = "es-ES";
    window.speechSynthesis.speak(newUtterance);
  }
}

function slowReplayQuiz() {
  if ("speechSynthesis" in window && correctAnswer !== 0) {
    // 現在の答えの音声を再生成してゆっくり再生
    const newUtterance = new SpeechSynthesisUtterance(correctAnswer.toString());
    newUtterance.lang = "es-ES";
    newUtterance.rate = 0.5; // 読み上げ速度を遅くする
    window.speechSynthesis.speak(newUtterance);
  }
}

function restartQuiz() {
  localStorage.removeItem("answerCount");
  localStorage.removeItem("correctAnswers");
  localStorage.removeItem("totalQuestions");
  // 初期状態に戻す
  answerCount = 0;
  correctAnswers = 0;
  totalQuestions = 0;

  document.getElementById("start-button").style.display = "block";
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("result").textContent = "";
  document.getElementById("answer-count").textContent = "0"; // カウンターをリセット
}

// localStorageにデータを保存する関数を作成
function saveQuizState() {
  localStorage.setItem("answerCount", answerCount);
  localStorage.setItem("correctAnswers", correctAnswers);
  localStorage.setItem("totalQuestions", totalQuestions);
}

// クイズ開始時にlocalStorageからデータを読み込む
function loadQuizState() {
  const savedAnswerCount = localStorage.getItem("answerCount");
  const savedCorrectAnswers = localStorage.getItem("correctAnswers");
  const savedTotalQuestions = localStorage.getItem("totalQuestions");

  if (
    savedAnswerCount !== null &&
    savedCorrectAnswers !== null &&
    savedTotalQuestions !== null
  ) {
    answerCount = parseInt(savedAnswerCount);
    correctAnswers = parseInt(savedCorrectAnswers);
    totalQuestions = parseInt(savedTotalQuestions);
    document.getElementById("answer-count").textContent = answerCount;
  }
}