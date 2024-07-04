import Keyv from "keyv";

export const state = new Keyv("sqlite://data/db.sqlite");