import { loadFont as loadDisplay } from "@remotion/google-fonts/Outfit";
import { loadFont as loadBody } from "@remotion/google-fonts/Manrope";

const display = loadDisplay("normal", { weights: ["600", "700"], subsets: ["latin"] });
const body = loadBody("normal", { weights: ["400", "600"], subsets: ["latin"] });

export const DISPLAY = display.fontFamily;
export const BODY = body.fontFamily;
