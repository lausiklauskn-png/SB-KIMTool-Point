// 00_config.js — central constants for the headless model.
//
// REAL constants below are mirrored verbatim from the live Sage-Protokol
// status.json (read 2026-05-29). Do not invent values here — they must stay
// in sync with Sage so the model prototypes the real protocol.

/** Real Sage protocol constants (source of truth: Sage-Protokol/status.json). */
export const SAGE = Object.freeze({
  PROTOCOL_VERSION: "0.2",
  EMBEDDING_MODEL: "Xenova/multilingual-e5-small",
  EMBEDDING_DIM: 384,
  PROVIDER_MIN_MATCH: 0.80,
  QUERY_TIMEOUT_MS: 4000,
});

// --- Model-only proposals -------------------------------------------------
// The following are NOT (yet) part of Sage. They are PROPOSALS the model
// plays through for the still-dormant immune modules (10/11/12/14). If they
// prove out here, they get carried back into Sage — clearly marked as such.

/**
 * Share of legitimate, building peers whose signed distrust must accumulate
 * against a node before the collective flags it (module 10 Reputation).
 * MODEL PROPOSAL — not a Sage constant.
 */
export const REP_DISTRUST_RATIO = 0.15;

/** How many bad artefacts a single node may submit before local distrust fires. */
export const REP_BAD_ARTEFACT_LIMIT = 1;

/** Homeostasis: a node carrying more than this many spores self-terminates. */
export const HOMEOSTASIS_SPORE_LIMIT = 50;

/** Probability the Bauer role ships a faulty artefact ("bad programmer"). */
export const BAUER_FAULT_RATE = 0.35;

export const PROTOCOL_VERSION = SAGE.PROTOCOL_VERSION;
