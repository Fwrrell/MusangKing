import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

async function main() {
  const adminEmail = "admin@musang.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("MusangKing1!", 16);
    const adminDeviceId = `musang-${randomUUID()}`;

    const admin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        device_id: adminDeviceId,
      },
    });
    console.log("Admin account created successfully:", admin.email);
  } else {
    console.log("Admin account already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
