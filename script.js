// ============================================================
// Cum se construiește un LLM — pe baza lecției Stanford CS229
// „Building Large Language Models” (Yann Dubois)
// ============================================================

const MODULES = [
  {
    icon: "🧩",
    title: "Cele 5 piese ale puzzle-ului",
    explanation: "Construirea unui model de limbaj mare (LLM) presupune cinci componente esențiale: arhitectura rețelei, algoritmul/funcția de cost folosită la antrenare, datele, modul de evaluare și sistemele de calcul. În mediul academic, cercetătorii se concentrează adesea pe arhitectură — modele noi, straturi noi. În industrie însă, companiile care construiesc LLM-uri de top investesc cel mai mult timp și resurse în date, evaluare și sisteme, pentru că acolo se câștigă cu adevărat performanța.",
    highlight: "5 componente: Arhitectură · Algoritm de antrenare · Date · Evaluare · Sisteme",
    question: "Pe ce se concentrează cel mai mult companiile care construiesc LLM-uri în producție, spre deosebire de mediul academic?",
    options: [
      "Doar pe arhitecturi noi de rețele neuronale",
      "Pe date, evaluare și sisteme de calcul",
      "Doar pe mărimea modelului",
      "Doar pe viteza de antrenare"
    ],
    correct: 1,
    feedbackCorrect: "Exact — deși arhitectura primește multă atenție academică, în producție datele, evaluarea și sistemele fac diferența reală de performanță.",
    feedbackWrong: "Răspunsul corect este „Pe date, evaluare și sisteme de calcul”. Arhitectura contează, dar în industrie celelalte trei componente cântăresc mai mult în practică."
  },
  {
    icon: "🔤",
    title: "Cum „gândește” un model de limbaj",
    explanation: "Un model de limbaj calculează o distribuție de probabilitate peste secvențe de tokenuri — practic, estimează cât de probabilă este o propoziție. De exemplu, „șoarecele a mâncat brânza” primește o probabilitate mai mare decât „brânza a mâncat șoarecele”, pentru că modelul a învățat tipare de sens din text. Modelele autoregresive descompun această probabilitate folosind regula lanțului: probabilitatea întregii secvențe este produsul probabilităților fiecărui token, condiționat de tokenurile anterioare — modelul generează textul token cu token, într-o buclă secvențială.",
    highlight: "P(x₁...x_L) = P(x₁) · P(x₂|x₁) · P(x₃|x₁,x₂) · ... — generare token cu token, secvențial",
    question: "De ce este generarea de texte lungi mai lentă la modelele autoregresive?",
    options: [
      "Pentru că generează un token pe rând, într-o buclă secvențială",
      "Pentru că traduc automat textul în alte limbi",
      "Pentru că verifică ortografia la fiecare cuvânt",
      "Pentru că folosesc mai multă memorie video decât alte modele"
    ],
    correct: 0,
    feedbackCorrect: "Corect — fiecare token nou depinde de toate cele generate anterior, deci procesul se face pas cu pas, într-o buclă.",
    feedbackWrong: "Răspunsul corect este „Pentru că generează un token pe rând, într-o buclă secvențială”. Această natură secvențială crește latența pentru secvențe lungi."
  },
  {
    icon: "✂️",
    title: "Tokenizarea — cum „vede” un model textul",
    explanation: "Înainte să fie procesat, textul este împărțit în tokenuri — bucăți de aproximativ 3-4 caractere în medie. Tokenizarea la acest nivel face modelul mai rezistent la greșeli de scriere, permite gestionarea limbilor cu alte alfabete și reduce lungimea secvenței (esențial, pentru că un Transformer are un cost de calcul care crește pătratic cu lungimea secvenței). Algoritmul standard este Byte-Pair Encoding (BPE): se pornește de la caractere individuale, apoi se unesc repetat cele mai frecvente perechi, până se ajunge la vocabularul dorit. O problemă cunoscută: numerele (ex: „327”) devin adesea un singur token, ceea ce limitează capacitatea modelului de a face calcule matematice corect.",
    highlight: "1 token ≈ 3-4 caractere · Numerele lungi devin adesea 1 singur token → probleme la matematică",
    question: "Ce problemă este semnalată legat de tokenizarea numerelor, precum „327”?",
    options: [
      "Numărul devine adesea un singur token, ceea ce limitează raționamentul matematic",
      "Numerele sunt complet ignorate de model",
      "Numerele necesită de zece ori mai multă memorie GPU",
      "Numerele sunt automat traduse în cuvinte"
    ],
    correct: 0,
    feedbackCorrect: "Corect — dacă „327” e un singur token, modelul nu „vede” cifrele individuale, ceea ce îngreunează operațiile matematice pas cu pas.",
    feedbackWrong: "Răspunsul corect este că numărul devine adesea un singur token, limitând raționamentul matematic compozițional al modelului."
  },
  {
    icon: "📊",
    title: "Cum măsurăm cât de „bun” este un model",
    explanation: "Perplexitatea este o măsură clasică: reprezintă, aproximativ, „între câte tokenuri ezită” modelul la fiecare pas — variază între 1 (predicție perfectă) și dimensiunea vocabularului (nicio cunoștință). A scăzut spectaculos, de la aproximativ 70 în 2017 la sub 10 în 2023. Problema ei este că depinde de tokenizer și de setul de date folosit, deci nu poți compara direct două modele diferite prin perplexitate. De aceea, cercetătorii preferă azi teste standardizate precum MMLU — întrebări cu variante multiple de răspuns, din domenii variate (medicină, fizică, astronomie etc.), comparabile între modele diferite.",
    highlight: "Perplexitate: ~70 (2017) → sub 10 (2023) · MMLU = test grilă multi-domeniu, comparabil între modele",
    question: "De ce este perplexitatea considerată nepotrivită pentru compararea directă a două modele diferite?",
    options: [
      "Depinde de tokenizer și de setul de date folosit, deci nu e comparabilă direct",
      "Este prea greu de calculat din punct de vedere matematic",
      "Se poate aplica doar modelelor foarte mici",
      "Nu are nicio legătură cu calitatea reală a modelului"
    ],
    correct: 0,
    feedbackCorrect: "Corect — perplexitatea variază în funcție de tokenizer și de datele de test, deci două modele cu tokenizări diferite nu sunt comparabile direct prin ea.",
    feedbackWrong: "Răspunsul corect este că perplexitatea depinde de tokenizer și de setul de date, ceea ce o face nepotrivită pentru comparații directe — de aceea se preferă MMLU."
  },
  {
    icon: "🌐",
    title: "De unde vin datele — și legile de scalare",
    explanation: "Materia primă pentru pre-antrenare vine în principal din Common Crawl, o arhivă web de aproximativ 250 de miliarde de pagini (circa 1 petabyte), filtrată agresiv pentru a elimina conținutul repetitiv, datele personale și textul de calitate slabă. Modelele moderne ajung să fie antrenate pe trilioane de tokenuri — Llama 2 a folosit 2 trilioane, Llama 3 a folosit 15 trilioane. „Legile de scalare” arată un tipar remarcabil: mai mult calcul, mai multe date sau un model mai mare duc, în mod previzibil, la performanță mai bună. Studiul Chinchilla a arătat că, pentru un antrenament optim din punct de vedere al calculului, raportul ideal este de aproximativ 20 de tokenuri per parametru — deși, în producție, companiile antrenează adesea cu mult mai multe date per parametru, pentru a obține modele mai ieftine de rulat ulterior.",
    highlight: "Common Crawl ≈ 250 mld pagini · Llama 3 ≈ 15 trilioane tokenuri · Regula Chinchilla ≈ 20 tokenuri/parametru",
    question: "Conform legii Chinchilla, care este raportul optim (aproximativ) între tokenuri și parametri, pentru antrenare eficientă din punct de vedere al calculului?",
    options: [
      "20 de tokenuri per parametru",
      "1 token per parametru",
      "1000 de tokenuri per parametru",
      "Nu există niciun raport optim identificat"
    ],
    correct: 0,
    feedbackCorrect: "Corect — studiul Chinchilla a stabilit acest raport de aproximativ 20:1 ca fiind optim pentru calculul de antrenare, chiar dacă producția folosește adesea rapoarte mai mari.",
    feedbackWrong: "Răspunsul corect este 20 de tokenuri per parametru — acesta este raportul optim identificat de studiul Chinchilla."
  },
  {
    icon: "💰",
    title: "Cât costă, cu adevărat, un LLM de top",
    explanation: "Antrenarea unui model de dimensiunea Llama 3 (400 de miliarde de parametri) este estimată la aproximativ 3,8×10²⁵ operații de calcul (flops) — echivalentul a circa 70 de zile de antrenare pe 16.000 de plăci video H100. Doar chiria GPU-urilor se ridică la aproximativ 52 de milioane de dolari, la care se adaugă costurile echipei de cercetare (aproximativ 25 de milioane de dolari pentru 50 de oameni), rezultând un total estimat de circa 75 de milioane de dolari — plus o amprentă de carbon de aproximativ 4.000 de tone de CO₂ echivalent.",
    highlight: "~70 zile · 16.000 GPU-uri H100 · ~75 milioane $ total · ~4.000 tone CO₂ echivalent",
    question: "Aproximativ cât a costat antrenarea unui model de dimensiunea Llama 3 (400B), incluzând GPU-uri și personal?",
    options: [
      "~75 milioane de dolari",
      "~750 de dolari",
      "~7,5 milioane de dolari",
      "~7,5 miliarde de dolari"
    ],
    correct: 0,
    feedbackCorrect: "Corect — aproximativ 52 de milioane de dolari pentru GPU-uri, plus circa 25 de milioane pentru echipa de cercetare, adică un total estimat de ~75 milioane de dolari.",
    feedbackWrong: "Răspunsul corect este ~75 milioane de dolari, combinând costul GPU-urilor (~52 mil.) cu cel al echipei de cercetare (~25 mil.)."
  },
  {
    icon: "🎯",
    title: "De la text brut la asistent util: SFT, RLHF, DPO",
    explanation: "Un model antrenat doar pe predicția următorului cuvânt nu știe automat să răspundă la instrucțiuni — de exemplu, un model precum GPT-3 „brut” tinde să continue cu întrebări similare, nu să răspundă efectiv. Aici intervine post-antrenarea. Primul pas este SFT (Supervised Fine-Tuning): modelul este reantrenat pe exemple scrise de oameni, de tip întrebare-răspuns ideal — proiectul Alpaca a generat 52.000 de asemenea exemple sintetic, pornind de la doar 175 scrise de oameni. Pasul următor este alinierea prin preferințe: metoda clasică, RLHF cu algoritmul PPO (folosită la ChatGPT), antrenează un „model de recompensă” pe perechi de răspunsuri comparate de oameni, apoi optimizează modelul să maximizeze această recompensă. O alternativă mai recentă și mult mai simplă este DPO (Direct Preference Optimization): elimină modelul de recompensă separat și reinforcement learning-ul, optimizând direct modelul să prefere răspunsurile bune față de cele slabe, printr-un simplu antrenament de tip „maximum likelihood”.",
    highlight: "SFT = exemple ideale scrise de oameni · RLHF (PPO) = model de recompensă + reinforcement learning · DPO = variantă simplificată, fără model de recompensă separat",
    question: "Care este avantajul principal al DPO (Direct Preference Optimization) față de RLHF clasic cu PPO?",
    options: [
      "Elimină nevoia de model de recompensă separat și de reinforcement learning, fiind mai simplu",
      "Este de 100 de ori mai rapid la inferență",
      "Nu necesită deloc date etichetate de oameni",
      "Funcționează doar pe modele foarte mici"
    ],
    correct: 0,
    feedbackCorrect: "Corect — DPO simplifică procesul, optimizând direct preferințele printr-un antrenament standard, fără să mai fie nevoie de un model de recompensă separat sau de reinforcement learning.",
    feedbackWrong: "Răspunsul corect este că DPO elimină nevoia de model de recompensă separat și de reinforcement learning, fiind mult mai simplu de implementat decât PPO."
  },
  {
    icon: "⚖️",
    title: "Cum evaluăm un model care deja „vorbește frumos”",
    explanation: "După alinierea printr-o metodă precum RLHF sau DPO, evaluarea devine mai dificilă: răspunsurile sunt deschise, fără un singur răspuns „corect”, iar măsuri precum perplexitatea nu mai au sens pentru modele aliniate. Metoda considerată cea mai de încredere este Chatbot Arena — oamenii compară în orb perechi de răspunsuri de la modele diferite, la scară de peste 100.000 de comparații. Este însă lentă și costisitoare. O alternativă mult mai rapidă este evaluarea automată: se cere unui alt model puternic (de exemplu GPT-4) să decidă care dintre două răspunsuri este mai bun. Această metodă are o corelație de aproximativ 98% cu rezultatele din Chatbot Arena, costă sub 10 dolari și durează sub 3 minute per rundă de evaluare — dar poate avea o tendință de a prefera răspunsurile mai lungi, motiv pentru care rezultatele sunt ajustate statistic pentru a corecta acest bias.",
    highlight: "Chatbot Arena = comparații umane în orb (referință) · Evaluare cu LLM = ~98% corelație, <3 min, <10$, dar cu bias spre răspunsuri lungi",
    question: "Ce corelație are evaluarea automată (folosind un model puternic drept „judecător”) cu rezultatele din Chatbot Arena?",
    options: [
      "Aproximativ 98% corelație",
      "Aproximativ 10% corelație",
      "Nicio corelație semnificativă",
      "O corelație negativă"
    ],
    correct: 0,
    feedbackCorrect: "Corect — evaluarea automată cu un LLM „judecător” atinge aproximativ 98% corelație cu Chatbot Arena, fiind mult mai rapidă și mai ieftină.",
    feedbackWrong: "Răspunsul corect este aproximativ 98% corelație — de aceea evaluarea automată a devenit un substitut practic pentru Chatbot Arena, în ciuda unor limitări (precum bias-ul spre răspunsuri lungi)."
  }
];

const TIPS = [
  "Arhitectura contează mai puțin decât datele, evaluarea și sistemele — modificările mici de arhitectură rareori compensează o preprocesare slabă a datelor.",
  "Legile de scalare sunt predictibile — experimente la scară mică pot anticipa performanța modelelor mari, înainte de a investi milioane de dolari.",
  "Post-antrenarea este esențială — alinierea prin SFT și învățarea din preferințe (PPO/DPO) a transformat un model de limbaj brut într-un asistent util, de tip ChatGPT.",
  "Datele rămân o problemă deschisă — colectarea, filtrarea și amestecul de domenii sunt încă subiecte de cercetare activă.",
  "Calculul este scump și limitat — costul financiar și amprenta de carbon influențează puternic deciziile practice de antrenare a modelelor mari."
];

const POINTS_PER_QUESTION = 10;
const POINTS_MAX = MODULES.length * POINTS_PER_QUESTION;

let currentIndex = 0;
let score = 0;
let answered = false;

const screenIntro = document.getElementById("screen-intro");
const screenGame = document.getElementById("screen-game");
const screenResult = document.getElementById("screen-result");

const btnStart = document.getElementById("btn-start");
const btnNext = document.getElementById("btn-next");
const btnRestart = document.getElementById("btn-restart");

const progressLabel = document.getElementById("progress-label");
const scoreLabel = document.getElementById("score-label");
const progressFill = document.getElementById("progress-fill");

const moduleIcon = document.getElementById("module-icon");
const moduleTitleText = document.getElementById("module-title-text");
const moduleExplanation = document.getElementById("module-explanation");
const moduleHighlight = document.getElementById("module-highlight");
const quizQuestion = document.getElementById("quiz-question");
const optionsList = document.getElementById("options-list");

const feedbackPanel = document.getElementById("feedback-panel");
const feedbackBadge = document.getElementById("feedback-badge");
const feedbackText = document.getElementById("feedback-text");

const resultBadgeIcon = document.getElementById("result-badge-icon");
const resultLevel = document.getElementById("result-level");
const resultScore = document.getElementById("result-score");
const resultMessage = document.getElementById("result-message");
const tipsList = document.getElementById("tips-list");

function showScreen(screen) {
  [screenIntro, screenGame, screenResult].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function startGame() {
  currentIndex = 0;
  score = 0;
  showScreen(screenGame);
  renderModule();
}

function renderModule() {
  answered = false;
  feedbackPanel.classList.add("hidden");
  feedbackPanel.classList.remove("correct", "wrong");

  const mod = MODULES[currentIndex];
  moduleIcon.textContent = mod.icon;
  moduleTitleText.textContent = mod.title;
  moduleExplanation.textContent = mod.explanation;
  moduleHighlight.textContent = mod.highlight;
  quizQuestion.textContent = mod.question;

  progressLabel.textContent = `Modulul ${currentIndex + 1} din ${MODULES.length}`;
  scoreLabel.textContent = `Scor: ${score}`;
  progressFill.style.width = `${(currentIndex / MODULES.length) * 100}%`;

  optionsList.innerHTML = "";
  mod.options.forEach((optText, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = optText;
    btn.addEventListener("click", () => selectOption(i));
    optionsList.appendChild(btn);
  });
}

function selectOption(optionIndex) {
  if (answered) return;
  answered = true;

  const mod = MODULES[currentIndex];
  const isCorrect = optionIndex === mod.correct;
  if (isCorrect) score += POINTS_PER_QUESTION;

  const optionButtons = optionsList.querySelectorAll(".option-btn");
  optionButtons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === optionIndex && isCorrect) {
      btn.classList.add("selected-correct");
    } else if (i === optionIndex && !isCorrect) {
      btn.classList.add("selected-wrong");
    } else if (i === mod.correct) {
      btn.classList.add("reveal-correct");
    } else {
      btn.classList.add("dim");
    }
  });

  feedbackPanel.classList.remove("hidden");
  feedbackPanel.classList.add(isCorrect ? "correct" : "wrong");
  feedbackBadge.textContent = isCorrect ? "Corect!" : "Nu tocmai";
  feedbackText.textContent = isCorrect ? mod.feedbackCorrect : mod.feedbackWrong;

  scoreLabel.textContent = `Scor: ${score}`;
  btnNext.textContent = currentIndex === MODULES.length - 1 ? "Vezi rezultatul" : "Continuă";
}

function nextStep() {
  if (currentIndex < MODULES.length - 1) {
    currentIndex++;
    renderModule();
  } else {
    finishGame();
  }
}

function finishGame() {
  progressFill.style.width = "100%";
  const pct = Math.round((score / POINTS_MAX) * 100);

  let level, icon, message;
  if (pct >= 90) {
    level = "Ai stăpânit lecția";
    icon = "🏆";
    message = "Ai înțeles foarte bine conceptele cheie din construirea LLM-urilor: de la tokenizare și legile de scalare, până la alinierea prin RLHF/DPO și evaluare.";
  } else if (pct >= 70) {
    level = "Bază solidă";
    icon = "🥈";
    message = "Cunoști bine ideile principale, dar mai sunt câteva detalii tehnice — recitește explicațiile modulelor greșite pentru a le fixa.";
  } else if (pct >= 50) {
    level = "Ai nevoie de o recapitulare";
    icon = "🎯";
    message = "Ai prins câteva concepte, dar altele necesită revizuire. Reia aplicația și acordă atenție secțiunilor „De reținut”.";
  } else {
    level = "Recomandăm revizuirea video-ului";
    icon = "📘";
    message = "Conceptele din această lecție sunt destul de tehnice — merită să revezi video-ul original și apoi să reiei aplicația.";
  }

  resultBadgeIcon.textContent = icon;
  resultLevel.textContent = level;
  resultScore.textContent = `Scor: ${score} / ${POINTS_MAX} (${pct}%)`;
  resultMessage.textContent = message;

  tipsList.innerHTML = "";
  TIPS.forEach(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  showScreen(screenResult);
}

btnStart.addEventListener("click", startGame);
btnNext.addEventListener("click", nextStep);
btnRestart.addEventListener("click", startGame);

