import Link from "next/link";
import { ArrowRight } from 'lucide-react';

export default function CustomLink({ href, children }) {
    return (
        <Link
            href={href}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-300"
        >
            <span className="border-b-2 border-transparent group-hover:border-indigo-600 transition-all duration-300">
                {children}
            </span>
            <ArrowRight className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
    );
}
