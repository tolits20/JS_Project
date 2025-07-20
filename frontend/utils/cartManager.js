// Session-based Cart Manager
// This utility manages cart operations using sessionStorage
// Follows DRY principle - can be reused across all user pages
// Cart is tied to user authentication for security

class SessionCartManager {
  constructor() {
    this.userId = this.getUserId();
    this.cartKey = `auretta_cart_${this.userId}`;
    this.cart = this.loadCart();
  }

  // Load cart from sessionStorage
  loadCart() {
    try {
      const cartData = sessionStorage.getItem(this.cartKey);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error loading cart from session:", error);
      return [];
    }
  }

  // Save cart to sessionStorage
  saveCart() {
    try {
      sessionStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    } catch (error) {
      console.error("Error saving cart to session:", error);
    }
  }

  // Add item to cart
  addToCart(item, quantity = 1) {
    // Check if user has changed
    this.checkUserChange();

    const existingItem = this.cart.find(
      (cartItem) => cartItem.item_id === item.item_id
    );

    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += quantity;
      if (existingItem.quantity > item.stock_qty) {
        existingItem.quantity = item.stock_qty;
      }
    } else {
      // Add new item to cart
      this.cart.push({
        item_id: item.item_id,
        item_name: item.item_name,
        item_price: item.item_price,
        item_img: item.item_img,
        quantity: quantity,
        stock_qty: item.stock_qty,
      });
    }

    this.saveCart();
    this.updateCartDisplay();
    return true;
  }

  // Remove item from cart
  removeFromCart(itemId) {
    this.cart = this.cart.filter((item) => item.item_id !== itemId);
    this.saveCart();
    this.updateCartDisplay();
  }

  // Update item quantity
  updateQuantity(itemId, quantity) {
    const item = this.cart.find((cartItem) => cartItem.item_id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else if (quantity <= item.stock_qty) {
        item.quantity = quantity;
        this.saveCart();
        this.updateCartDisplay();
      }
    }
  }

  // Get cart total
  getCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.item_price * item.quantity,
      0
    );
  }

  // Get cart count
  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartDisplay();
  }

  // Update cart display in header
  updateCartDisplay() {
    const cartCount = this.getCartCount();
    const cartCountElement = document.querySelector(".cart-count");

    if (cartCountElement) {
      if (cartCount > 0) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = "flex";
      } else {
        cartCountElement.style.display = "none";
      }
    }
  }

  // Get cart items
  getCartItems() {
    // Check if user has changed
    this.checkUserChange();
    return this.cart;
  }

  // Check if item exists in cart
  isItemInCart(itemId) {
    return this.cart.some((item) => item.item_id === itemId);
  }

  // Get item from cart
  getCartItem(itemId) {
    return this.cart.find((item) => item.item_id === itemId);
  }

  // Get user ID from authentication token (using existing token system)
  getUserId() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Decode JWT token to get user ID (same as your backend expects)
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.data || "anonymous";
      }
      return "anonymous";
    } catch (error) {
      console.error("Error getting user ID:", error);
      return "anonymous";
    }
  }

  // Check if user has changed and reload cart if needed
  checkUserChange() {
    const currentUserId = this.getUserId();
    if (currentUserId !== this.userId) {
      // User has changed, update cart key and reload
      this.userId = currentUserId;
      this.cartKey = `auretta_cart_${this.userId}`;
      this.cart = this.loadCart();
      console.log("User changed, cart reloaded for user:", this.userId);
    }
  }

  // Clear cart when user logs out
  clearCartOnLogout() {
    try {
      sessionStorage.removeItem(this.cartKey);
      this.cart = [];
      this.updateCartDisplay();
      console.log("Cart cleared on logout");
    } catch (error) {
      console.error("Error clearing cart on logout:", error);
    }
  }
}

// Create and export a singleton instance
const sessionCartManager = new SessionCartManager();

export default sessionCartManager;
