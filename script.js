let correctAnswer = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let maxQuestions = 5;
let answerCount = 0;
let isAnswering = false;
let minNumber;
let maxNumber;
let selectedLanguage = "en"; // デフォルトは英語
// 言語ごとのメッセージを定義
const messages = {
  en: { correct: "Correct! 🎉", incorrect: "Incorrect. 😢" },
  es: { correct: "¡Correcto! 🎉", incorrect: "Incorrecto. 😢" },
  zh: { correct: "正确! 🎉", incorrect: "错误. 😢" },
  vi: { correct: "Chính xác! 🎉", incorrect: "Không chính xác. 😢" },
};

function hideLanguageInfo() {
  document.getElementById("header-title").innerText = "設定画面";
  document.getElementById("language-label").innerText = "【言語】";
  document.getElementById("min-number").classList.add("show-spinner");
  document.getElementById("max-number").classList.add("show-spinner");
  $("#language-select, #save-button, .number-input-field, #quiz-type, #timer-setting"
  ).css("display", "block");

  $(
    "#setting-icon, #info-message, #continue-message, #start-button, #min-input-number, #max-input-number, #selected-language, #timer-seconds-container"
  ).css("display", "none");
}
// 最小値と最大値のフィールドにはスピンボタンを表示させる

$("#setting-icon").on("click", function () {
  hideLanguageInfo();
});

// 言語コードと表示する言語名をマッピング
const languageMap = {
  en: "英語",
  es: "スペイン語",
  zh: "中国語",
  vi: "ベトナム語",
};

function updateLanguage() {
  const languageSelect = document.getElementById("language-select");
  switch (languageSelect.value) {
    case "english":
      selectedLanguage = "en"; // 英語
      break;
    case "spanish":
      selectedLanguage = "es"; // スペイン語
      break;
    case "chinese":
      selectedLanguage = "zh"; // 中国語
      break;
    case "vietnamese":
      selectedLanguage = "vi"; // ベトナム語
      break;
    default:
      selectedLanguage = "en"; // デフォルトは英語
  }
  const displayLanguage = languageMap[selectedLanguage];
  document.getElementById("selected-language").innerHTML = displayLanguage; // ラベルに反映
}

// 言語を選択する関数
function setLanguage(language) {
  selectedLanguage = language;
}

document.getElementById("save-button").addEventListener("click", function () {
  saveSettings();

  // クイズタイプの保存処理を移動
  const quizType = document.querySelector(
    'input[name="quizType"]:checked'
  ).value;
  localStorage.setItem("selectedQuizType", quizType);
  location.reload(); // ページをリロードして最初の画面に戻る
});

function saveSettings() {
  const timerType = document.querySelector(
    'input[name="timerChoice"]:checked'
  ).value;

  // タイマー設定を localStorage に保存
  localStorage.setItem("timerType", timerType);

  // localStorage に正しく保存されたか確認する
  const savedTimerType = localStorage.getItem("timerType");
  console.log("保存されたタイマー設定:", savedTimerType);

  if (savedTimerType) {
    alert("設定が保存されました。");
  } else {
    alert("設定の保存に失敗しました。");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // 保存されたクイズタイプを取得
  const savedQuizType = localStorage.getItem("selectedQuizType");

  if (savedQuizType) {
    //保存されたクイズタイプをに基づいて、クイズを初期化
    document.querySelector(`input[name="quizType"][value="${savedQuizType}"]`).checked = true;

  }
  // 初期状態を設定
  //toggleTimerOptions();

  // タイマーの選択肢に変更イベントを設定
  /*const timerChoices = document.querySelectorAll('input[name="timerChoice"]');
  timerChoices.forEach((choice) => {
    choice.addEventListener("change", toggleTimerOptions);
  });*/
});

/*function toggleTimerOptions() {
  // タイマー選択肢の選択状態を取得
  const timerChoice = document.querySelector(
    'input[name="timerChoice"]:checked'
  ).value;
  const timerSecondsContainer = document.getElementById(
    "timer-seconds-container"
  );

  if (timerChoice === "yes-timer") {
    timerSecondsContainer.style.display = "block"; // タイマーオプションを表示
  } else {
    timerSecondsContainer.style.display = "none"; // タイマーオプションを非表示
  }
}*/

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

  $(
    "#start-button, #restart-button, #continue-message, #language-label, #language-select, #type-multiple-choice, #type-audio-input"
  ).css("display", "none");
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("answer-count").textContent = answerCount; // カウンターをリセット
  document.getElementById("result").textContent = ""; // 結果エリアをクリア

  playQuiz(); // 引数を渡さずに初回のクイズを生成
}

function playQuiz() {
  console.log("playQuiz 関数が呼ばれました");

  $("#setting-icon").css("display", "none");

  // 保存されたクイズタイプを取得
  const savedQuizType = localStorage.getItem("selectedQuizType");
  console.log("保存されたクイズタイプ:", savedQuizType);

  if (totalQuestions < maxQuestions) {
    isAnswering = true; //回答可能にする
    console.log(
      "totalQuestions:",
      totalQuestions,
      "maxQuestions:",
      maxQuestions
    ); // 追加
    console.log("savedQuizTypeがチェックされました:", savedQuizType);

    if (savedQuizType === "multiple-choice") {
      console.log("複数選択クイズを作成中");
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
      document.getElementById("quiz-container").style.display = "block";

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
        const utterance = new SpeechSynthesisUtterance(
          correctAnswer.toString()
        );
        utterance.lang = selectedLanguage; // 選択された言語を設定
        window.speechSynthesis.speak(utterance);
      } else {
        alert("このブラウザは音声合成APIをサポートしていません。");
      }

      // 結果表示をリセット
      document.getElementById("result").textContent = "";
    } else if (savedQuizType === "audio-input") {
      // 音声を聞いて数字を直接入力するクイズの場合
      correctAnswer =
        Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      // 音声で正しい答えを読み上げる
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(
          correctAnswer.toString()
        );
        utterance.lang = selectedLanguage;
        window.speechSynthesis.speak(utterance);
      } else {
        alert("このブラウザは音声合成APIをサポートしていません。");
      }
      // クイズのUIをリセットし、入力フィールドを表示
      quizContent.innerHTML = ""; // クイズ内容をリセット

      // ボタン要素を取得
      const submitButton = document.getElementById("submit-answer");
      submitButton.addEventListener("click", () => {
        if (isAnswering) {
          isAnswering = false;
          if (timerType === "with-timer") {
            clearTimeout(timer); // タイマーをクリア
          }
          const userAnswer = parseInt(
            document.getElementById("user-answer").value
          );
          checkAnswer(userAnswer === correctAnswer);
        }
      });
      // 結果表示をリセット
      document.getElementById("result").textContent = "";
    } else {
      // クイズが終了したら正答率を表示
      displayScore();
    }
  }
}

function checkAnswer(isCorrect) {
  const result = document.getElementById("result");
  totalQuestions++;
  answerCount++;
  document.getElementById("answer-count").textContent = answerCount;

  if (isCorrect) {
    correctAnswers++;
    result.textContent = messages[selectedLanguage].correct;
    result.className = "correct";
  } else {
    result.textContent = messages[selectedLanguage].incorrect;
    result.className = "incorrect";
  }
  // このタイミングで結果を表示する
  document.getElementById("result").style.display = "block";

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

  $("#restart-button").css("display", "block");
  $("#restart-button").off("click").on("click", restartQuiz);
}

function replayQuiz() {
  const button = document.getElementById("replay-button"); // ボタンのIDを指定
  button.disabled = true; // ボタンを無効にする
  if ("speechSynthesis" in window && correctAnswer !== 0) {
    // 現在の答えの音声を再生成して再生
    const newUtterance = new SpeechSynthesisUtterance(correctAnswer.toString());
    newUtterance.lang = selectedLanguage;
    // 音声の再生が終わった時にボタンを有効化
    newUtterance.onend = function () {
      button.disabled = false; // 音声再生が完了したらボタンを再有効化
    };
    window.speechSynthesis.speak(newUtterance);
  } else {
    console.log(
      "音声合成はサポートされていないか、正しい値が設定されていません。"
    );
    button.disabled = false; // 音声合成がサポートされていない場合もボタンを再有効化
  }
}

function slowReplayQuiz() {
  const button = document.getElementById("slow-read-button"); // ボタンのIDを指定
  button.disabled = true; // ボタンを無効にする
  if ("speechSynthesis" in window && correctAnswer !== 0) {
    // 現在の答えの音声を再生成してゆっくり再生
    const newUtterance = new SpeechSynthesisUtterance(correctAnswer.toString());
    newUtterance.lang = selectedLanguage;
    // 音声の再生が終わった時にボタンを有効化
    newUtterance.onend = function () {
      button.disabled = false; // 音声再生が完了したらボタンを再有効化
    };
    newUtterance.rate = 0.5; // 読み上げ速度を遅くする
    window.speechSynthesis.speak(newUtterance);
  } else {
    console.log(
      "音声合成はサポートされていないか、正しい値が設定されていません。"
    );
    button.disabled = false; // 音声合成がサポートされていない場合もボタンを再有効化
  }
}

function restartQuiz() {
  // localStorageのデータをクリア
  localStorage.removeItem("answerCount");
  localStorage.removeItem("correctAnswers");
  localStorage.removeItem("totalQuestions");

  // 初期状態に戻す
  answerCount = 0;
  correctAnswers = 0;
  totalQuestions = 0;
  correctAnswer = 0; // correctAnswerをリセット

  // 必要な要素の表示状態をリセット
  $(
    "#setting-icon, #info-message, #continue-message, #language-label, #start-button, #min-input-number, #max-input-number, #selected-language"
  ).css("display", "block");

  // クイズ関連の要素を非表示にする
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("result").textContent = "";
  document.getElementById("answer-count").textContent = "0"; // カウンターをリセット

  // 入力フィールドのリセット
  const userInput = document.getElementById("user-answer");
  if (userInput) {
    userInput.value = ""; // 入力フィールドを空に
  }
}


// localStorageにデータを保存する関数を作成
function saveQuizState() {
  localStorage.setItem("answerCount", answerCount);
  localStorage.setItem("correctAnswers", correctAnswers);
  localStorage.setItem("totalQuestions", totalQuestions);
}

// クイズ開始時にlocalStorageからデータを読み込む
function loadQuizState() {
  console.log("読み込んだ後の totalQuestions:", totalQuestions);
  console.log("maxQuestions:", maxQuestions);

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

let timeLeft = 0;
let timerInterval;

function startTimer() {
  const timerDisplay = document.getElementById("timer");

  // タイマーをクリアしてから開始
  clearInterval(timerInterval);
  timerDisplay.textContent = timeLeft + " 秒";

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft + " 秒";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "時間切れ！";
      // 時間切れの場合、次の問題に進むなどの処理を追加
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  // 時間切れの場合の処理をここに追加
  console.log("時間が切れました。次の問題に進みます。");
  // 次の問題に自動的に進む処理などを追加
}


