import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/trips/:tripId/links", {
    schema: {
      params: z.object({
        tripId: z.string().uuid()
      }),
      body: z.object({
        title: z.string().min(4),
        url: z.string().url()
      })
    },
    handler: async (request) => {
      const { tripId } = request.params;
      const { title, url } = request.body;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId
        }
      });

      if (!trip) {
        throw new Error("Trip not found");
      }

      const link = await prisma.link.create({
        data: {
          title,
          url,
          trip_id: tripId
        }
      });

      return { linkId: link.id };
    }
  });
}
