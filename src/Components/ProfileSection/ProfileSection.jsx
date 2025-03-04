export const ProfileSection = ({ navigate }) => {
    return (
        <section onClick={() => navigate("/user-profile-config")} className="flex flex-col items-center p-6">
            <img src="/profile.jpg" alt="Profile" className="w-16 h-16 rounded-full border-2 border-gray-300" />
            <h2 className="mt-2 text-lg font-semibold">Andrew Ainsley</h2>
            <p className="text-gray-500 text-sm">Dueño</p>
        </section>
    );
};

