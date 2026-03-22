import { test, expect } from "bun:test";
import { AppComponent } from "./app.component";

test("calculateAcousticBaseHz handles unknown tokens with fallback", () => {
  // We need to bypass the Angular decorator/lifecycle for a pure logic test.
  // In many cases, new AppComponent() works if it doesn't depend on complex DI in constructor.
  const component = new AppComponent();

  // Test case 1: Known tokens
  component.cipherTokens = ['AAA', 'OOO']; // (432 + 528) / 2 = 960 / 2 = 480
  expect(component.calculateAcousticBaseHz()).toBe(480);

  // Test case 2: Unknown token (edge case)
  component.cipherTokens = ['UNKNOWN_TOKEN'];
  expect(component.calculateAcousticBaseHz()).toBe(432);

  // Test case 3: Mix of known and unknown tokens
  component.cipherTokens = ['AAA', 'UNKNOWN_TOKEN']; // (432 + 432) / 2 = 432
  expect(component.calculateAcousticBaseHz()).toBe(432);
});
