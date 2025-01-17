import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export async function getLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get("/trips/:tripId", {
    schema: {
      params: z.object({
        tripId: z.string().uuid()
      })
    },
    handler: async (request) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId
        },
        select: {
          id: true,
          destination: true,
          starts_at: true,
          ends_at: true,
          is_confirmed: true
        }
      });

      if (!trip) {
        throw new Error("Trip not found");
      }

      return { trip };
    }
  });
}
