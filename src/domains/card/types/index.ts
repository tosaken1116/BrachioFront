/**
 * カードの基本情報を表す型。
 */
export type CardBaseType = {
  /** 一意な識別子 */
  id: string;
  /** カード名 */
  name: string;
  /** カードのレアリティ（数値で評価） */
  rarity: number;
  /** シリーズ内の識別番号 */
  cardNumber: string;
  /** 拡張セットの名称 */
  expansion: string;
  /** カード画像のURL */
  imageUrl: string;
};

/**
 * モンスターの属性（タイプ）を表す文字列リテラルのユニオン型。
 */
export type MonsterTypes =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Darkness"
  | "Metal"
  | "Fairy";

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
  type: MonsterTypes;
  /** 弱点の倍率や効果（例: "×2"） */
  value: string;
};

/**
 * カードの攻撃情報を表す型。
 */
export type AttackType = {
  /** 攻撃名 */
  name: string;
  /** 攻撃に必要なエネルギーの種類のリスト */
  cost: MonsterTypes[];
  /** 攻撃のダメージ値（数値だけでなく特殊な表記も含む） */
  damage: string;
  /** 攻撃に関する追加の説明テキスト */
  text: string;
};

/**
 * モンスターカードの詳細情報を表す型。
 * @extends CardBaseType
 */
export type MonsterType = {
  /** カードのスーパーカテゴリーは常に "Monster" */
  cardType: "Monster";
  /** カードの進化段階（Basic, Stage1, Stage2） */
  subType: "Basic" | "Stage1" | "Stage2";
  /** モンスターの属性（タイプ） */
  type: MonsterTypes;
  /** モンスターの体力（HP） */
  hp: number;
  /** モンスターが持つ攻撃のリスト */
  skills: AttackType[];
  /** モンスターが持つ特殊能力のリスト */
  abilities: AbilityType[];
  /** モンスターの弱点情報 */
  weakness: MonsterTypes;
  /** バトルから退くためのコスト（エネルギー数など） */
  retreatCost: number;
  /** 進化元のカード名（存在する場合のみ） */
  evolvesFrom?: string;
  /** 進化先のカード名（存在する場合のみ） */
  evolvesTo?: string;
} & CardBaseType;

/**
 * サポーターカードの情報を表す型。
 * @extends CardBaseType
 */
export type SupporterType = {
  /** カードのスーパーカテゴリーは "Supporter" */
  cardType: "Supporter";
  /** サポーターカードの効果や説明文 */
  text: string;
} & CardBaseType;

/**
 * グッズカードの情報を表す型。
 * @extends CardBaseType
 */
export type GoodsType = {
  /** カードのスーパーカテゴリーは "Goods" */
  cardType: "Goods";
  /** グッズカードの効果や説明文 */
  text: string;
} & CardBaseType;

/**
 * モンスター、サポーター、グッズのいずれかのカード型を表すユニオン型。
 */
export type MonsterCardType = MonsterType | SupporterType | GoodsType;
