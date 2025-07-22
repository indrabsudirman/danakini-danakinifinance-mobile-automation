import allure from "@wdio/allure-reporter";
import url from "node:url";
import path from "path";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const platform = process.env.PLATFORM?.toLowerCase() || "android";
const device = process.env.DEVICE || "android";
const company = process.env.COMPANY || "Danakini Finance";
// const testUserPhone = process.env.TEST_USER_PHONE || "";
// const testUserFullname = process.env.TEST_USER_FULLNAME || "";
// const testUserPin = process.env.TEST_USER_PIN || "";

// Capabilities dinamis
const capabilities = [];

if (platform === "android") {
    capabilities.push({
        platformName: "Android",
        "wdio:maxInstances": 1,
        "appium:uuid": device,
        "appium:platformVersion": "16.0",
        "appium:automationName": "UiAutomator2",
        "appium:orientation": "PORTRAIT",
        "appium:appPackage": "com.dkf.danakinifinance",
        "appium:appActivity":
            "com.dkf.danakinifinance.view.splash.SplashScreen",
        "appium:newCommandTimeout": 240,
    });
} else if (platform === "ios") {
    capabilities.push({
        platformName: "iOS",
        "wdio:maxInstances": 1,
        "appium:deviceName": "iPhone Iphone",
        "appium:udid": "00008020-001659343ADA002E",
        "appium:platformVersion": "18.5",
        "appium:automationName": "XCUITest",
        "appium:xcodeOrgId": "QD646FQR85",
        "appium:xcodeSigningId": "iPhone Developer",
        "appium:orientation": "PORTRAIT",
        "appium:bundleId": "id.co.btn.mobilebanking.ios.sit",
        "appium:newCommandTimeout": 240,
        "appium:usePrebuiltWDA": false,
        "appium:skipServerInstallation": false,
        "appium:updatedWDABundleId": "com.indrasudirman.WebDriverAgentRunner",
        "appium:useNewWDA": true,
        "appium:showXcodeLog": true,
    });
} else {
    throw new Error(`Unknown PLATFORM "${platform}". Use "android" or "ios".`);
}

export const config: WebdriverIO.Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    logLevel: "debug",
    bail: 0,
    waitforTimeout: 45000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    //
    // ============
    // Specs
    // ============
    specs: ["../tests/features/**/*.feature"],

    //
    // ============
    // Framework
    // ============
    framework: "cucumber",
    cucumberOpts: {
        require: [path.join(__dirname, "..", "tests", "steps", "**", "*.ts")],
        backtrace: false,
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        timeout: 20000,
        ignoreUndefinedDefinitions: false,
        scenarioLevelReporter: false,
    },

    //
    // ============
    // Services
    // ============
    services: [
        [
            "appium",
            {
                args: {
                    relaxedSecurity: true,
                    log: "./logs/appium.log",
                },
            },
        ],
    ],

    //
    // ============
    // Capabilities
    // ============
    capabilities,

    //
    // =====
    // Hooks
    // =====
    before: async () => {
        if (driver.isAndroid) {
            await driver.updateSettings({
                waitForSelectorTimeout: 3 * 1000,
            });
        }
    },

    beforeScenario: async () => {
        try {
            await driver.startRecordingScreen();
        } catch (err) {
            console.warn("Failed to start recording, ignored:", err);
        }
    },

    afterScenario: async function () {
        try {
            const video = await driver.stopRecordingScreen();
            if (video) {
                const videoBuffer = Buffer.from(video, "base64");
                allure.addAttachment("Test Video", videoBuffer, "video/mp4");
            } else {
                console.log("No video recorded or empty buffer.");
            }
        } catch (err) {
            console.warn("Stop recording failed, ignored. Reason:", err);
        }
    },
    afterStep: async function (_test, _context, { error }) {
        if (error) {
            try {
                const screenshot = await driver.takeScreenshot();
                allure.addAttachment(
                    "Failure Screenshot",
                    Buffer.from(screenshot, "base64"),
                    "image/png",
                );
            } catch (err) {
                console.warn("Take screenshot failed (ignored):", err);
            }
        }
    },

    //
    // ============
    // Reporters
    // ============
    reporters: [
        "spec",
        [
            "allure",
            {
                outputDir: "allure-results",
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
                useCucumberStepReporter: true,
            },
        ],
    ],
};
