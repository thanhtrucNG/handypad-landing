/* ===== Shared language helpers ===== */
const __HANDYPAD_LANG = (document.documentElement.lang || "en").toLowerCase().startsWith("vi") ? "vi" : "en";
const __handypadText = (en, vi) => __HANDYPAD_LANG === "vi" ? vi : en;
const __handypadOptionLabel = value => {
  const key = String(value || "").toLowerCase();
  if (__HANDYPAD_LANG !== "vi") return value;
  if (key === "standard") return "Tiêu chuẩn";
  if (key === "reflective") return "Phản quang";
  return value;
};
const __handypadColorLabel = value => (__HANDYPAD_LANG === "vi" && String(value).toLowerCase() === "orange") ? "Màu cam" : value;
const __handypadVariantShort = variant => {
  if (__HANDYPAD_LANG !== "vi") return variant.label.replace(/^HANDYPAD\s+/, "");
  return variant.option === "Reflective" ? `${variant.size} + Phản quang` : `${variant.size} – Tiêu chuẩn`;
};
const __handypadVariantFull = variant => __HANDYPAD_LANG === "vi" ? `HANDYPAD ${__handypadVariantShort(variant)}` : variant.label;

/* ===== Extracted script block 1 ===== */
window.__HANDYPAD_V16_MEDIA = {
  media1: "../assets/images/handypad-gallery-01.webp",
  media2: "../assets/images/handypad-gallery-02.webp",
  media3: "../assets/images/handypad-gallery-03.webp",
  media4: "../assets/images/handypad-gallery-04.png",
  media5: "../assets/images/handypad-gallery-05.webp",
  media6: "../assets/images/handypad-gallery-06.webp",
  media7: "../assets/images/handypad-gallery-07.webp",
  media8: "../assets/images/handypad-gallery-08.webp",
  media9: "../assets/images/handypad-gallery-09.webp"
};


/* ===== Extracted script block 2 ===== */
(() => {
      const products = {
        single: {src: "../assets/images/handypad-showcase-single.png", alt: __handypadText("Orange Single HANDYPAD, 24 by 10 by 5 centimetres", "HANDYPAD Single màu cam, kích thước 24 × 10 × 5 cm")},
        double: {src: "../assets/images/handypad-showcase-double.png", alt: __handypadText("Orange Double HANDYPAD, 24 by 20 by 5 centimetres", "HANDYPAD Double màu cam, kích thước 24 × 20 × 5 cm")}
      };
      const order = Object.keys(products);
      const stage = document.getElementById("showcase-stage");
      const image = document.getElementById("showcase-image");
      const badge = document.getElementById("showcase-badge");
      const sizeButtons = [...document.querySelectorAll("[data-size]")];
      const optionButtons = [...document.querySelectorAll("[data-lead-option]")];
      let size = "single";
      let option = "standard";
      let index = 0;
      let timer;

      const updateLeadShowcaseButtons = () => {
        sizeButtons.forEach(button => button.classList.toggle("is-active", button.dataset.size === size));
        optionButtons.forEach(button => button.classList.toggle("is-active", button.dataset.leadOption === option));
      };

      const showProduct = (nextSize) => {
        const product = products[nextSize];
        if (!product) return;
        size = nextSize;
        index = order.indexOf(size);
        stage.classList.add("is-changing");
        window.setTimeout(() => {
          image.src = product.src;
          image.alt = product.alt;
          badge.textContent = __HANDYPAD_LANG === "vi" ? `${__handypadOptionLabel(option).toUpperCase()} · ${size.toUpperCase()}` : `${option.toUpperCase()} · ${size.toUpperCase()}`;
          updateLeadShowcaseButtons();
          stage.classList.remove("is-changing");
        }, 180);
      };

      const startRotation = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => {
          index = (index + 1) % order.length;
          showProduct(order[index]);
        }, 3600);
      };

      sizeButtons.forEach(button => button.addEventListener("click", () => {
        showProduct(button.dataset.size);
        window.clearInterval(timer);
      }));
      optionButtons.forEach(button => button.addEventListener("click", () => {
        option = button.dataset.leadOption;
        badge.textContent = __HANDYPAD_LANG === "vi" ? `${__handypadOptionLabel(option).toUpperCase()} · ${size.toUpperCase()}` : `${option.toUpperCase()} · ${size.toUpperCase()}`;
        updateLeadShowcaseButtons();
        window.clearInterval(timer);
      }));
      updateLeadShowcaseButtons();
      startRotation();

      const form = document.getElementById("enquiry-form");
      const nameField = document.getElementById("lead-name");
      const emailField = document.getElementById("lead-email");
      const phoneField = document.getElementById("lead-phone");
      const status = document.getElementById("form-status");
      const submitPopup = document.getElementById("submit-popup");
      const submitPopupClose = document.getElementById("submit-popup-close");
      const submitPopupCountdown = document.getElementById("submit-popup-countdown");
      let statusCountdownTimer;

      const expand = () => form.classList.add("is-expanded");
      [nameField, phoneField].forEach(field => {
        field.addEventListener("focus", expand, {once: true});
        field.addEventListener("input", expand, {once: true});
      });

      const directContactButton = document.getElementById("direct-contact");
      const contactPopup = document.getElementById("contact-popup");
      const contactPopupClose = document.getElementById("contact-popup-close");
      const contactLinks = [...document.querySelectorAll("[data-track-event]")];
      let lastContactTrigger = null;

      const trackContactEvent = (eventName) => {
        window.dispatchEvent(new CustomEvent("handypad:track", {detail: {event: eventName}}));
        if (Array.isArray(window.dataLayer)) window.dataLayer.push({event: eventName});
      };

      const openContactPopup = () => {
        lastContactTrigger = document.activeElement;
        contactPopup.hidden = false;
        requestAnimationFrame(() => contactPopup.classList.add("is-visible"));
        contactPopupClose.focus();
        trackContactEvent("direct_contact_open");
      };

      const closeContactPopup = () => {
        contactPopup.classList.remove("is-visible");
        window.setTimeout(() => {
          contactPopup.hidden = true;
          if (lastContactTrigger && typeof lastContactTrigger.focus === "function") lastContactTrigger.focus();
        }, 220);
      };

      directContactButton.dataset.trackEvent = "direct_contact_open";
      directContactButton.addEventListener("click", openContactPopup);
      contactPopupClose.addEventListener("click", closeContactPopup);
      contactPopup.addEventListener("click", event => {
        if (event.target === contactPopup) closeContactPopup();
      });
      contactLinks.forEach(link => link.addEventListener("click", () => trackContactEvent(link.dataset.trackEvent)));

      const isValidPhone = value => {
        const trimmed = value.trim();
        if (!trimmed) return false;
        if (!/^\+?[0-9\s().-]+$/.test(trimmed)) return false;
        const digits = trimmed.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 15;
      };

      const showInlineError = (message, field) => {
        status.hidden = false;
        status.className = "form-status is-error";
        status.textContent = message;
        field?.classList.add("is-invalid");
        field?.focus();
      };

      [nameField, phoneField, emailField].forEach(field => {
        field.addEventListener("input", () => {
          field.classList.remove("is-invalid");
          if (!status.hidden && status.classList.contains("is-error")) status.hidden = true;
        });
      });

      const closeSubmitPopup = () => {
        window.clearInterval(statusCountdownTimer);
        submitPopup.classList.remove("is-visible");
        window.setTimeout(() => {
          submitPopup.hidden = true;
        }, 220);
      };

      submitPopupClose.addEventListener("click", closeSubmitPopup);
      submitPopup.addEventListener("click", event => {
        if (event.target === submitPopup) closeSubmitPopup();
      });
      document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        if (!contactPopup.hidden) {
          closeContactPopup();
          return;
        }
        if (!submitPopup.hidden) closeSubmitPopup();
      });

      const showSubmitPopup = () => {
        window.clearInterval(statusCountdownTimer);
        let secondsRemaining = 10;
        const updateCountdown = () => {
          submitPopupCountdown.textContent = __HANDYPAD_LANG === "vi" ? `Tự động đóng sau ${secondsRemaining} giây.` : `Closing automatically in ${secondsRemaining} second${secondsRemaining === 1 ? "" : "s"}.`;
        };
        updateCountdown();
        submitPopup.hidden = false;
        requestAnimationFrame(() => submitPopup.classList.add("is-visible"));
        submitPopupClose.focus();

        statusCountdownTimer = window.setInterval(() => {
          secondsRemaining -= 1;
          if (secondsRemaining > 0) {
            updateCountdown();
            return;
          }
          closeSubmitPopup();
        }, 1000);
      };

      form.addEventListener("submit", event => {
        event.preventDefault();
        window.clearInterval(statusCountdownTimer);
        expand();

        const nameValue = nameField.value.trim();
        const phoneValue = phoneField.value.trim();
        const emailValue = emailField.value.trim();

        if (!nameValue) {
          showInlineError(__handypadText("Please enter your name.", "Vui lòng nhập họ tên."), nameField);
          return;
        }

        if (!phoneValue) {
          showInlineError(__handypadText("Please enter your phone / WhatsApp number.", "Vui lòng nhập SĐT / WhatsApp."), phoneField);
          return;
        }

        if (!isValidPhone(phoneValue)) {
          showInlineError(__handypadText("Please enter a valid phone / WhatsApp number using 8–15 digits. Only +, spaces, brackets and hyphens are allowed.", "Vui lòng nhập SĐT / WhatsApp hợp lệ gồm 8–15 chữ số. Có thể dùng +, khoảng trắng, ngoặc hoặc dấu gạch ngang."), phoneField);
          return;
        }

        if (emailValue && !emailField.checkValidity()) {
          showInlineError(__handypadText("Please enter a valid email address or leave the email field blank.", "Vui lòng nhập email hợp lệ hoặc để trống."), emailField);
          return;
        }

        status.hidden = true;
        status.className = "form-status";

        // Keep the existing no-reload front-end workflow. Replace this point with
        // a real fetch()/CRM endpoint when the production lead destination is connected.
        form.reset();
        [nameField, phoneField, emailField].forEach(field => field.classList.remove("is-invalid"));
        showSubmitPopup();
      });

      const faqButtons = [...document.querySelectorAll(".faq-question")];
      faqButtons.forEach(button => button.addEventListener("click", () => {
        const shouldOpen = button.getAttribute("aria-expanded") !== "true";
        faqButtons.forEach(otherButton => {
          const answer = document.getElementById(otherButton.getAttribute("aria-controls"));
          const icon = otherButton.querySelector(".faq-icon");
          otherButton.setAttribute("aria-expanded", "false");
          answer.hidden = true;
          icon.textContent = "+";
        });
        if (shouldOpen) {
          const answer = document.getElementById(button.getAttribute("aria-controls"));
          button.setAttribute("aria-expanded", "true");
          answer.hidden = false;
          button.querySelector(".faq-icon").textContent = "−";
        }
      }));

      const faqGalleryImages = [...document.querySelectorAll(".faq-gallery-img")];
      const faqGalleryDots = [...document.querySelectorAll(".faq-gallery-dot")];
      let faqGalleryIndex = 0;
      const showFaqGalleryImage = (index) => {
        faqGalleryImages[faqGalleryIndex].classList.remove("active");
        faqGalleryDots[faqGalleryIndex]?.classList.remove("active");
        faqGalleryDots[faqGalleryIndex]?.setAttribute("aria-current", "false");
        faqGalleryIndex = index;
        faqGalleryImages[faqGalleryIndex].classList.add("active");
        faqGalleryDots[faqGalleryIndex]?.classList.add("active");
        faqGalleryDots[faqGalleryIndex]?.setAttribute("aria-current", "true");
      };
      const nextFaqGalleryImage = () => {
        if (faqGalleryImages.length < 2) return;
        showFaqGalleryImage((faqGalleryIndex + 1) % faqGalleryImages.length);
      };
      let faqGalleryTimer;
      const restartFaqGalleryTimer = () => {
        window.clearInterval(faqGalleryTimer);
        if (faqGalleryImages.length > 1) faqGalleryTimer = setInterval(nextFaqGalleryImage, 4000);
      };
      faqGalleryDots.forEach((dot, index) => dot.addEventListener("click", () => {
        showFaqGalleryImage(index);
        restartFaqGalleryTimer();
      }));
      restartFaqGalleryTimer();
    })();


/* ===== Extracted script block 3 ===== */
(function () {
      var progressButton = document.getElementById('whatsapp-progress');
      var progressFrame = 0;
      function updateScrollProgress() {
        progressFrame = 0;
        if (!progressButton) return;
        var root = document.documentElement;
        var scrollable = Math.max(1, root.scrollHeight - window.innerHeight);
        var ratio = Math.max(0, Math.min(1, window.scrollY / scrollable));
        progressButton.style.setProperty('--scroll-progress', (ratio * 360) + 'deg');
      }
      function requestScrollProgressUpdate() {
        if (!progressFrame) progressFrame = window.requestAnimationFrame(updateScrollProgress);
      }
      window.addEventListener('scroll', requestScrollProgressUpdate, {passive: true});
      window.addEventListener('resize', requestScrollProgressUpdate);
      updateScrollProgress();

      function hydrateValuePropImages() {
        var sources = [
          window.__HANDYPAD_V16_MEDIA.media1,
          window.__HANDYPAD_V16_MEDIA.media2,
          window.__HANDYPAD_V16_MEDIA.media3
        ];
        document.querySelectorAll('[data-value-image]').forEach(function (img, index) {
          if (sources[index]) img.src = sources[index];
        });
      }

      function initValueGallery() {
        var images = Array.from(document.querySelectorAll('.value-gallery-img'));
        var dots = Array.from(document.querySelectorAll('.value-gallery-dot'));
        if (images.length < 2 || dots.length !== images.length) return;

        var activeIndex = 0;
        var timer = 0;

        function showValueImage(index) {
          activeIndex = (index + images.length) % images.length;
          images.forEach(function (image, imageIndex) {
            image.classList.toggle('is-active', imageIndex === activeIndex);
          });
          dots.forEach(function (dot, dotIndex) {
            var isActive = dotIndex === activeIndex;
            dot.classList.toggle('is-active', isActive);
            if (isActive) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
          });
        }

        function restartValueGallery() {
          window.clearInterval(timer);
          timer = window.setInterval(function () {
            showValueImage(activeIndex + 1);
          }, 4000);
        }

        dots.forEach(function (dot, dotIndex) {
          dot.addEventListener('click', function () {
            showValueImage(dotIndex);
            restartValueGallery();
          });
        });

        showValueImage(0);
        restartValueGallery();
      }

      function prepareValuePropSection() {
        hydrateValuePropImages();
        initValueGallery();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', prepareValuePropSection, {once: true});
      } else {
        prepareValuePropSection();
      }
    })();


/* ===== Extracted script block 4 ===== */
(function () {
      const handypadVariants = {
        single_standard: {size: "Single", option: "Standard", dimension: "24 × 10 × 5 cm", color: "Orange", price: 550000, label: "HANDYPAD Standard Single"},
        double_standard: {size: "Double", option: "Standard", dimension: "24 × 20 × 5 cm", color: "Orange", price: 1050000, label: "HANDYPAD Standard Double"},
        single_reflective: {size: "Single", option: "Reflective", dimension: "24 × 10 × 5 cm", color: "Orange", price: 600000, label: "HANDYPAD Single + Reflective"},
        double_reflective: {size: "Double", option: "Reflective", dimension: "24 × 20 × 5 cm", color: "Orange", price: 1100000, label: "HANDYPAD Double + Reflective"}
      };

      const rfqMedia = {
        media1: window.__HANDYPAD_V16_MEDIA.media1,
        media2: window.__HANDYPAD_V16_MEDIA.media2,
        media3: window.__HANDYPAD_V16_MEDIA.media3,
        media4: window.__HANDYPAD_V16_MEDIA.media4,
        media5: window.__HANDYPAD_V16_MEDIA.media5,
        media6: window.__HANDYPAD_V16_MEDIA.media6,
        media7: window.__HANDYPAD_V16_MEDIA.media7,
        media8: window.__HANDYPAD_V16_MEDIA.media8,
        media9: window.__HANDYPAD_V16_MEDIA.media9
      };

      const mediaAlts = {
        media1: __handypadText('HANDYPAD campaign visual — make impact hazards more visible', 'HANDYPAD giúp điểm va chạm dễ nhận diện hơn'),
        media2: __handypadText('HANDYPAD campaign visual — protect without complicated installation', 'HANDYPAD bảo vệ nhanh, không lắp đặt phức tạp'),
        media3: __handypadText('HANDYPAD campaign visual — reuse across changing sites', 'HANDYPAD tái sử dụng tại nhiều khu vực'),
        media4: __handypadText('HANDYPAD Single and Double technical dimensions — 24 cm length, 10 or 20 cm height, 5 cm depth', 'Kích thước kỹ thuật HANDYPAD Single và Double — dài 24 cm, cao 10 hoặc 20 cm, dày 5 cm'),
        media5: __handypadText('HANDYPAD Single and Double size dimensions — 24 cm length, 10 or 20 cm height, 5 cm depth', 'Kích thước HANDYPAD Single và Double — dài 24 cm, cao 10 hoặc 20 cm, dày 5 cm'),
        media6: __handypadText('HANDYPAD orange reflective option', 'HANDYPAD màu cam phiên bản phản quang'),
        media7: __handypadText('HANDYPAD Single and Double orange product pair', 'Bộ HANDYPAD Single và Double màu cam'),
        media8: __handypadText('HANDYPAD installed on scaffolding at a worksite', 'HANDYPAD lắp trên giàn giáo tại công trường'),
        media9: __handypadText('Orange scaffolding impact protection pads installed on an industrial walkway', 'Đệm bảo vệ va chạm màu cam lắp trên lối đi công nghiệp')
      };
      const mediaOrder = ["media1", "media2", "media3", "media4", "media6", "media7", "media8", "media9"];

      const mainImage = document.getElementById("rfq-main-image");
      const mainMedia = document.querySelector(".rfq-main-media");
      const thumbs = [...document.querySelectorAll(".rfq-thumb[data-media-key]")];
      const mediaPrev = document.getElementById("rfq-media-prev");
      const mediaNext = document.getElementById("rfq-media-next");
      const sizeButtons = [...document.querySelectorAll("[data-rfq-size]")];
      const optionButtons = [...document.querySelectorAll("[data-rfq-option]")];
      const quantityInput = document.getElementById("rfq-quantity");
      const sheetQuantityInput = document.getElementById("rfq-sheet-quantity");
      const qtyMinus = document.getElementById("rfq-qty-minus");
      const qtyPlus = document.getElementById("rfq-qty-plus");
      const sheetQtyMinus = document.getElementById("rfq-sheet-qty-minus");
      const sheetQtyPlus = document.getElementById("rfq-sheet-qty-plus");
      const addButtons = [...document.querySelectorAll("[data-rfq-add]")];
      const modifyButton = document.getElementById("rfq-modify-list");
      const requestButtons = [...document.querySelectorAll("[data-rfq-request]")];
      const openSheetButtons = [...document.querySelectorAll("[data-rfq-open-sheet]")];
      const actionStatus = document.getElementById("rfq-action-status");
      const sheetStatus = document.getElementById("rfq-sheet-status");
      const heroDirectContact = document.getElementById("hero-direct-contact");
      const sheetOverlay = document.getElementById("rfq-sheet-overlay");
      const sheetClose = document.getElementById("rfq-sheet-close");
      const summaryCard = document.querySelector(".rfq-summary-card");
      const listNode = document.getElementById("rfq-quote-list");
      const cartToast = document.getElementById("cart-toast");
      const cartToastText = document.getElementById("cart-toast-text");
      const previewOverlay = document.getElementById("product-preview-overlay");
      const previewCard = document.getElementById("product-preview-card");
      const previewImage = document.getElementById("product-preview-image");
      const previewClose = document.getElementById("product-preview-close");
      const quoteList = new Map();
      let selectedSize = "single";
      let selectedOption = "standard";
      let quantity = 1;
      let activeMediaIndex = 0;
      let isModifyMode = false;
      let toastTimer = null;
      let previewCloseTimer = null;
      let previewOpenedByTap = false;

      const money = value => `${Number(value).toLocaleString("en-US")} ₫`;
      const normalizeQty = value => Math.max(1, Math.min(9999, Number.parseInt(value, 10) || 1));
      const variantKey = () => `${selectedSize}_${selectedOption}`;
      const currentVariant = () => handypadVariants[variantKey()];

      const setMedia = key => {
        const src = rfqMedia[key];
        if (!src || !mainImage) return;
        activeMediaIndex = Math.max(0, mediaOrder.indexOf(key));
        mainMedia?.classList.add("is-changing");
        window.setTimeout(() => {
          mainImage.src = src;
          mainImage.alt = mediaAlts[key] || __handypadText("HANDYPAD product media", "Hình ảnh sản phẩm HANDYPAD");
          thumbs.forEach(thumb => thumb.classList.toggle("is-active", thumb.dataset.mediaKey === key));
          if (previewImage && previewOverlay && !previewOverlay.hidden) {
            previewImage.src = src;
            previewImage.alt = mainImage.alt;
          }
          mainMedia?.classList.remove("is-changing");
        }, 70);
      };

      const revealActiveThumb = () => {
        const activeThumb = thumbs.find(thumb => thumb.dataset.mediaKey === mediaOrder[activeMediaIndex]);
        activeThumb?.scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"});
      };

      const stepMedia = direction => {
        activeMediaIndex = (activeMediaIndex + direction + mediaOrder.length) % mediaOrder.length;
        setMedia(mediaOrder[activeMediaIndex]);
        window.setTimeout(revealActiveThumb, 95);
      };

      thumbs.forEach(thumb => {
        const key = thumb.dataset.mediaKey;
        const img = thumb.querySelector("img");
        if (img && rfqMedia[key]) img.src = rfqMedia[key];
        thumb.addEventListener("mouseenter", () => setMedia(key));
        thumb.addEventListener("focus", () => setMedia(key));
        thumb.addEventListener("click", () => setMedia(key));
      });
      mediaPrev?.addEventListener("click", event => {
        event.preventDefault();
        stepMedia(-1);
      });
      mediaNext?.addEventListener("click", event => {
        event.preventDefault();
        stepMedia(1);
      });
      setMedia("media1");

      const hoverPreviewQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
      const cancelPreviewClose = () => { window.clearTimeout(previewCloseTimer); previewCloseTimer = null; };
      const openProductPreview = mode => {
        if (!previewOverlay || !previewImage || !mainImage?.src) return;
        cancelPreviewClose();
        previewOpenedByTap = mode === "tap";
        previewImage.src = mainImage.src;
        previewImage.alt = mainImage.alt || __handypadText("HANDYPAD enlarged product preview", "Ảnh HANDYPAD phóng to");
        previewOverlay.hidden = false;
        previewOverlay.classList.toggle("is-tap-mode", previewOpenedByTap);
        if (previewOpenedByTap) document.body.style.overflow = "hidden";
        requestAnimationFrame(() => previewOverlay.classList.add("is-visible"));
      };
      const closeProductPreview = immediate => {
        if (!previewOverlay || previewOverlay.hidden) return;
        cancelPreviewClose();
        const finish = () => {
          previewOverlay.hidden = true;
          previewOverlay.classList.remove("is-visible", "is-tap-mode");
          if (previewOpenedByTap) document.body.style.overflow = "";
          previewOpenedByTap = false;
        };
        previewOverlay.classList.remove("is-visible");
        immediate ? finish() : window.setTimeout(finish, 150);
      };
      const schedulePreviewClose = () => {
        cancelPreviewClose();
        previewCloseTimer = window.setTimeout(() => closeProductPreview(false), 280);
      };

      mainMedia?.addEventListener("mouseenter", () => { if (hoverPreviewQuery.matches) openProductPreview("hover"); });
      mainMedia?.addEventListener("mouseleave", () => { if (hoverPreviewQuery.matches) schedulePreviewClose(); });
      mainMedia?.addEventListener("click", () => { if (!hoverPreviewQuery.matches) openProductPreview("tap"); });
      mainMedia?.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProductPreview("tap");
        }
      });
      previewCard?.addEventListener("mouseenter", cancelPreviewClose);
      previewCard?.addEventListener("mouseleave", () => { if (!previewOpenedByTap) schedulePreviewClose(); });
      previewClose?.addEventListener("click", () => closeProductPreview(true));
      previewOverlay?.addEventListener("click", event => {
        if (previewOpenedByTap && event.target === previewOverlay) closeProductPreview(true);
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && previewOverlay && !previewOverlay.hidden) closeProductPreview(true);
      });

      const showCartToast = message => {
        if (!cartToast || !cartToastText) return;
        window.clearTimeout(toastTimer);
        cartToastText.textContent = message;
        cartToast.hidden = false;
        requestAnimationFrame(() => cartToast.classList.add("is-visible"));
        toastTimer = window.setTimeout(() => {
          cartToast.classList.remove("is-visible");
          window.setTimeout(() => { cartToast.hidden = true; }, 180);
        }, 2800);
      };

      const setQuantity = value => {
        quantity = normalizeQty(value);
        if (quantityInput) quantityInput.value = quantity;
        if (sheetQuantityInput) sheetQuantityInput.value = quantity;
        renderCurrentSelection();
      };

      const renderCurrentSelection = () => {
        const variant = currentVariant();
        const subtotal = variant.price * quantity;

        sizeButtons.forEach(button => button.classList.toggle("is-active", button.dataset.rfqSize === selectedSize));
        optionButtons.forEach(button => button.classList.toggle("is-active", button.dataset.rfqOption === selectedOption));
        document.getElementById("rfq-unit-price").textContent = money(subtotal);
        document.getElementById("rfq-sheet-unit-price").textContent = money(variant.price);
        document.getElementById("rfq-sheet-subtotal").textContent = money(subtotal);
        document.getElementById("rfq-sheet-selected-label").textContent = __HANDYPAD_LANG === "vi" ? __handypadVariantShort(variant) : `${variant.option} ${variant.size}`;
        document.getElementById("rfq-sheet-selected-dimension").textContent = "";
        if (!quoteList.size) document.getElementById("rfq-mobile-total").textContent = money(subtotal);
      };

      sizeButtons.forEach(button => button.addEventListener("click", () => {
        selectedSize = button.dataset.rfqSize;
        renderCurrentSelection();
        if (selectedOption === "standard") setMedia(selectedSize === "single" ? "media2" : "media3");
      }));
      optionButtons.forEach(button => button.addEventListener("click", () => {
        selectedOption = button.dataset.rfqOption;
        renderCurrentSelection();
        if (selectedOption === "reflective") setMedia("media4");
        else setMedia(selectedSize === "single" ? "media2" : "media3");
      }));

      qtyMinus?.addEventListener("click", () => setQuantity(quantity - 1));
      qtyPlus?.addEventListener("click", () => setQuantity(quantity + 1));
      sheetQtyMinus?.addEventListener("click", () => setQuantity(quantity - 1));
      sheetQtyPlus?.addEventListener("click", () => setQuantity(quantity + 1));
      quantityInput?.addEventListener("input", e => setQuantity(e.target.value));
      quantityInput?.addEventListener("blur", e => setQuantity(e.target.value));
      sheetQuantityInput?.addEventListener("input", e => setQuantity(e.target.value));
      sheetQuantityInput?.addEventListener("blur", e => setQuantity(e.target.value));

      const renderQuoteList = () => {
        const empty = document.getElementById("rfq-summary-empty");
        const listWrap = document.getElementById("rfq-summary-list");
        const totalNode = document.getElementById("rfq-estimated-total");
        const hasItems = quoteList.size > 0;
        empty.hidden = hasItems;
        listWrap.hidden = !hasItems;
        if (modifyButton) {
          modifyButton.hidden = !hasItems;
          modifyButton.textContent = isModifyMode ? __handypadText("Done", "Xong") : __handypadText("Modify", "Chỉnh sửa");
          modifyButton.setAttribute("aria-pressed", isModifyMode ? "true" : "false");
        }
        summaryCard?.classList.toggle("is-modifying", hasItems && isModifyMode);

        let total = 0;
        if (listNode) listNode.innerHTML = "";
        quoteList.forEach((item, key) => {
          total += item.variant.price * item.quantity;
          const row = document.createElement("div");
          row.className = "rfq-quote-item";
          const shortLabel = __handypadVariantShort(item.variant);
          const itemSubtotal = item.variant.price * item.quantity;
          row.innerHTML = `<div class="rfq-quote-item-head"><strong>${shortLabel}</strong><button class="rfq-remove-item" type="button" data-rfq-remove="${key}" aria-label="${__handypadText("Remove", "Xóa")} ${shortLabel}">×</button></div><div class="rfq-invoice-lines"><div><span>${__handypadText("Unit Price", "Đơn giá")}</span><b>${money(item.variant.price)}</b></div><div><span>${__handypadText("Quantity", "Số lượng")}</span><b>${item.quantity}</b></div><div class="rfq-item-subtotal"><span>${__handypadText("Item Subtotal", "Thành tiền")}</span><b>${money(itemSubtotal)}</b></div></div>`;
          listNode?.appendChild(row);
        });
        totalNode.textContent = money(total);
        document.getElementById("rfq-mobile-total").textContent = hasItems ? money(total) : money(currentVariant().price * quantity);
      };

      const addCurrentItem = () => {
        const key = variantKey();
        const variant = currentVariant();
        const addedQuantity = quantity;
        const existing = quoteList.get(key);
        quoteList.set(key, {variant, quantity: existing ? existing.quantity + addedQuantity : addedQuantity});
        renderQuoteList();
        const message = __HANDYPAD_LANG === "vi" ? "Đã thêm vào giỏ hàng." : `${variant.label} added to cart successfully.`;
        if (actionStatus) actionStatus.textContent = message;
        if (sheetStatus) sheetStatus.textContent = message;
        showCartToast(message);
        setQuantity(1);
      };
      addButtons.forEach(button => button.addEventListener("click", addCurrentItem));

      modifyButton?.addEventListener("click", () => {
        if (!quoteList.size) return;
        isModifyMode = !isModifyMode;
        renderQuoteList();
      });

      listNode?.addEventListener("click", event => {
        const removeButton = event.target.closest("[data-rfq-remove]");
        if (!removeButton || !isModifyMode) return;
        const key = removeButton.dataset.rfqRemove;
        quoteList.delete(key);
        if (!quoteList.size) isModifyMode = false;
        renderQuoteList();
        showCartToast(__handypadText("Item removed from cart.", "Đã xóa sản phẩm khỏi giỏ hàng."));
      });

      const itemsForRequest = () => quoteList.size ? [...quoteList.values()] : [{variant: currentVariant(), quantity}];
      const buildRequestMessage = items => {
        const lines = items.map(item => __HANDYPAD_LANG === "vi" ? `- ${__handypadVariantFull(item.variant)}, ${item.variant.dimension}, ${__handypadColorLabel(item.variant.color)}, Số lượng: ${item.quantity}, Đơn giá: ${money(item.variant.price)}` : `- ${item.variant.label}, ${item.variant.dimension}, ${item.variant.color}, Qty: ${item.quantity}, Unit price: ${money(item.variant.price)}`);
        return __HANDYPAD_LANG === "vi" ? `Tôi cần báo giá cho:
${lines.join("\n")}

Vui lòng tư vấn báo giá chính thức, tình trạng hàng, mẫu thử và giao hàng.` : `I would like to request a quotation for:
${lines.join("\n")}

Please advise official quotation, availability, sample option and delivery.`;
      };

      const closeSheet = () => {
        if (!sheetOverlay || sheetOverlay.hidden) return;
        sheetOverlay.classList.remove("is-open");
        window.setTimeout(() => { sheetOverlay.hidden = true; document.body.style.overflow = ""; }, 180);
      };
      const openSheet = () => {
        if (!sheetOverlay) return;
        sheetOverlay.hidden = false;
        document.body.style.overflow = "hidden";
        requestAnimationFrame(() => sheetOverlay.classList.add("is-open"));
        window.setTimeout(() => sheetClose?.focus(), 80);
      };
      openSheetButtons.forEach(button => button.addEventListener("click", openSheet));
      sheetClose?.addEventListener("click", closeSheet);
      sheetOverlay?.addEventListener("click", event => { if (event.target === sheetOverlay) closeSheet(); });
      document.addEventListener("keydown", event => { if (event.key === "Escape") closeSheet(); });

      const requestQuote = () => {
        const items = itemsForRequest();
        const form = document.getElementById("enquiry-form");
        const leadSection = document.getElementById("lead-form");
        const message = document.getElementById("lead-message");
        if (!form || !leadSection || !message) return;
        form.classList.add("is-expanded");
        message.value = buildRequestMessage(items);
        closeSheet();
        window.setTimeout(() => {
          leadSection.scrollIntoView({behavior: "smooth", block: "start"});
          window.setTimeout(() => message.focus({preventScroll: true}), 520);
        }, 190);
      };

      requestButtons.forEach(button => button.addEventListener("click", requestQuote));
      heroDirectContact?.addEventListener("click", () => document.getElementById("direct-contact")?.click());

      const consultationPopup = document.getElementById("consultation-popup");
      const consultationCard = consultationPopup?.querySelector(".consultation-popup-card");
      const consultationClose = document.getElementById("consultation-popup-close");
      const consultationForm = document.getElementById("consultation-form");
      const consultationName = document.getElementById("consultation-name");
      const consultationPhone = document.getElementById("consultation-phone");
      const consultationStatus = document.getElementById("consultation-status");
      const consultationSuccess = document.getElementById("consultation-success");
      const consultationTriggers = [...document.querySelectorAll("[data-consultation-trigger]")];
      let consultationLastTrigger = null;

      const trackRfqEvent = (eventName, detail = {}) => {
        if (!eventName) return;
        const payload = {event: eventName, ...detail};
        window.dispatchEvent(new CustomEvent("handypad:track", {detail: payload}));
        if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
      };

      const resetConsultationState = () => {
        consultationForm.hidden = false;
        consultationSuccess.hidden = true;
        consultationStatus.hidden = true;
        consultationStatus.className = "consultation-status";
        [consultationName, consultationPhone].forEach(field => field.classList.remove("is-invalid"));
      };

      const openConsultation = trigger => {
        consultationLastTrigger = trigger || document.activeElement;
        resetConsultationState();
        if (sheetOverlay && !sheetOverlay.hidden) {
          sheetOverlay.classList.remove("is-open");
          sheetOverlay.hidden = true;
        }
        consultationPopup.hidden = false;
        document.body.style.overflow = "hidden";
        requestAnimationFrame(() => consultationPopup.classList.add("is-visible"));
        window.setTimeout(() => consultationName.focus(), 90);
      };

      const closeConsultation = () => {
        if (!consultationPopup || consultationPopup.hidden) return;
        consultationPopup.classList.remove("is-visible");
        window.setTimeout(() => {
          consultationPopup.hidden = true;
          document.body.style.overflow = "";
          if (consultationLastTrigger && typeof consultationLastTrigger.focus === "function") consultationLastTrigger.focus();
        }, 200);
      };

      consultationTriggers.forEach(trigger => trigger.addEventListener("click", () => openConsultation(trigger)));
      consultationClose?.addEventListener("click", closeConsultation);
      consultationCard?.addEventListener("click", event => event.stopPropagation());

      [consultationName, consultationPhone].forEach(field => field?.addEventListener("input", () => {
        field.classList.remove("is-invalid");
        if (consultationStatus?.classList.contains("is-error")) consultationStatus.hidden = true;
      }));

      consultationForm?.addEventListener("submit", event => {
        event.preventDefault();
        const nameValue = consultationName.value.trim();
        const phoneValue = consultationPhone.value.trim();

        if (!nameValue || !phoneValue) {
          consultationStatus.hidden = false;
          consultationStatus.className = "consultation-status is-error";
          consultationStatus.textContent = __handypadText("Please enter your name and phone / WhatsApp number.", "Vui lòng nhập họ tên và số điện thoại.");
          consultationName.classList.toggle("is-invalid", !nameValue);
          consultationPhone.classList.toggle("is-invalid", !phoneValue);
          (!nameValue ? consultationName : consultationPhone).focus();
          trackRfqEvent("consultation_validation_error");
          return;
        }

        consultationStatus.hidden = true;
        consultationForm.hidden = true;
        consultationSuccess.hidden = false;
        consultationForm.reset();
        trackRfqEvent("consultation_submit_success");
      });

      setQuantity(1);
      renderQuoteList();
    })();


/* ===== Extracted script block 5 ===== */
(() => {
    const header = document.querySelector('.header');
    const hero = document.querySelector('#hero');
    const productName = document.querySelector('.header-product-name');
    if (!header || !hero) return;

    let ticking = false;
    const syncStickyHeader = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const showProductContext = heroBottom <= header.offsetHeight + 2;
      header.classList.toggle('is-product-sticky', showProductContext);
      if (productName) productName.setAttribute('aria-hidden', showProductContext ? 'false' : 'true');
      ticking = false;
    };

    const requestSync = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncStickyHeader);
    };

    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);
    syncStickyHeader();
  })();


/* ===== Extracted script block 6 ===== */
(function(){
  function syncValueGalleryHeight(){
    var gallery=document.querySelector('.value-gallery');
    var copy=document.querySelector('.value-prop-copy');
    if(!gallery || !copy) return;
    if(window.innerWidth <= 820){
      gallery.style.removeProperty('--value-copy-stack-height');
      return;
    }
    var h=Math.ceil(copy.getBoundingClientRect().height);
    gallery.style.setProperty('--value-copy-stack-height', Math.max(280, h) + 'px');
  }
  window.addEventListener('load', function(){
    syncValueGalleryHeight();
    window.setTimeout(syncValueGalleryHeight, 120);
  });
  window.addEventListener('resize', syncValueGalleryHeight);
  if(document.readyState !== 'loading') syncValueGalleryHeight();
})();


/* ===== Extracted script block 7 ===== */
(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const revealItems = [...document.querySelectorAll('.scroll-reveal')];
      if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(el => el.classList.add('is-revealed'));
      } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
        revealItems.forEach(el => revealObserver.observe(el));
      }

      const layers = [...document.querySelectorAll('.parallax-bg[data-parallax-speed]')];
      const desktopMotion = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
      let ticking = false;
      const updateParallax = () => {
        ticking = false;
        if (!desktopMotion.matches) {
          layers.forEach(layer => layer.style.setProperty('--parallax-y', '0px'));
          return;
        }
        const vh = window.innerHeight || 800;
        layers.forEach(layer => {
          const host = layer.parentElement;
          if (!host) return;
          const rect = host.getBoundingClientRect();
          if (rect.bottom < -120 || rect.top > vh + 120) return;
          const speed = Math.max(0, Math.min(.12, Number(layer.dataset.parallaxSpeed) || .05));
          const centerDelta = (rect.top + rect.height / 2) - vh / 2;
          const y = Math.max(-30, Math.min(30, -centerDelta * speed));
          layer.style.setProperty('--parallax-y', `${y.toFixed(1)}px`);
        });
      };
      const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateParallax);
      };
      if (layers.length) {
        updateParallax();
        addEventListener('scroll', requestUpdate, { passive: true });
        addEventListener('resize', requestUpdate, { passive: true });
        desktopMotion.addEventListener?.('change', requestUpdate);
      }
    })();
