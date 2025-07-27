// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// Initialize App
function initializeApp() {
  setupNavigation();
  setupModals();
  setupForms();
  setupScrollAnimations();
  setupMobileMenu();
}

// Navigation Setup
function setupNavigation() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Navbar background on scroll
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
    }
  });
}

// Mobile Menu Setup
function setupMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }
}

// Modal Functions
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    // Add fade-in animation
    setTimeout(() => {
      modal.querySelector(".modal-content").classList.add("fade-in-up");
    }, 10);
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    modal.querySelector(".modal-content").classList.remove("fade-in-up");
  }
}

// Setup Modal Events
function setupModals() {
  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
      const modalId = event.target.id;
      hideModal(modalId);
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      const openModal = document.querySelector('.modal[style*="block"]');
      if (openModal) {
        hideModal(openModal.id);
      }
    }
  });
}

// Form Setup
function setupForms() {
  // Login Form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleLogin();
    });
  }

  // OTP Form
  const otpForm = document.getElementById("otpForm");
  if (otpForm) {
    otpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleOTPVerification();
    });
  }

  // OTP Input Auto-focus
  setupOTPInputs();
}

// OTP Inputs Setup
function setupOTPInputs() {
  const otpInputs = document.querySelectorAll(".otp-digit");

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", function (e) {
      const value = e.target.value;

      if (value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }

      if (value.length === 0 && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && e.target.value === "" && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    input.addEventListener("paste", function (e) {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text");
      const pasteArray = pasteData.split("").slice(0, 6);

      pasteArray.forEach((digit, i) => {
        if (otpInputs[i]) {
          otpInputs[i].value = digit;
        }
      });

      if (pasteArray.length < 6) {
        otpInputs[pasteArray.length].focus();
      }
    });
  });
}

// Login Handler
function handleLogin() {
  const nameInput = document.getElementById("loginName");
  const mobileInput = document.getElementById("loginMobile");
  const name = nameInput.value.trim();
  const mobile = mobileInput.value.trim();

  if (!name) {
    showNotification("Please enter your name", "error");
    return;
  }

  if (!mobile) {
    showNotification("Please enter your mobile number", "error");
    return;
  }

  if (!isValidMobileNumber(mobile)) {
    showNotification("Please enter a valid mobile number", "error");
    return;
  }

  // Simulate OTP sending
  showNotification("Sending OTP...", "info");

  setTimeout(() => {
    document.getElementById("otpMobile").textContent = mobile;
    hideModal("loginModal");
    showModal("otpModal");
    showNotification("OTP sent successfully!", "success");
  }, 1500);
}

// OTP Verification Handler
function handleOTPVerification() {
  const otpInputs = document.querySelectorAll(".otp-digit");
  const otp = Array.from(otpInputs)
    .map((input) => input.value)
    .join("");

  if (otp.length !== 6) {
    showNotification("Please enter complete OTP", "error");
    return;
  }

  // Simulate OTP verification
  showNotification("Verifying OTP...", "info");

  setTimeout(() => {
    hideModal("otpModal");
    showNotification("Login successful! Redirecting...", "success");

    // Store temporary user data (in real app, this would come from server)
    const userName = document.getElementById("loginName").value;
    const mobileNumber = document.getElementById("loginMobile").value;
    localStorage.setItem("userName", userName);
    localStorage.setItem("userType", "vendor");
    localStorage.setItem("mobileNumber", mobileNumber);

    // Simulate redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2000);
  }, 1500);
}

// Utility Functions
function isValidMobileNumber(mobile) {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
}

// Start Journey Function
function startJourney(userType) {
  if (userType === "vendor") {
    showNotification("Redirecting to vendor registration...", "info");
    setTimeout(() => {
      window.location.href = "vendor-signup.html";
    }, 1500);
  } else if (userType === "supplier") {
    showNotification("Redirecting to supplier registration...", "info");
    setTimeout(() => {
      window.location.href = "supplier-signup.html";
    }, 1500);
  }
}

// Process Tab Switching
function showProcess(type) {
  // Remove active class from all tabs and contents
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".process-content")
    .forEach((content) => content.classList.remove("active"));

  // Add active class to selected tab and content
  event.target.classList.add("active");
  document.getElementById(type + "-process").classList.add("active");
}

// Signup Function
function showSignup() {
  hideModal("loginModal");
  showNotification("Redirecting to signup...", "info");
  setTimeout(() => {
    window.location.href = "signup.html";
  }, 1000);
}

// Resend OTP Function
function resendOTP() {
  showNotification("Resending OTP...", "info");
  setTimeout(() => {
    showNotification("OTP sent successfully!", "success");
  }, 1500);
}

// Contact Form Handler
function handleContactForm() {
  const form = document.getElementById("contactForm");
  const formData = {
    name: document.getElementById("contactName").value.trim(),
    email: document.getElementById("contactEmail").value.trim(),
    phone: document.getElementById("contactPhone").value.trim(),
    subject: document.getElementById("contactSubject").value,
    message: document.getElementById("contactMessage").value.trim(),
  };

  // Validate form data
  if (
    !formData.name ||
    !formData.email ||
    !formData.phone ||
    !formData.subject ||
    !formData.message
  ) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  if (!isValidEmail(formData.email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  if (!isValidMobileNumber(formData.phone)) {
    showNotification("Please enter a valid phone number", "error");
    return;
  }

  // Show sending message
  showNotification("Sending your message...", "info");

  // Disable form while sending
  form.style.opacity = "0.7";
  form.style.pointerEvents = "none";

  // Simulate sending contact form
  setTimeout(() => {
    form.style.opacity = "1";
    form.style.pointerEvents = "auto";

    showNotification(
      "Thank you! Your message has been sent successfully. We'll get back to you soon!",
      "success"
    );

    // Reset form
    form.reset();
  }, 2000);
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        min-width: 300px;
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 10);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle";
    case "error":
      return "fa-exclamation-circle";
    case "warning":
      return "fa-exclamation-triangle";
    default:
      return "fa-info-circle";
  }
}

function getNotificationColor(type) {
  switch (type) {
    case "success":
      return "#28a745";
    case "error":
      return "#dc3545";
    case "warning":
      return "#ffc107";
    default:
      return "#17a2b8";
  }
}

// Scroll Animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  // Observe elements
  document.querySelectorAll(".feature-card, .step, .stat").forEach((el) => {
    observer.observe(el);
  });
}

// Counter Animation
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }

  updateCounter();
}

// Initialize counter animations when stats come into view
function initializeCounters() {
  const stats = document.querySelectorAll(".stat h3");
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.textContent.replace(/[^\d]/g, ""));
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  });

  stats.forEach((stat) => observer.observe(stat));
}

// Initialize counters when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(initializeCounters, 1000);
});

// Preloader (optional)
window.addEventListener("load", function () {
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }
});

// Error handling
window.addEventListener("error", function (e) {
  console.error("An error occurred:", e.error);
  showNotification("Something went wrong. Please try again.", "error");
});

// Service Worker Registration (for PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log("ServiceWorker registration successful");
      })
      .catch(function (err) {
        console.log("ServiceWorker registration failed");
      });
  });
}
