import { SlashCommandBuilder } from "discord.js";
import { getScoreboardData } from "../../util/bbc.js";

export const data = new SlashCommandBuilder()
    .setName("results")
    .setDescription("Get the latest election results");

export async function execute(interaction) {
    try {
        let data = await getScoreboardData();

    let scorecards = data.scoreboard.groups[0].scorecards;

    let fields = [];
    for (let scorecard of scorecards) {
        let party = scorecard.title
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

    await interaction.reply({embeds: [embed]});
    }
    catch (error) {
        console.error(`Failed to get election results: ${error}`);
        await interaction.reply("Failed to get election results");
    }
}
