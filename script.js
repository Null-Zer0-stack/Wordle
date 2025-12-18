    const WORDS = ["PRICE", "TIRES", "TRIBE", "TRIED", "TERMS", "STICK", "THIRD", "FRIES"]; // same-length words
    const PASSWORD = WORDS[Math.floor(Math.random() * WORDS.length)];
    let attempts = 4;

    const col1 = document.getElementById("col1");
    const col2 = document.getElementById("col2");
    const log = document.getElementById("log");
    const attemptsEl = document.getElementById("attempts");

    function likeness(a, b) {
      let score = 0;
      for (let i = 0; i < a.length; i++) {
        if (a[i] === b[i]) score++;
      }
      return score;
    }

    function makeGibberish(word) {
      const junk = "!@#$%^&*(){}[]<>?/\\|+=-_";
      let s = "";
      for (let i = 0; i < 8; i++) {
        s += junk[Math.floor(Math.random() * junk.length)];
      }
      return s + word + s;
    }

    function render() {
      col1.innerHTML = "";
      col2.innerHTML = "";

      WORDS.forEach((word, i) => {
        const el = document.createElement("div");
        el.textContent = makeGibberish(word);
        el.className = "word";
        el.onclick = () => guess(word);
        (i % 2 === 0 ? col1 : col2).appendChild(el);
      });
    }

    function guess(word) {
      if (attempts <= 0) return;

      attempts--;
      attemptsEl.textContent = attempts;

      if (word === PASSWORD) {
        log.innerHTML += `> ${word} — ACCESS GRANTED<br>`;
        log.innerHTML += "> Terminal unlocked.";
        attempts = 0;
        return;
      }

      const score = likeness(word, PASSWORD);
      log.innerHTML += `> ${word} — ${score}/${PASSWORD.length} correct<br>`;

      if (attempts === 0) {
        log.innerHTML += '<span class="locked">> LOCKED OUT</span>';
      }
    }

    render();