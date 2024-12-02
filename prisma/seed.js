const prisma = require("../prisma");
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

const seed = async (numUsers = 5) => {
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

  //Insert stickers into datanbase
  await prisma.stickerSetting.createMany({ data: stickersSettingsData });
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
