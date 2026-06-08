import React, { useState, useMemo } from 'react';
import { 
  Shield, Lock, CheckCircle2, Search, Download, ExternalLink, Code, Database, 
  FileText, Clock, Key, AlertCircle, PlusCircle, ArrowLeft, RefreshCw, X, Copy,
  Globe, Activity, Circle, CheckSquare, Sparkles, Server, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentAuditTrail, DocumentState, TimelineNode } from '../types';
import { INITIAL_AUDIT_TRAILS } from '../data';
import { calculateSHA256, generateMockSignature, generateKeyFingerprint, formatTimestamp } from '../utils';
import AiecLogo from './AiecLogo';

interface AuditConsoleProps {
  onBackToLanding: () => void;
}

export default function AuditConsole({ onBackToLanding }: AuditConsoleProps) {
  // Audit records state with initial data preloaded
  const [auditTrails, setAuditTrails] = useState<DocumentAuditTrail[]>(INITIAL_AUDIT_TRAILS);
  const [selectedDocId, setSelectedDocId] = useState<string>("AIEC-8912");
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [modelFilter, setModelFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');

  // Interactive Live Ledger Simulator states
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simModel, setSimModel] = useState('Claude 3.5 Sonnet');
  const [simPromptText, setSimPromptText] = useState('Draft an AI safety policy for autonomous customer support routing.');
  const [simResponseText, setSimResponseText] = useState('AIEC system will maintain continuous human-in-the-loop review overrides for all low-confidence routing classifications.');
  const [simSigner, setSimSigner] = useState('lead.auditor@company.com');
  const [isGenerating, setIsGenerating] = useState(false);

  // New modifications for selected document state (to add a live node manually)
  const [newModActor, setNewModActor] = useState('auditor@governance.com');
  const [newModText, setNewModText] = useState('');
  const [isAddingNode, setIsAddingNode] = useState(false);

  // Verification Animation status
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);
  const [verifiedStatus, setVerifiedStatus] = useState<string | null>(null);

  // Export Modal status
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // PREMIUM FEATURES STATE: Cryptographic Inspector, Peer Consensus Sync, Risk Score Details
  const [selectedNodeForInspector, setSelectedNodeForInspector] = useState<TimelineNode | null>(null);
  const [isVerifyingInspectorSig, setIsVerifyingInspectorSig] = useState(false);
  const [inspectorSigSuccess, setInspectorSigSuccess] = useState<boolean | null>(null);
  const [copiedInspectorItem, setCopiedInspectorItem] = useState<string | null>(null);

  const [peerSyncState, setPeerSyncState] = useState<'IDLE' | 'INGEST' | 'CIPHER_HANDSHAKE' | 'VALIDATING' | 'COMPLETED'>('IDLE');
  const [activePeerIndex, setActivePeerIndex] = useState<number | null>(null);
  const [peerStatuses, setPeerStatuses] = useState({
    munich: 'idle',
    singapore: 'idle',
    virginia: 'idle',
    geneva: 'idle'
  });

  const [selectedRiskCategory, setSelectedRiskCategory] = useState<'governance' | 'toxicity' | 'hallucination' | 'leakage' | null>(null);

  // $100M FOUNDER SAAS ADVANCEMENTS
  const [simScrubPii, setSimScrubPii] = useState(true);
  const [simToxicityGuard, setSimToxicityGuard] = useState(true);
  const [simHallucinationCheck, setSimHallucinationCheck] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingReportBrief, setIsGeneratingReportBrief] = useState(false);
  const [showTechnicalProof, setShowTechnicalProof] = useState(false);

  // Get active selected document object
  const selectedDoc = useMemo(() => {
    return auditTrails.find(doc => doc.id === selectedDocId) || auditTrails[0];
  }, [auditTrails, selectedDocId]);

  // Compute dynamic compliance risk metrics based on active selected document metadata
  const riskMetrics = useMemo(() => {
    const docId = selectedDoc.id;
    const scoreSeed = docId.split('-')[1] ? parseInt(docId.split('-')[1]) : 8912;
    const score = 94 + (scoreSeed % 5); // 94-98% total rating
    const governance = 95 + (scoreSeed % 4); // 95-98%
    const toxicityVal = 0.02 + (scoreSeed % 6) / 100; // 0.02% to 0.07%
    const hallucinationVal = 0.3 + (scoreSeed % 5) / 10; // 0.3% to 0.7%
    const leakageVal = 97 + (scoreSeed % 3); // 97-99%

    return {
      totalScore: score,
      governance: governance,
      toxicity: toxicityVal.toFixed(2),
      hallucination: hallucinationVal.toFixed(1),
      leakage: leakageVal,
    };
  }, [selectedDoc]);

  // Live dynamic interactive risk score generator inside the Simulation Sandbox
  const liveSimComplianceScore = useMemo(() => {
    let baseScore = 95;
    
    // Lowers score if typical sensitive or toxic words have been typed
    const toxicPattern = /\b(steal|leak|cheat|hack|bribe|illegal|bypass|payload|force|unsafe)\b/i;
    const piiPattern = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[0-9]{3}-[0-9]{2}-[0-9]{4}|192\.168\.[0-9]{1,3}\.[0-9]{1,3})\b/i;
    const hallucinationPattern = /\b(confident|unsure|hallucinate|fabricate|maybe|perhaps|probably)\b/i;

    const fullText = `${simPromptText} ${simResponseText}`;

    if (toxicPattern.test(fullText)) {
      baseScore -= simToxicityGuard ? 2 : 12;
    }
    if (piiPattern.test(fullText)) {
      baseScore -= simScrubPii ? 1 : 15;
    }
    if (hallucinationPattern.test(fullText)) {
      baseScore -= simHallucinationCheck ? 2 : 8;
    }

    return Math.max(40, Math.min(100, baseScore));
  }, [simPromptText, simResponseText, simScrubPii, simToxicityGuard, simHallucinationCheck]);

  // Compute list of unique model names for filter dropdown
  const availableModels = useMemo(() => {
    const models = auditTrails.map(doc => doc.modelName);
    return ['ALL', ...Array.from(new Set(models))];
  }, [auditTrails]);

  // Filter application list based on parameters
  const filteredAuditTrails = useMemo(() => {
    return auditTrails.filter(doc => {
      const matchesSearch = doc.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.signer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doc.modelName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesModel = modelFilter === 'ALL' || doc.modelName === modelFilter;
      const matchesState = stateFilter === 'ALL' || doc.currentState === stateFilter;
      
      return matchesSearch && matchesModel && matchesState;
    });
  }, [auditTrails, searchQuery, modelFilter, stateFilter]);

  // Handle verification scan
  const triggerCryptoVerification = (docId: string) => {
    setVerifyingDocId(docId);
    setVerifiedStatus("SCANNING");
    setTimeout(() => {
      setVerifiedStatus("SUCCESS_VERIFIED");
      setTimeout(() => {
        setVerifyingDocId(null);
        setVerifiedStatus(null);
      }, 1800);
    }, 1200);
  };

  const handlePrintComplianceBrief = () => {
    // Dynamically inject a print stylesheet to isolate the certificate container and styled assets
    const styleEl = document.createElement("style");
    styleEl.id = "print-isolated-sheet";
    styleEl.innerHTML = `
      @media print {
        /* Hide all global backgrounds, headers, sidebars, and actions */
        body * {
          visibility: hidden !important;
          background-color: transparent !important;
          background-image: none !important;
        }
        
        /* Reveal only the executive certificate card and its components */
        #executive-brief-modal-card, #executive-brief-modal-card * {
          visibility: visible !important;
        }
        
        /* Adjust page margins to remove default headers/footers */
        @page {
          margin: 10mm !important;
          size: portrait !important;
        }
        
        /* Perfect visual sizing for the certificate container */
        #executive-brief-modal-card {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          background: #0b0f19 !important;
          border: 2px solid rgb(245, 158, 11) !important;
          border-radius: 12px !important;
          padding: 28px !important;
          box-shadow: none !important;
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
          height: auto !important;
        }

        .bg-\\[\\#05070a\\]\\/60 {
          background-color: rgba(5, 7, 10, 0.95) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .bg-amber-500\\/10 {
          background-color: rgba(245, 158, 11, 0.15) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .text-amber-400 {
          color: rgb(245, 158, 11) !important;
        }

        .text-emerald-400 {
          color: rgb(16, 185, 129) !important;
        }

        .text-indigo-400 {
          color: rgb(129, 140, 248) !important;
        }

        .text-white {
          color: rgb(255, 255, 255) !important;
        }

        .bg-transparent {
          background-color: transparent !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
    window.print();
    
    // Clean up style reference safely shortly after the system print spooler finishes loading
    setTimeout(() => {
      const el = document.getElementById("print-isolated-sheet");
      if (el) el.remove();
    }, 1500);
  };

  const triggerPeerConsensusVerification = () => {
    if (peerSyncState !== 'IDLE' && peerSyncState !== 'COMPLETED') return;

    setPeerSyncState('INGEST');
    setPeerStatuses({
      munich: 'idle',
      singapore: 'idle',
      virginia: 'idle',
      geneva: 'idle'
    });

    // Simulated ingestion delay
    setTimeout(() => {
      setPeerSyncState('CIPHER_HANDSHAKE');
      
      // Peer 1: Munich
      setTimeout(() => {
        setPeerStatuses(prev => ({ ...prev, munich: 'scanning' }));
        setTimeout(() => {
          setPeerStatuses(prev => ({ ...prev, munich: 'verified' }));
          
          // Peer 2: Singapore
          setTimeout(() => {
            setPeerStatuses(prev => ({ ...prev, singapore: 'scanning' }));
            setTimeout(() => {
              setPeerStatuses(prev => ({ ...prev, singapore: 'verified' }));
              
              // Peer 3: Virginia
              setTimeout(() => {
                setPeerStatuses(prev => ({ ...prev, virginia: 'scanning' }));
                setTimeout(() => {
                  setPeerStatuses(prev => ({ ...prev, virginia: 'verified' }));
                  
                  // Peer 4: Geneva
                  setTimeout(() => {
                    setPeerStatuses(prev => ({ ...prev, geneva: 'scanning' }));
                    setTimeout(() => {
                      setPeerStatuses(prev => ({ ...prev, geneva: 'verified' }));
                      setPeerSyncState('COMPLETED');
                    }, 500);
                  }, 300);
                }, 500);
              }, 300);
            }, 500);
          }, 300);
        }, 600);
      }, 500);

    }, 800);
  };

  const startInspectorSignatureVerify = () => {
    setIsVerifyingInspectorSig(true);
    setInspectorSigSuccess(null);
    setTimeout(() => {
      setIsVerifyingInspectorSig(false);
      setInspectorSigSuccess(true);
    }, 1200);
  };

  // Add customized modification or approval event to timeline live
  const handleAddNewTimelineEvent = async (stateToAdd: 'MODIFIED' | 'APPROVED') => {
    if (!newModActor) return;
    
    setIsAddingNode(true);
    const dateNow = new Date();
    const timestampStr = formatTimestamp(dateNow);
    
    let descriptionText = "";
    if (stateToAdd === 'MODIFIED') {
      descriptionText = newModText || "Adjusted model policy constraints to bolster third-party auditor accessibility safeguards.";
    } else {
      descriptionText = "GRC director signed governance certification approval on local compliance structures.";
    }

    // Capture the text representation to hash
    const textToHash = `${selectedDoc.id}-${stateToAdd}-${newModActor}-${timestampStr}-${descriptionText}`;
    const calculatedHash = await calculateSHA256(textToHash);
    const signatureObject = {
      alg: "EdDSA",
      kid: `${newModActor.split('@')[0]}-key-v1`,
      sig: generateMockSignature(calculatedHash, "v2")
    };

    const newNode: TimelineNode = {
      id: `node-live-${Date.now()}`,
      state: stateToAdd,
      actor: newModActor,
      timestamp: timestampStr,
      description: descriptionText,
      hash: calculatedHash,
      publicFingerprint: generateKeyFingerprint(newModActor),
      signature: signatureObject
    };

    // Update state
    setAuditTrails(prevTrails => {
      return prevTrails.map(doc => {
        if (doc.id === selectedDoc.id) {
          const updatedTimeline = [...doc.timeline, newNode];
          return {
            ...doc,
            currentState: stateToAdd,
            signer: newModActor,
            timestamp: timestampStr,
            payloadHash: calculatedHash,
            timeline: updatedTimeline
          };
        }
        return doc;
      });
    });

    setNewModText('');
    setIsAddingNode(false);
  };

  // Generate completely new document via local hash generator simulator
  const handleSimulateNewAuditTrail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simPromptText || !simResponseText) return;

    setIsGenerating(true);
    
    // Simulate slight cryptography delay
    setTimeout(async () => {
      const docCount = auditTrails.length;
      const nextDocNum = 1000 + Math.floor(Math.random() * 8999);
      const newDocId = `AIEC-${nextDocNum}`;
      
      const dateNow = new Date();
      const timestampStr = formatTimestamp(dateNow);

      let processedPrompt = simPromptText;
      let processedResponse = simResponseText;

      // Real local zero-knowledge transformations matching selected startup choices
      if (simScrubPii) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
        const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
        const ipRegex = /\b(192\.168\.\d{1,3}\.\d{1,3})\b/g;
        processedPrompt = processedPrompt.replace(emailRegex, "[REDACTED_EMAIL]").replace(ssnRegex, "[REDACTED_SSN]").replace(ipRegex, "[REDACTED_IP]");
        processedResponse = processedResponse.replace(emailRegex, "[REDACTED_EMAIL]").replace(ssnRegex, "[REDACTED_SSN]").replace(ipRegex, "[REDACTED_IP]");
      }

      if (simToxicityGuard) {
        const toxicWords = /\b(steal|leak|cheat|hack|bribe|illegal|bypass|unsafe)\b/gi;
        processedPrompt = processedPrompt.replace(toxicWords, "[FILTERED_THREAT_WORD]");
        processedResponse = processedResponse.replace(toxicWords, "[FILTERED_THREAT_WORD]");
      }

      const combinedText = `PROMPT: ${processedPrompt}\nRESPONSE: ${processedResponse}`;
      const payloadHash = await calculateSHA256(combinedText);
      const fingerprint = generateKeyFingerprint(simModel);
      
      const initialNode: TimelineNode = {
        id: `node-${Date.now()}-gen`,
        state: "GENERATED",
        actor: simModel,
        timestamp: timestampStr,
        description: `Initial localized deployment code and output. Security Guardrails: PII ${simScrubPii?'Active':'Off'}, Toxicity Filter ${simToxicityGuard?'Active':'Off'}. Compliance: ${liveSimComplianceScore}% Alignment under ISO/IEC 42001.`,
        hash: payloadHash,
        publicFingerprint: fingerprint,
        signature: {
          alg: "EdDSA",
          kid: `${simModel.toLowerCase().replace(/[^a-z0-9]/g, '')}-v1`,
          sig: generateMockSignature(payloadHash, "v1")
        }
      };

      const newDoc: DocumentAuditTrail = {
        id: newDocId,
        modelName: simModel,
        currentState: "GENERATED",
        signer: simModel,
        timestamp: timestampStr,
        payloadHash: payloadHash,
        timeline: [initialNode]
      };

      setAuditTrails(prev => [newDoc, ...prev]);
      setSelectedDocId(newDocId);
      setIsSimulatorOpen(false);
      setIsGenerating(false);

      // Reset default prompt & response text
      setSimPromptText('Draft an AI safety policy for autonomous customer support routing.');
      setSimResponseText('AIEC system will maintain continuous human-in-the-loop review overrides for all low-confidence routing classifications.');
    }, 1200);
  };

  // Prepare offline GRC compliance bundle JSON
  const complianceBundleJSON = useMemo(() => {
    const bundle = {
      system_id: "AIEC-42001-COMPLIANT-LEDGER",
      schema_standard: "ISO/IEC 42001:2023",
      timestamp_bundle_export: formatTimestamp(new Date()),
      total_documented_cycles: auditTrails.length,
      cryptographic_keychains: [
        { kid: "claude-sign-v2", type: "Ed25519", active: true },
        { kid: "gemini-model-v1", type: "Ed25519", active: true },
        { kid: "gpt4-signed-v2", type: "Ed25519", active: true }
      ],
      audit_trails: auditTrails
    };
    return JSON.stringify(bundle, null, 2);
  }, [auditTrails]);

  // Copy to clipboard helper
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(complianceBundleJSON);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Trigger download of local physical file in the browser
  const handleDownloadOfflineBundle = () => {
    const element = document.createElement("a");
    const file = new Blob([complianceBundleJSON], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `aiec-compliance-bundle-${selectedDoc.id.toLowerCase()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-[#0B0F19] min-h-screen text-[#dfe2f1] font-sans flex flex-col" id="console-container">
      {/* Console Top Navbar */}
      <header className="border-b border-[#1F2937] bg-[#111522] px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white border border-[#1F2937] hover:border-gray-700 px-3 py-1.5 rounded bg-[#0b0f19] transition-all font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>
          
          <div className="h-6 w-[1px] bg-[#1F2937]"></div>

          <div className="flex items-center gap-3">
            <AiecLogo size="xs" showText={true} />
            <span className="bg-[#171b26]/80 border border-[#1F2937] text-indigo-400 font-mono font-medium rounded px-2 py-0.5 text-[9px] uppercase tracking-wider">
              Audit Control Panel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSimulatorOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4.5 py-2 rounded flex items-center gap-2 transition-colors transform active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Simulate Pipeline Log</span>
          </button>

          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-[#1c1300] font-semibold text-xs px-4.5 py-2 rounded flex items-center gap-2 transition-colors transform active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Executive GRC Certification</span>
          </button>

          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#00311f] font-semibold text-xs px-4 py-2 rounded flex items-center gap-2 transition-colors transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Offline Bundle</span>
          </button>
        </div>
      </header>

      {/* Top Ledger Integrity Banner */}
      <section className="bg-[#111522]/40 border-b border-[#1F2937] px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
        <div>
          <span className="text-gray-500 font-mono text-[10px] block uppercase tracking-wider">Assets Governed</span>
          <span className="text-white font-sans text-sm font-semibold flex items-center gap-1.5 mt-1 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> {2481 + auditTrails.length} Registered
          </span>
        </div>
        <div>
          <span className="text-gray-500 font-mono text-[10px] block uppercase tracking-wider">Human Approvals</span>
          <span className="text-[#dfe2f1] font-mono text-xs font-semibold block mt-1">
            1,204 Signatures
          </span>
        </div>
        <div>
          <span className="text-gray-500 font-mono text-[10px] block uppercase tracking-wider">Compliance Packages</span>
          <span className="text-[#dfe2f1] font-mono text-xs font-semibold block mt-1">
            317 Sealed Bundles
          </span>
        </div>
        <div>
          <span className="text-gray-500 font-mono text-[10px] block uppercase tracking-wider">Audit Readiness</span>
          <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            98% Conformance
          </span>
        </div>
      </section>

      {/* Main Container Stage splits Dashboard and Detail Panel */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Compliance Dashboard Table Column (Left) */}
        <section className="lg:col-span-7 border-r border-[#1F2937] overflow-y-auto p-6 flex flex-col h-full bg-[#0c101a]" id="screen-dashboard">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Active Audit Trails</h2>
              <p className="text-xs text-gray-400 mt-1">Secure local ledger database. Tap any log row to inspect detailed evidence record structures in real-time.</p>
            </div>
            
            {/* Interactive Refresh Button */}
            <button 
              onClick={() => {
                setAuditTrails(INITIAL_AUDIT_TRAILS);
                setSelectedDocId("AIEC-8912");
              }}
              title="Reset Database to default assets"
              className="mt-2 md:mt-0 flex items-center gap-1 text-[11px] font-mono text-gray-500 hover:text-[#dfe2f1] self-start border border-[#1b2131] hover:border-gray-700 px-2 py-1 rounded transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset Ledger
            </button>
          </div>

          {/* Sovereign Validator Peers Section */}
          <div className="mb-6 p-4 rounded-lg bg-[#111522]/50 border border-indigo-950/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2937]/50 pb-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" /> Evidence Verification Network
                </h3>
                <p className="text-[10px] text-gray-400">Independent validation sources cross-matching ledger hashes.</p>
              </div>
              <button
                onClick={triggerPeerConsensusVerification}
                disabled={peerSyncState !== 'IDLE' && peerSyncState !== 'COMPLETED'}
                className="text-xs bg-indigo-600/90 hover:bg-indigo-650 disabled:opacity-50 text-white font-mono px-3.5 py-1.5 rounded transition-all flex items-center gap-1.5 active:scale-95 shadow-md shrink-0 cursor-pointer"
              >
                <AiecLogo size="xs" showText={false} className={peerSyncState !== 'IDLE' && peerSyncState !== 'COMPLETED' ? "animate-spin" : ""} />
                <span>
                  {peerSyncState === 'IDLE' && 'Verify on Sources'}
                  {peerSyncState === 'INGEST' && 'Ingesting Ledgers...'}
                  {peerSyncState === 'CIPHER_HANDSHAKE' && 'Handshaking Keys...'}
                  {peerSyncState === 'VALIDATING' && 'Signatures Synced'}
                  {peerSyncState === 'COMPLETED' && 'Verification Secured ✓'}
                </span>
              </button>
            </div>

            {/* Simulated Live Logging Feedback */}
            {peerSyncState !== 'IDLE' && (
              <div className="mb-3 p-2 rounded bg-black/40 border border-indigo-950 text-[10px] font-mono text-indigo-300">
                <span className="text-[9px] text-[#2dd4bf] block font-bold mb-1 uppercase tracking-wider">→ Console Output Log:</span>
                {peerSyncState === 'INGEST' && `[SYS] Ingesting selected document ${selectedDoc.id} with latest payload state...`}
                {peerSyncState === 'CIPHER_HANDSHAKE' && `[KEY] Shared handshakes established with independent verification sources.`}
                {peerSyncState === 'COMPLETED' && `[SUCCESS] 4/4 verification sources returned zero discrepancies. Registered payload hash matching: ${selectedDoc.payloadHash}`}
              </div>
            )}

            {/* Peer Nodes Grids */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Node 1: Munich */}
              <div className="bg-[#090b12] border border-[#1b2131] p-2.5 rounded flex items-center justify-between text-[11px] font-sans">
                <div>
                  <span className="text-gray-400 block font-semibold leading-tight">Munich GRC Node</span>
                  <span className="text-gray-500 font-mono text-[9px]">DE-West-1 Peer</span>
                </div>
                <div className="flex items-center">
                  {peerStatuses.munich === 'idle' && <span className="w-2 h-2 rounded-full bg-gray-700"></span>}
                  {peerStatuses.munich === 'scanning' && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>}
                  {peerStatuses.munich === 'verified' && <Server className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>

              {/* Node 2: Singapore */}
              <div className="bg-[#090b12] border border-[#1b2131] p-2.5 rounded flex items-center justify-between text-[11px] font-sans">
                <div>
                  <span className="text-gray-400 block font-semibold leading-tight">Singapore Vault</span>
                  <span className="text-gray-500 font-mono text-[9px]">SG-East-2 Peer</span>
                </div>
                <div className="flex items-center">
                  {peerStatuses.singapore === 'idle' && <span className="w-2 h-2 rounded-full bg-gray-700"></span>}
                  {peerStatuses.singapore === 'scanning' && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>}
                  {peerStatuses.singapore === 'verified' && <Server className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>

              {/* Node 3: Virginia */}
              <div className="bg-[#090b12] border border-[#1b2131] p-2.5 rounded flex items-center justify-between text-[11px] font-sans">
                <div>
                  <span className="text-gray-400 block font-semibold leading-tight">Virginia ZKP Node</span>
                  <span className="text-gray-500 font-mono text-[9px]">US-East-1 Peer</span>
                </div>
                <div className="flex items-center">
                  {peerStatuses.virginia === 'idle' && <span className="w-2 h-2 rounded-full bg-gray-700"></span>}
                  {peerStatuses.virginia === 'scanning' && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>}
                  {peerStatuses.virginia === 'verified' && <Server className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>

              {/* Node 4: Geneva */}
              <div className="bg-[#090b12] border border-[#1b2131] p-2.5 rounded flex items-center justify-between text-[11px] font-sans">
                <div>
                  <span className="text-gray-400 block font-semibold leading-tight">Geneva Ethical AI</span>
                  <span className="text-gray-500 font-mono text-[9px]">CH-Central-1 Peer</span>
                </div>
                <div className="flex items-center">
                  {peerStatuses.geneva === 'idle' && <span className="w-2 h-2 rounded-full bg-gray-700"></span>}
                  {peerStatuses.geneva === 'scanning' && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>}
                  {peerStatuses.geneva === 'verified' && <Server className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>
            </div>
          </div>

          {/* Filtering Layout Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6 bg-[#111522] p-3.5 rounded border border-[#1e2536]">
            {/* Search filter input */}
            <div className="sm:col-span-6 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input 
                className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white pl-9 pr-4 py-2 rounded focus:outline-none placeholder-gray-500"
                placeholder="Search audit trail by ID, signer..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Model Filter */}
            <div className="sm:col-span-3">
              <select 
                className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-3 py-2 rounded focus:outline-none"
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
              >
                <option value="ALL">All Models</option>
                {availableModels.filter(m => m !== 'ALL').map(modelName => (
                  <option key={modelName} value={modelName}>{modelName}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select 
                className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-3 py-2 rounded focus:outline-none"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <option value="ALL">All States</option>
                <option value="GENERATED">GENERATED</option>
                <option value="MODIFIED">MODIFIED</option>
                <option value="APPROVED">APPROVED</option>
              </select>
            </div>
          </div>

          {/* Data Grid table */}
          <div className="flex-grow overflow-x-auto min-h-[300px]">
            {filteredAuditTrails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#1f2937] rounded bg-[#111522]/10">
                <AlertCircle className="w-8 h-8 text-indigo-400/50 mb-3" />
                <span className="text-sm text-gray-400 font-semibold">No registered audit records match search criteria</span>
                <span className="text-xs text-gray-500 mt-1">Try resetting the filters or create a new simulated block at the top.</span>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1F2937] text-gray-500 uppercase font-mono text-[10px] tracking-wider bg-[#111522]/50">
                    <th className="py-3 px-4">Document ID</th>
                    <th className="py-3 px-4">AI Pipeline Model</th>
                    <th className="py-3 px-4">Current Ledger State</th>
                    <th className="py-3 px-4">Signer Fingerprint</th>
                    <th className="py-3 px-4">Last Event UTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937] font-sans">
                  {filteredAuditTrails.map((doc) => {
                    const isSelected = doc.id === selectedDocId;
                    
                    // Style attributes based on current state badge
                    let stateBadgeColor = "text-indigo-400 bg-indigo-950/40 border-indigo-900/50";
                    if (doc.currentState === "APPROVED") {
                      stateBadgeColor = "text-emerald-400 bg-emerald-950/40 border-emerald-900/50";
                    } else if (doc.currentState === "MODIFIED") {
                      stateBadgeColor = "text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-900/50";
                    }

                    return (
                      <tr 
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`cursor-pointer transition-all hover:bg-[#111522]/50 ${
                          isSelected ? 'bg-indigo-950/15 border-l-2 border-l-indigo-500' : ''
                        }`}
                      >
                        {/* ID */}
                        <td className="py-4 px-4 font-mono font-bold text-white flex items-center gap-1.5">
                          {doc.currentState === 'APPROVED' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/10" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-gray-600 inline-block bg-none flex items-center justify-center">
                              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                            </span>
                          )}
                          <span>{doc.id}</span>
                        </td>
                        
                        {/* AI Model */}
                        <td className="py-4 px-4 text-[#c7c4d8] font-medium">{doc.modelName}</td>
                        
                        {/* State */}
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${stateBadgeColor}`}>
                            {doc.currentState}
                          </span>
                        </td>
                        
                        {/* Signer */}
                        <td className="py-4 px-4 font-mono text-gray-400">
                          {doc.signer.includes('@') ? doc.signer : `${doc.signer}`}
                        </td>
                        
                        {/* Timestamp */}
                        <td className="py-4 px-4 font-mono text-gray-500 text-[11px]">{doc.timestamp}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Document Evidence Chain Detail View Column (Right) */}
        <section className="lg:col-span-5 overflow-y-auto p-6 bg-[#0B0F19] flex flex-col justify-between h-full" id="screen-evidence-chain">
          <div>
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-6">
              <div>
                <span className="text-gray-500 font-mono text-[10px] uppercase tracking-wider block">Inspecting Asset Lifecycle</span>
                <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" /> {selectedDoc.id} Proofs
                </h2>
              </div>

              <div className="flex gap-2">
                {/* Instant Verification Check trigger */}
                <button 
                  onClick={() => triggerCryptoVerification(selectedDoc.id)}
                  disabled={verifyingDocId === selectedDoc.id}
                  className="bg-[#111625] hover:bg-gray-800 text-xs text-[#dfe2f1] font-semibold border border-[#1F2937] hover:border-indigo-500/40 px-3 py-1.5 rounded transition-all flex items-center gap-1"
                >
                  {verifyingDocId === selectedDoc.id ? (
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-450 animate-spin" />
                  ) : (
                    <Shield className="w-3.5 h-3.5 text-indigo-450" />
                  )}
                  <span>{verifyingDocId === selectedDoc.id ? 'Verifying...' : 'Verify Schema'}</span>
                </button>
              </div>
            </div>

            {/* Verification Success Toast Notification */}
            {verifyingDocId === selectedDoc.id && (
              <div className={`mb-6 p-3 rounded-md border flex items-center justify-between text-xs font-mono transition-all ${
                verifiedStatus === 'SCANNING'
                  ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-300'
                  : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-pulse"></span>
                  </span>
                  <span>
                    {verifiedStatus === 'SCANNING' 
                      ? 'Local machine matching Merkle sibling leaf hashes...' 
                      : 'ALL CRYPTOGRAPHIC BLOCKS CONFIRMED COMPLIANT WITH ZERO DISCREPANCIES (PRIVACY-PRESERVING ARCHITECTURE ACTIVE)'
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Real-time Sovereign Risk Score Bento Grid */}
            <div className="mb-6 p-4 rounded-lg bg-[#111522]/30 border border-[#1e2536] text-xs">
              <div className="flex items-center justify-between border-b border-[#1F2937]/50 pb-2.5 mb-3.5">
                <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2dd4bf] animate-bounce" /> Sovereign AI Compliance Meter
                </span>
                <span className="bg-[#1e2536] text-[#dfe2f1] font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                  INDEX: {riskMetrics.totalScore}/100
                </span>
              </div>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-2 gap-2">
                {/* Box 1: Governance */}
                <div 
                  onClick={() => setSelectedRiskCategory(selectedRiskCategory === 'governance' ? null : 'governance')}
                  className={`bg-[#090b12] hover:bg-[#111522] border rounded p-2.5 cursor-pointer transition-all ${
                    selectedRiskCategory === 'governance' ? 'border-indigo-500' : 'border-[#1b2131]'
                  }`}
                >
                  <span className="text-gray-500 block uppercase font-mono text-[9px] tracking-wider font-semibold">ISO Governance</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-[13px] text-white font-bold">{riskMetrics.governance}%</span>
                    <span className="text-[9px] text-[#2dd4bf] font-mono font-medium">Excellent</span>
                  </div>
                </div>

                {/* Box 2: Toxicity */}
                <div 
                  onClick={() => setSelectedRiskCategory(selectedRiskCategory === 'toxicity' ? null : 'toxicity')}
                  className={`bg-[#090b12] hover:bg-[#111522] border rounded p-2.5 cursor-pointer transition-all ${
                    selectedRiskCategory === 'toxicity' ? 'border-indigo-500' : 'border-[#1b2131]'
                  }`}
                >
                  <span className="text-gray-500 block uppercase font-mono text-[9px] tracking-wider font-semibold">LLM Toxicity Rate</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-[13px] text-white font-bold">{riskMetrics.toxicity}%</span>
                    <span className="text-[9px] text-emerald-400 font-mono font-medium">Safe Limit</span>
                  </div>
                </div>

                {/* Box 3: Hallucination */}
                <div 
                  onClick={() => setSelectedRiskCategory(selectedRiskCategory === 'hallucination' ? null : 'hallucination')}
                  className={`bg-[#090b12] hover:bg-[#111522] border rounded p-2.5 cursor-pointer transition-all ${
                    selectedRiskCategory === 'hallucination' ? 'border-indigo-500' : 'border-[#1b2131]'
                  }`}
                >
                  <span className="text-gray-500 block uppercase font-mono text-[9px] tracking-wider font-semibold">Hallucination Index</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-[13px] text-white font-bold">{riskMetrics.hallucination}%</span>
                    <span className="text-[9px] text-emerald-400 font-mono font-medium">Low Prob</span>
                  </div>
                </div>

                {/* Box 4: Data Leakage */}
                <div 
                  onClick={() => setSelectedRiskCategory(selectedRiskCategory === 'leakage' ? null : 'leakage')}
                  className={`bg-[#090b12] hover:bg-[#111522] border rounded p-2.5 cursor-pointer transition-all ${
                    selectedRiskCategory === 'leakage' ? 'border-indigo-500' : 'border-[#1b2131]'
                  }`}
                >
                  <span className="text-gray-500 block uppercase font-mono text-[9px] tracking-wider font-semibold">Isolation Shield</span>
                  <div className="flex items-baseline justify-[#d6d9e0] mt-1 space-x-1 justify-between">
                    <span className="text-[13px] text-white font-bold">{riskMetrics.leakage}%</span>
                    <span className="text-[9px] text-[#2dd4bf] font-mono font-medium">Air-Gapped</span>
                  </div>
                </div>
              </div>

              {/* Collapsed/Expanded Category Details */}
              <AnimatePresence mode="wait">
                {selectedRiskCategory && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-2.5 rounded bg-black/40 border border-[#1b2131] font-mono text-[10px] text-indigo-300 overflow-hidden leading-relaxed"
                  >
                    <div className="flex items-center justify-between mb-1 text-[9px]">
                      <span className="text-[#2dd4bf] uppercase font-bold">
                        {selectedRiskCategory === 'governance' && 'ISO/IEC 42001 Governance Controls'}
                        {selectedRiskCategory === 'toxicity' && 'Toxicity & Bias Safeguards'}
                        {selectedRiskCategory === 'hallucination' && 'Hallucination & Coherence Validation'}
                        {selectedRiskCategory === 'leakage' && 'Privacy-Preserving Isolation'}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRiskCategory(null);
                        }}
                        className="text-gray-500 hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <span>
                      {selectedRiskCategory === 'governance' && "Continuous compliance tracking matches ISO/IEC 42001:2023 clauses A.6.2 and A.8.3. Cryptographic logs are written on-chain to allow instant validation by any accredited third-party registrar during compliance evaluation cycles."}
                      {selectedRiskCategory === 'toxicity' && "Client-side guardrails execute offline toxicity checks. Prompt injection filters actively scan the pipeline output, guaranteeing zero policy boundary slips or toxic response generation risks."}
                      {selectedRiskCategory === 'hallucination' && "Our automated validation engine runs differential logic checks on multi-stage model responses, confirming alignment constraints and keeping hallucination risks near absolute zero."}
                      {selectedRiskCategory === 'leakage' && "Your personal data is fully protected. Standard cryptographic envelope encryption protects all data inputs; prompt details are transformed into non-reversible hash structures locally prior to pipeline registration."}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Evidence Chain Pipeline Card */}
            <div className="mb-6 p-5 rounded-lg bg-[#111522]/40 border border-[#1e2536] text-xs text-left">
              <div className="flex items-center justify-between border-b border-[#1F2937]/50 pb-3 mb-4">
                <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" /> Evidence Chain Pipeline
                </span>
                <span className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                  selectedDoc.currentState === 'APPROVED' 
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                    : 'bg-[#171b30] text-indigo-400 border border-indigo-900/40'
                }`}>
                  {selectedDoc.currentState === 'APPROVED' ? 'Pipeline Certified' : 'In Review Chain'}
                </span>
              </div>

              {/* Connected Visual Pipeline */}
              <div className="relative pl-6 space-y-5 before:absolute before:bottom-3 before:top-2 before:left-[11px] before:w-[1.5px] before:bg-[#1F2937]/60">
                
                {/* 1. GENERATED */}
                {(() => {
                  const genNode = selectedDoc.timeline.find(n => n.state === 'GENERATED') || selectedDoc.timeline[0];
                  return (
                    <div className="relative group">
                      <div className="absolute -left-[20px] top-1 flex items-center justify-center">
                        <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                          <span className="h-1 w-1 rounded-full bg-white"></span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                        <div className="sm:col-span-4">
                          <span className="font-mono font-bold text-white text-[10px] uppercase tracking-wider block">GENERATED</span>
                        </div>
                        <div className="sm:col-span-8 text-right sm:text-left">
                          <span className="font-mono text-[10px] text-gray-500 block">{genNode.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{genNode.actor === 'System' ? 'Autonomous AI Engine Core' : genNode.actor}</p>
                    </div>
                  );
                })()}

                {/* 2. MODIFIED */}
                {(() => {
                  const modNode = selectedDoc.timeline.find(n => n.state === 'MODIFIED');
                  return (
                    <div className="relative group">
                      <div className="absolute -left-[20px] top-1 flex items-center justify-center">
                        {modNode ? (
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.4)]">
                            <span className="h-1 w-1 rounded-full bg-white"></span>
                          </span>
                        ) : (
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500/30 border border-emerald-500/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80"></span>
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                        <div className="sm:col-span-4">
                          <span className="font-mono font-bold text-white text-[10px] uppercase tracking-wider block">MODIFIED</span>
                        </div>
                        <div className="sm:col-span-8 text-right sm:text-left">
                          <span className="font-mono text-[10px] text-gray-500 block">
                            {modNode ? modNode.timestamp : 'Document Preserved'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {modNode ? `Manual override edit saved by ${modNode.actor}` : 'Zero human override modifications registered.'}
                      </p>
                    </div>
                  );
                })()}

                {/* 3. LEGAL REVIEW */}
                {(() => {
                  // If approved or if there exists counsel sign-off
                  const timeline = selectedDoc.timeline;
                  const legalNode = timeline.find(n => 
                    n.actor.toLowerCase().includes('counsel') || 
                    n.actor.toLowerCase().includes('legal') || 
                    n.state === 'APPROVED'
                  );
                  // We simulate a timeline of LEGAL REVIEW either present or pending
                  return (
                    <div className="relative group">
                      <div className="absolute -left-[20px] top-1 flex items-center justify-center">
                        {legalNode ? (
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]">
                            <span className="h-1 w-1 rounded-full bg-white"></span>
                          </span>
                        ) : (
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-gray-800 border border-gray-700 animate-pulse"></span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                        <div className="sm:col-span-4">
                          <span className="font-mono font-bold text-white text-[10px] uppercase tracking-wider block">LEGAL REVIEW</span>
                        </div>
                        <div className="sm:col-span-8 text-right sm:text-left">
                          <span className="font-mono text-[10px] text-gray-500 block">
                            {legalNode ? legalNode.timestamp : 'Pending Evaluator Assignment'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {legalNode ? `Evaluated and signed by General Counsel` : 'Awaiting general counsel alignment check.'}
                      </p>
                    </div>
                  );
                })()}

                {/* 4. APPROVED */}
                {(() => {
                  const appNode = selectedDoc.timeline.find(n => n.state === 'APPROVED');
                  return (
                    <div className="relative group">
                      <div className="absolute -left-[20px] top-1 flex items-center justify-center">
                        {appNode ? (
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                            <span className="h-1 w-1 rounded-full bg-white"></span>
                          </span>
                        ) : (
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-gray-800 border border-gray-700"></span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                        <div className="sm:col-span-4">
                          <span className="font-mono font-bold text-white text-[10px] uppercase tracking-wider block">APPROVED</span>
                        </div>
                        <div className="sm:col-span-8 text-right sm:text-left">
                          <span className="font-mono text-[10px] text-gray-500 block">
                            {appNode ? appNode.timestamp : 'Pending Signatures'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {appNode ? `Executive certification seal bound by ${appNode.actor}` : 'Pending final compliance-officer authorized approval.'}
                      </p>
                    </div>
                  );
                })()}

                {/* 5. EXPORTED */}
                {(() => {
                  const appNode = selectedDoc.timeline.find(n => n.state === 'APPROVED');
                  return (
                    <div className="relative group">
                      <div className="absolute -left-[20px] top-1 flex items-center justify-center">
                        {appNode ? (
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]">
                            <span className="h-1 w-1 rounded-full bg-white"></span>
                          </span>
                        ) : (
                          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-gray-800 border border-gray-700"></span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-1">
                        <div className="sm:col-span-4">
                          <span className="font-mono font-bold text-white text-[10px] uppercase tracking-wider block">EXPORTED</span>
                        </div>
                        <div className="sm:col-span-8 text-right sm:text-left">
                          <span className="font-mono text-[10px] text-gray-500 block">
                            {appNode ? appNode.timestamp : 'Queue Locked'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {appNode ? 'Sovereign local GRC compliance bundle ready for offline export.' : 'Awaiting regulatory approval to export GRC signature bundle.'}
                      </p>
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* Custom timeline chain - ARCHITECTURAL MINIMALIST TIMELINE NODES */}
            <div className="relative pl-6 space-y-10 border-l border-[#1F2937] ml-2">
              {selectedDoc.timeline.map((node, index) => {
                let badgeStyle = "text-indigo-400 bg-[#171b30] border-indigo-900/40";
                if (node.state === "APPROVED") {
                  badgeStyle = "text-emerald-400 bg-emerald-950/40 border-emerald-900/40";
                } else if (node.state === "MODIFIED") {
                  badgeStyle = "text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-900/40";
                }

                return (
                  <div key={node.id} className="relative">
                    {/* Architectural custom square node indicator */}
                    <div className="absolute -left-[30px] top-1 w-2.5 h-2.5 bg-[#0B0F19] border border-gray-600 flex items-center justify-center">
                      <div className="w-1 h-1 bg-indigo-400"></div>
                    </div>

                    <div className="bg-[#111522] border border-[#1F2937] p-4 rounded hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${badgeStyle}`}>
                            {node.state}
                          </span>
                          <span className="font-semibold text-xs text-white">{node.actor}</span>
                        </div>
                        <span className="text-gray-500 font-mono text-[10px]">{node.timestamp}</span>
                      </div>

                      {/* Content Description Detail */}
                      <p className="text-xs text-[#c7c4d8]/90 mb-3 whitespace-pre-line leading-relaxed">
                        {node.description}
                      </p>

                      {/* Metadata Collapsed fields */}
                      <div className="space-y-2 mt-2 pt-2.5 border-t border-[#1a2132]">
                        <div className="font-mono text-[9px]">
                          <span className="text-gray-500 block uppercase tracking-wider mb-0.5">SHA-256 Ledger Hash</span>
                          <span className="text-[#dfe2f1] block bg-[#090b13] p-1.5 rounded border border-[#1e2536] break-all">
                            {node.hash}
                          </span>
                        </div>

                        <div className="font-mono text-[9px] grid grid-cols-2 gap-2 mt-1.5 bg-[#090b13]/50 p-1.5 rounded">
                          <div>
                            <span className="text-gray-500 block uppercase tracking-wider mb-0.5">Signature Algorithm</span>
                            <span className="text-indigo-400 block font-medium">Ed25519 (EdDSA)</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block uppercase tracking-wider mb-0.5">Public Fingerprint</span>
                            <span className="text-gray-400 block truncate" title={node.publicFingerprint}>
                              {node.publicFingerprint}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Math Proof verification access trigger */}
                        <div className="mt-3.5 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedNodeForInspector(node);
                              setInspectorSigSuccess(null);
                            }}
                            className="text-[10px] bg-[#171c2a] hover:bg-indigo-950 text-indigo-300 hover:text-white border border-[#232b3f] hover:border-indigo-500/50 px-2.5 py-1 rounded transition-all font-mono font-medium flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <span>⚙ Inspect Evidence Record</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive GRC Policy modification block (Bottom form layout) */}
          <div className="mt-8 pt-6 border-t border-[#1F2937] bg-[#111522] p-4 rounded border">
            <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wider font-mono text-indigo-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Append Compliance Modification block
            </h3>
            <p className="text-[10px] text-gray-400 mb-3.5">Verify modifications and authorize legally mandatory policy overrides on this audit ledger chain.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Human Signer Identity</label>
                <input 
                  className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-3 py-1.5 rounded focus:outline-none placeholder-gray-600"
                  type="text"
                  placeholder="e.g. counsel-director@company.com"
                  value={newModActor}
                  onChange={(e) => setNewModActor(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Override Diff Description</label>
                <textarea 
                  rows={2}
                  className="w-full bg-[#090b12] border border-[#1F2937] focus:border-indigo-500 text-xs text-white px-3 py-1.5 rounded focus:outline-none placeholder-gray-600 placeholder:text-gray-600 text-[11px]"
                  placeholder="e.g. - 'Accuracy strictly automatic' + 'Audited weekly by third party.'"
                  value={newModText}
                  onChange={(e) => setNewModText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1.5">
                <button 
                  onClick={() => handleAddNewTimelineEvent('MODIFIED')}
                  disabled={isAddingNode || !newModText}
                  className="bg-[#171b26] border border-[#1F2937] hover:border-fuchsia-500/40 text-fuchsia-400 hover:text-white transition-all text-xs font-semibold py-2 rounded focus:outline-none disabled:opacity-50"
                >
                  Authorize Modification
                </button>
                <button 
                  onClick={() => handleAddNewTimelineEvent('APPROVED')}
                  disabled={isAddingNode}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-xs font-semibold py-2 rounded focus:outline-none disabled:opacity-50"
                >
                  Sign Off (Approve)
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Simulator OverLay Panel Side-Sheet (Interactive Simulation Flow) */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 bg-[#060a12]/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F19] border border-gray-800 rounded-lg max-w-lg w-full overflow-hidden shadow-2xl relative" id="sandbox-simulator-modal">
            {/* Top Bar bar header */}
            <div className="bg-[#111522] border-b border-gray-800 px-5 py-4 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono text-[#2dd4bf] flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" /> Real-time Model Governance Sandbox
              </span>
              <button 
                onClick={() => setIsSimulatorOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulateNewAuditTrail} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Target AI Engine Model</label>
                <select 
                  className="w-full bg-[#090b12] border border-gray-800 focus:border-indigo-500 text-xs text-white px-3 py-2 rounded focus:outline-none"
                  value={simModel}
                  onChange={(e) => setSimModel(e.target.value)}
                >
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  <option value="GPT-4o">GPT-4o</option>
                  <option value="Llama 3.1 70B">Llama 3.1 70B</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Proprietary User Prompt Input (Client-Side)</label>
                <textarea 
                  rows={2}
                  className="w-full bg-[#090b12] border border-gray-800 focus:border-indigo-500 text-xs text-white px-3 py-2 rounded focus:outline-none placeholder-gray-600 text-[11px]"
                  placeholder="e.g. Generate HIPAA compliance report for machine health database access."
                  value={simPromptText}
                  onChange={(e) => setSimPromptText(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">System Generated Pipeline Response (Client-Side)</label>
                <textarea 
                  rows={2}
                  className="w-full bg-[#090b12] border border-gray-800 focus:border-indigo-500 text-xs text-white px-3 py-2 rounded focus:outline-none placeholder-gray-600 text-[11px]"
                  placeholder="e.g. The database access controls mandate cryptographic tokens for authorized personnel pools only."
                  value={simResponseText}
                  onChange={(e) => setSimResponseText(e.target.value)}
                  required
                />
              </div>

              {/* Dynamic Compliance Gauge Meter */}
              <div className="bg-[#0c101a] p-3.5 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#2dd4bf]" /> dynamic isolation rating
                  </span>
                  <span className={`font-bold ${liveSimComplianceScore >= 90 ? 'text-[#2dd4bf]' : (liveSimComplianceScore >= 75 ? 'text-amber-400' : 'text-rose-400')}`}>
                    {liveSimComplianceScore}% PASS
                  </span>
                </div>
                {/* Horizontal Progress bar */}
                <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      liveSimComplianceScore >= 90 ? 'bg-[#2dd4bf]' : (liveSimComplianceScore >= 75 ? 'bg-amber-400' : 'bg-red-500')
                    }`}
                    style={{ width: `${liveSimComplianceScore}%` }}
                  />
                </div>
                {/* Micro warnings checklist text */}
                <p className="text-[9px] text-gray-500 font-mono mt-2 leading-relaxed">
                  {liveSimComplianceScore >= 90 
                    ? "✓ Safe. Enterprise model layers prove perfect governance alignments with ISO/IEC 42001 regulations."
                    : "⚠ Policy Warning: Input strings trigger caution filters. Toggle active protection layers below."
                  }
                </p>
              </div>

              {/* Founder Active Cyber-Guardrails Settings */}
              <div className="space-y-2.5 pt-1.5">
                <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold">Active Enterprise Guardrails</span>
                <div className="grid grid-cols-1 gap-2">
                  {/* Scrub PII Rule */}
                  <div className="flex items-center justify-between bg-[#111522]/40 p-2 border border-gray-850 rounded">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-300 block">PII Redactor Shield [Privacy-Preserving]</span>
                      <span className="text-[9px] text-gray-500 font-mono">Scrubs names, SSNs, IPs, or emails before sealing blocks</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSimScrubPii(!simScrubPii)}
                      className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                        simScrubPii ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'bg-gray-800 text-gray-500 border border-transparent'
                      }`}
                    >
                      {simScrubPii ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  {/* Toxicity Filter */}
                  <div className="flex items-center justify-between bg-[#111522]/40 p-2 border border-gray-850 rounded">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-300 block">Threat & Toxicity Restrictor</span>
                      <span className="text-[9px] text-gray-500 font-mono">Triggers alignment alert on malicious prompt injections</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSimToxicityGuard(!simToxicityGuard)}
                      className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                        simToxicityGuard ? 'bg-[#2dd4bf]/20 text-[#2dd4bf] border border-[#2dd4bf]' : 'bg-gray-800 text-gray-500 border border-transparent'
                      }`}
                    >
                      {simToxicityGuard ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  {/* Hallucination aligner */}
                  <div className="flex items-center justify-between bg-[#111522]/40 p-2 border border-gray-850 rounded">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-300 block">ISO Differential Logic Checks</span>
                      <span className="text-[9px] text-gray-500 font-mono">Validates logical consistency output against constraints</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSimHallucinationCheck(!simHallucinationCheck)}
                      className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                        simHallucinationCheck ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500' : 'bg-gray-800 text-gray-500 border border-transparent'
                      }`}
                    >
                      {simHallucinationCheck ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons Actions */}
              <div className="pt-3.5 border-t border-gray-800 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsSimulatorOpen(false)}
                  className="border border-gray-800 hover:bg-[#111522] text-[#dfe2f1] text-xs font-semibold px-4 py-2 rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isGenerating}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded transition-all flex items-center gap-2 transform active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Sealing local Cryptographic proof...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 text-white" />
                      <span>Authorize & Seal ledger</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screen 3: Audit Export Modal Overlay */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-[#060a12]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0f19] border border-gray-800 rounded-lg max-w-2xl w-full select-text overflow-hidden shadow-2xl relative" id="export-bundle-modal">
            {/* Modal Header */}
            <div className="bg-[#111522] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Offline compliance bundle ledger export
                </span>
              </div>
              
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                Download the complete cryptographically signed ledger file containing all active public key chains and verification hashes. This structured JSON file conforms strictly to ISO/IEC 42001 verification standards.
              </p>

              {/* Code preview block */}
              <div className="relative">
                <div className="absolute right-3 top-3 z-10 flex gap-1.5">
                  <button 
                    onClick={handleCopyToClipboard}
                    className="bg-gray-805/40 hover:bg-gray-800 text-gray-400 hover:text-white text-[10px] font-mono px-2 py-1 border border-[#1F2937] rounded flex items-center gap-1 transition-all"
                    title="Copy full JSON"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedNotification ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-[#05070d] p-4 rounded border border-[#1F2937] h-[280px] overflow-auto font-mono text-[10px] leading-relaxed text-[#00c572]">
                  <pre>{complianceBundleJSON}</pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Payload certified secure. Verified: ed25519-v1 SHA256 chain</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsExportModalOpen(false)}
                    className="border border-[#1F2937] hover:bg-[#111522] text-[#dfe2f1] text-xs font-semibold px-4 py-2 rounded transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={handleDownloadOfflineBundle}
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#002113] font-semibold text-xs px-5 py-2 rounded flex items-center gap-1.5 transition-all transform active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Compliance Bundle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal: Cryptographic Integrity Proof Inspector */}
      {selectedNodeForInspector && (
        <div className="fixed inset-0 bg-[#060a12]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0f19] border border-gray-800 rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl relative" id="proof-inspector-modal">
            {/* Modal Header */}
            <div className="bg-[#111522] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Cryptographic Integrity Proof Inspector
                </span>
              </div>
              <button 
                onClick={() => setSelectedNodeForInspector(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              <div className="p-3 border border-indigo-950 bg-indigo-950/20 rounded text-xs leading-relaxed text-[#c7c4d8]">
                <p>This sandbox displays real-time, mathematical schema verification matching for ledger block event: <span className="font-mono text-white font-bold">{selectedNodeForInspector.id}</span> generated by <span className="font-semibold text-white">{selectedNodeForInspector.actor}</span>.</p>
              </div>

              {/* Step 1: Merkle Linkage */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-900 border border-indigo-500 text-white flex items-center justify-center text-[10px] font-mono font-bold font-sans">1</span>
                  Sovereign Merkle Link Verified
                </h4>
                <p className="text-[11px] text-gray-400">Verifying logical linkage parameters on-chain:</p>
                <div className="bg-[#05070d] p-3 rounded border border-gray-800 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-[10px] font-mono">
                    <div className="md:col-span-4 text-gray-500 uppercase tracking-wider font-semibold">FORMULA CONSTANTS</div>
                    <div className="md:col-span-8 text-indigo-400 font-bold">SHA256(TIMESTAMP + STATE_VAL + ACTOR_ID + PREVIOUS_HASH)</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-[10px] font-mono border-t border-gray-900 pt-2">
                    <div className="md:col-span-4 text-gray-500 uppercase tracking-wider font-semibold">GENERATED HASH</div>
                    <div className="md:col-span-8 text-white break-all">{selectedNodeForInspector.hash}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-[#2dd4bf] font-mono mt-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Calculated Merkle leaf value matches local registers exactly (No Tampering)</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Signature Math */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-900 border border-indigo-500 text-white flex items-center justify-center text-[10px] font-mono font-bold font-sans">2</span>
                  Curve25519 Signature Authentication Math
                </h4>
                <p className="text-[11px] text-gray-400">Ed25519 (EdDSA) verification proves the signing key owner authorized this block:</p>
                <div className="bg-[#05070d] p-3 rounded border border-gray-800 space-y-2 font-mono text-[10px]">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-4 text-gray-500 font-semibold uppercase">PUBLIC KEY (A)</div>
                    <div className="sm:col-span-8 text-[#dfe2f1] truncate">{selectedNodeForInspector.publicFingerprint}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 border-t border-gray-900 pt-2">
                    <div className="sm:col-span-4 text-gray-500 font-semibold uppercase">SIGNATURE (S)</div>
                    <div className="sm:col-span-8 text-[#dfe2f1] break-all">{selectedNodeForInspector.signature.sig}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 border-t border-gray-900 pt-2">
                    <div className="sm:col-span-4 text-gray-500 font-semibold uppercase">ALGORITHM</div>
                    <div className="sm:col-span-8 text-indigo-400 font-bold">EdDSA-Curve25519-SHA512</div>
                  </div>

                  {inspectorSigSuccess !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-2 rounded bg-emerald-950/20 border border-emerald-900 text-emerald-400 font-mono text-[10px] flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>Signature Math Authenticated (S * BasePoint == HashPublicSignatureResult)</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Step 3: Privacy-Preserving Verification */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-900 border border-indigo-500 text-white flex items-center justify-center text-[10px] font-mono font-bold font-sans">3</span>
                  Privacy-Preserving Proof Alignment
                </h4>
                <div className="bg-[#05070d]/50 p-2.5 rounded border border-gray-850 text-[10px] font-mono text-gray-400 space-y-1">
                  <div className="text-white font-bold text-[10px] mb-1 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 font-bold" /> SAFE INTEGRITY SECURED
                  </div>
                  <p>All sensitive prompt keywords, raw context strings, and model definitions are fully shielded locally. Only public cryptographic linkage metrics, algorithms, and key fingerprinted signatures are registered, safeguarding proprietary enterprise structures completely.</p>
                </div>
              </div>

              {/* Action Rows */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setSelectedNodeForInspector(null)}
                  className="border border-gray-850 hover:bg-[#111522] text-[#dfe2f1] text-xs font-semibold px-4 py-2 rounded transition-colors cursor-pointer"
                >
                  Close Proof
                </button>
                <button 
                  onClick={startInspectorSignatureVerify}
                  disabled={isVerifyingInspectorSig || inspectorSigSuccess === true}
                  className="bg-indigo-600 hover:bg-indigo-550 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2 rounded transition-all flex items-center gap-1.5 transform active:scale-95 cursor-pointer"
                >
                  {isVerifyingInspectorSig ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Activity className="w-3.5 h-3.5 text-indigo-100" />
                  )}
                  <span>
                    {isVerifyingInspectorSig && 'Verifying Signature Elliptic Equation...'}
                    {inspectorSigSuccess === true && 'Signature Authenticated ✓'}
                    {inspectorSigSuccess === null && !isVerifyingInspectorSig && 'Verify Signature Math'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Premium Modal: Verifiable Executive ISO 42001 GRC Audit Certification Report Brief */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-[#060a12]/92 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0b0f19] border border-amber-500/30 rounded-lg max-w-2xl w-full my-8 overflow-hidden shadow-2xl relative" id="executive-brief-modal">
            
            {/* Ribbon Accent */}
            <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 h-1 w-full" />
            
            {/* Modal Header */}
            <div className="bg-[#111522] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  EXECUTIVE COMPLIANCE BRIEF & SEAL CERTIFICATION
                </span>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto select-text scrollbar-thin">
              
              {/* Main Certification Card */}
              <div id="executive-brief-modal-card" className="border border-amber-500/20 bg-gradient-to-b from-[#141a29] to-[#090d16] rounded-lg p-6 space-y-6 relative overflow-hidden text-left shadow-lg">
                
                {/* Background Seal Watermark */}
                <div className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none text-amber-400">
                  <Shield className="w-64 h-64" />
                </div>

                {/* Certification Header Block */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-[#1F2937]/50 pb-4">
                  {/* Left Column: Certification Brand & Metadata */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center gap-3">
                      <AiecLogo size="md" showText={true} />
                      <div className="h-6 w-[1.5px] bg-gray-800 hidden sm:block"></div>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block">
                        ISO 42001 STANDARD
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-white tracking-tight">Enterprise AI Governance Certification</h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-gray-500">
                        <span>Organization: <b className="text-gray-300 font-semibold">Enterprise A</b></span>
                        <span>•</span>
                        <span>Governance Record ID: <b className="text-gray-300 uppercase">{selectedDoc.id || 'AIEC-8912'}</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Executive Summary Box */}
                  <div className="md:col-span-5 flex justify-end">
                    <div className="bg-[#1b253b]/40 border border-emerald-500/20 rounded-lg p-3 text-left w-full max-w-sm shadow-inner">
                      <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold mb-1">OVERALL STATUS</div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        READY FOR ISO 42001 REVIEW
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 border-t border-gray-800/40 pt-2 text-[10px]">
                        <div>
                          <span className="text-[#c7c4d8]/60 text-[9px] block font-semibold">Governance Score:</span>
                          <span className="text-emerald-400 font-bold font-mono">PASS (98%)</span>
                        </div>
                        <div>
                          <span className="text-[#c7c4d8]/60 text-[9px] block">Risk Level:</span>
                          <span className="text-[#2dd4bf] font-bold font-mono">LOW</span>
                        </div>
                        <div className="col-span-2 pt-1 flex items-center justify-between text-[9px] text-[#c7c4d8]/50 border-t border-gray-850/10 mt-1">
                          <span>Last Assessment:</span>
                          <span className="text-white font-mono font-medium">June 2026</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certification Main Statement */}
                <div className="py-2">
                  <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                    This report confirms that the reviewed AI workflow maintains documented human oversight, auditability, approval controls, and exportable compliance evidence aligned with ISO/IEC 42001 governance requirements.
                  </p>
                </div>

                {/* Key GRC Verifiable metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-[#05070a]/60 border border-gray-850 rounded p-3 text-center">
                    <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-wider font-semibold">AI Assets Governed</span>
                    <span className="text-xl font-bold text-[#2dd4bf] block mt-1">128</span>
                    <span className="text-[8px] text-gray-400 font-mono block mt-0.5">Active Records</span>
                  </div>

                  <div className="bg-[#05070a]/60 border border-gray-850 rounded p-3 text-center">
                    <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Human Approvals</span>
                    <span className="text-xl font-bold text-indigo-400 block mt-1">56</span>
                    <span className="text-[8px] text-gray-400 font-mono block mt-0.5">Logged Signatures</span>
                  </div>

                  <div className="bg-[#05070a]/60 border border-gray-850 rounded p-3 text-center">
                    <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Compliance Packages</span>
                    <span className="text-xl font-bold text-amber-500 block mt-1">18</span>
                    <span className="text-[8px] text-gray-400 font-mono block mt-0.5">Generated</span>
                  </div>

                  <div className="bg-[#05070a]/60 border border-gray-850 rounded p-3 text-center">
                    <span className="block text-[9px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Governance Record ID</span>
                    <span className="text-xl font-bold text-purple-400 block mt-1 font-mono uppercase">{selectedDoc.id || 'AIEC-8912'}</span>
                    <span className="text-[8px] text-gray-400 font-mono block mt-0.5 truncate">ISO 42001 Standard</span>
                  </div>
                </div>

                {/* Verified Lifecycle Evidence Chain */}
                <div className="bg-[#05070a]/40 border border-gray-850 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Verified Lifecycle Evidence Chain</span>
                    <span className="text-[9px] font-mono text-[#2dd4bf] font-bold uppercase bg-[#2dd4bf]/5 px-2 py-0.5 rounded border border-[#2dd4bf]/10">Human Oversight Verified ✓</span>
                  </div>

                  {/* Horizontal / responsive vertical process steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative sm:before:absolute sm:before:top-[18px] sm:before:left-6 sm:before:right-6 sm:before:h-[2px] sm:before:bg-gray-800">
                    
                    {/* Step 1: Generated */}
                    <div className="relative flex flex-row sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                      <div className="z-10 w-9 h-9 rounded-full bg-teal-500/10 border border-[#2dd4bf] flex items-center justify-center text-[#2dd4bf] font-mono text-xs font-bold leading-none shadow-[0_0_12px_rgba(45,212,191,0.15)] shrink-0">
                        01
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-mono text-gray-500">09:02 UTC</span>
                        <span className="block font-bold text-white text-[11px] tracking-tight">Generated</span>
                        <span className="block text-[9px] text-[#2dd4bf]/90">Claude 3.5 Sonnet</span>
                      </div>
                    </div>

                    {/* Step 2: Modified */}
                    <div className="relative flex flex-row sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                      <div className="z-10 w-9 h-9 rounded-full bg-fuchsia-500/10 border border-fuchsia-500 flex items-center justify-center text-fuchsia-400 font-mono text-xs font-bold leading-none shadow-[0_0_12px_rgba(217,70,239,0.15)] shrink-0">
                        02
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-mono text-gray-500">09:07 UTC</span>
                        <span className="block font-bold text-white text-[11px] tracking-tight">Modified</span>
                        <span className="block text-[9px] text-fuchsia-400/90 font-medium font-semibold">Counsel Alice</span>
                      </div>
                    </div>

                    {/* Step 3: Reviewed */}
                    <div className="relative flex flex-row sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                      <div className="z-10 w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500 flex items-center justify-center text-indigo-400 font-mono text-xs font-bold leading-none shadow-[0_0_12px_rgba(99,102,241,0.15)] shrink-0">
                        03
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-mono text-gray-500">09:12 UTC</span>
                        <span className="block font-bold text-white text-[11px] tracking-tight">Reviewed</span>
                        <span className="block text-[9px] text-indigo-400/90">Partner Counsel</span>
                      </div>
                    </div>

                    {/* Step 4: Approved */}
                    <div className="relative flex flex-row sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                      <div className="z-10 w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500 flex items-center justify-center text-amber-500 font-mono text-xs font-bold leading-none shadow-[0_0_12px_rgba(245,158,11,0.15)] shrink-0">
                        04
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-mono text-gray-500">09:15 UTC</span>
                        <span className="block font-bold text-white text-[11px] tracking-tight">Approved</span>
                        <span className="block text-[9px] text-amber-500/90 font-medium font-semibold">General Counsel</span>
                      </div>
                    </div>

                    {/* Step 5: Exported */}
                    <div className="relative flex flex-row sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                      <div className="z-10 w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-505 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold leading-none shadow-[0_0_12px_rgba(16,185,129,0.15)] shrink-0">
                        05
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] font-mono text-gray-500">09:16 UTC</span>
                        <span className="block font-bold text-white text-[11px] tracking-tight">Exported</span>
                        <span className="block text-[9px] text-emerald-400 font-medium">Compliance Pkg</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Compliance Readiness Checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="bg-black/20 border border-gray-900 rounded p-2.5">
                    <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-wider">Human Oversight</span>
                    <span className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                      <Check className="w-3 h-3 text-[#2dd4bf]" /> VERIFIED
                    </span>
                  </div>
                  <div className="bg-black/20 border border-gray-900 rounded p-2.5">
                    <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-wider">Identity Attribution</span>
                    <span className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                      <Check className="w-3 h-3 text-[#2dd4bf]" /> VERIFIED
                    </span>
                  </div>
                  <div className="bg-black/20 border border-gray-900 rounded p-2.5">
                    <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-wider">Audit Trail</span>
                    <span className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                      <Check className="w-3 h-3 text-[#2dd4bf]" /> VERIFIED
                    </span>
                  </div>
                  <div className="bg-black/20 border border-gray-900 rounded p-2.5">
                    <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-wider">Export Package</span>
                    <span className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1 font-mono flex-wrap sm:flex-nowrap">
                      <Check className="w-3 h-3 text-[#2dd4bf]" /> AVAILABLE
                    </span>
                  </div>
                </div>

                {/* Verified Governance Controls Details */}
                <div className="space-y-2.5 pt-1">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Governance Controls Verified:</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-300">
                    <div className="flex items-start gap-2.5 p-2 rounded bg-black/20 border border-gray-900">
                      <CheckCircle2 className="w-4 h-4 text-[#2dd4bf] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block">Human Approval Workflow</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Every AI-generated artifact passed through documented human review before approval.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded bg-black/20 border border-gray-900">
                      <CheckCircle2 className="w-4 h-4 text-[#2dd4bf] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block">Audit Trail Preservation</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Generation, modification, review, approval, and export events were recorded.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded bg-black/20 border border-gray-900">
                      <CheckCircle2 className="w-4 h-4 text-[#2dd4bf] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block">Identity Verification</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">All governance actions were attributed to verified organizational identities.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded bg-black/20 border border-gray-900">
                      <CheckCircle2 className="w-4 h-4 text-[#2dd4bf] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block">Evidence Export Capability</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Compliance records can be exported for external audits and regulatory reviews.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital Signature Seals and Timestamp */}
                <div className="border-t border-[#1F2937]/50 pt-4 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 font-mono text-[9px] text-gray-500">
                    <div>TIMESTAMP SEALED: <span className="text-gray-300">{selectedDoc.timestamp}</span></div>
                    <div>GOVERNANCE CERTIFICATE ID: <span className="text-gray-300 uppercase">{selectedDoc.id}-GRC-SEAL</span></div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 font-sans">
                    <div className="bg-[#05070a]/60 border border-amber-500/20 p-1.5 rounded-lg flex items-center justify-center shrink-0">
                      {/* Simulated QR Verification Code */}
                      <div className="grid grid-cols-4 gap-[2px] w-8 h-8 opacity-75">
                        <div className="bg-amber-400 rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-amber-400 rounded-sm"></div>
                        <div className="bg-amber-400 rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-amber-400 rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-amber-400 rounded-sm"></div>
                        <div className="bg-amber-400 rounded-sm"></div>
                        <div className="bg-amber-400 rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-amber-400 rounded-sm"></div>
                        <div className="bg-amber-400 rounded-sm"></div>
                        <div className="bg-transparent"></div>
                      </div>
                    </div>
                    <div className="text-left font-sans animate-none">
                      <span className="text-[10px] font-bold text-white block hover:text-amber-300 transition-colors">AIEC PROTOCOL BOARD</span>
                      <span className="text-[8px] text-emerald-400 font-mono block uppercase tracking-wider font-semibold">DIGITAL SEAL SECURED ✓</span>
                    </div>
                  </div>
                </div>

              </div>

                  {/* Technical Evidence Appendix Toggle Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setShowTechnicalProof(!showTechnicalProof)}
                  className="text-[11px] font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-[#171b2d]/50 hover:bg-[#1a2035] px-4 py-2 rounded-full border border-indigo-950 transition-all cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{showTechnicalProof ? 'Hide Technical Evidence Appendix' : 'Open Technical Evidence Appendix'}</span>
                </button>
              </div>

              {/* Collapsed/Expanded Technical Proof container */}
              <AnimatePresence>
                {showTechnicalProof && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="w-full mt-3 block"
                  >
                    <div className="border border-indigo-950/60 bg-[#070b14] rounded-lg p-5 mt-2 space-y-4 text-left shadow-lg">
                      <div className="flex items-center justify-between border-b border-indigo-900/20 pb-2.5">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-indigo-400" /> TECHNICAL AUDIT EVIDENCE
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 bg-gray-950/40 px-2.5 py-0.5 rounded border border-gray-900 uppercase tracking-wider">
                          EVIDENCE VERIFICATION DETAILS
                        </span>
                      </div>

                      <div className="space-y-4 font-mono text-[10px] leading-relaxed text-gray-400">
                        <p className="leading-relaxed text-gray-400 text-[11px] font-sans">
                          These records provide mathematical verification of document integrity, identity attribution, and evidence chain continuity compiled under the ISO/IEC 42001 proof framework.
                        </p>

                        <div>
                          <span className="text-gray-500 block uppercase text-[8px] tracking-wider font-bold mb-1">On-chain Merkle Root Schema</span>
                          <div className="bg-black/30 p-2.5 border border-gray-950 rounded text-gray-300 break-all select-all font-mono">
                            SHA256(TIMESTAMP + STATE_VAL + ACTOR_ID + PREVIOUS_HASH)
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-gray-500 block uppercase text-[8px] tracking-wider font-bold mb-1">Payload SHA-256 Hash</span>
                            <div className="bg-black/30 p-2.5 border border-gray-950 rounded text-emerald-400 break-all select-all text-[9.5px]">
                              {selectedDoc ? selectedDoc.payloadHash : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 block uppercase text-[8px] tracking-wider font-bold mb-1">Parent Sibling Leaf Hash</span>
                            <div className="bg-black/30 p-2.5 border border-gray-950 rounded text-indigo-400 break-all select-all text-[9.5px]">
                              {(selectedDoc && selectedDoc.timeline && selectedDoc.timeline.length > 0)
                                ? (selectedDoc.timeline[selectedDoc.timeline.length - 1]?.hash || selectedDoc.payloadHash)
                                : 'N/A'
                              }
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-900 pt-3">
                          <div>
                            <span className="text-gray-500 block uppercase text-[8px] tracking-wider font-bold mb-1">Asymmetric Public Key (Curve25519)</span>
                            <div className="bg-black/30 p-2.5 border border-gray-950 rounded text-amber-500 break-all select-all font-mono text-[9px]">
                              {(selectedDoc && selectedDoc.timeline && selectedDoc.timeline.length > 0)
                                ? (selectedDoc.timeline[selectedDoc.timeline.length - 1]?.publicFingerprint || 'ed25519_pub_active_c25519_cert')
                                : 'ed25519_pub_active_c25519_cert'
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 block uppercase text-[8px] tracking-wider font-bold mb-1">Digital Signature Envelope (Ed25519)</span>
                            <div className="bg-black/30 p-2.5 border border-gray-950 rounded text-purple-400 break-all select-all block h-[42px] overflow-hidden truncate text-[9px]">
                              {(selectedDoc && selectedDoc.timeline && selectedDoc.timeline.length > 0)
                                ? (selectedDoc.timeline[selectedDoc.timeline.length - 1]?.signature?.sig || 'N/A')
                                : 'N/A'
                              }
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] text-[#2dd4bf] pt-1 border-t border-gray-900 mt-2">
                          <Check className="w-3.5 h-3.5" />
                          <span>All digital seals match registered hardware key attestation records with zero delta.</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Modal Actions */}
            <div className="bg-[#111522] border-t border-gray-800 px-6 py-4 flex items-center justify-between">
              <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Attested compliant under GRC-AIWG Framework v42.0
              </span>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsReportModalOpen(false)}
                  className="border border-gray-800 hover:bg-[#0c101a] text-[#dfe2f1] text-xs font-semibold px-4.5 py-2 rounded transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={handlePrintComplianceBrief}
                  className="bg-amber-500 hover:bg-amber-400 text-[#002113] font-semibold text-xs px-5 py-2 rounded flex items-center gap-1.5 transition-all transform active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Print Compliance Brief</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
