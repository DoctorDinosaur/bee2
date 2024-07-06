# Description
A discord bot that announces UK general election results, as they come in.

Announces to a single channel id from a .env

Scrapes the BBC for results.

Modified from https://github.com/elexnuk/bee2, which is based on https://github.com/elexnuk/bees

# Post-Election Summary
Code worked well.

The /results command could have been streamlined, to display pre-selected party results from the top parties instead of sorting by seat count.

BBC is slow to call but accurate, Sky would have been faster (https://election.news.sky.com/api/elections/get-data?queryKey=ELECTIONS_DATA_QUERY&electionId=2024-07-04-UK_GENERAL&electionType=UK_GENERAL) but they made some wrong calls during the night, which couldn't be corrected in Discord.

Final JSON files are included for examining the schema for use in future elections.
