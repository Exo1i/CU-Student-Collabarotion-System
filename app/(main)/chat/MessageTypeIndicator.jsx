import {AlertCircle, Bell, FileText, MessageCircle, RefreshCw} from 'lucide-react'

const MessageTypeIndicator = ({type}) => {
    const getTypeInfo = () => {
        switch (type) {
            case 'announcement':
                return {icon: Bell, label: 'Announcement', color: 'text-blue-500'};
            case 'message':
                return {icon: MessageCircle, label: 'Message', color: 'text-green-500'};
            case 'update':
                return {icon: RefreshCw, label: 'Update', color: 'text-yellow-500'};
            case 'alert':
                return {icon: AlertCircle, label: 'Alert', color: 'text-red-500'};
            case 'resource':
                return {icon: FileText, label: 'Resource', color: 'text-purple-500'};
            default:
                return {icon: MessageCircle, label: 'Message', color: 'text-gray-500'};
        }
    };

    const {icon: Icon, label, color} = getTypeInfo();

    return (<div className={`flex items-center ${color} text-xs font-medium`}>
        <Icon className="h-4 w-4 mr-1" />
        <div>{label}</div>
    </div>);
};

export default MessageTypeIndicator;
