import { useAuthentication } from "../../utils/authentication/auth";


const Profile = () => {
    const { isAuthorized, logout } = useAuthentication
    console.log("Profile")

    return (
        <div id="index-root" className="h-screen bg-red-500">
            <button>

            </button>

        </div>

    )

}

export default Profile;