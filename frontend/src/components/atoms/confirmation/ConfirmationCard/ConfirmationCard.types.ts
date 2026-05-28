/**
 * ConfirmationCard Types
 */

import type { SessionConfirmationData } from "@lib/types/session.types";

export interface ConfirmationCardProps {
  data: SessionConfirmationData;
  onDone?: () => void;
}
