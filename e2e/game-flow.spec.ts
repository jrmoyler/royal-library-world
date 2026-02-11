import { test, expect } from '@playwright/test';

test.describe('Royal Library World - Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the title screen', async ({ page }) => {
    // Wait for the title to be visible
    await expect(page.getByText('Royal Library')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('World')).toBeVisible();

    // Check for subtitle
    await expect(page.getByText(/Aetheria Library Protocol/i)).toBeVisible();

    // Check for Press Start button
    await expect(page.getByText('Press Start')).toBeVisible();

    // Check for credits
    await expect(page.getByText(/BUILT WITH NEXT.JS/i)).toBeVisible();
  });

  test('should navigate to character selection on button click', async ({ page }) => {
    // Wait for and click the Press Start button
    const startButton = page.getByText('Press Start');
    await expect(startButton).toBeVisible({ timeout: 10000 });
    await startButton.click();

    // Should show character selection screen
    await expect(page.getByText('Choose Your Class')).toBeVisible({ timeout: 5000 });

    // Should show all three character classes
    await expect(page.getByText('Techno-Mage')).toBeVisible();
    await expect(page.getByText('Cyber-Knight')).toBeVisible();
    await expect(page.getByText('Shadow Agent')).toBeVisible();
  });

  test('should select character and enter game', async ({ page }) => {
    // Navigate to character selection
    await page.getByText('Press Start').click();
    await expect(page.getByText('Choose Your Class')).toBeVisible({ timeout: 5000 });

    // Select Techno-Mage
    await page.getByText('Techno-Mage').click();

    // Enter the library button should be enabled
    const enterButton = page.getByText('Enter the Library');
    await expect(enterButton).toBeEnabled();
    await enterButton.click();

    // Should show HUD elements
    await expect(page.getByText('ENERGY')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('KNOWLEDGE SYNCED')).toBeVisible();

    // Should show controls hint
    await expect(page.getByText(/WASD Move/i)).toBeVisible();
  });

  test('should display correct player class on HUD', async ({ page }) => {
    // Navigate through to game
    await page.getByText('Press Start').click();
    await page.getByText('Cyber-Knight').click();
    await page.getByText('Enter the Library').click();

    // Wait for HUD to load
    await expect(page.getByText('ENERGY')).toBeVisible({ timeout: 10000 });

    // Should show selected class
    await expect(page.getByText(/cyber knight/i)).toBeVisible();
  });

  test('should show initial energy at 100', async ({ page }) => {
    // Navigate through to game
    await page.getByText('Press Start').click();
    await page.getByText('Techno-Mage').click();
    await page.getByText('Enter the Library').click();

    // Wait for HUD
    await expect(page.getByText('ENERGY')).toBeVisible({ timeout: 10000 });

    // Energy should be at 100 initially
    const energyDisplay = page.locator('text=/^100$/').first();
    await expect(energyDisplay).toBeVisible();
  });

  test('should show 0 discovered books initially', async ({ page }) => {
    // Navigate through to game
    await page.getByText('Press Start').click();
    await page.getByText('Shadow Agent').click();
    await page.getByText('Enter the Library').click();

    // Wait for HUD
    await expect(page.getByText('KNOWLEDGE SYNCED')).toBeVisible({ timeout: 10000 });

    // Should show 0 / 8 books discovered
    await expect(page.getByText('/ 8')).toBeVisible();
  });
});

test.describe('Royal Library World - 3D Scene', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to the game
    await page.getByText('Press Start').click();
    await page.getByText('Techno-Mage').click();
    await page.getByText('Enter the Library').click();

    // Wait for scene to load
    await expect(page.getByText('ENERGY')).toBeVisible({ timeout: 10000 });
  });

  test('should load 3D scene without errors', async ({ page }) => {
    // Check for WebGL errors in console
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit for scene to render
    await page.waitForTimeout(3000);

    // Filter out expected/harmless errors
    const criticalErrors = errors.filter(
      err => !err.includes('favicon') &&
             !err.includes('DevTools') &&
             !err.includes('act()')
    );

    // Should have no critical WebGL or Three.js errors
    expect(criticalErrors.length).toBe(0);
  });

  test('should render canvas element for 3D scene', async ({ page }) => {
    // Should have a canvas element (Three.js renderer)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 5000 });

    // Canvas should have reasonable dimensions
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThan(100);
      expect(box.height).toBeGreaterThan(100);
    }
  });

  test('should maintain HUD visibility during 3D scene interaction', async ({ page }) => {
    // HUD elements should remain visible
    await expect(page.getByText('ENERGY')).toBeVisible();
    await expect(page.getByText('KNOWLEDGE SYNCED')).toBeVisible();

    // Click on canvas to interact with scene
    const canvas = page.locator('canvas');
    await canvas.click();

    // Wait a bit
    await page.waitForTimeout(1000);

    // HUD should still be visible
    await expect(page.getByText('ENERGY')).toBeVisible();
    await expect(page.getByText('KNOWLEDGE SYNCED')).toBeVisible();
  });
});

test.describe('Royal Library World - Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Should still show title
    await expect(page.getByText('Royal Library')).toBeVisible({ timeout: 10000 });

    // Should be able to start game
    await page.getByText('Press Start').click();
    await expect(page.getByText('Choose Your Class')).toBeVisible({ timeout: 5000 });
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Should show title
    await expect(page.getByText('Royal Library')).toBeVisible({ timeout: 10000 });

    // Character selection should be usable
    await page.getByText('Press Start').click();
    await expect(page.getByText('Choose Your Class')).toBeVisible({ timeout: 5000 });
    await page.getByText('Techno-Mage').click();
    await page.getByText('Enter the Library').click();

    // HUD should be visible
    await expect(page.getByText('ENERGY')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Royal Library World - Accessibility', () => {
  test('should have proper page title', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');

    // Check page title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should not have console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Filter out expected errors (favicon, DevTools, etc.)
    const criticalErrors = errors.filter(
      err => !err.includes('favicon') &&
             !err.includes('DevTools') &&
             !err.includes('act()')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
