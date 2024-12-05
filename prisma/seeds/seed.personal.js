const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");

const seedPersonal = async (numPasswords = 5) => {
  const passwords = Array.from({ length: numPasswords }, () => ({
    userId: faker.number.int({ min: 1, max: 5 }),
    accountName: faker.internet.displayName(),
    username: faker.internet.username(),
    password: faker.internet.password(),
  }));

  await prisma.personalPassword.createMany({
    data: passwords,
  });

  //Create data for grocery lists
  const groceryListData = [
    {
      userId: 1,
      itemName: "Eggs",
      quantity: 2,
      isPurchased: false,
    },
    {
      userId: 1,
      itemName: "Almond Milk",
      quantity: 1,
      isPurchased: false,
    },
    {
      userId: 2,
      itemName: "Blackberries",
      quantity: 4,
      isPurchased: true,
    },
    {
      userId: 2,
      itemName: "Raspberries",
      quantity: 1,
      isPurchased: false,
    },
  ];

  //Insert grocery lists into database
  await prisma.groceryList.createMany({ data: groceryListData });

  //Created data for meals of the week

  const mealsForWeekData = [
    {
      userId: 1,
      dayOfWeek: "Monday",
      mealDescription:
        "Breakfast: Baked Oats, Lunch: Peanut Butter and Jelly Sandwich, Dinner: Daydream Sandwich",
    },
    {
      userId: 1,
      dayOfWeek: "Tuesday",
      mealDescription:
        "Breakfast: Baked Oats, Lunch: Veggie Pasta, Dinner: Sweet Potato Tacos",
    },
    {
      userId: 1,
      dayOfWeek: "Wednesday",
      mealDescription:
        "Breakfast: Baked Oats, Lunch: Peanut Butter and Jelly Sandwich, Dinner: Daydream Sandwich",
    },
    {
      userId: 1,
      dayOfWeek: "Thursday",
      mealDescription:
        "Breakfast: Baked Oats, Lunch: Veggie Pasta, Dinner: Sweet Potato Tacos",
    },
    {
      userId: 1,
      dayOfWeek: "Friday",
      mealDescription:
        "Breakfast: Baked Oats, Lunch: Peanut Butter and Jelly Sandwich, Dinner: Daydream Sandwich",
    },
    {
      userId: 1,
      dayOfWeek: "Saturday",
      mealDescription:
        "Breakfast: Baked Oats, Lunch: Veggie Pasta, Dinner: Sweet Potato Tacos",
    },
    {
      userId: 1,
      dayOfWeek: "Sunday",
      mealDescription:
        "Breakfast: Baked Oats, Lunch: Veggie Pasta, Dinner: Sweet Potato Tacos",
    },
    {
      userId: 2,
      dayOfWeek: "Monday",
      mealDescription:
        "Breakfast: Cereal, Lunch: Ramen, Dinner: Broccoli Pasta",
    },
    {
      userId: 2,
      dayOfWeek: "Tuesday",
      mealDescription:
        "Breakfast: Protein Bar, Lunch: Quinoa Salad, Dinner: Mac and Cheese",
    },
    {
      userId: 1,
      dayOfWeek: "Wednesday",
      mealDescription:
        "Breakfast: Baked Oats, Lunch: Peanut Butter and Jelly Sandwich, Dinner: Gnocchi",
    },
    {
      userId: 1,
      dayOfWeek: "Thursday",
      mealDescription:
        "Breakfast: Eggs, Lunch: Veggie Pasta, Dinner: Sweet Potato Tacos",
    },
    {
      userId: 1,
      dayOfWeek: "Friday",
      mealDescription:
        "Breakfast: Muffins, Lunch: Peanut Butter and Jelly Sandwich, Dinner: Daydream Sandwich",
    },
    {
      userId: 1,
      dayOfWeek: "Saturday",
      mealDescription:
        "Breakfast: Cereal, Lunch: Pretzels and Hummus, Dinner: Sweet Potato Tacos",
    },
    {
      userId: 1,
      dayOfWeek: "Sunday",
      mealDescription:
        "Breakfast: Baked Oats, Lunch: Veggie Pasta, Dinner: Sweet Potato Tacos",
    },
  ];

  //Insert grocery lists into database
  await prisma.mealsForWeek.createMany({ data: mealsForWeekData });

  //Create data for monthly budget
  const budgetData = [
    {
      userId: 1,
      category: "Groceries",
      amount: 250,
      isExpense: true,
    },
    {
      userId: 1,
      category: "2 Weeks Pay",
      amount: 1500.75,
      isExpense: false,
    },
  ];

  //Insert budget into database
  await prisma.monthlyBudget.createMany({ data: budgetData });

  //Create data for spend tracker
  const spendingData = [
    {
      userId: 1,
      description: "Vacation",
      amount: 300.8,
    },
    {
      userId: 3,
      description: "Classroom decor",
      amount: 150.2,
    },
  ];
  //Insert budget into database
  await prisma.spendTracker.createMany({ data: spendingData });

  //Create medical data
  const personalMedicalData = [
    {
      userId: 3,
      medicalCondition: "Asthma",
      prescription: "Azelaic acid",
      doctorName: "Dr.Matthews",
    },
  ];

  //Insert budget into database
  await prisma.personalMedical.createMany({ data: personalMedicalData });

  //Create data for habit tracker
  const habitData = [
    {
      userId: 2,
      habitName: "Skincare",
      frequency: "Daily",
      goal: 2,
      progress: 3,
    },
    {
      userId: 4,
      habitName: "Go to gym",
      frequency: "Daily",
      goal: 1,
      progress: 1,
    },
  ];

  //Insert budget into database
  await prisma.habitTracker.createMany({ data: habitData });

  //Create data for cleaning tracker
  const cleaningData = [
    {
      userId: 1,
      taskName: "Wipe counters",
      isCompleted: false,
    },
    {
      userId: 2,
      taskName: "Take out trash",
      isCompleted: true,
    },
    {
      userId: 4,
      taskName: "Sweep",
      isCompleted: true,
    },
    {
      userId: 4,
      taskName: "Mop",
      isCompleted: false,
    },
  ];

  //Insert cleaning data into database
  await prisma.cleaningChecklist.createMany({ data: cleaningData });
};

module.exports = seedPersonal;
