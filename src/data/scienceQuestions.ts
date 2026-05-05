export type ScienceTopic =
  | "life-science"
  | "earth-science"
  | "physical-science"
  | "space-science"
  | "science-practices";

export type ScienceQuestion = {
  id: string;
  level: number;
  topic: ScienceTopic;
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
};

export type ScienceLevel = {
  level: number;
  title: string;
  description: string;
  topic: ScienceTopic;
};

export const scienceLevels: ScienceLevel[] = [
  { level: 1, title: "Nature Basics", description: "Living things, plants, animals, and habitats", topic: "life-science" },
  { level: 2, title: "Matter and Materials", description: "Solids, liquids, gases, properties, and changes", topic: "physical-science" },
  { level: 3, title: "Energy and Motion", description: "Light, sound, heat, forces, magnets, and electricity", topic: "physical-science" },
  { level: 4, title: "Earth and Weather", description: "Rocks, soil, erosion, weather, and the water cycle", topic: "earth-science" },
  { level: 5, title: "Space and Systems", description: "Sun, Moon, Earth, ecosystems, and food chains", topic: "space-science" },
];

export const scienceQuestions: ScienceQuestion[] = [
  { id: "sci-l1-001", level: 1, topic: "life-science", question: "Which of these is a living thing?", choices: ["Rock", "Cloud", "Oak tree", "Pencil"], correctAnswer: "Oak tree", explanation: "An oak tree is living because it grows, uses energy, and needs water and sunlight." },
  { id: "sci-l1-002", level: 1, topic: "life-science", question: "What do most plants need to make their own food?", choices: ["Moonlight", "Sunlight", "Sand", "Plastic"], correctAnswer: "Sunlight", explanation: "Plants use sunlight, water, and air to make food through photosynthesis." },
  { id: "sci-l1-003", level: 1, topic: "life-science", question: "Which animal habitat is best for a fish?", choices: ["Desert", "Forest", "Pond", "Mountain top"], correctAnswer: "Pond", explanation: "Fish live in water, so a pond is a good habitat." },
  { id: "sci-l1-004", level: 1, topic: "life-science", question: "What is one basic need of all animals?", choices: ["Video games", "Food", "Shoes", "Paint"], correctAnswer: "Food", explanation: "Animals need food for energy." },
  { id: "sci-l1-005", level: 1, topic: "life-science", question: "Which body part helps birds fly?", choices: ["Fins", "Wings", "Hooves", "Antennae"], correctAnswer: "Wings", explanation: "Birds use wings to fly." },
  { id: "sci-l1-006", level: 1, topic: "life-science", question: "Why do animals need shelter?", choices: ["To stay safe", "To turn into plants", "To make rocks", "To stop drinking water"], correctAnswer: "To stay safe", explanation: "Shelter helps animals stay safe from weather and predators." },
  { id: "sci-l1-007", level: 1, topic: "life-science", question: "Which of these is nonliving?", choices: ["Dog", "Grass", "Mushroom", "Chair"], correctAnswer: "Chair", explanation: "A chair does not grow, breathe, or need energy." },
  { id: "sci-l1-008", level: 1, topic: "life-science", question: "What part of a plant usually takes in water from the soil?", choices: ["Flower", "Stem", "Roots", "Leaf"], correctAnswer: "Roots", explanation: "Roots absorb water and nutrients from soil." },
  { id: "sci-l1-009", level: 1, topic: "life-science", question: "A group of the same kind of animals living in one area is called a:", choices: ["Population", "Weather map", "Mineral", "Shadow"], correctAnswer: "Population", explanation: "A population is a group of the same kind of living things in an area." },
  { id: "sci-l1-010", level: 1, topic: "life-science", question: "Which of these is a producer?", choices: ["Grass", "Rabbit", "Fox", "Worm"], correctAnswer: "Grass", explanation: "Plants are producers because they make their own food." },
  { id: "sci-l2-001", level: 2, topic: "physical-science", question: "Which object is a solid?", choices: ["Ice cube", "Steam", "Orange juice", "Air"], correctAnswer: "Ice cube", explanation: "A solid has its own shape." },
  { id: "sci-l2-002", level: 2, topic: "physical-science", question: "Which state of matter takes the shape of its container but has a definite volume?", choices: ["Solid", "Liquid", "Gas", "Light"], correctAnswer: "Liquid", explanation: "A liquid changes shape to fit its container but keeps its volume." },
  { id: "sci-l2-003", level: 2, topic: "physical-science", question: "What happens when water freezes?", choices: ["It becomes a gas", "It becomes ice", "It disappears", "It turns into sand"], correctAnswer: "It becomes ice", explanation: "Freezing changes liquid water into solid ice." },
  { id: "sci-l2-004", level: 2, topic: "physical-science", question: "Which tool can measure temperature?", choices: ["Ruler", "Thermometer", "Balance scale", "Compass"], correctAnswer: "Thermometer", explanation: "A thermometer measures temperature." },
  { id: "sci-l2-005", level: 2, topic: "physical-science", question: "Which property describes how something feels?", choices: ["Texture", "Orbit", "Gravity", "Weather"], correctAnswer: "Texture", explanation: "Texture describes if something feels rough, smooth, soft, or hard." },
  { id: "sci-l2-006", level: 2, topic: "physical-science", question: "What is matter?", choices: ["Anything that has mass and takes up space", "Only things that are alive", "Only air", "Only water"], correctAnswer: "Anything that has mass and takes up space", explanation: "Matter is anything that has mass and takes up space." },
  { id: "sci-l2-007", level: 2, topic: "physical-science", question: "Which is an example of a gas?", choices: ["Oxygen", "Book", "Apple", "Ice"], correctAnswer: "Oxygen", explanation: "Oxygen is a gas found in air." },
  { id: "sci-l2-008", level: 2, topic: "physical-science", question: "Melting means:", choices: ["A liquid becomes solid", "A solid becomes liquid", "A gas becomes solid", "A rock becomes alive"], correctAnswer: "A solid becomes liquid", explanation: "Melting changes a solid into a liquid." },
  { id: "sci-l2-009", level: 2, topic: "physical-science", question: "Which object would most likely be magnetic?", choices: ["Iron nail", "Plastic cup", "Wood block", "Rubber band"], correctAnswer: "Iron nail", explanation: "Many objects made of iron or steel are attracted to magnets." },
  { id: "sci-l2-010", level: 2, topic: "physical-science", question: "Which material is usually transparent?", choices: ["Clear glass", "Brick", "Wood", "Cardboard"], correctAnswer: "Clear glass", explanation: "Transparent materials let light pass through clearly." },
  { id: "sci-l3-001", level: 3, topic: "physical-science", question: "What gives Earth most of its light and heat?", choices: ["The Moon", "The Sun", "Clouds", "Rocks"], correctAnswer: "The Sun", explanation: "The Sun provides most of Earth's light and heat." },
  { id: "sci-l3-002", level: 3, topic: "physical-science", question: "Sound is made by:", choices: ["Vibrations", "Shadows", "Gravity only", "Melting"], correctAnswer: "Vibrations", explanation: "Sound happens when objects vibrate." },
  { id: "sci-l3-003", level: 3, topic: "physical-science", question: "What force pulls objects toward Earth?", choices: ["Magnetism", "Gravity", "Electricity", "Friction only"], correctAnswer: "Gravity", explanation: "Gravity pulls objects toward Earth." },
  { id: "sci-l3-004", level: 3, topic: "physical-science", question: "What does a push or pull do to an object?", choices: ["It can change the object's motion", "It always makes it disappear", "It turns it into water", "It stops light"], correctAnswer: "It can change the object's motion", explanation: "A force is a push or pull that can change motion." },
  { id: "sci-l3-005", level: 3, topic: "physical-science", question: "Which is a source of electrical energy?", choices: ["Battery", "Feather", "Rock", "Paper"], correctAnswer: "Battery", explanation: "A battery can provide electrical energy." },
  { id: "sci-l3-006", level: 3, topic: "physical-science", question: "What happens when light hits a mirror?", choices: ["It reflects", "It freezes", "It becomes sound", "It turns into soil"], correctAnswer: "It reflects", explanation: "Mirrors reflect light." },
  { id: "sci-l3-007", level: 3, topic: "physical-science", question: "Friction usually:", choices: ["Slows motion", "Makes objects invisible", "Creates sunlight", "Turns solids into gases"], correctAnswer: "Slows motion", explanation: "Friction is a force that works against motion." },
  { id: "sci-l3-008", level: 3, topic: "physical-science", question: "Which material is a good conductor of electricity?", choices: ["Copper", "Rubber", "Plastic", "Wood"], correctAnswer: "Copper", explanation: "Copper lets electricity flow through it easily." },
  { id: "sci-l3-009", level: 3, topic: "physical-science", question: "What kind of energy do moving objects have?", choices: ["Motion energy", "Sleep energy", "Moon energy", "Color energy"], correctAnswer: "Motion energy", explanation: "Moving objects have motion energy." },
  { id: "sci-l3-010", level: 3, topic: "physical-science", question: "Which item uses light energy?", choices: ["Flashlight", "Pillow", "Spoon", "Brick"], correctAnswer: "Flashlight", explanation: "A flashlight gives off light energy." },
  { id: "sci-l4-001", level: 4, topic: "earth-science", question: "What is weather?", choices: ["The condition of the air at a certain time and place", "The shape of a rock", "The color of a plant", "The distance to the Moon"], correctAnswer: "The condition of the air at a certain time and place", explanation: "Weather describes air conditions like temperature, wind, rain, or clouds." },
  { id: "sci-l4-002", level: 4, topic: "earth-science", question: "What is erosion?", choices: ["The movement of rocks and soil by water, wind, or ice", "A plant making food", "A fish breathing", "A magnet pulling iron"], correctAnswer: "The movement of rocks and soil by water, wind, or ice", explanation: "Erosion moves rocks and soil from one place to another." },
  { id: "sci-l4-003", level: 4, topic: "earth-science", question: "Which is part of the water cycle?", choices: ["Evaporation", "Magnetism", "Photosynthesis only", "Reflection"], correctAnswer: "Evaporation", explanation: "Evaporation is when liquid water changes into water vapor." },
  { id: "sci-l4-004", level: 4, topic: "earth-science", question: "Clouds are made mostly of:", choices: ["Tiny water droplets or ice crystals", "Sand", "Smoke only", "Leaves"], correctAnswer: "Tiny water droplets or ice crystals", explanation: "Clouds form from tiny water droplets or ice crystals in the air." },
  { id: "sci-l4-005", level: 4, topic: "earth-science", question: "Which tool measures wind direction?", choices: ["Wind vane", "Thermometer", "Ruler", "Microscope"], correctAnswer: "Wind vane", explanation: "A wind vane shows the direction the wind is coming from." },
  { id: "sci-l4-006", level: 4, topic: "earth-science", question: "Which natural resource comes from trees?", choices: ["Wood", "Metal", "Sunlight", "Glass"], correctAnswer: "Wood", explanation: "Wood is a natural resource from trees." },
  { id: "sci-l4-007", level: 4, topic: "earth-science", question: "Soil is made of:", choices: ["Small pieces of rock and once-living material", "Only plastic", "Only water", "Only air"], correctAnswer: "Small pieces of rock and once-living material", explanation: "Soil contains broken-down rock and organic material." },
  { id: "sci-l4-008", level: 4, topic: "earth-science", question: "What causes day and night?", choices: ["Earth rotating", "The Sun turning off", "Clouds spinning", "The Moon melting"], correctAnswer: "Earth rotating", explanation: "Earth rotates, causing different parts to face toward or away from the Sun." },
  { id: "sci-l4-009", level: 4, topic: "earth-science", question: "A fossil is:", choices: ["Evidence of an organism that lived long ago", "A type of weather", "A kind of cloud", "A new planet"], correctAnswer: "Evidence of an organism that lived long ago", explanation: "Fossils are remains or traces of ancient living things." },
  { id: "sci-l4-010", level: 4, topic: "earth-science", question: "Which weather condition means water is falling from clouds?", choices: ["Precipitation", "Rotation", "Reflection", "Friction"], correctAnswer: "Precipitation", explanation: "Precipitation includes rain, snow, sleet, and hail." },
  { id: "sci-l5-001", level: 5, topic: "space-science", question: "What object does Earth orbit?", choices: ["The Sun", "The Moon", "Mars", "A cloud"], correctAnswer: "The Sun", explanation: "Earth travels around the Sun." },
  { id: "sci-l5-002", level: 5, topic: "space-science", question: "The Moon is best described as:", choices: ["A natural satellite of Earth", "A star", "A planet bigger than Earth", "A cloud of gas"], correctAnswer: "A natural satellite of Earth", explanation: "The Moon naturally orbits Earth." },
  { id: "sci-l5-003", level: 5, topic: "space-science", question: "What is a food chain?", choices: ["A model showing how energy moves from one living thing to another", "A list of planets", "A weather report", "A type of magnet"], correctAnswer: "A model showing how energy moves from one living thing to another", explanation: "A food chain shows how living things get energy by eating or being eaten." },
  { id: "sci-l5-004", level: 5, topic: "life-science", question: "Which is usually first in a food chain?", choices: ["Producer", "Top predator", "Decomposer", "Cloud"], correctAnswer: "Producer", explanation: "Producers like plants make their own food and start many food chains." },
  { id: "sci-l5-005", level: 5, topic: "space-science", question: "Why does the Moon appear to change shape?", choices: ["We see different amounts of its lit side", "It actually changes into different objects", "It melts every night", "It moves inside Earth"], correctAnswer: "We see different amounts of its lit side", explanation: "Moon phases happen because we see different parts of the Moon lit by the Sun." },
  { id: "sci-l5-006", level: 5, topic: "space-science", question: "Which planet do we live on?", choices: ["Earth", "Jupiter", "Venus", "Neptune"], correctAnswer: "Earth", explanation: "Earth is our home planet." },
  { id: "sci-l5-007", level: 5, topic: "life-science", question: "What is an ecosystem?", choices: ["Living and nonliving things interacting in an area", "Only the animals in a zoo", "Only water in a pond", "Only clouds in the sky"], correctAnswer: "Living and nonliving things interacting in an area", explanation: "An ecosystem includes living things and nonliving parts of the environment." },
  { id: "sci-l5-008", level: 5, topic: "life-science", question: "What role do decomposers play?", choices: ["They break down dead plants and animals", "They make sunlight", "They stop gravity", "They turn rocks into stars"], correctAnswer: "They break down dead plants and animals", explanation: "Decomposers recycle nutrients by breaking down dead organisms." },
  { id: "sci-l5-009", level: 5, topic: "space-science", question: "Which object is a star?", choices: ["The Sun", "The Moon", "Earth", "A comet tail"], correctAnswer: "The Sun", explanation: "The Sun is a star that gives off light and heat." },
  { id: "sci-l5-010", level: 5, topic: "space-science", question: "Which system includes the Sun, planets, moons, and other objects orbiting the Sun?", choices: ["Solar system", "Digestive system", "Weather system only", "Root system"], correctAnswer: "Solar system", explanation: "The solar system includes the Sun and objects that orbit it." },
];

export function getScienceQuestionsForLevel(level: number) {
  return scienceQuestions.filter((question) => question.level === level);
}

export function getScienceLevel(level: number) {
  return scienceLevels.find((item) => item.level === level);
}
