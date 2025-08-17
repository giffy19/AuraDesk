// ===== Clock & Date =====
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  document.getElementById("time").textContent = time;
  document.getElementById("date").textContent = date;
}
setInterval(updateClock, 1000);
updateClock();



// ===== Navigation =====
const landing = document.getElementById("landing");
const todoPage = document.getElementById("todoPage");
const diaryPage = document.getElementById("diaryPage");

document.getElementById("todoIcon").addEventListener("click", () => {
  landing.classList.remove("active");
  todoPage.classList.add("active");
});
document.getElementById("diaryIcon").addEventListener("click", () => {
  landing.classList.remove("active");
  diaryPage.classList.add("active");
});
document.querySelectorAll(".back-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    landing.classList.add("active");
  });
});

// ===== To-Do List =====
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
document.getElementById("addTask").addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;
  const li = document.createElement("li");
  li.textContent = taskInput.value;
  li.addEventListener("click", () => li.classList.toggle("done"));
  taskList.appendChild(li);
  taskInput.value = "";
});


/* ========== India States & Cities ========== */
const INDIA_STATES_CITIES = {
 "Andhra Pradesh":["Visakhapatnam","Vijayawada","Guntur","Nellore","Tirupati","Kakinada","Rajahmundry","Kadapa"],
 "Arunachal Pradesh":["Itanagar","Tawang","Naharlagun","Pasighat","Ziro"],
 "Assam":["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia"],
 "Bihar":["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga"],
 "Chhattisgarh":["Raipur","Bhilai","Bilaspur","Korba","Durg"],
 "Goa":["Panaji","Margao","Mapusa","Vasco da Gama","Ponda"],
 "Gujarat":["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar"],
 "Haryana":["Gurugram","Faridabad","Panipat","Ambala","Hisar","Karnal"],
 "Himachal Pradesh":["Shimla","Dharamshala","Solan","Mandi","Kullu"],
 "Jharkhand":["Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh"],
 "Karnataka":["Bengaluru","Mysuru","Mangaluru","Hubballi","Belagavi","Davangere","Shivamogga"],
 "Kerala":["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Alappuzha"],
 "Madhya Pradesh":["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar"],
 "Maharashtra":["Mumbai","Pune","Nagpur","Nashik","Thane","Aurangabad","Solapur"],
 "Tamil Nadu":["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Erode","Vellore","Thoothukudi","Tiruppur"],
 "Telangana":["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam"],
 "Uttar Pradesh":["Lucknow","Kanpur","Varanasi","Agra","Prayagraj","Ghaziabad","Noida","Meerut","Gorakhpur","Bareilly"],
 "West Bengal":["Kolkata","Howrah","Durgapur","Asansol","Siliguri"]
};
const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");

Object.keys(INDIA_STATES_CITIES).sort().forEach(state=>{
  const opt = document.createElement("option");
  opt.value = state; opt.textContent = state; stateSelect.appendChild(opt);
});
stateSelect.addEventListener("change", () => {
  const state = stateSelect.value;
  citySelect.innerHTML = '<option value="">Select City</option>';
  citySelect.disabled = !state;
  if (!state) return;
  INDIA_STATES_CITIES[state].forEach(city=>{
    const opt = document.createElement("option");
    opt.value = city; opt.textContent = city; citySelect.appendChild(opt);
  });
});

/* ========== Weather Fetch (OpenWeatherMap) ========== */
const apiKey = "02b9c726a5376a9a4dabbff9ec245cd7"; // <-- Replace with your OpenWeatherMap API key
document.getElementById("getWeather").addEventListener("click", () => {
  const city = citySelect.value;
  if (!city) { alert("Please select a city"); return; }
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(r => r.json())
    .then(data => {
      if (!data || data.cod !== 200) { alert("Weather not found"); return; }
      document.getElementById("cityName").textContent = `📍 ${data.name}`;
      document.getElementById("temp").textContent = `🌡 Temp: ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)`;
      document.getElementById("desc").textContent = `☁ ${data.weather[0].description}`;
      document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
      document.getElementById("wind").textContent = `💨 Wind: ${data.wind.speed} m/s`;
      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.getElementById("weatherIcon").alt = data.weather[0].main || "Weather";
    })
    //.catch(() => alert("Error fetching weather"));
});
// ===== Diary + Doodle =====
const canvas = document.getElementById("doodleCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let penColor = document.getElementById("penColor").value;
let penSize = document.getElementById("penSize").value;

function startDraw(x, y) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(x, y);
}
function moveDraw(x, y) {
  if (!drawing) return;
  ctx.lineTo(x, y);
  ctx.strokeStyle = penColor;
  ctx.lineWidth = penSize;
  ctx.lineCap = "round";
  ctx.stroke();
}
function endDraw() {
  drawing = false;
}

// Mouse events
canvas.addEventListener("mousedown", e => startDraw(e.offsetX, e.offsetY));
canvas.addEventListener("mousemove", e => moveDraw(e.offsetX, e.offsetY));
canvas.addEventListener("mouseup", endDraw);

// Touch events (mobile)
canvas.addEventListener("touchstart", e => {
  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  startDraw(t.clientX - rect.left, t.clientY - rect.top);
});
canvas.addEventListener("touchmove", e => {
  e.preventDefault(); // prevent scrolling
  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  moveDraw(t.clientX - rect.left, t.clientY - rect.top);
}, { passive: false });
canvas.addEventListener("touchend", endDraw);

document.getElementById("penColor").addEventListener("change", e => penColor = e.target.value);
document.getElementById("penSize").addEventListener("input", e => penSize = e.target.value);

document.getElementById("clearDoodle").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
document.getElementById("saveDoodle").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "doodle.png";
  link.href = canvas.toDataURL();
  link.click();
});

// ===== Responsive Canvas =====
function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===== Image Upload & Capture =====
document.getElementById("uploadImage").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = document.createElement("img");
    img.src = ev.target.result;
    document.getElementById("imagePreview").appendChild(img);
  };
  reader.readAsDataURL(file);
});

document.getElementById("captureImage").addEventListener("click", () => {
  const video = document.createElement("video");
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    video.play();
    const preview = document.getElementById("imagePreview");
    preview.innerHTML = "";
    preview.appendChild(video);
  });
});


/* ========== Theme Toggle (Dark/Light) ========== */
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
// Persisted theme
const savedTheme = localStorage.getItem("theme") || "dark";
body.classList.add(savedTheme);
themeToggle.addEventListener("click", () => {
  const to = body.classList.contains("light") ? "dark" : "light";
  body.classList.remove("light","dark");
  body.classList.add(to);
  localStorage.setItem("theme", to);
});

