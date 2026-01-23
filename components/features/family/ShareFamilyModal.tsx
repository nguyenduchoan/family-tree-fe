import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { familyApi } from '@/api/family';
import { Copy, Check, Loader2, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ShareFamilyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareFamilyModal({ isOpen, onClose }: ShareFamilyModalProps) {
    const { currentFamily } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleGenerateLink = async () => {
        if (!currentFamily) return;
        setIsLoading(true);
        try {
            const token = await familyApi.generateShareToken(currentFamily.id);
            const link = `${window.location.origin}/share/${token}`;
            setShareLink(link);
        } catch (error) {
            toast.error('Không thể tạo link chia sẻ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (shareLink) {
            navigator.clipboard.writeText(shareLink);
            setIsCopied(true);
            toast.success('Đã sao chép link!');
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Chia sẻ Gia phả
                    </DialogTitle>
                    <DialogDescription>
                        Tạo đường dẫn công khai để chia sẻ cây gia phả này với người thân.
                        Người nhận có thể xem nhưng không thể chỉnh sửa.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {!shareLink ? (
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-slate-50">
                            <Button onClick={handleGenerateLink} disabled={isLoading} className="w-full sm:w-auto">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tạo link...
                                    </>
                                ) : (
                                    'Tạo Link Chia sẻ (30 ngày)'
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Đường dẫn chia sẻ:</label>
                            <div className="flex items-center gap-2">
                                <Input readOnly value={shareLink} className="flex-1 bg-slate-50" />
                                <Button size="icon" variant="outline" onClick={handleCopy}>
                                    {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Link này sẽ hết hạn sau 30 ngày. Bất kỳ ai có link đều có thể xem gia phả.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button variant="secondary" onClick={onClose}>
                        Đóng
                    </Button>
                    {shareLink && (
                        <Button variant="ghost" className="text-sm text-blue-600 ml-auto" onClick={() => setShareLink(null)}>
                            Tạo link mới
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
