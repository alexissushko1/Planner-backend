const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");

const seedClassroom = async () => {
  //Create data for sub plans
  const subData = [
    {
      userId: 1,
      subject: "3rd Grade Math",
      planDescription:
        "For 3rd-grade math lesson, students will begin with a 10-minute warm-up on multi-digit addition and subtraction (e.g., 23 + 56, 78 - 34). Following the warm-up, the class will review multi-digit addition and subtraction with regrouping, solving problems like 74 + 56 and 92 - 47 together. Next, they’ll explore basic geometry by identifying and drawing shapes such as triangles, rectangles, and circles, while noting properties like the number of sides and angles. Then, students will be introduced to multiplication as repeated addition (e.g., 3 × 4 as 4 + 4 + 4) and practice a few problems (e.g., 2 × 5, 4 × 3). If time allows, students will play a math game like Math Bingo or “Roll and Add” to reinforce their skills in a fun way. At the end of the lesson, students will share one thing they learned, and the teacher will collect their math notebooks and handouts. Behavior expectations include raising hands for questions and staying on task during independent work. If needed, the teacher can provide additional support for students struggling with concepts. Optional homework includes a worksheet with mixed addition, subtraction, and multiplication problems.",
      date: "2024-12-05T17:00:00Z",
    },
    {
      userId: 3,
      subject: "2nd Grade General Music",
      planDescription:
        "Today, students will explore rhythm, melody, and musical expression through interactive activities that encourage creativity and participation. Start by reviewing basic rhythmic patterns using body percussion—have students clap, tap, or stomp to different rhythms. Use a simple chant like Banana, Banana, Meatball to demonstrate short and long sounds, and invite students to create their own rhythmic chants in small groups. Next, introduce a fun, high-energy song such as The Grand Old Duke of York, and lead the class in singing while incorporating movement—students can march around the room in different directions to match the song’s rhythm. Afterward, engage students in a listening activity with a lively piece of music, such as “In the Hall of the Mountain King” by Edvard Grieg, and have them identify changes in tempo and mood (fast/slow, loud/soft). Finish the class with a creative Sound Stories activity: play short musical clips and have students draw or write about the story the music tells. This will help them connect auditory cues with visual and emotional responses, wrapping up the day with a fun and reflective activity.",
      date: "2024-12-05T17:00:00Z",
    },
  ];

  //Insert subplans into database
  await prisma.subPlan.createMany({ data: subData });

  //Create data for seating chart
  const seatingData = [
    {
      userId: 1,
      seatingArrangement:
        "Row 1: Tim, Sally, Joe. Row 2: Bob, Dwayne, Ellie. Row 3: Constance, _ , Kevin.",
    },
  ];

  //Insert seating chart into database
  await prisma.seatingChart.createMany({ data: seatingData });

  //Create data for classroom jobs
  const classJobData = [
    {
      userId: 1,
      jobName: "Line Leader",
      description: "Student 5",
    },
    {
      userId: 2,
      jobName: "Door Holder",
      description: "Student 1",
    },
    {
      userId: 3,
      jobName: "Attendance Taker",
      description: "Student 11",
    },
  ];

  //Insert seating chart into database
  await prisma.classroomJob.createMany({ data: classJobData });

  //Create data for school passwords
  const schoolPasswordData = [
    {
      userId: 1,
      accountName: "Canvas",
      username: "teacher@email.com",
      password: "1234",
      isTeacher: true,
    },
    {
      userId: 3,
      accountName: "Canvas",
      username: "student@email.com",
      password: "5678",
      isTeacher: false,
    },
  ];

  //Insert school passwords into database
  await prisma.schoolPassword.createMany({ data: schoolPasswordData });

  //Create classroom rewards data
  const rewardsData = [
    {
      userId: 1,
      rewardName: "Sticker",
      description: "Was kind to a classmate",
      pointsRequired: 2,
    },
    {
      userId: 2,
      rewardName: "Lunch with principal",
      description: "Turned in homework on time for a month straight.",
      pointsRequired: 30,
    },
    {
      userId: 4,
      rewardName: "Extra Recess Time",
      description: "Made an A on all homework assignments for a week",
      pointsRequired: 5,
    },
  ];

  //Insert school rewards into database
  await prisma.classroomReward.createMany({ data: rewardsData });

  //Create IEP data
  const iepData = [
    {
      userId: 4,
      studentId: 3,
      iepDetails:
        "Student A is a 9 year old student in the 3rd grade with a diagnosis of ADHD and specific learning disabilities in reading and written expression. Her Individualized Education Program (IEP) focuses on providing accommodations and specialized instruction to help her succeed in the general education curriculum. In terms of academic goals, Sarah will receive 30 minutes of daily, small-group instruction in reading to improve fluency and comprehension, with a target of increasing her reading level by one grade year within the next year. In written expression, she will work with a special education teacher for 45 minutes per week to develop her ability to organize and clearly express her ideas in writing, with an aim to increase her writing output from two sentences to a coherent paragraph by the end of the school year. Accommodations include extended time for tests and assignments, the use of a text-to-speech program for reading assignments, and a scribe to assist with writing when needed. To support her focus and attention, Sarah will be allowed frequent breaks during lessons and will use fidget tools during independent work times. Social-emotional goals focus on improving self-regulation and coping skills, with weekly sessions with the school counselor to practice mindfulness and strategies for managing frustration. Regular communication between the special education team and Sarah’s parents will ensure that progress is monitored and adjustments are made as necessary to support her academic and emotional development. ",
    },
  ];

  //Insert iep data into database
  await prisma.iEP.createMany({ data: iepData });

  //Create grading data
  const gradingData = [
    {
      userId: 3,
      studentId: 3,
      subject: "Beginner Band",
      grade: 97,
    },
    {
      userId: 3,
      studentId: 4,
      subject: "Math",
      grade: 89,
    },
    {
      userId: 1,
      studentId: 7,
      subject: "Chemistry",
      grade: 92,
    },
  ];

  //Insert grading data into database
  await prisma.grading.createMany({ data: gradingData });

  //Create student transportation data
  const transportationData = [
    {
      userId: 2,
      studentId: 5,
      transportationDetails: "Pick up at 12pm.",
    },
    {
      userId: 4,
      studentId: 2,
      transportationDetails: "Bus Rider.",
    },
    {
      userId: 5,
      studentId: 23,
      transportationDetails: "Car rider.",
    },
  ];

  //Insert transportation data into database
  await prisma.studentTransportation.createMany({ data: transportationData });

  //Create data for class roster
  const rosterData = [
    {
      userId: 1,
      studentName: "Student A",
      gradeLevel: "11",
      birthday: "2025-12-05T17:00:00Z",
    },
    {
      userId: 1,
      studentName: "Student B",
      gradeLevel: "10",
      birthday: "2025-10-05T17:00:00Z",
    },
    {
      userId: 1,
      studentName: "Student C",
      gradeLevel: "12",
      birthday: "2025-12-05T17:00:00Z",
    },
  ];

  //Insert roster data into database
  await prisma.classRoster.createMany({ data: rosterData });

  //Create data for weekly lesson plan
  const weeklyPlanData = [
    {
      userId: 2,
      subject: "Algebra",
      lessonDescription:
        "This Algebra lesson plan will introduce students to foundational algebraic concepts through a series of structured activities and practice. On Day 1, the focus will be on introducing the new topic of solving linear equations. The teacher will begin by reviewing basic arithmetic operations and properties, then demonstrate step-by-step how to solve one-variable linear equations. After the demonstration, students will engage in guided practice, where they will solve a few problems as a class. Homework will be assigned to reinforce the day's lesson, providing students with problems that gradually increase in difficulty. On Day 2, the lesson will build upon the previous day’s work by exploring multi-step linear equations. The teacher will review the homework, address common mistakes, and then present more complex examples, allowing students to work through problems individually and in pairs. During independent practice, the teacher will circulate the room to provide support as needed. Homework for the night will consist of problems that challenge students to apply multi-step solving techniques. On Day 3, the lesson will shift to applying linear equations to real-world problems, such as budgeting or distance-time scenarios. After reviewing a few examples, students will work in groups to solve similar word problems, learning how to translate everyday situations into algebraic expressions. On Day 4, the class will focus on reinforcing all of the concepts learned throughout the week. This will include a review session with practice problems, a class discussion on any lingering questions, and a brief formative quiz to assess understanding. The week will conclude with Day 5, which will include time for individual or small group work on any difficult concepts, targeted interventions, and an opportunity for students to ask questions and clarify any misunderstandings before the next topic is introduced. Homework over the weekend will be assigned to further reinforce the week's content, ensuring that students have ample practice before moving forward.",
      weekStartDate: "2025-10-05T17:00:00Z",
      weekEndDate: "2025-10-09T17:00:00Z",
    },
  ];
  //Insert weekly lesson plan data into database
  await prisma.weeklyLessonPlan.createMany({ data: weeklyPlanData });

  //Create data for daily lesson plan
  const dailyPlanData = [
    {
      userId: 1,
      subject: "Wind Symphony",
      lessonDescription:
        "Review blues scale and discuss history. Have students  volunteer to improvise using this scale. Create own composition.",
      date: "2025-10-09T17:00:00Z",
    },
  ];

  //Insert daily lesson plan data into database
  await prisma.dailyLessonPlan.createMany({ data: dailyPlanData });
};

module.exports = seedClassroom;
