import { DocumentAuditTrail } from './types';

export const INITIAL_AUDIT_TRAILS: DocumentAuditTrail[] = [
  {
    id: "AIEC-8912",
    modelName: "Claude 3.5 Sonnet",
    currentState: "APPROVED",
    signer: "General Counsel",
    timestamp: "2024-05-20T16:05:12Z",
    payloadHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timeline: [
      {
        id: "node-1",
        state: "GENERATED",
        actor: "Claude 3.5 Sonnet",
        timestamp: "2024-05-20T14:32:01Z",
        description: "Initial AI pipeline output. Content generated for 'ISO 42001 Section A.6 - Governance and Risk Management Guidelines'.",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        publicFingerprint: "ed25519:SHA256:7B94:C3DF:...",
        signature: {
          alg: "EdDSA",
          kid: "claude-sign-v2",
          sig: "ZXI4OTMyNDhrandoZmtfZ2VuX2MyNDI..."
        }
      },
      {
        id: "node-2",
        state: "MODIFIED",
        actor: "alice@company.com",
        timestamp: "2024-05-20T15:10:45Z",
        description: "Diff change: - 'The system *may* require review.' \n+ 'The system *must* require human review.'",
        hash: "f8434346648f6b96df89ddaef980adcae412a83bd7a8109bfaf22c6019aeb9d1",
        publicFingerprint: "ed25519:SHA256:3E92:02AC:...",
        signature: {
          alg: "EdDSA",
          kid: "alice-edit-v1",
          sig: "ZXI4NTkyMTRoZXRvZmthbGljZV8xMzk..."
        }
      },
      {
        id: "node-3",
        state: "APPROVED",
        actor: "General Counsel",
        timestamp: "2024-05-20T16:05:12Z",
        description: "Human-in-the-loop sign-off on absolute guardrails and compliance definitions.",
        hash: "10b981fcae1284d0fe0e8a7acfeefcfdc8927429188d5e82f10bdfa37bc89d2a",
        publicFingerprint: "ed25519:SHA256:FF4C:90A1:...",
        signature: {
          alg: "EdDSA",
          kid: "gc-sign-v1",
          sig: "ZXI0OTMyNDhrandoZmtfZ2NfYXBwcm92ZWQ..."
        }
      }
    ]
  },
  {
    id: "AIEC-4421",
    modelName: "Gemini 1.5 Pro",
    currentState: "MODIFIED",
    signer: "bob.harris@security.io",
    timestamp: "2026-06-05T09:15:30Z",
    payloadHash: "a9c04fe813bfb3eaadccfe89012bbcdf9129ac102003c9bbfdaedf01b9bcff99",
    timeline: [
      {
        id: "node-4",
        state: "GENERATED",
        actor: "Gemini 1.5 Pro",
        timestamp: "2026-06-05T08:02:11Z",
        description: "Automated generation of 'ISO 42001 Section B.3 - Data Lifecycle Controls'.",
        hash: "7f4c08eb19d0a3fea827a42bbca012ee9f1ea29bfa0faef3ef89c9dfbebe112a",
        publicFingerprint: "ed25519:SHA256:4EE8:88BD:...",
        signature: {
          alg: "EdDSA",
          kid: "gemini-model-v1",
          sig: "ZXI4MTRkNDhoYW5kb2ZtdF9nZW1pXzEyMw..."
        }
      },
      {
        id: "node-5",
        state: "MODIFIED",
        actor: "bob.harris@security.io",
        timestamp: "2026-06-05T09:15:30Z",
        description: "Adjusted parameter logs to specify local VPC subnet boundaries. Diff: - 'Public routing enabled' \n+ 'Routing restricted to VPC gateway subnet 10.14.0.0/16.'",
        hash: "a9c04fe813bfb3eaadccfe89012bbcdf9129ac102003c9bbfdaedf01b9bcff99",
        publicFingerprint: "ed25519:SHA256:AB12:99FF:...",
        signature: {
          alg: "EdDSA",
          kid: "bob-edit-v3",
          sig: "ZXI4ODkzMjg0cnRlZmthbHliaG9ic2Vj..."
        }
      }
    ]
  },
  {
    id: "AIEC-7320",
    modelName: "GPT-4o",
    currentState: "GENERATED",
    signer: "System Autopilot",
    timestamp: "2026-06-07T10:14:45Z",
    payloadHash: "c01cd20e89fbcbcaeaedef8902ee19afef92c813ce82efdfbbfe1219bcedff99",
    timeline: [
      {
        id: "node-6",
        state: "GENERATED",
        actor: "GPT-4o",
        timestamp: "2026-06-07T10:14:45Z",
        description: "Pipeline intake generated schema for 'Deep Learning Training Pipeline Auditability Report'.",
        hash: "c01cd20e89fbcbcaeaedef8902ee19afef92c813ce82efdfbbfe1219bcedff99",
        publicFingerprint: "ed25519:SHA256:6CDE:12EF:...",
        signature: {
          alg: "EdDSA",
          kid: "gpt4-signed-v2",
          sig: "ZXI4OTEyMDVoYW5kb2ZtdF9ndHBfdjIy..."
        }
      }
    ]
  },
  {
    id: "AIEC-1104",
    modelName: "Claude 3.5 Sonnet",
    currentState: "APPROVED",
    signer: "Auditing Partner",
    timestamp: "2026-06-06T18:22:00Z",
    payloadHash: "b9e9bc11fa0e412bc4f9011af39999bc8922c19a9bbfdaeddffcaaeebb12e9ef",
    timeline: [
      {
        id: "node-7",
        state: "GENERATED",
        actor: "Claude 3.5 Sonnet",
        timestamp: "2026-06-06T15:10:00Z",
        description: "Assessment policy document for 'Continuous Bias and Hallucination Mitigations'.",
        hash: "4fe8a09decdeccedafdf9012a9fbcfdaef8923a10be89fdaffdca0eeff78bb1e",
        publicFingerprint: "ed25519:SHA256:7B94:C3DF:...",
        signature: {
          alg: "EdDSA",
          kid: "claude-sign-v2",
          sig: "ZXI4OTMyNDhrandoZmtfZ2VuX2MyNDI..."
        }
      },
      {
        id: "node-8",
        state: "MODIFIED",
        actor: "chief.compliance@enterprise.com",
        timestamp: "2026-06-06T17:40:00Z",
        description: "Added compliance testing thresholds. Diff: - 'Accuracy evaluation strictly automated' \n+ 'Accuracy automated evaluation and audited weekly by GRC partner.'",
        hash: "900a0be9cdcefe0fa822da89bbca981eeef32a10be0dfadfd8a9bef7245bbf12",
        publicFingerprint: "ed25519:SHA256:88AF:77DD:...",
        signature: {
          alg: "EdDSA",
          kid: "cc-edit-v2",
          sig: "ZXI0OTA5MDloYW5kb2ZtdF9jY19jb21wbGlhbmNl..."
        }
      },
      {
        id: "node-9",
        state: "APPROVED",
        actor: "Auditing Partner",
        timestamp: "2026-06-06T18:22:00Z",
        description: "Official third-party validation certificate signed off for internal controls audit preparation.",
        hash: "b9e9bc11fa0e412bc4f9011af39999bc8922c19a9bbfdaeddffcaaeebb12e9ef",
        publicFingerprint: "ed25519:SHA256:90FA:22AA:...",
        signature: {
          alg: "EdDSA",
          kid: "partner-sign-v1",
          sig: "ZXI4OTEyMDVoYW5kb2ZtdF9wYXJ0bmVyX3NpZ25lZA..."
        }
      }
    ]
  }
];
