import { FaUser, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
    id: number;
    name: string;
    profile?: string;
    createdAt: string;
}

const UserCard = ({ id, name, profile, createdAt }: UserCardProps) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/users/${id}`)}
            className="bg-[var(--bg-secondary)] rounded-lg p-4 shadow-lg 
                     hover:shadow-purple-500/10 transition-all duration-300 
                     hover:-translate-y-1 w-full"
        >
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden 
                              bg-purple-500/20 flex-shrink-0">
                    {profile ? (
                        <img 
                            src={`http://localhost:3000/assets/${profile}`}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FaUser className="text-purple-400 text-2xl" />
                        </div>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-white mb-1 truncate">
                        {name}
                    </h2>
                    <div className="flex items-center text-sm text-gray-400">
                        <FaCalendar className="mr-2 flex-shrink-0" />
                        <span className="truncate">
                            Joined {new Date(createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;