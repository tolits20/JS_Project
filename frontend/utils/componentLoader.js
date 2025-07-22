// Component Loader Utility
// Reusable component loading system to avoid code duplication across pages

export function loadComponent(containerId, componentPath, callback = null) {
  console.log(
    `Loading component: ${componentPath} into container: ${containerId}`
  );

  fetch(componentPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
        console.log(`Successfully loaded component: ${componentPath}`);

        // Execute callback if provided
        if (callback && typeof callback === "function") {
          callback();
        }
      } else {
        console.error(`Container not found: ${containerId}`);
      }
    })
    .catch((error) => {
      console.error(`Error loading component ${componentPath}:`, error);
    });
}

// Common component loading patterns
export function loadHeaderAndFooter(cartManager = null) {
  // Get current page path to determine relative paths
  const currentPath = window.location.pathname;
  let headerPath, footerPath;

  console.log("Current path:", currentPath);

  // Determine paths based on current page location
  if (currentPath.includes("/checkout/")) {
    // We're on checkout page - use absolute paths to be safe
    headerPath = "/frontend/user/components/primary/header.html";
    footerPath = "/frontend/user/components/primary/footer.html";
  } else if (currentPath.includes("/cart/")) {
    // We're on cart page - use relative paths
    headerPath = "../components/primary/header.html";
    footerPath = "../components/primary/footer.html";
  } else if (currentPath.includes("/item/")) {
    headerPath = "../components/primary/header.html";
    footerPath = "../components/primary/footer.html";
  } else if (currentPath.includes("/user/")) {
    // We're on other user pages
    headerPath = "../components/primary/header.html";
    footerPath = "../components/primary/footer.html";
  } else {
    // Default paths
    headerPath = "/frontend/user/components/primary/header.html";
    footerPath = "/frontend/user/components/primary/footer.html";
  }

  console.log("Loading header from:", headerPath);
  console.log("Loading footer from:", footerPath);

  // Load header first, then footer
  loadComponent("header-container", headerPath, () => {
    console.log("Header loaded successfully");
    // Update cart display after header loads
    if (cartManager && typeof cartManager.updateCartDisplay === "function") {
      cartManager.updateCartDisplay();
    }

    // Load footer after header is loaded
    loadComponent("footer-container", footerPath, () => {
      console.log("Footer loaded successfully");

      // Trigger a custom event when both components are loaded
      const event = new CustomEvent("componentsLoaded", {
        detail: { cartManager },
      });
      document.dispatchEvent(event);
    });
  });
}
