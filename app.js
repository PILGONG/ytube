/**
 * 반병현 YouTube 아카이브 Application Logic
 * Pure Vanilla JavaScript (No Frameworks)
 */

(function () {
  'use strict';

  // LocalStorage Keys
  const STORAGE_KEYS = {
    BOOKMARKS: 'ban_yt_bookmarks_v1',
    CUSTOM_VIDEOS: 'ban_yt_custom_videos_v1'
  };

  // State
  const state = {
    allVideos: [],
    filteredVideos: [],
    bookmarks: new Set(),
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'recommended',
    onlyBookmarks: false,
    currentVideoId: null
  };

  // DOM Elements Cache
  const DOM = {
    // Header
    logoLink: document.getElementById('logoLink'),
    openAddModalBtn: document.getElementById('openAddModalBtn'),
    headerBookmarkBtn: document.getElementById('headerBookmarkBtn'),
    bookmarkCountBadge: document.getElementById('bookmarkCountBadge'),

    // Hero & Stats
    totalVideosCount: document.getElementById('totalVideosCount'),
    spotlightCard: document.getElementById('spotlightCard'),
    spotlightPlayBtn: document.getElementById('spotlightPlayBtn'),
    spotlightTitle: document.getElementById('spotlightTitle'),
    spotlightThumb: document.getElementById('spotlightThumb'),

    // Toolbar
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    sortSelect: document.getElementById('sortSelect'),
    categoryPills: document.getElementById('categoryPills'),

    // Results & Grid
    resultsTitle: document.getElementById('resultsTitle'),
    resultsCount: document.getElementById('resultsCount'),
    activeFilterTags: document.getElementById('activeFilterTags'),
    videosGrid: document.getElementById('videosGrid'),
    emptyState: document.getElementById('emptyState'),
    emptyDesc: document.getElementById('emptyDesc'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),

    // Video Modal
    videoModal: document.getElementById('videoModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    youtubeIframe: document.getElementById('youtubeIframe'),
    modalCategoryBadge: document.getElementById('modalCategoryBadge'),
    modalChannel: document.getElementById('modalChannel'),
    modalBookmarkBtn: document.getElementById('modalBookmarkBtn'),
    modalBookmarkIcon: document.getElementById('modalBookmarkIcon'),
    modalShareBtn: document.getElementById('modalShareBtn'),
    modalYoutubeLink: document.getElementById('modalYoutubeLink'),
    modalVideoTitle: document.getElementById('modalVideoTitle'),
    modalPublishedDate: document.getElementById('modalPublishedDate'),
    modalViews: document.getElementById('modalViews'),
    modalDuration: document.getElementById('modalDuration'),
    modalVideoDesc: document.getElementById('modalVideoDesc'),
    modalTagsContainer: document.getElementById('modalTagsContainer'),
    prevVideoBtn: document.getElementById('prevVideoBtn'),
    nextVideoBtn: document.getElementById('nextVideoBtn'),
    modalCounterIndicator: document.getElementById('modalCounterIndicator'),

    // Add Video Modal
    addVideoModal: document.getElementById('addVideoModal'),
    closeAddModalBtn: document.getElementById('closeAddModalBtn'),
    cancelAddBtn: document.getElementById('cancelAddBtn'),
    addVideoForm: document.getElementById('addVideoForm'),
    inputVideoUrl: document.getElementById('inputVideoUrl'),
    inputVideoTitle: document.getElementById('inputVideoTitle'),
    inputCategory: document.getElementById('inputCategory'),
    inputChannel: document.getElementById('inputChannel'),
    inputSummary: document.getElementById('inputSummary'),
    inputTags: document.getElementById('inputTags'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  /* ==========================================================================
     Initialization & Persistence
     ========================================================================== */
  function init() {
    loadStoredData();
    renderCategoryPills();
    setupEventListeners();
    applyFilterAndRender();
  }

  function loadStoredData() {
    // 1. Load Bookmarks
    try {
      const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (savedBookmarks) {
        state.bookmarks = new Set(JSON.parse(savedBookmarks));
      }
    } catch (e) {
      console.warn('Failed to load bookmarks:', e);
      state.bookmarks = new Set();
    }

    // 2. Load Custom Added Videos
    let customVideos = [];
    try {
      const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
      if (savedCustom) {
        customVideos = JSON.parse(savedCustom);
      }
    } catch (e) {
      console.warn('Failed to load custom videos:', e);
      customVideos = [];
    }

    // 3. Merge with INITIAL_VIDEOS (avoid duplicate IDs)
    const initialMap = new Map();
    INITIAL_VIDEOS.forEach(v => initialMap.set(v.id, v));
    customVideos.forEach(v => initialMap.set(v.id, v));

    state.allVideos = Array.from(initialMap.values());
    updateBookmarkBadge();
    if (DOM.totalVideosCount) {
      DOM.totalVideosCount.textContent = state.allVideos.length;
    }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(Array.from(state.bookmarks)));
      updateBookmarkBadge();
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }

  function saveCustomVideos(newVideo) {
    try {
      let customVideos = [];
      const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
      if (savedCustom) {
        customVideos = JSON.parse(savedCustom);
      }
      customVideos.unshift(newVideo);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(customVideos));
    } catch (e) {
      console.error('Failed to save custom video:', e);
    }
  }

  function updateBookmarkBadge() {
    const count = state.bookmarks.size;
    if (DOM.bookmarkCountBadge) {
      DOM.bookmarkCountBadge.textContent = count;
    }
  }

  /* ==========================================================================
     Category Tabs & Count Rendering
     ========================================================================== */
  function renderCategoryPills() {
    if (!DOM.categoryPills) return;

    DOM.categoryPills.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `category-pill ${cat.id === state.selectedCategory ? 'active' : ''}`;
      btn.setAttribute('data-category', cat.id);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', cat.id === state.selectedCategory ? 'true' : 'false');

      // Calculate count for this category
      let count = 0;
      if (cat.id === 'all') {
        count = state.allVideos.length;
      } else {
        count = state.allVideos.filter(v => v.category === cat.id).length;
      }

      btn.innerHTML = `
        <span class="pill-icon">${cat.icon}</span>
        <span class="pill-name">${cat.name}</span>
        <span class="pill-count">${count}</span>
      `;

      btn.addEventListener('click', () => {
        state.selectedCategory = cat.id;
        updateActivePillStyles();
        applyFilterAndRender();
      });

      DOM.categoryPills.appendChild(btn);
    });
  }

  function updateActivePillStyles() {
    const pills = DOM.categoryPills.querySelectorAll('.category-pill');
    pills.forEach(pill => {
      const catId = pill.getAttribute('data-category');
      const isActive = catId === state.selectedCategory;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  /* ==========================================================================
     Filtering & Sorting Logic
     ========================================================================== */
  function parseViewsNumber(viewsStr) {
    if (!viewsStr) return 0;
    // e.g. "4,250,000회" -> 4250000, "185,000회" -> 185000
    const clean = viewsStr.replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
  }

  function applyFilterAndRender() {
    let result = [...state.allVideos];

    // 1. Category Filter
    if (state.selectedCategory !== 'all') {
      result = result.filter(v => v.category === state.selectedCategory);
    }

    // 2. Bookmarks Only Filter
    if (state.onlyBookmarks) {
      result = result.filter(v => state.bookmarks.has(v.id));
    }

    // 3. Search Query Filter
    const query = state.searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(v => {
        const titleMatch = v.title.toLowerCase().includes(query);
        const channelMatch = (v.channel || '').toLowerCase().includes(query);
        const summaryMatch = (v.summary || '').toLowerCase().includes(query);
        const tagsMatch = Array.isArray(v.tags) && v.tags.some(t => t.toLowerCase().includes(query));
        return titleMatch || channelMatch || summaryMatch || tagsMatch;
      });
    }

    // 4. Sorting
    switch (state.sortBy) {
      case 'latest':
        result.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
        break;
      case 'views':
        result.sort((a, b) => parseViewsNumber(b.views) - parseViewsNumber(a.views));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        break;
      case 'recommended':
      default:
        // Featured videos first, then latest
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
        });
        break;
    }

    state.filteredVideos = result;
    renderGrid(result);
    updateResultsHeader(result.length);
  }

  function updateResultsHeader(count) {
    if (DOM.resultsCount) {
      DOM.resultsCount.textContent = `${count}개 영상`;
    }

    if (DOM.resultsTitle) {
      if (state.onlyBookmarks) {
        DOM.resultsTitle.textContent = '❤️ 즐겨찾기 보관함';
      } else if (state.searchQuery) {
        DOM.resultsTitle.textContent = `'${state.searchQuery}' 검색 결과`;
      } else {
        const currentCat = CATEGORIES.find(c => c.id === state.selectedCategory);
        DOM.resultsTitle.textContent = currentCat ? currentCat.name : '전체 영상';
      }
    }
  }

  /* ==========================================================================
     Video Grid Cards Rendering
     ========================================================================== */
  function getCategoryBadgeClass(category) {
    switch (category) {
      case 'automation': return 'badge-cat-automation';
      case 'ai': return 'badge-cat-ai';
      case 'interview': return 'badge-cat-interview';
      case 'story': return 'badge-cat-story';
      default: return 'badge-cat-automation';
    }
  }

  function getCategoryName(categoryId) {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    return cat ? cat.name.replace(/^[^\s]+\s/, '') : '영상';
  }

  function renderGrid(videos) {
    if (!DOM.videosGrid) return;

    if (videos.length === 0) {
      DOM.videosGrid.innerHTML = '';
      if (DOM.emptyState) {
        DOM.emptyState.hidden = false;
        if (state.onlyBookmarks) {
          DOM.emptyDesc.textContent = '아직 북마크한 영상이 없습니다. 하트 아이콘을 눌러 마음에 드는 영상을 보관해보세요!';
        } else if (state.searchQuery) {
          DOM.emptyDesc.textContent = `'${state.searchQuery}'에 일치하는 영상을 찾을 수 없습니다.`;
        } else {
          DOM.emptyDesc.textContent = '선택한 카테고리에 해당하는 영상이 없습니다.';
        }
      }
      return;
    }

    if (DOM.emptyState) {
      DOM.emptyState.hidden = true;
    }

    const fragment = document.createDocumentFragment();

    videos.forEach(video => {
      const card = document.createElement('article');
      card.className = 'video-card';
      card.setAttribute('data-id', video.id);

      const isBookmarked = state.bookmarks.has(video.id);
      const catClass = getCategoryBadgeClass(video.category);
      const catName = getCategoryName(video.category);

      // Card HTML
      card.innerHTML = `
        <div class="card-thumbnail-wrap" role="button" tabindex="0" aria-label="${video.title} 영상 재생">
          <img 
            src="https://i.ytimg.com/vi/${video.id}/hqdefault.jpg" 
            alt="${video.title}" 
            class="card-thumbnail" 
            loading="lazy" 
            onerror="this.onerror=null; this.src='https://i.ytimg.com/vi/${video.id}/mqdefault.jpg';"
          >
          <span class="card-category-badge ${catClass}">${catName}</span>
          <span class="card-duration">${video.duration || '00:00'}</span>
          <div class="card-play-overlay">
            <div class="card-play-btn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
            </div>
          </div>
          <button 
            type="button" 
            class="card-bookmark-btn ${isBookmarked ? 'active' : ''}" 
            title="${isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}" 
            aria-label="즐겨찾기 토글"
            data-bookmark-id="${video.id}"
          >
            ♥
          </button>
        </div>

        <div class="card-body">
          <div class="card-channel">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>${video.channel || '반병현 half_bottle'}</span>
          </div>

          <h3 class="card-title" title="${video.title}">${video.title}</h3>
          
          <p class="card-summary">${video.summary || ''}</p>

          <div class="card-footer">
            <div class="card-stats">
              <span>👁️ ${video.views || '조회수 정보 없음'}</span>
              <span>📅 ${video.publishedAt || ''}</span>
            </div>
            <button type="button" class="card-play-action-btn" aria-label="시청하기">
              <span>시청하기</span>
              <span>›</span>
            </button>
          </div>
        </div>
      `;

      // Event: Click on thumbnail wrap or title to open player
      const thumbWrap = card.querySelector('.card-thumbnail-wrap');
      const cardTitle = card.querySelector('.card-title');
      const playActionBtn = card.querySelector('.card-play-action-btn');

      const handlePlay = (e) => {
        // Ignore if clicked on bookmark button
        if (e.target.closest('.card-bookmark-btn')) return;
        openVideoModal(video.id);
      };

      thumbWrap.addEventListener('click', handlePlay);
      cardTitle.addEventListener('click', handlePlay);
      playActionBtn.addEventListener('click', handlePlay);

      // Keyboard accessible play
      thumbWrap.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openVideoModal(video.id);
        }
      });

      // Bookmark Button Event
      const bookmarkBtn = card.querySelector('.card-bookmark-btn');
      bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(video.id);
      });

      fragment.appendChild(card);
    });

    DOM.videosGrid.innerHTML = '';
    DOM.videosGrid.appendChild(fragment);
  }

  /* ==========================================================================
     Bookmark Management
     ========================================================================== */
  function toggleBookmark(videoId) {
    const isBookmarked = state.bookmarks.has(videoId);
    if (isBookmarked) {
      state.bookmarks.delete(videoId);
      showToast('즐겨찾기에서 제거되었습니다.', 'info');
    } else {
      state.bookmarks.add(videoId);
      showToast('즐겨찾기에 저장되었습니다! ❤️', 'success');
    }

    saveBookmarks();

    // Update modal bookmark button if this video is currently open
    if (state.currentVideoId === videoId) {
      updateModalBookmarkState(videoId);
    }

    // Update all matching cards on the screen
    const buttons = document.querySelectorAll(`.card-bookmark-btn[data-bookmark-id="${videoId}"]`);
    buttons.forEach(btn => {
      btn.classList.toggle('active', !isBookmarked);
      btn.setAttribute('title', !isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가');
    });

    // If we are currently in "only bookmarks" filter mode, refresh grid
    if (state.onlyBookmarks) {
      applyFilterAndRender();
    }
  }

  function updateModalBookmarkState(videoId) {
    const isBookmarked = state.bookmarks.has(videoId);
    if (DOM.modalBookmarkBtn) {
      DOM.modalBookmarkBtn.classList.toggle('active', isBookmarked);
      DOM.modalBookmarkBtn.setAttribute('title', isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가');
    }
  }

  /* ==========================================================================
     Modal Video Player Logic (<dialog>)
     ========================================================================== */
  function openVideoModal(videoId) {
    const video = state.allVideos.find(v => v.id === videoId);
    if (!video) return;

    state.currentVideoId = videoId;

    // Set Iframe Src (with autoplay)
    if (DOM.youtubeIframe) {
      DOM.youtubeIframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&enablejsapi=1`;
    }

    // Meta Details
    if (DOM.modalVideoTitle) DOM.modalVideoTitle.textContent = video.title;
    if (DOM.modalCategoryBadge) {
      DOM.modalCategoryBadge.textContent = getCategoryName(video.category);
      DOM.modalCategoryBadge.className = `modal-badge ${getCategoryBadgeClass(video.category)}`;
    }
    if (DOM.modalChannel) DOM.modalChannel.textContent = video.channel || '반병현 half_bottle';
    if (DOM.modalPublishedDate) DOM.modalPublishedDate.textContent = `📅 ${video.publishedAt || '날짜 정보 없음'}`;
    if (DOM.modalViews) DOM.modalViews.textContent = `👁️ ${video.views || '조회수 정보 없음'}`;
    if (DOM.modalDuration) DOM.modalDuration.textContent = `⏱️ ${video.duration || '00:00'}`;
    if (DOM.modalVideoDesc) DOM.modalVideoDesc.textContent = video.summary || '상세 설명이 없습니다.';

    // Tags
    if (DOM.modalTagsContainer) {
      DOM.modalTagsContainer.innerHTML = '';
      if (Array.isArray(video.tags)) {
        video.tags.forEach(tag => {
          const chip = document.createElement('span');
          chip.className = 'tag-chip';
          chip.textContent = `#${tag}`;
          DOM.modalTagsContainer.appendChild(chip);
        });
      }
    }

    // External Link
    if (DOM.modalYoutubeLink) {
      DOM.modalYoutubeLink.href = `https://www.youtube.com/watch?v=${video.id}`;
    }

    // Bookmark button inside modal
    updateModalBookmarkState(video.id);

    // Navigation Buttons (Prev / Next within current filtered list)
    updateModalNavigation();

    // Show native dialog modal
    if (DOM.videoModal && typeof DOM.videoModal.showModal === 'function') {
      DOM.videoModal.showModal();
    }
  }

  function closeVideoModal() {
    if (DOM.videoModal && DOM.videoModal.open) {
      DOM.videoModal.close();
    }
    // Stop YouTube playback immediately
    if (DOM.youtubeIframe) {
      DOM.youtubeIframe.src = '';
    }
    state.currentVideoId = null;
  }

  function updateModalNavigation() {
    const list = state.filteredVideos.length > 0 ? state.filteredVideos : state.allVideos;
    const currentIndex = list.findIndex(v => v.id === state.currentVideoId);

    if (DOM.modalCounterIndicator) {
      DOM.modalCounterIndicator.textContent = `${currentIndex >= 0 ? currentIndex + 1 : 1} / ${list.length}`;
    }

    if (DOM.prevVideoBtn) {
      DOM.prevVideoBtn.disabled = currentIndex <= 0;
    }
    if (DOM.nextVideoBtn) {
      DOM.nextVideoBtn.disabled = currentIndex === -1 || currentIndex >= list.length - 1;
    }
  }

  function navigateModalVideo(direction) {
    const list = state.filteredVideos.length > 0 ? state.filteredVideos : state.allVideos;
    const currentIndex = list.findIndex(v => v.id === state.currentVideoId);
    if (currentIndex === -1) return;

    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < list.length) {
      openVideoModal(list[newIndex].id);
    }
  }

  /* ==========================================================================
     Add Custom Video Modal
     ========================================================================== */
  function extractYouTubeId(urlOrId) {
    if (!urlOrId) return null;
    const trimmed = urlOrId.trim();

    // If 11 alphanumeric characters directly
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    // Standard YouTube URL parsing
    // Format: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = trimmed.match(regExp);
    return match ? match[1] : null;
  }

  function handleAddVideoSubmit(e) {
    e.preventDefault();

    const rawUrl = DOM.inputVideoUrl.value;
    const videoId = extractYouTubeId(rawUrl);

    if (!videoId) {
      showToast('올바른 YouTube 영상 URL 또는 11자리 비디오 ID를 입력해주세요.', 'error');
      DOM.inputVideoUrl.focus();
      return;
    }

    // Check duplicate
    if (state.allVideos.some(v => v.id === videoId)) {
      showToast('이미 아카이브에 등록되어 있는 영상입니다.', 'error');
      return;
    }

    const title = DOM.inputVideoTitle.value.trim();
    const category = DOM.inputCategory.value;
    const channel = DOM.inputChannel.value.trim() || '반병현 half_bottle';
    const summary = DOM.inputSummary.value.trim() || '사용자가 직접 등록한 영상입니다.';
    const rawTags = DOM.inputTags.value.trim();
    const tags = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : ['반병현', '추천'];

    const newVideo = {
      id: videoId,
      title: title,
      channel: channel,
      category: category,
      publishedAt: new Date().toISOString().split('T')[0],
      duration: '영상',
      views: '신규 등록',
      summary: summary,
      tags: tags,
      featured: false
    };

    // Prepend to allVideos
    state.allVideos.unshift(newVideo);
    saveCustomVideos(newVideo);

    // Reset Form & Close Modal
    DOM.addVideoForm.reset();
    DOM.addVideoModal.close();

    // Update Category Pills Counts & Re-render
    renderCategoryPills();
    applyFilterAndRender();

    showToast('새 영상이 아카이브에 성공적으로 추가되었습니다! 🎉', 'success');
  }

  /* ==========================================================================
     Toast Notifications
     ========================================================================== */
  function showToast(message, type = 'info') {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ==========================================================================
     Event Listeners Setup
     ========================================================================== */
  function setupEventListeners() {
    // 1. Search Bar
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (DOM.clearSearchBtn) {
          DOM.clearSearchBtn.hidden = !state.searchQuery;
        }
        applyFilterAndRender();
      });
    }

    if (DOM.clearSearchBtn) {
      DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        state.searchQuery = '';
        DOM.clearSearchBtn.hidden = true;
        DOM.searchInput.focus();
        applyFilterAndRender();
      });
    }

    // Keyboard shortcut: '/' focuses search input
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== DOM.searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        DOM.searchInput.focus();
      }
    });

    // 2. Sort Dropdown
    if (DOM.sortSelect) {
      DOM.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        applyFilterAndRender();
      });
    }

    // 3. Bookmark Filter Button (Header)
    if (DOM.headerBookmarkBtn) {
      DOM.headerBookmarkBtn.addEventListener('click', () => {
        state.onlyBookmarks = !state.onlyBookmarks;
        DOM.headerBookmarkBtn.classList.toggle('active', state.onlyBookmarks);
        applyFilterAndRender();
      });
    }

    // 4. Reset Filters Button
    if (DOM.resetFiltersBtn) {
      DOM.resetFiltersBtn.addEventListener('click', () => {
        state.searchQuery = '';
        if (DOM.searchInput) DOM.searchInput.value = '';
        if (DOM.clearSearchBtn) DOM.clearSearchBtn.hidden = true;
        state.selectedCategory = 'all';
        state.onlyBookmarks = false;
        if (DOM.headerBookmarkBtn) DOM.headerBookmarkBtn.classList.remove('active');
        state.sortBy = 'recommended';
        if (DOM.sortSelect) DOM.sortSelect.value = 'recommended';
        updateActivePillStyles();
        applyFilterAndRender();
      });
    }

    // 5. Spotlight Video Card Click
    if (DOM.spotlightCard) {
      DOM.spotlightCard.addEventListener('click', () => {
        // SBS news video id: R9Z_s2p89tE
        openVideoModal('R9Z_s2p89tE');
      });
    }

    // 6. Video Modal Controls
    if (DOM.closeModalBtn) {
      DOM.closeModalBtn.addEventListener('click', closeVideoModal);
    }

    // Modal light dismiss on backdrop click
    if (DOM.videoModal) {
      DOM.videoModal.addEventListener('click', (e) => {
        if (e.target === DOM.videoModal) {
          closeVideoModal();
        }
      });

      // Stop video audio on native ESC close
      DOM.videoModal.addEventListener('close', () => {
        if (DOM.youtubeIframe) {
          DOM.youtubeIframe.src = '';
        }
        state.currentVideoId = null;
      });
    }

    // Modal Nav Buttons
    if (DOM.prevVideoBtn) {
      DOM.prevVideoBtn.addEventListener('click', () => navigateModalVideo(-1));
    }
    if (DOM.nextVideoBtn) {
      DOM.nextVideoBtn.addEventListener('click', () => navigateModalVideo(1));
    }

    // Modal Bookmark Button
    if (DOM.modalBookmarkBtn) {
      DOM.modalBookmarkBtn.addEventListener('click', () => {
        if (state.currentVideoId) {
          toggleBookmark(state.currentVideoId);
        }
      });
    }

    // Modal Share (Copy Link) Button
    if (DOM.modalShareBtn) {
      DOM.modalShareBtn.addEventListener('click', async () => {
        if (!state.currentVideoId) return;
        const url = `https://www.youtube.com/watch?v=${state.currentVideoId}`;
        try {
          await navigator.clipboard.writeText(url);
          showToast('영상 링크가 클립보드에 복사되었습니다! 📋', 'success');
        } catch (err) {
          showToast(`URL: ${url}`, 'info');
        }
      });
    }

    // 7. Add Video Modal Controls
    if (DOM.openAddModalBtn && DOM.addVideoModal) {
      DOM.openAddModalBtn.addEventListener('click', () => {
        DOM.addVideoModal.showModal();
        DOM.inputVideoUrl.focus();
      });
    }

    if (DOM.closeAddModalBtn) {
      DOM.closeAddModalBtn.addEventListener('click', () => DOM.addVideoModal.close());
    }

    if (DOM.cancelAddBtn) {
      DOM.cancelAddBtn.addEventListener('click', () => DOM.addVideoModal.close());
    }

    if (DOM.addVideoModal) {
      DOM.addVideoModal.addEventListener('click', (e) => {
        if (e.target === DOM.addVideoModal) {
          DOM.addVideoModal.close();
        }
      });
    }

    if (DOM.addVideoForm) {
      DOM.addVideoForm.addEventListener('submit', handleAddVideoSubmit);
    }
  }

  // Execute on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
