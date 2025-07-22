export async function clickIfElementExists(selector: string, timeout = 3000) {
    try {
        console.log(`Checking element existence: ${selector}`);

        const element = await $(`android=${selector}`);
        const isExisting = await element.waitForExist({ timeout });

        if (isExisting) {
            await element.click();
            console.log(`Clicked element: ${selector}`);
        } else {
            console.log(`Element not found within ${timeout}ms: ${selector}`);
        }
    } catch (error) {
        console.warn(`Error checking or clicking element: ${selector}`, error);
    }
}
