const data = [
  { name: 'Flooding near village school', cat: 'disaster', district: 'Ranchi', lat: 23.3441, lng: 85.3096, score: 92, affected: 1240, status: 'Team Matched' },
  { name: 'Unsafe drinking water', cat: 'water', district: 'Ranchi', lat: 23.37, lng: 85.31, score: 88, affected: 680, status: 'Verification' },
  { name: 'Smart irrigation requirement', cat: 'agri', district: 'Hazaribagh', lat: 23.9966, lng: 85.3691, score: 79, affected: 430, status: 'Matching' },
  { name: 'Accessible bus stops', cat: 'health', district: 'Jamshedpur', lat: 22.8046, lng: 86.2029, score: 74, affected: 310, status: 'Pilot' },
  { name: 'School digital access', cat: 'education', district: 'Bokaro', lat: 23.6693, lng: 86.1511, score: 68, affected: 520, status: 'Open' },
  { name: 'Rural telemedicine', cat: 'health', district: 'Deoghar', lat: 24.4763, lng: 86.6913, score: 81, affected: 760, status: 'Active' }
];

let map, heroMap, markers = [];

function makeMap(id, zoom = 7.4) {
  const m = L.map(id).setView([23.61, 85.3], zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(m);
  return m;
}

function render(filter = 'all') {
  markers.forEach(x => map.removeLayer(x));
  markers = [];
  data.filter(p => filter === 'all' || p.cat === filter).forEach(p => {
    const x = L.marker([p.lat, p.lng]).addTo(map);
    x.bindPopup(`<b>${p.name}</b><br><small>${p.district} • ${p.affected} affected</small><br><br><b>Priority:</b> ${p.score}/100<br><b>Status:</b> ${p.status}<br><br><button onclick="useLocation('${p.district} — ${p.name}')" style="background:#123f78;color:white;border:0;padding:7px 9px;border-radius:7px;font-weight:700">Use location</button>`);
    markers.push(x);
  });
}

function useLocation(v) {
  document.getElementById('location').value = v;
  document.getElementById('submit').scrollIntoView({ behavior: 'smooth' });
  toast('📍 Location added to submission');
}

function track() {
  let id = document.getElementById('trackId').value.trim() || 'JS-2026-1048';
  document.getElementById('trackResult').innerHTML = `<div style="margin-top:20px;padding-top:18px;border-top:1px solid var(--line)"><b>${id}</b> <span class="status blue">Team Matched</span><p style="color:#68788f;font-size:12px;margin-top:4px">Flooding near village school • Ranchi</p><div class="timeline"><div class="t"><div class="circle">✓</div><b>Submitted</b><small>Complete</small></div><div class="t"><div class="circle">✓</div><b>Verified</b><small>Complete</small></div><div class="t current"><div class="circle">3</div><b>Matched</b><small>Current</small></div><div class="t"><div class="circle">4</div><b>Pilot</b><small>Upcoming</small></div><div class="t"><div class="circle">5</div><b>Impact</b><small>Upcoming</small></div></div></div>`;
}

function fileNames() {
  document.getElementById('filesOut').textContent = [...document.getElementById('files').files].map(f => '📎 ' + f.name).join(' • ');
}

function toast(t) {
  let x = document.getElementById('toast');
  x.textContent = t;
  x.classList.add('show');
  setTimeout(() => x.classList.remove('show'), 2500);
}

function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

function loginDash(id, msg) {
  closeModal(id === 'citizenDash' ? 'citizenModal' : id === 'collegeDash' ? 'collegeModal' : 'industryModal');
  document.getElementById(id).classList.add('show');
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  toast('✓ ' + msg);
}

function hideDash(id) {
  document.getElementById(id).classList.remove('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMenu() {
  let x = document.getElementById('mobile');
  x.style.display = x.style.display === 'none' ? 'block' : 'none';
}

function sendMessage() {
  let i = document.getElementById('chatInput');
  if (i.value.trim()) {
    let c = document.getElementById('chat');
    c.innerHTML += `<div class="msg me"><b>You</b><br>${i.value}</div>`;
    c.scrollTop = c.scrollHeight;
    i.value = '';
  }
}

document.getElementById('problemForm').addEventListener('submit', e => {
  e.preventDefault();
  let u = document.getElementById('urgency').value, p = +document.getElementById('people').value || 1;
  let base = u.startsWith('Critical') ? 55 : u === 'High' ? 40 : u === 'Medium' ? 25 : 12;
  let score = Math.min(100, base + Math.min(35, Math.round(Math.log10(p + 1) * 14)) + 10);
  let id = 'JS-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 8999);
  toast(`✓ Submitted ${id} • Priority ${score}/100`);
  document.getElementById('trackId').value = id;
  e.target.reset();
  setTimeout(() => document.getElementById('track').scrollIntoView({ behavior: 'smooth' }), 900);
});

document.querySelectorAll('.filter').forEach(b => b.onclick = () => {
  document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  render(b.dataset.filter);
});

window.addEventListener('load', () => {
  map = makeMap('map');
  render();
  heroMap = makeMap('heroMap', 6.8);
  data.slice(0, 4).forEach(p => L.circleMarker([p.lat, p.lng], { radius: 8 }).addTo(heroMap).bindPopup(p.name));
});