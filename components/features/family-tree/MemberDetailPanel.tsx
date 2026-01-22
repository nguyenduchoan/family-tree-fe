"use client";

import { X, User, Calendar, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FamilyMember } from "@/types";

interface MemberDetailPanelProps {
    member: FamilyMember | null;
    isOpen: boolean;
    onClose: () => void;
}

export function MemberDetailPanel({ member, isOpen, onClose }: MemberDetailPanelProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transition-transform duration-300 transform",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-serif font-bold text-gray-800">Thông tin chi tiết</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {member && (
                            <>
                                {/* Avatar & Basic Info */}
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 border-4 border-white shadow-lg">
                                        <User className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                                    {member.nickname && <p className="text-blue-600 font-medium">({member.nickname})</p>}
                                </div>

                                {/* Details List */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Ngày sinh</p>
                                            <p className="font-medium text-gray-900">{member.birthDate || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Địa chỉ / Quê quán</p>
                                            <p className="font-medium text-gray-900">{member.address || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>

                                    {/* TODO: Fetch spouse detail from ID or populate data */}
                                    {/* {member.spouses && member.spouses.length > 0 && (
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-pink-50 border border-pink-100">
                                            <Heart className="w-5 h-5 text-pink-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-pink-500">Vợ / Chồng</p>
                                                <p className="font-medium text-gray-900">{member.spouses[0]}</p> 
                                            </div>
                                        </div>
                                    )} */}
                                </div>

                                {/* Bio */}
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Tiểu sử</h4>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        Chưa có thông tin tiểu sử của thành viên này.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t bg-gray-50">
                        <button className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-blue-700 transition-colors">
                            Chỉnh sửa thông tin
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
