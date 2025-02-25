import path from "path";
import { chromium } from "playwright";
import fs from "fs";
import os from "os";
import { simulateMouseMovement } from "./simulate_mouse_move";
import { restartTor } from "@/shared/lib/tor";

export const removeWattermark = async (
  imageBuffer: Buffer,
): Promise<Buffer> => {
  await restartTor();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: `./img_for_test/v1-${new Date().toISOString()}`,
      size: { width: 1280, height: 720 },
    },
    storageState: undefined,
    proxy: {
      server: "socks5://127.0.0.1:9050", // Адрес Tor SOCKS-прокси
    },
  });

  const page = await context.newPage();
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
  });

  try {
    // Создаем временный файл из Buffer
    const tempFilePath = path.join(os.tmpdir(), `input_image.png`);
    fs.writeFileSync(tempFilePath, imageBuffer);

    // Открываем сайт
    console.log("Открываем сайт...");
    await page.goto("https://dewatermark.ai/");
    console.log("Сайт открыт");

    // Нажимаем на кнопку согласия (если она есть)
    // const coockyOk = "button:has-text('Consent')";
    // await page.waitForSelector(coockyOk, { timeout: 60000 });
    // await page.locator(coockyOk).click();
    await simulateMouseMovement(page);

    // Загружаем изображение на сайт
    const inputFileSelector = 'input[type="file"]';
    await page.waitForSelector(inputFileSelector, {
      timeout: 60000,
      state: "attached",
    });
    console.log("input найден");

    // Устанавливаем файл
    await page.setInputFiles(inputFileSelector, tempFilePath);
    const inputFileValue = await page.locator(inputFileSelector).inputValue();
    console.log("Загружен файл:", inputFileValue);

    // Ждем, пока изображение обработается
    await page.waitForTimeout(5000); // Ожидание 5 секунд для обработки
    await page.waitForSelector("img[alt='enhanced-image']", { timeout: 60000 });
    console.log("Изображение обработано");

    // Ожидаем появления кнопки для скачивания
    const downloadButtonSelector = "button:has-text('Download')";
    await page.waitForSelector(downloadButtonSelector, { timeout: 60000 });

    // Перехватываем событие скачивания
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click(downloadButtonSelector),
    ]);

    // Сохраняем файл на диск
    const tempDownloadPath = path.join(os.tmpdir(), "processed_image.png");
    await download.saveAs(tempDownloadPath);
    console.log("Изображение без вотермарки сохранено");

    // Читаем файл как Buffer
    const processedImageBuffer = fs.readFileSync(tempDownloadPath);
    fs.unlinkSync(tempFilePath); // Удаляем временный файл с исходным изображением
    fs.unlinkSync(tempDownloadPath); // Удаляем временный файл с обработанным изображением

    // Возвращаем Buffer
    return processedImageBuffer;
  } catch (error) {
    console.error("Ошибка при удалении вотермарки:", error);
    throw error;
  } finally {
    await browser.close();
  }
};
