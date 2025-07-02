import { ApolloServer } from '@apollo/server';
// highlight-start
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from '@as-integrations/aws-lambda';
// highlight-end

const typeDefs = `#graphql
  type Participant {
  id: ID! @id
  crdc_id: String
  uuid: String
  participant_id: String
  race: String
  sex_at_birth: String

  diagnosis: [Diagnosis!]! @relationship(type: "of_diagnosis", direction: IN)
  sample: [Sample!]! @relationship(type: "of_sample", direction: IN)
  survival: [Survival!]! @relationship(type: "of_survival", direction: IN)
  synonym: [Synonym!]! @relationship(type: "of_synonym", direction: IN)
  study: Study! @relationship(type: "of_participant", direction: OUT)
}

type Diagnosis {
  id: ID! @id
  created: String
  uuid: String
  diagnosis: String
  diagnosis_id: String
  diagnosis_classification_system: String
  diagnosis_basis: String
  diagnosis_comment: String
  disease_phase: String
  tumor_classification: String
  anatomic_site: String
  age_at_diagnosis: String
  toronto_childhood_cancer_staging: String
  tumor_stage_clinical_t: String
  tumor_stage_clinical_n: String
  tumor_stage_clinical_m: String
  tumor_stage_source: String
  tumor_grade: String
  tumor_grade_source: String
  year_of_diagnosis: String
  laterality: String

  participant: Participant! @relationship(type: "of_diagnosis", direction: OUT)
}

type Sample {
  id: ID! @id
  created: String
  crdc_id: String
  uuid: String
  tumor_classification: String
  anatomic_site: String
  sample_id: String
  participant_age_at_collection: String
  sample_tumor_status: String
  sample_description: String

  participant: Participant! @relationship(type: "of_sample", direction: OUT)
}

type Survival {
  id: ID! @id
  created: String
  uuid: String
  survival_id: String
  last_known_survival_status: String
  age_at_last_known_survival_status: String
  first_event: String
  event_free_survival_status: String
  follow_up_category: String
  follow_up_other: String
  adverse_event: String
  comorbidity: String
  comorbidity_method_of_diagnosis: String
  risk_factor: String
  cause_of_death: String

  participant: Participant! @relationship(type: "of_survival", direction: OUT)
}

type Synonym {
  id: ID! @id
  created: String
  uuid: String
  synonym_id: String
  repository_of_synonym_id: String
  associated_id: String
  domain_description: String
  domain_category: String
  data_location: String

  participant: Participant! @relationship(type: "of_synonym", direction: OUT)
}

type Study {
  id: ID! @id
  created: String
  study_id: String
  dbgap_accession: String
  study_name: String
  study_acronym: String
  study_description: String
  consent: String
  consent_number: String
  external_url: String
  experimental_strategy_and_data_subtype: String
  study_status: String
  study_data_types: String
  size_of_data_being_uploaded: String
  crdc_id: String
  uuid: String

  participants: [Participant!]! @relationship(type: "of_participant", direction: IN)
  study_admins: [StudyAdmin!]! @relationship(type: "of_study_admin", direction: IN)
  study_arms: [StudyArm!]! @relationship(type: "of_study_arm", direction: IN)
  clinical_measure_files: [ClinicalMeasureFile!]! @relationship(type: "of_clinical_measure_file", direction: IN)
  study_personnel: [StudyPersonnel!]! @relationship(type: "of_study_personnel", direction: IN)
  publications: [Publication!]! @relationship(type: "of_publication", direction: IN)
  fundings: [StudyFunding!]! @relationship(type: "of_study_funding", direction: IN)
}

type StudyAdmin {
  id: ID! @id
  created: String
  uuid: String
  study_admin_id: String
  organism_species: String
  adult_or_childhood_study: String
  file_types_and_format: String

  study: Study! @relationship(type: "of_study_admin", direction: OUT)
}

type StudyArm {
  id: ID! @id
  created: String
  uuid: String
  study_arm_id: String
  study_arm_description: String
  clinical_trial_identifier: String
  clinical_trial_repository: String

  study: Study! @relationship(type: "of_study_arm", direction: OUT)
}

type ClinicalMeasureFile {
  id: ID! @id
  created: String
  crdc_id: String
  uuid: String
  clinical_measure_file_id: String
  file_name: String
  data_category: String
  file_type: String
  file_description: String
  file_size: String
  md5sum: String
  file_mapping_level: String
  file_access: String
  acl: String
  authz: String
  file_url: String
  dcf_indexd_guid: String
  checksum_algorithm: String
  checksum_value: String
  participant_list: String

  study: Study! @relationship(type: "of_clinical_measure_file", direction: OUT)
}

type StudyPersonnel {
  id: ID! @id
  created: String
  crdc_id: String
  uuid: String
  study_personnel_id: String
  personnel_name: String
  personnel_type: String
  email_address: String
  institution: String
  orcid: String

  study: Study! @relationship(type: "of_study_personnel", direction: OUT)
}

type Publication {
  id: ID! @id
  created: String
  uuid: String
  publication_id: String
  pubmed_id: String

  study: Study! @relationship(type: "of_publication", direction: OUT)
}

type StudyFunding {
  id: ID! @id
  created: String
  uuid: String
  study_funding_id: String
  funding_agency: String
  grant_id: String
  funding_source_program_name: String

  study: Study! @relationship(type: "of_study_funding", direction: OUT)
}

`;

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
 
const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});
 

// This final export is important!
// highlight-start
export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);
// highlight-end