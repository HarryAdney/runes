import { expect, test } from "@playwright/test";

test("core reading flow works end to end", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Runecast" })).toBeVisible();

  await page.getByRole("link", { name: "Begin a reading" }).click();
  await expect(page).toHaveURL(/\/reading$/);

  // The question box only appears when the AI layer is configured.
  const drawButton = page.getByRole("button", { name: "Draw three runes" });
  await expect(drawButton).toBeVisible();
  const questionBox = page.getByPlaceholder(
    "What is on your mind? Leave blank for a general reading.",
  );
  const asksQuestion = (await questionBox.count()) > 0;
  if (asksQuestion) {
    await questionBox.fill("What should I focus on this week?");
  }

  await drawButton.click();

  const drawAgainButton = page.getByRole("button", { name: "Draw again" });
  const castingError = page.getByText(
    "The runes are quiet right now. Please try casting again.",
  );

  await expect(drawAgainButton.or(castingError)).toBeVisible();
  await expect(castingError).toHaveCount(0);

  await expect(drawAgainButton).toBeVisible();
  if (asksQuestion) {
    await expect(page.getByText("What should I focus on this week?")).toBeVisible();
  }

  await drawAgainButton.click();
  await expect(page.getByRole("button", { name: "Draw three runes" })).toBeVisible();
});

const unavailableNotice = "personalised interpretation is unavailable";

for (const { name, aiEnabled, noticeCount } of [
  { name: "shows a notice when the AI call failed", aiEnabled: true, noticeCount: 1 },
  { name: "shows no notice when AI is switched off", aiEnabled: false, noticeCount: 0 },
]) {
  test(name, async ({ page }) => {
    await page.route("**/api/reading", (route) =>
      route.fulfill({
        json: {
          spreadName: "Three-Rune Spread",
          question: null,
          drawn: [],
          grounding: [],
          overview: null,
          sections: [],
          advice: null,
          aiAvailable: false,
          aiEnabled,
        },
      }),
    );

    await page.goto("/reading");
    await page.getByRole("button", { name: "Draw three runes" }).click();

    await expect(page.getByRole("button", { name: "Draw again" })).toBeVisible();
    await expect(page.getByText(unavailableNotice)).toHaveCount(noticeCount);
  });
}
