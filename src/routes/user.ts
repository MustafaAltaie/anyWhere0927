import { Router, Request } from "express";
import { RequestUser } from "../types/types";
import { prisma } from "../prismaclient/prismaclient";
import { userSchema } from "../schema/user-schema";

export const router = Router();

router.get("/", async (req, res) => {
  try {
      const allUsers = await prisma.user.findMany();
      res.json(allUsers);
  }
  catch (error) {
      res.status(400).json({ error: "Unable to get all users" });
  }
});

router.post("/", async (req: Request<{}, {}, RequestUser>, res) => {
  try {
      const { name, email, password } = req.body;
      const { error } = userSchema.validate({name, email, password});
      if(error) res.status(400).json({ error: error.details });

      const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password
        }
      });
      res.json(newUser);
  }
  catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Unable to create user" });
  }
});