// Signup JavaScript

let currentStep = 1;
const totalSteps = 4;

// Initialize signup page
document.addEventListener("DOMContentLoaded", function () {
  setupSignupForm();
  updateProgress();
});

function setupSignupForm() {
  // Handle food type change for vendor signup
  const foodTypeSelect = document.getElementById("foodType");
  const otherFoodType = document.getElementById("otherFoodType");

  if (foodTypeSelect && otherFoodType) {
    foodTypeSelect.addEventListener("change", function () {
      if (this.value === "other") {
        otherFoodType.style.display = "block";
        otherFoodType.querySelector("input").required = true;
      } else {
        otherFoodType.style.display = "none";
        otherFoodType.querySelector("input").required = false;
      }
    });
  }

  // Handle form submissions
  const vendorForm = document.getElementById("vendorSignupForm");
  const supplierForm = document.getElementById("supplierSignupForm");

  if (vendorForm) {
    vendorForm.addEventListener("submit", handleVendorSubmit);
  }

  if (supplierForm) {
    supplierForm.addEventListener("submit", handleSupplierSubmit);
  }

  // File upload handling
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const label = this.nextElementSibling;
      const fileName = this.files[0] ? this.files[0].name : "Choose File";
      label.querySelector("span").textContent = fileName;
    });
  });

  // Real-time validation
  setupValidation();
}

// Step navigation functions
function nextStep(step) {
  if (!validateCurrentStep()) {
    return;
  }

  showStep(step);
}

function prevStep(step) {
  showStep(step);
}

function showStep(step) {
  // Hide all steps
  document
    .querySelectorAll(".step")
    .forEach((s) => s.classList.remove("active"));

  // Show current step
  document.getElementById(`step${step}`).classList.add("active");

  // Update step indicators
  updateStepIndicators(step);

  // Update progress
  currentStep = step;
  updateProgress();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateStepIndicators(step) {
  const indicators = document.querySelectorAll(".step-indicator");

  indicators.forEach((indicator, index) => {
    const stepNumber = index + 1;

    if (stepNumber < step) {
      indicator.classList.add("completed");
      indicator.classList.remove("active");
    } else if (stepNumber === step) {
      indicator.classList.add("active");
      indicator.classList.remove("completed");
    } else {
      indicator.classList.remove("active", "completed");
    }
  });
}

function updateProgress() {
  const progressFill = document.getElementById("progressFill");
  const percentage = (currentStep / totalSteps) * 100;
  progressFill.style.width = `${percentage}%`;
}

// Validation functions
function setupValidation() {
  const inputs = document.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      clearError(this);
    });
  });
}

function validateField(field) {
  const inputGroup = field.closest(".input-group");
  let isValid = true;
  let errorMessage = "";

  // Remove existing error
  clearError(field);

  // Required field validation
  if (field.hasAttribute("required") && !field.value.trim()) {
    isValid = false;
    errorMessage = "This field is required";
  }

  // Specific field validations
  if (field.value.trim()) {
    switch (field.type) {
      case "email":
        if (!isValidEmail(field.value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "tel":
        if (!isValidMobileNumber(field.value)) {
          isValid = false;
          errorMessage = "Please enter a valid 10-digit mobile number";
        }
        break;
    }

    // Field-specific validations
    if (field.id === "fssaiNumber") {
      if (!isValidFSSAI(field.value)) {
        isValid = false;
        errorMessage = "Please enter a valid 14-digit FSSAI number";
      }
    }

    if (field.id === "pincode") {
      if (!isValidPincode(field.value)) {
        isValid = false;
        errorMessage = "Please enter a valid 6-digit PIN code";
      }
    }

    if (field.id === "gstNumber" && field.value) {
      if (!isValidGST(field.value)) {
        isValid = false;
        errorMessage = "Please enter a valid GST number";
      }
    }
  }

  if (!isValid) {
    showError(inputGroup, errorMessage);
  } else {
    showSuccess(inputGroup);
  }

  return isValid;
}

function validateCurrentStep() {
  const currentStepElement = document.getElementById(`step${currentStep}`);
  const fields = currentStepElement.querySelectorAll("input, select, textarea");
  let isValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  // Special validations
  if (currentStep === 4) {
    // Check if at least one product category is selected
    const checkboxes = currentStepElement.querySelectorAll(
      'input[type="checkbox"]'
    );
    const isAnyChecked = Array.from(checkboxes).some((cb) => cb.checked);

    if (!isAnyChecked) {
      showNotification("Please select at least one product category", "error");
      isValid = false;
    }
  }

  if (!isValid) {
    showNotification("Please fill all required fields correctly", "error");
  }

  return isValid;
}

function showError(inputGroup, message) {
  inputGroup.classList.add("error");
  inputGroup.classList.remove("success");

  let errorElement = inputGroup.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("span");
    errorElement.className = "error-message";
    inputGroup.appendChild(errorElement);
  }
  errorElement.textContent = message;
}

function showSuccess(inputGroup) {
  inputGroup.classList.add("success");
  inputGroup.classList.remove("error");

  const errorElement = inputGroup.querySelector(".error-message");
  if (errorElement) {
    errorElement.remove();
  }
}

function clearError(field) {
  const inputGroup = field.closest(".input-group");
  inputGroup.classList.remove("error", "success");

  const errorElement = inputGroup.querySelector(".error-message");
  if (errorElement) {
    errorElement.remove();
  }
}

// Validation helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidMobileNumber(mobile) {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile.replace(/\D/g, ""));
}

function isValidFSSAI(fssai) {
  const fssaiRegex = /^\d{14}$/;
  return fssaiRegex.test(fssai.replace(/\D/g, ""));
}

function isValidPincode(pincode) {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode.replace(/\D/g, ""));
}

function isValidGST(gst) {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst.toUpperCase());
}

// Get current location
function getCurrentLocation() {
  if (!navigator.geolocation) {
    showNotification("Geolocation is not supported by this browser", "error");
    return;
  }

  showNotification("Getting your location...", "info");

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Use reverse geocoding to get address
      reverseGeocode(lat, lng);
    },
    function (error) {
      let message = "Unable to get your location";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = "Location access denied by user";
          break;
        case error.POSITION_UNAVAILABLE:
          message = "Location information is unavailable";
          break;
        case error.TIMEOUT:
          message = "Location request timed out";
          break;
      }
      showNotification(message, "error");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

function reverseGeocode(lat, lng) {
  // Simulated reverse geocoding - in real app, use Google Maps API or similar
  const mockAddress = {
    address: "123 Main Street, Commercial Area",
    city: "Mumbai",
    pincode: "400001",
  };

  // Fill form fields
  const addressField = document.getElementById("address");
  const cityField = document.getElementById("city");
  const pincodeField = document.getElementById("pincode");

  if (addressField) addressField.value = mockAddress.address;
  if (cityField) cityField.value = mockAddress.city;
  if (pincodeField) pincodeField.value = mockAddress.pincode;

  showNotification("Location filled successfully!", "success");
}

// Form submission handlers
function handleVendorSubmit(e) {
  e.preventDefault();

  if (!validateCurrentStep()) {
    return;
  }

  const formData = new FormData(e.target);
  const vendorData = Object.fromEntries(formData.entries());

  // Get checked products
  const checkedProducts = Array.from(
    document.querySelectorAll('input[name="products"]:checked')
  ).map((cb) => cb.value);
  vendorData.products = checkedProducts;

  submitVendorRegistration(vendorData);
}

function handleSupplierSubmit(e) {
  e.preventDefault();

  if (!validateCurrentStep()) {
    return;
  }

  const formData = new FormData(e.target);
  const supplierData = Object.fromEntries(formData.entries());

  // Get checked categories
  const checkedCategories = Array.from(
    document.querySelectorAll('input[name="categories"]:checked')
  ).map((cb) => cb.value);
  supplierData.categories = checkedCategories;

  submitSupplierRegistration(supplierData);
}

function submitVendorRegistration(data) {
  const form = document.getElementById("vendorSignupForm");
  form.classList.add("form-submitting");

  showNotification("Creating your vendor account...", "info");

  // Simulate API call
  setTimeout(() => {
    form.classList.remove("form-submitting");
    showNotification(
      "Registration successful! Welcome to Annapurna Connect!",
      "success"
    );

    // Store user data for success page (temporary)
    localStorage.setItem("signupUserType", "vendor");
    localStorage.setItem("signupUserName", data.fullName);
    localStorage.setItem("signupUserMobile", data.mobile || "");

    // Redirect to success page instead of dashboard
    setTimeout(() => {
      window.location.replace("signup-success.html");
    }, 1500);
  }, 3000);
}

function submitSupplierRegistration(data) {
  const form = document.getElementById("supplierSignupForm");
  form.classList.add("form-submitting");

  showNotification("Creating your supplier account...", "info");

  // Simulate API call
  setTimeout(() => {
    form.classList.remove("form-submitting");
    showNotification(
      "Registration submitted! We will verify your documents and get back to you within 24 hours.",
      "success"
    );

    // Store user data for success page (temporary)
    localStorage.setItem("signupUserType", "supplier");
    localStorage.setItem("signupUserName", data.ownerName);
    localStorage.setItem("signupUserMobile", data.mobile || "");

    // Redirect to success page instead of verification pending
    setTimeout(() => {
      window.location.replace("signup-success.html");
    }, 1500);
  }, 3000);
}

// Auto-format inputs
document.addEventListener("input", function (e) {
  const target = e.target;

  // Format mobile number
  if (target.type === "tel") {
    let value = target.value.replace(/\D/g, "");
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    target.value = value;
  }

  // Format PIN code
  if (target.id === "pincode") {
    let value = target.value.replace(/\D/g, "");
    if (value.length > 6) {
      value = value.substring(0, 6);
    }
    target.value = value;
  }

  // Format FSSAI number
  if (target.id === "fssaiNumber") {
    let value = target.value.replace(/\D/g, "");
    if (value.length > 14) {
      value = value.substring(0, 14);
    }
    target.value = value;
  }

  // Format GST number
  if (target.id === "gstNumber") {
    target.value = target.value.toUpperCase();
  }
});

// Handle keyboard navigation
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.target.matches("textarea")) {
    e.preventDefault();

    // Find next input field
    const inputs = Array.from(
      document.querySelectorAll(
        "#step" +
          currentStep +
          " input, #step" +
          currentStep +
          " select, #step" +
          currentStep +
          " textarea"
      )
    );
    const currentIndex = inputs.indexOf(e.target);

    if (currentIndex < inputs.length - 1) {
      inputs[currentIndex + 1].focus();
    } else if (currentStep < totalSteps) {
      nextStep(currentStep + 1);
    } else {
      // Submit form
      const form = document.querySelector(
        "#vendorSignupForm, #supplierSignupForm"
      );
      if (form) {
        form.dispatchEvent(new Event("submit"));
      }
    }
  }
});

// Save form data to localStorage for persistence
function saveFormData() {
  const forms = document.querySelectorAll(
    "#vendorSignupForm, #supplierSignupForm"
  );

  forms.forEach((form) => {
    if (form) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      localStorage.setItem("signupFormData", JSON.stringify(data));
    }
  });
}

// Load saved form data
function loadFormData() {
  const savedData = localStorage.getItem("signupFormData");

  if (savedData) {
    const data = JSON.parse(savedData);

    Object.keys(data).forEach((key) => {
      const field =
        document.getElementById(key) ||
        document.querySelector(`[name="${key}"]`);
      if (field) {
        field.value = data[key];
      }
    });
  }
}

// Save data on input change
document.addEventListener("change", saveFormData);

// Load data on page load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(loadFormData, 100);
});

// Clear saved data on successful submission
function clearSavedData() {
  localStorage.removeItem("signupFormData");
}

// Handle page refresh/close
window.addEventListener("beforeunload", function (e) {
  if (currentStep > 1) {
    e.preventDefault();
    e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    return e.returnValue;
  }
});

// Progress indicator click navigation
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("step-indicator")) {
    const targetStep = parseInt(e.target.dataset.step);

    // Only allow going to completed steps or current step
    if (targetStep <= currentStep) {
      showStep(targetStep);
    }
  }
});

// Initialize tooltips for help text
function initializeTooltips() {
  const helpIcons = document.querySelectorAll(".help-icon");

  helpIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      const tooltip = this.querySelector(".tooltip");
      if (tooltip) {
        tooltip.style.display = "block";
      }
    });

    icon.addEventListener("mouseleave", function () {
      const tooltip = this.querySelector(".tooltip");
      if (tooltip) {
        tooltip.style.display = "none";
      }
    });
  });
}

// Call on page load
document.addEventListener("DOMContentLoaded", initializeTooltips);
