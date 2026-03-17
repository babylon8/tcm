import { test, expect } from '@playwright/test';

test('complete TCM assessment workflow', async ({ page }) => {
  // Start from homepage
  await page.goto('http://localhost:3000');
  
  // Navigate to assessment
  await page.click('text=Start Assessment');
  
  // Should be on the streamlined assessment page
  await expect(page).toHaveURL(/\/assessment\/streamlined/);
  
  // Click "Begin Assessment" to start
  await page.click('text=Begin Assessment');
  
  // Answer all 45 questions (select option 3 for consistency)
  for (let i = 1; i <= 45; i++) {
    await expect(page).toHaveURL(`/assessment/streamlined/${i}`);
    
    // Wait for question to load
    await page.waitForSelector('text=Question');
    
    // Select the middle option (3 out of 1-5)
    await page.click('button:has-text("3")');
    
    // Click Next
    await page.click('text=Next');
  }
  
  // Should be on results page
  await expect(page).toHaveURL(/\/assessment\/results/);
  
  // Verify results page has expected content
  await expect(page.locator('text=Assessment Results')).toBeVisible();
  await expect(page.locator('text=Your Primary Constitution')).toBeVisible();
  
  // Keep browser open - don't close
  await page.pause();
});
