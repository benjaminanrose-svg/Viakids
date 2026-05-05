import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, CameraOff } from 'lucide-react'

export default function QrScanner({ onScan }) {
  const scannerRef = useRef(null)
  const [error, setError] = useState(null)
  const [manualCode, setManualCode] = useState('')

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader-container')
    scannerRef.current = scanner

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        onScan(decodedText)
      },
      () => {}
    ).catch((err) => {
      setError('No se pudo acceder a la cámara. Ingresa el código manualmente.')
      console.error('QR camera error:', err)
    })

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const handleManual = (e) => {
    e.preventDefault()
    if (manualCode.trim()) {
      onScan(manualCode.trim())
      setManualCode('')
    }
  }

  return (
    <div className="space-y-3">
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <CameraOff size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Camera size={14} className="text-green-600" />
          <span>Apunta al código QR del estudiante</span>
        </div>
      )}

      <div id="qr-reader-container" className="w-full rounded-lg overflow-hidden" />

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400 mb-2">O ingresa el código manualmente:</p>
        <form onSubmit={handleManual} className="flex gap-2">
          <input
            className="input-field flex-1 text-sm"
            placeholder="Ej: QR-SOFIA-001"
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
          />
          <button type="submit" className="btn-primary text-sm px-3">OK</button>
        </form>
      </div>
    </div>
  )
}
