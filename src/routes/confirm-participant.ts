import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function confirmParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participants/:participantId/confirm",
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { participantId } = request.params;

      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId
        }
      });

      if (!participant) {
        return reply.status(404).send({ error: "Participant not found" });
      }

      if (participant.is_confirmed == true) {
        return reply.redirect(
          `${process.env.WEB_BASE_URL}/trips/${participant.trip_id}`
        );
      }

      await prisma.participant.update({
        where: {
          id: participantId
        },
        data: {
          is_confirmed: true
        }
      });

      return reply.redirect(
        `${process.env.WEB_BASE_URL}/trips/${participant.trip_id}`
      );
    }
  );
}
