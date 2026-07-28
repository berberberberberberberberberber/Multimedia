const toggle = document.getElementById("dateToggle");
const calendar = document.querySelector(".calendar-menu");

toggle.addEventListener("click", function (e) {
    e.preventDefault();
    calendar.style.display =
        calendar.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", function (e) {
    if (!toggle.contains(e.target) && !calendar.contains(e.target)) {
        calendar.style.display = "none";
    }
});


const seasonData = {
    0:  { label: "Winter",         emoji: "❄️",  tip: "January: Snow festivals in Hokkaido & Sapporo's Yuki Matsuri!" },
    1:  { label: "Late Winter",    emoji: "🌨️", tip: "February: Perfect powder snow season in Niseko." },
    2:  { label: "Cherry Blossom", emoji: "🌸",  tip: "March: Early sakura in Kyushu, crowds are lighter!" },
    3:  { label: "Cherry Blossom", emoji: "🌸",  tip: "April: Peak sakura season across Kyoto & Tokyo. Book early!" },
    4:  { label: "Spring",         emoji: "🌿",  tip: "May: Gorgeous greenery, mild weather, ideal for hiking." },
    5:  { label: "Rainy Season",   emoji: "🌦️", tip: "June: Hydrangeas bloom beautifully despite the rain." },
    6:  { label: "Summer",         emoji: "🎆",  tip: "July: Gion Matsuri festival in Kyoto, unmissable!" },
    7:  { label: "Summer",         emoji: "🏮",  tip: "August: Obon season, lantern festivals & fireworks." },
    8:  { label: "Autumn",         emoji: "🍁",  tip: "September: Autumn colors begin in Hokkaido." },
    9:  { label: "Fall Foliage",   emoji: "🍂",  tip: "October: Peak koyo (autumn leaves) across Kyoto's temples." },
    10: { label: "Late Autumn",    emoji: "🍂",  tip: "November: Stunning red maples, second best time to visit!" },
    11: { label: "Winter",         emoji: "🎍",  tip: "December: Illuminations, hot springs & fewer tourists." },
};

const travelDateInput = document.getElementById("travel-date");
travelDateInput.addEventListener("change", function () {
    const date = new Date(this.value);
    const month = date.getUTCMonth();
    const info = seasonData[month];
    if (!info) return;

    document.getElementById("season-banner")?.remove();

    const banner = document.createElement("div");
    banner.id = "season-banner";
    banner.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0;
        background: linear-gradient(90deg, #ff5f6d, #ffc371);
        color: white; text-align: center;
        padding: 12px 20px; font-family: Georgia, serif;
        font-size: 16px; z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    banner.innerHTML = `
        ${info.emoji} <strong>${info.label}</strong> — ${info.tip}
        <span onclick="this.parentElement.remove()"
              style="cursor:pointer; margin-left:16px; opacity:0.8; font-size:18px;">✕</span>
    `;
    document.body.prepend(banner);
    calendar.style.display = "none";
});


const cityBudgets = {
    "kyoto":    "Medium",
    "osaka":    "Low",
    "hokkaido": "High",
    "tokyo":    "High",
};

const budgetDescriptions = {
    Low:    "💴 Budget-friendly — street food, hostels & free shrines.",
    Medium: "💳 Mid-range — ryokans, sit-down restaurants & day trips.",
    High:   "💎 Premium — luxury hotels, kaiseki dining & private tours.",
};

let activeBudget = null;

const budgetDropdown = document.querySelectorAll(".dropdown")[1];
budgetDropdown.querySelectorAll(".dropdown-menu li a").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const selected = this.textContent.trim();

        if (activeBudget === selected) {
            activeBudget = null;
            clearBudgetFilter();
            return;
        }

        activeBudget = selected;

        document.querySelectorAll(".city").forEach(section => {
            const name = section.querySelector(".city-title")?.textContent.trim().toLowerCase();
            const budget = cityBudgets[name];
            section.querySelector(".budget-tag")?.remove();

            if (budget === selected) {
                section.style.outline = "3px solid #ffc371";
                section.style.outlineOffset = "6px";
                section.style.opacity = "1";

                const tag = document.createElement("div");
                tag.className = "budget-tag";
                tag.style.cssText = `
                    display: inline-block; margin-bottom: 12px;
                    background: linear-gradient(90deg, #ff5f6d, #ffc371);
                    color: white; padding: 5px 16px; border-radius: 20px;
                    font-family: Georgia, serif; font-size: 14px;
                    box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
                `;
                tag.textContent = budgetDescriptions[selected];
                section.insertBefore(tag, section.querySelector(".city-title"));
            } else {
                section.style.outline = "";
                section.style.opacity = "0.35";
            }
        });

        const firstMatch = [...document.querySelectorAll(".city")].find(s =>
            cityBudgets[s.querySelector(".city-title")?.textContent.trim().toLowerCase()] === selected
        );
        firstMatch?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
});

function clearBudgetFilter() {
    document.querySelectorAll(".city").forEach(section => {
        section.style.outline = "";
        section.style.opacity = "1";
        section.querySelector(".budget-tag")?.remove();
    });
}


const searchInput = document.querySelector(".search-container input");
const citySections = document.querySelectorAll(".city");

const cityMap = {
    "kyoto": "Kyoto.html",
    "osaka": "Osaka.html",
    "hokkaido": "Hokkaido.html",
    "tokyo": "Tokyo.html",
    "home": "b.html"
};

function searchCity() {

    let input = document.getElementById("citySearch").value.toLowerCase();

    if (cityMap[input]) {
        window.location.href = cityMap[input];
    } else {
        alert("City not found");
    }
}

const suggestionBox = document.createElement("ul");
suggestionBox.style.cssText = `
    position: absolute; top: 42px; left: 0;
    background: white; border: 2px solid black;
    border-radius: 10px; list-style: none;
    padding: 6px 0; min-width: 160px;
    box-shadow: 4px 4px 0 black;
    z-index: 9999; display: none;
    font-family: Georgia, serif;
    color: black;
`;
searchInput.parentElement.style.position = "relative";
searchInput.parentElement.appendChild(suggestionBox);

searchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    suggestionBox.innerHTML = "";

    if (!query) { suggestionBox.style.display = "none"; return; }

    const matches = Object.keys(cityMap).filter(name => name.includes(query));
    if (matches.length === 0) { suggestionBox.style.display = "none"; return; }

    matches.forEach(name => {
        const li = document.createElement("li");
        li.style.cssText = `padding: 9px 16px; cursor: pointer; font-size: 15px; text-transform: capitalize;`;

        const idx = name.indexOf(query);
        li.innerHTML =
            name.slice(0, idx) +
            `<strong>${name.slice(idx, idx + query.length)}</strong>` +
            name.slice(idx + query.length);

        li.addEventListener("mouseenter", () => li.style.background = "#fff5f0");
        li.addEventListener("mouseleave", () => li.style.background = "");
        li.addEventListener("click", () => {
            window.location.href = cityMap[name];
            searchInput.value = "";
            suggestionBox.style.display = "none";
        });
        suggestionBox.appendChild(li);
    });

    suggestionBox.style.display = "block";
});

document.addEventListener("click", function (e) {
    if (!searchInput.parentElement.contains(e.target)) {
        suggestionBox.style.display = "none";
    }
});

searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const query = this.value.trim().toLowerCase();
        if (cityMap[query]) {
            window.location.href = cityMap[query];
            searchInput.value = "";
            suggestionBox.style.display = "none";
        }
    }
});


function animateCounter(id, target, duration, suffix = "") {
    const element = document.getElementById(id);
    let start = 0;
    const increment = target / (duration / 16);

    function update() {
        start += increment;
        if (start < target) {
            element.innerText = Math.floor(start) + suffix;
            requestAnimationFrame(update);
        } else {
            element.innerText = target + suffix;
        }
    }
    update();
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateCounter("customers", 12000, 2000, "+");
        animateCounter("experience", 15, 2000, "+");
        animateCounter("destinations", 48, 2000);
        animateCounter("rating", 6.7, 2000);
        observer.disconnect();
    }
});

observer.observe(document.querySelector(".c"));

window.addEventListener("scroll", () => {
    document.querySelectorAll(".city").forEach(city => {
        if (city.getBoundingClientRect().top < window.innerHeight - 100) {
            city.classList.add("show");
        }
    });
});


const container = document.querySelector(".sakura-container");

function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("sakura");
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 5 + Math.random() * 5 + "s";
    petal.style.opacity = Math.random();
    container.appendChild(petal);
    setTimeout(() => petal.remove(), 10000);
}

setInterval(createPetal, 300);

document.addEventListener("DOMContentLoaded", function () {
    const starContainer = document.querySelector(".star-container");
    for (let i = 0; i < 120; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = Math.random() * 100 + "%";
        star.style.left = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";
        star.style.animationDuration = 2 + Math.random() * 3 + "s";
        starContainer.appendChild(star);
    }
});

(function () {
    const modal = document.getElementById("authModal");
    const closeBtn = document.getElementById("modalClose");
    const tabs = document.querySelectorAll(".modal-tab");
    const signinForm = document.getElementById("signinForm");
    const registerForm = document.getElementById("registerForm");
    const signinMsg = document.getElementById("signinMsg");
    const registerMsg = document.getElementById("registerMsg");

    // The 3rd ".dropdown" in the navbar is the Login dropdown
    const loginDropdown = document.querySelectorAll(".dropdown")[2];
    const loginLinks = loginDropdown.querySelectorAll(".dropdown-menu li a");
    const signInLink = loginLinks[0];
    const registerLink = loginLinks[1];

    function openModal(tabName) {
        modal.classList.add("active");
        switchTab(tabName);
    }

    function closeModal() {
        modal.classList.remove("active");
        signinMsg.textContent = "";
        registerMsg.textContent = "";
    }

    function switchTab(tabName) {
        tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabName));
        signinForm.style.display = tabName === "signin" ? "flex" : "none";
        registerForm.style.display = tabName === "register" ? "flex" : "none";
    }

    signInLink.addEventListener("click", function (e) {
        e.preventDefault();
        openModal("signin");
    });

    registerLink.addEventListener("click", function (e) {
        e.preventDefault();
        openModal("register");
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
    });

    tabs.forEach(tab => {
        tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });

    function getUsers() {
        return JSON.parse(localStorage.getItem("jtj_users") || "{}");
    }

    function saveUsers(users) {
        localStorage.setItem("jtj_users", JSON.stringify(users));
    }

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const user = document.getElementById("registerUser").value.trim();
        const pass = document.getElementById("registerPass").value;
        const pass2 = document.getElementById("registerPass2").value;

        if (pass !== pass2) {
            registerMsg.textContent = "Passwords don't match.";
            registerMsg.className = "modal-message error";
            return;
        }

        const users = getUsers();
        if (users[user]) {
            registerMsg.textContent = "Username already taken.";
            registerMsg.className = "modal-message error";
            return;
        }

        users[user] = pass;
        saveUsers(users);
        registerMsg.textContent = "Account created! You can sign in now.";
        registerMsg.className = "modal-message success";
        registerForm.reset();
        setTimeout(() => switchTab("signin"), 1200);
    });

    signinForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const user = document.getElementById("signinUser").value.trim();
        const pass = document.getElementById("signinPass").value;
        const users = getUsers();

        if (!users[user] || users[user] !== pass) {
            signinMsg.textContent = "Invalid username or password.";
            signinMsg.className = "modal-message error";
            return;
        }

        signinMsg.textContent = `Welcome back, ${user}!`;
        signinMsg.className = "modal-message success";
        setTimeout(closeModal, 1000);
    });
})();
