const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(username, email, password) {
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: { username, email, password: hash },
        });
        return user;
      },
      async login(username, email, password) {
        const user = await prisma.user.findUniqueOrThrow({
          where: { username, email },
        });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw Error("Wrong password");
        return user;
      },
    },
  },
});
module.exports = prisma;
