
      (() => {
        const $ = (selector, root = document) => root.querySelector(selector);
        const screen = $("#screen");
        const params = new URLSearchParams(location.search);
        const validBrands = ["nexustours", "royalton", "ph"];
        const pageBrand = (document.body.dataset.brand || "").toLowerCase();
        let brand = validBrands.includes(pageBrand) ? pageBrand : "nexustours";
        let lang = (params.get("lang") || "es").toLowerCase() === "en" ? "en" : "es";
        const campaignUrl = {
          nexustours: "https://www.nexustours.com/",
          royalton: "https://royalton.nexustours.com/",
          ph: "https://planet.nexustours.com/"
        };
        const brandNames = { nexustours: "NexusTours", royalton: "Royalton", ph: "PH" };
        const storageKey = `find-the-treat-halloween-2026-${brand}`;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let game = null;
        let roundPhase = "";

        const copy = {
          es: {
            campaign: "JUEGO DE HALLOWEEN", find: "Encuentra el <em>premio.</em>", intro: "Sigue la pelota, encuentra el vaso correcto y desbloquea un descuento especial.",
            facts: ["5 vasos", "3 oportunidades", "1 premio"], play: "JUGAR AHORA", reminder: "Tienes hasta 3 intentos para encontrarla.",
            keepEyes: "MANTÉN LA VISTA EN EL PREMIO", journey: ["ESCANEA", "JUEGA", "ENCUENTRA", "DISFRUTA"], privacy: "Tu partida se guarda por 24 horas.",
            footerLeft: "Un toque de magia de Halloween, para ti.", footerRight: "Juega limpio. Diviértete. Viaja feliz.",
            gameEyebrow: "EL JUEGO DE LOS VASOS", peekTitle: "¡No pierdas de vista la pelota!", peekText: "La pelota está debajo de uno de los vasos. Obsérvala bien.",
            shuffleTitle: "¡Sigue la pelota!", shuffleText: "Mira con atención mientras los vasos se mueven.",
            chooseTitle: "¿Dónde está la pelota?", chooseText: "Selecciona el vaso donde crees que se escondió.",
            attempt: "Intento", of: "de", cups: "VASOS", hintPeek: "Recuerda dónde viste la pelota…", hintShuffle: "Sigue la pelota. No puedes elegir todavía.", hintChoose: "Toca un vaso para revelar tu respuesta.",
            attemptLabel: "INTENTO", foundEyebrow: "¡ESO ES!", found: "¡La encontraste!", unlocked: "Desbloqueaste", off: "DE DESCUENTO",
            promo: "CÓDIGO PROMOCIONAL", copyCode: "COPIAR CÓDIGO", copied: "¡COPIADO!", book: "RESERVAR AHORA", codeNote: "Aplica tu código al reservar tus experiencias.",
            notThis: "¡Esta vez no!", almost: "¡Casi lo tienes!", attemptsLeft: n => `Te quedan ${n} ${n === 1 ? "intento" : "intentos"}.`,
            tryAgain: "INTENTAR DE NUEVO", gameOverEyebrow: "FIN DEL JUEGO", gameOver: "Se acabaron los intentos.", discover: "DESCUBRE NUESTRAS EXPERIENCIAS",
            gameOverFoot: "Aún puedes explorar experiencias y planear tu próxima aventura.", attemptCup: n => `Vaso ${n}`,
            switchLang: "Cambiar idioma"
          },
          en: {
            campaign: "HALLOWEEN GAME", find: "Find the <em>treat.</em>", intro: "Follow the ball, find the right cup and unlock a special discount.",
            facts: ["5 cups", "3 chances", "1 treat"], play: "PLAY NOW", reminder: "You have up to 3 tries to find it.",
            keepEyes: "KEEP YOUR EYES ON THE PRIZE", journey: ["SCAN", "PLAY", "FIND", "ENJOY"], privacy: "Your game is saved for 24 hours.",
            footerLeft: "A little Halloween magic, just for you.", footerRight: "Play fair. Have fun. Travel happy.",
            gameEyebrow: "THE SHELL GAME", peekTitle: "Don't lose sight of the ball!", peekText: "The ball is under one of the cups. Watch it carefully.",
            shuffleTitle: "Follow the ball!", shuffleText: "Keep watching as the cups begin to move.",
            chooseTitle: "Where's the ball?", chooseText: "Pick the cup where you think it ended up.",
            attempt: "Attempt", of: "of", cups: "CUPS", hintPeek: "Remember where you saw the ball…", hintShuffle: "Follow the ball. You can't pick yet.", hintChoose: "Tap a cup to reveal your answer.",
            attemptLabel: "ATTEMPT", foundEyebrow: "THAT'S IT!", found: "You found it!", unlocked: "You unlocked", off: "OFF",
            promo: "PROMO CODE", copyCode: "COPY CODE", copied: "COPIED!", book: "BOOK NOW", codeNote: "Apply your code when booking your experiences.",
            notThis: "Not this time!", almost: "Almost there!", attemptsLeft: n => `You have ${n} ${n === 1 ? "attempt" : "attempts"} left.`,
            tryAgain: "TRY AGAIN", gameOverEyebrow: "GAME OVER", gameOver: "You're out of tries.", discover: "DISCOVER OUR EXPERIENCES",
            gameOverFoot: "You can still explore experiences and plan your next adventure.", attemptCup: n => `Cup ${n}`,
            switchLang: "Switch language"
          }
        };
        const t = () => copy[lang];
        const wait = ms => new Promise(resolve => window.setTimeout(resolve, reducedMotion ? 80 : ms));
        const randomIndex = () => {
          const array = new Uint32Array(1);
          crypto.getRandomValues(array);
          return array[0] % 5;
        };
        const cupStickers = [
          `<g><path class="cup-sticker-fill" d="M50 48c-12 0-20 9-20 21v18l8-5 7 5 7-5 7 5 11-6V69c0-12-8-21-20-21Z"/><circle class="cup-sticker-cutout" cx="43" cy="68" r="2.5"/><circle class="cup-sticker-cutout" cx="57" cy="68" r="2.5"/><path d="M43 77q7 7 14 0" fill="none" stroke="var(--cup-shadow)" stroke-width="2.4" stroke-linecap="round"/></g>`,
          `<g><path class="cup-sticker-line" d="M50 48v42M50 48 35 62m15-14 15 14M50 60 36 75m14-15 14 15M50 73 40 84m10-11 10 11"/><path class="cup-sticker-line" d="M50 48 36 56m14-8 14 8M36 56l-4-7m4 7-8 1m36-1 4-7m-4 7 8 1"/><path class="cup-sticker-line" d="m35 62 8 1m-8-1-3 7m31-7-8 1m8-1 3 7M36 75l8-1m-8 1 1 7m27-7-8-1m8 1-1 7"/></g>`,
          `<g><path class="cup-sticker-fill" d="m50 55 7 9 12-4-4 12 10 7-13 2-4 12-8-10-12 5 3-13-10-7 13-2 6-11Z"/><path class="cup-sticker-cutout" d="M30 65c8-2 13 1 17 5 2-8 7-12 14-13l-4 8c8-4 15-3 22 2-8-1-13 2-17 8-4-2-8-2-12 0-7-5-13-8-20-10Z"/></g>`,
          `<g><path class="cup-sticker-fill" d="m50 47 4 13 13-5-5 13 14 5-14 4 5 14-13-6-4 14-5-14-13 6 5-14-14-4 14-5-5-13 13 5 5-13Z"/><path class="cup-sticker-fill" d="m34 47 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Zm32 31 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/></g>`,
          `<g><path class="cup-sticker-fill" d="M47 53c-10 1-16 9-16 20 0 13 8 22 19 22s19-9 19-22c0-11-6-19-16-20l-2-9-5 1 1 8Z"/><path class="cup-sticker-cutout" d="m40 68 6-4 4 5-6 1-4-2Zm15 1 4-5 6 4-4 2-6-1Zm-8 11h8l5-3c-1 7-5 10-9 10s-8-3-9-10l5 3Z"/><path class="cup-sticker-fill" d="M48 49c0-5 3-8 7-9-1 5-3 7-7 9Z"/></g>`
        ];
        let cupSvgId = 0;
        const cupSvg = (pattern = 4) => {
          const gradient = `cup-gradient-${++cupSvgId}`;
          return `<svg viewBox="0 0 100 120" aria-hidden="true"><defs><linearGradient id="${gradient}" x1="18" y1="18" x2="84" y2="106" gradientUnits="userSpaceOnUse"><stop stop-color="var(--cup-light)"/><stop offset=".54" stop-color="var(--cup)"/><stop offset="1" stop-color="var(--cup-shadow)"/></linearGradient></defs><ellipse class="cup-base" cx="50" cy="19" rx="24" ry="6"/><path fill="url(#${gradient})" d="M26 19h48l13 76q1 9-9 11H22q-10-2-9-11l13-76Z"/><path class="cup-shade" d="m61 22 22 70q2 9-8 12H53c12-20 13-55 8-82Z"/><path class="cup-glint" d="m31 27 5 60h5l-7-60z"/>${cupStickers[pattern % cupStickers.length]}<ellipse class="cup-rim" cx="50" cy="98" rx="37" ry="9"/><ellipse fill="var(--cup-shadow)" opacity=".72" cx="50" cy="98" rx="28" ry="5"/></svg>`;
        };
        const arrowSvg = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const sparkleSvg = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 2 2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1L12 2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
        const checkSvg = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        const copySvg = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" stroke="currentColor" stroke-width="1.7"/></svg>`;
        const save = () => {
          if (!game) return;
          game.expiresAt ||= Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem(storageKey, JSON.stringify(game));
        };
        const load = () => {
          try {
            const value = JSON.parse(localStorage.getItem(storageKey) || "null");
            if (!value || !value.expiresAt || value.expiresAt < Date.now()) {
              localStorage.removeItem(storageKey);
              return null;
            }
            return value;
          } catch {
            return null;
          }
        };

        function setBrand() {
          const palettes = {
            nexustours: ["#ff783f", "#ff9864", "rgba(255,120,63,.16)", "rgba(255,120,63,.28)", "#ff7810", "#d64c05", "#ffc05c", "#fff4e6", "rgba(255,158,69,.16)"],
            royalton: ["#3e9cff", "#79bdff", "rgba(62,156,255,.16)", "rgba(62,156,255,.3)", "#2789e9", "#145ba8", "#9bd5ff", "#eff8ff", "rgba(70,159,245,.16)"],
            ph: ["#a36aff", "#c39aff", "rgba(163,106,255,.17)", "rgba(163,106,255,.3)", "#995de4", "#6235a4", "#c4a0f5", "#f7f0ff", "rgba(164,109,242,.15)"]
          }[brand];
          const scenes = {
            nexustours: ["#fff6eb", "#39271d", "#77614e", "#9a806a", "rgba(85,53,31,.14)", "rgba(255,139,49,.11)"],
            royalton: ["#f0f8fa", "#20343b", "#5d747c", "#899da4", "rgba(35,78,89,.15)", "rgba(43,126,145,.14)"],
            ph: ["#f8f2fa", "#35283b", "#716378", "#9e90a5", "rgba(73,44,87,.15)", "rgba(133,76,153,.13)"]
          }[brand];
          const root = document.documentElement.style;
          root.setProperty("--brand", palettes[0]);
          root.setProperty("--brand-strong", palettes[1]);
          root.setProperty("--brand-soft", palettes[2]);
          root.setProperty("--brand-glow", palettes[3]);
          root.setProperty("--cup", palettes[4]);
          root.setProperty("--cup-shadow", palettes[5]);
          root.setProperty("--cup-light", palettes[6]);
          root.setProperty("--board-bg", palettes[7]);
          root.setProperty("--board-glow", palettes[8]);
          root.setProperty("--scene-bg", scenes[0]);
          root.setProperty("--scene-ink", scenes[1]);
          root.setProperty("--scene-muted", scenes[2]);
          root.setProperty("--scene-faint", scenes[3]);
          root.setProperty("--scene-line", scenes[4]);
          root.setProperty("--scene-deco", scenes[5]);
          $("#brand-tag-name").textContent = brandNames[brand];
          $(".brand-lockup").href = `?lang=${lang}`;
          $(".brand-lockup").setAttribute("aria-label", `${brandNames[brand]} Halloween`);
          document.documentElement.lang = lang;
          $("#language-button").textContent = lang === "es" ? "EN" : "ES";
          $("#language-button").setAttribute("aria-label", t().switchLang);
          $("#footer-left").textContent = t().footerLeft;
          $("#footer-right").textContent = t().footerRight;
          document.title = lang === "es" ? `Juego de Halloween — ${brandNames[brand]}` : `Halloween Game — ${brandNames[brand]}`;
        }

        function renderLanding() {
          const c = t();
          screen.innerHTML = `
            <div class="screen">
              <div class="landing-layout">
                <div class="copy-column">
                  <p class="eyebrow"><span class="eyebrow-dot"></span>${c.campaign}</p>
                  <h1 class="hero-title">${c.find}</h1>
                  <p class="lead">${c.intro}</p>
                  <div class="game-facts">
                    <span class="fact-pill">${sparkleSvg}${c.facts[0]}</span>
                    <span class="fact-pill">${sparkleSvg}${c.facts[1]}</span>
                    <span class="fact-pill">${sparkleSvg}${c.facts[2]}</span>
                  </div>
                  <button class="primary-button" id="play-button" type="button">${c.play}${arrowSvg}</button>
                  <p class="secondary-copy">${c.reminder}</p>
                </div>
                <div class="hero-art" aria-hidden="true">
                  <div class="moon-halo"></div><div class="moon"></div>
                  <span class="art-spark spark-one"></span><span class="art-spark spark-two"></span><span class="art-spark spark-three"></span>
                  <span class="art-ball"></span><div class="art-cup">${cupSvg(4)}</div>
                  <div class="art-label">${c.keepEyes}</div>
                </div>
              </div>
              <div class="card-foot">
                <span class="journey"><strong>${c.journey[0]}</strong><span class="journey-arrow">→</span><strong>${c.journey[1]}</strong><span class="journey-arrow">→</span><strong>${c.journey[2]}</strong><span class="journey-arrow">→</span><strong>${c.journey[3]}</strong></span>
                <span class="privacy-note">${c.privacy}</span>
              </div>
            </div>`;
          $("#play-button").addEventListener("click", startGame);
        }

        function renderGame(phase) {
          roundPhase = phase;
          const c = t();
          const attemptNumber = Math.min((game.attemptsUsed || 0) + 1, 3);
          const title = phase === "peek" ? c.peekTitle : phase === "shuffle" ? c.shuffleTitle : c.chooseTitle;
          const subtitle = phase === "peek" ? c.peekText : phase === "shuffle" ? c.shuffleText : c.chooseText;
          const hint = phase === "peek" ? c.hintPeek : phase === "shuffle" ? c.hintShuffle : c.hintChoose;
          const positions = Array.isArray(game.cupPositions) && game.cupPositions.length === 5 ? game.cupPositions : [0,1,2,3,4];
          const cups = Array.from({ length: 5 }, (_, index) => `<button class="cup-button" type="button" data-identity="${index}" data-position="${positions[index]}" aria-label="${c.attemptCup(index + 1)}" ${phase === "choose" ? "" : "disabled"} style="left:${[8,29,50,71,92][positions[index]]}%"><span class="cup-ball"></span>${cupSvg(index)}</button>`).join("");
          screen.innerHTML = `
            <div class="screen game-screen">
              <div class="game-head">
                <div class="game-head-copy">
                  <p class="eyebrow"><span class="eyebrow-dot"></span>${c.gameEyebrow}</p>
                  <h1 class="game-title">${title}</h1>
                  <p class="game-subtitle">${subtitle}</p>
                </div>
                <div class="attempt-box" aria-label="${c.attempt} ${attemptNumber} ${c.of} 3">
                  <div class="attempt-label"><span>${c.attemptLabel}</span><strong>${attemptNumber} / 3</strong></div>
                  <div class="attempt-track" aria-hidden="true">${[1,2,3].map(n => `<span class="attempt-segment ${n <= attemptNumber ? "active" : ""}"></span>`).join("")}</div>
                </div>
              </div>
              <div class="board">
                <div class="board-caption">${sparkleSvg}${c.cups}</div>
                <div class="cups-stage ${phase === "shuffle" ? "is-shuffling" : ""}" id="cups-stage">${cups}</div>
                <div class="board-floor"></div>
              </div>
              <div class="game-hint ${phase === "choose" ? "selection-hint" : ""}" id="game-hint"><span class="hint-pulse"></span>${hint}</div>
            </div>`;
          const stage = $("#cups-stage");
          const cupButtons = [...stage.querySelectorAll(".cup-button")];
          if (phase === "peek") {
            const target = cupButtons.find(el => Number(el.dataset.position) === game.targetPos);
            target?.classList.add("is-lifted");
            target?.querySelector(".cup-ball")?.classList.add("visible");
          }
          if (phase === "choose") cupButtons.forEach(button => button.addEventListener("click", () => chooseCup(button)));
          return { stage, cupButtons };
        }

        function startGame() {
          game = { status: "playing", attemptsUsed: 0, targetPos: randomIndex(), cupPositions: [0,1,2,3,4], expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
          save();
          runRound(true);
        }

        async function runRound(showPeek) {
          if (!Number.isInteger(game.targetPos)) game.targetPos = randomIndex();
          save();
          let currentPhase = showPeek ? "peek" : "choose";
          let { stage, cupButtons } = renderGame(currentPhase);
          if (!showPeek) return;
          await wait(1450);
          if (!game || game.status !== "playing") return;
          currentPhase = "shuffle";
          ({ stage, cupButtons } = renderGame(currentPhase));
          const positions = [8, 29, 50, 71, 92];
          const swaps = [];
          let hiddenPosition = game.targetPos;
          const neighbor = hiddenPosition === 0 ? 1 : hiddenPosition === 4 ? 3 : (randomIndex() % 2 ? hiddenPosition - 1 : hiddenPosition + 1);
          swaps.push([hiddenPosition, neighbor]);
          for (let i = 0; i < 3; i++) {
            const a = randomIndex();
            let b = randomIndex();
            while (b === a) b = randomIndex();
            swaps.push([a, b]);
          }
          for (const [a, b] of swaps) {
            const cupA = cupButtons.find(el => Number(el.dataset.position) === a);
            const cupB = cupButtons.find(el => Number(el.dataset.position) === b);
            if (!cupA || !cupB) continue;
            if (hiddenPosition === a) hiddenPosition = b;
            else if (hiddenPosition === b) hiddenPosition = a;
            game.cupPositions[Number(cupA.dataset.identity)] = b;
            game.cupPositions[Number(cupB.dataset.identity)] = a;
            game.targetPos = hiddenPosition;
            save();
            cupA.style.zIndex = "3";
            cupB.style.zIndex = "2";
            cupA.style.left = `${positions[b]}%`;
            cupB.style.left = `${positions[a]}%`;
            await wait(480);
            cupA.dataset.position = String(b);
            cupB.dataset.position = String(a);
            cupA.style.zIndex = "2";
            cupB.style.zIndex = "2";
          }
          if (!game || game.status !== "playing") return;
          game.targetPos = hiddenPosition;
          save();
          roundPhase = "choose";
          $(".game-title").textContent = t().chooseTitle;
          $(".game-subtitle").textContent = t().chooseText;
          $("#game-hint").classList.add("selection-hint");
          $("#game-hint").innerHTML = `<span class="hint-pulse"></span>${t().hintChoose}`;
          cupButtons.forEach(button => {
            button.disabled = false;
            button.addEventListener("click", () => chooseCup(button));
          });
        }

        async function chooseCup(button) {
          if (roundPhase !== "choose" || game?.status !== "playing") return;
          roundPhase = "reveal";
          const selectedPosition = Number(button.dataset.position);
          const isCorrect = selectedPosition === game.targetPos;
          const stage = $("#cups-stage");
          const allCups = [...stage.querySelectorAll(".cup-button")];
          allCups.forEach(cup => { cup.disabled = true; });
          button.classList.add("is-lifted");
          const targetCup = allCups.find(cup => Number(cup.dataset.position) === game.targetPos);
          targetCup?.classList.add("is-lifted");
          targetCup?.querySelector(".cup-ball")?.classList.add("visible");
          if (isCorrect) {
            const winningAttempt = (game.attemptsUsed || 0) + 1;
            game.status = "won";
            game.rewardCode = winningAttempt === 1 ? "TREAT15" : "TREAT10";
            game.rewardPercent = winningAttempt === 1 ? 15 : 10;
            game.winningAttempt = winningAttempt;
            save();
            await wait(760);
            renderWon();
            return;
          }
          game.attemptsUsed = (game.attemptsUsed || 0) + 1;
          game.targetPos = null;
          game.status = game.attemptsUsed >= 3 ? "lost" : "between";
          save();
          await wait(760);
          if (game.status === "lost") renderLost();
          else renderBetween();
        }

        function campaignLink(code) {
          const url = new URL(campaignUrl[brand]);
          if (code) url.searchParams.set("promocode", code);
          url.searchParams.set("utm_source", "organic_social");
          url.searchParams.set("utm_medium", "dynamics");
          url.searchParams.set("utm_campaign", "halloween_game");
          return url.toString();
        }

        function renderWon() {
          const c = t();
          screen.innerHTML = `
            <div class="screen result-screen">
              <div class="result-content">
                <div class="result-symbol" aria-hidden="true">${checkSvg}</div>
                <p class="result-eyebrow">${c.foundEyebrow}</p>
                <h1 class="result-title">${c.found}</h1>
                <p class="result-copy">${c.unlocked}</p>
                <div class="discount-line"><span class="discount-value">${game.rewardPercent}%</span><span class="discount-label">${c.off}</span></div>
                <div class="promo-card"><span class="promo-meta"><span class="promo-label">${c.promo}</span><strong class="promo-code">${game.rewardCode}</strong></span><button class="copy-button" id="copy-button" type="button">${copySvg}${c.copyCode}</button></div>
                <div class="result-actions"><a class="primary-button" href="${campaignLink(game.rewardCode)}">${c.book}${arrowSvg}</a></div>
                <p class="result-footnote" id="copy-status">${c.codeNote}</p>
              </div>
            </div>`;
          $("#copy-button").addEventListener("click", copyPromo);
        }

        async function copyPromo() {
          const c = t();
          try {
            if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(game.rewardCode);
            else {
              const field = document.createElement("textarea");
              field.value = game.rewardCode;
              field.style.position = "fixed";
              field.style.opacity = "0";
              document.body.appendChild(field);
              field.select();
              document.execCommand("copy");
              field.remove();
            }
            $("#copy-button").innerHTML = `${checkSvg}${c.copied}`;
            $("#copy-status").textContent = c.copied;
          } catch {
            $("#copy-status").textContent = game.rewardCode;
          }
        }

        function renderBetween() {
          const c = t();
          const isFirstMiss = game.attemptsUsed === 1;
          const left = 3 - game.attemptsUsed;
          screen.innerHTML = `
            <div class="screen result-screen between-screen">
              <div class="result-content">
                <div class="result-symbol" aria-hidden="true">${sparkleSvg}</div>
                <p class="result-eyebrow">${c.gameEyebrow}</p>
                <h1 class="result-title">${isFirstMiss ? c.notThis : c.almost}</h1>
                <p class="result-copy">${c.attemptsLeft(left)}</p>
                <div class="tries-left"><span class="hint-pulse"></span>${c.attempt} ${game.attemptsUsed + 1} ${c.of} 3</div>
                <div class="result-actions" style="margin-top:23px"><button class="primary-button" id="retry-button" type="button">${c.tryAgain}${arrowSvg}</button></div>
              </div>
            </div>`;
          $("#retry-button").addEventListener("click", () => {
            game.status = "playing";
            game.targetPos = randomIndex();
            game.cupPositions = [0,1,2,3,4];
            save();
            runRound(true);
          });
        }

        function renderLost() {
          const c = t();
          screen.innerHTML = `
            <div class="screen result-screen lost-screen">
              <div class="result-content">
                <div class="result-symbol" aria-hidden="true">${sparkleSvg}</div>
                <p class="result-eyebrow">${c.gameOverEyebrow}</p>
                <h1 class="result-title">${c.gameOver}</h1>
                <p class="result-copy">${c.gameOverFoot}</p>
                <div class="result-actions" style="margin-top:27px"><a class="primary-button" href="${campaignLink()}">${c.discover}${arrowSvg}</a></div>
              </div>
            </div>`;
        }

        $("#language-button").addEventListener("click", () => {
          const next = new URL(location.href);
          next.searchParams.set("lang", lang === "es" ? "en" : "es");
          location.href = next.toString();
        });
        setBrand();
        game = load();
        if (!game) renderLanding();
        else if (game.status === "won") renderWon();
        else if (game.status === "lost") renderLost();
        else if (game.status === "between") renderBetween();
        else {
          game.status = "playing";
          if (!Number.isInteger(game.targetPos)) game.targetPos = randomIndex();
          save();
          runRound(false);
        }
      })();
    
