import { getConstituencyData } from "../util/bbc.js";
import { state } from "../util/state.js";

export const name = "seats";
export const schedule = "*/1 * * * *"; 

export async function task(sendToNotificationChannels) {
    let update_date = new Date();
    console.log(update_date.toLocaleTimeString() + " Running cron job: seats");
    
    let data = await getConstituencyData();
    let previous_data = await state.get("seats_data");
    if (!previous_data) {
        previous_data = data;
    }

    if (data.campaignMode === false && previous_data.campaignMode === true) {
        console.log("Campaign mode has ended");
        sendToNotificationChannels({description: '## Campaign mode has ended, BBC Data'});
    }

    if (!data.groups) {
        console.log(update_date.toLocaleTimeString() + " No data on constituency groups found in response");
        return;
    }

    for (let group of data.groups) {
        for (let card of group.cards) {
            let winnerFlash = card.winnerFlash;
            let previousWinnerFlash = previous_data.groups.find(g => g.id === group.id).cards.find(c => c.title === card.title).winnerFlash;

            // winnerFlash has changed into new data containing winner
            if (winnerFlash !== null && previousWinnerFlash === null) {
                console.log(`New winner found in ${card.title}`);
                let code = card.href.split("/").pop();
                let constituencyData = await getConstituencyDataByCode(code);

                // Construct embed fields
                let fields = [];
                for (let scorecard of constituencyData.scoreboard.groups[0].scorecards) {
                    let party = scorecard.superTitle;
                    let candidate = scorecard.title;
                    let votes = scorecard.dataColumnsFormatted[0][0];
                    let percentage = scorecard.dataColumnsFormatted[0][1];
                    let change = scorecard.dataColumnsFormatted[0][2];
                    fields.push({
                        name: party,
                        value: `${candidate}\nVotes: ${votes}\nShare: ${percentage} (${change})`
                    });
                }

                    
                sendToNotificationChannels({
                    author: 'UK General Election 2024', 
                    title: `Result: ${card.title}`, 
                    titleUrl: `https://www.bbc.co.uk${card.href}`, 
                    color: winnerFlash.newColour || '', 
                    description: winnerFlash.flash, 
                    footer: 'BBC Data',
                    fields: fields})
            }
        }
    }

    await state.set("seats_data", data);

    console.log((new Date()).toLocaleTimeString() + " Finished seats update from " + update_date.toLocaleTimeString());
}