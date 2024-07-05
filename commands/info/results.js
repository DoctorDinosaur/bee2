import { SlashCommandBuilder } from "discord.js";
import { getScoreboardData } from "../../util/bbc.js";

export const data = new SlashCommandBuilder()
    .setName("results")
    .setDescription("Get the latest election results");

export async function execute(interaction) {
    console.log("Executing results command");
    let data = await getScoreboardData();

    let scorecards = data.scoreboard.groups[0].scorecards;

    let fields = [];
    for (let i = 0; i < Math.min(scorecards.length, 25); i++) {
        let scorecard = scorecards[i];
        let party = scorecard.title;
        let seats = scorecard.dataColumnsFormatted[0][0];
        let seatsChange = scorecard.dataColumnsFormatted[0][1];
        let votes = scorecard.dataColumnsFormatted[0][2];
        let votesShare = scorecard.dataColumnsFormatted[0][3];
        let votesChange = scorecard.dataColumnsFormatted[0][4];
        fields.push({
            name: party,
            value: `Seats: ${seats} (${seatsChange})\nVotes: ${votes} (${votesShare}, ${votesChange})`,
            inline: true
        });
    }

    let embed = {
        title: "Latest Election Results",
        fields: fields
    };

    await interaction.reply({embeds: [embed], ephemeral: true});
}
