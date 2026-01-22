import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/20 bg-white/50 backdrop-blur-md py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Family Tree Pro. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600">
                        <Link href="#" className="hover:text-primary transition-colors">
                            Điều khoản
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            Bảo mật
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            Liên hệ
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
