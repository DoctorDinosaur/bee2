import { getScoreboardData } from "../util/bbc.js";
import { state } from "../util/state.js";

export const name = "scores";
export const schedule = "*/1 * * * *"; 

export async function task(sendToNotificationChannels) {
    let update_date = new Date();
    console.log(update_date.toLocaleTimeString() + " Running cron job: seats");
    
    let data = await getScoreboardData();

    await state.set("scores_data", data);

    console.log((new Date()).toLocaleTimeString() + " Finished scores update from " + update_date.toLocaleTimeString());
}