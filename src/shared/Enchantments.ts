import Object from "@rbxts/object-utils";
import { Enchantment } from "./types/EnchantmentTypes";

// Create a list of the enchantment names
const EnchantmentStringNames = [
    "Bottomless Pit", "Consumer", "Nimble", "Colossus Slayer", "Ferverous", "Drunken Brawler",
    "Finesse", "Adamant", "Dynamo", "Snowforged", "Quick Hands", "Adrenaline", "Blade Dancer",
    "Come at Me", "Conservative", "Blade Throw", "Final Image", "Perfectionist", "Rhythmic Sense",
    "Nightstalker", "Heartseeker", "Sturdy", "Deadweight", "Athletic", "Fit", "Relentless Endurance",
    "Miner", "Lumberjack", "Angler", "Lucky", "Productive", "Jack of All Trades", "Controlled Chaos",
    "Shot Caller", "Clockwork", "Inspiring", "Kingpin", "Engineer", "Natural Leader", "Field Technician",
    "Overcharged", "Stalwart's Resolve", "Diamond Skin", "Charismatic", "Silver Tongue", "Strongheart",
    "Influencer", "Vital Surge", "Urban Tracker", "Bounty Hunter", "Brave", "Vicious Precision", "Lethal Striker",
    "Double Time"
] as const;

// Create a union of the enchantment names
export type EnchantmentNames = typeof EnchantmentStringNames[number];

// Creeate a record of the enchantment names
const Enchantments = EnchantmentStringNames.reduce((obj, name) => {
    obj[name] = name;
    return obj;
}, {} as Record<EnchantmentNames, EnchantmentNames>);

const EnchantmentMetaData = {
    /***********************************
     *                                 *
     *     Wall Maria Enchantments     *
     *                                 *
     ***********************************/
    [Enchantment.Walls.Maria]: [
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Bottomless Pit"],
            [Enchantment.Key.Description]: "Your stomach is twice as big.",
            [Enchantment.Key.Id]: 0,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["2.0x stomach size"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },

        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Consumer"],
            [Enchantment.Key.Description]: "The food and water that you consume is more impactful to your stomach, but food must be cooked before consumption.",
            [Enchantment.Key.Id]: 1,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Food gain 1.5x"],
            [Enchantment.Key.Negatives]: ["Consumed food must be cooked."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Nimble"],
            [Enchantment.Key.Description]: "You've become accustomed to your gear and are able to utilize your gear speed more effectively, although consume more gas.",
            [Enchantment.Key.Id]: 2,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Gear,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [14],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.05x gear speed."],
            [Enchantment.Key.Negatives]: ["1.08x gas consumption."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Colossus Slayer"],
            [Enchantment.Key.Description]: "You have been able to excel in combat techniques against titans, and thus able to exploit the vulnerabilities of these colossal adversaries.",
            [Enchantment.Key.Id]: 3,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Titan,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [4],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.1x titan damage dealt"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Ferverous"],
            [Enchantment.Key.Description]: "Infused with an indomitable spirit, you're able to withstand partial damage that titans inflict.",
            [Enchantment.Key.Id]: 4,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Titan,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [3],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.05x titan damage reduction"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Drunken Brawler"],
            [Enchantment.Key.Description]: "Your unorthodox fighting style blends unpredictable maneuvers with raw strength.",
            [Enchantment.Key.Id]: 5,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Outgoing first damage increased by 1.06x"],
            [Enchantment.Key.Negatives]: ["Recieved fist damage is increased by 1.06x"],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Finesse"],
            [Enchantment.Key.Description]: "Your unparalleled agility and mastery of evasive maneuvers have allowed you to outmaneuver the grasp of a titan unscathed.",
            [Enchantment.Key.Id]: 6,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Epic,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Titan,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [2],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Be able to counter a titans grab"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [1],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Adamant"],
            [Enchantment.Key.Description]: "Your unwavering determination in the face of adversity grants you the resilience to continue your legacy.",
            [Enchantment.Key.Id]: 7,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Legendary,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [16],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Every percentage of health below 30% grants you a 0.5% damage reduction."],
            [Enchantment.Key.Negatives]: ["Future injuries are critical."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Dynamo"],
            [Enchantment.Key.Description]: "Infused with an inner warmth, you are able to resist the biting chill of cold conditions.",
            [Enchantment.Key.Id]: 8,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [9],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["You are 1.15x less susceptible to the cold."],
            [Enchantment.Key.Negatives]: ["You move slower in the cold."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Snowforged"],
            [Enchantment.Key.Description]: "With a heart of ice, you are able to resist the hot environmental coniditions.",
            [Enchantment.Key.Id]: 9,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [8],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["You are 1.15x less susceptible to the heat."],
            [Enchantment.Key.Negatives]: ["You move slower in hot environments."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Quick Hands"],
            [Enchantment.Key.Description]: "You have a great understanding of firearms and are able to reload them with haste.",
            [Enchantment.Key.Id]: 10,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["You reload all firearms 1.15x faster."],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Adrenaline"],
            [Enchantment.Key.Description]: "You give yourself a spurt of adrenaline to further your stamina.",
            [Enchantment.Key.Id]: 11,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Recharge a portion of your stamina."],
            [Enchantment.Key.Negatives]: ["Your stamina empties after 15 seconds."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [1],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Blade Dancer"],
            [Enchantment.Key.Description]: "Your acute perception of the melodies of the battlefield allows you to mimic the rhythm of war.",
            [Enchantment.Key.Id]: 12,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.1x damage to titans."],
            [Enchantment.Key.Negatives]: ["0.9x damage to humans."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Come at Me"],
            [Enchantment.Key.Description]: "With a scream of confidence, you taunt the titans.",
            [Enchantment.Key.Id]: 13,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Titan,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Nearby titans attract to you."],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [1],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Conservative"],
            [Enchantment.Key.Description]: "You've understood the fundamentals of your gear and are able to conserve your gas more effectively, although become slower.",
            [Enchantment.Key.Id]: 14,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Gear,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [3],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["0.95x gas usage"],
            [Enchantment.Key.Negatives]: ["0.96x gear speed"],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Blade Throw"],
            [Enchantment.Key.Description]: "You've mastered the technique of tossing while detaching your blades, enabling you to throw them.",
            [Enchantment.Key.Id]: 15,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Gear,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["You're able to now throw the blades that are on your ODMG"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [1],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Final Image"],
            [Enchantment.Key.Description]: "Your unwavering will power in the face of disaster grants you the resilience to continue your legacy.",
            [Enchantment.Key.Id]: 16,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Legendary,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [7],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Every percentage of health below 30% grants you a 0.5% damage multiplier."],
            [Enchantment.Key.Negatives]: ["All injuries are more critical after this enchant activates."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Perfectionist"],
            [Enchantment.Key.Description]: "Flaws in this world bug you, as such, any imperfections about you cause you to under-perform.",
            [Enchantment.Key.Id]: 17,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Legendary,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["At full health, gain 1.05x damage boost"],
            [Enchantment.Key.Negatives]: ["At any other health, you are weakened by 1.10x"],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Rhythmic Sense"],
            [Enchantment.Key.Description]: "You've become attuned with intuition itself, and through the rhythm of your attacks you are able to discern the wounds of your adversary.",
            [Enchantment.Key.Id]: 18,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Epic,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Ability to see how injured an individual is through attacking them."],
            [Enchantment.Key.Negatives]: ["At any other health, you are weakened by 1.10x"],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Nightstalker"],
            [Enchantment.Key.Description]: "Your nocturnal presence dominates your life as you perform better at night.",
            [Enchantment.Key.Id]: 19,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Epic,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["You have a 1.05x damage boost at night"],
            [Enchantment.Key.Negatives]: ["In the daylight, you are weakened by 1.05x"],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Heartseeker"],
            [Enchantment.Key.Description]: "With heightened intuition, you're able to close your eyes and detect the heartbeat of individuals nearby.",
            [Enchantment.Key.Id]: 20,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Mythic,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["See the heartbeat of individuals nearby."],
            [Enchantment.Key.Negatives]: ["You are blinded for 5 seconds", "You gain permanent blindness everytime you utilize Heartseeker."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [1],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Sturdy"],
            [Enchantment.Key.Description]: "You stand tall like a castle, and are able to take a substantial blow.",
            [Enchantment.Key.Id]: 21,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Ragdolling duration is halved."],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Deadweight"],
            [Enchantment.Key.Description]: "You're able to control your breathing and act limp, creating a masquarade of death.",
            [Enchantment.Key.Id]: 22,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Rragdoll and play dead at your own will."],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [1],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Athletic"],
            [Enchantment.Key.Description]: "You've trained and as a result notice yourself becoming faster.",
            [Enchantment.Key.Id]: 23,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Run speed increased by 6%"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Fit"],
            [Enchantment.Key.Description]: "You've become accustomed to running and are able to run for longer periods of time.",
            [Enchantment.Key.Id]: 24,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["No longer require stamina to run."],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Relentless Endurance"],
            [Enchantment.Key.Description]: "Harness your inner strength to push yourself beyond your limits, but at a cost.",
            [Enchantment.Key.Id]: 25,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Maria,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Legendary,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [11],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["You have no stamina drain for 5 seconds."],
            [Enchantment.Key.Negatives]: ["Afterwards stamina regeneration stops for 15 seconds."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [1],
        },
    ] as Enchantment.Type[],

    /***********************************
     *                                 *
     *      Wall Rose Enchantments     *
     *                                 *
     ***********************************/

    [Enchantment.Walls.Rose]: [
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Miner"],
            [Enchantment.Key.Description]: "You've become a seasoned miner and are able to see weakpoints within the rock.",
            [Enchantment.Key.Id]: 0,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Craftsmanship,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.15x mining speed"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Lumberjack"],
            [Enchantment.Key.Description]: "You've become a seasoned woodfeller and are able to see weakpoints within the grain of wood.",
            [Enchantment.Key.Id]: 1,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 1,
            [Enchantment.Key.Category]: Enchantment.Category.Craftsmanship,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.15x chopping speed"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Angler"],
            [Enchantment.Key.Description]: "You've become a seasoned angler and are able to utilize your knowledge to help fish.",
            [Enchantment.Key.Id]: 2,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Craftsmanship,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.15x fishing chance"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Lucky"],
            [Enchantment.Key.Description]: "You've realized that the boon of fortune is on your side.",
            [Enchantment.Key.Id]: 3,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Craftsmanship,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [0, 1, 2],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["There is a percent chance that the resources you gather are doubled."],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Double Time"],
            [Enchantment.Key.Description]: "There's no time to waste with you! You excel at production and thus are able to produce more.",
            [Enchantment.Key.Id]: 4,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Craftsmanship,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.15x crafting speed"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Productive"],
            [Enchantment.Key.Description]: "You're constantly productive and thus are able to produce more accurately.",
            [Enchantment.Key.Id]: 5,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Craftsmanship,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.10x crafting success rate"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Jack of All Trades"],
            [Enchantment.Key.Description]: "With strategic decision-making and resource management, you're able to use your knowledge to optimize your creations.",
            [Enchantment.Key.Id]: 6,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Craftsmanship,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.15x crafting XP rate"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Controlled Chaos"],
            [Enchantment.Key.Description]: "A catalyst of synergy and coordination is born. Through your strategic foresight and leadership, you are able to inspire your allies.",
            [Enchantment.Key.Id]: 7,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Epic,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Leadership,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [8],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["0.95x gas usage [AOE]"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Shot Caller"],
            [Enchantment.Key.Description]: "You are able to rally to a cause, granting positive bonuses for your allies.",
            [Enchantment.Key.Id]: 8,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Epic,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Leadership,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [7],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.08x gear speed [AOE]"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Clockwork"],
            [Enchantment.Key.Description]: "Through your innate efficiency and precision with the passion for crafting, you're motivated to complete your projects with haste.",
            [Enchantment.Key.Id]: 9,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Craftsmanship,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [4],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.1x crafting speed"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Inspiring"],
            [Enchantment.Key.Description]: "Through your exuding confidence and commanding prescence, you inspire your allies to craft with unprecedented speed.",
            [Enchantment.Key.Id]: 10,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Leadership,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [4, 5, 8],
            [Enchantment.Key.Lock]: [11],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.05x crafting speed [AOE]"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Kingpin"],
            [Enchantment.Key.Description]: "Through your unwavering determination and authoritive prescence, you inspire your allies to craft with precision.",
            [Enchantment.Key.Id]: 11,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Rare,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Leadership,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [4, 5, 8],
            [Enchantment.Key.Lock]: [10],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.05x crafting success rate [AOE]"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Engineer"],
            [Enchantment.Key.Description]: "Through unparalled structure testing, you're able to fortify the structures you create more effectively.",
            [Enchantment.Key.Id]: 12,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Craftsmanship,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.15x structure health"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Natural Leader"],
            [Enchantment.Key.Description]: "Through the rooted confidence that you have grown to know, you are able to rally your allies more effectively.",
            [Enchantment.Key.Id]: 13,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Legendary,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Leadership,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["All ally positive AOE effects are 1.15x more effective."],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Field Technician"],
            [Enchantment.Key.Description]: "You've become accustomed on how to resupply yourself in the battlefield.",
            [Enchantment.Key.Id]: 14,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Common,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Gear,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["1.15x faster resupply"],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Overcharged"],
            [Enchantment.Key.Description]: "You are able to exert your gear past the known boundaries.",
            [Enchantment.Key.Id]: 15,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Rose,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Epic,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Gear,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Once per event, you have 1.15x gear speed for 45 seconds."],
            [Enchantment.Key.Negatives]: ["During this time, you also have 0.95x grapple range.", "After the duration, you are unable to use gear for 15 seconds."],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [1],
        },
    ] as Enchantment.Type[],

    /***********************************
     *                                 *
     *      Wall Sina Enchantments     *
     *                                 *
     ***********************************/

    [Enchantment.Walls.Sina]: [
        {
            // Name, description, and id
            [Enchantment.Key.Name]: Enchantments["Silver Tongue"],
            [Enchantment.Key.Description]: "Your persuasive manner and way with words allows you to barter for the best deal.",
            [Enchantment.Key.Id]: 0,

            // Wall, rarity, obtained, and category
            [Enchantment.Key.Wall]: Enchantment.Walls.Sina,
            [Enchantment.Key.Rarity]: Enchantment.Rarity.Uncommon,
            [Enchantment.Key.Obtained]: 0,
            [Enchantment.Key.Category]: Enchantment.Category.Human,

            // Requirements and locks
            [Enchantment.Key.Requirements]: [],
            [Enchantment.Key.Lock]: [],

            // Positive and negative effects
            [Enchantment.Key.Positives]: ["Enables the player to barter for better deals."],
            [Enchantment.Key.Negatives]: [],

            // Used internally to store metadata, such as a players localized
            // enchantment levels, or other data. This can be ignored.
            [Enchantment.Key.MetaData]: [0],
        },
    ] as Enchantment.Type[],
}

export namespace EnchantmentUtilities {
    export function getEnchantmentFromName(name: EnchantmentNames): Enchantment.Type | undefined {
        // Get the enchantment metadata from name
        // Loop through the EnchantmentMetaData object, and find the enchantment with the name
        for (const [wall, enchantments] of Object.entries(EnchantmentMetaData)) {
            for (const enchantment of enchantments) {
                if (enchantment[Enchantment.Key.Name] === name) {
                    return enchantment;
                }
            }
        }
    }

    export function getEnchantmentColor(rarity: number) {
        switch (rarity) {
            case Enchantment.Rarity.Common: return Color3.fromRGB(255, 255, 255);
            case Enchantment.Rarity.Uncommon: return Color3.fromRGB(194, 255, 180);
            case Enchantment.Rarity.Rare: return Color3.fromRGB(133, 176, 255);
            case Enchantment.Rarity.Epic: return Color3.fromRGB(255, 162, 164);
            case Enchantment.Rarity.Legendary: return Color3.fromRGB(255, 170, 114);
            case Enchantment.Rarity.Mythic: return Color3.fromRGB(219, 89, 255);
        }

        return Color3.fromRGB(255, 255, 255);
    }

    export function getEnchantmentRarity(rarity: number) {
        switch (rarity) {
            case Enchantment.Rarity.Common: return "Common";
            case Enchantment.Rarity.Uncommon: return "Uncommon";
            case Enchantment.Rarity.Rare: return "Rare";
            case Enchantment.Rarity.Epic: return "Epic";
            case Enchantment.Rarity.Legendary: return "Legendary";
            case Enchantment.Rarity.Mythic: return "Mythic";
        }
    }

    export function getEnchantmentWall(rarity: number) {
        switch (rarity) {
            case Enchantment.Walls.Maria: return "Maria";
            case Enchantment.Walls.Rose: return "Rose";
            case Enchantment.Walls.Sina: return "Sina";
        }
    }

    export function formatTimestamp(timestamp: number) {
        const date = os.date("*t", timestamp);;

        let year: string = tostring(date.year);

        // Remove the first two characters from the year
        year = tostring(tostring(date.year).sub(3, 4));

        return `${date.month}/${date.day}/${year}`;
    }
};

export default EnchantmentMetaData;
