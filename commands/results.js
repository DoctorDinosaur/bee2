import { SlashCommandBuilder } from "discord.js";
import { getScoreboardData } from "../util/bbc.js";

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPercentage(top, bottom) {
    return `${((top / bottom) * 100).toFixed(2)}%`;
}

function formatTable

export const data = new SlashCommandBuilder()
    .setName("results")
    .setDescription("Get the latest election results");

export async function execute(interaction) {
    let data = await getScoreboardData();

    let scorecard = data
