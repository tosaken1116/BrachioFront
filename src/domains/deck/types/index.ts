import type {
	EnergyType,
	MasterCardType,
	MonsterCardType,
} from "../../card/types";

export type Deck = {
	id: string;
	name: string;
	energies: EnergyType[];
	cards: MasterCardType[];
	color: EnergyType;
	thumbnailCard: MasterCardType;
};

export type BattleDeck = {
	id: string;
	name: string;
	energies: EnergyType[];
	cards: MonsterCardType[];
	color: EnergyType;
	thumbnailCard: MasterCardType;
};
