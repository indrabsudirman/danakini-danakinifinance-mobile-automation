import AppScreen from "./AppScreen.js";

const LOGIN_SCREEN_TITLE = "id:com.dkf.danakinifinance:id/titleLogin";
const INPUT_NOMOR_HP_OR_EMAIL = "id:com.dkf.danakinifinance:id/textInputLogin";
const SUBMIT_BUTTON = "id:com.dkf.danakinifinance:id/btn_next";
const PIN_INPUT_SELECTOR =
    'android=new UiSelector().resourceId("com.dkf.danakinifinance:id/pinViewInput")';
const GREETING_TEXT = "id:com.dkf.danakinifinance:id/lblUsername";
const LEWATI_TEXT = "id:com.dkf.danakinifinance:id/btnLewati";

class LoginScreen extends AppScreen {
    constructor() {
        super(LOGIN_SCREEN_TITLE);
    }

    get screen() {
        return $(LOGIN_SCREEN_TITLE);
    }

    private get nomorHPOrEmail() {
        return $(INPUT_NOMOR_HP_OR_EMAIL);
    }

    private get submitButton() {
        return $(SUBMIT_BUTTON);
    }

    private get pinInput() {
        return $(PIN_INPUT_SELECTOR);
    }

    private get greetingText() {
        return $(GREETING_TEXT);
    }

    private get lewatiText() {
        return $(LEWATI_TEXT);
    }

    async submitNomorHPOrEmailForm({ username }: { username: string }) {
        await this.nomorHPOrEmail.setValue(username);

        if (await driver.isKeyboardShown()) {
            await $("~Login-screen").click();
        }
        await this.submitButton.click();
    }

    async inputPIN(pin: string) {
        await this.pinInput.setValue(pin);
    }

    async getGreetingText() {
        return await this.greetingText.getText();
    }

    async verifyIsOnLoginScreen(fullName: string) {
        const usernameLabel = await this.getGreetingText();
        const firstMiddle = fullName.split(" ").slice(0, 2).join(" ");
        expect(usernameLabel).toContain(firstMiddle);
    }

    async clickLewatiButton() {
        await this.lewatiText.click();
        await expect(this.lewatiText).not.toBeDisplayed();
    }

    async clickLengkapiDataDiriButton() {
        // rest of the code
    }
}

export default new LoginScreen();
