// taskManagerTest.js
import { CloudTasksClient } from "@google-cloud/tasks";
// import { TaskRouter } from "./taskRouter.js";
// import { Task } from "./task.js";
import { getVercelOidcToken } from "@vercel/functions/oidc";
import { ExternalAccountClient } from 'google-auth-library';
// import dotenv from "dotenv";
// // import logger from "../logger.js";

// // Define the environment variables
// dotenv.config({ path: ".env" });

// Define the GCP environment variables
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
  process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;
const GOOGLE_TASKS_LOCATION = 'us-central1';

// Initialize the External Account Client
const authClient = ExternalAccountClient.fromJSON({
  type: "external_account",
  audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
  subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
  token_url: 'https://sts.googleapis.com/v1/token',
  service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
  subject_token_supplier: {
    // Use the Vercel OIDC token as the subject token
    getSubjectToken: getVercelOidcToken,
  },
});

// Export the GCP credentials
const gcpCredentials = {
  project: GCP_PROJECT_ID,
  location: GOOGLE_TASKS_LOCATION,
  googleAuthOptions: {
    authClient,
    projectId: GCP_PROJECT_ID
  }
};

let client = new CloudTasksClient( {credentials: gcpCredentials });
client.createQueue({parent: `projects/${GCP_PROJECT_ID}/locations/${GOOGLE_TASKS_LOCATION}`, queue: {name: "test-queue"}});
