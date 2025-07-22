import { Given, Then, When } from "@wdio/cucumber-framework";
import dotenv from "dotenv";
import NativeAlert from "../screenobjects/components/NativeAlert.js";
import LoginScreen from "../screenobjects/LoginScreen.js";
import WelcomeScreen from "../screenobjects/WelcomeScreen.js";

dotenv.config();

Given(
    /^I am on the login screen (Danakini|Danakini Finance)$/,
    async (company) => {
        if (company === "Danakini") {
            await NativeAlert.topOnButtonWithText("Izinkan");
            await NativeAlert.topOnButtonWithText("MULAI");
            await NativeAlert.topOnButtonWithText("SELANJUTNYA");
            await NativeAlert.topOnButtonWithText("MULAI");
            await NativeAlert.topOnButtonWithText("Oke");
            await WelcomeScreen.clickLanjutTanpaLoginTextView();
            await WelcomeScreen.clickCloseBannerHomeScreen();
        } else {
            await NativeAlert.topOnButtonWithText("OK");
            await NativeAlert.topOnButtonWithText("Allow");
            await WelcomeScreen.waitForIsShown();
            await WelcomeScreen.swipe("left", 2);
            await WelcomeScreen.clickDaftarButton();
            await NativeAlert.topOnButtonWithText("OK");
            await WelcomeScreen.clickMasukTextView();
        }
    },
);

When(/^I enter valid login credentials$/, async () => {
    await LoginScreen.submitNomorHPOrEmailForm({
        username: process.env.TEST_USER_PHONE as string,
    });
    await LoginScreen.inputPIN(process.env.TEST_USER_PIN as string);
});

Then(/^I should see a Success greeting$/, async () => {
    const expectedFirstName = process.env.TEST_USER_FULLNAME as string;
    await LoginScreen.verifyIsOnLoginScreen(expectedFirstName);
});

Then(
    /^the page should be closed when I click on (Lewati|Lengkapi Data Diri) button$/,
    async (formType) => {
        if (formType === "Lewati") {
            await LoginScreen.clickLewatiButton();
        } else {
            await LoginScreen.clickLengkapiDataDiriButton();
        }
    },
);
