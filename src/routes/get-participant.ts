import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export async function getParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get("/participants/:participantId", {
    schema: {
      params: z.object({
        participantId: z.string().uuid()
      })
    },
    handler: async (request) => {
      const { participantId } = request.params;

      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId
        },
        select: {
          id: true,
          name: true,
          email: true,
          is_confirmed: true
        }
      });

      if (!participant) {
        throw new Error("Trip not found");
      }

      return { participant };
    }
  });
}
