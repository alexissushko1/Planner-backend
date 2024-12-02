const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");

const emojiList = [
  "🤣",
  "🥲",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🥸",
  "🤩",
  "🥳",
  "😔",
  "🙁",
  "😣",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😠",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "🤗",
  "🤔",
  "🫣",
  "🤭",
  "🫡",
  "🤫",
  "🫠",
  "😐",
  "😬",
  "🙄",
  "😧",
  "🥱",
  "😴",
  "🤤",
  "😪",
  "😵",
  "😵‍💫",
  "🤐",
  "🥴",
  "🤢",
  "😷",
  "🤧",
  "🤒",
  "🤕",
  "🤠",
  "👻",
  "👽",
  "🤖",
  "🎃",
  "😺",
  "😸",
  "😹",
  "😻",
  "🙀",
  "😿",
  "🫶",
  "👐",
  "🙌",
  "👏",
  "🤝",
  "👍",
  "👎",
  "👌",
  "👋",
  "💪",
  "🙏",
  "💄",
  "👀",
  "👶",
  "🎅",
  "🥷",
  "👼",
  "💁‍♀️",
  "💁‍♂️",
  "🙅‍♀️",
  "🙅‍♂️",
  "🙋‍♀️",
  "🙋‍♂️",
  "🤦‍♀️",
  "🤦‍♂️",
  "🤷‍♀️",
  "🤷‍♂️",
  "💅",
  "💃",
  "🕺",
  "🧶",
  "🧵",
  "👑",
  "💍",
  "👓",
  "🕶️",
  "🌂",
  "🐶",
  "🐱",
  "🐛",
  "🦋",
];

const stickyNoteContent = "Type your note here...";

const seedUsers = async (numUsers = 5) => {
  const users = Array.from({ length: numUsers }, () => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }));

  //Add users into the database
  const createdUsers = await prisma.user.createMany({ data: users });
  const userIds = await prisma.user
    .findMany()
    .then((users) => users.map((user) => user.id));

  //Create sticker data with emojis and sticky note per user
  const stickersData = userIds.flatMap((userId) => {
    const emojis = emojiList.map((emoji, index) => ({
      userId,
      content: emoji,
      positionX: Math.floor(Math.random() * 1000),
      positionY: Math.floor(Math.random() * 1000),
      width: 150 + (index % 3) * 50,
      height: 150 + (index % 3) * 50,
      color: "#FFFFFF",
      zIndex: index,
    }));

    // Add a sticky note for each user
    const stickyNote = {
      userId,
      content: stickyNoteContent,
      positionX: 300,
      positionY: 300,
      width: 300,
      height: 300,
      color: "Y#FFEB3B",
      zIndex: emojiList.length,
    };

    return [...emojis, stickyNote];
  });

  //Insert stickers into datanbase
  await prisma.sticker.createMany({ data: stickersData });

  //Delete console log later on

  console.log(
    ` Created ${numUsers} users and ${stickersData.length} stickers.`
  );

  // Sticker Settings

  const stickersSettingsData = [
    {
      userId: 1,
      defaultColor: "blue",
      defaultSizeWidth: 100,
      defaultSizeHeight: 100,
    },
    {
      userId: 2,
      defaultColor: "pink",
      defaultSizeWidth: 100,
      defaultSizeHeight: 100,
    },
    {
      userId: 3,
      defaultColor: "green",
      defaultSizeWidth: 60,
      defaultSizeHeight: 60,
    },
    {
      userId: 4,
      defaultColor: "purple",
      defaultSizeWidth: 40,
      defaultSizeHeight: 40,
    },
    {
      userId: 5,
      defaultColor: "yellow",
      defaultSizeWidth: 50,
      defaultSizeHeight: 50,
    },
  ];

  //Insert sticker settings into datanbase
  await prisma.stickerSetting.createMany({ data: stickersSettingsData });

  //Create data for calendar events

  const calendarData = [
    {
      userId: 1,
      eventName: "Doctor's Appointment",
      eventDate: "2024-12-05T17:00:00Z",
      description: "Eye doctor appointment with Dr.Thomas.",
    },
    {
      userId: 2,
      eventName: "Birthday Party",
      eventDate: "2025-03-20T19:30:00Z",
      description: "Ellie's 5th birthday party.",
    },
    {
      userId: 3,
      eventName: "5k",
      eventDate: "2025-01-03T09:00:00Z",
      description: "Spartan run with friends.",
    },
    {
      userId: 4,
      eventName: "Comic Con",
      eventDate: "2024-04-05T10:30:00Z",
      description: "Comic Con in Charlotte.",
    },
    {
      userId: 5,
      eventName: "Aruba",
      eventDate: "2025-06-07T08:00:00Z",
      description: "Departure Time from Charlotte to Aruba.",
    },
  ];

  //Insert events into datanbase
  await prisma.calendarEvent.createMany({ data: calendarData });

  //Create data for ToDo Lists

  const todoListData = [
    {
      userId: 1,
      taskName: "Clean the house",
      isCompleted: false,
    },
    {
      userId: 1,
      taskName: "Meal prep",
      isCompleted: true,
    },
    {
      userId: 2,
      taskName: "Grocery Shop",
      isCompleted: false,
    },
    {
      userId: 3,
      taskName: "Call about bill",
      isCompleted: true,
    },
    {
      userId: 4,
      taskName: "Put up Christmas decorations",
      isCompleted: false,
    },
    {
      userId: 5,
      taskName: "Run 1/2 a mile",
      isCompleted: true,
    },
    {
      userId: 5,
      taskName: "Drink 3/4 gallon of water",
      isCompleted: false,
    },
  ];

  //Insert to dos into datanbase
  await prisma.toDoList.createMany({ data: todoListData });

  //Create reflection survey data

  const reflectionData = [
    {
      userId: 1,
      question: "On a scale from 1-5 how do you feel today?",
      answer: "4",
    },
    {
      userId: 2,
      question: "On a scale from 1-5 how do you feel today?",
      answer: "5",
    },
    {
      userId: 3,
      question: "On a scale from 1-5 how do you feel today?",
      answer: "2",
    },
    {
      userId: 4,
      question: "On a scale from 1-5 how do you feel today?",
      answer: "4",
    },
    {
      userId: 5,
      question: "On a scale from 1-5 how do you feel today?",
      answer: "5",
    },
  ];

  //Insert reflection surveys into datanbase
  await prisma.reflectionSurvey.createMany({ data: reflectionData });

  //Create Shopping List Data

  const shoppingListData = [
    {
      userId: 1,
      itemName: "Blue Tshirt",
      quantity: 2,
      store: "Walmart",
      price: parseFloat(7.5),
    },
    {
      userId: 1,
      itemName: "Black Belt",
      quantity: 1,
      store: "Walmart",
      price: parseFloat(5.75),
    },
    {
      userId: 2,
      itemName: "Notebook",
      quantity: 4,
      store: "Walmart",
      price: parseFloat(2.5),
    },
    {
      userId: 2,
      itemName: "Planner",
      quantity: 1,
      store: "Target",
      price: parseFloat(12.5),
    },
    {
      userId: 2,
      itemName: "Pencil box",
      quantity: 1,
      store: "Walmart",
      price: parseFloat(3.5),
    },
    {
      userId: 2,
      itemName: "Fabric",
      quantity: 2,
      store: "Walmart",
      price: parseFloat(4.0),
    },
    {
      userId: 3,
      itemName: "Hand Soap",
      quantity: 2,
      store: "Target",
      price: parseFloat(2.75),
    },
    {
      userId: 3,
      itemName: "Hair clip",
      quantity: 1,
      store: "Target",
      price: parseFloat(4.5),
    },
    {
      userId: 3,
      itemName: "Purse",
      quantity: 1,
      store: "Target",
      price: parseFloat(20.75),
    },
    {
      userId: 4,
      itemName: "Flowers",
      quantity: 2,
      store: "Trader Joes",
      price: parseFloat(4.5),
    },
    {
      userId: 4,
      itemName: "Fall scented candle",
      quantity: 1,
      store: "Trader Joes",
      price: parseFloat(6.5),
    },
    {
      userId: 5,
      itemName: "Lotion",
      quantity: 1,
      store: "Costco",
      price: parseFloat(7.5),
    },
    {
      userId: 5,
      itemName: "Wreath",
      quantity: 1,
      store: "Costco",
      price: parseFloat(16.5),
    },
  ];
  //Insert grocery shopping lists into datanbase
  await prisma.shoppingList.createMany({ data: shoppingListData });

  //Create journal data

  const journalData = [
    {
      userId: 1,
      entryText: "Saw a cute cat today.",
    },
    {
      userId: 1,
      entryText: "Went to the movies. Glad to spend time with family.",
    },
    {
      userId: 2,
      entryText:
        "Cozy day with rain and book. Thankful for all that God has provided for me.",
    },
    {
      userId: 3,
      entryText: "Christmas decorations up next week... so excited.",
    },
    {
      userId: 4,
      entryText:
        "Spent the day snorkeling in Aruba. Saw a stringray and hope to see sea turtles.",
    },
    {
      userId: 5,
      entryText: "Spent time working on homework and excited for the weekend.",
    },
  ];

  //Insert journal entries into datanbase
  await prisma.journal.createMany({ data: journalData });
};

module.exports = seedUsers;
