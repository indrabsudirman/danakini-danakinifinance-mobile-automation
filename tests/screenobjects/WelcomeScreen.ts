import { clickIfElementExists } from "../helpers/utils.js";
import AppScreen from "./AppScreen.js";

const SWIPE_SCREEN_SELECTOR = "~viewPagerIntro";
const DAFTAR_BUTTON_SELECTOR = "id:com.dkf.danakinifinance:id/btn_daftar";
const MASUK_TEXTVIEW_SELECTOR = "id:com.dkf.danakinifinance:id/tv_daftar_login";
const LANJUT_TANPA_LOGIN_TEXTVIEW_SELECTOR =
    "id:com.dki.danakini:id/btn_lewati";
const CLOSE_BANNER_HOMESCREEN =
    'new UiSelector().className("android.widget.ImageView").instance(16)';

type SwipeDirection = "left" | "right" | "up" | "down";

class WelcomeScreen extends AppScreen {
    constructor() {
        super(SWIPE_SCREEN_SELECTOR);
    }

    get screen() {
        return $(SWIPE_SCREEN_SELECTOR);
    }

    get daftarButton() {
        return $(DAFTAR_BUTTON_SELECTOR);
    }

    get masukTextView() {
        return $(MASUK_TEXTVIEW_SELECTOR);
    }

    get lanjutTanpaLoginTextView() {
        return $(LANJUT_TANPA_LOGIN_TEXTVIEW_SELECTOR);
    }

    get closeBannerHomeScreen() {
        return $(CLOSE_BANNER_HOMESCREEN);
    }

    async clickCloseBannerHomeScreen() {
        await clickIfElementExists(CLOSE_BANNER_HOMESCREEN);
    }

    async clickLanjutTanpaLoginTextView() {
        await this.lanjutTanpaLoginTextView.waitForDisplayed();
        await this.lanjutTanpaLoginTextView.click();
    }

    async clickDaftarButton() {
        await this.daftarButton.waitForDisplayed();
        await this.daftarButton.click();
    }

    async clickMasukTextView() {
        await this.masukTextView.waitForDisplayed();
        await this.masukTextView.click();
    }

    /**
     * Swipe in given direction multiple times
     * @param direction Direction to swipe
     * @param times How many times to swipe (default = 1)
     */
    async swipe(direction: SwipeDirection, times = 1) {
        const element = await this.screen;
        const { x, y } = await element.getLocation();
        const { width, height } = await element.getSize();

        let startX = x + width / 2;
        let endX = startX;
        let startY = y + height / 2;
        let endY = startY;

        switch (direction) {
            case "left":
                startX = x + width * 0.8;
                endX = x + width * 0.2;
                break;
            case "right":
                startX = x + width * 0.2;
                endX = x + width * 0.8;
                break;
            case "up":
                startY = y + height * 0.8;
                endY = y + height * 0.2;
                break;
            case "down":
                startY = y + height * 0.2;
                endY = y + height * 0.8;
                break;
            default:
                throw new Error(`Unsupported direction: ${direction}`);
        }

        for (let i = 0; i < times; i++) {
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        {
                            type: "pointerMove",
                            duration: 0,
                            x: startX,
                            y: startY,
                        },
                        { type: "pointerDown", button: 0 },
                        { type: "pause", duration: 300 },
                        {
                            type: "pointerMove",
                            duration: 300,
                            x: endX,
                            y: endY,
                        },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.releaseActions();
            await driver.pause(300);
        }
    }
}

export default new WelcomeScreen();
