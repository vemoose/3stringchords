import { useState, type RefObject } from 'react';
import { Modal } from './Modal';
import {
  canSharePracticeSnapshot,
  isMobileExportDevice,
  printPracticeSnapshotImage,
  printPracticeSnapshotOnMobile,
  sharePracticeSnapshotFile,
} from '../utils/capturePracticeSnapshot';

interface PracticeSnapshotModalProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  dataUrl: string | null;
  filename: string;
  initialAction?: 'save' | 'print';
  onClose: () => void;
}

export function PracticeSnapshotModal({
  dialogRef,
  dataUrl,
  filename,
  initialAction = 'save',
  onClose,
}: PracticeSnapshotModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleShare = async () => {
    if (!dataUrl || isSharing) return;

    setIsSharing(true);
    try {
      await sharePracticeSnapshotFile(dataUrl, filename);
      onClose();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Failed to share practice snapshot', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handlePrint = async () => {
    if (!dataUrl || isPrinting) return;

    setIsPrinting(true);
    try {
      if (isMobileExportDevice()) {
        await printPracticeSnapshotOnMobile(dataUrl, filename);
      } else {
        await printPracticeSnapshotImage(dataUrl);
      }
    } catch (error) {
      console.error('Failed to print practice snapshot', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const hintText =
    initialAction === 'print'
      ? 'Tap Print to open the share menu, then choose Print. You can also press and hold the image to save it.'
      : 'Press and hold the image to save it to Photos, or use the buttons below.';

  if (!dataUrl) return null;

  return (
    <Modal
      dialogRef={dialogRef}
      onClose={onClose}
      panelClassName="modal-panel--compact practice-snapshot-modal"
      maxWidth="640px"
    >
      <div className="practice-snapshot-modal__content">
        <h2 className="practice-snapshot-modal__title">Practice Set</h2>
        <p className="practice-snapshot-modal__hint">
          {hintText}
        </p>

        <div className="practice-snapshot-modal__image-wrap">
          <img
            src={dataUrl}
            alt="Practice set sheet"
            className="practice-snapshot-modal__image"
          />
        </div>

        <div className="practice-snapshot-modal__actions">
          {canSharePracticeSnapshot() && (
            <button
              type="button"
              className="practice-snapshot-modal__btn practice-snapshot-modal__btn--primary"
              onClick={handleShare}
              disabled={isSharing || isPrinting}
            >
              {isSharing ? 'Opening…' : 'Share / Save Image'}
            </button>
          )}
          <button
            type="button"
            className={`practice-snapshot-modal__btn${initialAction === 'print' ? ' practice-snapshot-modal__btn--primary' : ''}`}
            onClick={handlePrint}
            disabled={isSharing || isPrinting}
          >
            {isPrinting ? 'Opening…' : 'Print'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
