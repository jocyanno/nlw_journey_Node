import fastify from "fastify";
import { createTrip } from "./routes/create-trip";
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { errorHandler } from "./error-handler";
import { confirmParticipants } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivity } from "./routes/get-activities";
import { createLink } from "./routes/create-link";
import { getLink } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getParticipant } from "./routes/get-participant";
import { env } from "./env";

const app = fastify();

app.register(cors, {
  origin: "*"
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipants);
app.register(createActivity);
app.register(getActivity);
app.register(createLink);
app.register(getLink);
app.register(getParticipants);
app.register(getParticipant);
app.register(createInvite);
app.register(updateTrip);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running!");
});
