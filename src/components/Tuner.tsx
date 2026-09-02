import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Tuning } from '../data/chords';
import { Modal } from './Modal';

interface TunerProps {
  isOpen: boolean;
  onClose: () => void;
  tuning: Tuning;
}

const NOTE_STRINGS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// CBG string range (~Low G to high string) with margin for detuning
const MIN_FREQ = 65;
const MAX_FREQ = 450;
const RMS_THRESHOLD = 0.003;
const PITCH_HISTORY_SIZE = 7;
const NO_SIGNAL_FRAMES = 12;

function getNoteFromPitch(frequency: number) {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function getCentsFromPitch(frequency: number, note: number) {
  const targetFrequency = 440 * Math.pow(2, (note - 69) / 12);
  return Math.floor(1200 * Math.log(frequency / targetFrequency) / Math.log(2));
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function correctToFundamental(frequency: number): number {
  let f = frequency;
  while (f > MAX_FREQ * 0.75 && f / 2 >= MIN_FREQ) {
    f /= 2;
  }
  return f;
}

function autoCorrelate(buffer: Float32Array, sampleRate: number) {
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / buffer.length);
  if (rms < RMS_THRESHOLD) return -1;

  let r1 = 0;
  let r2 = buffer.length - 1;
  const thres = 0.2;
  for (let i = 0; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
  }
  for (let i = 1; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[buffer.length - i]) < thres) { r2 = buffer.length - i; break; }
  }

  const trimmed = buffer.subarray(r1, r2);
  const length = trimmed.length;

  const minPeriod = Math.floor(sampleRate / MAX_FREQ);
  const maxPeriod = Math.min(Math.ceil(sampleRate / MIN_FREQ), Math.floor(length / 2));
  if (maxPeriod <= minPeriod) return -1;

  const c = new Float32Array(maxPeriod + 1).fill(0);
  for (let i = minPeriod; i <= maxPeriod; i++) {
    for (let j = 0; j < length - i; j++) {
      c[i] += trimmed[j] * trimmed[j + i];
    }
  }

  let d = minPeriod;
  while (d < maxPeriod && c[d] > c[d + 1]) d++;

  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i <= maxPeriod; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  if (maxpos <= 0) return -1;

  let T0 = maxpos;
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1] ?? c[T0];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  const frequency = sampleRate / T0;
  if (frequency < MIN_FREQ || frequency > MAX_FREQ) return -1;

  return correctToFundamental(frequency);
}

export const Tuner: React.FC<TunerProps> = ({ isOpen, onClose, tuning }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const pitchHistoryRef = useRef<number[]>([]);
  const noSignalCountRef = useRef(0);
  const listeningRef = useRef(false);

  const [pitch, setPitch] = useState<number>(-1);
  const [noteStr, setNoteStr] = useState<string>('--');
  const [cents, setCents] = useState<number>(0);
  const [micError, setMicError] = useState<string>('');
  const [micActive, setMicActive] = useState(false);
  const [micStarting, setMicStarting] = useState(false);
  const [playingTone, setPlayingTone] = useState<string | null>(null);

  const resetPitchDisplay = useCallback(() => {
    pitchHistoryRef.current = [];
    noSignalCountRef.current = 0;
    setPitch(-1);
    setNoteStr('--');
    setCents(0);
  }, []);

  const stopMic = useCallback(() => {
    listeningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    analyserRef.current = null;
    setMicActive(false);
    setMicStarting(false);
    resetPitchDisplay();
  }, [resetPitchDisplay]);

  const updatePitch = useCallback(() => {
    if (!listeningRef.current || !analyserRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    const ac = autoCorrelate(buffer, ctx.sampleRate);

    if (ac !== -1) {
      noSignalCountRef.current = 0;
      pitchHistoryRef.current.push(ac);
      if (pitchHistoryRef.current.length > PITCH_HISTORY_SIZE) {
        pitchHistoryRef.current.shift();
      }

      const smoothed = median(pitchHistoryRef.current);
      const note = getNoteFromPitch(smoothed);
      setPitch(Math.round(smoothed));
      setNoteStr(NOTE_STRINGS[note % 12]);
      setCents(getCentsFromPitch(smoothed, note));
    } else {
      noSignalCountRef.current += 1;
      if (noSignalCountRef.current > NO_SIGNAL_FRAMES) {
        pitchHistoryRef.current = [];
        setPitch(-1);
      }
    }

    animationFrameRef.current = requestAnimationFrame(updatePitch);
  }, []);

  const startMic = useCallback(async () => {
    setMicStarting(true);
    setMicError('');
    resetPitchDisplay();

    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1,
        },
      });
      mediaStreamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0;
      source.connect(analyser);
      analyserRef.current = analyser;

      listeningRef.current = true;
      setMicActive(true);
      setMicStarting(false);
      updatePitch();
    } catch (err) {
      console.error(err);
      listeningRef.current = false;
      setMicActive(false);
      setMicStarting(false);
      setMicError('Microphone unavailable. Tap Start Listening to try again, or use reference tones below.');
    }
  }, [resetPitchDisplay, updatePitch]);

  const stopTone = useCallback(() => {
    if (oscillatorRef.current && audioContextRef.current) {
      const osc = oscillatorRef.current;
      osc.stop(audioContextRef.current.currentTime + 0.1);
      oscillatorRef.current = null;
    }
    setPlayingTone(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (!dialogRef.current?.open) {
        dialogRef.current?.showModal();
      }
      setMicError('');
    } else {
      dialogRef.current?.close();
      stopMic();
      stopTone();
    }
    return () => {
      stopMic();
      stopTone();
    };
  }, [isOpen, stopMic, stopTone]);

  useEffect(() => {
    if (!isOpen) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || !listeningRef.current) return;
      audioContextRef.current?.resume().catch(() => {});
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isOpen]);

  const playTone = (frequency: number, name: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    stopTone();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    oscillatorRef.current = osc;
    setPlayingTone(name);
  };

  const getDialColor = () => {
    if (pitch === -1) return 'var(--text-muted)';
    if (Math.abs(cents) <= 10) return '#10b981'; // Green
    if (Math.abs(cents) <= 30) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <Modal dialogRef={dialogRef} onClose={onClose} panelClassName="modal-panel--compact">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{tuning} Tuner</h2>
        
        {micError && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{micError}</p>}

        {!micActive && (
          <button
            type="button"
            className="primary"
            onClick={startMic}
            disabled={micStarting}
            style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '1rem' }}
          >
            {micStarting ? 'Starting microphone…' : 'Start Listening'}
          </button>
        )}

        {micActive && (
          <p style={{ fontSize: '0.85rem', color: '#10b981', margin: 0, textAlign: 'center' }}>
            Listening — pluck a string near your phone
          </p>
        )}

        {!micActive && !micError && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
            Tap Start Listening to enable pitch detection
          </p>
        )}
        
        {/* Tuner Display */}
        <div style={{ position: 'relative', width: '100%', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '1rem' }}>
          {/* Arc / Dial background */}
          <div style={{ position: 'absolute', bottom: '10px', width: '200px', height: '100px', borderTopLeftRadius: '100px', borderTopRightRadius: '100px', border: '4px solid var(--border-color)', borderBottom: 'none' }} />
          

          
          {/* Needle */}
          {pitch !== -1 && (
            <div style={{ 
              position: 'absolute', 
              bottom: '10px', 
              width: '4px', 
              height: '90px', 
              transformOrigin: 'bottom center',
              transform: `rotate(${cents * 0.9}deg)`, // Map +/- 50 cents to +/- 45 degrees
              transition: 'transform 0.1s ease-out',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              {/* Only the top part of the needle is colored, leaving space for the text */}
              <div style={{
                width: '100%',
                height: '45px',
                backgroundColor: getDialColor(),
                borderRadius: '2px',
                transition: 'background-color 0.2s',
              }} />
            </div>
          )}

          {/* Note display */}
          <div style={{ 
            position: 'absolute', 
            bottom: '-25px', 
            fontSize: '3.5rem', 
            fontWeight: 800, 
            color: getDialColor(),
            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 10
          }}>
            {pitch === -1 ? '--' : noteStr}
          </div>
        </div>

        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', minHeight: '1.5rem' }}>
          {!micActive
            ? 'Enable the microphone to tune by ear'
            : pitch === -1
              ? 'Pluck a string'
              : `${Math.abs(cents)} cents ${cents > 0 ? 'sharp' : 'flat'}`}
        </div>

        <hr style={{ width: '100%', border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
        
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)' }}>Reference Tones</h3>
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          {tuning === 'GDG' ? (
            <>
              <button 
                className={`primary ${playingTone === 'Low G' ? 'playing' : ''}`}
                onMouseDown={() => playTone(98.00, 'Low G')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(98.00, 'Low G')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Low G' ? 1 : 0.8 }}
              >
                Low G
              </button>
              <button 
                className={`primary ${playingTone === 'Middle D' ? 'playing' : ''}`}
                onMouseDown={() => playTone(146.83, 'Middle D')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(146.83, 'Middle D')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Middle D' ? 1 : 0.8 }}
              >
                Mid D
              </button>
              <button 
                className={`primary ${playingTone === 'High G' ? 'playing' : ''}`}
                onMouseDown={() => playTone(196.00, 'High G')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(196.00, 'High G')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'High G' ? 1 : 0.8 }}
              >
                High G
              </button>
            </>
          ) : tuning === 'DAD' ? (
            <>
              <button 
                className={`primary ${playingTone === 'Low D' ? 'playing' : ''}`}
                onMouseDown={() => playTone(146.83, 'Low D')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(146.83, 'Low D')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Low D' ? 1 : 0.8 }}
              >
                Low D
              </button>
              <button 
                className={`primary ${playingTone === 'Middle A' ? 'playing' : ''}`}
                onMouseDown={() => playTone(220.00, 'Middle A')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(220.00, 'Middle A')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Middle A' ? 1 : 0.8 }}
              >
                Mid A
              </button>
              <button 
                className={`primary ${playingTone === 'High D' ? 'playing' : ''}`}
                onMouseDown={() => playTone(293.66, 'High D')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(293.66, 'High D')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'High D' ? 1 : 0.8 }}
              >
                High D
              </button>
            </>
          ) : tuning === 'EBE' ? (
            <>
              <button 
                className={`primary ${playingTone === 'Low E' ? 'playing' : ''}`}
                onMouseDown={() => playTone(164.81, 'Low E')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(164.81, 'Low E')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Low E' ? 1 : 0.8 }}
              >
                Low E
              </button>
              <button 
                className={`primary ${playingTone === 'Middle B' ? 'playing' : ''}`}
                onMouseDown={() => playTone(246.94, 'Middle B')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(246.94, 'Middle B')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Middle B' ? 1 : 0.8 }}
              >
                Mid B
              </button>
              <button 
                className={`primary ${playingTone === 'High E' ? 'playing' : ''}`}
                onMouseDown={() => playTone(329.63, 'High E')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(329.63, 'High E')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'High E' ? 1 : 0.8 }}
              >
                High E
              </button>
            </>
          ) : tuning === 'AEA' ? (
            <>
              <button 
                className={`primary ${playingTone === 'Low A' ? 'playing' : ''}`}
                onMouseDown={() => playTone(110.00, 'Low A')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(110.00, 'Low A')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Low A' ? 1 : 0.8 }}
              >
                Low A
              </button>
              <button 
                className={`primary ${playingTone === 'Middle E' ? 'playing' : ''}`}
                onMouseDown={() => playTone(164.81, 'Middle E')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(164.81, 'Middle E')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Middle E' ? 1 : 0.8 }}
              >
                Mid E
              </button>
              <button 
                className={`primary ${playingTone === 'High A' ? 'playing' : ''}`}
                onMouseDown={() => playTone(220.00, 'High A')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(220.00, 'High A')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'High A' ? 1 : 0.8 }}
              >
                High A
              </button>
            </>
          ) : (
            <>
              <button 
                className={`primary ${playingTone === 'Low C' ? 'playing' : ''}`}
                onMouseDown={() => playTone(130.81, 'Low C')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(130.81, 'Low C')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Low C' ? 1 : 0.8 }}
              >
                Low C
              </button>
              <button 
                className={`primary ${playingTone === 'Middle G' ? 'playing' : ''}`}
                onMouseDown={() => playTone(196.00, 'Middle G')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(196.00, 'Middle G')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'Middle G' ? 1 : 0.8 }}
              >
                Mid G
              </button>
              <button 
                className={`primary ${playingTone === 'High C' ? 'playing' : ''}`}
                onMouseDown={() => playTone(261.63, 'High C')}
                onMouseUp={stopTone}
                onMouseLeave={stopTone}
                onTouchStart={() => playTone(261.63, 'High C')}
                onTouchEnd={stopTone}
                style={{ flex: 1, padding: '0.75rem', opacity: playingTone === 'High C' ? 1 : 0.8 }}
              >
                High C
              </button>
            </>
          )}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Press and hold to play</p>
      </div>
    </Modal>
  );
};
