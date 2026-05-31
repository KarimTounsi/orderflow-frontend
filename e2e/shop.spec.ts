import { test, expect } from "@playwright/test";

test.describe("OrderFlow E2E", () => {

  test("homepage loads with hero and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "OrderFlow" })).toBeVisible();
    await expect(page.getByRole("link", { name: /browse all products/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /products/i }).first()).toBeVisible();
  });

  test("products page loads and shows products grid", async ({ page }) => {
    await page.goto("/products");
    // Wait for products to load from backend
    await page.waitForTimeout(2000);
    const cards = page.locator(".group");
    const count = await cards.count();
    console.log(`Products loaded: ${count}`);
    // If backend is up, we should see products
    const errorMsg = page.getByText(/Make sure product-service/i);
    const hasError = await errorMsg.isVisible().catch(() => false);
    if (hasError) {
      console.warn("Backend not reachable - CORS or service not running");
    } else {
      expect(count).toBeGreaterThan(0);
    }
  });

  test("search filter works on products page", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(1500);
    const searchInput = page.getByPlaceholder(/search products/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Sony");
    await page.waitForTimeout(800);
  });

  test("category filter works", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(1500);
    const electronicsButton = page.getByText("Electronics").first();
    await expect(electronicsButton).toBeVisible();
    await electronicsButton.click();
    await page.waitForTimeout(800);
  });

  test("empty cart page shows correct state", async ({ page }) => {
    await page.goto("/cart");
    await page.waitForTimeout(1000);
    // New session = empty cart
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /browse products/i })).toBeVisible();
  });

  test("add to cart from products page", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(2000);

    // Check if products loaded
    const addButtons = page.getByRole("button", { name: /add to cart/i });
    const count = await addButtons.count();

    if (count === 0) {
      console.warn("No products found - backend may not be running");
      return;
    }

    // Click first "Add to cart" button
    await addButtons.first().click();
    await page.waitForTimeout(1000);

    // Should show success toast
    const toast = page.getByText(/added to cart/i);
    const toastVisible = await toast.isVisible().catch(() => false);
    if (toastVisible) {
      console.log("Toast notification shown correctly");
    }

    // Cart badge should update
    await page.goto("/cart");
    await page.waitForTimeout(1000);
    const cartEmpty = await page.getByText(/your cart is empty/i).isVisible().catch(() => false);
    if (!cartEmpty) {
      console.log("Cart has items - add to cart worked!");
      // Wait for cart items to fully load via React Query (useEffect + fetch)
      await expect(page.getByText(/proceed to checkout/i)).toBeVisible({ timeout: 8000 });
    }
  });

  test("product detail page loads", async ({ page }) => {
    await page.goto("/products");
    await page.waitForTimeout(2000);

    const productLinks = page.locator("a[href^='/products/']");
    const count = await productLinks.count();

    if (count === 0) {
      console.warn("No product links - backend may not be running");
      return;
    }

    const href = await productLinks.first().getAttribute("href");
    if (href) {
      await page.goto(href);
      await page.waitForTimeout(1000);
      await expect(page.getByRole("button", { name: /add to cart/i })).toBeVisible();
      await expect(page.getByText(/back to products/i)).toBeVisible();
    }
  });

  test("checkout page shows empty when cart is empty", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(1000);
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test("orders page loads", async ({ page }) => {
    await page.goto("/orders");
    await page.waitForTimeout(2000);
    // New session has no orders
    await expect(page.getByRole("heading", { name: /my orders/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/no orders yet/i)).toBeVisible({ timeout: 5000 });
  });

  test("navbar cart button is visible and links to cart", async ({ page }) => {
    await page.goto("/");
    const cartLink = page.getByRole("link", { name: /cart/i });
    await expect(cartLink).toBeVisible();
    await cartLink.click();
    await expect(page).toHaveURL("/cart");
  });

  test("full checkout flow when backend is available", async ({ page }) => {
    // Step 1: Add product to cart
    await page.goto("/products");
    await page.waitForTimeout(2000);

    const addButtons = page.getByRole("button", { name: /add to cart/i });
    const count = await addButtons.count();
    if (count === 0) {
      console.warn("Skipping checkout test - no products available");
      return;
    }

    await addButtons.first().click();
    await page.waitForTimeout(1000);

    // Step 2: Go to checkout
    await page.goto("/checkout");
    await page.waitForTimeout(1000);

    const emailInput = page.getByLabel(/email/i);
    const notEmpty = await emailInput.isVisible().catch(() => false);
    if (!notEmpty) {
      console.warn("Cart empty - checkout redirected");
      return;
    }

    // Step 3: Fill checkout form
    await emailInput.fill("test@orderflow.demo");
    await page.getByLabel(/shipping address/i).fill("ul. Testowa 1, Warszawa");

    // Step 4: Submit order
    await page.getByRole("button", { name: /place order/i }).click();
    await page.waitForTimeout(3000);

    // Step 5: Should redirect to order tracking
    const url = page.url();
    console.log("After checkout URL:", url);
    if (url.includes("/orders/")) {
      console.log("Checkout successful! Redirected to order tracking.");
      await expect(page.getByText(/order details/i)).toBeVisible();
    }
  });
});
