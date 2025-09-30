  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-menu');
  const searchInput = document.getElementById("search-input");
  const searchForm = document.getElementById("search-form");
  const cards = document.querySelectorAll('.card');
  const contact = document.getElementById('contact');
  const about = document.getElementById('about');
  const feedback = document.getElementById('feedback');
  const subscribe = document.getElementById('subscribe');
  const videos = document.getElementById('videos');
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  let startX = 0; // For swipe feature
  let endX = 0;

  // ---------------- MENU TOGGLE ----------------
  function toggleNav() {
    const isShowing = nav.classList.toggle('show');
    toggle.classList.toggle('active', isShowing);
    toggle.setAttribute("aria-expanded", isShowing);
    document.body.style.overflow = isShowing ? 'hidden' : 'auto';
  }

  toggle.addEventListener('click', (e) => {
    toggleNav();
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('show') && !nav.contains(e.target) && e.target !== toggle) {
      toggleNav();
    }
  });

  nav.addEventListener('click', e => {
    if (e.target.tagName === "A") {
      toggleNav();
    }
  });

  // ---------------- SWIPE GESTURE ----------------
  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  document.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const swipeThreshold = 50; // Minimum distance for a swipe

    const screenWidth = window.innerWidth;
    const swipeArea = screenWidth * 0.2; // 20% of the right side of the screen

    // Swipe from right to left to open menu
    if (startX > (screenWidth - swipeArea) && diffX > swipeThreshold && !nav.classList.contains('show')) {
        toggleNav();
    }
    // Swipe from left to right to close menu
    else if (nav.classList.contains('show') && endX > swipeThreshold && diffX < -swipeThreshold) {
        toggleNav();
    }
  });

  // ---------------- SCROLL ANIMATION ----------------
  function animateOnScroll() {
    const triggerBottom = window.innerHeight * 0.9;
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        card.classList.add('show');
      }
    });
    [contact, about, feedback, subscribe, videos].forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        section.classList.add('show');
      }
    });

    // Show/hide scroll to top button
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  }

  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', () => {
    animateOnScroll();
    // Loader fade-out
    const loader = document.getElementById('loader-wrapper');
    setTimeout(() => loader.classList.add('fade-out'), 1000);
  });

  // ---------------- SECTION TOGGLE ----------------
  let currentSection = null;
  document.querySelectorAll('#about-btn, footer a[href="#about"]').forEach(el => {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      toggleSectionVisibility('about');
    });
  });

  document.querySelectorAll('#contact-btn, footer a[href^="tel"]').forEach(el => {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      toggleSectionVisibility('contact');
    });
  });
  
  document.getElementById('videos-btn').addEventListener('click', function(e) {
    e.preventDefault();
    toggleSectionVisibility('videos');
  });

  document.getElementById('feedback-btn').addEventListener('click', function(e) {
      e.preventDefault();
      toggleSectionVisibility('feedback');
  });

  document.getElementById('subscribe-btn').addEventListener('click', function(e) {
    e.preventDefault();
    toggleSectionVisibility('subscribe');
  });

  function toggleSectionVisibility(sectionId) {
    const section = document.getElementById(sectionId);
    [contact, about, feedback, subscribe, videos].forEach(s => {
      s.style.display = 'none';
      if (s.classList.contains('show')) s.classList.remove('show');
    });

    if (currentSection === sectionId) {
      currentSection = null;
    } else {
      section.style.display = 'block';
      setTimeout(() => section.classList.add('show'), 10);
      section.scrollIntoView({ behavior: 'smooth' });
      currentSection = sectionId;
    }
  }

  // ---------------- SHARE BUTTON ----------------
  function sharePage() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: "Check out this amazing web app: HackSpherix!",
        url: window.location.href
      }).catch(console.error);
    } else {
      alert("Sharing not supported on this browser.");
    }
  }
  window.sharePage = sharePage;

  // ---------------- EXPANDABLE SECTIONS ----------------
  function toggleSection(id) {
    const section = document.getElementById(id);
    section.classList.toggle("active");

    // Update the button text
    const buttons = document.querySelectorAll(`a.btn[onclick="toggleSection('${id}')"]`);
    buttons.forEach(button => {
      button.textContent = section.classList.contains("active") ? "Show Less" : "Read More";
    });

    if (section.classList.contains("active")) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  window.toggleSection = toggleSection;

  // ---------------- BLOCK SHORTCUTS ----------------
  document.onkeydown = function(e) {
    if (e.ctrlKey && ['c', 'u', 's', 'a'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      return false;
    }
  };

  document.addEventListener('selectstart', e => e.preventDefault());

  // ---------------- SEARCH WITH FIXED LOGIC ----------------
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value.toLowerCase().trim();
    let matchFound = false;

    // Remove old highlights
    document.querySelectorAll("mark").forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });

    // Remove old 404 if exists
    const old404 = document.getElementById("no-results");
    if (old404) old404.remove();

    if (query !== "") {
      document.querySelectorAll("section, .card.expandable").forEach(section => {
        const text = section.innerText.toLowerCase();
        if (text.includes(query)) {
          matchFound = true;

          // If expandable card matched → expand it
          if (section.classList.contains("expandable") && !section.classList.contains("active")) {
            section.classList.add("active");
          }

          // Highlight matches
          const regex = new RegExp(query, "gi");
          section.innerHTML = section.innerHTML.replace(
            regex,
            match => `<mark style="background:#3300ff; box-shadow: 0 0 20px #3131314d; color:#fff; padding: 1px 8px;">${match}</mark>`
          );

          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      if (!matchFound) {
        // Create full-screen 404 overlay
        const noResult = document.createElement("div");
        noResult.id = "no-results";
        noResult.innerHTML = `<h2>404</h2><p>Not Found</p>`;
        document.body.appendChild(noResult);

        // Hide main content
        document.body.style.overflow = 'hidden';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            noResult.classList.add('fade-out');
            document.body.style.overflow = 'auto';
            setTimeout(() => noResult.remove(), 500); // Remove from DOM after transition
        }, 2000);
      }
    }
    nav.classList.remove("show");
    searchInput.blur();
  });

  // ---------------- CLEAR SEARCH RESET ----------------
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim().toLowerCase();
    if (query === "") {
      // Remove highlights
      document.querySelectorAll("mark").forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
      });

      // Remove 404 if exists
      const old404 = document.getElementById("no-results");
      if (old404) old404.remove();

      // Show all sections & footer again
      document.querySelectorAll("section, footer").forEach(el => {
        el.style.display = "block";
      });

      // Reset About/Contact hidden by default
      about.style.display = "none";
      contact.style.display = "none";
      feedback.style.display = "none";
      subscribe.style.display = "none";
      videos.style.display = "none";
    }
  });

  // ---------------- SCROLL TO TOP ----------------
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.scrollToTop = scrollToTop;

  // ---------------- FORM SUBMISSION FIX ----------------
  document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the default form submission

    const form = event.target;
    const statusMessage = document.getElementById('feedback-message-status');

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        statusMessage.textContent = "Feedback submitted successfully!";
        statusMessage.style.display = 'block';
        form.reset(); // Clear the form fields
      } else {
        statusMessage.textContent = "Oops! There was a problem submitting your feedback.";
        statusMessage.style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      statusMessage.textContent = "Oops! There was a problem submitting your feedback. Please try again later.";
      statusMessage.style.display = 'block';
    });
  });

  document.getElementById('subscribe-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the default form submission

    const form = event.target;
    const statusMessage = document.getElementById('subscribe-message-status');

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        statusMessage.textContent = "Subscribed successfully!";
        statusMessage.style.display = 'block';
        form.reset(); // Clear the form fields
      } else {
        statusMessage.textContent = "Oops! There was a problem with your subscription.";
        statusMessage.style.display = 'block';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      statusMessage.textContent = "Oops! There was a problem with your subscription. Please try again later.";
      statusMessage.style.display = 'block';
    });
  });
  
  // ---------------- VIDEO CONTROL ----------------
  function pauseOtherVideos(currentVideo) {
      document.querySelectorAll('video').forEach(video => {
          if (video !== currentVideo && !video.paused) {
              video.pause();
          }
      });
  }
  window.pauseOtherVideos = pauseOtherVideos;
