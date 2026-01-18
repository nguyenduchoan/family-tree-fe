import { useState } from 'react';
import { UserPlus, Settings } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../../store/useStore';
// import AddMemberModal from '../Member/AddMemberModal'; // Moved to Global

const IconButton = ({
    icon: Icon,
    onClick,
    className,
    title
}: {
    icon: any,
    onClick?: () => void,
    className?: string,
    title?: string
}) => {
    return (
        <button
            onClick={onClick}
            title={title}
            className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 active:scale-95",
                className
            )}
        >
            <Icon size={20} />
        </button>
    );
};

export default function Toolbar() {
    const { currentFamily, openAddMemberModal } = useStore();

    const handleAddMemberClick = () => {
        if (!currentFamily) {
            alert("Vui lòng chọn một gia phả trước!");
            return;
        }
        openAddMemberModal();
    };

    return (
        <>
            <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
                <IconButton
                    icon={UserPlus}
                    className="bg-primary text-white hover:bg-emerald-600 border border-transparent"
                    title="Thêm thành viên"
                    onClick={handleAddMemberClick}
                />
                <IconButton
                    icon={Settings}
                    className="bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                    title="Cài đặt"
                    onClick={() => alert("Tính năng Cài Đặt sẽ sớm ra mắt!")}
                />
            </div>


        </>
    );
}
