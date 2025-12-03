import React from "react";
import { DownloadSimple, Printer } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { CopyButton } from "./CopyButton";
import { generateAssignmentLink, generateCSV } from "../utils/links";
import { Participant } from "../types";
import { GeneratedPairs, generateGenerationHash } from "../utils/generatePairs";
import { generatePrintablePostCards } from "../utils/printPostCards";

interface SecretSantaLinksProps {
  assignments: GeneratedPairs;
  instructions?: string;
  participants: Record<string, Participant>;
  onGeneratePairs: () => void;
}

export function SecretSantaLinks({ assignments, instructions, participants, onGeneratePairs }: SecretSantaLinksProps) {
  const { t } = useTranslation();

  const currentHash = generateGenerationHash(participants);
  const hasChanged = currentHash !== assignments.hash;

  const adjustedPairings = assignments.pairings.map(({ giver, receiver }): [string, string, string | undefined] => [
    participants[giver.id]?.name ?? giver.name,
    participants[receiver.id]?.name ?? receiver.name,
    participants[receiver.id]?.hint,
  ]);

  adjustedPairings.sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  const handleExportCSV = () => {
    const csvContent = generateCSV(adjustedPairings.map(([giver, receiver]) => [giver, receiver]));
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'secret-santa-assignments.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handlePrintPostCards = () => {
    const htmlContent = generatePrintablePostCards(assignments, participants, instructions);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'secret-santa-postcards.html';
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return <>
    {hasChanged && (
      <div className="mb-2 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
        <p className="text-sm">
          {t('links.warningParticipantsChanged')}
        </p>
        <button
          className="mt-2 w-full px-2 py-1 bg-yellow-700/40 rounded hover:bg-yellow-700/50 text-center text-white text-xs"
          onClick={onGeneratePairs}
        >
          {t('links.resetAssignments')}
        </button>
      </div>
    )}
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col mb-4 gap-2">
        <p className="text-gray-600 text-balance">
          {t('links.shareInstructions')}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={handlePrintPostCards}
            className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center justify-center gap-2"
            title={t('links.printPostCards')}
          >
            <Printer size={20} weight="bold" />
            {t('links.printPostCards')}
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
            title={t('links.exportCSV')}
          >
            <DownloadSimple size={20} weight="bold" />
            {t('links.exportCSV')}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[minmax(100px,auto)_1fr] gap-3">
        {adjustedPairings.map(([giver, receiver, hint]) => (
          <React.Fragment key={giver}>
            <span className="font-medium self-center">
              {giver}:
            </span>
            <CopyButton
              textToCopy={() => generateAssignmentLink(giver, receiver, hint, instructions)}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              {t('links.copySecretLink')}
            </CopyButton>
          </React.Fragment>
        ))}
      </div>
    </div>
  </>;
}