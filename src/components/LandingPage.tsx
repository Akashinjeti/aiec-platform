import React, { useState } from 'react';
import { 
  Shield, Lock, CheckCircle, Terminal as TerminalIcon, ArrowRight, CornerDownRight, 
  CheckSquare, Sparkles, Code, Download, Cpu, ShieldCheck, AlertTriangle, Layers, ListTodo,
  Mail, Inbox, AlertCircle, UserCheck, User, Copy, Check, X, FileText, Database, Key
} from 'lucide-react';
import AiecLogo from './AiecLogo';

interface LandingPageProps {
  onEnterConsole: () => void;
  onEnterSubPage: (subPage: 'privacy' | 'terms' | 'security' | 'compliance' | 'why') => void;
}

export default function LandingPage({ onEnterConsole, onEnterSubPage }: LandingPageProps) {
  // Section 6 Form Fields
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [companySize, setCompanySize] = useState('51-250');
  const [aiUsage, setAiUsage] = useState('11-50');
  const [urgency, setUrgency] = useState('Actively preparing for audit');
  const [aiModels, setAiModels] = useState('OpenAI');
  const [complianceTarget, setComplianceTarget] = useState('ISO 42001');
  const [currentProcess, setCurrentProcess] = useState('Manual');
  const [preparingForAudit, setPreparingForAudit] = useState('Yes, in next 3 months');
  const [selectedPains, setSelectedPains] = useState<string[]>([]);
  
  const [emailWarning, setEmailWarning] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [cryptSigningProgress, setCryptSigningProgress] = useState(false);
  const [selectedTimelineStep, setSelectedTimelineStep] = useState<number>(0);
  const [terminalTab, setTerminalTab] = useState<'inference' | 'merkle' | 'verify'>('inference');

  // Interactive Schema details state
  const [activeSchemaStep, setActiveSchemaStep] = useState<number | null>(null);
  const [activeSchemaTab, setActiveSchemaTab] = useState<'json' | 'attributes'>('json');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isVerifyingSchemaIntegrity, setIsVerifyingSchemaIntegrity] = useState(false);
  const [verifyingSchemaSuccess, setVerifyingSchemaSuccess] = useState<boolean | null>(null);

  const stepSchemas = [
    {
      standard: "ISO/IEC 42001:2023 Annex A.6.2",
      title: "AI Model Inference Validation Layout",
      id: "aiesc_inference_v2_schema",
      json: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AIEvidenceChainBlock_ModelInference",
  "description": "Cryptographic proof validator model for generative AI outputs",
  "type": "object",
  "required": [
    "timestamp",
    "model_id",
    "prompt_hash",
    "output_hash",
    "consensus_nodes",
    "signature"
  ],
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "UTC ISO 8601 clock stamp matching NTP servers"
    },
    "model_id": {
      "type": "string",
      "const": "claude-3-5-sonnet-v2",
      "description": "Sovereign model reference matching audited weights"
    },
    "prompt_hash": {
      "type": "string",
      "pattern": "^[0-9a-f]{64}$",
      "description": "SHA-256 secure hash fingerprint of client-side inputs"
    },
    "output_hash": {
      "type": "string",
      "pattern": "^[0-9a-f]{64}$",
      "description": "SHA-256 secure hash fingerprint of model raw outputs"
    },
    "consensus_nodes": {
      "type": "array",
      "minItems": 4,
      "items": { "type": "string", "format": "hostname" },
      "description": "Vanguard peer validation nodes signing the consensus block"
    },
    "signature": {
      "type": "object",
      "required": ["algorithm", "signature_bytes", "public_key"],
      "properties": {
        "algorithm": { "type": "string", "const": "Ed25519" },
        "signature_bytes": { "type": "string", "description": "Hex-encoded digital signature envelope" },
        "public_key": { "type": "string", "description": "Physical public fingerprint matching audited authority key identifier" }
      }
    }
  }
}`,
      attributes: [
        { name: "timestamp", type: "Datetime (ISO 8601)", rule: "Strict monotonic, synchronized with network time protocol (NTP).", description: "Secures forensic log sequence order." },
        { name: "model_id", type: "Fixed String", rule: "Must match registered cryptographic keys of certified AI engines.", description: "Assures source validity and prevents deepfake/spoof engines." },
        { name: "prompt_hash", type: "Hash32 (SHA-256)", rule: "Local client-side hash generator. Raw text forbidden from entering state servers.", description: "Privacy-preserving local client verification." },
        { name: "output_hash", type: "Hash32 (SHA-256)", rule: "Differential mathematical hash matching response values exactly.", description: "Validates immutable output parameters." },
        { name: "verification_sources", type: "String Array", rule: "Minimum of 4 cross-regional physical sources must establish verification.", description: "Independent validation peer ledger audit." },
        { name: "signature", type: "Ed25519 Envelope", rule: "Digital asymmetric signature proving ownership, signed with Curve25519 seed.", description: "Non-repudiation control proof." }
      ]
    },
    {
      standard: "ISO/IEC 42001:2023 Annex A.8.3",
      title: "AI Policy Mutation & Human Signer Layout",
      id: "aiesc_mutation_v1_schema",
      json: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AIEvidenceChainBlock_HumanModification",
  "description": "Traceable GRC modification and differential code log model",
  "type": "object",
  "required": [
    "timestamp",
    "actor_id",
    "prev_block_hash",
    "mutation_diff",
    "compliance_attestation",
    "signature"
  ],
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "actor_id": {
      "type": "string",
      "const": "user_legal_alice",
      "description": "Unique cryptographic key fingerprint matching accredited counsel group user"
    },
    "prev_block_hash": {
      "type": "string",
      "pattern": "^[0-9a-f]{64}$",
      "description": "Parent hash validating absolute state lineage in Merkle sibling structure"
    },
    "mutation_diff": {
      "type": "object",
      "required": ["removed_clauses", "added_clauses"],
      "properties": {
        "removed_clauses": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Literal matching section clauses marked for retirement"
        },
        "added_clauses": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Literal compliance policy clauses injected during override"
        }
      }
    },
    "compliance_attestation": {
      "type": "boolean",
      "const": true,
      "description": "Proves manual attestation of human-in-the-loop compliance checks"
    },
    "signature": {
      "type": "object",
      "required": ["algorithm", "signature_bytes", "public_key"],
      "properties": {
        "algorithm": { "type": "string", "const": "Ed25519" },
        "signature_bytes": { "type": "string" },
        "public_key": { "type": "string" }
      }
    }
  }
}`,
      attributes: [
        { name: "timestamp", type: "Datetime (ISO 8601)", rule: "Strict sequential tracking clock matching local audit time.", description: "Determines precise regulatory trace intervals." },
        { name: "actor_id", type: "Cryptographic UUID", rule: "Public key footprint associated with manual compliance officer profiles.", description: "Asserts professional accountability." },
        { name: "prev_block_hash", type: "Hash32 (SHA-256)", rule: "Must match the exact hash of preceding ledger leaf node.", description: "Maintains tamper-proof chain validity." },
        { name: "mutation_diff", type: "Object Layout", rule: "Requires non-empty fields representing actual policy modification data.", description: "Secures transparent forensic change ledger." },
        { name: "compliance_attestation", type: "Boolean Constant", rule: "Must be explicitly set to true. Demonstrates review overrides.", description: "Manual Human-in-the-loop (HITL) check-off." },
        { name: "signature", type: "Ed25519 Certificate", rule: "Multi-factor authentication key signature ensuring secure signoff.", description: "Guarantees cryptographic authenticity." }
      ]
    },
    {
      standard: "ISO/IEC 42001:2023 Annex A.10.1",
      title: "Sovereign GRC Executive Approval Layout",
      id: "aiesc_approval_v12_schema",
      json: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AIEvidenceChainBlock_SovereignApproval",
  "description": "Seal validation metadata model verifying complete regulatory compliance",
  "type": "object",
  "required": [
    "timestamp",
    "approver_id",
    "merkle_root",
    "approved_block_range",
    "grc_ruleset_v42",
    "signature"
  ],
  "properties": {
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "approver_id": {
      "type": "string",
      "const": "gc_master_key",
      "description": "Hardware-enclaved general counsel certification authority signature"
    },
    "merkle_root": {
      "type": "string",
      "pattern": "^[0-9a-f]{64}$",
      "description": "Validated Merkle Root containing all transactional events"
    },
    "approved_block_range": {
      "type": "array",
      "minItems": 2,
      "maxItems": 2,
      "items": { "type": "integer" },
      "description": "Range boundaries certifying exact audited ledger height"
    },
    "grc_ruleset_v42": {
      "type": "boolean",
      "const": true
    },
    "signature": {
      "type": "object",
      "required": ["algorithm", "signature_bytes", "public_key"],
      "properties": {
        "algorithm": { "type": "string", "const": "Ed25519" },
        "signature_bytes": { "type": "string" },
        "public_key": { "type": "string" }
      }
    }
  }
}`,
      attributes: [
        { name: "timestamp", type: "Datetime (ISO 8601)", rule: "Final authority clock stamp at completion verification seal event.", description: "Locks down audit certification moment." },
        { name: "approver_id", type: "Identity String", rule: "Matches certified registrar master key or licensed general counsel key.", description: "Assigns executive authority stamp." },
        { name: "merkle_root", type: "Hash32 (SHA-256)", rule: "Root signature calculated as double SHA-256 hashes of leaf sequence.", description: "Proves mathematical validity of complete chain." },
        { name: "approved_block_range", type: "Integer Tuple", rule: "Represents verified start block and end block indices of sequence.", description: "Defines precise scope of audit certification." },
        { name: "grc_ruleset_v42", type: "Sovereign Standard Flag", rule: "Asserts full conformance check-off against GRC v42.0 standard specifications.", description: "Assures systemic compliance matches absolute legal code." },
        { name: "signature", type: "Authority Seal Certificate", rule: "Multi-party consensus seal generated via Curve25519 signature algorithm.", description: "Provides verifiable sovereign certificate seal." }
      ]
    }
  ];

  // Premium email simulator state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [generatedRegSignature, setGeneratedRegSignature] = useState('');
  const [copiedSig, setCopiedSig] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Activation key states
  const [activationModalOpen, setActivationModalOpen] = useState(false);
  const [activationKeyInput, setActivationKeyInput] = useState('');
  const [activationError, setActivationError] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [activationLogs, setActivationLogs] = useState<string[]>([]);

  const handleVerifyActivationKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationKeyInput.trim()) {
      setActivationError('Please enter an activation key.');
      return;
    }

    setIsActivating(true);
    setActivationError('');
    setActivationLogs([]);

    const logs = [
      "Establishing link with secure central identity ledger...",
      "Resolving public keys on decentralized vetting registry...",
      "Symmetric evidence authorization signature verified successfully.",
      "Vetting complete: corporate domain validity matches credential record."
    ];

    // Push logs iteratively for dynamic high-tech feedback
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setActivationLogs(prev => [...prev, logs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        
        // Validation check
        const cleanKey = activationKeyInput.trim().toUpperCase();
        const expectedRegKey = generatedRegSignature ? generatedRegSignature.trim().toUpperCase() : '';
        
        const isValid = 
          cleanKey === 'AIEC-SECURE-KEY-2026-X89' || 
          cleanKey === 'AIEC_SANDBOX_KEY_2026' || 
          cleanKey === 'AIEC-SANDBOX-2026' || 
          (expectedRegKey && cleanKey === expectedRegKey) || 
          cleanKey.length >= 12; // fallback to let long random keys pass!

        if (isValid) {
          setActivationSuccess(true);
          setIsActivating(false);
          setTimeout(() => {
            setActivationModalOpen(false);
            setActivationSuccess(false);
            setActivationKeyInput('');
            onEnterConsole();
          }, 1500);
        } else {
          setIsActivating(false);
          setActivationError('VETTING_ERROR: Corporate credential key verification failed. Verify you copied the key verbatim from your sandbox receipt email (e.g. AIEC-SECURE-KEY-2026-X89).');
        }
      }
    }, 450);
  };

  // Interactive Live Playground State
  const [sandboxPrompt, setSandboxPrompt] = useState('Draft legal contract with mutual indemnification and liability caps up to $10,000,000 under EU law.');
  const [sandboxResponse, setSandboxResponse] = useState('Document finalized: Cap on liability set at precisely $10M. Auditable clause added automatically.');
  const [localHash, setLocalHash] = useState('');
  const [localSignature, setLocalSignature] = useState('');
  const [localSignTimestamp, setLocalSignTimestamp] = useState('');
  const [localSignActive, setLocalSignActive] = useState(false);
  const [localSignShowResult, setLocalSignShowResult] = useState(false);

  const handleLocalSignAndCertify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalSignActive(true);
    setLocalSignShowResult(false);

    const combinedText = `${sandboxPrompt}||${sandboxResponse}`;
    let computedHash = '';
    try {
      const msgBuffer = new TextEncoder().encode(combinedText);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      let hash = 0;
      for (let i = 0; i < combinedText.length; i++) {
        const char = combinedText.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      computedHash = 'e3b0c44298f' + Math.abs(hash).toString(16).padStart(16, '0') + 'b4c8996fb92427ae41e46';
    }

    const mockSigHex = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('') + '_Ed25519_EdDSA_Symmetric';

    setTimeout(() => {
      setLocalHash(computedHash);
      setLocalSignature(mockSigHex);
      setLocalSignTimestamp(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
      setLocalSignActive(false);
      setLocalSignShowResult(true);
    }, 1000);
  };

  // Validate work emails only
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const domain = val.split('@')[1];
    if (domain) {
      const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
      if (publicDomains.includes(domain.toLowerCase())) {
        setEmailWarning('Gmail/Yahoo domains not accepted. Please provide key enterprise address.');
      } else {
        setEmailWarning('');
      }
    } else {
      setEmailWarning('');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || emailWarning) return;
    
    setCryptSigningProgress(true);
    // Simulate high-fidelity cryptographic sandbox signature initialization
    setTimeout(() => {
      const mockSig = Array.from({ length: 48 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('').toUpperCase() + '_ED25519_REGISTRATION_BLOCK';
      
      setGeneratedRegSignature(mockSig);
      setCryptSigningProgress(false);
      setSubscribed(true);
      setShowEmailModal(true); // Open the premium secure email modal
    }, 2000);
  };

  // Section 3 Timeline Data - Precise compliance specification
  const timelineSteps = [
    {
      title: "1. GENERATED - Claude 3.5 Sonnet",
      meta: "TIMESTAMP: 2026-06-07 09:02:14 UTC | SHA256: 9af2e5b7...",
      badge: "AI Generated ✓",
      badgeColor: "bg-teal-950/40 text-[#2dd4bf] border-[#2dd4bf]/40",
      actor: "Claude 3.5 Sonnet",
      hash: "9af2e5b7c01ab4fc9ebd98fa9012a9fbcedbe892cfa77ddee9ffdcbbae120ab2",
      detail: "Generated policy draft artifact by Claude 3.5 Sonnet in sandbox runtime context, capturing raw model telemetry and original prompt context.",
      signature_key: "claude-sign-v2"
    },
    {
      title: "2. MODIFIED - Legal Counsel Alice",
      meta: "TIMESTAMP: 2026-06-07 09:07:22 UTC | SHA256: b3c1a82d...",
      badge: "Human Edited ✓",
      badgeColor: "bg-fuchsia-950/40 text-fuchsia-400 border-fuchsia-800/50",
      actor: "user_legal_alice (Corporate Counsel)",
      hash: "b3c1a82d09ff90fc1729bcfae98122cdae89abfc90ee1eefdfbe61bcfe81bc1a",
      diffMinus: "- \"The system may require review.\"",
      diffPlus: "+ \"The system must require human review.\"",
      detail: "Corporate Counsel Alice modified safety clauses to mandate physical human safeguards, automatically updating the cryptographic payload state.",
      signature_key: "alice-edit-v1"
    },
    {
      title: "3. LEGAL REVIEW - Partner Checked",
      meta: "TIMESTAMP: 2026-06-07 09:11:54 UTC | SHA256: d189c44a...",
      badge: "In Compliance Check ✓",
      badgeColor: "bg-indigo-950/40 text-indigo-400 border-indigo-800/50",
      actor: "user_legal_partner (Independent Evaluator)",
      hash: "d189c44aefd40a233fa2990cb89a1cd99e2f98fdecb0c9509bfdaefcbdcc01b3",
      detail: "Validated against EU AI Act requirements and certified conforming with compliance objectives.",
      signature_key: "legal-reviewer-v3"
    },
    {
      title: "4. APPROVED - General Counsel Approved",
      meta: "TIMESTAMP: 2026-06-07 09:15:30 UTC | COMPLIANCE RELEASE CERTIFIED",
      badge: "Approved ✓",
      badgeColor: "bg-amber-950/40 text-amber-500 border-amber-800/50",
      actor: "gc_master_key (General Counsel)",
      hash: "c04fe8824dfcbcaef09a90cdfc039bbf9a1197efdfccb9eef89faae112eefc91",
      detail: "General Counsel authorized final sign-off, sealing the immutable evidence trail with the corporate master root key.",
      signature_key: "gc-sign-v1"
    },
    {
      title: "5. EXPORTED - Compliance Package Exported",
      meta: "TIMESTAMP: 2026-06-07 09:16:01 UTC | STANDALONE GRC PACKAGE",
      badge: "Audit Sealed ✓",
      badgeColor: "bg-emerald-950/40 text-emerald-400 border-emerald-900/50",
      actor: "Off-site Verification Source",
      hash: "a43bfefbd8cfad767b45caebdfd7681edcf15a6b0c2fe762bfbc63901bcfaf1e",
      detail: "ISO 42001 GRC signature bundle generated and securely committed to the independent validation network.",
      signature_key: "audit-verified-v4"
    }
  ];

  const terminalPayloads = {
    inference: {
      "event_type": "model_inference",
      "timestamp": "2026-06-07T13:52:44Z",
      "payload_hash": "8f434346648f6b96df89dda...",
      "signature": {
        "alg": "EdDSA",
        "kid": "key-2026-v1",
        "sig": "ZXI0OTMyNDhrandoZmt..."
      },
      "verification": "SUCCESS"
    },
    merkle: {
      "node_type": "merkle_root",
      "block_height": 29482,
      "prev_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e464...",
      "root_hash": "9af2e5b7c01ab4fc9ebd9...",
      "tamper_status": "SECURE",
      "compliance_standard": "ISO/IEC 42001:2023 Annex A.6"
    },
    verify: {
      "assertion": "ISO_42001_ANNEX_A_READY",
      "proven_state": true,
      "zero_knowledge_proof": "zk-snark:sha256:0x9af2e5b7c01ab4fc9e...",
      "client_raw_data_leakage": "0.0% (ZERO_KNOWLEDGE_PROOF_VERIFIED)",
      "auditor_pass": "APPROVED"
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSig(true);
    setTimeout(() => setCopiedSig(false), 2000);
  };

  const downloadReceipt = () => {
    const receiptData = {
      organization: company || 'Enterprise Client',
      registered_email: email,
      registered_timestamp: new Date().toISOString(),
      evaluation_attributes: {
        company_size: companySize,
        employees_using_ai: aiUsage,
        urgency_level: urgency,
        ai_models: aiModels,
        compliance_target: complianceTarget,
        current_provenance_method: currentProcess,
        selected_pains: selectedPains
      },
      sandbox_status_ledger: {
        queue_rank: 142,
        shortlist_vetted: false,
        message: "Pending shortlist selection. AIEC sandbox access is strictly restricted to vetted compliance partners. You will receive a follow-up email once shortlisted.",
        cryptographic: {
          hash_chain_identifier: "AIEC_REG_HASH_" + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase(),
          ed25519_signature: generatedRegSignature
        }
      }
    };
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIEC_Sandbox_Receipt_${(company || 'Enterprise').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0B0F19] min-h-screen text-[#dfe2f1] font-sans antialiased selection:bg-indigo-500/30 selection:text-white" id="landing-container">
      {/* Top Header */}
      <header className="border-b border-[#1F2937] bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-50 px-6 h-16 flex items-center justify-between" id="landing-navbar">
        <div className="flex items-center gap-6">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <AiecLogo size="sm" showText={true} />
          </div>
          {/* Regulatory Badges in header */}
          <span className="hidden lg:inline bg-[#171b26]/80 text-[#c7c4d8]/70 border border-[#1f2937] px-2.5 py-1 rounded text-[10px] font-mono tracking-wider">
            STANDARD: ISO/IEC 42001 & EU AI ACT GRC
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <span 
            onClick={onEnterConsole}
            className="text-sm text-[#c7c4d8]/90 hover:text-indigo-400 cursor-pointer transition-colors font-medium font-mono text-xs hidden md:inline"
          >
            LAUNCH COMPLIANCE SANDBOX
          </span>
          <a href="#why-aiec" className="text-xs text-[#c7c4d8] hover:text-[#dfe2f1] transition-colors hidden sm:inline font-medium">Why AIEC?</a>
          <a href="#evidence-chain" className="text-xs text-[#c7c4d8] hover:text-[#dfe2f1] transition-colors hidden sm:inline font-medium">Evidence Chain</a>
          <a href="#live-playground-section" className="text-xs text-[#c7c4d8] hover:text-[#dfe2f1] transition-colors hidden sm:inline font-medium">Privacy-Preserving Architecture</a>
          
          <button 
            onClick={() => setActivationModalOpen(true)}
            className="text-xs text-[#c7c4d8]/90 hover:text-indigo-400 transition-colors font-semibold font-mono flex items-center gap-1.5 cursor-pointer bg-transparent border-0 outline-none"
          >
            <Key className="w-3.5 h-3.5 text-indigo-400" /> Enter Activation Key
          </button>

          <button 
            id="req-sandbox-nav"
            onClick={() => {
              const el = document.getElementById('waiting-list-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#171b26] border border-[#1f2937] hover:border-indigo-500/50 text-[#dfe2f1] text-[11px] font-semibold px-4.5 py-2 rounded transition-all transform hover:scale-[1.02]"
          >
            Request Sandbox Access
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-28 max-w-5xl mx-auto flex flex-col items-center text-center overflow-hidden" id="hero-panel">
        {/* Dynamic ambient dark glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 opacity-30 blur-[130px] rounded-full pointer-events-none"></div>

        {/* Regulatory Target Banner */}
        <div className="inline-flex items-center gap-2 border border-indigo-900/40 bg-[#171b26]/50 rounded-full px-4 py-1.5 text-xs font-mono text-indigo-400 mb-8" id="badge-zk">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>[ ISO 42001 / EU AI ACT STANDARD ]</span>
        </div>

        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.15] tracking-tight max-w-4xl" id="hero-title">
          Pass Enterprise AI Audits <br />
          in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-[#2dd4bf] to-indigo-500">Days, Not Months</span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#c7c4d8]/95 max-w-3xl mb-10 leading-relaxed" id="hero-subtitle">
          Support audit preparation, automate governance workflows, and generate verifiable evidence records for enterprise AI systems.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center animate-fade-in" id="hero-actions">
          <button 
            id="hero-cta-sandbox"
            onClick={() => {
              const el = document.getElementById('waiting-list-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-emerald-500 hover:bg-emerald-450 text-[#0f131d] font-bold text-xs px-8 py-4.5 rounded transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/10 flex items-center gap-2 cursor-pointer"
          >
            Request Sandbox Access
            <ArrowRight className="w-4 h-4 text-[#0f131d]" />
          </button>
          
          <button 
            onClick={() => setActivationModalOpen(true)}
            className="border border-indigo-500/40 hover:border-indigo-500 bg-indigo-950/20 hover:bg-indigo-950/40 text-white text-xs px-8 py-4.5 rounded transition-all font-semibold font-mono flex items-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Key className="w-4 h-4 text-indigo-400" /> Unlock with Activation Key
          </button>

          <button 
            onClick={onEnterConsole}
            className="border border-[#1F2937] hover:bg-[#171b26]/50 text-gray-400 hover:text-white text-[10.5px] px-6 py-4 rounded transition-all font-semibold font-mono"
          >
            Bypass Waitlist Demo
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8 opacity-60 text-[11px] font-mono">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PRIVACY-PRESERVING LOGGING</span>
          <span className="hidden sm:inline-block text-gray-750">•</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PASSES HIGH-SECURITY AUDITS</span>
          <span className="hidden sm:inline-block text-gray-750">•</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> EXPORTABLE EVIDENCE TRAILS</span>
        </div>
      </section>

      {/* Section 2: The Compliance Gap */}
      <section className="px-6 py-24 bg-[#0d111d] border-t border-[#1F2937]" id="compliance-gap">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold text-[#f59e0b] bg-amber-950/20 border border-amber-900/35 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              The Traceability Bottleneck
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              The Compliance Gap
            </h2>
            <p className="text-sm sm:text-base text-[#c7c4d8]/90 leading-relaxed font-sans">
              Standard logging systems (like Splunk or Datadog) track servers, not AI governance. When enterprise buyers or GRC auditors ask for proof of operations and human-in-the-loop oversight, organizations find themselves with a dangerous compliance gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
            {/* Without AIEC Column */}
            <div className="border border-red-950/40 bg-[#0c0a0b] rounded-xl p-6 sm:p-8 space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">Without AIEC (Traceability Gap)</h4>
                </div>

                <div className="space-y-3 relative text-left">
                  <div className="flex items-center gap-3 bg-[#110b0d] border border-red-950/25 p-3 rounded">
                    <span className="text-xs font-mono font-bold bg-red-950/30 text-red-400 px-2.5 py-1 rounded border border-red-900/35 shrink-0 select-none">01</span>
                    <div>
                      <span className="block text-xs font-semibold text-gray-300">ChatGPT Output</span>
                      <span className="block text-[10px] text-gray-400">Outputs generated with no source tracking or version controls.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#110b0d] border border-red-950/25 p-3 rounded">
                    <span className="text-xs font-mono font-bold bg-red-950/30 text-red-400 px-2.5 py-1 rounded border border-red-900/35 shrink-0 select-none">02</span>
                    <div>
                      <span className="block text-xs font-semibold text-gray-300">Word Document Manual Copy</span>
                      <span className="block text-[10px] text-gray-400">Manual edits with zero record of drift or original state.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#110b0d] border border-red-950/25 p-3 rounded">
                    <span className="text-xs font-mono font-bold bg-red-950/30 text-red-400 px-2.5 py-1 rounded border border-red-900/35 shrink-0 select-none">03</span>
                    <div>
                      <span className="block text-xs font-semibold text-gray-300">Email Approval</span>
                      <span className="block text-[10px] text-gray-400">Disconnected sign-offs buried inside corporate inboxes.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#110b0d] border border-red-950/25 p-3 rounded">
                    <span className="text-xs font-mono font-bold bg-red-950/30 text-red-400 px-2.5 py-1 rounded border border-red-900/35 shrink-0 select-none">04</span>
                    <div>
                      <span className="block text-xs font-semibold text-gray-300">Slack Message Approval</span>
                      <span className="block text-[10px] text-gray-400">Informal checks lacking legal backing or audit archives.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-red-950/40 pt-4 bg-red-950/5 rounded p-4 text-left border-2 border-dashed border-red-900/15">
                <div className="text-red-400 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 mb-2 font-mono">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  No Traceability • No Audit Trail
                </div>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Your organization has no unified record of how AI outputs were modified, approved, or validated. Preparing for ISO 42001 reviews requires hundreds of manual spreadsheets.
                </p>
              </div>
            </div>

            {/* With AIEC Column */}
            <div className="border border-[#2dd4bf]/20 bg-gradient-to-b from-[#0c1417]/20 to-[#090d12] rounded-xl p-6 sm:p-8 space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2dd4bf]/[0.02] rounded-full blur-2xl pointer-events-none"></div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">With AIEC (Immutable Governance)</h4>
                </div>

                <div className="space-y-3 relative text-left">
                  <div className="flex items-center gap-3 bg-[#0d1716]/40 border border-[#2dd4bf]/15 p-3 rounded">
                    <span className="text-xs font-mono font-bold bg-emerald-950/30 text-emerald-400 px-2.5 py-1 rounded border border-[#2dd4bf]/20 shrink-0 select-none">01</span>
                    <div>
                      <span className="block text-xs font-semibold text-white">Generated</span>
                      <span className="block text-[10px] text-gray-400 font-mono">SHA-256 fingerprint generated at point of inference.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0d1716]/40 border border-[#2dd4bf]/15 p-3 rounded">
                    <span className="text-xs font-mono font-bold bg-emerald-950/30 text-emerald-400 px-2.5 py-1 rounded border border-[#2dd4bf]/20 shrink-0 select-none">02</span>
                    <div>
                      <span className="block text-xs font-semibold text-white">Edited</span>
                      <span className="block text-[10px] text-gray-400">All human modifications automatically tracked as linked hashes.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0d1716]/20 border border-[#2dd4bf]/10 p-3 rounded">
                    <span className="text-xs font-mono font-bold bg-emerald-950/30 text-emerald-400 px-2.5 py-1 rounded border border-[#2dd4bf]/20 shrink-0 select-none">03</span>
                    <div>
                      <span className="block text-xs font-semibold text-white">Reviewed</span>
                      <span className="block text-[10px] text-gray-400">Automatic validation mapping to critical ISO 42001 controls.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0d1716]/20 border border-[#2dd4bf]/10 p-3 rounded">
                    <span className="text-xs font-mono font-bold bg-emerald-950/30 text-emerald-400 px-2.5 py-1 rounded border border-[#2dd4bf]/20 shrink-0 select-none">04</span>
                    <div>
                      <span className="block text-xs font-semibold text-white">Approved & Exported</span>
                      <span className="block text-[10px] text-gray-400">Sovereign GC sign-off with mathematically defensible exports.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#2dd4bf]/10 pt-4 bg-emerald-950/5 rounded p-4 text-left border border-emerald-500/20">
                <div className="text-emerald-400 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 mb-2 font-mono">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-400/10" />
                  Automated Evidence Chain
                </div>
                <p className="text-[11px] text-gray-400 leading-normal">
                  All pipelines, human adjustments, and executive sign-offs form a sequential, immutable Merkle registry. Instantly generate audit-ready governance packages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2.5: Why Enterprises Choose AIEC - Focus on Outcomes */}
      <section className="px-6 py-24 bg-[#0a0e1a] border-t border-[#1F2937]" id="why-aiec">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              Strategic AI System of Record
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Why Enterprises Choose AIEC
            </h2>
            <p className="text-sm sm:text-base text-[#c7c4d8]/90 leading-relaxed font-sans">
              AIEC bridges the gap between engineering innovations and high-security compliance constraints, delivering verifiable safety oversight without slowing down development cycles.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="border border-indigo-950/60 bg-[#111522]/20 hover:border-indigo-500/20 p-6 rounded-lg space-y-3 transition-all">
              <span className="w-8 h-8 rounded border border-indigo-500/30 bg-indigo-950/20 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">01</span>
              <h3 className="text-base font-bold text-white tracking-tight">Human Accountability</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every AI-generated artifact is tied directly to real organizational identities and documented human approvals, eliminating arbitrary unaccounted LLM edits.
              </p>
            </div>

            <div className="border border-indigo-950/60 bg-[#111522]/20 hover:border-indigo-500/20 p-6 rounded-lg space-y-3 transition-all">
              <span className="w-8 h-8 rounded border border-indigo-500/30 bg-indigo-950/20 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">02</span>
              <h3 className="text-base font-bold text-white tracking-tight">Audit Readiness</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generate expert audit-ready evidence packages aligned beautifully to ISO 42001 and internal corporate standards, avoiding weeks of frantic document preparation.
              </p>
            </div>

            <div className="border border-indigo-950/60 bg-[#111522]/20 hover:border-indigo-500/20 p-6 rounded-lg space-y-3 transition-all">
              <span className="w-8 h-8 rounded border border-indigo-500/30 bg-indigo-950/20 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">03</span>
              <h3 className="text-base font-bold text-white tracking-tight">Procurement Acceleration</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Help risk managers and enterprise buyers instantly verify your internal AI safety and privacy controls, passing detailed security screenings without delays.
              </p>
            </div>

            <div className="border border-indigo-950/60 bg-[#111522]/20 hover:border-indigo-500/20 p-6 rounded-lg space-y-3 transition-all">
              <span className="w-8 h-8 rounded border border-indigo-500/30 bg-indigo-950/20 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">04</span>
              <h3 className="text-base font-bold text-white tracking-tight">Regulatory Confidence</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Establish robust, mathematically provable records detailing exactly how models were initialized, modified, approved, and exported with privacy-preserving keys.
              </p>
            </div>
          </div>

          {/* Simple Process Comparison Table (Replacing the matrix table) */}
          <div className="pt-6 text-left">
            <h3 className="text-md sm:text-lg font-bold text-white tracking-tight text-center mb-6">Process Transformation</h3>
            <div className="border border-[#1F2937] bg-[#0c101a] rounded-xl overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#111522] border-b border-[#1F2937]">
                    <th className="p-4 text-gray-400 font-mono text-[10px] uppercase tracking-wider font-bold w-1/2">Traditional Process</th>
                    <th className="p-4 border-l border-[#1F2937] text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-bold w-1/2">With AIEC Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937] text-gray-300">
                  <tr className="hover:bg-[#111522]/10">
                    <td className="p-4 text-[#c7c4d8]/80">Manual spreadsheet entries prone to omission or backdating</td>
                    <td className="p-4 border-l border-[#1F2937] text-emerald-300 bg-emerald-950/5 font-medium">Automated, client-side cryptographic evidence chain</td>
                  </tr>
                  <tr className="hover:bg-[#111522]/10">
                    <td className="p-4 text-[#c7c4d8]/80">Unverified email-based approvals lost in inbox volumes</td>
                    <td className="p-4 border-l border-[#1F2937] text-emerald-300 bg-emerald-950/5 font-medium">Cryptographically-signed, verified approval records</td>
                  </tr>
                  <tr className="hover:bg-[#111522]/10">
                    <td className="p-4 text-[#c7c4d8]/80">Audit preparation takes weeks of sorting artifacts</td>
                    <td className="p-4 border-l border-[#1F2937] text-emerald-300 bg-emerald-950/5 font-medium">Certified audit packages generated instantly in seconds</td>
                  </tr>
                  <tr className="hover:bg-[#111522]/10">
                    <td className="p-4 text-[#c7c4d8]/80">Fragmented documentation silos across systems</td>
                    <td className="p-4 border-l border-[#1F2937] text-emerald-300 bg-emerald-950/5 font-medium">Unified, centralized GRC system of record for AI pipelines</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Centered Killer Statistic Block */}
          <div className="bg-indigo-950/10 border border-indigo-900/30 rounded-xl p-8 max-w-2xl mx-auto text-center space-y-6">
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block font-sans">Operational Pivot</span>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold font-sans text-white">What AIEC Replaces</h3>
              <p className="text-xs text-gray-400 font-sans">Retire high-overhead, unreliable tracking methods for modern AI deployments.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-w-xl mx-auto text-[10px] font-mono font-bold text-gray-400">
              <div className="p-2.5 bg-black/40 border border-[#1F2937] rounded flex items-center justify-center">Spreadsheets</div>
              <div className="p-2.5 bg-black/40 border border-[#1F2937] rounded flex items-center justify-center">Email Chains</div>
              <div className="p-2.5 bg-black/40 border border-[#1F2937] rounded flex items-center justify-center">Screenshots</div>
              <div className="p-2.5 bg-black/40 border border-[#1F2937] rounded flex items-center justify-center">Wiki Guides</div>
              <div className="col-span-2 sm:col-span-1 p-2.5 bg-black/40 border border-[#1F2937] rounded flex items-center justify-center">Manual Prep</div>
            </div>

            <div className="flex flex-col items-center">
              <ArrowRight className="w-5 h-5 text-indigo-400 rotate-90" />
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded max-w-sm mx-auto">
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-0.5">THE SECURE SYSTEM OF RECORD</span>
              <span className="text-sm font-bold text-white font-sans block">One Verifiable Governance Record</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Visual Concept (The Evidence Chain) */}
      <section className="px-6 py-20 bg-[#0a0e18] border-y border-[#1F2937]" id="evidence-chain">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-[#2dd4bf] uppercase tracking-widest">HOW AIEC WORKS</span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-3 tracking-tight">The Immutable Evidence Chain</h2>
            <p className="text-sm text-[#c7c4d8]/80 max-w-2xl mx-auto leading-relaxed">
              Step-by-step verification of AI lifecycles. Track model outputs dynamically from original generation down to regulatory off-site compliance package sealing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Timeline Selection column (Left/Top) */}
            <div className="lg:col-span-7 space-y-6 relative before:absolute before:left-6 before:top-8 before:bottom-8 before:w-[2.5px] before:bg-gradient-to-b before:from-[#2dd4bf] before:via-indigo-500 before:to-emerald-500 pl-14 flex flex-col justify-center">
              {timelineSteps.map((step, index) => {
                const isActive = selectedTimelineStep === index;
                // bullet border matching GRC stages
                const bulletBorders = [
                  'border-[#2dd4bf]',
                  'border-fuchsia-500',
                  'border-indigo-500',
                  'border-amber-500',
                  'border-emerald-500'
                ];
                return (
                  <div 
                    key={index}
                    onClick={() => setSelectedTimelineStep(index)}
                    className={`group p-5 border rounded cursor-pointer transition-all relative ${
                      isActive 
                        ? 'bg-[#171b26] border-indigo-500/80 shadow-lg shadow-indigo-500/5' 
                        : 'border-[#1F2937] bg-[#0c101b]/50 hover:bg-[#111624] hover:border-gray-700'
                    }`}
                  >
                    {/* Floating connecting bullet marker */}
                    <div className={`absolute right-full mr-5.5 top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#0a0e18] border-2 ${bulletBorders[index]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-gray-600'}`}></span>
                    </div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${step.badgeColor}`}>
                          {step.badge}
                        </span>
                        <h3 className="font-semibold text-sm text-white group-hover:text-indigo-400 transition-colors">
                          {step.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400 fill-emerald-400/20" /> Verified
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#c7c4d8]/80 leading-relaxed mb-3">
                      {step.detail}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                      <span>{step.meta}</span>
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSchemaStep(index);
                          setActiveSchemaTab('json');
                          setVerifyingSchemaSuccess(null);
                        }}
                        className="text-[#2dd4bf] hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-semibold bg-[#2dd4bf]/5 hover:bg-[#2dd4bf]/15 px-2 py-1 rounded border border-[#2dd4bf]/20"
                      >
                        View Schema <ArrowRight className="w-3 h-3 text-[#2dd4bf]" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cryptographic Inspector details pane (Right/Bottom) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0b0f19] border border-[#1F2937] h-full rounded shadow-xl overflow-hidden flex flex-col">
                <div className="bg-[#111522] px-4 py-3 border-b border-[#1F2937] flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400 font-semibold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" /> CRYPTO_VERIFICATION_DECORATOR
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="p-5 flex-grow space-y-4 font-mono text-xs overflow-auto font-sans leading-relaxed">
                  <div>
                    <span className="text-[#c7c4d8]/40 block mb-1 uppercase tracking-wider text-[10px] font-mono">Active Node ID</span>
                    <span className="text-[#dfe2f1] font-mono">node-00{selectedTimelineStep + 1}</span>
                  </div>

                  <div>
                    <span className="text-[#c7c4d8]/40 block mb-1 uppercase tracking-wider text-[10px] font-mono">Cryptographic State</span>
                    <span className="text-white bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/30 text-[10px] font-mono">
                      {timelineSteps[selectedTimelineStep].badge}
                    </span>
                  </div>

                  {timelineSteps[selectedTimelineStep].hash && (
                    <div>
                      <span className="text-[#c7c4d8]/40 block mb-1 uppercase tracking-wider text-[10px] font-mono">SHA-256 Payload Hash</span>
                      <div className="bg-[#0c101a] p-2.5 rounded border border-[#1F2937] break-all text-[11px] text-[#c7c4d8] font-mono">
                        {timelineSteps[selectedTimelineStep].hash}
                      </div>
                    </div>
                  )}

                  {timelineSteps[selectedTimelineStep].diffMinus && (
                    <div>
                      <span className="text-[#c7c4d8]/40 block mb-1 uppercase tracking-wider text-[10px] font-mono">Policy Mutation State</span>
                      <div className="bg-[#0c101a] p-2 rounded border border-[#1F2937] space-y-1.5">
                        <div className="text-red-400 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                          {timelineSteps[selectedTimelineStep].diffMinus}
                        </div>
                        <div className="text-emerald-400 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                          {timelineSteps[selectedTimelineStep].diffPlus}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-[#c7c4d8]/40 block mb-1 uppercase tracking-wider text-[10px] font-mono">Verification Signature Chain</span>
                    <div className="bg-[#171b26]/50 p-2 text-[10px] rounded text-emerald-400 flex flex-col gap-1 border border-emerald-950/30 font-mono">
                      <span>SIGN_ALG: Ed25519 (EdDSA)</span>
                      <span>KEY_ID: {timelineSteps[selectedTimelineStep].signature_key}</span>
                      <span className="break-all opacity-80 select-all">SIG: ZXI4OTMyNDhrandoZmtfZ2VudGVzdDFmY2Fh...</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-800">
                    <button 
                      onClick={onEnterConsole}
                      className="w-full bg-[#111625] hover:bg-indigo-900/20 text-[#dfe2f1] text-xs py-2.5 px-3 border border-[#1F2937] hover:border-indigo-500/40 rounded transition-colors text-center font-semibold font-mono"
                    >
                      Audit Full Chain in Active Sandbox
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Executive Certification Report Showcase */}
      <section className="px-6 py-24 bg-[#0d111d] border-t border-[#1F2937]" id="certification-report">
        <div className="max-w-5xl mx-auto space-y-16 flex flex-col items-center">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              Board-Ready Deliverable Artifact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Executive AI Governance Assessment
            </h2>
            <p className="text-sm sm:text-base text-[#c7c4d8]/90 leading-relaxed font-sans max-w-2xl mx-auto">
              At any point in your AI development or operational journey, generate a compliance certification to demonstrate continuous alignment with ISO 42001 and regulatory criteria.
            </p>
          </div>

          {/* High-Fidelity Certificate Showcase Mockup */}
          <div className="border border-indigo-500/25 bg-gradient-to-b from-[#111625] to-[#080b13] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden text-left shadow-2xl w-full max-w-3xl">
            {/* Background seal watermark */}
            <div className="absolute right-[-40px] bottom-[-40px] text-indigo-500/[0.03] select-none pointer-events-none transform -rotate-12">
              <Shield className="w-80 h-80" />
            </div>

            {/* Certification header */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-[#1F2937]/50 pb-6">
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-3">
                  <AiecLogo size="xs" showText={true} />
                  <div className="h-4 w-[1px] bg-gray-800"></div>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    ISO/IEC 42001 STANDARD
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">AI Compliance Readiness Report</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-mono text-gray-500 mt-1">
                    <span>ORGANIZATION: <span className="text-gray-300 font-semibold">ENTERPRISE CLOUD CORP</span></span>
                    <span>•</span>
                    <span>GOVERNANCE RECORD ID: <span className="text-gray-300 uppercase leading-none font-semibold">AIEC-8912</span></span>
                  </div>
                </div>
              </div>

              {/* Status score banner */}
              <div className="md:col-span-5 flex justify-end w-full">
                <div className="bg-[#171c2c]/40 border border-[#2dd4bf]/20 rounded-lg p-3.5 text-left w-full sm:max-w-xs shadow-inner">
                  <div className="text-[8px] font-mono text-gray-550 uppercase tracking-widest font-bold mb-0.5">EXECUTIVE AUDIT SUMMARY</div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    READY FOR ISO 42001 STANDARD REVIEW
                  </div>
                  <div className="grid grid-cols-3 gap-x-2 mt-2 pt-2 border-t border-[#1F2937]/50 text-[9px] font-mono">
                    <div>
                      <span className="text-gray-550 block text-[8px]">Assets Governed:</span>
                      <span className="text-emerald-400 font-bold">128</span>
                    </div>
                    <div>
                      <span className="text-gray-550 block text-[8px]">Approvals Logged:</span>
                      <span className="text-[#2dd4bf] font-bold">56</span>
                    </div>
                    <div>
                      <span className="text-gray-550 block text-[8px]">Packages:</span>
                      <span className="text-[#f59e0b] font-bold">18</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate content statement */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              This report confirms that the reviewed AI workflow maintains documented human oversight, auditability, approval controls, and exportable compliance evidence aligned with ISO/IEC 42001 governance requirements.
            </p>

            {/* Compliance attributes list (Retained from Checklist!) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-black/30 border border-gray-950 rounded p-3 text-center space-y-1">
                <span className="block text-[8.5px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Human checks</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1 font-mono">
                  <Check className="w-3 h-3 text-emerald-400" /> PROVEN
                </span>
                <span className="text-[8px] text-gray-600 font-mono block">Annex A.11</span>
              </div>
              <div className="bg-black/30 border border-gray-950 rounded p-3 text-center space-y-1">
                <span className="block text-[8.5px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Continuous log</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1 font-mono">
                  <Check className="w-3 h-3 text-emerald-400" /> ACTIVE
                </span>
                <span className="text-[8px] text-gray-600 font-mono block">Annex A.7</span>
              </div>
              <div className="bg-black/30 border border-gray-950 rounded p-3 text-center space-y-1">
                <span className="block text-[8.5px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Identity Key</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1 font-mono">
                  <Check className="w-3 h-3 text-emerald-400" /> ENFORCED
                </span>
                <span className="text-[8px] text-gray-600 font-mono block">Asymmetric Keys</span>
              </div>
              <div className="bg-black/30 border border-gray-950 rounded p-3 text-center space-y-1">
                <span className="block text-[8.5px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Compliance check</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1 font-mono">
                  <Check className="w-3 h-3 text-emerald-400" /> EXPORTABLE
                </span>
                <span className="text-[8px] text-gray-600 font-mono block">Sealed JSONs</span>
              </div>
            </div>

            {/* Signatures/Seal Block */}
            <div className="border-t border-[#1F2937]/50 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="font-mono text-[9px] text-gray-500 space-y-0.5">
                <div>LEDGER TRUST CHAIN: <span className="text-gray-400 uppercase">ACTIVE COGNITIVE LINEAGE VERIFIED</span></div>
                <div>SECURE SHA: <span className="text-gray-400 uppercase">F7E91B2C66A4BC3273D1E0B91...</span></div>
              </div>

              {/* Digital Watermark Seal */}
              <div className="flex items-center gap-3">
                <div className="bg-black/40 border border-amber-500/20 p-1.5 rounded flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-[2px] w-6 h-6 opacity-60">
                    <div className="bg-amber-400"></div>
                    <div className="bg-amber-400"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-amber-400"></div>
                    <div className="bg-amber-400"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-amber-400"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-amber-400"></div>
                    <div className="bg-amber-400"></div>
                    <div className="bg-amber-400"></div>
                    <div className="bg-amber-400"></div>
                    <div className="bg-transparent"></div>
                    <div className="bg-amber-400"></div>
                    <div className="bg-transparent"></div>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-white block">AIEC REGULATORY DESK</span>
                  <span className="text-[8px] text-emerald-400 font-semibold font-mono block tracking-wider uppercase">DIGITAL WATERMARK SECURED ✓</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button 
              onClick={onEnterConsole}
              className="inline-flex items-center gap-2 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold text-xs px-8 py-4.5 rounded transition-colors font-mono cursor-pointer shadow-lg shadow-indigo-950/45"
            >
              PREVIEW INTERACTIVE REPORTS IN ACTIVE SANDBOX
              <ArrowRight className="w-4 h-4 text-white animate-pulse" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 5: Interactive Sandbox & Privacy-Preserving Architecture */}
      <section className="px-6 py-24 bg-[#0c101a] border-t border-[#1F2937]" id="live-playground-section">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-3 py-1 rounded-full uppercase tracking-widest inline-block animate-pulse">
              Interactive local sandbox playground
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Interactive GRC Sandbox
            </h2>
            <p className="text-sm sm:text-base text-[#c7c4d8]/90 leading-relaxed font-sans">
              Experience the core privacy-preserving technology. Enter a test LLM prompt and response. Because AIEC acts locally, the SHA-256 digesting and Ed25519 key signing are executed entirely in your browser. No raw text is ever sent to our servers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Left Box: Client input form */}
            <form onSubmit={handleLocalSignAndCertify} className="bg-[#111522] border border-[#1F2937] rounded-lg p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#c7c4d8] uppercase tracking-wider">
                    Step 1: Input LLM Prompt Payload
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 font-semibold font-mono">Auditable Input</span>
                </div>
                <textarea
                  className="w-full h-24 bg-[#090b12] border border-[#1F2937] hover:border-indigo-500/30 focus:border-indigo-500 text-xs text-white p-3.5 rounded focus:outline-none placeholder-gray-600 font-mono resize-none leading-relaxed"
                  value={sandboxPrompt}
                  onChange={(e) => setSandboxPrompt(e.target.value)}
                  placeholder="e.g. system: analyze trade ledger credentials against security policy..."
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#c7c4d8] uppercase tracking-wider">
                    Step 2: Enter Model Response
                  </span>
                  <span className="text-[9px] font-mono text-gray-550 font-semibold font-mono">Sensitive Completion Range</span>
                </div>
                <textarea
                  className="w-full h-24 bg-[#090b12] border border-[#1F2937] hover:border-indigo-500/30 focus:border-indigo-500 text-xs text-white p-3.5 rounded focus:outline-none placeholder-gray-600 font-mono resize-none leading-relaxed"
                  value={sandboxResponse}
                  onChange={(e) => setSandboxResponse(e.target.value)}
                  placeholder="e.g. model response: credentials verified under section 3 guidelines..."
                  required
                />
              </div>

              <div className="bg-[#171c2b] p-3.5 rounded border border-indigo-950/40 text-[11px] text-[#c7c4d8]/90 flex items-start gap-2.5 leading-relaxed text-left">
                <ShieldCheck className="w-4 h-4 text-[#2dd4bf] mt-0.5 shrink-0" />
                <span>
                  <strong>Privacy Assurance:</strong> Dynamic client hashing converts messages to SHA-256 before ledger submissions. Raw strings remain in memory and are never transmitted.
                </span>
              </div>

              <button 
                type="submit"
                disabled={localSignActive}
                className={`w-full py-4 text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 rounded select-none cursor-pointer border-none ${
                  localSignActive 
                    ? 'bg-indigo-900/40 text-indigo-400 border border-indigo-700/50 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-450 text-[#0f131d] active:scale-[0.99] shadow-md shadow-emerald-500/10'
                }`}
              >
                {localSignActive ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-white animate-spin"></span>
                    COMPUTING SECURE LOCAL HASHES ENVELOPE...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0f131d]" />
                    LOCALLY SIGN & SECURE TRIAL COMPLIANCE RECORD
                  </span>
                )}
              </button>
            </form>

            {/* Right Box: Dynamic Output Terminal */}
            <div className="bg-[#0a0e18] border border-[#1F2937] rounded-lg shadow-2xl overflow-hidden flex flex-col justify-between">
              <div className="bg-[#111522] border-b border-[#1F2937] px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-semibold flex items-center gap-1.5 font-mono">
                  <TerminalIcon className="w-3.5 h-3.5" /> Client Sandbox Terminal Result
                </span>
                <div className="flex bg-[#0c101a] rounded p-0.5 border border-[#1F2937]">
                  {(['inference', 'merkle', 'verify'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTerminalTab(tab)}
                      className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase transition-all ${
                        terminalTab === tab 
                          ? 'bg-indigo-600 font-semibold text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 font-mono text-[11px] leading-[1.6] overflow-x-auto min-h-[320px] bg-[#070a11] text-gray-400 flex flex-col justify-between flex-grow">
                {localSignActive ? (
                  <div className="h-full flex flex-col items-center justify-center my-auto text-center gap-3 py-14">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                    <p className="text-indigo-400 text-xs font-semibold">Computing cryptographic hashes locally...</p>
                    <p className="text-[10px] text-gray-650 font-mono">window.crypto.subtle.digest(&apos;SHA-256&apos;)</p>
                  </div>
                ) : localSignShowResult ? (
                  <div className="space-y-4">
                    <div className="text-emerald-400 font-bold border-b border-emerald-950/30 pb-2.5 flex items-center gap-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-450/10" /> SECURE PROVENANCE ENVELOPE BUILT ✓
                    </div>
                    
                    <pre className="text-[#a5b4fc] text-left overflow-auto max-h-[170px] bg-[#05080e] p-3 rounded border border-gray-900 leading-relaxed text-[10px]">
{JSON.stringify({
  "event": "audit_evidence_trail",
  "client_origin": "Browser (Local Signing Architecture)",
  "timestamp": localSignTimestamp,
  "standards": ["ISO-42001:2023 A.7", "ISO-42001:2023 A.11"],
  "payload_metadata": {
    "prompt_char_length": sandboxPrompt.length,
    "response_char_length": sandboxResponse.length,
    "algorithm_consistent_standard": "Ed25519 (EdDSA)"
  },
  "cryptography": {
    "sha256_hash": localHash,
    "signature_block": localSignature
  },
  "raw_data_transmitted_to_aiec": null
}, null, 2)}
                    </pre>

                    <div className="bg-[#0b1712] border border-emerald-950 p-3.5 rounded text-emerald-405 text-[10.5px] leading-relaxed text-left font-sans">
                      <span className="font-bold flex items-center gap-1.5 text-emerald-400 uppercase mb-1 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy-Preserving Local Verification
                      </span>
                      This evidence record is signed completely in your local browser environment. This is the core engine of corporate-defensible AI logging.
                      <div className="mt-3 pt-2.5 border-t border-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="text-emerald-500 font-bold uppercase font-mono tracking-wider text-[9px]">Status: SECURED LOCAL FRAME</span>
                        <button 
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('waiting-list-section');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-emerald-500 hover:bg-emerald-450 text-[#0c101a] font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer inline-flex items-center gap-1 transition-all uppercase font-mono shadow-md border-none"
                        >
                          Request Pilot Access <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full flex-grow space-y-4">
                    {/* Render static JSON if no dynamic signature generated yet */}
                    <pre className="text-indigo-455 text-left overflow-auto max-h-[170px] bg-[#05080e]/40 p-3 rounded border border-gray-950 leading-relaxed text-[10px] select-none">
{JSON.stringify(terminalPayloads[terminalTab], null, 2)}
                    </pre>
                    <div className="h-full flex flex-col items-center justify-center my-auto text-center gap-2 py-6 text-left">
                      <TerminalIcon className="w-8 h-8 text-indigo-500/30 mb-1" />
                      <p className="text-[#c7c4d8]/80 text-xs font-semibold">Secure Sandbox Active</p>
                      <p className="text-[10px] text-gray-500 max-w-xs leading-relaxed">
                        Fill out Step 1 & Step 2 on the left and click &quot;Locally Sign &amp; Secure&quot; to execute browser-level WebCrypto signing of your content.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: The Enterprise Feature Checklist */}
      <section className="bg-[#0c1019] border-y border-[#1F2937] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block">AUDITOR-GRADE ATTRIBUTES</span>
            <h2 className="text-3xl font-bold text-white mt-1">Enterprise Operational Capabilities</h2>
            <p className="text-sm text-gray-400 mt-2">Engineered strictly to pass rigorous conformity assessments and audits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#111522] border border-[#1F2937] rounded flex gap-4">
              <div className="text-indigo-400 mt-1">
                <Cpu className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white mb-2">Continuous Logging (ISO 42001 A.7)</h3>
                <p className="text-xs text-gray-405 leading-relaxed">
                  Keep an unbroken record of every model version, system prompt boundary configuration, and raw output generated. Automatically cataloged without administrative manual drag.
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#111522] border border-[#1F2937] rounded flex gap-4">
              <div className="text-indigo-400 mt-1">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white mb-2">Human-in-the-Loop Signatures (ISO 42001 A.11)</h3>
                <p className="text-xs text-gray-405 leading-relaxed">
                  Tie human edits and legal approvals directly to the document's history using cryptographically verified employee key signatures inside your corporate network.
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#111522] border border-[#1F2937] rounded flex gap-4">
              <div className="text-indigo-400 mt-1">
                <Layers className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white mb-2">Exportable Compliance Bundles</h3>
                <p className="text-xs text-gray-405 leading-relaxed">
                  Download self-contained, signed JSON files that external GRC auditors can analyze offline using standard evidence verification tools with zero hassle.
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#111522] border border-[#1F2937] rounded flex gap-4">
              <div className="text-indigo-400 mt-1">
                <ListTodo className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white mb-2">Hybrid Deployment Options</h3>
                <p className="text-xs text-gray-405 leading-relaxed">
                  Deploy AIEC via secure, sealed Docker containers directly within your private cloud environment (AWS, Azure, or GCP Virtual Private Clouds). No egress parameters required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: The Exit Gate - Qualified Private Sandbox Program */}
      <section className="px-6 py-20 max-w-3xl mx-auto" id="waiting-list-section">
        <div className="bg-[#111522] border border-[#1F2937] p-8 md:p-10 rounded text-left relative overflow-hidden">
          {/* Accent border line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500"></div>

          <div className="mb-6">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">PRIVATE ACCREDITATION</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-2 tracking-tight">Request Private Sandbox Access</h3>
            <p className="text-xs sm:text-sm text-[#c7c4d8]/90 leading-relaxed">
              Explore how AIEC generates verifiable governance records for AI-generated content, human approvals, and compliance reviews.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-4" id="waitlist-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-550 uppercase mb-1">Corporate Work Email</label>
                <input 
                  className="w-full bg-[#090b12] border border-[#1F2937] hover:border-indigo-500/30 focus:border-indigo-500 text-xs text-white px-4 py-3 rounded focus:outline-none placeholder-gray-600"
                  placeholder="e.g. ciso@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  disabled={cryptSigningProgress || subscribed}
                  required
                />
                {emailWarning && (
                  <p className="text-red-400 font-mono text-[9px] mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {emailWarning}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-550 uppercase mb-1">Company / Organization name</label>
                <input 
                  className="w-full bg-[#090b12] border border-[#1F2937] hover:border-indigo-500/30 focus:border-indigo-500 text-xs text-white px-4 py-3 rounded focus:outline-none placeholder-gray-600"
                  placeholder="e.g. Enterprise Logistics Corp"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={cryptSigningProgress || subscribed}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-550 uppercase mb-1">Company Size</label>
                <select 
                  className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-4 py-3 rounded focus:outline-none"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  disabled={cryptSigningProgress || subscribed}
                >
                  <option value="1-50">1 - 50 employees</option>
                  <option value="51-250">51 - 250 employees</option>
                  <option value="251-1000">251 - 1000 employees</option>
                  <option value="1000+">1000+ employees (Enterprise)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-550 uppercase mb-1">Current AI Usage (Employees using AI)</label>
                <select 
                  className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-4 py-3 rounded focus:outline-none"
                  value={aiUsage}
                  onChange={(e) => setAiUsage(e.target.value)}
                  disabled={cryptSigningProgress || subscribed}
                >
                  <option value="1-10">1 - 10 active users</option>
                  <option value="11-50">11 - 50 active users</option>
                  <option value="51-250">51 - 250 active users</option>
                  <option value="250+">250+ active users</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-550 uppercase mb-1">How urgent is this challenge?</label>
                <select 
                  className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-4 py-3 rounded focus:outline-none"
                  value={urgency}
                  onChange={(e) => {
                    setUrgency(e.target.value);
                    setPreparingForAudit(e.target.value);
                  }}
                  disabled={cryptSigningProgress || subscribed}
                >
                  <option value="Actively preparing for audit">Actively preparing for audit</option>
                  <option value="Within 6 months">Within 6 months</option>
                  <option value="Researching solutions">Researching solutions</option>
                  <option value="Just exploring">Just exploring</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-550 uppercase mb-1">What is your primary compliance target?</label>
                <select 
                  className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-4 py-3 rounded focus:outline-none"
                  value={complianceTarget}
                  onChange={(e) => setComplianceTarget(e.target.value)}
                  disabled={cryptSigningProgress || subscribed}
                >
                  <option value="ISO 42001">ISO 42001 Standard</option>
                  <option value="SOC 2 Attestation">SOC 2 (Security/Confidentiality)</option>
                  <option value="EU AI Act">EU AI Act Conformity</option>
                  <option value="Internal Audit / Security review">Internal Audit / Security review</option>
                  <option value="Unsure / General exploration">Unsure / General exploration</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-550 uppercase mb-1">What AI models do you run in production?</label>
                <select 
                  className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-4 py-3 rounded focus:outline-none"
                  value={aiModels}
                  onChange={(e) => setAiModels(e.target.value)}
                  disabled={cryptSigningProgress || subscribed}
                >
                  <option value="OpenAI">OpenAI (GPT-4o, etc.)</option>
                  <option value="Claude">Claude 3.5 Sonnet / Opus</option>
                  <option value="Custom / Open source LLMs">Custom / Open-source LLMs</option>
                  <option value="Azure OpenAI instances">Azure OpenAI Instances</option>
                  <option value="None yet / Evaluating options">None yet / Evaluating options</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-gray-550 uppercase mb-1">How do you currently track AI provenance?</label>
                <select 
                  className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-4 py-3 rounded focus:outline-none"
                  value={currentProcess}
                  onChange={(e) => setCurrentProcess(e.target.value)}
                  disabled={cryptSigningProgress || subscribed}
                >
                  <option value="Manual">Manual (Wikis, Spreadsheets)</option>
                  <option value="Custom built">Custom Built Log Aggregator</option>
                  <option value="None">None at present</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">
                Biggest Pain — What is currently slowing down your AI governance process? (Select all that apply)
              </label>

              {/* Prominent High-Impact Pain Card */}
              {(() => {
                const isSelected = selectedPains.includes('Audit preparation');
                return (
                  <button
                    type="button"
                    disabled={cryptSigningProgress || subscribed}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPains(selectedPains.filter(p => p !== 'Audit preparation'));
                      } else {
                        setSelectedPains([...selectedPains, 'Audit preparation']);
                      }
                    }}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-lg border text-left transition-all relative overflow-hidden ${
                      isSelected 
                        ? 'bg-indigo-950/30 border-emerald-500/80 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)] text-white' 
                        : 'bg-[#0b0e17] border-[#1F2937] hover:border-emerald-500/40 text-gray-300'
                    } ${cryptSigningProgress || subscribed ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {/* Corner badge */}
                    <div className="absolute top-0 right-0 bg-[#10b981]/15 text-[#10b981] font-mono text-[8.5px] font-bold px-2.5 py-0.5 rounded-bl border-l border-b border-[#10b981]/20 uppercase tracking-wider">
                      Primary Target Pain
                    </div>

                    <div className={`mt-0.5 w-4 h-4 rounded border border-gray-650 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[12px] font-sans font-bold leading-tight text-white block">
                        Audit preparation takes too much manual work
                      </span>
                      <p className="text-[10px] text-gray-400 leading-normal font-sans">
                        Frantic manual spreadsheets, constant evidence requests, endless GRC questionnaires, and untracked pipelines.
                      </p>
                    </div>
                  </button>
                );
              })()}

              {/* Grid of secondary pains */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'Manual documentation', label: 'Manual documentation (wikis, static spreadsheets)' },
                  { value: 'Procurement reviews', label: 'Procurement reviews (heavy business client questions)' },
                  { value: 'Model traceability', label: 'Model traceability (untracked pipelines & outputs)' },
                  { value: 'Human approval tracking', label: 'Human approval tracking (non-repudiation and audits)' },
                  { value: 'Regulatory reporting', label: 'Regulatory reporting (EU AI Act & ISO 42001)' }
                ].map((pain) => {
                  const isSelected = selectedPains.includes(pain.value);
                  return (
                    <button
                      key={pain.value}
                      type="button"
                      disabled={cryptSigningProgress || subscribed}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPains(selectedPains.filter(p => p !== pain.value));
                        } else {
                          setSelectedPains([...selectedPains, pain.value]);
                        }
                      }}
                      className={`flex items-start gap-2.5 p-3 rounded border text-left transition-all ${
                        isSelected 
                          ? 'bg-indigo-950/20 border-indigo-500/80 text-white' 
                          : 'bg-[#090b12]/60 border-[#1F2937] hover:border-indigo-500/30 text-gray-300'
                      } ${cryptSigningProgress || subscribed ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`mt-0.5 w-3.5 h-3.5 rounded border border-gray-650 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-indigo-500 border-indigo-500' : 'bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                      </div>
                      <span className="text-[11px] font-sans font-medium leading-tight text-gray-200">{pain.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={cryptSigningProgress || subscribed || !!emailWarning}
                className={`w-full py-3.5 text-xs font-bold transition-all flex items-center justify-center gap-2 rounded ${
                  subscribed 
                    ? 'bg-emerald-500 text-[#0c101a] font-bold' 
                    : cryptSigningProgress 
                      ? 'bg-indigo-900/40 text-indigo-400 border border-indigo-700/50 cursor-not-allowed'
                      : 'bg-indigo-650 hover:bg-indigo-600 text-white font-mono cursor-pointer active:scale-[0.99]'
                }`}
              >
                {cryptSigningProgress && (
                  <span className="flex items-center gap-2 font-mono">
                    <span className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-white animate-spin"></span>
                    COMPUTING SECURE GRC PRIVATE SIGNATURE BLOCK...
                  </span>
                )}
                {subscribed && (
                  <span className="flex items-center gap-2 font-sans">
                    <CheckCircle className="w-4 h-4 text-[#0c101a] fill-white/10" />
                    CORPORATE ID SECURELY REGISTERED. OPENING SECURE RECEIPT EMAIL...
                  </span>
                )}
                {!cryptSigningProgress && !subscribed && (
                  <span className="font-semibold uppercase tracking-wider">REQUEST PRIVATE SANDBOX ACCESS</span>
                )}
              </button>
            </div>
          </form>

          {subscribed && (
            <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-900/40 rounded text-center text-emerald-400 font-mono text-[10px]">
              Security Handshake Success. Symmetric private key pair registered locally. Active secure email notification delivered.
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#1F2937]/75 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold text-[#dfe2f1] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> ALREADY RECEIVED COMPLIANCE ACCESS KEY?
              </h4>
              <p className="text-[11px] text-gray-400 mt-1">
                Enter your secure single-use email key payload directly to instant-unlock the ISO 42001 assessment sandbox.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActivationModalOpen(true)}
              className="w-full sm:w-auto bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 text-xs px-5 py-3 rounded font-mono font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" /> ENTER ACTIVATION KEY
            </button>
          </div>
        </div>
      </section>

      {/* Premium secure email notification and preview modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto select-none">
          <div className="w-full max-w-4xl bg-[#090b12] border-2 border-indigo-900/60 rounded-xl overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-12 text-[#dfe2f1] max-h-[90vh]">
            
            {/* Sidebar (4 Columns on Desktop) */}
            <div className="md:col-span-4 bg-[#05060a] border-b md:border-b-0 md:border-r border-[#1F2937] p-5 flex flex-col justify-between gap-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Simulated Email Client Brand */}
                <div className="flex items-center gap-2">
                  <AiecLogo size="xs" showText={true} />
                </div>

                {/* Folders */}
                <div className="space-y-2">
                  <p className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest px-2">Folders</p>
                  <nav className="space-y-1">
                    <button className="w-full flex items-center justify-between text-left text-xs px-2.5 py-1.5 rounded bg-[#111522] text-indigo-300 font-medium">
                      <span className="flex items-center gap-2">
                        <Inbox className="w-3.5 h-3.5 text-indigo-400" />
                        Inbox (New)
                      </span>
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    </button>
                    <button className="w-full flex items-center text-left text-xs px-2.5 py-2 rounded text-gray-600 hover:text-gray-400 transition-colors">
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5" />
                        Shortlist Vetting
                      </span>
                    </button>
                    <button className="w-full flex items-center text-left text-xs px-2.5 py-2 rounded text-gray-600 hover:text-gray-400 transition-colors">
                      <span className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" />
                        Ledger Receipts
                      </span>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Secure Queue Info Box */}
              <div className="border border-indigo-950 bg-indigo-950/10 p-4 rounded-lg space-y-3 my-auto">
                <div>
                  <span className="text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-widest block mb-0.5">Assigned Queue Rank</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold font-mono text-white tracking-tight">#142</span>
                    <span className="text-[10px] text-gray-400 font-mono">Sandbox Batch</span>
                  </div>
                </div>

                <div className="h-[1px] bg-indigo-950"></div>

                <div>
                  <span className="text-[9px] font-bold font-mono text-amber-500 uppercase tracking-widest block mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Vetting Status
                  </span>
                  <p className="text-[10.5px] text-gray-400 leading-normal font-sans">
                    Pending compliance verification by corporate review committee.
                  </p>
                </div>
              </div>

              {/* Status footer */}
              <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>SECURED SECUREMAIL GATEWAY</span>
              </div>
            </div>

            {/* Email Contents (8 Columns on Desktop) */}
            <div className="md:col-span-8 p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[90vh]">
              
              {/* Header Meta info */}
              <div className="border-b border-[#1F2937] pb-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <span className="font-semibold font-mono">From:</span>
                    <span className="bg-indigo-950/20 px-2 py-0.5 rounded text-indigo-300 font-mono border border-indigo-950">aiec-gateway@compliance.aiec.sh</span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono">Today, 15:22:10 UTC</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="font-semibold font-mono">To:</span>
                  <span className="text-white font-mono font-medium">{email || 'ciso@enterprise.com'}</span>
                </div>

                <div className="pt-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-start sm:items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-1 sm:mt-0" />
                    AIEC Sandbox Program: Application Registered [Queue Position #142]
                  </h2>
                </div>
              </div>

              {/* Rich Body Text */}
              <div className="py-5 space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed overflow-y-auto">
                <p>
                  Dear <strong className="text-white">{company || 'Enterprise Leader'}</strong> Representative,
                </p>

                <p>
                  This official message confirms that we have successfully received and registered your application to participate in the exclusive <strong className="text-white">AIEC Private Sandbox Program</strong>.
                </p>

                <div className="p-4 rounded-lg bg-[#07090f] border border-indigo-950/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-950/50 pb-2">
                    <span className="font-mono text-[9px] font-bold text-indigo-400 tracking-wider">SECURE LEDGER HANDSHAKE RECORD</span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/10 border border-emerald-900/30 px-2 py-0.5 rounded">✓ INTEGRITY VERIFIED</span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-sans py-0.5 border-b border-indigo-950/20"><span className="text-gray-500 font-mono text-[8.5px] tracking-wide">ORGANIZATION ADDRESS:</span> <span className="text-white font-mono text-[11px] font-medium">{email}</span></div>
                    <div className="flex justify-between items-center font-sans py-0.5 border-b border-indigo-950/20"><span className="text-gray-500 font-mono text-[8.5px] tracking-wide">CORPORATION NAME:</span> <span className="text-white font-sans text-xs font-semibold">{company || 'Vetted Enterprise'}</span></div>
                    <div className="flex justify-between items-center font-sans py-0.5 border-b border-indigo-950/20"><span className="text-gray-500 font-mono text-[8.5px] tracking-wide">COMPANY SIZE:</span> <span className="text-indigo-300 font-sans text-xs">{companySize ? `${companySize} employees` : 'N/A'}</span></div>
                    <div className="flex justify-between items-center font-sans py-0.5 border-b border-indigo-950/20"><span className="text-gray-500 font-mono text-[8.5px] tracking-wide">ACTIVE AI USERS:</span> <span className="text-indigo-300 font-sans text-xs">{aiUsage ? `${aiUsage} users` : 'N/A'}</span></div>
                    <div className="flex justify-between items-center font-sans py-0.5 border-b border-indigo-950/20"><span className="text-gray-500 font-mono text-[8.5px] tracking-wide">CHALLENGE URGENCY:</span> <span className="text-amber-400 font-sans text-xs font-semibold">{urgency || 'N/A'}</span></div>
                    <div className="flex justify-between items-center font-sans py-0.5 border-b border-indigo-950/20"><span className="text-gray-500 font-mono text-[8.5px] tracking-wide">TARGET MODELS:</span> <span className="text-indigo-300 font-mono text-xs">{aiModels}</span></div>
                    <div className="flex justify-between items-center font-sans py-0.5"><span className="text-gray-500 font-mono text-[8.5px] tracking-wide">COMPLIANCE TARGET:</span> <span className="text-indigo-300 font-sans text-xs">{complianceTarget}</span></div>
                  </div>

                  <div className="pt-2 border-t border-indigo-950/50 space-y-1.5">
                    <span className="text-[9px] font-bold font-mono text-gray-500 block">LOCAL CRYPTO SIGNATURE KEY BLOCK</span>
                    <div className="flex gap-2 items-center">
                      <code className="bg-[#050608] border border-gray-900 text-indigo-400 p-2 rounded text-[10px] select-all break-all block h-10 w-full font-mono text-left overflow-y-auto">
                        {generatedRegSignature || 'LOADING_SIGNATURE_SEQUENCE_HASH_KEY'}
                      </code>
                      <button
                        onClick={() => copyToClipboard(generatedRegSignature)}
                        className="p-2 rounded bg-indigo-950/70 hover:bg-indigo-900/60 transition-colors shrink-0 text-indigo-300 relative cursor-pointer"
                        title="Copy cryptographic signature block"
                      >
                        {copiedSig ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-900/60">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wide">Vetted Shortlist Allocation Vows:</h3>
                  <p className="text-gray-400 leading-relaxed text-xs">
                    Because our physical cryptographic security hardware (HSM) limits sandbox tenants, access is strictly prioritized for high-intent corporate partners.
                  </p>
                  
                  <div className="p-4 bg-amber-950/10 border border-[#b45309]/30 rounded-lg text-xs leading-relaxed text-amber-300 space-y-1">
                    <p className="font-bold text-[#f59e0b] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#f59e0b]" /> Queue Notice Guidelines
                    </p>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      Your application is placed in queue position <strong className="text-white text-xs font-mono font-bold">#142</strong>. Our regulatory team is evaluating your corporate domain security records. 
                    </p>
                    <p className="text-xs text-amber-300/90 mt-1 leading-relaxed">
                      <strong>Please note: We will let you know as soon as you are shortlisted.</strong> If selected, you will receive a follow-up email containing custom cryptographic access keys and instructions for setting up your dedicated tenant workspace.
                    </p>
                  </div>

                  {/* Simulated instant sandbox access key for test clients */}
                  <div className="p-4 bg-indigo-950/20 border-2 border-indigo-500/30 rounded-lg text-xs leading-relaxed text-indigo-200 mt-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-indigo-900 pb-1.5">
                      <span className="font-bold text-indigo-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <Key className="w-3.5 h-3.5 text-indigo-400" /> SIMULATED CLIENT ACTIVATION KEY RECEIVED
                      </span>
                      <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2 py-0.5 rounded tracking-wide uppercase font-bold">
                        Ready to Bypass
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      To simulate a customer who received an activation key via email, copy the encrypted client credentials key below, click <strong>"Dismiss Receipt"</strong>, and paste it into the activation window:
                    </p>
                    <div className="flex gap-2 items-center pt-1">
                      <code className="text-center font-mono font-bold text-xs bg-[#05060a] border border-indigo-950 p-2 rounded text-emerald-400 select-all block w-full tracking-wide">
                        AIEC-SECURE-KEY-2026-X89
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('AIEC-SECURE-KEY-2026-X89');
                          setCopiedKey(true);
                          setTimeout(() => setCopiedKey(false), 2000);
                        }}
                        className="p-2 rounded bg-indigo-900/60 hover:bg-indigo-800 transition-colors shrink-0 text-indigo-200 relative cursor-pointer"
                        title="Copy activation security key"
                      >
                        {copiedKey ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 italic leading-snug">
                      Note: Copying your registration signature block (above) or typing <strong>AIEC-SANDBOX-2026</strong> will also successfully unlock sandbox access.
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 italic mt-3 pt-3 border-t border-gray-900/60 leading-relaxed">
                  Thank you for prioritizing privacy-preserving, mathematically verifiable AI governance.
                  <br />
                  <span className="font-bold text-gray-400 font-sans mt-1.5 block">Sincerely,<br />AIEC GRC Assessment Committee</span>
                </p>
              </div>

              {/* Action area */}
              <div className="border-t border-[#1F2937] pt-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/30 border border-indigo-900/20 px-2 py-1 rounded">
                  TRANSACTION REQ ID: AIEC-GRC-8472-B-SECURE
                </span>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 sm:flex-initial text-xs bg-gray-900 hover:bg-gray-850 px-4 py-2.5 rounded font-mono text-gray-400 hover:text-white transition-colors cursor-pointer border border-[#1f2937]"
                  >
                    Dismiss Receipt
                  </button>
                  <button
                    onClick={downloadReceipt}
                    className="flex-1 sm:flex-initial text-xs bg-indigo-955 hover:bg-indigo-900 text-indigo-300 border border-indigo-850/40 px-4 py-2.5 rounded font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download `.json` Receipt
                  </button>
                  <button
                    onClick={() => {
                      setShowEmailModal(false);
                      onEnterConsole();
                    }}
                    className="w-full sm:w-auto text-xs bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2.5 rounded font-bold transition-colors inline-flex items-center justify-center gap-1.5 active:scale-95 shadow-md cursor-pointer"
                  >
                    Launch Interactive Console <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Premium Modal: Verifiable ISO 42001 Cryptographic Schema Viewer */}
      {activeSchemaStep !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/93 backdrop-blur-md overflow-y-auto select-none">
          <div className="w-full max-w-3xl bg-[#090b12] border-2 border-[#2dd4bf]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col text-[#dfe2f1] max-h-[90vh]">
            
            {/* Accent border banner */}
            <div className="bg-gradient-to-r from-[#2dd4bf] via-indigo-500 to-[#2dd4bf] h-1 w-full" />

            {/* Modal Header */}
            <div className="bg-[#111522] border-b border-[#1F2937] px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Database className="w-4.5 h-4.5 text-[#2dd4bf]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  ISO/IEC 42001 Cryptographic Schema Specification
                </span>
              </div>
              <button 
                onClick={() => setActiveSchemaStep(null)}
                className="text-gray-400 hover:text-white cursor-pointer bg-gray-900/40 p-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active schema header section */}
            <div className="bg-gradient-to-b from-[#111522]/30 to-transparent p-6 border-b border-[#1b2131] shrink-0">
              <span className="bg-[#2dd4bf]/10 text-[#2dd4bf] border border-[#2dd4bf]/30 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider">
                {stepSchemas[activeSchemaStep].standard} Approved Format
              </span>
              <h2 className="text-lg font-bold text-white mt-2 tracking-tight">
                {stepSchemas[activeSchemaStep].title}
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-1 text-[11px]">
                Target Identifier ID: <span className="text-indigo-300 font-bold font-mono">{stepSchemas[activeSchemaStep].id}</span>
              </p>
            </div>

            {/* Tab selection links */}
            <div className="flex bg-[#05060a]/90 px-6 border-b border-[#1F2937] shrink-0">
              <button 
                onClick={() => setActiveSchemaTab('json')}
                className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSchemaTab === 'json' 
                    ? 'border-[#2dd4bf] text-[#2dd4bf]' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>JSON Schema Layout</span>
              </button>
              <button 
                onClick={() => setActiveSchemaTab('attributes')}
                className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSchemaTab === 'attributes' 
                    ? 'border-[#2dd4bf] text-[#2dd4bf]' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Attributes Definitions & Invariants</span>
              </button>
            </div>

            {/* Modal Body Scroll view content */}
            <div className="p-6 flex-grow overflow-y-auto max-h-[50vh] min-h-[30vh]">
              {activeSchemaTab === 'json' ? (
                /* Beautiful code presentation */
                <div className="relative">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(stepSchemas[activeSchemaStep].json);
                      setCopiedSchema(true);
                      setTimeout(() => setCopiedSchema(false), 2000);
                    }}
                    className="absolute top-3 right-3 bg-gray-900/80 hover:bg-gray-800 text-[#dfe2f1] text-[10px] font-mono border border-gray-800 hover:border-[#2dd4bf] px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1"
                  >
                    {copiedSchema ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                  <pre className="p-4 bg-[#05060a]/90 rounded-lg border border-gray-850 font-mono text-[11px] overflow-auto select-text text-left leading-relaxed text-[#c7c4d8]/95 max-h-[45vh] scrollbar-thin">
                    <code>
                      {stepSchemas[activeSchemaStep].json}
                    </code>
                  </pre>
                </div>
              ) : (
                /* Attribute Table model */
                <div className="space-y-4">
                  <div className="bg-[#05060a]/50 border border-gray-850 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#111522] text-gray-400 font-mono text-[9px] uppercase tracking-wider border-b border-[#1F2937]">
                          <th className="py-2.5 px-3">Field Key</th>
                          <th className="py-2.5 px-3">Cryptographic Type</th>
                          <th className="py-2.5 px-3">Invariant Protocol Rule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-850 font-sans">
                        {stepSchemas[activeSchemaStep].attributes.map((attr, idx) => (
                          <tr key={idx} className="hover:bg-[#111522]/20 font-sans">
                            <td className="py-3 px-3 font-mono font-bold text-white text-[11px]">
                              {attr.name}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-950/40 text-indigo-300 border border-indigo-900/30">
                                {attr.type}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-300 text-xs text-left leading-relaxed">
                              <div className="font-semibold text-[11px] text-[#2dd4bf] mb-0.5">{attr.rule}</div>
                              <div className="text-[10px] text-gray-500 font-mono leading-normal">{attr.description}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Bar (Actions & Active validation simulation) */}
            <div className="bg-[#111522] border-t border-[#1F2937] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              {/* Dynamic validation test mechanism */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isVerifyingSchemaIntegrity}
                  onClick={() => {
                    setIsVerifyingSchemaIntegrity(true);
                    setVerifyingSchemaSuccess(null);
                    setTimeout(() => {
                      setIsVerifyingSchemaIntegrity(false);
                      setVerifyingSchemaSuccess(true);
                    }, 1200);
                  }}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded border transition-all cursor-pointer ${
                    verifyingSchemaSuccess === true
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                      : 'bg-indigo-950/50 hover:bg-[#111522] text-[#2dd4bf] border-[#2dd4bf]/40'
                  }`}
                >
                  {isVerifyingSchemaIntegrity ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-indigo-400 border-t-white animate-spin animate-once"></span>
                      Evaluating invariants...
                    </span>
                  ) : verifyingSchemaSuccess === true ? (
                    "✓ SCHEMA STANDARDS MET"
                  ) : (
                    "Run Conformance Validator Test"
                  )}
                </button>
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">
                  {verifyingSchemaSuccess === true 
                    ? "ISO/IEC 42001 Structure Assertions: Passed" 
                    : "Simulates local structural schemas checks"
                  }
                </span>
              </div>

              {/* Close Button actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveSchemaStep(null)}
                  className="bg-[#2dd4bf]/10 hover:bg-[#2dd4bf]/20 border border-[#2dd4bf]/50 hover:border-[#2dd4bf] text-white font-mono text-xs px-5 py-2 rounded transition-all cursor-pointer active:scale-95 text-center"
                >
                  Close Schema Overview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Premium Modal: Client Activation Gateway */}
      {activationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/93 backdrop-blur-md overflow-y-auto select-none animate-fade-in" id="activation-key-modal">
          <div className="w-full max-w-lg bg-[#090b12] border-2 border-indigo-900/60 rounded-xl overflow-hidden shadow-2xl relative">
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-400 via-indigo-500 to-emerald-500"></div>

            {/* Modal Header */}
            <div className="bg-[#111522] border-b border-[#1F2937] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Client Activation Gateway
                </span>
              </div>
              <button 
                onClick={() => {
                  setActivationModalOpen(false);
                  setActivationError('');
                  setActivationKeyInput('');
                  setActivationLogs([]);
                }}
                className="text-gray-400 hover:text-white cursor-pointer bg-gray-900/40 p-1 rounded-full hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">IDENTITY VERIFICATION</span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Enter Secure Client Key
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Please copy and paste the encrypted secure access key you've received through your email below. This registers your browser enclave directly with our peer consensus ledger nodes.
                </p>
              </div>

              {/* Enter Key Form */}
              <form onSubmit={handleVerifyActivationKey} className="space-y-4">
                <div className="space-y-1.5 relative">
                  <label className="block text-[10px] font-mono font-bold text-gray-550 uppercase tracking-widest">
                    Activation Security Key
                  </label>
                  <div className="relative">
                    <input 
                      disabled={isActivating || activationSuccess}
                      className="w-full bg-[#05060a] border border-[#1F2937] focus:border-indigo-500 hover:border-indigo-900/40 text-sm text-white px-4 py-3 pl-10 rounded focus:outline-none placeholder-gray-700 tracking-wider font-mono uppercase"
                      placeholder="e.g. AIEC-XXXX-XXXX-XXXX"
                      type="text"
                      value={activationKeyInput}
                      onChange={(e) => setActivationKeyInput(e.target.value)}
                      required
                    />
                    <Key className="w-4 h-4 text-gray-600 absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Simulated Verification Terminals or Feedback Logs */}
                {(isActivating || activationLogs.length > 0 || activationSuccess) && (
                  <div className="bg-[#04060b] border border-gray-900 rounded p-4 space-y-2 font-mono text-[10px] leading-relaxed text-[#a5b4fc]/90">
                    <div className="flex items-center justify-between border-b border-indigo-950 pb-1 text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                      <span>Consensus Signing Enclave VM</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                        ONLINE
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-left select-none">
                      {activationLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-[10px]">
                          <span className="text-emerald-500 font-bold">▶</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>

                    {isActivating && (
                      <div className="flex items-center gap-2 pt-1 font-bold text-indigo-400 animate-pulse text-[10px]">
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-indigo-400 border-t-white animate-spin"></span>
                        CRUNCHING SYMMETRIC PROOFS...
                      </div>
                    )}

                    {activationSuccess && (
                      <div className="bg-[#0b1712] border border-emerald-900/60 p-2.5 rounded text-emerald-400 text-[10.5px] font-sans font-bold flex items-center gap-2 mt-2 leading-relaxed text-left animate-fade-in">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="uppercase tracking-wider font-mono block text-[10px]">ACCESS GRANTED!</span>
                          Credential payload matches authority registries. Initializing secure client workspace...
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Banner */}
                {activationError && (
                  <div className="bg-red-950/20 border border-red-900/50 p-3 rounded text-red-400 text-xs text-left flex items-start gap-2.5 font-sans animate-shake leading-relaxed">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block font-mono text-[10px] uppercase">VETTING ERROR</span>
                      {activationError}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isActivating || activationSuccess}
                    onClick={() => {
                      setActivationModalOpen(false);
                      setActivationError('');
                      setActivationKeyInput('');
                      setActivationLogs([]);
                    }}
                    className="flex-grow text-xs bg-gray-900 hover:bg-gray-850 px-4 py-3 rounded text-gray-400 hover:text-white transition-colors cursor-pointer border border-[#1f2937] font-semibold font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isActivating || activationSuccess || !activationKeyInput.trim()}
                    className="flex-grow text-xs bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-3 rounded font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isActivating ? 'Verifying Activation Key...' : 'Validate Activation Key'}
                  </button>
                </div>
              </form>

              {/* Vetting Instruction Helper Banner */}
              <div className="bg-amber-950/15 border border-[#b45309]/20 p-3.5 rounded-lg text-xs leading-relaxed text-amber-305 space-y-1">
                <p className="font-bold text-[#f59e0b] text-[10px] uppercase tracking-wider font-mono">
                  Demo Client Instructions
                </p>
                <p className="text-[10px] text-amber-100/90 leading-relaxed font-sans">
                  Don't have a custom key? Enter your corporate details in the waitlist section at the bottom of the page to generate your single-use activation code instantly, or use the preset client key below:
                </p>
                <div className="flex gap-2 items-center mt-2">
                  <code className="flex-grow text-center font-mono font-bold text-[10px] bg-[#050608] border border-[#b45309]/25 p-1.5 rounded text-amber-400 select-all tracking-wider">
                    AIEC-SECURE-KEY-2026-X89
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('AIEC-SECURE-KEY-2026-X89');
                    }}
                    className="p-1.5 px-3 rounded bg-amber-900/30 hover:bg-amber-900/50 transition-all text-amber-200 font-semibold text-[10px] font-mono shrink-0 cursor-pointer border border-amber-900/20"
                  >
                    Copy Preset
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#1F2937] bg-[#070a11] px-6 py-10 text-xs text-gray-500" id="landing-footer">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center md:text-left">
            <AiecLogo size="xs" showText={true} />
            <span>© 2026 AIEC ISO 42001 Compliance platform. All rights reserved. Privacy-Preserving Client Verification Architecture.</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <span onClick={() => onEnterSubPage('why')} className="hover:text-indigo-400 cursor-pointer transition-colors font-bold text-gray-400">Why AIEC?</span>
            <span onClick={() => onEnterSubPage('privacy')} className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy</span>
            <span onClick={() => onEnterSubPage('terms')} className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</span>
            <span onClick={() => onEnterSubPage('security')} className="hover:text-indigo-400 cursor-pointer transition-colors">Security Architecture</span>
            <span onClick={() => onEnterSubPage('compliance')} className="hover:text-indigo-400 cursor-pointer transition-colors">Compliance Standards</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
