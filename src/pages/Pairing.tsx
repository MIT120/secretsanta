import "@fontsource/dancing-script/700.css";
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { decryptText } from '../utils/crypto';
import { PostCard } from '../components/PostCard';
import { Trans, useTranslation } from 'react-i18next';
import { MenuItem, SideMenu } from '../components/SideMenu';
import { PageTransition } from '../components/PageTransition';
import { ArrowLeft, Info } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import CryptoJS from 'crypto-js';
import { Layout } from "../components/Layout";
import { ReceiverData } from "../types";

async function loadPairing(searchParams: URLSearchParams): Promise<[string, ReceiverData]> {
  // Legacy pairings, not generated anymore; remove after 2025-01-01
  if (searchParams.has(`name`) && searchParams.has(`key`) && searchParams.has(`pairing`)) {
    const name = searchParams.get(`name`)!;
    const key = searchParams.get(`key`)!;
    const pairing = searchParams.get(`pairing`)!;

    return [name, { name: CryptoJS.AES.decrypt(pairing, key).toString(CryptoJS.enc.Utf8) }];
  }

  if (searchParams.has(`to`)) {
    const from = searchParams.get('from')!;
    const to = searchParams.get('to')!;
    const decrypted = await decryptText(to);

    try {
      // Try to parse as JSON first (new format with hint)
      const data = JSON.parse(decrypted) as ReceiverData;
      return [from, data];
    } catch {
      // If parsing fails, it's the old format (just the name)
      return [from, { name: decrypted, hint: undefined } as ReceiverData];
    }
  }

  throw new Error(`Missing key or to parameter in search params`);
}

const SECRET_SANTA_PAIRING_KEY = 'secretSantaPairing';

interface StoredPairing {
  giver: string;
  receiver: ReceiverData;
  instructions: string | null;
}

export function Pairing() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignment, setAssignment] = useState<[string, ReceiverData] | null>(null);
  const [instructions, setInstructions] = useState<string | null>(null);
  const [hasStoredPairing, setHasStoredPairing] = useState(false);

  useEffect(() => {
    const decryptReceiver = async () => {
      try {
        // First, check if we have a stored pairing in localStorage
        const storedPairingStr = localStorage.getItem(SECRET_SANTA_PAIRING_KEY);
        if (storedPairingStr) {
          try {
            const storedPairing: StoredPairing = JSON.parse(storedPairingStr);
            setAssignment([storedPairing.giver, storedPairing.receiver]);
            setInstructions(storedPairing.instructions);
            setHasStoredPairing(true);
            setLoading(false);
            return;
          } catch (parseErr) {
            // If parsing fails, clear the invalid data and continue
            localStorage.removeItem(SECRET_SANTA_PAIRING_KEY);
          }
        }

        // If no stored pairing, load from URL params
        const loadedAssignment = await loadPairing(searchParams);
        const urlInstructions = searchParams.get('info');

        // Store the pairing in localStorage
        const pairingToStore: StoredPairing = {
          giver: loadedAssignment[0],
          receiver: loadedAssignment[1],
          instructions: urlInstructions,
        };
        localStorage.setItem(SECRET_SANTA_PAIRING_KEY, JSON.stringify(pairingToStore));
        setHasStoredPairing(true);

        setAssignment(loadedAssignment);
        setInstructions(urlInstructions);
      } catch (err) {
        console.error('Decryption error:', err);
        setError(t('pairing.error'));
      } finally {
        setLoading(false);
      }
    };

    decryptReceiver();
  }, [searchParams, t]);

  if (error) {
    return (
      <div className="min-h-screen bg-red-700 flex items-center justify-center">
        <div className="text-xl text-white">{error}</div>
      </div>
    );
  }

  // Only show the "Start Your Own" button if there's no stored pairing
  const menuItems = hasStoredPairing ? [] : [
    <MenuItem key={`back`} to="/" icon={<ArrowLeft weight={`bold`} />}>
      {t('pairing.startYourOwn')}
    </MenuItem>
  ];

  return (
    <Layout menuItems={menuItems}>
      <div className="lg:ml-auto lg:w-1/2">
        {!loading && assignment && (
          <motion.div
            initial={{ rotateZ: -360 * 1, scale: 0 }}
            animate={{ rotateZ: 0, scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: `easeIn`, duration: .6 }}
          >
            <PostCard>
              <h1 className="text-3xl font-bold mb-6 text-center text-red-700">
                {t('pairing.title')}
              </h1>
              <p className="mb-6 text-center text-gray-600">
                <Trans
                  i18nKey="pairing.assignment"
                  components={{
                    name: <span className="font-semibold">{assignment![0]}</span>
                  }}
                />
              </p>
              <div className="text-8xl font-bold text-center p-6 font-dancing-script">
                {assignment[1].name}
              </div>
              {(instructions || assignment[1].hint) && (
                <div className="mt-6 flex p-4 bg-gray-50 rounded-lg leading-6 text-gray-600 whitespace-pre-wrap">
                  <div className="mr-4">
                    <Info size={24} />
                  </div>
                  <div className="space-y-2">
                    {assignment[1].hint && <p>{assignment[1].hint}</p>}
                    {instructions && <p>{instructions}</p>}
                  </div>
                </div>
              )}
            </PostCard>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
