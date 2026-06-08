export type DocumentState = 'GENERATED' | 'MODIFIED' | 'APPROVED';

export interface CryptoSignature {
  alg: string;
  kid: string;
  sig: string;
}

export interface TimelineNode {
  id: string;
  state: DocumentState;
  actor: string;
  timestamp: string;
  description: string;
  hash: string;
  publicFingerprint: string;
  signature: CryptoSignature;
}

export interface DocumentAuditTrail {
  id: string;
  modelName: string;
  currentState: DocumentState;
  signer: string;
  timestamp: string;
  payloadHash: string;
  timeline: TimelineNode[];
}

export interface SandboxUserEvent {
  prompt: string;
  response: string;
  model: string;
}
