import * as Joi from "joi";
import * as dotenv from "dotenv";

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    CONTRACT_MANAGER: Joi.string(),
    CONTRACT_AGGREGATOR: Joi.string(),
    TOTAL_HOSTS: Joi.number(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  totalNumber: envVars.TOTAL_HOSTS,
  contract_manager: envVars.CONTRACT_MANAGER,
  contract_aggregator: envVars.CONTRACT_AGGREGATOR,
};
