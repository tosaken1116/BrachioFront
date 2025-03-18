export type MasterCard = {
	/**  */
	masterCardId: string;
	/** カード名 */
	name: string;
	/** カードのレアリティ（数値で評価） */
	rarity: number;
	/** 拡張セットの名称 */
	expansion: string;
	/** カード画像のURL */
	imageUrl: string;
};

/**
 * カードの基本情報を表す型。
 */
export type CardBaseType = {
	/** 一意な識別子 */
	id: string;
} & MasterCard;

/**
 * モンスターの属性（タイプ）を表す文字列リテラルのユニオン型。
 */
export type EnergyType =
	| "muscle"
	| "knowledge"
	| "money"
	| "popularity"
	| "alchohol"
	| "null";
export const energyTypeList: EnergyType[] = [
	"muscle",
	"knowledge",
	"money",
	"popularity",
	"alchohol",
	"null",
];

/**
 * モンスターやサポートカードなどに付随する能力の情報を表す型。
 */
export type AbilityType = {
	/** 能力の名前 */
	name: string;
	/** 能力の詳細な説明文 */
	text: string;
};

/**
 * カードの弱点情報を表す型。
 */
export type Weakness = {
	/** 弱点となるモンスタータイプ */
	type: EnergyType;
	/** 弱点の倍率や効果（例: "×2"） */
	value: string;
};

/**
 * カードの攻撃情報を表す型。
 */
export type AttackType = {
	/** 攻撃名 */
	name: string;
	/** 攻撃に関する追加の説明テキスト */
	text: string;
	/** 攻撃に必要なエネルギーの種類のリスト */
	cost: EnergyType[];
	/** 攻撃のダメージ値 */
	damage: number;
	/** 攻撃の追加効果（例: "x" または "+"） */
	damageOption?: "x" | "+";
};

/**
 * モンスターカードの詳細情報を表す型。
 * @extends CardBaseType
 */
export type MonsterTypeBase = {
	/** カードのスーパーカテゴリーは常に "Monster" */
	cardType: "monster";
	/** カードの進化段階（Basic, stage1, Stage2） */
	subType: "basic" | "stage1" | "stage2";
	/** モンスターの属性（タイプ） */
	element: EnergyType;
	/** モンスターの体力（HP） */
	hp: number;
	/** モンスターが持つ攻撃のリスト */
	skills: AttackType[];
	/** モンスターが持つ特殊能力のリスト */
	ability?: AbilityType;
	/** モンスターの弱点情報 */
	weakness: EnergyType;
	/** バトルから退くためのコスト（エネルギー数など） */
	retreatCost: number;
	/** 進化元のカード名（存在する場合のみ） */
	evolvesFrom?: string[];
	/** 進化先のカード名（存在する場合のみ） */
	evolvesTo?: string[];
};
export type MonsterType = MonsterTypeBase & CardBaseType;
export type MonsterMasterType = MasterCard & MonsterTypeBase;
/**
 * サポーターカードの情報を表す型。
 * @extends CardBaseType
 */
type SupporterTypeBase = {
	/** カードのスーパーカテゴリーは "Supporter" */
	cardType: "supporter";
	/** サポーターカードの効果や説明文 */
	text: string;
};

export type SupporterType = SupporterTypeBase & CardBaseType;
export type SupporterMasterType = SupporterTypeBase & MasterCard;
/**
 * グッズカードの情報を表す型。
 * @extends CardBaseType
 */
type GoodsTypeBase = {
	/** カードのスーパーカテゴリーは "Goods" */
	cardType: "goods";
	/** グッズカードの効果や説明文 */
	text: string;
};

export type GoodsType = GoodsTypeBase & CardBaseType;
export type GoodsMasterType = GoodsTypeBase & MasterCard;
/**
 * モンスター、サポーター、グッズのいずれかのカード型を表すユニオン型。
 */
export type MonsterCardType = MonsterType | SupporterType | GoodsType;

export type MasterCardType =
	| (MonsterTypeBase & MasterCard)
	| (SupporterTypeBase & MasterCard)
	| (GoodsTypeBase & MasterCard);
