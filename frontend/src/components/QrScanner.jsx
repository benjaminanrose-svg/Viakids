import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function QrScanner({ onScan, onError }) {
  const scannerRef = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
      false
    )
    scannerRef.current = scanner

    scanner.render(
      (decodedText) => {
        onScan(decodedText)
      },
      (errorMessage) => {
        // Suppress continuous scan-not-found errors
        if (onError && !errorMessage.includes('No MultiFormat Readers')) {
          onError(errorMessage)
        }
      }
    )
    setStarted(true)

    return () => {
      scanner.clear().catch(() => {})
    }
  }, [])

  return (
    <div>
      <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />
      {!started && (
        <p className="text-sm text-gray-400 text-center mt-2">Iniciando cámara...</p>
      )}
    </div>
  )
}
