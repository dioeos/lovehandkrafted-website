import { useState } from "react";
import Topbar from "../../components/Topbar/Topbar";
import api from "../../utils/lib/api";

const VendorNewsletter = () => {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        console.log("Sending newsletter")

        try {
            const response = await api.post("/newsletter/send/", {
                subject: subject.trim(),
                content: content.trim(),
            })
            console.log(response)

            if (response.status === 200) {
                console.log("sent newsletter")
            }
        } catch (error) {
            console.log("error")
        } finally {
            setLoading(false);
        }

    }
    return (
        <div id="vendor-newsletter-root" className="rounded-lg shadow h-full">
            <Topbar/>


            <div className="flex items-center justify-center">
                <div className="bg-white p-8 shadow-lg rounded-lg w-96">
                    <h2 className="text-2xl font-semibold text-center mb-1">
                        Send newsletter
                    </h2>
                    <p className="font-light text-center mb-4">?</p>

                    {error && <div className="text-red-600 text-sm text-center mb-2">{error}</div>}
                    {success && <div className="text-green-600 text-sm text-center mb-2">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="subject" className="block text-gray-700 font-medium">Subject:</label>
                            <input
                                type="subject" 
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                            </input>

                            <label htmlFor="content" className="block text-gray-700 font-medium">Content:</label>
                            <input
                                type="content" 
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                            </input>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            {loading ? "Processing..." : "Submit"}
                        </button>

                    </form>

                </div>

            </div>
        </div>

    )
}
export default VendorNewsletter;