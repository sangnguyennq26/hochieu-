/**
 * HỘ CHIẾU CỘI NGUỒN – ĐỀN HÙNG, PHÚ THỌ
 * Core Interactive Experience Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initPassport3DTilt();
  initJourneyFilter();
  initStorytellingTabs();
  initInteractiveMap();
  initTourFilters();
  initOcopStore();
  initCartDrawer();
  initQRScanner();
  initPassportModal();
  initModalsAndPopups();
});

/* ==========================================================================
   1. SOUND FX SYNTHESIZER (Web Audio API)
   ========================================================================== */
class SoundEffects {
  static initAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Realistic heavy lacquer seal stamp impact thud & bronze resonance
  static playStampSound() {
    try {
      this.initAudioContext();
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Low frequency punch
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.18);

      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);

      // Bronze chime shimmer
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(880, now + 0.05);
      chime.frequency.exponentialRampToValueAtTime(1760, now + 0.4);

      chimeGain.gain.setValueAtTime(0.18, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chime.start(now + 0.05);
      chime.stop(now + 0.65);
    } catch (e) {
      // Graceful fallback if Web Audio is restricted
    }
  }

  // Soft click / badge unlock chime
  static playChime() {
    try {
      this.initAudioContext();
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {}
  }
}

/* ==========================================================================
   2. HEADER SCROLL & MOBILE NAV
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   3. 3D PASSPORT CARD INTERACTION
   ========================================================================== */
function initPassport3DTilt() {
  const card = document.querySelector('.passport-card-3d');
  const wrapper = document.querySelector('.passport-card-wrapper');
  if (!card || !wrapper) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });

  card.addEventListener('click', () => {
    openPassportModal();
  });
}

/* ==========================================================================
   4. JOURNEY / PLACES FILTER & STORY MODAL
   ========================================================================== */
const PLACES_DATA = [
  {
    id: 'cong-den-hung',
    name: 'Cổng Đền Hùng',
    zone: 'center',
    desc: 'Cánh cửa mở đầu hành trình thiêng liêng về miền Đất Tổ, được xây dựng năm 1917 với đôi câu đối ngợi ca công đức dựng nước của các Vua Hùng.',
    duration: '15-20 phút',
    status: 'completed',
    elevation: 'Chân núi Nghĩa Lĩnh',
    story: 'Cổng đền Hùng sừng sững uy nghi dưới chân núi Nghĩa Lĩnh, được xây dựng vào năm Khải Định thứ 2 (1917). Kiến trúc cổng kiểu vòm cuốn cao 8,5m, hai tầng tám mái lim lợp ngói mũi hài. Mặt tiền đắp nổi bốn chữ Hán lớn: "Cao sơn cảnh hành" (Núi cao đường lớn - gợi lòng kính ngưỡng trước đức lớn của Tiên Tổ).',
    img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'den-ha',
    name: 'Đền Hạ',
    zone: 'center',
    desc: 'Nơi mẹ Âu Cơ sinh bọc trăm trứng, khởi nguồn truyền thuyết thiêng liêng đồng bào trăm họ của người Việt.',
    duration: '25-30 phút',
    status: 'completed',
    elevation: 'Độ cao 35m',
    story: 'Tương truyền tại đây, mẹ Âu Cơ sau khi kết duyên cùng Lạc Long Quân đã sinh ra bọc trăm trứng, nở thành một trăm người con trai - tổ tiên của cộng đồng các dân tộc Việt Nam. Dưới chân Đền Hạ còn có giếng Mắt Rồng quanh năm nước trong vắt.',
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'chua-thien-quang',
    name: 'Chùa Thiên Quang',
    zone: 'center',
    desc: 'Không gian văn hóa và tâm linh thanh tịnh giữa đại ngàn thông cổ thụ trên núi Nghĩa Lĩnh, kề bên Đền Hạ.',
    duration: '20 phút',
    status: 'completed',
    elevation: 'Độ cao 45m',
    story: 'Thiên Quang Thiền Tự (Ánh sáng của Trời) tọa lạc cạnh Đền Hạ, tương truyền xây dựng từ thời nhà Trần. Trước chùa có cây vạn tuế ba nhánh cổ thụ hơn 800 năm tuổi, tạo nên vẻ uy nghiêm, trầm mặc giữa núi rừng Đất Tổ.',
    img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'den-trung',
    name: 'Đền Trung (Hùng Vương Điện)',
    zone: 'center',
    desc: 'Nơi Vua Hùng cùng các Lạc hầu, Lạc tướng bàn việc nước và là nơi diễn ra cuộc thi làm Bánh chưng, Bánh giầy của chàng Lang Liêu.',
    duration: '30-40 phút',
    status: 'completed',
    elevation: 'Độ cao 100m',
    story: 'Đền Trung có tên chữ là "Hùng Vương Điện". Tại đây, Vua Hùng thứ 6 đã mở hội thi chọn người kế vị bằng lễ vật dâng cúng Tổ tiên. Chàng hoàng tử Lang Liêu nhờ tấm lòng hiếu thảo và sự gắn bó với hạt ngọc quê hương đã sáng tạo ra Bánh Chưng (tượng trưng cho Đất) và Bánh Giầy (tượng trưng cho Trời).',
    img: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'den-thuong',
    name: 'Đền Thượng (Kính Thiên Lĩnh Điện)',
    zone: 'center',
    desc: 'Ngôi đền linh thiêng trên đỉnh Nghĩa Lĩnh, nơi Vua Hùng lập đàn tế Trời Đất, cầu cho quốc thái dân an, mưa thuận gió hòa.',
    duration: '45 phút',
    status: 'locked',
    elevation: 'Đỉnh núi 175m',
    story: 'Đền Thượng tên chữ là "Kính Thiên Lĩnh Điện" tọa lạc trên đỉnh cao nhất của núi Nghĩa Lĩnh (175m). Nơi đây xưa kia các Vua Hùng lập đàn tế trời đất, Thần Lúa, cầu mùa màng bội thu. Phía trước đền có Cột đá thề do Thục Phán dựng lên đời đời gìn giữ giang sơn.',
    img: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lang-hung-vuong',
    name: 'Lăng Hùng Vương',
    zone: 'center',
    desc: 'Lăng mộ Vua Hùng thứ sáu, chốn an nghỉ ngàn thu hướng nhìn ra ba ngã sông thiêng Hạc Trì.',
    duration: '20 phút',
    status: 'locked',
    elevation: 'Đỉnh núi 175m (phía Đông)',
    story: 'Lăng Hùng Vương tương truyền là mộ của Vua Hùng thứ 6 (Hùng Định Vương). Sau khi dẹp tan giặc Ân, Vua hóa tại đây. Lăng nhìn ra hướng Đông Nam, trước mặt là ngã ba sông Hạc Trì mênh mang, phong thủy đắc địa.',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'den-gieng',
    name: 'Đền Giếng (Ngọc Tỉnh)',
    zone: 'center',
    desc: 'Gắn liền với hai vị công chúa Tiên Dung và Ngọc Hoa, nơi nguồn nước mát lành ngàn năm không cạn.',
    duration: '30 phút',
    status: 'locked',
    elevation: 'Chân núi phía Đông Nam',
    story: 'Đền Giếng (Ngọc Tỉnh) thờ hai nàng công chúa con gái Vua Hùng thứ 18 là Tiên Dung và Ngọc Hoa. Nơi đây có giếng ngọc quanh năm nước trong vắt, tương truyền là nơi hai công chúa thường soi gương vấn tóc và giúp dân khai khẩn ruộng nương.',
    img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'den-to-mau-au-co',
    name: 'Đền Tổ Mẫu Âu Cơ',
    zone: 'outer',
    desc: 'Không gian tưởng nhớ Quốc Mẫu Âu Cơ ngự trên đỉnh núi Vặn uy linh, cội nguồn tấm lòng người mẹ Việt Nam.',
    duration: '45 phút',
    status: 'locked',
    elevation: 'Đỉnh núi Vặn (Ốc Sơn)',
    story: 'Đền Tổ Mẫu Âu Cơ tọa lạc trên núi Vặn (Ốc Sơn), được khởi công xây dựng tôn nghiêm để tri ân công đức trời biển của Mẹ Âu Cơ. Khung cảnh thanh tịnh hòa quyện giữa rừng cây đại ngàn với kiến trúc đền truyền thống thời Hậu Lê.',
    img: 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'den-lac-long-quan',
    name: 'Đền Quốc Tổ Lạc Long Quân',
    zone: 'outer',
    desc: 'Không gian thiêng liêng tri ân Quốc Tổ Lạc Long Quân tọa lạc trên đỉnh đồi Sim phong thủy tú khí.',
    duration: '40 phút',
    status: 'locked',
    elevation: 'Đồi Sim',
    story: 'Đền Quốc Tổ Lạc Long Quân uy nghi trên đồi Sim, có địa thế hình con rùa lớn, hai bên có thanh long bạch hổ chầu về. Đây là nơi hội tụ linh khí trời đất, thể hiện truyền thống "Uống nước nhớ nguồn" của trăm triệu người con đất Việt.',
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  }
];

function initJourneyFilter() {
  const filterButtons = document.querySelectorAll('.filter-pill');
  const placesGrid = document.getElementById('placesGrid');
  if (!placesGrid) return;

  renderPlaces(PLACES_DATA);

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      let filtered = PLACES_DATA;
      if (filter === 'completed') {
        filtered = PLACES_DATA.filter(p => p.status === 'completed');
      } else if (filter === 'locked') {
        filtered = PLACES_DATA.filter(p => p.status === 'locked');
      } else if (filter === 'center') {
        filtered = PLACES_DATA.filter(p => p.zone === 'center');
      } else if (filter === 'outer') {
        filtered = PLACES_DATA.filter(p => p.zone === 'outer');
      }
      renderPlaces(filtered);
    });
  });
}

function renderPlaces(places) {
  const container = document.getElementById('placesGrid');
  if (!container) return;

  container.innerHTML = places.map(place => {
    const isDone = place.status === 'completed';
    return `
      <div class="place-card" data-id="${place.id}">
        <div class="place-media">
          <img src="${place.img}" alt="${place.name}" class="place-img" loading="lazy">
          <div class="place-status-badge">
            ${isDone 
              ? `<span class="badge-red"><img src="assets/stamp-verified.svg" style="width:14px;height:14px;"> ĐÃ KHÁM PHÁ</span>`
              : `<span class="badge-green" style="background:rgba(0,0,0,0.6);color:#FFF;border-color:rgba(255,255,255,0.3);">🔒 CHƯA CHECK-IN</span>`
            }
          </div>
          <div class="place-duration">
            ⏱ ${place.duration} • ⛰ ${place.elevation}
          </div>
        </div>
        <div class="place-info">
          <h3 class="place-name">${place.name}</h3>
          <p class="place-desc">${place.desc}</p>
          <div class="place-footer">
            <span style="font-size:0.8rem;color:var(--color-text-muted);">
              ${isDone ? '✨ Đã lưu vào Hộ chiếu' : '📍 Cần check-in tại di tích'}
            </span>
            <button class="btn-link-story" onclick="openStoryModal('${place.id}')">
              Khám phá câu chuyện →
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   5. STORYTELLING CHAPTER NAVIGATION
   ========================================================================== */
function initStorytellingTabs() {
  const tabs = document.querySelectorAll('.story-tab-btn');
  const slides = document.querySelectorAll('.story-slide');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      slides.forEach(s => s.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.dataset.target;
      const targetSlide = document.getElementById(targetId);
      if (targetSlide) {
        targetSlide.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE MAP OF ĐỀN HÙNG
   ========================================================================== */
const MAP_PINS = [
  { id: 'cong-den-hung', name: 'Cổng Đền Hùng', x: 48, y: 88, status: 'completed' },
  { id: 'den-ha', name: 'Đền Hạ & Giếng Rồng', x: 48, y: 72, status: 'completed' },
  { id: 'chua-thien-quang', name: 'Chùa Thiên Quang', x: 53, y: 68, status: 'completed' },
  { id: 'den-trung', name: 'Đền Trung (Hùng Vương Điện)', x: 50, y: 52, status: 'completed' },
  { id: 'den-thuong', name: 'Đền Thượng (Kính Thiên Lĩnh Điện)', x: 53, y: 28, status: 'locked' },
  { id: 'lang-hung-vuong', name: 'Lăng Hùng Vương', x: 58, y: 25, status: 'locked' },
  { id: 'den-gieng', name: 'Đền Giếng (Ngọc Tỉnh)', x: 62, y: 60, status: 'locked' },
  { id: 'den-to-mau-au-co', name: 'Đền Mẫu Âu Cơ (Núi Vặn)', x: 22, y: 52, status: 'locked' },
  { id: 'den-lac-long-quan', name: 'Đền Lạc Long Quân (Đồi Sim)', x: 80, y: 78, status: 'locked' }
];

function initInteractiveMap() {
  const stage = document.getElementById('mapStage');
  const popover = document.getElementById('mapPopover');
  if (!stage || !popover) return;

  MAP_PINS.forEach(pin => {
    const pinEl = document.createElement('div');
    pinEl.className = 'map-pin';
    pinEl.style.left = `${pin.x}%`;
    pinEl.style.top = `${pin.y}%`;
    pinEl.dataset.id = pin.id;

    const isCompleted = pin.status === 'completed';
    pinEl.innerHTML = `
      <div class="pin-marker ${isCompleted ? 'completed' : 'locked'}">
        <span class="pin-icon">${isCompleted ? '✓' : '📍'}</span>
      </div>
      <div class="pin-pulse"></div>
    `;

    pinEl.addEventListener('click', (e) => {
      e.stopPropagation();
      showMapPopover(pin.id);
    });

    stage.appendChild(pinEl);
  });

  document.addEventListener('click', (e) => {
    if (!popover.contains(e.target) && !e.target.closest('.map-pin')) {
      popover.classList.remove('active');
    }
  });
}

function showMapPopover(placeId) {
  const popover = document.getElementById('mapPopover');
  const place = PLACES_DATA.find(p => p.id === placeId);
  if (!popover || !place) return;

  const isCompleted = place.status === 'completed';
  popover.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;">
      <span class="badge-gold">${place.elevation}</span>
      <button onclick="document.getElementById('mapPopover').classList.remove('active')" 
              style="background:none;border:none;color:#FFF;cursor:pointer;font-size:1.2rem;">✕</button>
    </div>
    <div style="display:flex;gap:1rem;margin-bottom:1rem;">
      <img src="${place.img}" style="width:85px;height:85px;border-radius:10px;object-fit:cover;border:1px solid var(--color-vang-dong);">
      <div>
        <h4 style="font-size:1.15rem;color:var(--color-vang-nhat);margin-bottom:0.25rem;">${place.name}</h4>
        <p style="font-size:0.82rem;color:rgba(255,255,255,0.8);line-height:1.4;">${place.desc.slice(0, 85)}...</p>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.15);padding-top:0.75rem;">
      <span style="font-size:0.8rem;color:var(--color-vang-dong);">
        ${isCompleted ? '★ Dấu ấn đã thu thập' : '🔒 Chưa thu thập dấu ấn'}
      </span>
      <button class="${isCompleted ? 'btn-secondary' : 'btn-gold'}" style="padding:0.45rem 1rem;font-size:0.82rem;" 
              onclick="${isCompleted ? `openStoryModal('${place.id}')` : `simulateQRCheckin('${place.id}')`}">
        ${isCompleted ? 'Đọc câu chuyện' : 'Check-in ngay'}
      </button>
    </div>
  `;
  popover.classList.add('active');
}

/* ==========================================================================
   7. TOUR FILTERS & BOOKING
   ========================================================================== */
function initTourFilters() {
  const tourButtons = document.querySelectorAll('.tour-filter-btn');
  const tourCards = document.querySelectorAll('.tour-card');

  tourButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tourButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.tourFilter;

      tourCards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function openTourBooking(tourName, basePrice) {
  const modal = document.getElementById('tourBookingModal');
  if (!modal) return;
  document.getElementById('bookingTourName').textContent = tourName;
  document.getElementById('bookingTourPrice').textContent = basePrice;
  modal.classList.add('active');
}

/* ==========================================================================
   8. OCOP STORE & CART SYSTEM
   ========================================================================== */
const OCOP_PRODUCTS = [
  {
    id: 'che-dinh-bat-tien',
    name: 'Chè Đinh Bát Tiên Long Cốc',
    category: 'tea',
    stars: 5,
    origin: 'Đồi chè Long Cốc, Tân Sơn',
    price: 320000,
    priceStr: '320.000đ',
    img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    desc: 'Búp chè tuyển chọn 1 tôm 1 lá non hái trong sương sớm trên ốc đảo chè Long Cốc. Vị tiền chát dịu, hậu ngọt sâu lắng chuẩn phong vị Đất Tổ.'
  },
  {
    id: 'buoi-doan-hung',
    name: 'Bưởi Đoan Hùng Chí Đám',
    category: 'fruit',
    stars: 4,
    origin: 'Xã Chí Đám, Đoan Hùng',
    price: 85000,
    priceStr: '85.000đ/quả',
    img: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80',
    desc: 'Đặc sản tiến vua nức tiếng. Tép bưởi mọng nước, tôm vàng óng, vị ngọt thanh mát đậm đà lưu lại hương thơm dịu nhẹ.'
  },
  {
    id: 'mi-gao-hung-lo',
    name: 'Mì Gạo Hùng Lô Cổ Truyền',
    category: 'specialty',
    stars: 4,
    origin: 'Làng cổ Hùng Lô, Việt Trì',
    price: 45000,
    priceStr: '45.000đ/gói 500g',
    img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    desc: 'Làm từ 100% gạo ngon vùng châu thổ sông Lô, phơi nắng gió tự nhiên của làng cổ 300 năm. Sợi mì dai mềm tự nhiên, không hàn the.'
  },
  {
    id: 'thit-chua-thanh-son',
    name: 'Thịt Chua Thanh Sơn Ống Nứa',
    category: 'food',
    stars: 4,
    origin: 'Thanh Sơn, Phú Thọ',
    price: 75000,
    priceStr: '75.000đ/ống',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    desc: 'Món ăn cổ truyền của người Mường Phú Thọ. Thịt lợn mán lên men tự nhiên với thính ngô rang thơm nức, đóng ống nứa đượm hương rừng.'
  },
  {
    id: 'mat-ong-nghia-linh',
    name: 'Mật Ong Hoa Rừng Nghĩa Lĩnh',
    category: 'food',
    stars: 4,
    origin: 'Rừng quốc gia Đền Hùng',
    price: 240000,
    priceStr: '240.000đ/chai 500ml',
    img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    desc: 'Mật ong tự nhiên thu hoạch từ thảm thực vật đa dạng núi Nghĩa Lĩnh. Màu hổ phách sánh đặc, giàu dưỡng chất và thơm thanh khiết.'
  },
  {
    id: 'banh-chung-dat-to',
    name: 'Bánh Chưng Đất Tổ Lang Liêu',
    category: 'specialty',
    stars: 4,
    origin: 'Xã Hy Cương, Đền Hùng',
    price: 110000,
    priceStr: '110.000đ/chiếc',
    img: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=600&q=80',
    desc: 'Gạo nếp nương thơm dẻo, đỗ xanh lòng vàng, thịt lợn ướp tiêu gia truyền gói lá dong rừng luộc 14 tiếng bằng củi nhãn theo tích xưa.'
  },
  {
    id: 'tinh-dau-buoi',
    name: 'Tinh Dầu Bưởi Đoan Hùng',
    category: 'gift',
    stars: 3,
    origin: 'Đoan Hùng, Phú Thọ',
    price: 135000,
    priceStr: '135.000đ/lọ 30ml',
    img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    desc: 'Chiết xuất từ vỏ bưởi Đoan Hùng hữu cơ bằng phương pháp lôi cuốn hơi nước. Mùi hương thanh tao, thư giãn và dưỡng tóc mượt mà.'
  },
  {
    id: 'trong-dong-ma-vang',
    name: 'Mô Hình Trống Đồng Mạ Vàng',
    category: 'craft',
    stars: 5,
    origin: 'Làng nghề đúc đồng truyền thống',
    price: 890000,
    priceStr: '890.000đ',
    img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    desc: 'Món quà lưu niệm cao cấp chạm khắc tinh xảo họa tiết chim Lạc và mặt trời 14 cánh của trống đồng Ngọc Lũ, mạ vàng 24K sang trọng.'
  }
];

let cart = [
  { id: 'che-dinh-bat-tien', name: 'Chè Đinh Bát Tiên Long Cốc', price: 320000, qty: 1, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80' }
];

function initOcopStore() {
  const filterBtns = document.querySelectorAll('.ocop-filter-btn');
  renderOcopProducts(OCOP_PRODUCTS);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.ocopCat;

      if (cat === 'all') {
        renderOcopProducts(OCOP_PRODUCTS);
      } else {
        renderOcopProducts(OCOP_PRODUCTS.filter(p => p.category === cat));
      }
    });
  });
}

function renderOcopProducts(products) {
  const grid = document.getElementById('ocopGrid');
  if (!grid) return;

  grid.innerHTML = products.map(prod => `
    <div class="product-card" data-id="${prod.id}">
      <div class="product-thumb-box">
        <img src="${prod.img}" alt="${prod.name}" class="product-thumb" loading="lazy">
        <div class="ocop-star-badge">
          ${'⭐'.repeat(prod.stars)} OCOP
        </div>
      </div>
      <div class="product-body">
        <span class="product-origin">📍 ${prod.origin}</span>
        <h4 class="product-name">${prod.name}</h4>
        <div class="product-rating">
          <span>★★★★★</span>
          <span style="color:var(--color-text-muted);font-size:0.75rem;">(4.9)</span>
        </div>
        <div class="product-price">${prod.priceStr}</div>
        <div class="product-card-actions">
          <button class="btn-add-cart" onclick="addToCart('${prod.id}')">
            🛒 Thêm vào giỏ
          </button>
          <button class="btn-view-story" onclick="openProductStoryModal('${prod.id}')">
            Xem câu chuyện sản phẩm
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function initCartDrawer() {
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeBtn = document.getElementById('closeCartBtn');

  cartToggleBtns.forEach(b => {
    b.addEventListener('click', () => {
      updateCartUI();
      cartDrawer.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => cartDrawer.classList.remove('active'));
  }
}

function addToCart(productId) {
  const item = OCOP_PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
      img: item.img
    });
  }

  SoundEffects.playChime();
  updateCartUI();
  document.getElementById('cartDrawer').classList.add('active');
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const mobileBadge = document.getElementById('mobileCartBadge');
  const list = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');

  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  if (badge) badge.textContent = totalCount;
  if (mobileBadge) mobileBadge.textContent = totalCount;

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;color:var(--color-text-muted);">
        <p style="font-size:3rem;margin-bottom:1rem;">🛒</p>
        <p>Giỏ hàng của bạn đang trống</p>
        <p style="font-size:0.85rem;margin-top:0.5rem;">Hãy khám phá tinh hoa đặc sản Phú Thọ!</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '0đ';
    return;
  }

  let totalMoney = 0;
  list.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    totalMoney += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.img}" class="cart-item-img">
        <div style="flex-grow:1;">
          <h5 style="font-size:0.95rem;color:var(--color-nau-dam);margin-bottom:0.25rem;">${item.name}</h5>
          <div style="font-size:0.85rem;color:var(--color-do-son);font-weight:700;">
            ${item.price.toLocaleString('vi-VN')}đ
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;margin-top:0.5rem;">
            <button onclick="changeQty('${item.id}', -1)" style="width:24px;height:24px;border-radius:4px;border:1px solid #CCC;background:#FFF;cursor:pointer;">-</button>
            <span style="font-size:0.9rem;font-weight:600;">${item.qty}</span>
            <button onclick="changeQty('${item.id}', 1)" style="width:24px;height:24px;border-radius:4px;border:1px solid #CCC;background:#FFF;cursor:pointer;">+</button>
          </div>
        </div>
        <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:#999;cursor:pointer;font-size:1.1rem;">🗑</button>
      </div>
    `;
  }).join('');

  if (subtotalEl) {
    subtotalEl.textContent = totalMoney.toLocaleString('vi-VN') + 'đ';
  }
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

/* ==========================================================================
   9. QR CHECK-IN SIMULATION & STAMP "CỘP" ANIMATION
   ========================================================================== */
let passportStampsCount = 4;
const totalSites = 10;

function initQRScanner() {
  const triggerBtns = document.querySelectorAll('.trigger-qr-scanner');
  const modal = document.getElementById('qrScannerModal');
  const closeBtn = document.getElementById('closeQrModalBtn');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openQRScannerModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
}

function openQRScannerModal() {
  const modal = document.getElementById('qrScannerModal');
  const scanView = document.getElementById('scannerActiveView');
  const celebrationView = document.getElementById('stampCelebrationView');

  scanView.style.display = 'block';
  celebrationView.style.display = 'none';
  modal.classList.add('active');
}

function simulateQRCheckin(landmarkId = 'den-thuong') {
  openQRScannerModal();
  const scanView = document.getElementById('scannerActiveView');
  const celebrationView = document.getElementById('stampCelebrationView');

  // Simulate camera finding QR and verifying
  setTimeout(() => {
    scanView.style.display = 'none';
    celebrationView.style.display = 'block';

    // Play synthesized heavy lacquer seal stamp sound effect!
    SoundEffects.playStampSound();

    // Increment passport stats if not already reached
    if (passportStampsCount < 5) {
      passportStampsCount = 5;
      updatePassportLiveStats();
    }
  }, 1400);
}

function updatePassportLiveStats() {
  const statCount = document.querySelector('.passport-card-3d .stat-count');
  const progressFill = document.querySelector('.passport-card-3d .progress-fill');
  const metricNum = document.getElementById('dashMetricStamps');
  const metricProgress = document.getElementById('dashMetricProgress');
  const metricRemaining = document.getElementById('dashMetricRemaining');

  if (statCount) statCount.textContent = '05 / 10 Dấu ấn';
  if (progressFill) progressFill.style.width = '50%';
  if (metricNum) metricNum.textContent = '05';
  if (metricProgress) metricProgress.textContent = '50%';
  if (metricRemaining) metricRemaining.textContent = '05';

  // Unlock Đền Thượng on places grid
  const denThuongData = PLACES_DATA.find(p => p.id === 'den-thuong');
  if (denThuongData) denThuongData.status = 'completed';

  // Unlock map pin
  const pinEl = document.querySelector(`.map-pin[data-id="den-thuong"] .pin-marker`);
  if (pinEl) {
    pinEl.className = 'pin-marker completed';
    pinEl.innerHTML = '<span class="pin-icon">✓</span>';
  }

  // Update booklet stamp slot
  const slot = document.getElementById('bookletStampDenThuong');
  if (slot) {
    slot.classList.remove('locked');
    slot.classList.add('stamped');
    slot.innerHTML = `
      <img src="assets/stamp-den-thuong.svg" alt="Đền Thượng">
      <span class="slot-label" style="color:var(--color-do-son);">Đền Thượng</span>
    `;
  }
}

/* ==========================================================================
   10. PASSPORT MODAL & DIGITAL CERTIFICATE
   ========================================================================== */
function initPassportModal() {
  const closeBtn = document.getElementById('closePassportModal');
  const modal = document.getElementById('passportFullModal');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
}

function openPassportModal() {
  const modal = document.getElementById('passportFullModal');
  if (modal) {
    modal.classList.add('active');
  }
}

/* ==========================================================================
   11. STORY LORE & PRODUCT STORY MODAL
   ========================================================================== */
function openStoryModal(placeId) {
  const place = PLACES_DATA.find(p => p.id === placeId);
  const modal = document.getElementById('storyLoreModal');
  if (!place || !modal) return;

  document.getElementById('loreTitle').textContent = place.name;
  document.getElementById('loreElevation').textContent = place.elevation;
  document.getElementById('loreImg').src = place.img;
  document.getElementById('loreContent').innerHTML = `
    <p style="font-size:1.05rem;line-height:1.8;color:var(--color-text-dark);margin-bottom:1.25rem;">
      ${place.story}
    </p>
    <div class="unesco-highlight-box" style="margin-top:1.5rem;">
      <div class="unesco-title">Ghi nhớ lịch sử Đất Tổ</div>
      <div class="unesco-quote" style="color:var(--color-nau-dam);font-size:1.05rem;">
        “Nơi ngọn nguồn linh khí sông Hồng và sông Lô gặp gỡ, nơi 18 đời Vua Hùng dựng nên quốc thống ngàn năm.”
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function openProductStoryModal(productId) {
  const prod = OCOP_PRODUCTS.find(p => p.id === productId);
  const modal = document.getElementById('storyLoreModal');
  if (!prod || !modal) return;

  document.getElementById('loreTitle').textContent = prod.name;
  document.getElementById('loreElevation').textContent = `Chứng nhận OCOP ${prod.stars} Sao • ${prod.origin}`;
  document.getElementById('loreImg').src = prod.img;
  document.getElementById('loreContent').innerHTML = `
    <p style="font-size:1.05rem;line-height:1.8;color:var(--color-text-dark);margin-bottom:1.25rem;">
      ${prod.desc}
    </p>
    <div style="background:var(--color-kem-giay);padding:1.25rem;border-radius:12px;border:1px solid rgba(213,164,55,0.3);margin-top:1.25rem;">
      <h5 style="color:var(--color-nau-dam);margin-bottom:0.5rem;font-size:0.95rem;">Hành trình gìn giữ bản sắc Đất Tổ</h5>
      <p style="font-size:0.9rem;color:var(--color-text-muted);line-height:1.6;">
        Mỗi sản phẩm OCOP Phú Thọ là tâm huyết của những nghệ nhân địa phương qua bao thế hệ. Mua sản phẩm là cách bạn góp phần nuôi dưỡng làng nghề truyền thống và bảo tồn di sản nông nghiệp bền vững của vùng đất cội nguồn.
      </p>
    </div>
  `;

  modal.classList.add('active');
}

function initModalsAndPopups() {
  // Generic modal click outside to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Search Modal Toggle
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => searchModal.classList.add('active'));
    document.getElementById('closeSearchBtn').addEventListener('click', () => searchModal.classList.remove('active'));
  }

  // Account Modal
  const accountBtn = document.getElementById('accountBtn');
  if (accountBtn) {
    accountBtn.addEventListener('click', () => openPassportModal());
  }
}

// Global functions exposed to inline click handlers
window.openStoryModal = openStoryModal;
window.openProductStoryModal = openProductStoryModal;
window.simulateQRCheckin = simulateQRCheckin;
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.openTourBooking = openTourBooking;
window.openPassportModal = openPassportModal;
