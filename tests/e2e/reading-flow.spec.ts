import { expect, test } from "@playwright/test";

test("core reading flow works end to end", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Runecast" })).toBeVisible();

  await page.getByRole("link", { name: "Begin a reading" }).click();
  await expect(page).toHaveURL(/\/reading$/);

  await page
    .getByPlaceholder("What is on your mind? Leave blank for a general reading.")
    .fill("What should I focus on this week?");

  await page.getByRole("button", { name: "Draw three runes" }).click();

  const drawAgainButton = page.getByRole("button", { name: "Draw again" });
  const castingError = page.getByText(
    "The runes are quiet right now. Please try casting again.",
  );

  await expect(drawAgainButton.or(castingError)).toBeVisible();
  await expect(castingError).toHaveCount(0);

  await expect(drawAgainButton).toBeVisible();
  await expect(page.getByText("What should I focus on this week?")).toBeVisible();

  await drawAgainButton.click();
  await expect(page.getByRole("button", { name: "Draw three runes" })).toBeVisible();
});
