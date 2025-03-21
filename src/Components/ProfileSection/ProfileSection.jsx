export const ProfileSection = ({ navigate }) => {

    const userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : null;   
    console.log(userData);

    return (
        <section onClick={() => navigate("/user-profile-config")} className="flex items-center">
            <img src="/profile.jpg" alt="Profile" className="w-18 h-18 rounded-full border-1 border-gray-300" />
            <div className="ml-4">
                <h2 className="text-lg font-semibold">{userData.name}</h2>
                <p className="text-gray-500 text-sm">Dueño</p>
            </div>
        </section>
    );
};
