import { useRef, useImperativeHandle, forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser } from 'lucide-react';

export interface SignaturePadRef {
    clear: () => void;
    isEmpty: () => boolean;
    toDataURL: () => string;
}

interface SignaturePadProps {
    className?: string;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(({ className }, ref) => {
    const sigCanvas = useRef<SignatureCanvas>(null);

    useImperativeHandle(ref, () => ({
        clear: () => sigCanvas.current?.clear(),
        isEmpty: () => sigCanvas.current?.isEmpty() || false,
        toDataURL: () => sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png') || '',
    }));

    return (
        <div className={`border rounded-lg bg-white overflow-hidden ${className}`}>
            <SignatureCanvas
                ref={sigCanvas as any}
                canvasProps={{
                    className: 'w-full h-40 bg-white touch-none'
                }}
            />
            <div className="border-t p-2 flex justify-end">
                <button
                    type="button"
                    onClick={() => sigCanvas.current?.clear()}
                    className="flex items-center gap-1 text-destructive hover:bg-destructive/10 text-xs px-2 py-1 rounded transition-colors"
                >
                    <Eraser size={14} />
                    Löschen
                </button>
            </div>
        </div>
    );
});

SignaturePad.displayName = "SignaturePad";
