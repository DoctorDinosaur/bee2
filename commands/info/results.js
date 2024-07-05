import { SlashCommandBuilder } from "discord.js";
import { getScoreboardData } from "../../util/bbc.js";

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPercentage(number) {
    return `${number.toFixed(1)}%`;
}

export const data = new SlashCommandBuilder()
    .setName("results")
    .setDescription("Get the latest election results");

export async function execute(interaction) {
    console.log("Executing results command");
    let data = await getScoreboardData();

    let scorecards = data.scoreboard.groups[0].scorecards;

    let fields = [];
    let otherSeats = 0;
    let otherVotes = 0;
    let otherShare = 0;
    let otherSwing = 0.0;

    for (let i = 0; i < Math.min(scorecards.length, 5); i++) {
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

    for (let i = 5; i < scorecards.length; i++) {
        let scorecard = scorecards[i];
        let seats = scorecard.dataColumns[0][0];
        let votes = scorecard.dataColumns[0][2];
        let share = scorecard.dataColumns[0][3];
        let swing = scorecard.dataColumns[0][4];
        otherSeats += seats;
        otherVotes += votes;
        otherShare += share;
        otherSwing += swing;
    }

    otherSeats = formatNumber(otherSeats);
    otherVotes = formatNumber(otherVotes);
    otherShare = formatPercentage(otherShare);

    fields.push({
        name: "Other",
        value: `Seats: ${otherSeats}\nVotes: ${otherVotes} (${otherShare}, ${otherSwing})`,
        inline: true
    });

    let embed = {
        title: "Latest Election Results",
        fields: fields
    };

    await interaction.reply({embeds: [embed], ephemeral: true});
}
