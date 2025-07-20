// Component Loader Utility
// Reusable component loading system to avoid code duplication across pages

export function loadComponent(containerId, componentPath, callback = null) {
  fetch(componentPath)
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;

        // Execute callback if provided
        if (callback && typeof callback === "function") {
          callback();
        }
      }
    })
    .catch((error) => {
      console.error("Error loading component:", error);
    });
}

// Common component loading patterns
export function loadHeaderAndFooter(cartManager = null) {
  // Load header
  loadComponent(
    "header-container",
    "/frontend/user/components/primary/header.html",
    () => {
      // Update cart display after header loads
      if (cartManager && typeof cartManager.updateCartDisplay === "function") {
        cartManager.updateCartDisplay();
      }
    }
  );

  // Load footer
  loadComponent(
    "footer-container",
    "/frontend/user/components/primary/footer.html"
  );
}
