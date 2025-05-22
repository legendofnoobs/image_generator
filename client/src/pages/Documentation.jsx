import { useNavigate } from "react-router-dom";


const Documentation = () => {
    const navigate = useNavigate(); // Import useNavigate from react-router-dom
    return (
        <div className="relative z-50 text-white mx-auto max-w-5xl p-6">
            <button
                className="px-4 py-2 bg-white/10 backdrop-blur-2xl text-white rounded-full hover:bg-purple-700 mb-5 flex items-center justify-between transition-all duration-300"
                onClick={() => navigate(-1)}
            >
                <span>←</span>
                <span>&nbsp;&nbsp;</span>
                <span>Back</span>
            </button>
            <h1 className="text-5xl font-bold mb-6">How to Use the App</h1>
            <p className="mb-10 text-lg text-gray-300">
                Follow these steps to make the most out of the face generation and editing features in the app.
            </p>

            <ol className="list-decimal list-inside text-lg space-y-6">
                <li>
                    <span className="font-semibold">Create an Account:</span> Click on <strong>Login</strong>. If you don’t have an account, click <strong>Sign Up</strong> to register.
                    <p className="pl-6 text-gray-300 mt-2">
                        Once your account is created, you can generate, upload, and edit faces.
                    </p>
                </li>

                <li>
                    <span className="font-semibold">Generate a Face:</span> Click the <strong>Generate</strong> button, enter a description of the face, and then click <strong>Generate</strong>.
                </li>

                <li>
                    <span className="font-semibold">After Generation:</span> Once the face is generated, you can choose to:
                    <ul className="list-disc list-inside pl-6 mt-2 text-gray-300 space-y-1">
                        <li>Generate another face</li>
                        <li>Save the face online</li>
                        <li>Edit the face</li>
                        <li>Download the face</li>
                    </ul>
                </li>

                <li>
                    <span className="font-semibold">Editing a Face:</span> If you enter the Edit page right after generating a face, the image will be ready for editing.
                    <p className="pl-6 text-gray-300 mt-2">
                        If you enter from the home screen, you&apos;ll need to upload an image first.
                    </p>
                </li>

                <li>
                    <span className="font-semibold">How to Edit:</span> Use the mask tool to highlight areas on the image you want to modify and describe the changes you’d like to make.
                    <p className="pl-6 text-gray-300 mt-2">
                        The mask guides the AI to focus only on the selected region based on your instructions.
                    </p>
                </li>

                <li>
                    <span className="font-semibold">Finalizing Edits:</span> Once the changes are generated, the updated image will replace the original and can be further edited if needed.
                </li>
            </ol>
        </div>
    );
};

export default Documentation;
