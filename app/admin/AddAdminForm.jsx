import {useState} from "react";
import {AddAdmin} from "@/actions/add-admin";
import {Button} from "ra-ui-materialui";
import {useAlert} from "@/components/alert-context";

const AddAdminModal = ({isOpen, onClose}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
    const {showAlert} = useAlert();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Creating admin user:', {email, password, firstName, lastName, username});
        setIsCreatingAdmin(true);
        try {
            const result = await AddAdmin(email, password, username, firstName, lastName);
            if (result.status === 201) {
                showAlert({
                    message: `New admin user created successfully with email ${email}`, severity: "success",
                });
                setEmail('');
                setPassword('');
                setFirstName('');
                setLastName('');
                setUsername('');
                onClose();
            } else {
                showAlert({
                    message: result.message ?? "Failed to create admin user", severity: "error",
                });
                console.error('Error creating admin user:', result.message);
                // setEmail('');
                // setPassword('');
                // setFirstName('');
                // setLastName('');
                // setUsername('');
                // onClose();
            }
        } finally {
            setIsCreatingAdmin(false);
        }
    };

    if (!isOpen) return null;

    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                 style={{zIndex: 9999}}>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
                aria-label="Close modal"
            >
                ✕
            </button>
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
                Create Admin User
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isCreatingAdmin}
                    className={`w-full py-2 rounded-lg text-white font-semibold ${isCreatingAdmin ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {isCreatingAdmin ? 'Creating Admin...' : 'Create Admin User'}
                </Button>
            </form>
        </div>
    </div>);
};

export default AddAdminModal;
